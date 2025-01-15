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
  imageUrl: string;
  updatedAt: string;
  version: number;
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
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'confirmed' | 'ready' | 'completed';
  total: number;
  createdAt: string;
  version: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  preferences: Record<string, any>;
  lastSyncedAt: string;
  version: number;
}

export interface ApiResponse<T> {
  data: T;
  version?: number;
  error?: string;
}

export type Screen = 'venues' | 'venue' | 'menu' | 'checkout' | 'passes' | 'profile'; 