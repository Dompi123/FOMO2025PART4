import { Profile, Venue } from '@/types'

interface ApiResponse<T> {
  data: T
  version?: number
  error?: string
}

interface ApiError extends Error {
  status?: number
  code?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private maxRetries: number = 3
  private retryDelay: number = 1000 // 1 second

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    version?: number
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(version ? { 'If-Match': version.toString() } : {}),
      ...options.headers,
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    let lastError: Error | null = null
    let retryCount = 0

    while (retryCount < this.maxRetries) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, config)
        
        if (!response.ok) {
          const error = new Error('API request failed') as ApiError
          error.status = response.status
          if (response.status === 409) {
            error.code = 'CONFLICT'
          }
          throw error
        }

        const data = await response.json()
        return {
          data,
          version: parseInt(response.headers.get('ETag') || '0', 10),
        }
      } catch (error) {
        lastError = error as Error
        if ((error as ApiError).status === 409) {
          // Don't retry on conflict errors
          throw error
        }
        retryCount++
        if (retryCount < this.maxRetries) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * Math.pow(2, retryCount))
          )
        }
      }
    }

    throw lastError || new Error('Request failed after retries')
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async signup(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout(): Promise<void> {
    if (!this.token) return
    await this.request('/auth/logout', {
      method: 'POST',
    })
    this.clearToken()
  }

  // Venue endpoints
  async getVenues(): Promise<ApiResponse<Venue[]>> {
    return this.request('/venues')
  }

  async getVenue(id: string): Promise<ApiResponse<Venue>> {
    return this.request(`/venues/${id}`)
  }

  // Order endpoints
  async createOrder(
    venueId: string,
    items: Array<{ id: string; quantity: number }>,
    version?: number
  ): Promise<ApiResponse<{ orderId: string }>> {
    return this.request(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify({ venueId, items }),
      },
      version
    )
  }

  async getOrders(): Promise<ApiResponse<Array<{
    id: string
    venueId: string
    items: Array<{
      id: string
      quantity: number
    }>
    status: string
    createdAt: string
  }>>> {
    return this.request('/orders')
  }

  // Profile endpoints
  async getProfile(): Promise<ApiResponse<Profile>> {
    return this.request('/profile')
  }

  async updateProfile(
    data: Partial<Profile>,
    version?: number
  ): Promise<ApiResponse<Profile>> {
    return this.request(
      '/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      version
    )
  }

  // Force sync operation (for conflict resolution)
  async forceSyncOperation(operation: {
    type: string
    entity: string
    data: any
    version: number
  }): Promise<ApiResponse<any>> {
    return this.request('/sync/force', {
      method: 'POST',
      body: JSON.stringify(operation),
      headers: {
        'X-Force-Sync': 'true',
      },
    })
  }
}

export const apiClient = new ApiClient() 