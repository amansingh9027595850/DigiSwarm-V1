import { z } from 'zod';

const optionalUrl = z
  .string()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''));

export const applySchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Enter a valid email'),
  phone: z.string().max(40).optional().or(z.literal('')),
  coverLetter: z.string().max(5000).optional().or(z.literal('')),
  linkedIn: optionalUrl,
  portfolio: optionalUrl,
});
