import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Enter a valid email'),
  phone: z.string().max(40).optional().or(z.literal('')),
  company: z.string().max(160).optional().or(z.literal('')),
  message: z.string().min(10, 'A few more words help us help you').max(4000),
});
