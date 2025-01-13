# FOMO App API Requirements

## Overview
This document outlines the API requirements for the FOMO venue app, a mobile PWA for venue entry and drink ordering.

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.fomoapp.com/v1`

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Venues

#### GET /venues
List all available venues
- Response: `Venue[]`
```typescript
interface Venue {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  image?: string;
  address: string;
  skipLinePrice: number;
  isOpen: boolean;
}
```

#### GET /venues/:id
Get venue details
- Response: `Venue`

### Skip Line

#### POST /venues/:id/skip-line
Purchase skip line pass
- Response: `{ success: boolean; passId: string }`

### Drinks

#### GET /venues/:id/drinks
Get drink menu for venue
- Response: `Drink[]`
```typescript
interface Drink {
  id: string;
  name: string;
  price: number;
  description: string;
  popularity: string;
  points: number;
  image?: string;
}
```

### Orders

#### POST /orders
Create new order
- Request Body:
```typescript
{
  venueId: string;
  items: {
    id: string;
    quantity: number;
  }[];
  tipPercentage: number;
  paymentMethodId: string;
}
```
- Response: `Order`

#### GET /orders/:id
Get order details
- Response: `Order`

#### GET /orders
List user's orders
- Response: `Order[]`

### Payments

#### GET /payment-methods
List user's payment methods
- Response: `PaymentMethod[]`

#### POST /payment-methods
Add new payment method
- Request Body: Stripe payment method token
- Response: `{ success: boolean }`

## Error Handling
All endpoints should return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Rate Limiting
- 100 requests per minute per user
- 429 Too Many Requests response when exceeded

## Versioning
API version included in URL path: `/v1/`
Breaking changes require new version number 