# WorldCupCompanion2026

## Overview

**Website:** WorldCupCompanion2026.com

This is a mobile-first web application serving as a companion for the 2026 World Cup. The app is branded as "World Cup Companion" with modern football-inspired emerald green colors displayed prominently in the header on every page. The application provides comprehensive information about teams, matches, host cities, and transportation options across the United States, Canada, and Mexico. Built as a full-stack TypeScript application, it features a React frontend with a modern UI using shadcn/ui components and an Express backend with PostgreSQL database storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:** React with TypeScript, Vite build tool, TailwindCSS for styling

**UI Component System:** The application uses shadcn/ui (New York variant) for consistent, accessible UI components. This provides a comprehensive set of pre-built components including dialogs, cards, navigation, forms, and data display elements.

**Routing:** Client-side routing is handled by Wouter, a lightweight React router. The application is structured as a single-page application (SPA) with multiple routes for different sections (home, matches, teams, cities, transportation, menu).

**State Management:** TanStack Query (React Query) manages server state, API calls, and data caching. This eliminates the need for a separate global state management solution for server data.

**Design System:** The application uses a dark-mode-first design with a premium sports aesthetic. Custom CSS variables define the color palette with an "electric green" primary color (#22C55E) reminiscent of a football pitch. Two custom fonts are used: Inter for body text and Chakra Petch for display/headings.

**Mobile-First Design:** The entire interface is optimized for mobile devices with touch-friendly navigation, safe area support for notched devices, and responsive layouts that adapt to different screen sizes.

### Backend Architecture

**Server Framework:** Express.js serves as the HTTP server, handling API routes and static file serving.

**API Design:** RESTful API endpoints are organized by resource type (teams, cities, matches, news). The API follows conventional REST patterns with GET endpoints for retrieval and POST endpoints for creation.

**Request/Response Handling:** Express middleware handles JSON parsing, URL encoding, and request logging. A custom logging function provides formatted timestamps for all requests.

**Development vs Production:** The application uses different serving strategies based on environment:
- Development: Vite dev server with HMR (Hot Module Replacement) middleware
- Production: Pre-built static files served from the dist directory

**Build Process:** A custom build script uses esbuild to bundle the server code and Vite to build the client. Server dependencies are selectively bundled to reduce cold start times by minimizing file system operations.

### Data Storage

**Database:** PostgreSQL via Neon serverless driver for connection pooling and edge compatibility

**ORM:** Drizzle ORM provides type-safe database access with TypeScript inference. Schema definitions live in a shared directory accessible to both frontend and backend.

**Schema Structure:**
- **Users:** Authentication and user management (id, username, password)
- **Teams:** All 48 qualified teams with metadata (name, flag, rank, coach, record, points)
- **Cities:** Host city information including stadiums, capacity, and match schedules
- **Matches:** Tournament schedule with team pairings, dates, locations, and tournament stages
- **News Items:** Breaking news and updates with categories and timestamps
- **Trips:** User trip planning with 7 related tables (transportation, stays, dining, matches, agenda, documents, contacts)

**Client-Side Storage:**
- Profile data (display name, email, phone, home city, nationality, favorite team, travel dates) stored in localStorage
- Settings preferences (notifications, language, dark mode, sound, haptics, privacy options) stored in localStorage

**Validation:** Drizzle-zod generates Zod schemas from database schemas, providing runtime validation for API inputs and ensuring type safety across the stack.

**Database Migrations:** Drizzle Kit manages schema migrations with a dedicated configuration file pointing to the shared schema directory.

### External Dependencies

**Database Service:** Neon PostgreSQL serverless database accessed via DATABASE_URL environment variable

**AI Concierge:** OpenAI GPT-4o-mini integration for conversational assistance with World Cup planning. The concierge has expertise in all 16 host cities, transportation, lodging, dining, visa requirements, and stadium policies.

**Third-Party Integrations Referenced:**
- Airline booking systems (Delta, United, American, etc.) - external links only
- Rail services (Amtrak, VIA Rail) - external links only
- Car rental companies (Hertz, Enterprise, Avis) - external links only
- Rideshare apps (Uber, Lyft) - external links only

**Development Tools:**
- Replit-specific plugins for development banner, cartographer, and runtime error overlay
- Custom Vite plugin for updating OpenGraph meta tags with deployment URLs

**UI Dependencies:**
- Radix UI primitives for accessible component foundations
- Lucide React for iconography
- TailwindCSS v4 with custom animations
- Embla Carousel for content carousels
- React Hook Form with Zod resolvers for form management

**Font Loading:** Google Fonts CDN provides Inter and Chakra Petch font families

**Session Management:** The application includes infrastructure for sessions via connect-pg-simple (PostgreSQL session store) though implementation is not fully visible in the provided code.

### Automatic News Feed System

**RSS Feed Integration:** The application fetches live soccer news from multiple reliable RSS sources:
- ESPN Soccer (`https://www.espn.com/espn/rss/soccer/news`)
- BBC Sport Football (`http://feeds.bbci.co.uk/sport/football/rss.xml`)
- Sky Sports Football (`https://www.skysports.com/rss/11095`)

**News Service (`server/newsService.ts`):** Centralized service that:
- Fetches and parses RSS feeds using `rss-parser` package
- Deduplicates news items by title
- Stores top 10 items sorted by publish date in the database
- Auto-refreshes every 4 hours on incoming requests
- Provides manual refresh endpoint at `/api/news/refresh`

**API Endpoints:**
- `GET /api/news?limit=3&locale=es` - Returns latest news items with optional translation (limit validated 1-10, locale supports es/fr/de/pt/ar/ja/it/nl)
- `POST /api/news/refresh` - Forces immediate RSS feed refresh

**News Translation (`server/translationService.ts`):**
- Uses OpenAI GPT-4o-mini via Replit AI Integrations for on-demand translation
- Translates headlines and descriptions to 8 languages (Spanish, French, German, Portuguese, Arabic, Japanese, Italian, Dutch)
- Caches translations in database JSONB column to avoid repeat API calls
- Falls back to English if translation fails
- Cost-effective: Only translates when a locale is first requested, then serves from cache

**Home Page Display:** Interactive news carousel showing top 3 items with:
- Category badges and timestamps ("39m ago" format)
- Source attribution (ESPN, BBC Sport, Sky Sports)
- Article descriptions and external links
- Manual refresh button with loading states
- Empty state handling when no news available
- Headlines automatically translated based on user's selected language

### Cross-Device Consistency

**Flag Images:** All country/region flags throughout the app use image URLs from flagcdn.com instead of emoji flags. This ensures consistent visual display across all devices and browsers, as emoji flags can render inconsistently or as text codes on some platforms.

**Flag Utility (`client/src/lib/flags.ts`):** A centralized utility provides:
- `countryCodeMap`: Maps country names to ISO country codes
- `languageCodeMap`: Maps language codes to flag country codes
- `currencyCodeMap`: Maps currency codes to flag country codes
- Helper functions: `getFlagUrl()`, `getLanguageFlagUrl()`, `getCurrencyFlagUrl()`, `getFlagUrlByCode()`

Components using flag images:
- Teams.tsx - Team cards with country flags
- TeamDetailModal.tsx - Team detail headers
- HeaderNav.tsx - Language selector
- Planner.tsx - Currency converter
- CriticalInfo.tsx - Host cities, broadcast regions, consulates
- History.tsx - Historical tournament data
- Players.tsx - Player nationality flags

### Religious Services Feature

**Location:** Integrated as a tab within the Essential Travel Guide (CriticalInfo.tsx) under "General Info" section

**Functionality:**
- Shows Google Maps search links for places of worship in all 16 host cities
- Three religious services supported: Protestant Churches, Catholic Churches, and Mosques
- Organized by country (USA, Canada, Mexico) with city cards
- Each service type opens Google Maps search for that type of worship place in that city
- Color-coded buttons (blue for Protestant, purple for Catholic, emerald for Islamic)

**Data Source:** `client/src/data/religiousServices.ts` contains cityKey, countryKey, and Google Maps URLs for each service type

**Translations:** All content translated across 9 languages (EN, ES, FR, DE, PT, AR, JA, IT, NL) in the `religiousServices` and `criticalInfo.categories.religiousServices` translation keys

### Match Schedule System

**Complete Tournament Schedule:**
- 104 total matches across all tournament stages
- 72 group stage matches (Groups A-L, 6 matches per group)
- 32 knockout matches (Round of 32 through Final)
- Official schedule released December 6, 2025

**Matches Page UI (`client/src/pages/Matches.tsx`):**
- Stage tabs for navigation: Group Stage, Round of 32, Round of 16, Quarterfinals, Semifinals, Final
- Match cards display team names, venue, city, date, and match status
- All stage names translated via i18next for 9 supported languages

**Bracket Translation (`server/translationService.ts`):**
- Translates placeholder slot names (e.g., "Winner Group A" → "Ganador Grupo A" for Spanish)
- Translates stadium and city names for international users
- Uses OpenAI GPT-4o-mini integration
- Caches translations in database JSONB column per match
- First translation: ~934ms (API call), cached: ~24ms

**API Endpoints:**
- `GET /api/matches?stage=Final&locale=es` - Fetch matches with stage filter and translation
- `GET /api/knockout-brackets?stage=final&locale=es` - Fetch knockout bracket data

**Match Structure:**
- Group Stage: 72 matches across 12 groups (June 11-28, 2026)
- Round of 32: 16 matches (June 29-July 1, 2026)
- Round of 16: 8 matches (July 4-6, 2026)
- Quarterfinals: 4 matches (July 10-11, 2026)
- Semifinals: 2 matches (July 14-15, 2026)
- Third Place: 1 match (July 18, 2026)
- Final: 1 match at MetLife Stadium, New York/New Jersey (July 19, 2026)