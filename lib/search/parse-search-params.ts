import { searchSchema, SearchFormValues } from '@/lib/schemas/search-schema';
import { addDays, parseISO, isValid } from 'date-fns';

const DEFAULT_SEARCH: SearchFormValues = {
  checkIn: new Date(),
  checkOut: addDays(new Date(), 1),
  rooms: 1,
  adults: 2,
  childrenAges: [],
};

type ParseResult = {
  data: SearchFormValues;
  error?: string;
};

export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>): ParseResult {
  const { checkIn, checkOut, adults, childrenAge, rooms } = searchParams;

  const isEmpty = !checkIn && !checkOut && !adults && !rooms;
  if (isEmpty) {
    return { data: DEFAULT_SEARCH };
  }

  const parsedCheckIn = typeof checkIn === 'string' ? parseISO(checkIn) : null;
  const parsedCheckOut = typeof checkOut === 'string' ? parseISO(checkOut) : null;

  const rawData = {
    checkIn: parsedCheckIn && isValid(parsedCheckIn) ? parsedCheckIn : null,
    checkOut: parsedCheckOut && isValid(parsedCheckOut) ? parsedCheckOut : null,
    rooms,
    adults,
    childrenAges: childrenAge,
  };

  const result = searchSchema.safeParse(rawData);

  if (result.success) {
    return { data: result.data as SearchFormValues };
  }

  console.warn('Invalid search params, using defaults', result.error);

  return {
    data: DEFAULT_SEARCH,
    error: 'The search parameters in the link were invalid. Displaying rooms for default dates.',
  };
}
