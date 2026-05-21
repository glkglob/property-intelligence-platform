import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('./LoadingState', () => ({
  default: ({ label }: { label?: string }) => <div>{label ?? 'Loading'}</div>,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('redirects to /login when session is unauthenticated', async () => {
    const { getSession } = await import('../lib/auth');
    vi.mocked(getSession).mockResolvedValue({ status: 'unauthenticated' });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});
