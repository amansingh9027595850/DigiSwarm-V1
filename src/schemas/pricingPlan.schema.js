import { z } from 'zod';

export const pricingPlanSchema = z.object({
  name: z.string().min(1, 'Name is required').max(60),
  tagline: z.string().max(200).optional().or(z.literal('')),
  price: z.string().min(1, 'Price is required').max(60),
  billingCycle: z.string().max(60).optional().or(z.literal('')),
  features: z.array(z.string().min(1)).default([]),
  cta: z
    .object({
      label: z.string().max(60).default('Get started'),
      link: z.string().max(200).default('/get-quote'),
    })
    .default({}),
  isHighlighted: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
