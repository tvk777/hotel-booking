'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { format } from 'date-fns';
import { searchSchema, type SearchFormValues } from '@/lib/schemas/search-schema';
import { DateField } from './DateField';
import { TravelersField } from './TravelersField';

type Props = {
  initialValues: SearchFormValues;
  serverErrors?: Record<string, string>;
};

export function SearchForm({ initialValues, serverErrors }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ініціалізуємо react-hook-form
  const methods = useForm<SearchFormValues>({
    defaultValues: initialValues,
  });

  const { handleSubmit, watch } = methods;

  // Стейт для відстеження взаємодії (щоб приховати серверні помилки)
  const [isInteracted, setIsInteracted] = useState(false);
  // Локальний стейт для помилок валідації (якщо не використовуємо zodResolver)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Слухаємо значення для відображення помилок на лету
  const currentValues = watch();

  const combinedErrors = isInteracted ? clientErrors : { ...serverErrors, ...clientErrors };
  const hasDateError = !!(
    combinedErrors.checkIn ||
    combinedErrors.checkOut ||
    combinedErrors.dates ||
    combinedErrors.urlError
  );

  const onSubmit = (data: SearchFormValues) => {
    setIsInteracted(true);

    // Ручна валідація за допомогою zod-схеми
    const result = searchSchema.safeParse(data);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      setClientErrors(formattedErrors);
      return; // Блокуємо відправку
    }

    setClientErrors({});

    const validData = result.data;

    // Формуємо нові URL-параметри
    const params = new URLSearchParams(searchParams.toString());
    params.set('checkIn', format(validData.checkIn, 'yyyy-MM-dd'));
    params.set('checkOut', format(validData.checkOut, 'yyyy-MM-dd'));
    params.set('rooms', String(validData.rooms));
    params.set('adults', String(validData.adults));

    if (validData.childrenAges && validData.childrenAges.length > 0) {
      params.set('childrenAge', validData.childrenAges.join(','));
    } else {
      params.delete('childrenAge');
    }

    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-6xl mx-auto space-y-2'
        onChange={() => setIsInteracted(true)} // Будь-яка зміна скидає серверні помилки
      >
        {/* Блок помилок */}
        {Object.keys(combinedErrors).length > 0 && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm'>
            <span className='text-base shrink-0'>⚠️</span>
            <div className='flex flex-col gap-0.5'>
              {Object.values(combinedErrors).map((msg, i) => (
                <span key={i}>{msg}</span>
              ))}
            </div>
          </div>
        )}

        {/* Головний контейнер */}
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-2 bg-white rounded-2xl border p-1 transition-all duration-200 ${hasDateError ? 'border-red-500 ring-2 ring-red-100 bg-red-50/10' : 'border-gray-300 focus-within:border-blue-500'}`}
        >
          <DateField hasDateError={hasDateError} triggerSubmit={() => handleSubmit(onSubmit)()} />

          <TravelersField triggerSubmit={() => handleSubmit(onSubmit)()} />

          {/* Кнопка Search */}
          <div className='md:col-span-2 flex items-center justify-center p-1'>
            <button
              type='submit'
              className={`w-full h-12 md:h-full font-bold px-6 rounded-full text-base transition flex items-center justify-center gap-2 shadow-sm ${hasDateError ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
