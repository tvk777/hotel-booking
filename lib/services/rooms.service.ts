import { SearchParams } from '@/lib/schemas/search-schema';
import { differenceInDays } from 'date-fns';

type Room = {
  id: number;
  name: string;
  pricePerNight: number;
  meal?: string;
  cancellation: { type: 'non-refundable' } | { type: 'free'; until: string };
};

const rooms: Room[] = [
  {
    id: 1,
    name: 'Standard Room',
    pricePerNight: 100,
    meal: 'Breakfast included',
    cancellation: {
      type: 'free',
      until: '2026-06-30T18:00:00',
    },
  },
  {
    id: 2,
    name: 'Deluxe Room',
    pricePerNight: 180,
    cancellation: {
      type: 'non-refundable',
    },
  },
];

export async function getAvailableRooms(search: SearchParams) {
  const nights = differenceInDays(search.checkOut, search.checkIn);

  return rooms.map((room) => ({
    ...room,
    totalPrice: room.pricePerNight * nights * search.rooms,
    nights,
  }));
}