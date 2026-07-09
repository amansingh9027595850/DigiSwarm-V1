import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  slug: z.string().max(200).optional().or(z.literal('')),
  excerpt: z.string().min(2, 'Excerpt is required').max(320),
  content: z.string().optional().default(''),
  cover: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  category: z.string().min(1, 'Pick a category'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.string().optional().or(z.literal('')).or(z.null()),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seo: z
    .object({
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),
});
