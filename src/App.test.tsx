import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PlotTwist title', () => {
  render(<App />);
  const titleElement = screen.getByText(/PlotTwist/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders book review platform subtitle', () => {
  render(<App />);
  const subtitleElement = screen.getByText(/Book Review Platform/i);
  expect(subtitleElement).toBeInTheDocument();
});

test('renders test backend connection button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Test Backend Connection/i);
  expect(buttonElement).toBeInTheDocument();
});
