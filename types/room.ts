export type Room = {
  id: number;
  name: string;
  pricePerNight: number;
  maxAdults: number;
  maxChildren: number;
  totalRoomsAvailable: number;
  meal?: string;
  cancellation: { type: 'non-refundable' } | { type: 'free'; until: string };
  image?: string; // Може бути необов'язковим у базі, якщо генерується динамічно
};

export type AvailableRoom = Room & {
  image: string; // Робимо обов'язковим, бо сервіс його точно додає
  nights: number;
  totalPrice: number;
};
