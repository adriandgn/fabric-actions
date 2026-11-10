import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import EventPostsPage from '../EventPostsPage';
import { supabase, _mockSelect, _mockDelete, _mockUpsert } from '@/lib/supabaseClient';

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

describe('EventPostsPage', () => {
  beforeEach(() => {
    queryClient.clear();
    _mockSelect.mockClear();
    _mockDelete.mockClear();
    _mockUpsert.mockClear();
  });

  it('renders loading state', () => {
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => new Promise(() => {})), // Pending promise to simulate loading
    });
    renderWithClient(<EventPostsPage />);
    expect(screen.getByText('Loading event posts...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: null, error: new Error('Failed to fetch') })),
    });
    renderWithClient(<EventPostsPage />);
    expect(await screen.findByText(/Error loading event posts/i)).toBeInTheDocument();
  });

  it('renders no event posts message', async () => {
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: [], error: null })),
    });
    renderWithClient(<EventPostsPage />);
    expect(await screen.findByText('No event posts found. Add a new one!')).toBeInTheDocument();
  });

  it('renders list of event posts', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', subtitle: 'Sub 1', content: 'Content 1', created_at: '' },
      { id: '2', title: 'Post 2', subtitle: 'Sub 2', content: 'Content 2', created_at: '' },
    ];
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: mockPosts, error: null })),
    });
    renderWithClient(<EventPostsPage />);
    expect(await screen.findByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('Add New button opens form', async () => {
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: [], error: null })),
    });
    renderWithClient(<EventPostsPage />);
    await userEvent.click(screen.getByRole('button', { name: /Add New Event Post/i }));
    expect(screen.getByRole('heading', { name: /Add New Event Post/i })).toBeInTheDocument();
  });

  it('Edit button opens form with pre-filled data', async () => {
    const mockPosts = [
      { id: '1', title: 'Edit Post', subtitle: 'Edit Sub', content: 'Edit Content', created_at: '' },
    ];
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: mockPosts, error: null })),
    });
    renderWithClient(<EventPostsPage />);
    await userEvent.click(await screen.findByRole('button', { name: /Edit/i }));
    expect(screen.getByRole('heading', { name: /Edit Event Post/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Post')).toBeInTheDocument();
  });

  it('Delete button triggers confirmation and deletion', async () => {
    const mockPosts = [
      { id: '1', title: 'Delete Post', subtitle: 'Del Sub', content: 'Del Content', created_at: '' },
    ];
    _mockSelect.mockReturnValueOnce({
      order: vi.fn(() => Promise.resolve({ data: mockPosts, error: null })),
    });
    _mockDelete.mockReturnValueOnce({
      eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
    });
    window.confirm = vi.fn(() => true);

    renderWithClient(<EventPostsPage />);
    await userEvent.click(await screen.findByRole('button', { name: /Delete/i }));

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this event post?');
    await waitFor(() => expect(_mockDelete).toHaveBeenCalledWith());
  });
});
