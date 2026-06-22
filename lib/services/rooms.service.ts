import { SearchParams } from '@/lib/schemas/search-schema';
import { differenceInDays } from 'date-fns';

type Room = {
  id: number;
  name: string;
  pricePerNight: number;
  meal?: string;
  cancellation: { type: 'non-refundable' } | { type: 'free'; until: string };
  // add fields for filtering
  maxAdults: number;
  maxChildren: number;
  totalRoomsAvailable: number; 
};

const rooms: Room[] = [
  {
    id: 1,
    name: 'Standard Room',
    pricePerNight: 100,
    meal: 'Breakfast included',
    cancellation: { type: 'free', until: '2026-06-30T18:00:00' },
    maxAdults: 2,
    maxChildren: 1,
    totalRoomsAvailable: 5, // Якщо юзер шукає 6 кімнат — цей номер не підійде
  },
  {
    id: 2,
    name: 'Deluxe Room',
    pricePerNight: 180,
    cancellation: { type: 'non-refundable' },
    maxAdults: 3,
    maxChildren: 2,
    totalRoomsAvailable: 3,
  },
  {
    id: 3,
    name: 'Family Suite',
    pricePerNight: 250,
    meal: 'Breakfast & Dinner included',
    cancellation: { type: 'free', until: '2026-07-05T12:00:00' },
    maxAdults: 5,
    maxChildren: 4,
    totalRoomsAvailable: 2,
  },
];

export async function getAvailableRooms(search: SearchParams) {
  const nights = differenceInDays(search.checkOut, search.checkIn);

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    if (room.totalRoomsAvailable < search.rooms) {
      return false;
    }

    const adultsPerRoom = Math.ceil(search.adults / search.rooms);
    const childrenPerRoom = Math.ceil(search.childrenAges.length / search.rooms);

    if (adultsPerRoom > room.maxAdults || childrenPerRoom > room.maxChildren) {
      return false;
    }

    return true;
  });

  return filteredRooms.map((room) => ({
    ...room,
    totalPrice: room.pricePerNight * nights * search.rooms,
    nights,
  }));
}
