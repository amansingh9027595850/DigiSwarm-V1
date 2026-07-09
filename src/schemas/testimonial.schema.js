import { z } from 'zod';

export const testimonialSchema = z.object({
  clientName: z.string().min(2, 'Name is required').max(120),
  clientRole: z.string().max(120).optional().or(z.literal('')),
  company: z.string().max(120).optional().or(z.literal('')),
  photo: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  content: z.string().min(2, 'Content is required').max(1200),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
