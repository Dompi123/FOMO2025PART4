export interface Venue {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  status: 'open' | 'closed';
  waitTime: number;
  capacity: number;
  music: string;
  price: number;
  boost: number;
  vibes: number;
  imageUrl: string;
  updatedAt: string;
}

export interface Drink {
  id: string;
  name: string;
  price: number;
  description: string;
  popularity: string;
  points: number;
  image?: string;
}

export interface OrderItem extends Drink {
  quantity: number;
}

export interface Order {
  id: string;
  venueId: string;
  items: OrderItem[];
  subtotal: number;
  tip: number;
  tipPercentage: number;
  taxAndFees: number;
  total: number;
  totalPoints: number;
  paymentMethod: {
    last4: string;
    type: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  preferences: Record<string, unknown>;
  lastSyncedAt: string;
}

export type Screen = 'venues' | 'venue' | 'menu' | 'checkout' | 'passes' | 'profile'; 