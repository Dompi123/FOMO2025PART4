// API Response Types
interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Auth
interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest extends LoginRequest {
  name: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

// Venues
interface VenueResponse {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  rating: number
  status: 'open' | 'closed'
  waitTime: number
  imageUrl: string
  updatedAt: string
}

interface VenuesQueryParams {
  search?: string
  status?: 'open' | 'closed'
  sortBy?: 'rating' | 'waitTime'
  page?: number
  limit?: number
}

// Orders
interface CreateOrderRequest {
  venueId: string
  items: Array<{
    id: string
    quantity: number
  }>
}

interface OrderResponse {
  id: string
  venueId: string
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  status: 'pending' | 'confirmed' | 'ready' | 'completed'
  total: number
  createdAt: string
}

// User Profile
interface UpdateProfileRequest {
  name?: string
  email?: string
  preferences?: Record<string, any>
}

interface UserProfileResponse {
  id: string
  name: string
  email: string
  preferences: Record<string, any>
  orders: OrderResponse[]
}

export type {
  ApiResponse,
  ApiError,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  VenueResponse,
  VenuesQueryParams,
  CreateOrderRequest,
  OrderResponse,
  UpdateProfileRequest,
  UserProfileResponse
} 