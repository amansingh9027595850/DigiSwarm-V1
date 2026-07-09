import { z } from 'zod';

export const faqSchema = z.object({
  question: z.string().min(2, 'Question is required').max(280),
  answer: z.string().min(2, 'Answer is required').max(3000),
  category: z.string().min(1).max(60).default('General'),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});
