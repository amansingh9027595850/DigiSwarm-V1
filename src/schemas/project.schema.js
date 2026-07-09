import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required').max(140),
  slug: z.string().max(140).optional().or(z.literal('')),
  client: z.string().optional().default(''),
  category: z.string().min(1, 'Category required').default('Other'),
  tags: z.array(z.string()).default([]),
  cover: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  gallery: z
    .array(
      z.object({
        url: z.string(),
        publicId: z.string().optional().default(''),
        alt: z.string().optional().default(''),
      }),
    )
    .default([]),
  stack: z.array(z.string()).default([]),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
  summary: z.string().min(2, 'Summary is required').max(320),
  content: z.string().optional().default(''),
  year: z.coerce.number().int().min(1990).max(2100).optional(),
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
