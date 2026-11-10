import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import UrbanInterventionsPage from '../UrbanInterventionsPage';
import UrbanInterventionForm from '../UrbanInterventionForm';
import { supabase } from '@/lib/supabaseClient';

vi.mock('@/lib/supabaseClient', () => {
  const mockSelectOrder = vi.fn(() => Promise.resolve({ data: [], error: null }));
  const mockSelect = vi.fn(() => ({ order: mockSelectOrder }));

  const mockEq = vi.fn(() => Promise.resolve({ data: [], error: null }));
  const mockDelete = vi.fn(() => ({ eq: mockEq }));

  const mockUpsertSelect = vi.fn(() => Promise.resolve({ data: [], error: null }));
  const mockUpsert = vi.fn(() => ({ select: mockUpsertSelect }));

  const mockFrom = vi.fn((tableName) => ({
    select: mockSelect,
    delete: mockDelete,
    upsert: mockUpsert,
  }));

  const mockUpload = vi.fn(() => Promise.resolve({ data: { path: 'mock/path/image.jpg' }, error: null }));
  const mockGetPublicUrl = vi.fn(() => ({ data: { publicUrl: 'http://mock.url/image.jpg' } }));
  const mockStorageFrom = vi.fn((bucketName) => ({
    upload: mockUpload,
    getPublicUrl: mockGetPublicUrl,
  }));

  return {
    supabase: {
      from: mockFrom,
      storage: {
        from: mockStorageFrom,
      },
    },
    // Export the individual mocks for spying
    _mockSelectOrder: mockSelectOrder,
    _mockSelect: mockSelect,
    _mockEq: mockEq,
    _mockDelete: mockDelete,
    _mockUpsertSelect: mockUpsertSelect,
    _mockUpsert: mockUpsert,
    _mockFrom: mockFrom,
    _mockUpload: mockUpload,
    _mockGetPublicUrl: mockGetPublicUrl,
    _mockStorageFrom: mockStorageFrom,
  };
});

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

describe('UrbanInterventionsPage', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('renders loading state', () => {
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => new Promise(() => {})), // Pending promise to simulate loading
      })),
    } as any);
    renderWithClient(<UrbanInterventionsPage />);
    expect(screen.getByText('Loading urban interventions...')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: null,
          error: new Error('Failed to fetch'),
        })),
      })),
    } as any);
    renderWithClient(<UrbanInterventionsPage />);
    expect(await screen.findByText(/Error loading urban interventions/i)).toBeInTheDocument();
  });

  it('renders no urban interventions message', async () => {
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    } as any);
    renderWithClient(<UrbanInterventionsPage />);
    expect(await screen.findByText('No urban interventions found. Add a new one!')).toBeInTheDocument();
  });

  it('renders list of urban interventions', async () => {
    const mockInterventions = [
      { id: '1', title: 'Test 1', date: 'Jan 1', image_url: 'url1', created_at: '' },
      { id: '2', title: 'Test 2', date: 'Jan 2', image_url: 'url2', created_at: '' },
    ];
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: mockInterventions,
          error: null,
        })),
      })),
    } as any);
    renderWithClient(<UrbanInterventionsPage />);
    expect(await screen.findByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('Add New button opens form', async () => {
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    } as any);
    renderWithClient(<UrbanInterventionsPage />);
    await userEvent.click(screen.getByRole('button', { name: /Add New Urban Intervention/i }));
    expect(screen.getByRole('heading', { name: /Add New Urban Intervention/i })).toBeInTheDocument(); // Dialog title
  });

  it('Edit button opens form with pre-filled data', async () => {
    const mockInterventions = [
      { id: '1', title: 'Test Edit', date: 'Feb 1', image_url: 'url_edit', created_at: '' },
    ];
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: mockInterventions,
          error: null,
        })),
      })),
    } as any);
    renderWithClient(<UrbanInterventionsPage />);
    await userEvent.click(await screen.findByRole('button', { name: /Edit/i }));
    expect(screen.getByText('Edit Urban Intervention')).toBeInTheDocument(); // Dialog title
    expect(screen.getByDisplayValue('Test Edit')).toBeInTheDocument();
  });

  it('Delete button triggers confirmation and deletion', async () => {
    const mockInterventions = [
      { id: '1', title: 'Test Delete', date: 'Mar 1', image_url: 'url_delete', created_at: '' },
    ];
    vi.spyOn(supabase, 'from').mockReturnValueOnce({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: mockInterventions,
          error: null,
        })),
      })),
    } as any);

    window.confirm = vi.fn(() => true); // Mock window.confirm to return true

    renderWithClient(<UrbanInterventionsPage />);
    await userEvent.click(await screen.findByRole('button', { name: /Delete/i }));

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this urban intervention?');
    await waitFor(() => expect(supabase._mockEq).toHaveBeenCalledWith({ id: '1' })); // Assert on the eq method of the mock
  });
});

