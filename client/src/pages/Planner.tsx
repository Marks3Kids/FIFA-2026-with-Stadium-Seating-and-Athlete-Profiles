import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, ArrowLeft, Calendar, Plane, Hotel, Utensils, Ticket, 
  FileText, Phone, Clock, MapPin, Trash2, ChevronRight, Luggage,
  ArrowRightLeft, RefreshCw, DollarSign, Globe
} from "lucide-react";
import { Link } from "wouter";
import type { Trip, TripTransportation, TripStay, TripDining, TripMatch, TripAgenda, TripDocument, TripContact } from "@shared/schema";
import { getCurrencyFlagUrl } from "@/lib/flags";
import { CurrencyConverter } from "@/components/CurrencyConverter";

type ViewMode = "list" | "create" | "detail" | "currency" | "timezone";
type DetailTab = "overview" | "transport" | "stays" | "dining" | "matches" | "agenda" | "docs" | "contacts";

interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  lastFetched: number;
  stale?: boolean;
}

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
];

export default function Planner() {
  const { t } = useTranslation();
  const [view, setView] = useState<ViewMode>("list");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [formData, setFormData] = useState({ name: "", startDate: "", endDate: "", notes: "" });
  const queryClient = useQueryClient();

  const { data: trips = [], isLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips"],
  });

  const createTrip = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/trips", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      setView("list");
      setFormData({ name: "", startDate: "", endDate: "", notes: "" });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/trips/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      setView("list");
      setSelectedTrip(null);
    },
  });

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setDetailTab("overview");
    setView("detail");
  };

  if (view === "create") {
    return (
      <Layout pageTitle="nav.planner">
        <div className="pt-12 px-6 pb-8">
          <button 
            onClick={() => setView("list")} 
            className="flex items-center text-muted-foreground mb-6"
            data-testid="back-to-trips"
          >
            <ArrowLeft className="w-5 h-5 mr-2 rtl-flip" />
            {t("common.back")}
          </button>

          <h1 className="text-3xl font-display font-bold text-white mb-6">{t("planner.createTrip")}</h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{t("planner.tripName")}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("planner.tripNamePlaceholder")}
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                data-testid="input-trip-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("planner.startDate")}</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  data-testid="input-start-date"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">{t("planner.endDate")}</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  data-testid="input-end-date"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">{t("planner.notes")}</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t("planner.notesPlaceholder")}
                rows={3}
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                data-testid="input-trip-notes"
              />
            </div>

            <button
              onClick={() => createTrip.mutate(formData)}
              disabled={!formData.name || !formData.startDate || !formData.endDate || createTrip.isPending}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-create-trip"
            >
              {createTrip.isPending ? t("planner.creating") : t("planner.createTrip")}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (view === "detail" && selectedTrip) {
    return <TripDetail trip={selectedTrip} onBack={() => setView("list")} onDelete={() => deleteTrip.mutate(selectedTrip.id)} tab={detailTab} setTab={setDetailTab} />;
  }

  if (view === "currency") {
    return (
      <Layout>
        <CurrencyConverter onBack={() => setView("list")} showBackButton={true} />
      </Layout>
    );
  }

  if (view === "timezone") {
    return <TimeZoneConverter onBack={() => setView("list")} />;
  }

  return (
    <Layout pageTitle="nav.planner">
      <div className="pt-12 px-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">{t("planner.title")}</h1>
          <button
            onClick={() => setView("create")}
            className="bg-primary text-primary-foreground p-3 rounded-full"
            data-testid="button-new-trip"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <p className="text-muted-foreground mb-8">
          {t("planner.description")}
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <button
            onClick={() => setView("currency")}
            className="w-full bg-gradient-to-r from-emerald-600/20 to-primary/20 border border-primary/30 rounded-2xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
            data-testid="button-currency-converter"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">{t("planner.currencyConverter")}</h3>
                <p className="text-sm text-muted-foreground">{t("planner.convertCurrencies")}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary rtl-flip" />
          </button>

          <button
            onClick={() => setView("timezone")}
            className="w-full bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between hover:border-blue-500/50 transition-colors"
            data-testid="button-timezone-converter"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white">{t("planner.timezoneConverter")}</h3>
                <p className="text-sm text-muted-foreground">{t("planner.compareTimezones")}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400 rtl-flip" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">{t("planner.loadingTrips")}</div>
        ) : trips.length === 0 ? (
          <div className="bg-card border border-white/5 rounded-2xl p-8 text-center">
            <Luggage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t("planner.noTrips")}</h3>
            <p className="text-muted-foreground mb-6">{t("planner.noTripsMessage")}</p>
            <button
              onClick={() => setView("create")}
              className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl"
              data-testid="button-create-first-trip"
            >
              {t("planner.createFirstTrip")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => handleViewTrip(trip)}
                className="w-full bg-card border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                data-testid={`trip-card-${trip.id}`}
              >
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white mb-1">{trip.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {trip.startDate} - {trip.endDate}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground rtl-flip" />
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function TripDetail({ trip, onBack, onDelete, tab, setTab }: { 
  trip: Trip; 
  onBack: () => void; 
  onDelete: () => void;
  tab: DetailTab;
  setTab: (tab: DetailTab) => void;
}) {
  const { t } = useTranslation();
  const tabs: { id: DetailTab; label: string; icon: any }[] = [
    { id: "overview", label: t("planner.tabs.overview"), icon: Calendar },
    { id: "transport", label: t("planner.tabs.transport"), icon: Plane },
    { id: "stays", label: t("planner.tabs.stays"), icon: Hotel },
    { id: "dining", label: t("planner.tabs.dining"), icon: Utensils },
    { id: "matches", label: t("planner.tabs.matches"), icon: Ticket },
    { id: "agenda", label: t("planner.tabs.agenda"), icon: Clock },
    { id: "docs", label: t("planner.tabs.docs"), icon: FileText },
    { id: "contacts", label: t("planner.tabs.contacts"), icon: Phone },
  ];

  return (
    <Layout>
      <div className="pt-12 px-6 pb-8">
        <button onClick={onBack} className="flex items-center text-muted-foreground mb-6" data-testid="back-to-list">
          <ArrowLeft className="w-5 h-5 mr-2 rtl-flip" />
          {t("planner.backToTrips")}
        </button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">{trip.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              {trip.startDate} - {trip.endDate}
            </div>
          </div>
          <button
            onClick={onDelete}
            className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
            data-testid="button-delete-trip"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {trip.notes && (
          <p className="text-muted-foreground text-sm mb-6 bg-card/50 p-3 rounded-lg">{trip.notes}</p>
        )}

        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 -mx-6 px-6 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-white"
              }`}
              data-testid={`tab-${t.id}`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && <OverviewTab trip={trip} />}
        {tab === "transport" && <TransportTab tripId={trip.id} />}
        {tab === "stays" && <StaysTab tripId={trip.id} />}
        {tab === "dining" && <DiningTab tripId={trip.id} />}
        {tab === "matches" && <MatchesTab tripId={trip.id} />}
        {tab === "agenda" && <AgendaTab tripId={trip.id} />}
        {tab === "docs" && <DocsTab tripId={trip.id} />}
        {tab === "contacts" && <ContactsTab tripId={trip.id} />}
      </div>
    </Layout>
  );
}

function OverviewTab({ trip }: { trip: Trip }) {
  const { t } = useTranslation();
  const { data: transport = [] } = useQuery<TripTransportation[]>({
    queryKey: [`/api/trips/${trip.id}/transportation`],
  });
  const { data: stays = [] } = useQuery<TripStay[]>({
    queryKey: [`/api/trips/${trip.id}/stays`],
  });
  const { data: dining = [] } = useQuery<TripDining[]>({
    queryKey: [`/api/trips/${trip.id}/dining`],
  });
  const { data: matches = [] } = useQuery<TripMatch[]>({
    queryKey: [`/api/trips/${trip.id}/matches`],
  });

  const stats = [
    { label: t("planner.stats.flights"), count: transport.length, icon: Plane, color: "text-blue-400" },
    { label: t("planner.stats.stays"), count: stays.length, icon: Hotel, color: "text-purple-400" },
    { label: t("planner.stats.reservations"), count: dining.length, icon: Utensils, color: "text-orange-400" },
    { label: t("planner.stats.matches"), count: matches.length, icon: Ticket, color: "text-green-400" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">{t("planner.tripSummary")}</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-white/5 rounded-xl p-4">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.count}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransportTab({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "flight",
    provider: "",
    confirmationNumber: "",
    departureDate: "",
    departureTime: "",
    departureLocation: "",
    arrivalDate: "",
    arrivalTime: "",
    arrivalLocation: "",
    seatInfo: "",
    notes: "",
  });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<TripTransportation[]>({
    queryKey: [`/api/trips/${tripId}/transportation`],
  });

  const create = useMutation({
    mutationFn: async (data: typeof form) => apiRequest("POST", `/api/trips/${tripId}/transportation`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/transportation`] });
      setShowForm(false);
      setForm({ type: "flight", provider: "", confirmationNumber: "", departureDate: "", departureTime: "", departureLocation: "", arrivalDate: "", arrivalTime: "", arrivalLocation: "", seatInfo: "", notes: "" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/transportation/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/transportation`] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t("planner.transport.title")}</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium" data-testid="button-add-transport">
          {showForm ? t("common.cancel") : t("common.add")}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-white/10 rounded-xl p-4 space-y-3">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white" data-testid="select-transport-type">
            <option value="flight">{t("planner.transport.types.flight")}</option>
            <option value="train">{t("planner.transport.types.train")}</option>
            <option value="bus">{t("planner.transport.types.bus")}</option>
            <option value="car">{t("planner.transport.types.car")}</option>
            <option value="rideshare">{t("planner.transport.types.rideshare")}</option>
          </select>
          <input type="text" placeholder={t("planner.transport.providerPlaceholder")} value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-transport-provider" />
          <input type="text" placeholder={t("planner.transport.confirmationPlaceholder")} value={form.confirmationNumber} onChange={(e) => setForm({ ...form, confirmationNumber: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.departureDate} onChange={(e) => setForm({ ...form, departureDate: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
            <input type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
          <input type="text" placeholder={t("planner.transport.fromPlaceholder")} value={form.departureLocation} onChange={(e) => setForm({ ...form, departureLocation: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-transport-from" />
          <input type="text" placeholder={t("planner.transport.toPlaceholder")} value={form.arrivalLocation} onChange={(e) => setForm({ ...form, arrivalLocation: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-transport-to" />
          <button onClick={() => create.mutate(form)} disabled={!form.provider || !form.departureDate || !form.departureLocation || !form.arrivalLocation} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg disabled:opacity-50" data-testid="button-save-transport">
            {t("common.save")}
          </button>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-sm">{t("planner.transport.noItems")}</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4" data-testid={`transport-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase">{item.type}</span>
                  <span className="font-bold text-white">{item.provider}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.departureLocation} → {item.arrivalLocation}
                </div>
                <div className="text-sm text-muted-foreground">{item.departureDate} {item.departureTime}</div>
                {item.confirmationNumber && <div className="text-xs text-primary mt-1">#{item.confirmationNumber}</div>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-red-400 p-1" data-testid={`delete-transport-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StaysTab({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ hotelName: "", address: "", checkInDate: "", checkOutDate: "", checkInTime: "", confirmationNumber: "", roomType: "", guests: 2, notes: "" });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<TripStay[]>({ queryKey: [`/api/trips/${tripId}/stays`] });

  const create = useMutation({
    mutationFn: async (data: typeof form) => apiRequest("POST", `/api/trips/${tripId}/stays`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/stays`] });
      setShowForm(false);
      setForm({ hotelName: "", address: "", checkInDate: "", checkOutDate: "", checkInTime: "", confirmationNumber: "", roomType: "", guests: 2, notes: "" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/stays/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/stays`] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t("planner.stays.title")}</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium" data-testid="button-add-stay">
          {showForm ? t("common.cancel") : t("common.add")}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-white/10 rounded-xl p-4 space-y-3">
          <input type="text" placeholder={t("planner.stays.hotelName")} value={form.hotelName} onChange={(e) => setForm({ ...form, hotelName: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-stay-name" />
          <input type="text" placeholder={t("planner.stays.address")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">{t("planner.stays.checkIn")}</label>
              <input type="date" value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("planner.stays.checkOut")}</label>
              <input type="date" value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>
          <input type="text" placeholder={t("planner.transport.confirmationPlaceholder")} value={form.confirmationNumber} onChange={(e) => setForm({ ...form, confirmationNumber: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <button onClick={() => create.mutate(form)} disabled={!form.hotelName || !form.checkInDate || !form.checkOutDate} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg disabled:opacity-50" data-testid="button-save-stay">
            {t("common.save")}
          </button>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-sm">{t("planner.stays.noItems")}</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4" data-testid={`stay-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white mb-1">{item.hotelName}</div>
                <div className="text-sm text-muted-foreground">{item.checkInDate} - {item.checkOutDate}</div>
                {item.address && <div className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{item.address}</div>}
                {item.confirmationNumber && <div className="text-xs text-primary mt-1">#{item.confirmationNumber}</div>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-red-400 p-1" data-testid={`delete-stay-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function DiningTab({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ restaurantName: "", date: "", time: "", partySize: 2, confirmationNumber: "", address: "", notes: "" });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<TripDining[]>({ queryKey: [`/api/trips/${tripId}/dining`] });

  const create = useMutation({
    mutationFn: async (data: typeof form) => apiRequest("POST", `/api/trips/${tripId}/dining`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/dining`] });
      setShowForm(false);
      setForm({ restaurantName: "", date: "", time: "", partySize: 2, confirmationNumber: "", address: "", notes: "" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/dining/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/dining`] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t("planner.dining.title")}</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium" data-testid="button-add-dining">
          {showForm ? t("common.cancel") : t("common.add")}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-white/10 rounded-xl p-4 space-y-3">
          <input type="text" placeholder={t("planner.dining.restaurantName")} value={form.restaurantName} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-dining-name" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
          <input type="number" placeholder={t("planner.dining.partySize")} value={form.partySize} onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value) })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white" min={1} />
          <input type="text" placeholder={t("planner.transport.confirmationPlaceholder")} value={form.confirmationNumber} onChange={(e) => setForm({ ...form, confirmationNumber: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <button onClick={() => create.mutate(form)} disabled={!form.restaurantName || !form.date} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg disabled:opacity-50" data-testid="button-save-dining">
            {t("common.save")}
          </button>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-sm">{t("planner.dining.noItems")}</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4" data-testid={`dining-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white mb-1">{item.restaurantName}</div>
                <div className="text-sm text-muted-foreground">{item.date} {item.time && `at ${item.time}`}</div>
                {item.partySize && <div className="text-sm text-muted-foreground">Party of {item.partySize}</div>}
                {item.confirmationNumber && <div className="text-xs text-primary mt-1">#{item.confirmationNumber}</div>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-red-400 p-1" data-testid={`delete-dining-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function MatchesTab({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ matchDescription: "", date: "", time: "", stadium: "", city: "", section: "", row: "", seat: "", ticketConfirmation: "", notes: "" });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<TripMatch[]>({ queryKey: [`/api/trips/${tripId}/matches`] });

  const create = useMutation({
    mutationFn: async (data: typeof form) => apiRequest("POST", `/api/trips/${tripId}/matches`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/matches`] });
      setShowForm(false);
      setForm({ matchDescription: "", date: "", time: "", stadium: "", city: "", section: "", row: "", seat: "", ticketConfirmation: "", notes: "" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/trip-matches/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/matches`] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t("planner.matchesTab.title")}</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium" data-testid="button-add-match">
          {showForm ? t("common.cancel") : t("common.add")}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-white/10 rounded-xl p-4 space-y-3">
          <input type="text" placeholder={t("planner.matchesTab.matchPlaceholder")} value={form.matchDescription} onChange={(e) => setForm({ ...form, matchDescription: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-match-description" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
          <input type="text" placeholder={t("planner.matchesTab.stadium")} value={form.stadium} onChange={(e) => setForm({ ...form, stadium: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <input type="text" placeholder={t("cities.title")} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <div className="grid grid-cols-3 gap-2">
            <input type="text" placeholder={t("planner.matchesTab.section")} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
            <input type="text" placeholder="Row" value={form.row} onChange={(e) => setForm({ ...form, row: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
            <input type="text" placeholder="Seat" value={form.seat} onChange={(e) => setForm({ ...form, seat: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          </div>
          <input type="text" placeholder={t("planner.matchesTab.confirmationPlaceholder")} value={form.ticketConfirmation} onChange={(e) => setForm({ ...form, ticketConfirmation: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <button onClick={() => create.mutate(form)} disabled={!form.matchDescription || !form.date} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg disabled:opacity-50" data-testid="button-save-match">
            {t("common.save")}
          </button>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-sm">{t("planner.matchesTab.noItems")}</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4" data-testid={`match-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white mb-1">{item.matchDescription}</div>
                <div className="text-sm text-muted-foreground">{item.date} {item.time && `at ${item.time}`}</div>
                {item.stadium && <div className="text-sm text-muted-foreground">{item.stadium}, {item.city}</div>}
                {item.section && <div className="text-xs text-muted-foreground">Section {item.section}, Row {item.row}, Seat {item.seat}</div>}
                {item.ticketConfirmation && <div className="text-xs text-primary mt-1">#{item.ticketConfirmation}</div>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-red-400 p-1" data-testid={`delete-match-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AgendaTab({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", title: "", description: "", location: "", category: "activity" });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<TripAgenda[]>({ queryKey: [`/api/trips/${tripId}/agenda`] });

  const create = useMutation({
    mutationFn: async (data: typeof form) => apiRequest("POST", `/api/trips/${tripId}/agenda`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/agenda`] });
      setShowForm(false);
      setForm({ date: "", time: "", title: "", description: "", location: "", category: "activity" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/agenda/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/agenda`] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t("planner.agenda.title")}</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium" data-testid="button-add-agenda">
          {showForm ? t("common.cancel") : t("common.add")}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-white/10 rounded-xl p-4 space-y-3">
          <input type="text" placeholder={t("planner.agenda.titlePlaceholder")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-agenda-title" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
          <input type="text" placeholder={t("planner.agenda.locationPlaceholder")} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <textarea placeholder={t("planner.agenda.notesPlaceholder")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground resize-none" rows={2} />
          <button onClick={() => create.mutate(form)} disabled={!form.title || !form.date} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg disabled:opacity-50" data-testid="button-save-agenda">
            {t("common.save")}
          </button>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-sm">{t("planner.agenda.noItems")}</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4" data-testid={`agenda-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white mb-1">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.date} {item.time && `at ${item.time}`}</div>
                {item.location && <div className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</div>}
                {item.description && <div className="text-sm text-muted-foreground mt-1">{item.description}</div>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-red-400 p-1" data-testid={`delete-agenda-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function DocsTab({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", documentType: "passport", identifier: "", expiryDate: "", notes: "" });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<TripDocument[]>({ queryKey: [`/api/trips/${tripId}/documents`] });

  const create = useMutation({
    mutationFn: async (data: typeof form) => apiRequest("POST", `/api/trips/${tripId}/documents`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/documents`] });
      setShowForm(false);
      setForm({ label: "", documentType: "passport", identifier: "", expiryDate: "", notes: "" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/documents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/documents`] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t("planner.docs.title")}</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium" data-testid="button-add-doc">
          {showForm ? t("common.cancel") : t("common.add")}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-white/10 rounded-xl p-4 space-y-3">
          <input type="text" placeholder={t("planner.docs.titlePlaceholder")} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-doc-label" />
          <select value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white" data-testid="select-doc-type">
            <option value="passport">{t("planner.docs.types.passport")}</option>
            <option value="visa">{t("planner.docs.types.visa")}</option>
            <option value="id">ID Card</option>
            <option value="insurance">{t("planner.docs.types.insurance")}</option>
            <option value="other">{t("planner.docs.types.other")}</option>
          </select>
          <input type="text" placeholder={t("planner.docs.referenceNumber")} value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <div>
            <label className="text-xs text-muted-foreground">{t("planner.docs.expiryDate")}</label>
            <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white" />
          </div>
          <button onClick={() => create.mutate(form)} disabled={!form.label} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg disabled:opacity-50" data-testid="button-save-doc">
            {t("common.save")}
          </button>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-sm">{t("planner.docs.noItems")}</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4" data-testid={`doc-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full uppercase">{item.documentType}</span>
                  <span className="font-bold text-white">{item.label}</span>
                </div>
                {item.identifier && <div className="text-sm text-muted-foreground">#{item.identifier}</div>}
                {item.expiryDate && <div className="text-sm text-muted-foreground">Expires: {item.expiryDate}</div>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-red-400 p-1" data-testid={`delete-doc-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ContactsTab({ tripId }: { tripId: number }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", phone: "", email: "", notes: "" });
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<TripContact[]>({ queryKey: [`/api/trips/${tripId}/contacts`] });

  const create = useMutation({
    mutationFn: async (data: typeof form) => apiRequest("POST", `/api/trips/${tripId}/contacts`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/contacts`] });
      setShowForm(false);
      setForm({ name: "", role: "", phone: "", email: "", notes: "" });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => apiRequest("DELETE", `/api/contacts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}/contacts`] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t("planner.contacts.title")}</h3>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium" data-testid="button-add-contact">
          {showForm ? t("common.cancel") : t("common.add")}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-white/10 rounded-xl p-4 space-y-3">
          <input type="text" placeholder={t("planner.contacts.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" data-testid="input-contact-name" />
          <input type="text" placeholder={t("planner.contacts.relationship")} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <input type="tel" placeholder={t("planner.contacts.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <input type="email" placeholder={t("planner.contacts.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-muted-foreground" />
          <button onClick={() => create.mutate(form)} disabled={!form.name} className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg disabled:opacity-50" data-testid="button-save-contact">
            {t("common.save")}
          </button>
        </div>
      )}

      {items.length === 0 && !showForm ? (
        <p className="text-muted-foreground text-sm">{t("planner.contacts.noItems")}</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="bg-card border border-white/5 rounded-xl p-4" data-testid={`contact-item-${item.id}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-white mb-1">{item.name}</div>
                {item.role && <div className="text-sm text-muted-foreground">{item.role}</div>}
                {item.phone && <div className="text-sm text-primary">{item.phone}</div>}
                {item.email && <div className="text-sm text-muted-foreground">{item.email}</div>}
              </div>
              <button onClick={() => remove.mutate(item.id)} className="text-red-400 p-1" data-testid={`delete-contact-${item.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const HOST_CITY_TIMEZONES = [
  { city: "New York/New Jersey", timezone: "America/New_York", country: "USA", flag: "us" },
  { city: "Los Angeles", timezone: "America/Los_Angeles", country: "USA", flag: "us" },
  { city: "Miami", timezone: "America/New_York", country: "USA", flag: "us" },
  { city: "Houston", timezone: "America/Chicago", country: "USA", flag: "us" },
  { city: "Dallas", timezone: "America/Chicago", country: "USA", flag: "us" },
  { city: "Atlanta", timezone: "America/New_York", country: "USA", flag: "us" },
  { city: "Seattle", timezone: "America/Los_Angeles", country: "USA", flag: "us" },
  { city: "San Francisco", timezone: "America/Los_Angeles", country: "USA", flag: "us" },
  { city: "Philadelphia", timezone: "America/New_York", country: "USA", flag: "us" },
  { city: "Boston (Foxborough)", timezone: "America/New_York", country: "USA", flag: "us" },
  { city: "Kansas City", timezone: "America/Chicago", country: "USA", flag: "us" },
  { city: "Mexico City", timezone: "America/Mexico_City", country: "Mexico", flag: "mx" },
  { city: "Guadalajara", timezone: "America/Mexico_City", country: "Mexico", flag: "mx" },
  { city: "Monterrey", timezone: "America/Monterrey", country: "Mexico", flag: "mx" },
  { city: "Toronto", timezone: "America/Toronto", country: "Canada", flag: "ca" },
  { city: "Vancouver", timezone: "America/Vancouver", country: "Canada", flag: "ca" },
];

const COMMON_TIMEZONES = [
  { label: "London (GMT)", timezone: "Europe/London" },
  { label: "Paris (CET)", timezone: "Europe/Paris" },
  { label: "Tokyo (JST)", timezone: "Asia/Tokyo" },
  { label: "Sydney (AEST)", timezone: "Australia/Sydney" },
  { label: "Dubai (GST)", timezone: "Asia/Dubai" },
  { label: "São Paulo (BRT)", timezone: "America/Sao_Paulo" },
  { label: "Buenos Aires (ART)", timezone: "America/Argentina/Buenos_Aires" },
];

function TimeZoneConverter({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState(HOST_CITY_TIMEZONES[0]);
  const [homeTimezone, setHomeTimezone] = useState(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(date);
  };

  const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    }).format(date);
  };

  const getTimeDifference = () => {
    const homeOffset = new Date().toLocaleString('en-US', { timeZone: homeTimezone, timeZoneName: 'shortOffset' });
    const cityOffset = new Date().toLocaleString('en-US', { timeZone: selectedCity.timezone, timeZoneName: 'shortOffset' });
    
    const homeMatch = homeOffset.match(/GMT([+-]\d+)/);
    const cityMatch = cityOffset.match(/GMT([+-]\d+)/);
    
    const homeHours = homeMatch ? parseInt(homeMatch[1]) : 0;
    const cityHours = cityMatch ? parseInt(cityMatch[1]) : 0;
    
    const diff = cityHours - homeHours;
    
    if (diff === 0) return t("planner.timezone.sameTime");
    if (diff > 0) return `+${diff} ${t("planner.timezone.hours")}`;
    return `${diff} ${t("planner.timezone.hours")}`;
  };

  const getTimezoneName = (timezone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      }).formatToParts(currentTime).find(p => p.type === 'timeZoneName')?.value || timezone;
    } catch {
      return timezone;
    }
  };

  return (
    <Layout pageTitle="planner.timezoneConverter">
      <div className="pt-12 px-6 pb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-6"
          data-testid="button-back-from-timezone"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-display font-bold text-white">{t("planner.timezoneConverter")}</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{t("planner.timezone.yourTime")}</p>
                <p className="text-2xl font-display font-bold text-white">{formatTime(currentTime, homeTimezone)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(currentTime, homeTimezone)}</p>
                <p className="text-xs text-blue-400 mt-1">{getTimezoneName(homeTimezone)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{selectedCity.city}</p>
                <p className="text-2xl font-display font-bold text-primary">{formatTime(currentTime, selectedCity.timezone)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(currentTime, selectedCity.timezone)}</p>
                <p className="text-xs text-blue-400 mt-1">{getTimezoneName(selectedCity.timezone)}</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                {t("planner.timezone.difference")}: {getTimeDifference()}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("planner.timezone.selectHostCity")}</label>
            <select
              value={selectedCity.city}
              onChange={(e) => {
                const city = HOST_CITY_TIMEZONES.find(c => c.city === e.target.value);
                if (city) setSelectedCity(city);
              }}
              className="w-full bg-card border border-white/10 rounded-xl px-4 py-4 text-white font-medium focus:outline-none focus:border-primary appearance-none"
              data-testid="select-host-city"
            >
              {HOST_CITY_TIMEZONES.map((city) => (
                <option key={city.city} value={city.city} className="bg-card">
                  {city.city}, {city.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("planner.timezone.yourTimezone")}</label>
            <select
              value={homeTimezone}
              onChange={(e) => setHomeTimezone(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-xl px-4 py-4 text-white font-medium focus:outline-none focus:border-primary appearance-none"
              data-testid="select-home-timezone"
            >
              <optgroup label={t("planner.timezone.detected")}>
                <option value={Intl.DateTimeFormat().resolvedOptions().timeZone} className="bg-card">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone} ({t("planner.timezone.yourDevice")})
                </option>
              </optgroup>
              <optgroup label={t("planner.timezone.commonTimezones")}>
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.timezone} value={tz.timezone} className="bg-card">
                    {tz.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">{t("planner.timezone.quickSelect")}</p>
            <div className="grid grid-cols-5 gap-2">
              {HOST_CITY_TIMEZONES.filter(c => ["New York/New Jersey", "Dallas", "Los Angeles", "Mexico City", "Toronto"].includes(c.city)).map((city) => (
                <button
                  key={city.city}
                  onClick={() => setSelectedCity(city)}
                  className={`py-2 px-1 rounded-xl text-center transition-colors flex flex-col items-center ${
                    selectedCity.city === city.city
                      ? "bg-blue-500 text-white"
                      : "bg-card border border-white/10 text-white hover:bg-white/5"
                  }`}
                  data-testid={`quick-city-${city.city}`}
                >
                  <img src={`https://flagcdn.com/w40/${city.flag}.png`} alt={city.country} className="w-6 h-4 object-cover rounded mb-1" />
                  <div className="text-[10px] font-medium leading-tight">{city.city.split('/')[0].split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card/50 border border-white/5 rounded-xl p-4">
            <p className="text-xs text-muted-foreground text-center">
              {t("planner.timezone.tip")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
