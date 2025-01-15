export type Screen = 'venues' | 'venue' | 'passes' | 'profile' | 'menu' | 'checkout' | 'settings';

export type PaymentMethod = 'credit_card' | 'apple_pay' | 'google_pay';

export interface Venue {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  blurDataURL?: string;
  location: string;
  currentOccupancy: number;
  maxCapacity: number;
  openingHours: {
    open: string;
    close: string;
  };
  rating: number;
  reviews: number;
  waitTime: number;
  capacity: number;
  music?: string;
  price: number;
  boost: number;
  vibes: number;
  status: 'open' | 'closed' | 'at-capacity';
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface Pass {
  id: string;
  venueId: string;
  userId: string;
  type: 'skip-line' | 'vip';
  status: 'active' | 'used' | 'expired';
  validFrom: string;
  validUntil: string;
  qrCode: string;
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: 'beer' | 'wine' | 'cocktail' | 'spirit' | 'soft';
  available: boolean;
  preparationTime: number;
}

export interface OrderItem {
  id: string;
  drinkId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
}

export interface Order {
  id: string;
  userId: string;
  venueId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: PaymentMethod;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  lastSyncTime?: string;
  error?: string;
}

export interface PaymentDetails {
  type: PaymentMethod;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
} 