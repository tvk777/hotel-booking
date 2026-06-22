'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { type SearchParams } from '@/lib/schemas/search-schema';
import { CalendarIcon, UsersIcon } from '../ui/icons';

type Props = {
  initialValues: SearchParams;
};

export function SearchForm({ initialValues }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const popoverRef = useRef<HTMLDivElement>(null);

  const [checkIn, setCheckIn] = useState(initialValues.checkIn.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(initialValues.checkOut.toISOString().split('T')[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState(initialValues.rooms);
  const [adults, setAdults] = useState(initialValues.adults);
  const [childrenAges, setChildrenAges] = useState<number[]>(initialValues.childrenAges);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChildrenCountChange = (operation: 'increment' | 'decrement') => {
    if (operation === 'increment') {
      setChildrenAges([...childrenAges, 0]);
    } else if (operation === 'decrement' && childrenAges.length > 0) {
      setChildrenAges(childrenAges.slice(0, -1));
    }
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const updatedAges = [...childrenAges];
    updatedAges[index] = Math.max(0, Math.min(17, age));
    setChildrenAges(updatedAges);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    params.set('rooms', String(rooms));
    params.set('adults', String(adults));

    if (childrenAges.length > 0) {
      params.set('childrenAge', childrenAges.join(','));
    } else {
      params.delete('childrenAge');
    }

    setIsOpen(false);
    router.push(`/rooms?${params.toString()}`);
  };

  const totalGuests = adults + childrenAges.length;

  return (
    <div className='w-full max-w-6xl mx-auto bg-white p-4 rounded-3xl shadow-md border border-gray-100'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-2 bg-white rounded-xl border border-gray-300 p-1'>
        {/* Dates Block (Check-in & Check-out) */}
        <div className='md:col-span-6 grid grid-cols-2 divide-x divide-gray-300'>
          {/* Check-in */}
          <div className='relative p-2 px-3 hover:bg-gray-50 transition rounded-l-lg cursor-pointer'>
            <label className='block text-xs font-bold text-gray-500 mb-0.5'>Dates</label>
            <div className='flex items-center gap-2'>
              <CalendarIcon />
              <input
                type='date'
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className='bg-transparent text-sm font-semibold text-gray-800 focus:outline-none w-full cursor-pointer'
              />
            </div>
          </div>

          {/* Check-out */}
          <div className='relative p-2 px-3 hover:bg-gray-50 transition cursor-pointer'>
            <label className='block text-xs font-bold text-gray-500 mb-0.5'>Check-out</label>
            <div className='flex items-center gap-2'>
              <CalendarIcon />
              <input
                type='date'
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className='bg-transparent text-sm font-semibold text-gray-800 focus:outline-none w-full cursor-pointer'
              />
            </div>
          </div>
        </div>

        {/* Travelers Block */}
        <div className='md:col-span-4 relative border-t md:border-t-0 md:border-l border-gray-300' ref={popoverRef}>
          <button
            type='button'
            onClick={() => setIsOpen(!isOpen)}
            className='w-full h-full p-2 px-3 text-left hover:bg-gray-50 transition rounded-r-lg md:rounded-none flex flex-col justify-center'
          >
            <span className='block text-xs font-bold text-gray-500 mb-0.5'>Travelers</span>
            <div className='flex items-center gap-2 text-sm font-semibold text-gray-800'>
              <UsersIcon />
              <span>
                {totalGuests} travelers, {rooms} room{rooms > 1 ? 's' : ''}
              </span>
            </div>
          </button>

          {/* Expedia Popover Style */}
          {isOpen && (
            <div className='absolute z-50 mt-3 right-0 left-0 md:left-auto md:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 space-y-5 text-sm text-gray-800 animate-in fade-in slide-in-from-top-2 duration-150'>
              <h3 className='text-base font-bold text-gray-900 mb-2'>Travelers</h3>

              {/* Adults Counter */}
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-bold text-gray-900'>Adults</p>
                </div>
                <div className='flex items-center gap-4'>
                  <button
                    type='button'
                    disabled={adults <= 1}
                    onClick={() => setAdults(adults - 1)}
                    className='w-9 h-9 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-lg hover:border-gray-600 disabled:opacity-20 disabled:pointer-events-none'
                  >
                    —
                  </button>
                  <span className='w-4 text-center font-bold text-base'>{adults}</span>
                  <button
                    type='button'
                    onClick={() => setAdults(adults + 1)}
                    className='w-9 h-9 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-lg hover:border-gray-600'
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Counter */}
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-bold text-gray-900'>Children</p>
                  <p className='text-xs text-gray-500'>Ages 0 to 17</p>
                </div>
                <div className='flex items-center gap-4'>
                  <button
                    type='button'
                    disabled={childrenAges.length === 0}
                    onClick={() => handleChildrenCountChange('decrement')}
                    className='w-9 h-9 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-lg hover:border-gray-600 disabled:opacity-20 disabled:pointer-events-none'
                  >
                    —
                  </button>
                  <span className='w-4 text-center font-bold text-base'>{childrenAges.length}</span>
                  <button
                    type='button'
                    onClick={() => handleChildrenCountChange('increment')}
                    className='w-9 h-9 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-lg hover:border-gray-600'
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic Children Age Inputs */}
              {childrenAges.length > 0 && (
                <div className='grid grid-cols-2 gap-3 pt-3 border-t border-gray-100'>
                  {childrenAges.map((age, index) => (
                    <div key={index} className='flex flex-col gap-1'>
                      <label className='text-xs font-bold text-gray-500'>Child {index + 1} age</label>
                      <select
                        value={age}
                        onChange={(e) => handleChildAgeChange(index, parseInt(e.target.value, 10) || 0)}
                        className='border border-gray-300 rounded-lg p-2 h-10 bg-white font-medium text-gray-700 focus:border-blue-500 focus:outline-none'
                      >
                        {Array.from({ length: 18 }, (_, i) => (
                          <option key={i} value={i}>
                            {i === 0 ? 'Under 1' : i}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Rooms Counter */}
              <div className='flex justify-between items-center pt-4 border-t border-gray-100'>
                <div>
                  <p className='font-bold text-gray-900'>Rooms</p>
                </div>
                <div className='flex items-center gap-4'>
                  <button
                    type='button'
                    disabled={rooms <= 1}
                    onClick={() => setRooms(rooms - 1)}
                    className='w-9 h-9 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-lg hover:border-gray-600 disabled:opacity-20 disabled:pointer-events-none'
                  >
                    —
                  </button>
                  <span className='w-4 text-center font-bold text-base'>{rooms}</span>
                  <button
                    type='button'
                    onClick={() => setRooms(rooms + 1)}
                    className='w-9 h-9 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-lg hover:border-gray-600'
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Expedia Style Done Button */}
              <button
                type='button'
                onClick={handleSearch}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full mt-4 text-sm transition'
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Expedia Search Button */}
        <div className='md:col-span-2 flex items-center justify-center p-1'>
          <button
            type='button'
            onClick={handleSearch}
            className='w-full h-12 md:h-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-full text-base transition flex items-center justify-center gap-2 shadow-sm'
          >
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
