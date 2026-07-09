import { z } from 'zod';

export const EDUCATION_OPTIONS = ['12th Pass', "Bachelor's", 'Others'];

export const workshopRegistrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  city: z.string().min(1, 'City is required').max(80),
  education: z.enum(EDUCATION_OPTIONS, {
    errorMap: () => ({ message: 'Pick your education level' }),
  }),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(30)
    .regex(/^[+\d][\d\s\-()]+$/, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
});