describe('UrbanInterventionForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    queryClient.clear();
    mockOnSuccess.mockClear();
  });

  it('renders correctly for add mode', () => {
    renderWithClient(<UrbanInterventionForm onSuccess={mockOnSuccess} />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Urban Intervention/i })).toBeInTheDocument();
  });

  it('renders correctly for edit mode with pre-filled data', () => {
    const mockIntervention = { id: '1', title: 'Edit Title', date: 'Edit Date', image_url: 'edit_url', description: 'Edit Desc', order: 1, created_at: '' };
    renderWithClient(<UrbanInterventionForm urbanIntervention={mockIntervention} onSuccess={mockOnSuccess} />);
    expect(screen.getByDisplayValue('Edit Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Date')).toBeInTheDocument();
    expect(screen.getByAltText('Current Urban Intervention Image')).toBeInTheDocument();
  });

  it('displays validation errors', async () => {
    renderWithClient(<UrbanInterventionForm onSuccess={mockOnSuccess} />);
    await userEvent.click(screen.getByRole('button', { name: /Save Urban Intervention/i }));
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Date is required')).toBeInTheDocument();
  });

  it('handles form submission (add mode)', async () => {

    renderWithClient(<UrbanInterventionForm onSuccess={mockOnSuccess} />);

    await userEvent.type(screen.getByLabelText(/Title/i), 'New Title');
    await userEvent.type(screen.getByLabelText(/Date/i), '2025-01-01');
    await userEvent.click(screen.getByRole('button', { name: /Save Urban Intervention/i }));

    await waitFor(() => expect(supabase._mockUpsert).toHaveBeenCalledWith({
      id: undefined,
      title: 'New Title',
      date: '2025-01-01',
      image_url: null,
      description: '',
      order: undefined,
    }));
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('handles form submission (edit mode)', async () => {
    const mockIntervention = { id: '1', title: 'Edit Title', date: 'Edit Date', image_url: 'edit_url', description: 'Edit Desc', order: 1, created_at: '' };

    renderWithClient(<UrbanInterventionForm urbanIntervention={mockIntervention} onSuccess={mockOnSuccess} />);

    await userEvent.type(screen.getByLabelText(/Title/i), ' Updated');
    await userEvent.click(screen.getByRole('button', { name: /Save Urban Intervention/i }));

    await waitFor(() => expect(supabase._mockUpsert).toHaveBeenCalledWith({
      id: '1',
      title: 'Edit Title Updated',
      date: 'Edit Date',
      image_url: 'edit_url',
      description: 'Edit Desc',
      order: 1,
    }));
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('handles image upload', async () => {


    renderWithClient(<UrbanInterventionForm onSuccess={mockOnSuccess} />);

    const file = new File(['hello'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Image/i);
    await userEvent.upload(input, file);

    await userEvent.type(screen.getByLabelText(/Title/i), 'Image Test');
    await userEvent.type(screen.getByLabelText(/Date/i), '2025-02-02');
    await userEvent.click(screen.getByRole('button', { name: /Save Urban Intervention/i }));

    await waitFor(() => expect(_mockUpload).toHaveBeenCalledWith(expect.stringContaining('urban_intervention_images/'), file, { cacheControl: '3600', upsert: false }));
    await waitFor(() => expect(_mockUpsert).toHaveBeenCalledWith(expect.objectContaining({ image_url: 'http://mock.url/image.jpg' })));
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});