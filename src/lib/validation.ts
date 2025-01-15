import { z } from 'zod'

// Common validation patterns
const patterns = {
  phone: /^\+?[1-9]\d{1,14}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/
}

// Common validation messages
const messages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
  minLength: (field: string, length: number) => `${field} must be at least ${length} characters`,
  maxLength: (field: string, length: number) => `${field} must be at most ${length} characters`
}

// Venue validation
export const venueSchema = z.object({
  name: z.string().min(2, messages.minLength('Name', 2)).max(100),
  description: z.string().min(10).max(1000),
  category: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(5).max(200)
})

// Order validation
export const orderItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().positive(),
  options: z.array(z.object({
    name: z.string(),
    value: z.string(),
    price: z.number().optional()
  })).optional()
})

export const createOrderSchema = z.object({
  venueId: z.string().uuid(),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item')
})

// User profile validation
export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(messages.email),
  phone: z.string().regex(patterns.phone, messages.phone).optional(),
  preferences: z.object({
    notifications: z.object({
      push: z.boolean(),
      email: z.boolean(),
      sms: z.boolean()
    }),
    theme: z.enum(['light', 'dark', 'system'])
  })
})

// Auth validation
export const loginSchema = z.object({
  email: z.string().email(messages.email),
  password: z.string().regex(patterns.password, messages.password)
})

export const signupSchema = loginSchema.extend({
  name: z.string().min(2).max(100),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Helper function to validate data
export async function validate<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ 
  success: boolean
  data?: T
  errors?: Record<string, string[]>
}> {
  try {
    const validData = await schema.parseAsync(data)
    return {
      success: true,
      data: validData
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach(err => {
        const path = err.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return {
        success: false,
        errors
      }
    }
    throw error
  }
} 