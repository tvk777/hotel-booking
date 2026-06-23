'use client';

type CounterProps = {
  label: string;
  subLabel?: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
};

export function Counter({ label, subLabel, value, min, onChange }: CounterProps) {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <p className='font-bold text-gray-900'>{label}</p>
        {subLabel && <p className='text-xs text-gray-500'>{subLabel}</p>}
      </div>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className='w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-lg disabled:opacity-20 hover:border-gray-600 transition'
        >
          —
        </button>
        <span className='w-4 text-center font-bold text-base'>{value}</span>
        <button
          type='button'
          onClick={() => onChange(value + 1)}
          className='w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center text-lg hover:border-gray-600 transition'
        >
          +
        </button>
      </div>
    </div>
  );
}
