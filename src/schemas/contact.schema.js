import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(2, 'Subject is required').max(200),
  message: z.string().min(10, 'A few more words help us reply better').max(4000),
});
