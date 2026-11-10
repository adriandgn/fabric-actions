import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '@/lib/api';
import EventForm from './EventForm';
import ArtworkForm from './ArtworkForm';
import UrbanInterventionForm from './UrbanInterventionForm';
import EventPostForm from './EventPostForm';
import ExhibitionInfoPage from './ExhibitionInfoPage';

vi.mock('@/lib/api', () => ({ api: { list: vi.fn(), save: vi.fn(), upload: vi.fn(), remove: vi.fn() } }));

function renderWithClient(element: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{element}</QueryClientProvider>);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(api.save).mockResolvedValue({});
  vi.mocked(api.upload).mockResolvedValue({ url: '/uploads/new.png' });
});

describe('content administration', () => {
  it('updates an existing undated event without inventing a date', async () => {
    renderWithClient(<EventForm onSuccess={vi.fn()} event={{ id: '7', created_at: '', title: 'RARE', event_date: null, location: null, description: null, exhibition_group: 'next', link_url: '#about-the-event', position: 1 }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save Event' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledWith('events', expect.objectContaining({ title: 'RARE', event_date: null, exhibition_group: 'next', position: 1 }), '7'));
  });

  it('uploads a new image and updates the existing artwork', async () => {
    renderWithClient(<ArtworkForm onSuccess={vi.fn()} artwork={{ id: '8', created_at: '', title: 'Spill', year: null, description: 'Canvas', image_url: '/img/studio-1.png', position: 2 }} />);
    const file = new File(['image'], 'picture.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText('Image'), file);
    await userEvent.click(screen.getByRole('button', { name: 'Save Artwork' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledWith('artworks', expect.objectContaining({ title: 'Spill', image_url: '/uploads/new.png', position: 2 }), '8'));
    expect(api.upload).toHaveBeenCalledWith(file);
  });

  it('preserves the local image and order when editing an intervention', async () => {
    renderWithClient(<UrbanInterventionForm onSuccess={vi.fn()} urbanIntervention={{ id: '9', created_at: '', title: 'Fabric Remnants', date: 'JUNE 1', description: null, image_url: '/img/studio-1.png', position: 3 }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save Urban Intervention' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledWith('urban_interventions', expect.objectContaining({ image_url: '/img/studio-1.png', position: 3 }), '9'));
  });

  it('updates an existing event post by its identifier', async () => {
    renderWithClient(<EventPostForm onSuccess={vi.fn()} eventPost={{ id: '10', title: 'Soft Landing', subtitle: '', content: '<p>Welcome</p>', position: 1 }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save Event Post' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledWith('event_posts', expect.objectContaining({ title: 'Soft Landing', content: '<p>Welcome</p>', position: 1 }), '10'));
  });

  it('updates the singleton exhibition information', async () => {
    vi.mocked(api.list).mockResolvedValue([{ id: 1, last_exhibition: 'Old', header_label: 'Berlin', next_exhibition: 'Next', next_exhibition_date: 'July', next_exhibition_address: 'Berlin' }]);
    renderWithClient(<ExhibitionInfoPage />);
    const input = await screen.findByLabelText('Last Exhibition');
    await userEvent.clear(input);
    await userEvent.type(input, 'New');
    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => expect(api.save).toHaveBeenCalledWith('exhibition_info', expect.objectContaining({ last_exhibition: 'New', header_label: 'Berlin' }), 1));
  });
});
