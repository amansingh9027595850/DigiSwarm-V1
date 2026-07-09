import { z } from 'zod';

export const clientLogoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  logo: z.object({
    url: z.string().url('Upload a logo first'),
    publicId: z.string().optional().default(''),
  }),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});
