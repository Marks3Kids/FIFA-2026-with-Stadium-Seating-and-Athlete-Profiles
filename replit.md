# Championship Concierge

## Overview
Championship Concierge is a mobile-first travel utility app designed for attendees of major global sporting events, specifically targeting the 2026 World Cup. Its primary purpose is to provide comprehensive safety, comfort, and logistics solutions for travelers within the 16 host cities, acting as "Digital Command Centers." The app offers city-specific content, including travel safety, medical options, religious services, and emergency resources, alongside tournament information like team details, live scores, and news. The strategic focus is on essential travel utility rather than sports entertainment, adhering to legal compliance by avoiding official FIFA branding. It supports 9 languages with automatic translation. The app operates on a 4-tier one-time purchase model, culminating in an AI Concierge service for personalized recommendations and real-time support.

## User Preferences
Preferred communication style: Simple, everyday language.

### Mobile-First Design Standards
- **Page headings**: Use responsive sizing `text-2xl sm:text-3xl md:text-4xl` (not fixed text-4xl)
- **Header elements**: Scale down on mobile - logo 32px vs 40px desktop, smaller button padding
- **Page title badges**: Position below header row, not inline (prevents overlap on small screens)
- **Button/icon sizing**: Use responsive padding like `p-1.5 sm:p-2` and icons `w-4 h-4 sm:w-5 sm:h-5`
- **Spacing**: Reduce margins on mobile with patterns like `mb-4 sm:mb-6`

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, using Vite for fast development and TailwindCSS for styling. UI components are consistently managed with shadcn/ui (New York variant), and client-side routing is handled by Wouter. State management, API calls, and data caching are powered by TanStack Query (React Query). A dedicated `SubscriptionContext` manages the 4-tier subscription state, user access, and persists data in localStorage. The design system is dark-mode-first with an emerald green primary color, using Inter for body text and Chakra Petch for headings. The application is configured as a Progressive Web App (PWA) using VitePWA, enabling installability and offline caching for key assets.

### Backend Architecture
The backend uses Express.js for API routing and serving static files. It provides standard CRUD operations for teams, cities, and matches, integrates with RSS feeds for news, and handles lead capture for free bracket downloads. Stripe integration is managed for checkout sessions, webhooks, and subscription verification.

### Data Storage
PostgreSQL is used as the database, accessed via Neon serverless driver. Drizzle ORM provides type-safe schemas for key tables including Users, Teams, Cities, Matches, Leads, and Purchases.

### Key Features & Design Choices
-   **AI Concierge Behavior:** Acts as a proactive, high-end travel advisor, focusing on logistics, safety, and comfort. It operates with a "One Step Ahead" rule, anticipating user needs. Safety is paramount, with directives for medical emergencies and proactive alerts for nearest English-speaking medical facilities. Cultural and spiritual support includes providing maps and schedules for Protestant, Catholic, Islamic, and Jewish services. For remote fans, it acts as a "Producer & Expert Analyst," focusing on social prestige, viewing comfort, and providing "Concierge Briefs" and "Critical Alerts."
-   **Religious Services:** Integrated feature within the Essential Travel Guide, offering Google Maps links for Protestant, Catholic, Mosques, and Synagogues across all 16 host cities.
-   **News Feed System:** Aggregates news from ESPN Soccer, BBC Sport Football, and Sky Sports Football, auto-refreshing every 4 hours and translating headlines into 9 languages via OpenAI.
-   **Match Schedule:** Comprehensive schedule for 104 matches, covering group stages and knockout rounds, culminating in the final.
-   **Watch Party Features:** Includes host city watch party locations with official fan fests and popular venues, and a "Global Watch Hubs" page listing watch party locations for all 48 qualifying nations with search functionality.
-   **City-Specific Context:** The AI Concierge proactively provides city-specific warnings, safety resources, and recommendations based on the user's current location, aiming to remove the "stranger" feeling.
-   **FIFA Tournament Names:** Due to FIFA's corporate naming restrictions, stadiums display both their regular names and official FIFA Tournament Names (e.g., "GEHA Field at Arrowhead Stadium" displays with "FIFA: Kansas City Stadium FIFA"). The `fifaStadiumName` field is stored in the cities database schema and displayed on both the Host Cities and Matches pages.
-   **Stadium Access Structure:** The `cityVaults.ts` includes a `StadiumAccess` interface for future features: mobility maps, last-mile walking guides, transportation PDFs, ADA access points, and gate assignments (awaiting FIFA publication).

