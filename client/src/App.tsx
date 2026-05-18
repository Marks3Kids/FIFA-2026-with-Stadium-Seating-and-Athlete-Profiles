import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SubscriptionProvider, useSubscription } from "@/contexts/SubscriptionContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "@/lib/i18n";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { initRevenueCat } from "@/lib/revenuecat";
import LandingPage from "@/pages/LandingPage";
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import Teams from "@/pages/Teams";
import Cities from "@/pages/Cities";
import Transportation from "@/pages/Transportation";
import InternationalFlights from "@/pages/InternationalFlights";
import DomesticFlights from "@/pages/DomesticFlights";
import RailServices from "@/pages/RailServices";
import BusServices from "@/pages/BusServices";
import CarRentals from "@/pages/CarRentals";
import Dining from "@/pages/Dining";
import Lodging from "@/pages/Lodging";
import Planner from "@/pages/Planner";
import CriticalInfo from "@/pages/CriticalInfo";
import Concierge from "@/pages/Concierge";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Menu from "@/pages/Menu";
import History from "@/pages/History";
import Players from "@/pages/Players";
import StadiumSeating from "@/pages/StadiumSeating";
import TournamentOdds from "@/pages/TournamentOdds";
import BracketChallenge from "@/pages/BracketChallenge";
import Pricing from "@/pages/Pricing";
import WatchHubs from "@/pages/WatchHubs";
import AdminVenues from "@/pages/AdminVenues";
import AdminLeadsPage from "@/pages/AdminLeadsPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminRosters from "@/pages/AdminRosters";
import { Legal } from "@/pages/Legal";
import SupportPage from "@/pages/SupportPage";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import NotFound from "@/pages/not-found";
import RestoreAccess from "@/pages/RestoreAccess";

