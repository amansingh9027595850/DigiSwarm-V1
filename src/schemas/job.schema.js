import { z } from 'zod';

export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];

export const jobSchema = z.object({
  title: z.string().min(2, 'Title is required').max(140),
  slug: z.string().max(140).optional().or(z.literal('')),
  department: z.string().min(1, 'Department required').default('Engineering'),
  location: z.string().min(1, 'Location required').default('Remote'),
  type: z.enum(JOB_TYPES).default('full-time'),
  experience: z.string().optional().default(''),
  salaryRange: z.string().optional().default(''),
  summary: z.string().min(2, 'Summary is required').max(320),
  description: z.string().optional().default(''),
  responsibilities: z.array(z.string().min(1)).default([]),
  requirements: z.array(z.string().min(1)).default([]),
  benefits: z.array(z.string().min(1)).default([]),
  isActive: z.boolean().default(true),
  closesAt: z.string().optional().or(z.literal('')).or(z.null()),
  order: z.coerce.number().int().default(0),
  seo: z
    .object({
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),
});
