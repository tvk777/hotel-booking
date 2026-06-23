'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();

  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults');
  const childrenAges = searchParams.get('childrenAges') || 'none';
  const rooms = searchParams.get('rooms');

  return (
    <div className='p-8 font-mono text-sm space-y-2 bg-gray-50 rounded-2xl border m-4 max-w-lg'>
      <h1 className='font-sans text-lg font-bold mb-4'>Booking Info</h1>
      <p>
        <strong>Room ID:</strong> {roomId}
      </p>
      <p>
        <strong>Dates:</strong> from {checkIn} to {checkOut}
      </p>
      <p>
        <strong>Adults:</strong> {adults}
      </p>
      <p>
        <strong>Children Ages:</strong> {childrenAges}
      </p>
      <p>
        <strong>Rooms:</strong> {rooms}
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
