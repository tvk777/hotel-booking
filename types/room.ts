export type Room = {
  id: number;
  name: string;
  pricePerNight: number;
  meal?: string;
  cancellation: { type: 'non-refundable' } | { type: 'free'; until: string };
};
