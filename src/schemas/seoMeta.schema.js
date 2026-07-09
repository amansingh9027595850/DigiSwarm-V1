import { z } from 'zod';

export const seoMetaSchema = z.object({
  path: z
    .string()
    .min(1, 'Path is required')
    .max(200)
    .regex(/^\//, 'Path must start with /'),
  title: z.string().max(200).optional().or(z.literal('')),
  description: z.string().max(400).optional().or(z.literal('')),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  canonical: z.string().url('Invalid URL').optional().or(z.literal('')),
  noindex: z.boolean().default(false),
});
