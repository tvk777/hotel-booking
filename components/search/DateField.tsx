'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInDays } from 'date-fns';
import { CalendarIcon } from '@/components/ui/icons';
import { type SearchFormValues } from '@/lib/schemas/search-schema';

import 'react-day-picker/dist/style.css';

type DateFieldProps = {
  hasDateError: boolean;
  triggerSubmit: () => void;
};

export function DateField({ hasDateError, triggerSubmit }: DateFieldProps) {
  const { watch, setValue } = useFormContext<SearchFormValues>();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const range: DateRange | undefined = {
    from: checkIn ? new Date(checkIn) : undefined,
    to: checkOut ? new Date(checkOut) : undefined,
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) {
      setValue('checkIn', null);
      setValue('checkOut', null);
      return;
    }
    setValue('checkIn', selectedRange.from ?? null);
    setValue('checkOut', selectedRange.to ?? null);
  };

  const nightsCount = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;

  const displayDates =
    checkIn && checkOut
      ? `${format(new Date(checkIn), 'MMM dd')} - ${format(new Date(checkOut), 'MMM dd')}`
      : 'Select dates';

  return (
    <div className='md:col-span-6 relative' ref={popoverRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full p-3 px-4 text-left hover:bg-gray-50 transition rounded-l-xl flex flex-col justify-center min-h-[56px] ${hasDateError ? 'bg-red-50/30' : ''}`}
      >
        <span className={`block text-xs font-bold mb-0.5 ${hasDateError ? 'text-red-500' : 'text-gray-500'}`}>
          Dates
        </span>
        <div className='flex items-center gap-2 text-sm font-semibold w-full overflow-hidden'>
          <div
            className={`w-5 h-5 shrink-0 flex items-center justify-center ${hasDateError ? 'text-red-500' : 'text-gray-400'}`}
          >
            <CalendarIcon />
          </div>
          <span className={`truncate ${hasDateError ? 'text-red-700 font-bold' : 'text-gray-800'}`}>
            {displayDates}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-3 left-0 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 md:w-auto md:min-w-[650px] animate-in fade-in slide-in-from-top-2 duration-150'>
          <div className='flex justify-between items-center mb-2 px-2'>
            <div>
              <h3 className='text-base font-bold text-gray-900'>Selected Dates</h3>
              <p className='text-xs text-gray-500'>{displayDates}</p>
            </div>
            <button
              type='button'
              onClick={() => handleSelect(undefined)}
              className='text-xs font-semibold text-gray-500 hover:text-gray-800 underline'
            >
              Clear dates
            </button>
          </div>

          <div className='flex justify-center border-t border-gray-100 pt-4'>
            <DayPicker
              mode='range'
              numberOfMonths={2}
              selected={range}
              onSelect={handleSelect}
              disabled={{ before: new Date() }}
              showOutsideDays
              // Якщо версія v9+, цей клас змусить місяці стати в ряд:
              className='p-0 m-0'
              classNames={{
                months: 'flex flex-col md:flex-row gap-6 md:gap-8 justify-center', // ЦЕ СТАВИТЬ ЇХ В ОДИН РЯДОК
              }}
            />
          </div>

          <div className='flex justify-center mt-5 w-full'>
            <button
              type='button'
              disabled={!checkIn || !checkOut}
              onClick={() => {
                setIsOpen(false);
                triggerSubmit();
              }}
              className='w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-sm transition disabled:bg-gray-200 disabled:text-gray-400'
            >
              {nightsCount > 0
                ? `Search ${nightsCount} night${nightsCount > 1 ? 's' : ''}`
                : 'Select check-in & check-out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