### AI Concierge - The Upsell Logic ("Digital Tiered Stadium")

Everyone is in the building, but some have better seats. The AI provides value at every tier while showcasing what's available at higher levels.

- **For Free/Team Info Users:** If a user asks a complex question about safety, religious locations, or transport that is locked behind a higher tier, provide a "Taste of the Service."

- **Example Response:** "I can see three medical facilities within 1 mile of your current location in Kansas City. To receive the exact GPS coordinates, 'Safe-Walk' routes, and direct-dial emergency contacts, you can upgrade to the Full Concierge experience."

- **Key Principle:** Never leave the user empty-handed. Always give them something useful, then show what more they could have.

### Host City Vault Structure (Command Center Template)

Each of the 16 host cities has a "Vault" - a comprehensive Command Center with city-specific expertise. The Kansas City Vault serves as the template:

**Host City Motto:** Each city gets a unique tagline (e.g., KC: "The Soccer Capital of America & The Heart of the Tournament")

**1. Logistics & Transit**
- The Trap: Identify the city's main logistics challenge (e.g., KC: 22,000 parking spots but only 4,000 public)
- The Solution: Provide vetted alternatives (e.g., ConnectKC26, 215+ motorcoaches from regional hubs)
- Local Transit: Free/affordable options (e.g., KC Streetcar between Power & Light and Fan Festival)
- Department of Transportation: Official state/provincial DOT contacts with website links and phone numbers. Multi-jurisdictional cities have multiple DOT entries (e.g., Kansas City has both MoDOT and KDOT, New York/New Jersey has both NYSDOT and NJDOT)

