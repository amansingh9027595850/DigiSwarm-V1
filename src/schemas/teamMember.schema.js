import { z } from 'zod';

const optionalUrl = z.string().url('Invalid URL').optional().or(z.literal(''));

export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  role: z.string().min(1, 'Role is required').max(120),
  bio: z.string().max(1000).optional().or(z.literal('')),
  photo: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  socials: z
    .object({
      linkedin: optionalUrl,
      github: optionalUrl,
      twitter: optionalUrl,
      website: optionalUrl,
    })
    .default({}),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});
