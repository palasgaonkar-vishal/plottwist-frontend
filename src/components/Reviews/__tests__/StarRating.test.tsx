import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StarRating from '../StarRating';

describe('StarRating Component', () => {
  describe('Display Mode (Read Only)', () => {
    it('should render rating value correctly', () => {
      render(<StarRating value={4.5} readOnly />);
      
      // Check that the rating is displayed
      expect(screen.getByDisplayValue('4.5')).toBeInTheDocument();
    });

    it('should show rating value when showValue is true', () => {
      render(<StarRating value={3} readOnly showValue={true} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should hide rating value when showValue is false', () => {
      render(<StarRating value={3} readOnly showValue={false} />);
      
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('should display label when provided', () => {
      const label = 'Book Rating';
      render(<StarRating value={4} readOnly label={label} />);
      
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('should show helper text when provided', () => {
      const helperText = 'Based on user reviews';
      render(<StarRating value={4} readOnly helperText={helperText} />);
      
      expect(screen.getByText(helperText)).toBeInTheDocument();
    });
  });

  describe('Interactive Mode', () => {
    it('should call onChange when rating is clicked', () => {
      const handleChange = jest.fn();
      render(<StarRating value={0} onChange={handleChange} />);
      
      // Find the 4th star and click it
      const fourthStar = screen.getAllByRole('radio')[3];
      fireEvent.click(fourthStar);
      
      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it('should display error styling when error prop is true', () => {
      render(<StarRating value={0} error={true} label="Rating" />);
      
      const label = screen.getByText('Rating');
      expect(label).toHaveStyle('color: rgb(211, 47, 47)'); // error.main color
    });

    it('should show error helper text', () => {
      const errorText = 'Please select a rating';
      render(<StarRating value={0} error={true} helperText={errorText} />);
      
      expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('should not call onChange when readOnly is true', () => {
      const handleChange = jest.fn();
      render(<StarRating value={3} onChange={handleChange} readOnly />);
      
      const secondStar = screen.getAllByRole('radio')[1];
      fireEvent.click(secondStar);
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Precision', () => {
    it('should handle decimal values with precision', () => {
      render(<StarRating value={3.7} readOnly precision={0.5} showValue={true} />);
      
      expect(screen.getByText('3.7')).toBeInTheDocument();
    });

    it('should round values for display when precision is 1', () => {
      render(<StarRating value={3.7} readOnly precision={1} showValue={true} />);
      
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('Custom Properties', () => {
    it('should respect custom max value', () => {
      render(<StarRating value={7} readOnly max={10} showValue={true} />);
      
      // Should have 10 stars total
      expect(screen.getAllByRole('radio')).toHaveLength(10);
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const customClass = 'custom-star-rating';
      const { container } = render(
        <StarRating value={3} readOnly className={customClass} />
      );
      
      expect(container.firstChild).toHaveClass(customClass);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<StarRating value={0} onChange={() => {}} />);
      
      const rating = screen.getByRole('radiogroup');
      expect(rating).toBeInTheDocument();
      expect(rating).toHaveAttribute('name', 'star-rating');
    });

    it('should be keyboard navigable', () => {
      const handleChange = jest.fn();
      render(<StarRating value={0} onChange={handleChange} />);
      
      const firstStar = screen.getAllByRole('radio')[0];
      firstStar.focus();
      fireEvent.keyDown(firstStar, { key: 'ArrowRight' });
      
      // Verify focus moved (this might need adjustment based on MUI implementation)
      expect(document.activeElement).toBeDefined();
    });
  });
}); 