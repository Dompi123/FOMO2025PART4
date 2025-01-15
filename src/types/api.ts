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

export interface Venue {
  id: string
  name: string
  description: string
  category: string
  latitude: number
  longitude: number
  address: string
  openingHours: {
    [key: string]: {
      open: string
      close: string
    }
  }
  images: {
    thumbnail: string
    cover: string
    gallery: string[]
  }
  rating: number
  capacity: {
    total: number
    current: number
  }
  version: number
  updatedAt: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  options?: {
    name: string
    value: string
    price?: number
  }[]
}

export interface Order {
  id: string
  venueId: string
  userId: string
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  total: number
  createdAt: string
  updatedAt: string
  version: number
}

export interface Profile {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  preferences: {
    notifications: {
      push: boolean
      email: boolean
      sms: boolean
    }
    theme: 'light' | 'dark' | 'system'
  }
  version: number
  updatedAt: string
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
  code?: string
  status: number
}

export interface ApiSuccessResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
    hasMore?: boolean
  }
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