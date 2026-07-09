import { z } from 'zod';

export const BUDGET_RANGES = [
  'Less than $5k',
  '$5k - $15k',
  '$15k - $50k',
  '$50k - $150k',
  '$150k+',
  'Not sure yet',
];

export const TIMELINE_OPTIONS = [
  'ASAP',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'Just exploring',
];

export const quoteStep1Schema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Enter a valid email'),
  phone: z.string().max(40).optional().or(z.literal('')),
  company: z.string().max(160).optional().or(z.literal('')),
});

export const quoteStep2Schema = z.object({
  services: z.array(z.string()).min(1, 'Pick at least one service'),
});

export const quoteStep3Schema = z.object({
  budget: z.enum(BUDGET_RANGES),
  timeline: z.enum(TIMELINE_OPTIONS),
});

export const quoteStep4Schema = z.object({
  requirements: z.string().min(10, 'Give us a bit more detail').max(6000),
});

export const fullQuoteSchema = quoteStep1Schema
  .merge(quoteStep2Schema)
  .merge(quoteStep3Schema)
  .merge(quoteStep4Schema);
