'use client';

import { useFormContext } from 'react-hook-form';
import { Counter } from './Counter';
import { ChildAgeSelect } from './ChildAgeSelect';
import { type SearchFormValues } from '@/lib/schemas/search-schema';

type TravelersPopoverProps = {
  onClose: () => void;
  triggerSubmit: () => void;
};

export function TravelersPopover({ onClose, triggerSubmit }: TravelersPopoverProps) {
  const { watch, setValue } = useFormContext<SearchFormValues>();

  const adults = watch('adults');
  const rooms = watch('rooms');
  const childrenAges = watch('childrenAges') || [];

  return (
    <div className='absolute z-50 mt-3 right-0 left-0 md:left-auto md:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 space-y-5 text-sm text-gray-800 animate-in fade-in slide-in-from-top-2 duration-150'>
      <h3 className='text-base font-bold text-gray-900 mb-2'>Travelers</h3>

      {/* Adults Counter */}
      <Counter label='Adults' value={adults} min={1} onChange={(newValue) => setValue('adults', newValue)} />

      {/* Children Counter */}
      <Counter
        label='Children'
        subLabel='Ages 0 to 17'
        value={childrenAges.length}
        min={0}
        onChange={(newCount) => {
          if (newCount > childrenAges.length) {
            // Додаємо дитину зі стартовим віком 0
            setValue('childrenAges', [...childrenAges, 0]);
          } else {
            // Видаляємо останню дитину
            setValue('childrenAges', childrenAges.slice(0, -1));
          }
        }}
      />

      {/* Children Ages Selects */}
      {childrenAges.length > 0 && (
        <div className='grid grid-cols-2 gap-3 pt-3 border-t border-gray-100'>
          {childrenAges.map((age, index) => (
            <ChildAgeSelect
              key={index}
              index={index}
              value={age}
              onChange={(newAge) => {
                const updated = [...childrenAges];
                updated[index] = newAge;
                setValue('childrenAges', updated);
              }}
            />
          ))}
        </div>
      )}

      {/* Rooms Counter */}
      <div className='pt-4 border-t border-gray-100'>
        <Counter label='Rooms' value={rooms} min={1} onChange={(newValue) => setValue('rooms', newValue)} />
      </div>

      <button
        type='button'
        onClick={() => {
          onClose();
          triggerSubmit();
        }}
        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full mt-4 text-sm transition'
      >
        Done
      </button>
    </div>
  );
}
