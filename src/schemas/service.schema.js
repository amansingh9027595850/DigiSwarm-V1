import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(2, 'Title is required').max(120),
  slug: z.string().max(120).optional().or(z.literal('')),
  shortDesc: z.string().min(2, 'Short description is required').max(280),
  fullDesc: z.string().optional().default(''),
  icon: z.string().optional().default(''),
  banner: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  technologies: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
  seo: z
    .object({
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),
});
