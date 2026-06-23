import { parseSearchParams } from '@/lib/search/parse-search-params';
import { getAvailableRooms } from '@/lib/services/rooms.service';
import { SearchForm } from '@/components/search/SearchForm';
import { RoomList } from '@/components/rooms/RoomList';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RoomsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const { data, error } = parseSearchParams(resolvedSearchParams);

  const availableRooms = await getAvailableRooms(data);

  const serverErrors = error ? { urlError: error } : undefined;

  return (
    <div className='max-w-7xl mx-auto px-4 py-6 space-y-6 w-full'>
      <SearchForm initialValues={data} serverErrors={serverErrors} />
      <RoomList rooms={availableRooms} />
    </div>
  );
}
