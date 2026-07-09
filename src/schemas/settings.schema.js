import { z } from 'zod';

const optionalUrl = z.string().url('Invalid URL').optional().or(z.literal(''));

export const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(120),
  tagline: z.string().max(200).optional().or(z.literal('')),
  logo: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  favicon: z
    .object({ url: z.string().optional().default(''), publicId: z.string().optional().default('') })
    .default({ url: '', publicId: '' }),
  contact: z.object({
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().max(40).optional().or(z.literal('')),
    address: z.string().max(400).optional().or(z.literal('')),
  }),
  socials: z.object({
    linkedin: optionalUrl,
    github: optionalUrl,
    twitter: optionalUrl,
    facebook: optionalUrl,
    instagram: optionalUrl,
    youtube: optionalUrl,
  }),
  smtp: z.object({
    host: z.string().max(200).optional().or(z.literal('')),
    port: z.coerce.number().int().min(1).max(65535).default(587),
    user: z.string().max(200).optional().or(z.literal('')),
    pass: z.string().max(200).optional().or(z.literal('')),
    from: z.string().max(200).optional().or(z.literal('')),
  }),
  analytics: z.object({
    googleAnalyticsId: z.string().max(60).optional().or(z.literal('')),
    googleTagManagerId: z.string().max(60).optional().or(z.literal('')),
  }),
  maintenance: z.object({
    enabled: z.boolean().default(false),
    message: z.string().max(400).optional().or(z.literal('')),
  }),
});
