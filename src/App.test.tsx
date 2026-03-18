import { render, screen } from '@testing-library/react';
import App from './App';

test('renders get started text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Get started/i);
  expect(linkElement).toBeInTheDocument();
});
