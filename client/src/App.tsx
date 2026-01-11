import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "@/lib/i18n";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { Legal } from "@/pages/Legal";
import SupportPage from "@/pages/SupportPage";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import NotFound from "@/pages/not-found";

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
      <Route path="/support" component={SupportPage} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      
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
      <Route path="/admin/venues" component={AdminVenues} />
      <Route path="/admin/leads" component={AdminLeadsPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function DirectionHandler() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>
        <LocationProvider>
          <DirectionHandler />
          <Router />
          <Toaster />
        </LocationProvider>
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}

export default App;
