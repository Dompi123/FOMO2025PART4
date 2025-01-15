# Environment Variables Documentation

This document describes all environment variables used in the FOMO Venue App.

## API Configuration

### `NEXT_PUBLIC_API_URL`
- **Required**: Yes
- **Default**: None
- **Description**: Base URL for the backend API
- **Example**: `https://api.fomovenue.com/v1`

### `NEXT_PUBLIC_WS_URL`
- **Required**: Yes
- **Default**: None
- **Description**: WebSocket URL for real-time updates
- **Example**: `wss://api.fomovenue.com/v1/ws`

## Authentication

### `NEXT_PUBLIC_AUTH_DOMAIN`
- **Required**: Yes
- **Default**: None
- **Description**: Domain for authentication service
- **Example**: `auth.fomovenue.com`

### `NEXT_PUBLIC_AUTH_CLIENT_ID`
- **Required**: Yes
- **Default**: None
- **Description**: Client ID for authentication service
- **Example**: `your_auth_client_id`

## Maps Configuration

### `NEXT_PUBLIC_MAPBOX_TOKEN`
- **Required**: Yes
- **Default**: None
- **Description**: Mapbox access token for venue maps
- **Example**: `pk.eyJ1IjoiZm9tby12ZW51ZSIsImEiOiJja...`

### `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
- **Required**: No
- **Default**: None
- **Description**: Google Maps API key (fallback for geocoding)
- **Example**: `AIzaSyBg...`

## Feature Flags

### `NEXT_PUBLIC_ENABLE_NOTIFICATIONS`
- **Required**: No
- **Default**: `false`
- **Description**: Enable push notifications
- **Example**: `true`

### `NEXT_PUBLIC_ENABLE_OFFLINE_MODE`
- **Required**: No
- **Default**: `true`
- **Description**: Enable offline functionality
- **Example**: `true`

## PWA Configuration

### `NEXT_PUBLIC_APP_NAME`
- **Required**: Yes
- **Default**: "FOMO Venue"
- **Description**: Application name for PWA manifest
- **Example**: `"FOMO Venue"`

### `NEXT_PUBLIC_APP_DESCRIPTION`
- **Required**: Yes
- **Default**: "Real-time venue capacity tracking"
- **Description**: Application description for PWA manifest
- **Example**: `"Real-time venue capacity tracking"`

### `NEXT_PUBLIC_APP_THEME_COLOR`
- **Required**: Yes
- **Default**: "#070707"
- **Description**: Theme color for PWA manifest
- **Example**: `"#070707"`

### `NEXT_PUBLIC_APP_BACKGROUND_COLOR`
- **Required**: Yes
- **Default**: "#ffffff"
- **Description**: Background color for PWA manifest
- **Example**: `"#ffffff"`

## Analytics & Monitoring

### `NEXT_PUBLIC_SENTRY_DSN`
- **Required**: No
- **Default**: None
- **Description**: Sentry DSN for error tracking
- **Example**: `https://xxxxx@xxxx.ingest.sentry.io/xxxxx`

### `NEXT_PUBLIC_GA_TRACKING_ID`
- **Required**: No
- **Default**: None
- **Description**: Google Analytics tracking ID
- **Example**: `UA-XXXXXXXXX-X`

## Cache Configuration

### `NEXT_PUBLIC_CACHE_MAX_AGE`
- **Required**: No
- **Default**: `300` (5 minutes)
- **Description**: Maximum age for cached data in seconds
- **Example**: `300`

### `NEXT_PUBLIC_STALE_WHILE_REVALIDATE`
- **Required**: No
- **Default**: `60` (1 minute)
- **Description**: Time to serve stale content while fetching new data
- **Example**: `60`

## Development vs Production

Some variables behave differently in development and production:

- In development:
  - API calls are made to localhost by default
  - Service worker is disabled
  - Analytics are disabled
  - Error tracking is minimal

- In production:
  - All external services must be properly configured
  - Service worker is enabled for offline support
  - Analytics and error tracking are active
  - Rate limiting is enforced

## Security Notes

1. Never commit `.env` files to version control
2. Use different values for development and production
3. Rotate sensitive keys regularly
4. Monitor usage of API keys and tokens
5. Use restrictive CORS policies in production 