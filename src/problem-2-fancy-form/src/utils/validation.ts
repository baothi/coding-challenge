import { z } from 'zod';

export const swapFormSchema = z.object({
  fromAmount: z
    .number()
    .positive('Amount must be greater than 0')
    .max(1000000000, 'Amount is too large'),
  fromCurrency: z.string().min(1, 'Please select a currency'),
  toAmount: z.number().optional(),
  toCurrency: z.string().min(1, 'Please select a currency'),
}).refine(
  (data) => data.fromCurrency !== data.toCurrency,
  {
    message: 'Cannot swap the same currency',
    path: ['toCurrency'],
  }
);

export type SwapFormValues = z.infer<typeof swapFormSchema>;
