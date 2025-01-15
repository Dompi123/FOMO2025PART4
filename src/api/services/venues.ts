import type { Venue } from '@/types';
import type { ApiResponse } from '../config';
import { ApiClient } from '../client';

export class VenuesService {
  constructor(private client: ApiClient) {}

  async getVenues(params?: { 
    page?: number; 
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Venue[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);

    return this.client.get<Venue[]>(`/venues?${queryParams.toString()}`);
  }

  async getVenue(id: string): Promise<ApiResponse<Venue>> {
    return this.client.get<Venue>(`/venues/${id}`);
  }

  async getVenueCapacity(id: string): Promise<ApiResponse<{ 
    currentOccupancy: number;
    maxCapacity: number;
    waitTime: number;
  }>> {
    return this.client.get(`/venues/${id}/capacity`);
  }
} 