import * as z from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Project Schemas
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['planning', 'in_progress', 'completed', 'on_hold']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Investment Schemas
export const investmentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['seed', 'series_a', 'series_b', 'series_c', 'other']),
  date: z.date(),
  notes: z.string().optional(),
});

// Profile Schemas
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  role: z.enum(['investor', 'founder', 'both']),
  linkedin: z.string().url('Invalid LinkedIn URL').optional(),
  twitter: z.string().url('Invalid Twitter URL').optional(),
});

// Utility functions
export const validateForm = async <T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const validData = await schema.parseAsync(data);
    return { data: validData, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, error: error.errors[0].message };
    }
    return { data: null, error: 'Validation failed' };
  }
};
