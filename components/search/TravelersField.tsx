'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { UsersIcon } from '@/components/ui/icons';
import { TravelersPopover } from './TravelersPopover';
import { type SearchFormValues } from '@/lib/schemas/search-schema';

type TravelersFieldProps = {
  triggerSubmit: () => void;
};

export function TravelersField({ triggerSubmit }: TravelersFieldProps) {
  const { watch } = useFormContext<SearchFormValues>();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const adults = watch('adults') || 1;
  const childrenAges = watch('childrenAges') || [];
  const rooms = watch('rooms') || 1;

  const totalGuests = adults + childrenAges.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='md:col-span-4 relative border-t md:border-t-0 md:border-l border-gray-300' ref={popoverRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full h-full p-2 px-4 text-left hover:bg-gray-50 transition flex flex-col justify-center min-h-[56px]'
      >
        <span className='block text-xs font-bold text-gray-500 mb-0.5'>Travelers</span>
        <div className='flex items-center gap-2 text-sm font-semibold text-gray-800'>
          <UsersIcon />
          <span>
            {totalGuests} traveler{totalGuests > 1 ? 's' : ''}, {rooms} room{rooms > 1 ? 's' : ''}
          </span>
        </div>
      </button>

      {isOpen && <TravelersPopover onClose={() => setIsOpen(false)} triggerSubmit={triggerSubmit} />}
    </div>
  );
}
