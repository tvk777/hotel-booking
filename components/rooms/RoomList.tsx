import { AvailableRoom } from '@/types/room';
import { RoomCard } from './RoomCard';

type RoomListProps = {
  rooms: AvailableRoom[];
};

export function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className='text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300 max-w-4xl mx-auto mt-6'>
        <p className='text-gray-500 font-medium'>No rooms found for your criteria.</p>
        <p className='text-sm text-gray-400 mt-1'>Try changing the number of guests or dates.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-6'>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