function Router() {
  return (
    <Switch>
      {/* Public routes - no subscription required */}
      <Route path="/" component={LandingPage} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/bracket" component={BracketChallenge} />
      <Route path="/legal" component={Legal} />
      <Route path="/terms" component={Legal} />
      <Route path="/privacy" component={Legal} />
      <Route path="/refund" component={Legal} />
      <Route path="/policy" component={Legal} />
      <Route path="/support" component={SupportPage} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/restore-access" component={RestoreAccess} />
      
      {/* Free tier - basic access after lead capture */}
      <Route path="/home">{() => <ProtectedRoute requiredTier="free"><Home /></ProtectedRoute>}</Route>
      <Route path="/menu">{() => <ProtectedRoute requiredTier="free"><Menu /></ProtectedRoute>}</Route>
      <Route path="/profile">{() => <ProtectedRoute requiredTier="free"><Profile /></ProtectedRoute>}</Route>
      <Route path="/settings">{() => <ProtectedRoute requiredTier="free"><Settings /></ProtectedRoute>}</Route>
      
      {/* Team Info tier - teams, matches, players */}
      <Route path="/teams">{() => <ProtectedRoute requiredTier="team_info"><Teams /></ProtectedRoute>}</Route>
      <Route path="/matches">{() => <ProtectedRoute requiredTier="team_info"><Matches /></ProtectedRoute>}</Route>
      <Route path="/players">{() => <ProtectedRoute requiredTier="team_info"><Players /></ProtectedRoute>}</Route>
      <Route path="/stadium-seating">{() => <ProtectedRoute requiredTier="team_info"><StadiumSeating /></ProtectedRoute>}</Route>
      <Route path="/odds">{() => <ProtectedRoute requiredTier="team_info"><TournamentOdds /></ProtectedRoute>}</Route>
      <Route path="/history">{() => <ProtectedRoute requiredTier="team_info"><History /></ProtectedRoute>}</Route>
      <Route path="/watch-hubs">{() => <ProtectedRoute requiredTier="team_info"><WatchHubs /></ProtectedRoute>}</Route>
      
      {/* Logistics tier - travel, lodging, safety, host cities */}
      <Route path="/cities">{() => <ProtectedRoute requiredTier="logistics"><Cities /></ProtectedRoute>}</Route>
      <Route path="/transportation">{() => <ProtectedRoute requiredTier="logistics"><Transportation /></ProtectedRoute>}</Route>
      <Route path="/transportation/international-flights">{() => <ProtectedRoute requiredTier="logistics"><InternationalFlights /></ProtectedRoute>}</Route>
      <Route path="/transportation/domestic-flights">{() => <ProtectedRoute requiredTier="logistics"><DomesticFlights /></ProtectedRoute>}</Route>
      <Route path="/transportation/rail-services">{() => <ProtectedRoute requiredTier="logistics"><RailServices /></ProtectedRoute>}</Route>
      <Route path="/transportation/bus-services">{() => <ProtectedRoute requiredTier="logistics"><BusServices /></ProtectedRoute>}</Route>
      <Route path="/transportation/car-rentals">{() => <ProtectedRoute requiredTier="logistics"><CarRentals /></ProtectedRoute>}</Route>
      <Route path="/dining">{() => <ProtectedRoute requiredTier="logistics"><Dining /></ProtectedRoute>}</Route>
      <Route path="/lodging">{() => <ProtectedRoute requiredTier="logistics"><Lodging /></ProtectedRoute>}</Route>
      <Route path="/planner">{() => <ProtectedRoute requiredTier="logistics"><Planner /></ProtectedRoute>}</Route>
      <Route path="/critical-info">{() => <ProtectedRoute requiredTier="logistics"><CriticalInfo /></ProtectedRoute>}</Route>
      <Route path="/critical">{() => <ProtectedRoute requiredTier="logistics"><CriticalInfo /></ProtectedRoute>}</Route>
      
      {/* AI Concierge tier - full AI features */}
      <Route path="/concierge">{() => <ProtectedRoute requiredTier="ai_concierge"><Concierge /></ProtectedRoute>}</Route>
      
      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin2" component={AdminDashboard} />
      <Route path="/admin/venues" component={AdminVenues} />
      <Route path="/admin/leads" component={AdminLeadsPage} />
      <Route path="/admin/rosters" component={AdminRosters} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function DirectionHandler() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = i18n.language;
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.classList.add('notranslate');
  }, [i18n.language]);
  
  return null;
}

// Runs on EVERY route. If a paid user lands on the public LANDING page,
// send them straight to /home (they're already a customer, no need to
// re-pitch). /pricing is INTENTIONALLY NOT in this list — when ProtectedRoute
// redirects an under-tiered user to /pricing for an upgrade, they need to
// actually see the upgrade page, not get bounced back to /home.
const PAID_TIERS = ['team_info', 'logistics', 'ai_concierge'];
const PUBLIC_ONLY_PATHS = ['/'];

function GlobalRedirect() {
  const { subscriptionTier, isLoading, email } = useSubscription();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (isLoading) return; // Wait for backend verify to complete
    console.log(`[GlobalRedirect] isLoading=${isLoading} email=${email} tier=${subscriptionTier} path=${location}`);
    if (PAID_TIERS.includes(subscriptionTier) && PUBLIC_ONLY_PATHS.includes(location)) {
      console.log(`[GlobalRedirect] Paid user (${subscriptionTier}) on landing page (${location}) → redirecting to /home`);
      navigate('/home', { replace: true } as any);
    }
  }, [isLoading, subscriptionTier, location]);

  return null;
}

function RevenueCatBootstrap() {
  const { email } = useSubscription();
  useEffect(() => {
    initRevenueCat(email || undefined).catch((err) =>
      console.error("[RevenueCat] init failed:", err)
    );
  }, [email]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <LocationProvider>
          <DirectionHandler />
          <GlobalRedirect />
          <RevenueCatBootstrap />
          <Router />
          <Toaster />
        </LocationProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}

export default App;
