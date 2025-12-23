import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import "@/lib/i18n";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/teams" component={Teams} />
      <Route path="/cities" component={Cities} />
      <Route path="/menu" component={Menu} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/matches" component={Matches} />
      <Route path="/transportation" component={Transportation} />
      <Route path="/transportation/international-flights" component={InternationalFlights} />
      <Route path="/transportation/domestic-flights" component={DomesticFlights} />
      <Route path="/transportation/rail-services" component={RailServices} />
      <Route path="/transportation/bus-services" component={BusServices} />
      <Route path="/transportation/car-rentals" component={CarRentals} />
      <Route path="/dining" component={Dining} />
      <Route path="/lodging" component={Lodging} />
      <Route path="/planner" component={Planner} />
      <Route path="/critical-info" component={CriticalInfo} />
      <Route path="/critical" component={CriticalInfo} />
      <Route path="/concierge" component={Concierge} />
      <Route path="/history" component={History} />
      <Route path="/players" component={Players} />
      <Route path="/stadium-seating" component={StadiumSeating} />
      <Route path="/odds" component={TournamentOdds} />
      <Route path="/bracket" component={BracketChallenge} />
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
        <DirectionHandler />
        <Router />
        <Toaster />
      </SubscriptionProvider>
    </QueryClientProvider>
  );
}

export default App;
