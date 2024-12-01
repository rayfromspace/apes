import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '@/components/navigation';
import { useAuth } from '@/lib/auth/store';

// Mock useAuth hook
vi.mock('@/lib/auth/store', () => ({
  useAuth: vi.fn(),
}));

describe('Navigation', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock default auth state
    (useAuth as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });
  });

  describe('Unauthenticated State', () => {
    it('should render login and register links when not authenticated', () => {
      render(<Navigation />);
      
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    });

    it('should not render protected links when not authenticated', () => {
      render(<Navigation />);
      
      expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /projects/i })).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    beforeEach(() => {
      (useAuth as any).mockReturnValue({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        isAuthenticated: true,
      });
    });

    it('should render user menu when authenticated', () => {
      render(<Navigation />);
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument();
    });

    it('should render protected links when authenticated', () => {
      render(<Navigation />);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    });

    it('should open user menu on click', async () => {
      render(<Navigation />);
      
      await userEvent.click(screen.getByRole('button', { name: /user menu/i }));
      
      expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
    });
  });

  describe('Mobile Navigation', () => {
    it('should render mobile menu button', () => {
      render(<Navigation />);
      
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    it('should open mobile menu on click', async () => {
      render(<Navigation />);
      
      await userEvent.click(screen.getByRole('button', { name: /menu/i }));
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close mobile menu when clicking outside', async () => {
      render(<Navigation />);
      
      await userEvent.click(screen.getByRole('button', { name: /menu/i }));
      await userEvent.click(document.body);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should highlight active link', () => {
      vi.mock('next/navigation', () => ({
        usePathname: () => '/dashboard',
      }));

      render(<Navigation />);
      
      expect(screen.getByRole('link', { name: /dashboard/i }))
        .toHaveClass('bg-gray-900');
    });

    it('should navigate to correct routes', async () => {
      const mockPush = vi.fn();
      vi.mock('next/navigation', () => ({
        useRouter: () => ({ push: mockPush }),
        usePathname: () => '/',
      }));

      render(<Navigation />);
      
      await userEvent.click(screen.getByRole('link', { name: /login/i }));
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
