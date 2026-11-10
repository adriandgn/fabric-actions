import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Newsletter from './Newsletter';

afterEach(() => vi.unstubAllGlobals());

describe('Newsletter', () => {
  it('subscribes through the local API without sending a provider key from the browser', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<Newsletter />);
    await userEvent.type(screen.getByPlaceholderText('YOUR EMAIL'), 'person@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'SUBSCRIBE' }));
    await waitFor(() => expect(screen.getByText('THANKS FOR SUBSCRIBING')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'person@example.com' }),
    });
  });
});
