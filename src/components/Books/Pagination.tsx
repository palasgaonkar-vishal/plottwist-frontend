import React from 'react';
import {
  Box,
  Pagination as MUIPagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [5, 10, 20, 50],
  isLoading = false,
}) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    if (!isLoading) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (event: any) => {
    const newItemsPerPage = event.target.value as number;
    if (onItemsPerPageChange && !isLoading) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  // Calculate the range of items being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        mt: 3,
        py: 2,
      }}
    >
      {/* Items info and per-page selector */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalItems} results
        </Typography>

        {showItemsPerPage && onItemsPerPageChange && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Per Page</InputLabel>
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              label="Per Page"
              disabled={isLoading}
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
          <MUIPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            disabled={isLoading}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                transition: 'all 0.2s ease-in-out',
              },
              '& .MuiPaginationItem-root:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Pagination; 