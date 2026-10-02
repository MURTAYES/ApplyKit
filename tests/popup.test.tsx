import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../entrypoints/popup/App';

describe('Popup App Component', () => {
  it('renders fill form button and open profile link (D-01, D-02)', () => {
    render(<App />);

    const fillButton = screen.getByTestId('fill-button');
    expect(fillButton).toBeInTheDocument();
    expect(fillButton).toHaveTextContent(/Fill Form/i);

    const openProfileBtn = screen.getByTestId('open-profile-btn');
    expect(openProfileBtn).toBeInTheDocument();
    expect(openProfileBtn).toHaveTextContent(/Open Profile/i);
  });

  it('does not display profile completeness indicators or percentage badges (D-06)', () => {
    render(<App />);

    expect(screen.queryByText(/%/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/complete/i)).not.toBeInTheDocument();
  });

  it('shows fill feedback message when Fill Form is clicked (FILL-01)', () => {
    render(<App />);

    const fillButton = screen.getByTestId('fill-button');
    fireEvent.click(fillButton);

    const toast = screen.getByTestId('toast-banner');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/FILL/i);
  });

  it('triggers chrome.runtime.openOptionsPage when Open Profile is clicked (D-01)', () => {
    render(<App />);

    const openProfileBtn = screen.getByTestId('open-profile-btn');
    fireEvent.click(openProfileBtn);

    expect(chrome.runtime.openOptionsPage).toHaveBeenCalled();
  });
});
