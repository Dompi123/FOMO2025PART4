import { Venue, Drink, Order, PaymentDetails } from '@/types';

// Use window.location.port to dynamically get the correct port
const API_BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`
  : 'http://localhost:3001/api';

// Error types
interface ApiError extends Error {
  status?: number;
  code?: string;
}

export const api = {
  // Venue endpoints
  venues: {
    list: async (): Promise<Venue[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/venues`);
        if (!response.ok) {
          throw new Error(`Failed to fetch venues: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Failed to fetch venues:', error);
        return [];
      }
    },
    getById: async (id: string): Promise<Venue | null> => {
      try {
        const response = await fetch(`${API_BASE_URL}/venues/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`Failed to fetch venue: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Failed to fetch venue ${id}:`, error);
        throw error;
      }
    }
  },

  // Skip Line endpoints
  skipLine: {
    purchase: async (venueId: string): Promise<{ success: boolean; passId: string }> => {
      try {
        const response = await fetch(`${API_BASE_URL}/venues/${venueId}/skip-line`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to purchase skip line pass: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Failed to purchase skip line pass:', error);
        throw error;
      }
    }
  },

  // Passes endpoints
  passes: {
    list: async (): Promise<Array<{
      id: string;
      venueId: string;
      validUntil: string;
      status: 'active' | 'expired' | 'used';
      createdAt: string;
    }>> => {
      try {
        const response = await fetch(`${API_BASE_URL}/passes`);
        if (!response.ok) {
          throw new Error(`Failed to fetch passes: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Failed to fetch passes:', error);
        return [];
      }
    },
    getById: async (passId: string): Promise<{
      id: string;
      venueId: string;
      validUntil: string;
      status: 'active' | 'expired' | 'used';
      createdAt: string;
    } | null> => {
      try {
        const response = await fetch(`${API_BASE_URL}/passes/${passId}`);
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`Failed to fetch pass: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Failed to fetch pass ${passId}:`, error);
        throw error;
      }
    }
  },

  // Drink menu endpoints
  drinks: {
    listByVenue: async (venueId: string): Promise<Drink[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/venues/${venueId}/drinks`);
        if (!response.ok) {
          throw new Error(`Failed to fetch drinks: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Failed to fetch drinks for venue ${venueId}:`, error);
        return [];
      }
    }
  },

  // Order endpoints
  orders: {
    create: async (order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        if (!response.ok) {
          throw new Error(`Failed to create order: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
      }
    },
    getById: async (orderId: string): Promise<Order | null> => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Failed to fetch order ${orderId}:`, error);
        throw error;
      }
    },
    listByUser: async (): Promise<Order[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
      }
    }
  },

  // Payment endpoints
  payments: {
    getPaymentMethods: async (): Promise<{ id: string; last4: string; type: string }[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/payment-methods`);
        if (!response.ok) {
          throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
        return [];
      }
    },
    addPaymentMethod: async (paymentDetails: PaymentDetails): Promise<{ success: boolean }> => {
      try {
        const response = await fetch(`${API_BASE_URL}/payment-methods`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentDetails)
        });
        if (!response.ok) {
          throw new Error(`Failed to add payment method: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Failed to add payment method:', error);
        throw error;
      }
    }
  }
}; 