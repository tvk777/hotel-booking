'use client';

import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AvailableRoom } from '@/types/room';

type RoomCardProps = {
  room: AvailableRoom;
};

export function RoomCard({ room }: RoomCardProps) {
  const searchParams = useSearchParams();

  const handleReserve = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('roomId', room.id.toString());

    const checkoutUrl = `/checkout?${params.toString()}`;

    window.open(checkoutUrl, '_blank');
  };

  const renderCancellationInfo = () => {
    if (room.cancellation.type === 'non-refundable') {
      return (
        <span className='text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 inline-flex items-center gap-1'>
          🚫 Non-refundable
        </span>
      );
    }

    try {
      const date = parseISO(room.cancellation.until);
      const formattedDate = format(date, 'MMM dd, h:mm a');
      return (
        <span className='text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200/60 inline-flex items-center gap-1'>
          ✓ Free cancellation before {formattedDate}
        </span>
      );
    } catch {
      return (
        <span className='text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200/60'>
          ✓ Free cancellation
        </span>
      );
    }
  };

  return (
    // 🌟 Чистий flex-col без жодних md:flex-row, щоб картка ЗАВЖДИ тримала форму коробки
    <div className='flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 group w-full h-full'>
      {/* 1. Картинка — займає 100% ширини картки, висота фіксована */}
      <div className='relative w-full h-56 shrink-0 bg-gray-100 overflow-hidden'>
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          className='object-cover group-hover:scale-105 transition-transform duration-300'
          priority={room.id === 1}
        />
      </div>

      {/* 2. Контент — блок тепер має flex-1, що дозволяє нижній частині завжди притискатися до низу */}
      <div className='p-5 flex flex-col justify-between flex-1 gap-4 w-full min-w-0'>
        {/* Верхня секція: Назва + Теги */}
        <div className='space-y-2.5 min-w-0 w-full'>
          {/* text-xl зменшуємо до text-lg, щоб довгі назви не ламали рядки у вузьких картках */}
          <h3 className='text-lg font-bold text-gray-900 tracking-tight leading-snug break-words line-clamp-2 min-h-[56px]'>
            {room.name}
          </h3>

          <p className='text-xs font-medium text-gray-500 flex items-center gap-1.5'>
            👥 Sleeps up to {room.maxAdults} adults {room.maxChildren > 0 ? `& ${room.maxChildren} children` : ''}
          </p>

          {/* Контейнер для бейджів, який дозволяє їм красиво переноситися */}
          <div className='flex flex-wrap gap-1.5 pt-0.5 w-full object-contain'>
            {room.meal && (
              <span className='text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60 inline-flex items-center gap-1 shrink-0'>
                🍳 {room.meal}
              </span>
            )}
            {renderCancellationInfo()}
          </div>
        </div>

        {/* Нижня секція: Ціна та Кнопка (Прибрано старий грів md:grid-cols-12, який усе ламав) */}
        <div className='border-t border-gray-100 pt-4 mt-auto w-full space-y-3'>
          <div className='flex items-baseline justify-between w-full gap-2'>
            <div className='flex items-baseline gap-1 shrink-0'>
              <span className='text-2xl font-black text-gray-900'>${room.totalPrice}</span>
              <span className='text-xs font-bold text-gray-900'>Total</span>
            </div>
            <span className='text-xs font-medium text-gray-400 truncate'>${room.pricePerNight}/night avg</span>
          </div>

          <p className='text-[11px] font-medium text-gray-500'>
            includes taxes & fees for {room.nights} night{room.nights > 1 ? 's' : ''}
          </p>

          <button
            type='button'
            onClick={handleReserve}
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 w-full rounded-full text-sm transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-center flex items-center justify-center'
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}