**2. The Safety Net (Medical & Emergency)**
- English-Speaking/International Expert: Hospitals with international travel medicine (e.g., Children's Mercy)
- Emergency Hub: Primary trauma center location (e.g., Saint Luke's Hospital)
- Gold Feature: One-tap 911 integration with automatic "Section and Row" location if inside stadium

**3. The Spiritual Compass**
- Stadium Chapel: Any on-site religious services (e.g., KC: Faith and Family Chapel at Arrowhead)
- Regional Diversity: Islamic Center, Jewish Community Center, Catholic Cathedral locations

**4. Watch Party Scouting**
- The "Vibe" Festival: Official FIFA Fan Festival location (e.g., Liberty Memorial)
- The "Energy" Hub: High-intensity adult-focused venues (e.g., KC Live! at Power & Light)
- The "Local" Secret: Less crowded, local business alternatives (e.g., Northtown)

**5. The "Comfort" Guide (Local Culture)**
- City-specific recommendations (e.g., KC: BBQ Trail - Joe's KC, Arthur Bryant's, Q39)
- Nightlife/Decompression (e.g., KC: 18th & Vine Jazz District, The Blue Room)

**AI Concierge Proactive Message (KC Example):**
"Welcome to the Heart of America! I see you've arrived in Kansas City. A quick heads-up: Parking at the stadium is extremely restricted today. I have secured your 'Stadium Direct' bus pass and mapped the shuttle pickup at Union Station. Since you have 3 hours before kickoff, would you like the walking route to the WWI Museum Fan Fest for a photo at the Heart Gateway?"

### Launch Roadmap - Regional Priority Instruction

This roadmap maximizes app value during the critical first week of the 2026 tournament.

**Phase 1: The "Opening Triangle" Mastery (June 11-12, 2026)**
Focus on 100% data accuracy for the three cities where host nations kick off:
- Mexico City (Mexico opener - June 11)
- New York/New Jersey (USA opener)
- Toronto (Canada opener - June 12)

By mastering these three cities first, the Concierge establishes global authority on Day 1.

**Phase 2: Regional Rollout (June 13-20, 2026)**
Expand expertise into regional clusters for fans traveling between matches:

*The East Coast Corridor ("Safe Route"):*
- Cities: New York/New Jersey, Philadelphia, Boston
- Concierge Focus: Train schedules (Amtrak/NJ Transit) so fans can attend matches in multiple cities without a car

*The Central Heart:*
- Cities: Dallas, Houston, Kansas City, Monterrey
- Concierge Focus: Heat-safety protocols and indoor "cooling zone" maps for high-temperature Texas/Mexico matches

**Phase 3: The "Remote Fan" Engagement (Global)**
Push Remote Fan features globally to the $240M market:

*The "Moment" Feed:*
- Live alerts beyond scores (e.g., "History made: This is the first time a stadium has hosted three openers")

*Bracket Mastery:*
- Real-time updates on teams moving toward Knockout stages in the user's specific time zone

### Proactive AI Concierge Features (AI Concierge Subscription)

The AI Concierge subscription includes proactive automation with both written and verbal delivery:

**1. Written Alerts (Push Notifications)**
- Appear on lock screen for quick, actionable info
- Examples: "🌡️ Hydration Alert: Dallas is 102°F today. Find cooling stations here."
- Managed via `NotificationService.ts` with persistent storage

**2. Verbal (AI Voice)**
- "Talk to Concierge" button activates voice greeting
- Uses Web Speech API for browser-native TTS in 9 languages
- Voice map: en-US, es-ES, fr-FR, de-DE, pt-BR, ar-SA, zh-CN, ja-JP, ko-KR
- Component: `VoiceConcierge.tsx`

**3. Automatic Triggers**

*Welcome Trigger (Location-Based):*
- Activated when geofencing detects user in a host city
- Pulls Host City Vault data and displays welcome notification
- Shows city motto, weather, and proactive recommendations

*Weather/Hydration Trigger (API-Based):*
- Backend connects to OpenWeatherMap API (or simulated data for demo)
- If temperature exceeds 90°F (32°C), triggers hydration alert
- Displays cooling stations and hydration tips
- Service: `WeatherService.ts`, API: `/api/weather/:cityKey`

*Game Day Trigger (Time-Based):*
- Checks match schedule 3 hours before kickoff
- Sends transport tip notification specific to city
- Includes stadium access info, transit routes, QR codes
- Service: `GameDayService.ts`, API: `/api/gameday/upcoming`

**4. Geofencing System**
- `LocationContext.tsx` manages city boundary detection
- 16 host city boundaries with 50-80km radius
- Background monitoring via `watchPosition` with 60-second cache
- Simulation mode for testing in Settings

## External Dependencies
-   **Stripe:** For payment processing, subscription management, and webhook integration (`stripe-replit-sync` package).
    -   Products: Championship Concierge - Team Info (prod_TfHo6dxkResAo8), Championship Concierge - Logistics (prod_TfHo6jtr8E71AB), Championship Concierge - AI Concierge (prod_TfHoStUqBCCA7O).
-   **PostgreSQL (Neon):** Database for data storage.
-   **OpenWeatherMap (Optional):** For real-time weather data. Set `OPENWEATHER_API_KEY` secret if available; otherwise uses simulated weather data.
-   **OpenAI:** Used for translating news headlines into multiple languages.
-   **Google Maps:** Integrated for providing location-based services, such as religious service locations and watch party venues.
-   **RSS Feeds:** External sources like ESPN Soccer, BBC Sport Football, and Sky Sports Football for tournament news.