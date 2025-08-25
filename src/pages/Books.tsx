import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ViewModule, ViewList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Book, Genre, BookListResponse, BookFilters, ViewMode, BookSearchParams } from '../types/book';
import { booksAPI, genresAPI } from '../services/api';
import SearchBar from '../components/Books/SearchBar';
import BookCard from '../components/Books/BookCard';
import Pagination from '../components/Books/Pagination';
import BreadcrumbsNav from '../components/Breadcrumbs';

const Books: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<BookFilters>({});

  // Load genres on component mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await genresAPI.getGenres();
        setGenres(response.data);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };
    
    loadGenres();
  }, []);

  // Build search parameters
  const buildSearchParams = useCallback((queryOverride?: string, filtersOverride?: BookFilters): BookSearchParams => {
    const effectiveQuery = queryOverride !== undefined ? queryOverride : searchQuery;
    const effectiveFilters = filtersOverride || filters;
    
    const params: BookSearchParams = {
      page: currentPage,
      per_page: itemsPerPage,
    };

    if (effectiveQuery.trim()) {
      params.query = effectiveQuery.trim();
    }

    if (effectiveFilters.genre) {
      params.genre_id = effectiveFilters.genre;
    }

    if (effectiveFilters.minRating) {
      params.min_rating = effectiveFilters.minRating;
    }

    if (effectiveFilters.publishedYearStart) {
      params.published_year_start = effectiveFilters.publishedYearStart;
    }

    return params;
  }, [currentPage, itemsPerPage]);

  // Load books with current search parameters - FIXED: Removed searchQuery and filters dependencies
  const loadBooks = useCallback(async (queryOverride?: string, filtersOverride?: BookFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = buildSearchParams(queryOverride, filtersOverride);
      let response;

      const effectiveQuery = queryOverride !== undefined ? queryOverride : searchQuery;
      const effectiveFilters = filtersOverride || filters;

      // Use search endpoint if there's a query or specific filters, otherwise use list endpoint
      if (effectiveQuery.trim() || effectiveFilters.genre || effectiveFilters.minRating || effectiveFilters.publishedYearStart) {
        response = await booksAPI.searchBooks(params);
      } else {
        response = await booksAPI.getBooks(params);
      }

      const data: BookListResponse = response.data;
      setBooks(data.books);
      setTotalItems(data.total);
      setTotalPages(data.total_pages);
      setCurrentPage(data.page);
    } catch (err: any) {
      console.error('Error loading books:', err);
      setError(err.response?.data?.detail || 'Failed to load books. Please try again.');
      setBooks([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [buildSearchParams]); // Only depend on buildSearchParams, not searchQuery or filters

  // FIXED: Debounced search effect - only triggers API calls after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('🔍 Debounced search triggered for query:', searchQuery);
      loadBooks(searchQuery, filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, loadBooks]);

  // FIXED: Load initial books only when pagination changes, not on every search
  useEffect(() => {
    // Only load initial books on mount or pagination change
    if (searchQuery === '' && Object.keys(filters).length === 0) {
      loadBooks();
    }
  }, [loadBooks, currentPage, itemsPerPage]); // Removed searchQuery and filters dependencies

  // Event handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  }, []);

  const handleFiltersChange = useCallback((newFilters: BookFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleBookClick = (bookId: number) => {
    navigate(`/books/${bookId}`);
  };

  // Retry function for error state
  const handleRetry = () => {
    loadBooks();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <BreadcrumbsNav />
        
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            📚 Browse Books
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover your next favorite read from our extensive collection
          </Typography>
        </Box>

        {/* Search and Filters */}
        <SearchBar
          onSearch={handleSearch}
          onFiltersChange={handleFiltersChange}
          genres={genres}
          isLoading={loading}
          initialFilters={filters}
        />

        {/* View Controls and Results Info */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {!loading && (
              <>
                {totalItems > 0 ? (
                  `Found ${totalItems} book${totalItems === 1 ? '' : 's'}`
                ) : (
                  'No books found'
                )}
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
          >
            <ToggleButton value={ViewMode.GRID} aria-label="grid view">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value={ViewMode.LIST} aria-label="list view">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <button onClick={handleRetry}>
                Retry
              </button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Books Grid/List */}
        {!loading && !error && (
          <>
            {books.length > 0 ? (
              <>
                {viewMode === ViewMode.GRID ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                        xl: 'repeat(5, 1fr)',
                      },
                      gap: 3,
                    }}
                  >
                    {books.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        viewMode={ViewMode.GRID}
                        onViewDetails={handleBookClick}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box>
                    {books.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        viewMode={ViewMode.LIST}
                        onViewDetails={handleBookClick}
                      />
                    ))}
                  </Box>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  isLoading={loading}
                />
              </>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <Typography variant="h5" gutterBottom color="text.secondary">
                  No books found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {searchQuery || Object.keys(filters).length > 0
                    ? 'Try adjusting your search criteria or filters'
                    : 'Books will be displayed here once they are available'}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Books; 