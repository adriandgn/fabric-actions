import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Hero from './Hero';
import ExhibitionInfo from './ExhibitionInfo';
import Studiopieces from './Studiopieces';
import EventPostsSection from './EventPostsSection';

afterEach(() => vi.unstubAllGlobals());

describe('public seeded content', () => {
  it('shows exhibition groups, the original piece description and editable event post', async () => {
    const data: Record<string, unknown[]> = {
      exhibition_info: [{ last_exhibition: 'LATEST EXHIBITION - CULTURAL THREADS', header_label: 'BERLIN 2025', next_exhibition: 'NEXT EXHIBITION', next_exhibition_date: 'JULY 3', next_exhibition_address: 'Berlin' }],
      events: [{ id: '1', title: 'RARE COLLECTIVE', event_date: null, exhibition_group: 'next', link_url: '#about-the-event' }],
      artworks: [{ id: '1', title: 'Urban Spill 1', description: 'Garments sewn on canvas, 118 x 78 cm', image_url: '/img/studio-2.png' }],
      event_posts: [{ id: '1', title: 'SOFT LANDING', content: '<p>Welcome to the event</p>' }],
    };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, status: 200, json: async () => data[url.split('/').at(-1) ?? ''] })));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><Hero /><ExhibitionInfo /><Studiopieces /><EventPostsSection /></QueryClientProvider>);
    expect(await screen.findByText('BERLIN 2025')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /RARE COLLECTIVE/ })).toHaveAttribute('href', '#about-the-event');
    expect(await screen.findByText('Garments sewn on canvas, 118 x 78 cm')).toBeInTheDocument();
    expect(await screen.findByText('Welcome to the event')).toBeInTheDocument();
  });
});
