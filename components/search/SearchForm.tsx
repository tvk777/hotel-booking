'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { type SearchParams } from '@/lib/schemas/search-schema';

type Props = {
  initialValues: SearchParams;
};

export function SearchForm({ initialValues }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // локальний state тільки для UI
  const [rooms, setRooms] = useState(initialValues.rooms);
 // const [adults, setAdults] = useState(initialValues.adults);

  const [checkIn, setCheckIn] = useState(initialValues.checkIn.toISOString().split('T')[0]);

  const [checkOut, setCheckOut] = useState(initialValues.checkOut.toISOString().split('T')[0]);

  const updateURL = (next: { rooms?: number; adults?: number; checkIn?: string; checkOut?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.rooms !== undefined) params.set('rooms', String(next.rooms));
    if (next.adults !== undefined) params.set('adults', String(next.adults));
    if (next.checkIn) params.set('checkIn', next.checkIn);
    if (next.checkOut) params.set('checkOut', next.checkOut);

    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <h2 className='text-lg font-semibold'>Search rooms</h2>

      {/* Rooms */}
      <div>
        <label>Rooms</label>
        
      </div>

      {/* Adults */}
      <div>
        <label>Adults</label>
        
      </div>

      {/* Check-in */}
      <div>
        <label>Check-in</label>
        <input
          type='date'
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            updateURL({ checkIn: e.target.value });
          }}
          className='border p-2 w-full'
        />
      </div>

      {/* Check-out */}
      <div>
        <label>Check-out</label>
        <input
          type='date'
          value={checkOut}
          onChange={(e) => {
            setCheckOut(e.target.value);
            updateURL({ checkOut: e.target.value });
          }}
          className='border p-2 w-full'
        />
      </div>
    </div>
  );
}
