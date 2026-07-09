import { z } from 'zod';

export const blogCategorySchema = z.object({
  name: z.string().min(2, 'Name is required').max(60),
  slug: z.string().max(60).optional().or(z.literal('')),
  description: z.string().max(280).optional().default(''),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Must be a hex color (e.g. #1f44f5)')
    .default('#1f44f5'),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});
