import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm, RegisterForm } from '@/components/forms';
import { validateForm } from '@/lib/utils/validation';

// Mock validation utility
vi.mock('@/lib/utils/validation', () => ({
  validateForm: vi.fn(),
}));

describe('Forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LoginForm', () => {
    const mockSubmit = vi.fn();

    beforeEach(() => {
      (validateForm as any).mockResolvedValue({ data: null, error: null });
    });

    it('should render login form fields', () => {
      render(<LoginForm onSubmit={mockSubmit} />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should validate form inputs', async () => {
      render(<LoginForm onSubmit={mockSubmit} />);
      
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
      
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it('should submit valid form data', async () => {
      render(<LoginForm onSubmit={mockSubmit} />);
      
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('RegisterForm', () => {
    const mockSubmit = vi.fn();

    it('should render register form fields', () => {
      render(<RegisterForm onSubmit={mockSubmit} />);
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('should validate matching passwords', async () => {
      render(<RegisterForm onSubmit={mockSubmit} />);
      
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password456');
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });

    it('should submit valid registration data', async () => {
      render(<RegisterForm onSubmit={mockSubmit} />);
      
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
