import React from 'react';

type IconProps = React.ComponentProps<'svg'>;

export function CalendarIcon(props: IconProps) {
  return (
    <svg className='w-4 h-4 text-gray-500 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' {...props}>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
      />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg className='w-4 h-4 text-gray-500 shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor' {...props}>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      />
    </svg>
  );
}
