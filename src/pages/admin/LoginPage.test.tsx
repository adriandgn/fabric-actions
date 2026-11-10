import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';
import { MemoryRouter } from 'react-router-dom';

afterEach(() => vi.unstubAllGlobals());

describe('LoginPage', () => {
  it('signs in with the shared password through the local session API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    vi.stubGlobal('fetch', fetchMock);
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/password/i), 'a long test password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/session/login', expect.objectContaining({
      method: 'POST', body: JSON.stringify({ password: 'a long test password' }),
    })));
  });
});
