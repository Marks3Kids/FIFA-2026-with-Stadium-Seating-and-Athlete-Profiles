import { 
  type User, 
  type InsertUser,
  type Team,
  type InsertTeam,
  type City,
  type InsertCity,
  type Match,
  type InsertMatch,
  type NewsItem,
  type InsertNewsItem,
  type Trip,
  type InsertTrip,
  type TripTransportation,
  type InsertTripTransportation,
  type TripStay,
  type InsertTripStay,
  type TripDining,
  type InsertTripDining,
  type TripMatch,
  type InsertTripMatch,
  type TripAgenda,
  type InsertTripAgenda,
  type TripDocument,
  type InsertTripDocument,
  type TripContact,
  type InsertTripContact,
  type Purchase,
  type InsertPurchase,
  type Player,
  type InsertPlayer,
  type TournamentHistory,
  type InsertTournamentHistory,
  type StadiumSection,
  type InsertStadiumSection,
  type KnockoutBracket,
  type InsertKnockoutBracket,
  type Lead,
  type InsertLead,
  type WatchHubVenue,
  type InsertWatchHubVenue,
  type WatchHubSubmission,
  type InsertWatchHubSubmission,
  users,
  teams,
  cities,
  matches,
  newsItems,
  trips,
  tripTransportation,
  tripStays,
  tripDining,
  tripMatches,
  tripAgenda,
  tripDocuments,
  tripContacts,
  purchases,
  players,
  tournamentHistory,
  stadiumSections,
  knockoutBrackets,
  leads,
  watchHubVenues,
  watchHubSubmissions
} from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeInfo: { stripeCustomerId?: string; stripeSubscriptionId?: string; subscriptionStatus?: string }): Promise<User | undefined>;
  
  getAllTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  // Drop every row in `teams` and insert the given list as the new canonical set.
  // Used by the admin "Sync FIFA teams" action when the qualified-team list changes.
  replaceAllTeams(newTeams: InsertTeam[]): Promise<{ inserted: number }>;
  
  getAllCities(): Promise<City[]>;
  getCity(id: number): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  updateCityFifaName(cityName: string, fifaStadiumName: string): Promise<City | undefined>;
  
  getAllMatches(): Promise<Match[]>;
  getMatchesByStage(stage: string): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  
  getAllNews(): Promise<NewsItem[]>;
  createNewsItem(item: InsertNewsItem): Promise<NewsItem>;
  
  getAllTrips(): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: number): Promise<boolean>;
  
  getTripTransportation(tripId: number): Promise<TripTransportation[]>;
  createTripTransportation(item: InsertTripTransportation): Promise<TripTransportation>;
  deleteTripTransportation(id: number): Promise<boolean>;
  
  getTripStays(tripId: number): Promise<TripStay[]>;
  createTripStay(item: InsertTripStay): Promise<TripStay>;
  deleteTripStay(id: number): Promise<boolean>;
  
  getTripDining(tripId: number): Promise<TripDining[]>;
  createTripDining(item: InsertTripDining): Promise<TripDining>;
  deleteTripDining(id: number): Promise<boolean>;
  
  getTripMatches(tripId: number): Promise<TripMatch[]>;
  createTripMatch(item: InsertTripMatch): Promise<TripMatch>;
  deleteTripMatch(id: number): Promise<boolean>;
  
  getTripAgenda(tripId: number): Promise<TripAgenda[]>;
  createTripAgenda(item: InsertTripAgenda): Promise<TripAgenda>;
  deleteTripAgenda(id: number): Promise<boolean>;
  
  getTripDocuments(tripId: number): Promise<TripDocument[]>;
  createTripDocument(item: InsertTripDocument): Promise<TripDocument>;
  deleteTripDocument(id: number): Promise<boolean>;
  
  getTripContacts(tripId: number): Promise<TripContact[]>;
  createTripContact(item: InsertTripContact): Promise<TripContact>;
  deleteTripContact(id: number): Promise<boolean>;
  
  getPurchaseByEmail(email: string): Promise<Purchase | undefined>;
  getAllPurchases(): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchaseTier(email: string, tier: string): Promise<Purchase | undefined>;
  
  getAllPlayers(): Promise<Player[]>;
  getPlayersByTeam(teamId: number): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  
  getAllTournamentHistory(): Promise<TournamentHistory[]>;
  getTournamentByYear(year: number): Promise<TournamentHistory | undefined>;
  createTournamentHistory(tournament: InsertTournamentHistory): Promise<TournamentHistory>;
  
  getStadiumSections(stadiumName: string): Promise<StadiumSection[]>;
  getAllStadiumSections(): Promise<StadiumSection[]>;
  createStadiumSection(section: InsertStadiumSection): Promise<StadiumSection>;
  
  getAllKnockoutBrackets(): Promise<KnockoutBracket[]>;
  getKnockoutBracketsByStage(stage: string): Promise<KnockoutBracket[]>;
  createKnockoutBracket(bracket: InsertKnockoutBracket): Promise<KnockoutBracket>;
  updateKnockoutBracket(id: number, bracket: Partial<InsertKnockoutBracket>): Promise<KnockoutBracket | undefined>;
  deleteAllKnockoutBrackets(): Promise<void>;
  
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  
  getAllWatchHubVenues(): Promise<WatchHubVenue[]>;
  getWatchHubVenuesByCountry(countryCode: string): Promise<WatchHubVenue[]>;
  getWatchHubVenuesByHostCity(hostCityKey: string): Promise<WatchHubVenue[]>;
  createWatchHubVenue(venue: InsertWatchHubVenue): Promise<WatchHubVenue>;
  
  getAllWatchHubSubmissions(): Promise<WatchHubSubmission[]>;
  getPendingWatchHubSubmissions(): Promise<WatchHubSubmission[]>;
  createWatchHubSubmission(submission: InsertWatchHubSubmission): Promise<WatchHubSubmission>;
  approveWatchHubSubmission(id: number): Promise<WatchHubVenue | undefined>;
  rejectWatchHubSubmission(id: number, notes: string): Promise<WatchHubSubmission | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeInfo: { stripeCustomerId?: string; stripeSubscriptionId?: string; subscriptionStatus?: string }): Promise<User | undefined> {
    const [user] = await db.update(users).set(stripeInfo).where(eq(users.id, userId)).returning();
    return user;
  }

  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async replaceAllTeams(newTeams: InsertTeam[]): Promise<{ inserted: number }> {
    // Wipe + bulk-insert in a transaction so the table is never empty mid-sync.
    return await db.transaction(async (tx) => {
      await tx.delete(teams);
      if (newTeams.length > 0) {
        await tx.insert(teams).values(newTeams);
      }
      return { inserted: newTeams.length };
    });
  }

  async getAllCities(): Promise<City[]> {
    return await db.select().from(cities);
  }

  async getCity(id: number): Promise<City | undefined> {
    const [city] = await db.select().from(cities).where(eq(cities.id, id));
    return city;
  }

  async createCity(city: InsertCity): Promise<City> {
    const [newCity] = await db.insert(cities).values(city).returning();
    return newCity;
  }

  async updateCityFifaName(cityName: string, fifaStadiumName: string): Promise<City | undefined> {
    const [updated] = await db.update(cities)
      .set({ fifaStadiumName })
      .where(eq(cities.name, cityName))
      .returning();
    return updated;
  }

  async getAllMatches(): Promise<Match[]> {
    return await db.select().from(matches);
  }

  async getMatchesByStage(stage: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.stage, stage));
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async getAllNews(): Promise<NewsItem[]> {
    return await db.select().from(newsItems);
  }

  async createNewsItem(item: InsertNewsItem): Promise<NewsItem> {
    const [newItem] = await db.insert(newsItems).values(item).returning();
    return newItem;
  }

  async getAllTrips(): Promise<Trip[]> {
    return await db.select().from(trips);
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip;
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const [newTrip] = await db.insert(trips).values(trip).returning();
    return newTrip;
  }

  async updateTrip(id: number, tripData: Partial<InsertTrip>): Promise<Trip | undefined> {
    const [updated] = await db.update(trips).set(tripData).where(eq(trips.id, id)).returning();
    return updated;
  }

  async deleteTrip(id: number): Promise<boolean> {
    await db.delete(tripTransportation).where(eq(tripTransportation.tripId, id));
    await db.delete(tripStays).where(eq(tripStays.tripId, id));
    await db.delete(tripDining).where(eq(tripDining.tripId, id));
    await db.delete(tripMatches).where(eq(tripMatches.tripId, id));
    await db.delete(tripAgenda).where(eq(tripAgenda.tripId, id));
    await db.delete(tripDocuments).where(eq(tripDocuments.tripId, id));
    await db.delete(tripContacts).where(eq(tripContacts.tripId, id));
    const result = await db.delete(trips).where(eq(trips.id, id));
    return true;
  }

  async getTripTransportation(tripId: number): Promise<TripTransportation[]> {
    return await db.select().from(tripTransportation).where(eq(tripTransportation.tripId, tripId));
  }

  async createTripTransportation(item: InsertTripTransportation): Promise<TripTransportation> {
    const [newItem] = await db.insert(tripTransportation).values(item).returning();
    return newItem;
  }

  async deleteTripTransportation(id: number): Promise<boolean> {
    await db.delete(tripTransportation).where(eq(tripTransportation.id, id));
    return true;
  }

  async getTripStays(tripId: number): Promise<TripStay[]> {
    return await db.select().from(tripStays).where(eq(tripStays.tripId, tripId));
  }

  async createTripStay(item: InsertTripStay): Promise<TripStay> {
    const [newItem] = await db.insert(tripStays).values(item).returning();
    return newItem;
  }

  async deleteTripStay(id: number): Promise<boolean> {
    await db.delete(tripStays).where(eq(tripStays.id, id));
    return true;
  }

  async getTripDining(tripId: number): Promise<TripDining[]> {
    return await db.select().from(tripDining).where(eq(tripDining.tripId, tripId));
  }

  async createTripDining(item: InsertTripDining): Promise<TripDining> {
    const [newItem] = await db.insert(tripDining).values(item).returning();
    return newItem;
  }

  async deleteTripDining(id: number): Promise<boolean> {
    await db.delete(tripDining).where(eq(tripDining.id, id));
    return true;
  }

  async getTripMatches(tripId: number): Promise<TripMatch[]> {
    return await db.select().from(tripMatches).where(eq(tripMatches.tripId, tripId));
  }

  async createTripMatch(item: InsertTripMatch): Promise<TripMatch> {
    const [newItem] = await db.insert(tripMatches).values(item).returning();
    return newItem;
  }

  async deleteTripMatch(id: number): Promise<boolean> {
    await db.delete(tripMatches).where(eq(tripMatches.id, id));
    return true;
  }

  async getTripAgenda(tripId: number): Promise<TripAgenda[]> {
    return await db.select().from(tripAgenda).where(eq(tripAgenda.tripId, tripId));
  }

  async createTripAgenda(item: InsertTripAgenda): Promise<TripAgenda> {
    const [newItem] = await db.insert(tripAgenda).values(item).returning();
    return newItem;
  }

  async deleteTripAgenda(id: number): Promise<boolean> {
    await db.delete(tripAgenda).where(eq(tripAgenda.id, id));
    return true;
  }

  async getTripDocuments(tripId: number): Promise<TripDocument[]> {
    return await db.select().from(tripDocuments).where(eq(tripDocuments.tripId, tripId));
  }

  async createTripDocument(item: InsertTripDocument): Promise<TripDocument> {
    const [newItem] = await db.insert(tripDocuments).values(item).returning();
    return newItem;
  }

  async deleteTripDocument(id: number): Promise<boolean> {
    await db.delete(tripDocuments).where(eq(tripDocuments.id, id));
    return true;
  }

  async getTripContacts(tripId: number): Promise<TripContact[]> {
    return await db.select().from(tripContacts).where(eq(tripContacts.tripId, tripId));
  }

  async createTripContact(item: InsertTripContact): Promise<TripContact> {
    const [newItem] = await db.insert(tripContacts).values(item).returning();
    return newItem;
  }

  async deleteTripContact(id: number): Promise<boolean> {
    await db.delete(tripContacts).where(eq(tripContacts.id, id));
    return true;
  }

  async getPurchaseByEmail(email: string): Promise<Purchase | undefined> {
    const normalizedEmail = email.toLowerCase().trim();
    const [purchase] = await db.select().from(purchases).where(eq(purchases.email, normalizedEmail));
    return purchase;
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases).orderBy(desc(purchases.purchasedAt));
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const normalizedPurchase = {
      ...purchase,
      email: purchase.email.toLowerCase().trim(),
    };
    const [newPurchase] = await db.insert(purchases).values(normalizedPurchase).returning();
    return newPurchase;
  }

  async updatePurchaseTier(email: string, tier: string): Promise<Purchase | undefined> {
    const normalizedEmail = email.toLowerCase().trim();
    const [purchase] = await db.update(purchases).set({ tier }).where(eq(purchases.email, normalizedEmail)).returning();
    return purchase;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.teamId, teamId));
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db.insert(players).values(player).returning();
    return newPlayer;
  }

  async getAllTournamentHistory(): Promise<TournamentHistory[]> {
    return await db.select().from(tournamentHistory);
  }

  async getTournamentByYear(year: number): Promise<TournamentHistory | undefined> {
    const [tournament] = await db.select().from(tournamentHistory).where(eq(tournamentHistory.year, year));
    return tournament;
  }

  async createTournamentHistory(tournament: InsertTournamentHistory): Promise<TournamentHistory> {
    const [newTournament] = await db.insert(tournamentHistory).values(tournament).returning();
    return newTournament;
  }

  async getStadiumSections(stadiumName: string): Promise<StadiumSection[]> {
    return await db.select().from(stadiumSections).where(eq(stadiumSections.stadiumName, stadiumName));
  }

  async getAllStadiumSections(): Promise<StadiumSection[]> {
    return await db.select().from(stadiumSections);
  }

  async createStadiumSection(section: InsertStadiumSection): Promise<StadiumSection> {
    const [newSection] = await db.insert(stadiumSections).values(section).returning();
    return newSection;
  }

  async getAllKnockoutBrackets(): Promise<KnockoutBracket[]> {
    return await db.select().from(knockoutBrackets);
  }

  async getKnockoutBracketsByStage(stage: string): Promise<KnockoutBracket[]> {
    return await db.select().from(knockoutBrackets).where(eq(knockoutBrackets.stage, stage));
  }

  async createKnockoutBracket(bracket: InsertKnockoutBracket): Promise<KnockoutBracket> {
    const [newBracket] = await db.insert(knockoutBrackets).values(bracket).returning();
    return newBracket;
  }

  async updateKnockoutBracket(id: number, bracket: Partial<InsertKnockoutBracket>): Promise<KnockoutBracket | undefined> {
    const [updatedBracket] = await db.update(knockoutBrackets).set(bracket).where(eq(knockoutBrackets.id, id)).returning();
    return updatedBracket;
  }

  async deleteAllKnockoutBrackets(): Promise<void> {
    await db.delete(knockoutBrackets);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getAllWatchHubVenues(): Promise<WatchHubVenue[]> {
    return await db.select().from(watchHubVenues);
  }

  async getWatchHubVenuesByCountry(countryCode: string): Promise<WatchHubVenue[]> {
    return await db.select().from(watchHubVenues).where(eq(watchHubVenues.countryCode, countryCode));
  }

  async getWatchHubVenuesByHostCity(hostCityKey: string): Promise<WatchHubVenue[]> {
    return await db.select().from(watchHubVenues).where(eq(watchHubVenues.hostCityKey, hostCityKey));
  }

  async createWatchHubVenue(venue: InsertWatchHubVenue): Promise<WatchHubVenue> {
    const [newVenue] = await db.insert(watchHubVenues).values(venue).returning();
    return newVenue;
  }

  async getAllWatchHubSubmissions(): Promise<WatchHubSubmission[]> {
    return await db.select().from(watchHubSubmissions);
  }

  async getPendingWatchHubSubmissions(): Promise<WatchHubSubmission[]> {
    return await db.select().from(watchHubSubmissions).where(eq(watchHubSubmissions.status, "pending"));
  }

  async createWatchHubSubmission(submission: InsertWatchHubSubmission): Promise<WatchHubSubmission> {
    const [newSubmission] = await db.insert(watchHubSubmissions).values(submission).returning();
    return newSubmission;
  }

  async approveWatchHubSubmission(id: number): Promise<WatchHubVenue | undefined> {
    const [submission] = await db.select().from(watchHubSubmissions).where(eq(watchHubSubmissions.id, id));
    if (!submission || submission.status !== "pending") return undefined;

    await db.update(watchHubSubmissions)
      .set({ status: "approved", reviewedAt: new Date() })
      .where(eq(watchHubSubmissions.id, id));

    const [newVenue] = await db.insert(watchHubVenues).values({
      countryCode: submission.countryCode,
      countryName: submission.countryName,
      city: submission.city,
      venueName: submission.venueName,
      venueType: submission.venueType,
      address: submission.address,
      capacity: submission.capacity,
      mapsUrl: submission.mapsUrl,
      website: submission.website,
      phone: submission.phone,
      description: submission.description,
      isHostCity: submission.isHostCity,
      hostCityKey: submission.hostCityKey,
      isVerified: 1,
      submittedBy: submission.submitterEmail,
    }).returning();

    return newVenue;
  }

  async rejectWatchHubSubmission(id: number, notes: string): Promise<WatchHubSubmission | undefined> {
    const [updated] = await db.update(watchHubSubmissions)
      .set({ status: "rejected", reviewedAt: new Date(), reviewNotes: notes })
      .where(eq(watchHubSubmissions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();