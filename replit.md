# FIFA 2026 World Cup Mobile Companion

## Overview

This is a mobile-first web application serving as the official companion for the FIFA 2026 World Cup. The application provides comprehensive information about teams, matches, host cities, and transportation options across the United States, Canada, and Mexico. Built as a full-stack TypeScript application, it features a React frontend with a modern UI using shadcn/ui components and an Express backend with PostgreSQL database storage.

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