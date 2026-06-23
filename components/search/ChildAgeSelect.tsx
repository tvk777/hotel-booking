'use client';

type ChildAgeSelectProps = {
  index: number;
  value: number;
  onChange: (age: number) => void;
};

export function ChildAgeSelect({ index, value, onChange }: ChildAgeSelectProps) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-xs font-bold text-gray-500'>Child {index + 1} age</label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className='border border-gray-300 rounded-lg p-2 h-10 bg-white font-medium text-gray-700 focus:border-blue-500 focus:outline-none'
      >
        {Array.from({ length: 18 }, (_, i) => (
          <option key={i} value={i}>
            {i === 0 ? 'Under 1' : i}
          </option>
        ))}
      </select>
    </div>
  );
}
