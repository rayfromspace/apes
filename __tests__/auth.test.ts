import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAuth } from '@/lib/auth/store';
import LoginPage from '@/app/(auth)/login/page';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  })),
}));

describe('Authentication', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('Login', () => {
    it('should render login form', () => {
      render(<LoginPage />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: {
          user: { id: '1', email: 'test@example.com' },
          session: { access_token: 'token' },
        },
        error: null,
      });

      const supabase = createClient('', '');
      supabase.auth.signInWithPassword = mockSignIn;

      render(<LoginPage />);
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('should display error message on failed login', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      const supabase = createClient('', '');
      supabase.auth.signInWithPassword = mockSignIn;

      render(<LoginPage />);
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Auth Store', () => {
    it('should update auth state on login', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeTruthy();
    });

    it('should clear auth state on logout', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route while unauthenticated', async () => {
      const { result } = renderHook(() => useAuth());
      const mockRouter = { push: vi.fn() };
      
      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });

    it('should render protected content when authenticated', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
