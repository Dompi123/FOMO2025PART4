import { Venue, Drink, Order } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  // Venue endpoints
  venues: {
    list: async (): Promise<Venue[]> => {
      const response = await fetch(`${API_BASE_URL}/venues`);
      return response.json();
    },
    getById: async (id: string): Promise<Venue> => {
      const response = await fetch(`${API_BASE_URL}/venues/${id}`);
      return response.json();
    }
  },

  // Skip Line endpoints
  skipLine: {
    purchase: async (venueId: string): Promise<{ success: boolean; passId: string }> => {
      const response = await fetch(`${API_BASE_URL}/venues/${venueId}/skip-line`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    }
  },

  // Drink menu endpoints
  drinks: {
    listByVenue: async (venueId: string): Promise<Drink[]> => {
      const response = await fetch(`${API_BASE_URL}/venues/${venueId}/drinks`);
      return response.json();
    }
  },

  // Order endpoints
  orders: {
    create: async (order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return response.json();
    },
    getById: async (orderId: string): Promise<Order> => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      return response.json();
    },
    listByUser: async (): Promise<Order[]> => {
      const response = await fetch(`${API_BASE_URL}/orders`);
      return response.json();
    }
  },

  // Payment endpoints
  payments: {
    getPaymentMethods: async (): Promise<{ id: string; last4: string; type: string }[]> => {
      const response = await fetch(`${API_BASE_URL}/payment-methods`);
      return response.json();
    },
    addPaymentMethod: async (paymentDetails: any): Promise<{ success: boolean }> => {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails)
      });
      return response.json();
    }
  }
}; 