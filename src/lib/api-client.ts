import { NetworkError, AuthenticationError, ValidationError } from './errors'
import type {
  Venue,
  Order,
  OrderItem,
  Profile,
  ApiSuccessResponse,
  ApiErrorResponse
} from '../types/api'

type ApiResponse<T> = ApiSuccessResponse<T>

class ApiClient {
  private baseUrl: string
  private authToken: string | null = null
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000 // 1 second

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  }

  setAuthToken(token: string | null) {
    this.authToken = token
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    const data = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError('Authentication required')
      }

      if (response.status === 422 && isJson) {
        const apiError = data as ApiErrorResponse
        throw new ValidationError(
          apiError.message || 'Validation failed',
          apiError.errors || {}
        )
      }

      throw new NetworkError(
        isJson ? (data as ApiErrorResponse).message : data,
        response.status
      )
    }

    return data as T
  }

  private async fetchWithRetry<T>(
    input: string,
    init?: RequestInit,
    retryCount = 0
  ): Promise<T> {
    try {
      const response = await fetch(input, init)
      return await this.handleResponse<T>(response)
    } catch (error) {
      // Don't retry on certain errors
      if (
        error instanceof AuthenticationError ||
        error instanceof ValidationError ||
        retryCount >= this.MAX_RETRIES
      ) {
        throw error
      }

      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, this.RETRY_DELAY * Math.pow(2, retryCount))
      )

      return this.fetchWithRetry<T>(input, init, retryCount + 1)
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return this.fetchWithRetry<ApiResponse<T>>(url.toString(), {
      method: 'GET',
      headers: this.getHeaders()
    })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetchWithRetry<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    })
  }

  // Venue endpoints
  async getVenues(params?: { lat?: number; lng?: number; radius?: number }) {
    return this.get<Venue[]>('/venues', params as Record<string, string>)
  }

  async getVenue(id: string) {
    return this.get<Venue>(`/venues/${id}`)
  }

  // Order endpoints
  async createOrder(venueId: string, items: OrderItem[]) {
    return this.post<Order>('/orders', { venueId, items })
  }

  async getOrder(id: string) {
    return this.get<Order>(`/orders/${id}`)
  }

  async updateOrder(id: string, data: Partial<Order>) {
    return this.put<Order>(`/orders/${id}`, data)
  }

  // User endpoints
  async getProfile() {
    return this.get<Profile>('/profile')
  }

  async updateProfile(data: Partial<Profile>) {
    return this.put<Profile>('/profile', data)
  }
}

// Create a singleton instance
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api') 