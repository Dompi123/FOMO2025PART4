# FOMO Venue App API Documentation

## Base URL
```
https://api.fomovenue.com/v1
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling
All endpoints return errors in the following format:
```typescript
{
  error: {
    code: string;
    message: string;
    status: number;
    details?: Record<string, any>;
  }
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

Request:
```typescript
{
  email: string;
  password: string;
}
```

Response:
```typescript
{
  data: {
    token: string;
    user: User;
  }
}
```

### Venues

#### GET /venues
Get a list of venues with optional filtering.

Query Parameters:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `search`: string
- `tags`: string[]
- `location`: { lat: number; lng: number; radius: number }

Response:
```typescript
{
  data: Venue[];
  meta: {
    total: number;
    page: number;
    limit: number;
  }
}
```

#### GET /venues/:id
Get details for a specific venue.

Response:
```typescript
{
  data: Venue;
}
```

#### GET /venues/:id/capacity
Get real-time capacity information for a venue.

Response:
```typescript
{
  data: {
    currentOccupancy: number;
    maxCapacity: number;
    waitTime: number;
  }
}
```

### User Profile

#### GET /profile
Get the current user's profile.

Response:
```typescript
{
  data: User;
}
```

#### PUT /profile
Update the current user's profile.

Request:
```typescript
{
  name?: string;
  email?: string;
  phone?: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  }
}
```

Response:
```typescript
{
  data: User;
}
```

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  createdAt: string;
  updatedAt: string;
}
```

### Venue
```typescript
interface Venue {
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
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user
- Capacity endpoints have a higher limit of 300 requests per minute

## Caching
- Venue lists are cached for 5 minutes
- Individual venue details are cached for 1 minute
- Capacity information is not cached (real-time data)

## Websocket Events
For real-time updates, connect to:
```
wss://api.fomovenue.com/v1/ws
```

Events:
- `venue.capacity`: Real-time capacity updates
- `venue.status`: Venue status changes (open/closed)
- `user.notification`: User notifications 