import { SearchFormValues } from '@/lib/schemas/search-schema';
import { Room, AvailableRoom } from '@/types/room';
import { differenceInDays } from 'date-fns';

const rooms: Room[] = [
  // --- STANDARDS (1-3) ---
  {
    id: 1,
    name: 'Standard Twin Room',
    pricePerNight: 85,
    meal: 'Room only',
    cancellation: { type: 'free', until: '2026-07-01T14:00:00' },
    maxAdults: 2,
    maxChildren: 0,
    totalRoomsAvailable: 8,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Standard King Room',
    pricePerNight: 100,
    meal: 'Breakfast included',
    cancellation: { type: 'free', until: '2026-06-30T18:00:00' },
    maxAdults: 2,
    maxChildren: 1,
    totalRoomsAvailable: 5,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Standard Family Room',
    pricePerNight: 130,
    meal: 'Breakfast included',
    cancellation: { type: 'non-refundable' },
    maxAdults: 3,
    maxChildren: 2,
    totalRoomsAvailable: 4,
    image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80',
  },

  // --- DELUXE & SUPERIOR (4-6) ---
  {
    id: 4,
    name: 'Superior Double Room',
    pricePerNight: 150,
    meal: 'Breakfast included',
    cancellation: { type: 'free', until: '2026-07-05T12:00:00' },
    maxAdults: 2,
    maxChildren: 1,
    totalRoomsAvailable: 6,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Deluxe King Room',
    pricePerNight: 180,
    meal: 'Breakfast included',
    cancellation: { type: 'non-refundable' },
    maxAdults: 3,
    maxChildren: 2,
    totalRoomsAvailable: 3,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Deluxe Ocean View Room',
    pricePerNight: 220,
    meal: 'Breakfast & Dinner included',
    cancellation: { type: 'free', until: '2026-07-10T15:00:00' },
    maxAdults: 2,
    maxChildren: 2,
    totalRoomsAvailable: 3,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
  },

  // --- SUITES & VILLAS (7-9) ---
  {
    id: 7,
    name: 'Executive Executive Suite',
    pricePerNight: 290,
    meal: 'All Inclusive',
    cancellation: { type: 'free', until: '2026-07-03T18:00:00' },
    maxAdults: 4,
    maxChildren: 2,
    totalRoomsAvailable: 2,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    name: 'Grand Family Suite',
    pricePerNight: 350,
    meal: 'Breakfast & Dinner included',
    cancellation: { type: 'free', until: '2026-07-05T12:00:00' },
    maxAdults: 5,
    maxChildren: 4,
    totalRoomsAvailable: 2,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    name: 'Presidential Two-Bedroom Villa',
    pricePerNight: 600,
    meal: 'All Inclusive',
    cancellation: { type: 'free', until: '2026-07-15T00:00:00' },
    maxAdults: 6,
    maxChildren: 4,
    totalRoomsAvailable: 1,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
];

export async function getAvailableRooms(search: SearchFormValues) {
  const checkInDate = search.checkIn ? new Date(search.checkIn) : new Date();
  const checkOutDate = search.checkOut
    ? new Date(search.checkOut)
    : new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000);

  const nights = differenceInDays(checkOutDate, checkInDate);

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

  return filteredRooms.map((room): AvailableRoom => {
    return {
      ...room,
      image: room.image || '', // Або room.image!, але краще оператор фолбеку або явне приведення
      totalPrice: room.pricePerNight * nights * search.rooms,
      nights,
    };
  });
}
