import { z } from 'zod';
import { addYears, differenceInDays } from 'date-fns';

const maxAdvanceDate = addYears(new Date(), 1);
const MAX_STAY_DAYS = 31;

export const searchSchema = z
  .object({
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    rooms: z.coerce.number().int().min(1),
    adults: z.coerce.number().int().min(1),

    childrenAges: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          if (val.trim() === '') return [];
          return val
            .split(',')
            .map(Number)
            .filter((age) => !isNaN(age));
        }
        if (Array.isArray(val)) return val.map(Number);
        return [];
      },
      z.array(z.number().int().min(0).max(17)),
    ),
  })
  .superRefine((data, ctx) => {
    const { checkIn, checkOut } = data;

    if (checkOut <= checkIn) {
      ctx.addIssue({
        code: 'custom',
        message: 'Check-out must be after check-in',
        path: ['checkOut'],
      });
    }

    if (checkIn > maxAdvanceDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Check-in cannot be more than 1 year in advance',
        path: ['checkIn'],
      });
    }

    const nights = differenceInDays(checkOut, checkIn);

    if (nights > MAX_STAY_DAYS) {
      ctx.addIssue({
        code: 'custom',
        message: 'Maximum stay is 31 nights',
        path: ['checkOut'],
      });
    }
  });

export type SearchParams = z.infer<typeof searchSchema>;
