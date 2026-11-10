import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import EventPostForm from '../EventPostForm';
import { supabase, _mockUpsert } from '@/lib/supabaseClient';

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

describe('EventPostForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    queryClient.clear();
    mockOnSuccess.mockClear();
    _mockUpsert.mockClear();
  });

  it('renders correctly for add mode', () => {
    renderWithClient(<EventPostForm onSuccess={mockOnSuccess} />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subtitle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Order/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Event Post/i })).toBeInTheDocument();
  });

  it('renders correctly for edit mode with pre-filled data', () => {
    const mockPost = { id: '1', title: 'Edit Title', subtitle: 'Edit Sub', content: 'Edit Content', created_at: '' };
    renderWithClient(<EventPostForm eventPost={mockPost} onSuccess={mockOnSuccess} />);
    expect(screen.getByDisplayValue('Edit Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Sub')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Content')).toBeInTheDocument();
  });

  it('displays validation errors', async () => {
    renderWithClient(<EventPostForm onSuccess={mockOnSuccess} />);
    await userEvent.click(screen.getByRole('button', { name: /Save Event Post/i }));
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Content is required')).toBeInTheDocument();
  });

  it('handles form submission (add mode)', async () => {
    _mockUpsert.mockReturnValueOnce({
      select: vi.fn(() => Promise.resolve({ data: [{}], error: null })),
    });
    renderWithClient(<EventPostForm onSuccess={mockOnSuccess} />);

    await userEvent.type(screen.getByLabelText(/Title/i), 'New Post Title');
    await userEvent.type(screen.getByLabelText(/Content/i), 'New Post Content');
    await userEvent.click(screen.getByRole('button', { name: /Save Event Post/i }));

    await waitFor(() => expect(_mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Post Title',
      content: 'New Post Content',
    })));
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('handles form submission (edit mode)', async () => {
    const mockPost = { id: '1', title: 'Original Title', subtitle: 'Original Sub', content: 'Original Content', created_at: '' };
    _mockUpsert.mockReturnValueOnce({
      select: vi.fn(() => Promise.resolve({ data: [{}], error: null })),
    });
    renderWithClient(<EventPostForm eventPost={mockPost} onSuccess={mockOnSuccess} />);

    await userEvent.type(screen.getByLabelText(/Title/i), ' Updated');
    await userEvent.click(screen.getByRole('button', { name: /Save Event Post/i }));

    await waitFor(() => expect(_mockUpsert).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      title: 'Original Title Updated',
    })));
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
