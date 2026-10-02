import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../entrypoints/popup/App';

describe('Popup App Component (REPT-01, REPT-02)', () => {
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

  it('renders fill telemetry report dashboard when Fill Form completes (REPT-01, REPT-02)', async () => {
    render(<App />);

    const fillButton = screen.getByTestId('fill-button');
    fireEvent.click(fillButton);

    const dashboard = await screen.findByTestId('report-dashboard');
    expect(dashboard).toBeInTheDocument();

    const filledMetric = screen.getByTestId('metric-filled');
    const skippedMetric = screen.getByTestId('metric-skipped');
    const unmatchedMetric = screen.getByTestId('metric-unmatched');

    expect(filledMetric).toHaveTextContent('18');
    expect(skippedMetric).toHaveTextContent('3');
    expect(unmatchedMetric).toHaveTextContent('2');

    const unmatchedAccordion = screen.getByTestId('unmatched-accordion');
    expect(unmatchedAccordion).toBeInTheDocument();
    expect(unmatchedAccordion).toHaveTextContent('Passport Number');

    const resetBtn = screen.getByTestId('reset-report-btn');
    fireEvent.click(resetBtn);

    expect(screen.getByTestId('fill-button')).toBeInTheDocument();
  });

  it('triggers chrome.runtime.openOptionsPage when Open Profile is clicked (D-01)', () => {
    render(<App />);

    const openProfileBtn = screen.getByTestId('open-profile-btn');
    fireEvent.click(openProfileBtn);

    expect(chrome.runtime.openOptionsPage).toHaveBeenCalled();
  });
});
