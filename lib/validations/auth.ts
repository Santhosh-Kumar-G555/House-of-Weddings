import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(30, { message: 'Name cannot exceed 30 characters.' }),
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(16, { message: 'Password cannot exceed 16 characters.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
  role: z.enum(['USER', 'VENDOR']).default('USER'),
});

// Login only needs to verify the data shape to prevent massive payload attacks
const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});
