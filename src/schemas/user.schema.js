import { z } from 'zod';

const password = z
  .string()
  .min(8, 'At least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Must include an uppercase letter')
  .regex(/[a-z]/, 'Must include a lowercase letter')
  .regex(/[0-9]/, 'Must include a number');

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required').max(80),
  email: z.string().email('Invalid email'),
  password,
  role: z.string().min(1, 'Pick a role'),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(80),
  role: z.string().min(1, 'Pick a role'),
  isActive: z.boolean().default(true),
});

export const resetUserPasswordSchema = z.object({
  password,
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, 'Name is required')
    .max(60)
    .regex(/^[a-z][a-z0-9_-]*$/, 'Use lowercase letters, numbers, - or _'),
  description: z.string().max(280).optional().or(z.literal('')),
  permissions: z.array(z.string()).default([]),
});
