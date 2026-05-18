import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  teamName: text("team_name").notNull(),
  flag: text("flag").notNull(),
  rank: integer("rank").notNull(),
  coach: text("coach").notNull(),
  record: text("record").notNull(),
  points: text("points").notNull(),
  // Tournament group letter (A-L) from the FIFA draw. Added 2026-05 for the
  // official 48-team draw — nullable for legacy rows that pre-date the draw.
  groupStage: text("group_stage"),
  // Number of FIFA World Cup appearances (including 2026 if qualified).
  participations: integer("participations"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  stadium: text("stadium").notNull(),
  fifaStadiumName: text("fifa_stadium_name"),
  capacity: text("capacity").notNull(),
  country: text("country").notNull(),
  matches: text("matches").array().notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
});

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  team1: text("team1").notNull(),
  team2: text("team2").notNull(),
  time: text("time").notNull(),
  date: text("date").notNull(),
  stadium: text("stadium").notNull(),
  city: text("city").notNull(),
  stage: text("stage").notNull(),
  translations: jsonb("translations").$type<Record<string, { team1?: string; team2?: string; city?: string }>>(),
  // Live data populated by the football-data.org sync job. Null until the
  // match starts or until the API returns a result for it.
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  // SCHEDULED | LIVE | FINISHED | POSTPONED | CANCELLED
  status: text("status"),
  // football-data.org match id, used as the upsert key by the sync job.
  fdMatchId: integer("fd_match_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Daily snapshot of casino consensus odds for the tournament outright winner.
// One row per team, refreshed by The Odds API cron job.
export const tournamentOdds = pgTable("tournament_odds", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull().unique(),
  // American-style odds (e.g. "+1500", "-200"). Stored as text to preserve sign.
  odds: text("odds").notNull(),
  // Bookmaker(s) the odds were sourced from, e.g. "DraftKings/BetMGM consensus".
  source: text("source").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTournamentOddsSchema = createInsertSchema(tournamentOdds).omit({
  id: true,
  updatedAt: true,
});
export type InsertTournamentOdds = z.infer<typeof insertTournamentOddsSchema>;
export type TournamentOdds = typeof tournamentOdds.$inferSelect;

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  time: text("time").notNull(),
  link: text("link"),
  description: text("description"),
  source: text("source"),
  publishedAt: timestamp("published_at"),
  translations: jsonb("translations").$type<Record<string, { title: string; description?: string }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsItemSchema = createInsertSchema(newsItems).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsItem = z.infer<typeof insertNewsItemSchema>;
export type NewsItem = typeof newsItems.$inferSelect;

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export const tripTransportation = pgTable("trip_transportation", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  confirmationNumber: text("confirmation_number"),
  departureDate: text("departure_date").notNull(),
  departureTime: text("departure_time"),
  departureLocation: text("departure_location").notNull(),
  arrivalDate: text("arrival_date"),
  arrivalTime: text("arrival_time"),
  arrivalLocation: text("arrival_location").notNull(),
  seatInfo: text("seat_info"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripTransportationSchema = createInsertSchema(tripTransportation).omit({
  id: true,
  createdAt: true,
});

export type InsertTripTransportation = z.infer<typeof insertTripTransportationSchema>;
export type TripTransportation = typeof tripTransportation.$inferSelect;

export const tripStays = pgTable("trip_stays", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  hotelName: text("hotel_name").notNull(),
  address: text("address"),
  checkInDate: text("check_in_date").notNull(),
  checkOutDate: text("check_out_date").notNull(),
  checkInTime: text("check_in_time"),
  confirmationNumber: text("confirmation_number"),
  roomType: text("room_type"),
  guests: integer("guests"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripStaySchema = createInsertSchema(tripStays).omit({
  id: true,
  createdAt: true,
});

export type InsertTripStay = z.infer<typeof insertTripStaySchema>;
export type TripStay = typeof tripStays.$inferSelect;

export const tripDining = pgTable("trip_dining", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  restaurantName: text("restaurant_name").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  partySize: integer("party_size"),
  confirmationNumber: text("confirmation_number"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripDiningSchema = createInsertSchema(tripDining).omit({
  id: true,
  createdAt: true,
});

export type InsertTripDining = z.infer<typeof insertTripDiningSchema>;
export type TripDining = typeof tripDining.$inferSelect;

export const tripMatches = pgTable("trip_matches", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  matchDescription: text("match_description").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  stadium: text("stadium"),
  city: text("city"),
  section: text("section"),
  row: text("row"),
  seat: text("seat"),
  ticketConfirmation: text("ticket_confirmation"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripMatchSchema = createInsertSchema(tripMatches).omit({
  id: true,
  createdAt: true,
});

export type InsertTripMatch = z.infer<typeof insertTripMatchSchema>;
export type TripMatch = typeof tripMatches.$inferSelect;

export const tripAgenda = pgTable("trip_agenda", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripAgendaSchema = createInsertSchema(tripAgenda).omit({
  id: true,
  createdAt: true,
});

export type InsertTripAgenda = z.infer<typeof insertTripAgendaSchema>;
export type TripAgenda = typeof tripAgenda.$inferSelect;

export const tripDocuments = pgTable("trip_documents", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  label: text("label").notNull(),
  documentType: text("document_type").notNull(),
  identifier: text("identifier"),
  expiryDate: text("expiry_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripDocumentSchema = createInsertSchema(tripDocuments).omit({
  id: true,
  createdAt: true,
});

export type InsertTripDocument = z.infer<typeof insertTripDocumentSchema>;
export type TripDocument = typeof tripDocuments.$inferSelect;

export const tripContacts = pgTable("trip_contacts", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  name: text("name").notNull(),
  role: text("role"),
  phone: text("phone"),
  email: text("email"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripContactSchema = createInsertSchema(tripContacts).omit({
  id: true,
  createdAt: true,
});

export type InsertTripContact = z.infer<typeof insertTripContactSchema>;
export type TripContact = typeof tripContacts.$inferSelect;

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  tier: text("tier").notNull(),
  priceId: text("price_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSessionId: text("stripe_session_id"),
  purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  purchasedAt: true,
});

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  number: integer("number"),
  dateOfBirth: text("date_of_birth"),
  height: text("height"),
  currentClub: text("current_club"),
  imageUrl: text("image_url"),
  isCaptain: integer("is_captain").default(0),
  internationalCaps: integer("international_caps").default(0),
  internationalGoals: integer("international_goals").default(0),
  clubCareerGoals: integer("club_career_goals").default(0),
  clubCareerAssists: integer("club_career_assists").default(0),
  highlightVideoUrl: text("highlight_video_url"),
  wikiUrl: text("wiki_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export const tournamentHistory = pgTable("tournament_history", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  hostCountry: text("host_country").notNull(),
  winner: text("winner").notNull(),
  runnerUp: text("runner_up").notNull(),
  thirdPlace: text("third_place"),
  fourthPlace: text("fourth_place"),
  totalGoals: integer("total_goals"),
  totalMatches: integer("total_matches"),
  totalAttendance: integer("total_attendance"),
  goldenBoot: text("golden_boot"),
  goldenBootGoals: integer("golden_boot_goals"),
  goldenBall: text("golden_ball"),
  bestGoalkeeper: text("best_goalkeeper"),
  finalScore: text("final_score"),
  teams: integer("teams"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTournamentHistorySchema = createInsertSchema(tournamentHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertTournamentHistory = z.infer<typeof insertTournamentHistorySchema>;
export type TournamentHistory = typeof tournamentHistory.$inferSelect;

export const stadiumSections = pgTable("stadium_sections", {
  id: serial("id").primaryKey(),
  stadiumName: text("stadium_name").notNull(),
  cityName: text("city_name").notNull(),
  sectionName: text("section_name").notNull(),
  sectionType: text("section_type").notNull(),
  level: text("level").notNull(),
  basePriceUsd: integer("base_price_usd").notNull(),
  premiumPriceUsd: integer("premium_price_usd"),
  capacity: integer("capacity"),
  viewQuality: text("view_quality"),
  amenities: text("amenities").array(),
  coordinates: text("coordinates"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStadiumSectionSchema = createInsertSchema(stadiumSections).omit({
  id: true,
  createdAt: true,
});

export type InsertStadiumSection = z.infer<typeof insertStadiumSectionSchema>;
export type StadiumSection = typeof stadiumSections.$inferSelect;

export const stadiumSectionsQuerySchema = z.object({
  stadium: z.string().optional(),
});

export const playersQuerySchema = z.object({
  teamId: z.string().regex(/^\d+$/).optional(),
});

// Knockout bracket matches for the tournament
export const knockoutBrackets = pgTable("knockout_brackets", {
  id: serial("id").primaryKey(),
  stage: text("stage").notNull(), // "round_of_32", "round_of_16", "quarterfinal", "semifinal", "third_place", "final"
  matchNumber: integer("match_number").notNull(), // Position in the bracket
  bracketSide: text("bracket_side").notNull(), // "left" or "right" side of bracket
  team1Slot: text("team1_slot").notNull(), // e.g., "Winner Group A" or actual team name
  team2Slot: text("team2_slot").notNull(), // e.g., "Runner-up Group B" or actual team name
  team1Id: integer("team1_id"), // References teams table if assigned
  team2Id: integer("team2_id"), // References teams table if assigned
  stadium: text("stadium").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  matchDate: text("match_date"), // Date of the match if scheduled
  matchTime: text("match_time"), // Time of the match if scheduled
  status: text("status").notNull().default("pending"), // "pending", "scheduled", "completed"
  winnerId: integer("winner_id"), // References teams table
  score: text("score"), // e.g., "2-1"
  translations: jsonb("translations").$type<Record<string, { team1Slot: string; team2Slot: string; stadium?: string; city?: string }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertKnockoutBracketSchema = createInsertSchema(knockoutBrackets).omit({
  id: true,
  createdAt: true,
});

export type InsertKnockoutBracket = z.infer<typeof insertKnockoutBracketSchema>;
export type KnockoutBracket = typeof knockoutBrackets.$inferSelect;

// Email leads for free bracket downloads
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  source: text("source").default("free_bracket"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Watch Hub Venues - approved watch party locations
export const watchHubVenues = pgTable("watch_hub_venues", {
  id: serial("id").primaryKey(),
  countryCode: text("country_code").notNull(), // ISO country code (e.g., "US", "BR", "GB")
  countryName: text("country_name").notNull(),
  city: text("city").notNull(),
  venueName: text("venue_name").notNull(),
  venueType: text("venue_type").notNull(), // "bar", "fan_zone", "stadium", "restaurant", "public_space"
  address: text("address"),
  capacity: text("capacity"),
  mapsUrl: text("maps_url"),
  website: text("website"),
  phone: text("phone"),
  description: text("description"),
  isHostCity: integer("is_host_city").default(0), // 1 if this is a host city watch party
  hostCityKey: text("host_city_key"), // e.g., "kansasCity", "newYork" for host cities
  isOfficial: integer("is_official").default(0), // 1 if official FIFA Fan Festival
  isVerified: integer("is_verified").default(0), // 1 if verified by admin
  submittedBy: text("submitted_by"), // email of submitter if crowdsourced
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWatchHubVenueSchema = createInsertSchema(watchHubVenues).omit({
  id: true,
  createdAt: true,
});

export type InsertWatchHubVenue = z.infer<typeof insertWatchHubVenueSchema>;
export type WatchHubVenue = typeof watchHubVenues.$inferSelect;

// Watch Hub Submissions - pending user submissions awaiting approval
export const watchHubSubmissions = pgTable("watch_hub_submissions", {
  id: serial("id").primaryKey(),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  city: text("city").notNull(),
  venueName: text("venue_name").notNull(),
  venueType: text("venue_type").notNull(),
  address: text("address"),
  capacity: text("capacity"),
  mapsUrl: text("maps_url"),
  website: text("website"),
  phone: text("phone"),
  description: text("description"),
  isHostCity: integer("is_host_city").default(0),
  hostCityKey: text("host_city_key"),
  submitterName: text("submitter_name").notNull(),
  submitterEmail: text("submitter_email").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "approved", "rejected"
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWatchHubSubmissionSchema = createInsertSchema(watchHubSubmissions).omit({
  id: true,
  createdAt: true,
  reviewedAt: true,
});

export type InsertWatchHubSubmission = z.infer<typeof insertWatchHubSubmissionSchema>;
export type WatchHubSubmission = typeof watchHubSubmissions.$inferSelect;

// AI Message Usage - tracks message counts per user per month
export const aiMessageUsage = pgTable("ai_message_usage", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  monthYear: text("month_year").notNull(), // Format: "2026-06" for June 2026
  messagesUsed: integer("messages_used").notNull().default(0),
  bonusMessages: integer("bonus_messages").notNull().default(0), // Purchased message packs
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiMessageUsageSchema = createInsertSchema(aiMessageUsage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAiMessageUsage = z.infer<typeof insertAiMessageUsageSchema>;
export type AiMessageUsage = typeof aiMessageUsage.$inferSelect;

// AI Message Pack Purchases - tracks individual pack purchases
export const aiMessagePackPurchases = pgTable("ai_message_pack_purchases", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  messagesAdded: integer("messages_added").notNull().default(50),
  stripeSessionId: text("stripe_session_id"),
  purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
});

export const insertAiMessagePackPurchaseSchema = createInsertSchema(aiMessagePackPurchases).omit({
  id: true,
  purchasedAt: true,
});

export type InsertAiMessagePackPurchase = z.infer<typeof insertAiMessagePackPurchaseSchema>;
export type AiMessagePackPurchase = typeof aiMessagePackPurchases.$inferSelect;