import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../entrypoints/options/App';
import { clearProfile, saveProfile, loadProfile } from '../src/storage/profileStorage';
import { ProfileSchema } from '../src/types/profile';

describe('Options Page App Component', () => {
  beforeEach(async () => {
    await clearProfile();
    // mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders sidebar with all 10 sections (D-03, D-10, PROF-06)', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('nav-sec-basic')).toBeInTheDocument();
    });

    expect(screen.getByTestId('nav-sec-basic')).toHaveTextContent(/Basic Information/i);
    expect(screen.getByTestId('nav-sec-present-addr')).toHaveTextContent(/Present Address/i);
    expect(screen.getByTestId('nav-sec-permanent-addr')).toHaveTextContent(/Permanent Address/i);
    expect(screen.getByTestId('nav-sec-ssc')).toHaveTextContent(/SSC/i);
    expect(screen.getByTestId('nav-sec-hsc')).toHaveTextContent(/HSC/i);
    expect(screen.getByTestId('nav-sec-graduation')).toHaveTextContent(/Graduation/i);
    expect(screen.getByTestId('nav-sec-masters')).toHaveTextContent(/Masters/i);
    expect(screen.getByTestId('nav-sec-experience')).toHaveTextContent(/Job Experience/i);
    expect(screen.getByTestId('nav-sec-qualifications')).toHaveTextContent(/Other Qualifications/i);
    expect(screen.getByTestId('nav-sec-danger')).toHaveTextContent(/Reset Profile/i);
  });

  it('does not render profile completeness indicators or percentage badges (D-06)', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('section-basic')).toBeInTheDocument();
    });

    expect(screen.queryByText(/% complete/i)).not.toBeInTheDocument();
  });

  it('renders distinct English and Bangla name fields in Basic Information (D-11, PROF-05)', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Applicant's Name \(English\)/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/Applicant's Name \(Bangla\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Father's Name \(English\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Father's Name \(Bangla\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mother's Name \(English\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mother's Name \(Bangla\)/i)).toBeInTheDocument();
  });

  it('allows adding and removing job experience rows (D-05)', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('add-experience-btn')).toBeInTheDocument();
    });

    const addBtn = screen.getByTestId('add-experience-btn');
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByTestId('exp-row-0')).toBeInTheDocument();
    });

    const removeBtn = screen.getByText(/✕ Remove/i);
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('exp-row-0')).not.toBeInTheDocument();
    });
  });

  it('updates form fields as user types (D-04, PROF-02)', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Applicant's Name \(English\)/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Applicant's Name \(English\)/i);
    fireEvent.change(nameInput, { target: { value: 'MD. ABDULLAH' } });

    expect((nameInput as HTMLInputElement).value).toBe('MD. ABDULLAH');
  });

  it('wipes all profile data on Delete All Data confirmation (PROF-03)', async () => {
    await saveProfile(
      ProfileSchema.parse({
        basicInfo: { nameEn: 'User To Be Deleted' },
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('delete-all-btn')).toBeInTheDocument();
    });

    // Click Delete All button to reveal confirmation box
    fireEvent.click(screen.getByTestId('delete-all-btn'));

    expect(screen.getByTestId('delete-confirm-box')).toBeInTheDocument();

    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-delete-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('deleted-notice')).toBeInTheDocument();
    });

    const stored = await loadProfile();
    expect(stored.basicInfo.nameEn).toBe('');
  });
});
