import { parseSearchParams } from '@/lib/search/parse-search-params';
import { getAvailableRooms } from '@/lib/services/rooms.service';
import { SearchForm } from '@/components/search/SearchForm';
import { RoomList } from '@/components/rooms/RoomList';

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function RoomsPage({ searchParams }: Props) {
  const params = await searchParams;
  // 1. парсимо URL → нормальні дані
  const search = parseSearchParams(params);

  // 2. отримуємо список номерів (server logic)
  const rooms = await getAvailableRooms(search);

  return (
    <main className='mx-auto max-w-7xl p-6 space-y-6'>
      {/* Форма фільтрів */}
      <SearchForm initialValues={search} />

      {/* Список номерів */}
      <RoomList rooms={rooms} />
    </main>
  );
}
