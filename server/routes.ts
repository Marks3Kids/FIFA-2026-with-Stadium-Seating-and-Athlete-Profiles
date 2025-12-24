import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stripeService } from "./stripeService";
import { getNewsWithAutoRefresh, refreshNewsNow } from "./newsService";
import { getTranslatedNews } from "./translationService";
import { 
  insertTeamSchema, 
  insertCitySchema, 
  insertMatchSchema, 
  insertNewsItemSchema,
  insertTripSchema,
  insertTripTransportationSchema,
  insertTripStaySchema,
  insertTripDiningSchema,
  insertTripMatchSchema,
  insertTripAgendaSchema,
  insertTripDocumentSchema,
  insertTripContactSchema,
  stadiumSectionsQuerySchema,
  playersQuerySchema,
  insertLeadSchema
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Teams API
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const team = await storage.getTeam(id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: "Invalid team data" });
    }
  });

  // Cities API
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const city = await storage.getCity(id);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json(city);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch city" });
    }
  });

  app.post("/api/cities", async (req, res) => {
    try {
      const validatedData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(validatedData);
      res.status(201).json(city);
    } catch (error) {
      res.status(400).json({ error: "Invalid city data" });
    }
  });

  // Matches API
  app.get("/api/matches", async (req, res) => {
    try {
      const { stage, locale } = req.query;
      let matches;
      
      if (stage && typeof stage === "string") {
        matches = await storage.getMatchesByStage(stage);
      } else {
        matches = await storage.getAllMatches();
      }
      
      // If locale is provided and not English, translate team names
      if (locale && locale !== "en" && typeof locale === "string") {
        const { translateMatches } = await import("./translationService");
        const translatedMatches = await translateMatches(matches, locale);
        return res.json(translatedMatches);
      }
      
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  // Knockout Brackets API
  app.get("/api/knockout-brackets", async (req, res) => {
    try {
      const { stage, locale } = req.query;
      let brackets;
      
      if (stage && typeof stage === "string") {
        brackets = await storage.getKnockoutBracketsByStage(stage);
      } else {
        brackets = await storage.getAllKnockoutBrackets();
      }
      
      // If locale is provided and not English, translate the slot names
      if (locale && locale !== "en" && typeof locale === "string") {
        const { translateKnockoutBrackets } = await import("./translationService");
        const translatedBrackets = await translateKnockoutBrackets(brackets, locale);
        return res.json(translatedBrackets);
      }
      
      res.json(brackets);
    } catch (error) {
      console.error("Error fetching knockout brackets:", error);
      res.status(500).json({ error: "Failed to fetch knockout brackets" });
    }
  });

  app.post("/api/knockout-brackets/seed", async (req, res) => {
    try {
      const { seedKnockoutBrackets } = await import("./knockoutBracketSeed");
      await seedKnockoutBrackets();
      res.json({ success: true, message: "Knockout brackets seeded successfully" });
    } catch (error) {
      console.error("Error seeding knockout brackets:", error);
      res.status(500).json({ error: "Failed to seed knockout brackets" });
    }
  });

  // News API - Auto-refreshing from RSS feeds with translation support
  app.get("/api/news", async (req, res) => {
    try {
      let limit = 3;
      if (req.query.limit) {
        const parsed = parseInt(req.query.limit as string, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
          limit = parsed;
        }
      }
      
      const locale = (req.query.locale as string) || "en";
      const news = await getNewsWithAutoRefresh(limit);
      
      if (locale !== "en") {
        const translatedNews = await getTranslatedNews(news, locale);
        return res.json(translatedNews);
      }
      
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.post("/api/news/refresh", async (req, res) => {
    try {
      await refreshNewsNow();
      res.json({ success: true, message: "News refreshed successfully" });
    } catch (error) {
      console.error("Error refreshing news:", error);
      res.status(500).json({ error: "Failed to refresh news" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsItemSchema.parse(req.body);
      const newsItem = await storage.createNewsItem(validatedData);
      res.status(201).json(newsItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid news data" });
    }
  });

  // Trips API
  app.get("/api/trips", async (req, res) => {
    try {
      const trips = await storage.getAllTrips();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trip" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const validatedData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(validatedData);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ error: "Invalid trip data" });
    }
  });

  app.patch("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid trip ID" });
      }
      const validatedData = insertTripSchema.partial().parse(req.body);
      const trip = await storage.updateTrip(id, validatedData);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid trip ID" });
      }
      await storage.deleteTrip(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete trip" });
    }
  });

  // Trip Transportation
  app.get("/api/trips/:tripId/transportation", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripTransportation(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transportation" });
    }
  });

  app.post("/api/trips/:tripId/transportation", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripTransportationSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripTransportation(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid transportation data" });
    }
  });

  app.delete("/api/transportation/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripTransportation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transportation" });
    }
  });

  // Trip Stays
  app.get("/api/trips/:tripId/stays", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripStays(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stays" });
    }
  });

  app.post("/api/trips/:tripId/stays", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripStaySchema.parse({ ...req.body, tripId });
      const item = await storage.createTripStay(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid stay data" });
    }
  });

  app.delete("/api/stays/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripStay(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete stay" });
    }
  });

  // Trip Dining
  app.get("/api/trips/:tripId/dining", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripDining(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dining" });
    }
  });

  app.post("/api/trips/:tripId/dining", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripDiningSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripDining(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid dining data" });
    }
  });

  app.delete("/api/dining/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripDining(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dining" });
    }
  });

  // Trip Matches
  app.get("/api/trips/:tripId/matches", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripMatches(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.post("/api/trips/:tripId/matches", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripMatchSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripMatch(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  app.delete("/api/trip-matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripMatch(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete match" });
    }
  });

  // Trip Agenda
  app.get("/api/trips/:tripId/agenda", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripAgenda(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agenda" });
    }
  });

  app.post("/api/trips/:tripId/agenda", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripAgendaSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripAgenda(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid agenda data" });
    }
  });

  app.delete("/api/agenda/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripAgenda(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agenda item" });
    }
  });

  // Trip Documents
  app.get("/api/trips/:tripId/documents", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripDocuments(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/trips/:tripId/documents", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripDocumentSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripDocument(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid document data" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripDocument(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Trip Contacts
  app.get("/api/trips/:tripId/contacts", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripContacts(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/trips/:tripId/contacts", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripContactSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripContact(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripContact(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Currency Exchange API
  interface ExchangeRates {
    base: string;
    date: string;
    rates: Record<string, number>;
    lastFetched: number;
  }

  let cachedRates: ExchangeRates | null = null;
  const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  app.get("/api/currency/rates", async (req, res) => {
    try {
      const now = Date.now();
      
      // Return cached rates if still valid
      if (cachedRates && (now - cachedRates.lastFetched) < CACHE_DURATION) {
        return res.json(cachedRates);
      }

      // Fetch fresh rates from Frankfurter API (free, no API key required)
      // Note: Don't include USD in target list since it's the base currency
      const currencies = "EUR,GBP,CAD,MXN,JPY,CNY,AUD,BRL,ARS,KRW,CHF,INR,SAR,AED,QAR";
      const response = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currencies}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const data = await response.json();
      
      // USD is the base, so its rate is always 1
      cachedRates = {
        base: "USD",
        date: data.date,
        rates: { USD: 1, ...data.rates },
        lastFetched: now
      };

      res.json(cachedRates);
    } catch (error) {
      console.error("Currency API error:", error);
      
      // Return cached rates even if expired, as fallback
      if (cachedRates) {
        return res.json({ ...cachedRates, stale: true });
      }
      
      res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
  });

  // AI Concierge API
  const SYSTEM_PROMPT = `You are the official AI Concierge for the FIFA 2026 World Cup. You are a helpful, knowledgeable, and friendly assistant that helps visitors plan their World Cup experience across the United States, Canada, and Mexico.

You have expertise in:
- All 16 host cities: New York/New Jersey (MetLife Stadium), Los Angeles (SoFi Stadium), Dallas (AT&T Stadium), Miami (Hard Rock Stadium), Atlanta (Mercedes-Benz Stadium), Seattle (Lumen Field), San Francisco Bay Area (Levi's Stadium), Houston (NRG Stadium), Philadelphia (Lincoln Financial Field), Kansas City (Arrowhead Stadium), Boston (Gillette Stadium), Toronto (BMO Field), Vancouver (BC Place), Guadalajara (Estadio Akron), Monterrey (Estadio BBVA), and Mexico City (Estadio Azteca)
- All 48 qualified teams and the tournament format
- Transportation options including flights, trains, buses, and car rentals
- Lodging recommendations across all price ranges
- Local dining and entertainment
- Visa and entry requirements for the USA, Canada, and Mexico
- Stadium policies and prohibited items
- Safety information for each host city
- TV broadcasting schedules and streaming options

Be concise but thorough. Use a warm, professional tone. When recommending places or services, mention price ranges when relevant. If you don't know something specific, be honest but try to point the user in the right direction.

Format your responses with clear structure when appropriate:
- Use bullet points for lists
- Bold key information using **text**
- Keep paragraphs short for mobile readability

Remember: You're helping fans have the best World Cup experience of their lives!`;

  app.post("/api/concierge/chat", async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ error: "AI Concierge is not configured. Please set up OpenAI API key." });
      }
      
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Concierge API error:", error);
      if (error?.status === 401) {
        return res.status(500).json({ error: "API key configuration error" });
      }
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  });

  // Stripe Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await stripeService.listProducts();
      res.json({ data: products });
    } catch (error) {
      console.error("Products API error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products-with-prices", async (req, res) => {
    try {
      const rows = await stripeService.listProductsWithPrices();
      
      const productsMap = new Map<string, any>();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
          });
        }
      }

      res.json({ data: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Products with prices API error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Stripe Checkout Session
  app.post("/api/checkout", async (req, res) => {
    try {
      const { priceId, email } = req.body;
      
      if (!priceId) {
        return res.status(400).json({ error: "Price ID is required" });
      }

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if user exists with this email
      let user = await storage.getUserByEmail(email);
      let customerId: string;

      if (user && user.stripeCustomerId) {
        customerId = user.stripeCustomerId;
      } else {
        // Create new Stripe customer
        const customer = await stripeService.createCustomer(email, user?.id ? parseInt(user.id) : 0);
        customerId = customer.id;

        if (user) {
          // Update existing user with customer ID
          await storage.updateUserStripeInfo(user.id, { stripeCustomerId: customerId });
        }
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/pricing`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Checkout API error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Customer Portal
  app.post("/api/customer-portal", async (req, res) => {
    try {
      const { customerId } = req.body;
      
      if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCustomerPortalSession(
        customerId,
        `${baseUrl}/`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Customer portal API error:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  // Verify checkout session and save purchase
  app.get("/api/checkout/verify", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const session = await stripeService.retrieveCheckoutSession(sessionId);
      
      if (session.payment_status === "paid") {
        const email = session.customer_email || session.customer_details?.email;
        const priceId = (session as any).line_items?.data?.[0]?.price?.id;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        
        if (email && priceId) {
          const tier = priceId === "price_1SYdnrLI0BitNJUz4cpm9MAw" ? "basic" : "premier";
          
          const existingPurchase = await storage.getPurchaseByEmail(email);
          if (!existingPurchase) {
            await storage.createPurchase({
              email,
              tier,
              priceId,
              stripeCustomerId: customerId || null,
              stripeSessionId: sessionId,
            });
          } else if (tier === "premier" && existingPurchase.tier === "basic") {
            await storage.updatePurchaseTier(email, "premier");
          }
        }
        
        const tier = priceId === "price_1SYdnrLI0BitNJUz4cpm9MAw" ? "basic" : "premier";
        
        res.json({ 
          success: true, 
          email,
          priceId,
          tier,
          customerId
        });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error("Checkout verify error:", error);
      res.status(500).json({ error: "Failed to verify session" });
    }
  });

  // Verify subscription (with tier)
  app.get("/api/subscription/verify", async (req, res) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.json({ valid: false });
      }

      const purchase = await storage.getPurchaseByEmail(email);
      
      if (!purchase) {
        return res.json({ valid: false });
      }

      res.json({ 
        valid: true,
        tier: purchase.tier,
        purchasedAt: purchase.purchasedAt
      });
    } catch (error) {
      console.error("Subscription verify error:", error);
      res.json({ valid: false });
    }
  });

  // Check subscription status
  app.get("/api/subscription/check", async (req, res) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.json({ hasActiveSubscription: false });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || !user.stripeCustomerId) {
        return res.json({ hasActiveSubscription: false });
      }

      const subscriptions = await stripeService.getCustomerSubscriptions(user.stripeCustomerId);
      const hasActiveSubscription = subscriptions.length > 0;

      res.json({ 
        hasActiveSubscription,
        subscriptionStatus: user.subscriptionStatus
      });
    } catch (error) {
      console.error("Subscription check error:", error);
      res.json({ hasActiveSubscription: false });
    }
  });

  // Players API
  app.get("/api/players", async (req, res) => {
    try {
      const query = playersQuerySchema.safeParse(req.query);
      if (!query.success) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }
      if (query.data.teamId) {
        const players = await storage.getPlayersByTeam(parseInt(query.data.teamId));
        return res.json(players);
      }
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  // Tournament History API
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getAllTournamentHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament history" });
    }
  });

  app.get("/api/history/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const tournament = await storage.getTournamentByYear(year);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  });

  // Stadium Sections API
  app.get("/api/stadiums/sections", async (req, res) => {
    try {
      const query = stadiumSectionsQuerySchema.safeParse(req.query);
      if (!query.success) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }
      if (query.data.stadium) {
        const sections = await storage.getStadiumSections(query.data.stadium);
        return res.json(sections);
      }
      const sections = await storage.getAllStadiumSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stadium sections" });
    }
  });

  // Email Leads API (for free bracket downloads)
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json({ success: true, id: lead.id });
    } catch (error) {
      console.error("Failed to save lead:", error);
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  // Weather API (using OpenWeatherMap)
  const CITY_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
    kansasCity: { lat: 39.0997, lon: -94.5786, name: 'Kansas City' },
    newYork: { lat: 40.7128, lon: -74.0060, name: 'New York' },
    losAngeles: { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
    miami: { lat: 25.7617, lon: -80.1918, name: 'Miami' },
    dallas: { lat: 32.7767, lon: -96.7970, name: 'Dallas' },
    houston: { lat: 29.7604, lon: -95.3698, name: 'Houston' },
    atlanta: { lat: 33.7490, lon: -84.3880, name: 'Atlanta' },
    philadelphia: { lat: 39.9526, lon: -75.1652, name: 'Philadelphia' },
    seattle: { lat: 47.6062, lon: -122.3321, name: 'Seattle' },
    boston: { lat: 42.3601, lon: -71.0589, name: 'Boston' },
    sanFrancisco: { lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
    toronto: { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
    vancouver: { lat: 49.2827, lon: -123.1207, name: 'Vancouver' },
    mexicoCity: { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
    guadalajara: { lat: 20.6597, lon: -103.3496, name: 'Guadalajara' },
    monterrey: { lat: 25.6866, lon: -100.3161, name: 'Monterrey' },
  };

  app.get("/api/weather/:cityKey", async (req, res) => {
    try {
      const { cityKey } = req.params;
      const cityCoords = CITY_COORDINATES[cityKey];
      
      if (!cityCoords) {
        return res.status(404).json({ error: "City not found" });
      }

      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        // Return simulated weather data if no API key (for demo purposes)
        const baseTemp = getSimulatedTemperature(cityKey);
        return res.json({
          city: cityCoords.name,
          temperature: Math.round((baseTemp - 32) * 5/9),
          temperatureF: baseTemp,
          description: 'Clear sky',
          humidity: 65,
          feelsLike: Math.round((baseTemp + 3 - 32) * 5/9),
          feelsLikeF: baseTemp + 3,
          icon: '01d',
          simulated: true,
        });
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoords.lat}&lon=${cityCoords.lon}&appid=${apiKey}&units=imperial`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Weather API error');
      }
      
      const data = await response.json();
      
      res.json({
        city: cityCoords.name,
        temperature: Math.round((data.main.temp - 32) * 5/9),
        temperatureF: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        feelsLike: Math.round((data.main.feels_like - 32) * 5/9),
        feelsLikeF: Math.round(data.main.feels_like),
        icon: data.weather[0].icon,
      });
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather" });
    }
  });

  // Game Day alerts - get upcoming matches
  app.get("/api/gameday/upcoming", async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const matches = await storage.getAllMatches();
      
      const now = new Date();
      const cutoff = new Date(now.getTime() + hours * 60 * 60 * 1000);
      
      const upcoming = matches.filter(match => {
        if (!match.date || !match.time) return false;
        const matchDateTime = new Date(`${match.date}T${match.time}`);
        return matchDateTime > now && matchDateTime <= cutoff;
      }).map(match => {
        const matchDateTime = new Date(`${match.date}T${match.time}`);
        return {
          ...match,
          hoursUntilKickoff: Math.round((matchDateTime.getTime() - now.getTime()) / (60 * 60 * 1000)),
        };
      });

      res.json(upcoming);
    } catch (error) {
      console.error("Failed to fetch upcoming matches:", error);
      res.status(500).json({ error: "Failed to fetch upcoming matches" });
    }
  });

  return httpServer;
}

// Helper function for simulated weather when no API key
function getSimulatedTemperature(cityKey: string): number {
  const hotCities = ['miami', 'dallas', 'houston', 'mexicoCity', 'monterrey', 'guadalajara'];
  const mildCities = ['seattle', 'sanFrancisco', 'boston', 'vancouver', 'toronto'];
  
  if (hotCities.includes(cityKey)) {
    return 85 + Math.floor(Math.random() * 15); // 85-100°F
  } else if (mildCities.includes(cityKey)) {
    return 65 + Math.floor(Math.random() * 15); // 65-80°F
  } else {
    return 75 + Math.floor(Math.random() * 15); // 75-90°F
  }
}