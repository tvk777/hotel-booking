import { searchSchema, SearchParams } from '@/lib/schemas/search-schema';
import { addDays } from 'date-fns';

const DEFAULT_SEARCH: SearchParams = {
  checkIn: new Date(),
  checkOut: addDays(new Date(), 1),
  rooms: 1,
  adults: 2,
  childrenAges: [],
};

export function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const { checkIn, checkOut, adults, childrenAge, rooms } = searchParams;

  // Якщо URL повністю порожній
  const isEmpty = !checkIn && !checkOut && !adults && !rooms;
  if (isEmpty) {
    return DEFAULT_SEARCH;
  }

  // Готуємо об'єкт для Zod. Зверни увагу: перейменовуємо childrenAge (з URL) на childrenAges (для схеми)
  const rawData = {
    checkIn,
    checkOut,
    rooms,
    adults,
    childrenAges: childrenAge,
  };

  const result = searchSchema.safeParse(rawData);

  if (result.success) {
    return result.data;
  }

  console.warn('Invalid search params, using defaults', result.error);
  return DEFAULT_SEARCH;
}
