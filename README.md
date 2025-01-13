# FOMO PWA App

A Next.js Progressive Web App for venue discovery, skip-line passes, and drink ordering.

## Tech Stack

- React 18.2.0
- Next.js 14.0.3
- TypeScript
- Tailwind CSS
- Framer Motion
- next-pwa
- Radix UI

## Features

### 1. Venue Discovery
- List of venues with real-time information
- Ratings and reviews
- Capacity tracking
- Wait times
- Music/event information

### 2. Skip Line System
- Digital pass generation
- Time-based expiration
- Real-time queue status
- FOMO points integration

### 3. Drink Ordering
- Digital menu
- Real-time cart management
- Order tracking
- Multiple payment methods

### 4. User Features
- Profile management
- FOMO points system
- Order history
- Digital passes

## Project Structure

```
components/
├── VenueList.tsx         # Venue discovery screen
├── SkipLineCheckout.tsx  # Skip line purchase flow
├── DrinkMenu.tsx         # Drink menu with cart
├── DrinkOrderCheckout.tsx # Drink checkout process
├── BottomNav.tsx         # Navigation bar
├── FomoPasses.tsx        # User's passes screen
├── FomoTickets.tsx       # Tickets management
└── FomoAccount.tsx       # User profile

pages/
├── index.tsx             # Main app container
├── _app.tsx             # App wrapper with PWA setup
└── _document.tsx        # Document setup
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. View in browser:
```
http://localhost:3000
```

## Navigation Flow

1. Venue List → Skip Line Checkout → Drink Menu
2. Drink Menu → Drink Checkout → Confirmation
3. Bottom navigation for Venues, Passes, and Profile

## Styling

- Dark theme with purple/pink gradients
- Mobile-first design
- Smooth animations with Framer Motion
- Responsive layout with Tailwind CSS

## PWA Features

- Installable on mobile devices
- Offline support
- Push notifications (planned)
- Background sync (planned)

## Development Status

Current implementation includes:
- ✅ Venue discovery screen
- ✅ Skip line purchase flow
- ✅ Drink menu and cart
- ✅ Basic navigation
- ⏳ Payment integration
- ⏳ Backend integration
- ⏳ User authentication

## Next Steps

1. Backend Integration
   - User management
   - Venue management
   - Order processing
   - Payment system

2. Enhanced Features
   - Real-time updates
   - Push notifications
   - Offline support
   - Location services

3. Testing & Optimization
   - Performance optimization
   - Cross-browser testing
   - PWA audit
   - Security measures 