import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';
import { Search, Clear, FilterList } from '@mui/icons-material';
import { Genre, BookFilters } from '../../types/book';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: BookFilters) => void;
  genres: Genre[];
  isLoading?: boolean;
  placeholder?: string;
  initialQuery?: string;
  initialFilters?: BookFilters;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFiltersChange,
  genres,
  isLoading = false,
  placeholder = "Search books by title or author...",
  initialQuery = '',
  initialFilters = {},
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<BookFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stable callback to prevent unnecessary re-renders
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(searchQuery.trim());
    }, 300);
  }, [onSearch]);

  // Handle search query changes with debouncing
  useEffect(() => {
    debouncedSearch(query);
    
    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, debouncedSearch]);

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setQuery('');
    // Focus the input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleFilterChange = (key: keyof BookFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== null).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search Input */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          ref={inputRef}
          fullWidth
          value={query}
          onChange={handleQueryChange}
          placeholder={placeholder}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                  disabled={isLoading}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          color={activeFiltersCount > 0 ? 'primary' : 'default'}
          disabled={isLoading}
          sx={{
            border: 1,
            borderColor: activeFiltersCount > 0 ? 'primary.main' : 'grey.300',
            borderRadius: 1,
            position: 'relative',
          }}
        >
          <FilterList />
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                minWidth: 20,
                height: 20,
                fontSize: '0.75rem',
              }}
            />
          )}
        </IconButton>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Box
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" color="primary">
              Filters
            </Typography>
            {activeFiltersCount > 0 && (
              <IconButton size="small" onClick={clearFilters}>
                <Clear />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {/* Genre Filter */}
            <FormControl fullWidth size="small">
              <InputLabel>Genre</InputLabel>
              <Select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                label="Genre"
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Minimum Rating Filter */}
            <FormControl fullWidth size="small">
              <InputLabel>Minimum Rating</InputLabel>
              <Select
                value={filters.minRating || ''}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                label="Minimum Rating"
              >
                <MenuItem value="">Any Rating</MenuItem>
                <MenuItem value={4}>4+ Stars</MenuItem>
                <MenuItem value={3}>3+ Stars</MenuItem>
                <MenuItem value={2}>2+ Stars</MenuItem>
                <MenuItem value={1}>1+ Stars</MenuItem>
              </Select>
            </FormControl>

            {/* Publication Year Start */}
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Published After"
              value={filters.publishedYearStart || ''}
              onChange={(e) => handleFilterChange('publishedYearStart', parseInt(e.target.value) || undefined)}
              inputProps={{ min: 1000, max: new Date().getFullYear() }}
            />
          </Box>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.genre && (
                  <Chip
                    label={`Genre: ${genres.find(g => g.id === filters.genre)?.name}`}
                    size="small"
                    onDelete={() => handleFilterChange('genre', undefined)}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.minRating && (
                  <Chip
                    label={`${filters.minRating}+ Stars`}
                    size="small"
                    onDelete={() => handleFilterChange('minRating', undefined)}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.publishedYearStart && (
                  <Chip
                    label={`After ${filters.publishedYearStart}`}
                    size="small"
                    onDelete={() => handleFilterChange('publishedYearStart', undefined)}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar; 