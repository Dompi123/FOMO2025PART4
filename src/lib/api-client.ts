import type { ApiResponse, ApiError } from '@/types/api'

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private maxRetries = 3
  private retryDelay = 1000 // 1 second

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseUrl = baseUrl
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
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    })

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`)
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        const error = data as ApiError
        if (this.shouldRetry(response.status) && retryCount < this.maxRetries) {
          await this.delay(this.retryDelay * Math.pow(2, retryCount))
          return this.request<T>(endpoint, options, retryCount + 1)
        }
        throw new Error(error.message || 'An error occurred')
      }

      return data as ApiResponse<T>
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`)
      }
      throw new Error('An unknown error occurred')
    }
  }

  private shouldRetry(status: number): boolean {
    // Retry on network errors or 5xx server errors
    return status === 0 || (status >= 500 && status <= 599)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async signup(name: string, email: string, password: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    })
  }

  // Venues endpoints
  async getVenues(params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/venues${queryString ? `?${queryString}` : ''}`)
  }

  async getVenue(id: string) {
    return this.request(`/venues/${id}`)
  }

  // Orders endpoints
  async createOrder(venueId: string, items: Array<{ id: string; quantity: number }>) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ venueId, items }),
    })
  }

  async getOrders() {
    return this.request('/orders')
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`)
  }

  // User profile endpoints
  async getProfile() {
    return this.request('/profile')
  }

  async updateProfile(data: Record<string, any>) {
    return this.request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient() 