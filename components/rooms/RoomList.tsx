import { Room } from '@/types/room';

type RoomWithPricing = Room & {
  nights: number;
  totalPrice: number;
};

type Props = {
  rooms: RoomWithPricing[];
};

export function RoomList({ rooms }: Props) {
  return (
    <div className='space-y-4'>
      {rooms.map((room) => (
        <div key={room.id} className='border rounded-lg p-4'>
          <h2 className='text-xl font-semibold'>{room.name}</h2>

          <p>Total: ${room.totalPrice}</p>

          <p>{room.meal ?? 'No meals included'}</p>
        </div>
      ))}
    </div>
  );
}
