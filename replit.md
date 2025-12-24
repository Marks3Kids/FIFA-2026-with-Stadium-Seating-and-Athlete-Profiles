# Championship Concierge

## Overview

**Website:** ChampionshipConcierge.com (formerly WorldCupCompanion2026.com)

Championship Concierge is a mobile-first essential travel utility app for the 2026 World Cup, positioning 16 host cities as "Digital Command Centers" with comprehensive safety, comfort, and logistics solutions. The app includes team information, live scores, knockout brackets, and tournament news, but primarily focuses on solving travelers' problems through deep city-specific content including travel safety, medical options, religious services, and emergency resources.

**Strategic Focus:** Essential travel utility over sports entertainment
**Legal Compliance:** No official FIFA logos or branding to avoid trademark issues
**Languages:** Supports 9 languages with automatic translation (EN, ES, FR, DE, PT, AR, JA, IT, NL)

## User Preferences

Preferred communication style: Simple, everyday language.

## Pricing Structure

The app uses a 4-tier one-time purchase model:

1. **FREE** - Knockout Bracket PDF
   - Downloadable/printable bracket
   - Requires email capture (name, email, city) for lead generation
   
2. **$4.99 - Team Info**
   - All 48 qualified teams
   - Player rosters & stats
   - Knockout brackets
   - Full match schedules
   - Tournament news
   - World Cup history
   - Tournament odds

3. **$14.99 - Logistics** (Most Popular)
   - Everything in Team Info
   - 16 host city guides
   - Transportation options
   - Lodging recommendations
   - Restaurant guides
   - Essential travel info
   - Safety & medical resources
   - Religious services

4. **$24.99 - AI Concierge**
   - Everything in Logistics
   - Unlimited AI assistance
   - Personalized recommendations
   - Real-time travel support
   - Visa & entry guidance
   - Trip planning tools
   - 24/7 concierge access

**Stripe Price IDs:**
- Team Info: `price_1ShxFJEwO7dpbt1exGRi7Mbt`
- Logistics: `price_1ShxFKEwO7dpbt1e9luXFlYa`
- AI Concierge: `price_1ShxFKEwO7dpbt1eNndVr9yu`

## System Architecture

### Frontend Architecture

**Technology Stack:** React with TypeScript, Vite build tool, TailwindCSS for styling

**UI Component System:** The application uses shadcn/ui (New York variant) for consistent, accessible UI components.

**Routing:** Client-side routing is handled by Wouter. Routes include home, matches, teams, cities, transportation, pricing, and more.

**State Management:** TanStack Query (React Query) manages server state, API calls, and data caching.

**Subscription Context (`client/src/contexts/SubscriptionContext.tsx`):**
- Manages 4-tier subscription state: none, free, team_info, logistics, ai_concierge
- `hasAccess(tier)` method checks if user can access content
- Stores user email, name, city for free tier leads
- Persists subscription data in localStorage

**Design System:** Dark-mode-first design with emerald green primary color (#22C55E). Fonts: Inter for body, Chakra Petch for headings.

### Backend Architecture

**Server Framework:** Express.js handles API routes and static file serving.

**API Endpoints:**
- Teams, Cities, Matches: Standard CRUD operations
- News: RSS feed integration with translation
- Leads: Email capture for free bracket downloads (`POST /api/leads`)
- Stripe: Checkout sessions, webhooks, subscription verification

### Data Storage

**Database:** PostgreSQL via Neon serverless driver

**ORM:** Drizzle ORM with type-safe schemas

**Key Tables:**
- **Users:** Authentication with Stripe customer/subscription IDs
- **Teams:** 48 qualified teams with metadata
- **Cities:** 16 host cities with stadium info
- **Matches:** Tournament schedule with translations
- **Leads:** Email captures for free bracket downloads (name, email, city, source)
- **Purchases:** Subscription tracking by email and tier

### Stripe Integration

**Package:** `stripe-replit-sync` for automatic webhook and data syncing

**Features:**
- Managed webhooks auto-configured
- Products and prices synced to local database
- Checkout sessions for one-time purchases
- Customer portal for subscription management

**Products Created:**
- Championship Concierge - Team Info (prod_TfHo6dxkResAo8)
- Championship Concierge - Logistics (prod_TfHo6jtr8E71AB)
- Championship Concierge - AI Concierge (prod_TfHoStUqBCCA7O)

### Religious Services Feature

**Location:** Essential Travel Guide > General Info > Religious Services

**Services Supported:**
- Protestant Churches (blue button)
- Catholic Churches (purple button)
- Mosques (green button)
- Synagogues (amber button)

All 16 host cities have Google Maps search links for each service type.

### News Feed System

**RSS Sources:**
- ESPN Soccer
- BBC Sport Football
- Sky Sports Football

**Features:**
- Auto-refreshes every 4 hours
- Translates headlines to 9 languages via OpenAI
- Caches translations in database

### Match Schedule

**Tournament Structure:**
- 104 total matches
- 72 group stage (12 groups)
- 32 knockout matches
- Final: MetLife Stadium, July 19, 2026

## Recent Changes (December 2025)

- **Major Rebrand:** "World Cup Companion" → "Championship Concierge"
- **New Pricing:** 4-tier structure (Free, $4.99, $14.99, $24.99)
- **Email Capture:** Lead generation for free bracket downloads
- **Subscription System:** 4-tier access control (none, free, team_info, logistics, ai_concierge)
- **Synagogues Added:** Religious services now include synagogues for all 16 cities
- **Legal Compliance:** Removed any FIFA branding to avoid trademark issues

## Key Files

- `client/src/pages/Pricing.tsx` - 4-tier pricing page with email capture
- `client/src/contexts/SubscriptionContext.tsx` - Subscription state management
- `client/src/components/ProtectedRoute.tsx` - Content gating by tier
- `server/routes.ts` - API endpoints including leads capture
- `shared/schema.ts` - Database schema including leads table
- `scripts/create-new-pricing.ts` - Stripe product/price creation script
