import { z } from 'zod';

export const caseStudySchema = z.object({
  title: z.string().min(2, 'Title is required').max(160),
  slug: z.string().max(160).optional().or(z.literal('')),
  project: z.string().optional().or(z.literal('')),
  client: z.string().optional().default(''),
  industry: z.string().optional().default(''),
  cover: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  challenge: z.string().optional().default(''),
  solution: z.string().optional().default(''),
  results: z.string().optional().default(''),
  metrics: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .default([]),
  content: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  teamSize: z.string().optional().default(''),
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
