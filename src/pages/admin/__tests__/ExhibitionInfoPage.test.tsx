import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import ExhibitionInfoPage from '../ExhibitionInfoPage';
import { supabase, _mockUpsert, _mockSelect } from '@/lib/supabaseClient'; // Import necessary mocks

// Mock useToast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('ExhibitionInfoPage', () => {
  beforeEach(() => {
    queryClient.clear();
    _mockSelect.mockClear(); // Clear mocks before each test
    _mockUpsert.mockClear();
  });

  it('renders loading state', () => {
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => new Promise(() => {})), // Pending promise to simulate loading
    });
    renderWithClient(<ExhibitionInfoPage />);
    expect(screen.getByText('Loading exhibition info...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: null, error: new Error('Failed to fetch') })),
    });
    renderWithClient(<ExhibitionInfoPage />);
    expect(await screen.findByText(/Error loading exhibition info/i)).toBeInTheDocument();
  });

  it('renders form with existing data', async () => {
    const mockExhibitionInfo = [{
      last_exhibition: 'Old Last',
      next_exhibition: 'Old Next',
      next_exhibition_date: 'Old Date',
      next_exhibition_address: 'Old Address',
    }];
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: mockExhibitionInfo, error: null })),
    });
    renderWithClient(<ExhibitionInfoPage />);
    expect(await screen.findByDisplayValue('Old Last')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Old Next')).toBeInTheDocument();
  });

  it('handles form submission and updates data', async () => {
    const mockExhibitionInfo = [{
      last_exhibition: 'Old Last',
      next_exhibition: 'Old Next',
      next_exhibition_date: 'Old Date',
      next_exhibition_address: 'Old Address',
    }];
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: mockExhibitionInfo, error: null })),
    });
    _mockUpsert.mockReturnValueOnce({
      select: vi.fn(() => Promise.resolve({ data: [{}], error: null })),
    });

    renderWithClient(<ExhibitionInfoPage />);

    const user = userEvent.setup();
    await user.clear(await screen.findByLabelText(/Last Exhibition/i));
    await user.type(screen.getByLabelText(/Last Exhibition/i), 'New Last Exhibition');
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => expect(_mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
      last_exhibition: 'New Last Exhibition',
    })));
    expect(screen.getByText('Exhibition info updated successfully.')).toBeInTheDocument();
  });
});
