import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import {
  Download, Users, CreditCard, Mail, Calendar, ArrowLeft,
  LogOut, ShieldCheck, TrendingUp, BarChart3, RefreshCw, CheckCircle2, Trophy,
  Globe, ExternalLink
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useSubscription } from "@/contexts/SubscriptionContext";

// Production URL — set via VITE_PROD_URL build-time env var
const PROD_URL = import.meta.env.VITE_PROD_URL || "https://championshipconcierge.com";
const ADMIN_KEY = "admin2026cc";

interface ProdStats {
  leadCount: number;
  purchaseCount: number;
  totalRevenue: string;
  tierCounts: Record<string, number>;
  recentPurchases: { email: string; tier: string; purchasedAt: string }[];
  recentLeads: { email: string; name?: string; city?: string; createdAt: string }[];
  refreshedAt: string;
}

interface Lead {
  id: number;
  email: string;
  name?: string;
  city?: string;
  source?: string;
  createdAt: string;
}

interface Purchase {
  id: number;
  email: string;
  tier: string;
  stripeSessionId: string;
  purchasedAt: string;
}

function AdminLogin({ role, onLogin }: { role: string; onLogin: (email: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiRequest("POST", "/api/admin/login", { password: pwd, role });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_role", data.role);
        sessionStorage.setItem("admin_email", data.email);
        onLogin(data.email);
      } else {
        setError("Invalid password");
      }
    },
    onError: () => {
      setError("Invalid password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-card border-white/10">
        <CardHeader className="text-center">
          <ShieldCheck className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-white">
            {role === "admin2" ? "Admin 2 Access" : "Admin Access"}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Championship Concierge</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Verifying..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const [location] = useLocation();
  const role = location === "/admin2" ? "admin2" : "admin";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setSubscription } = useSubscription();

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    const savedEmail = sessionStorage.getItem("admin_email");
    if (auth === "true" && savedEmail) {
      setSubscription(savedEmail, "ai_concierge");
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    setSubscription(email, "ai_concierge");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_role");
    sessionStorage.removeItem("admin_email");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin role={role} onLogin={handleLogin} />;
  }

  return <AdminDashboardContent onLogout={handleLogout} />;
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <Card className="bg-card border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${color || "text-white"}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function AdminDashboardContent({ onLogout }: { onLogout: () => void }) {
  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads"],
  });

  const { data: purchases = [], isLoading: purchasesLoading } = useQuery<Purchase[]>({
    queryKey: ["/api/admin/purchases"],
  });

  const [prodStats, setProdStats] = useState<ProdStats | null>(null);
  const [prodLoading, setProdLoading] = useState(false);
  const [prodError, setProdError] = useState(false);

  const isDevEnv = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1");

  const fetchProdStats = useCallback(async () => {
    setProdLoading(true);
    setProdError(false);
    try {
      const url = isDevEnv
        ? `${PROD_URL}/api/admin/production-stats?key=${ADMIN_KEY}`
        : `/api/admin/production-stats?key=${ADMIN_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setProdStats(data);
    } catch {
      setProdError(true);
    } finally {
      setProdLoading(false);
    }
  }, [isDevEnv]);

  useEffect(() => {
    fetchProdStats();
  }, [fetchProdStats]);

  const updateTeamsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/update-teams", {});
      return res.json();
    },
  });

  const seedPlayersMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/seed-remaining-players", {});
      return res.json();
    },
  });

  const tierLabels: Record<string, string> = {
    team_info: "Team Info ($1.99)",
    logistics: "Fan Travel Pack ($7.99)",
    fan_travel_pack: "Fan Travel Pack ($7.99)",
    ai_concierge: "AI Concierge ($14.99)",
  };

  const tierColors: Record<string, string> = {
    team_info: "bg-blue-500",
    logistics: "bg-purple-500",
    fan_travel_pack: "bg-purple-500",
    ai_concierge: "bg-emerald-500",
  };

  const tierRevenue: Record<string, number> = {
    team_info: 1.99,
    logistics: 7.99,
    fan_travel_pack: 7.99,
    ai_concierge: 14.99,
  };

  const totalRevenue = purchases.reduce((sum, p) => sum + (tierRevenue[p.tier] || 0), 0);
  const teamInfoCount = purchases.filter(p => p.tier === "team_info").length;
  const fanTravelCount = purchases.filter(p => p.tier === "logistics" || p.tier === "fan_travel_pack").length;
  const conciergeCount = purchases.filter(p => p.tier === "ai_concierge").length;
  const uniqueCustomers = new Set([...purchases.map(p => p.email), ...leads.map(l => l.email)]).size;
  const conversionRate = uniqueCustomers > 0
    ? ((purchases.length / uniqueCustomers) * 100).toFixed(1)
    : "0.0";

  // Combine and sort all activity by date
  const allActivity = [
    ...purchases.map(p => ({
      type: "purchase" as const,
      email: p.email,
      tier: p.tier,
      date: p.purchasedAt,
    })),
    ...leads.map(l => ({
      type: "download" as const,
      email: l.email,
      tier: null,
      date: l.createdAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 30);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Championship Concierge 2026</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-white"
              onClick={async () => {
                if ('serviceWorker' in navigator) {
                  const regs = await navigator.serviceWorker.getRegistrations();
                  await Promise.all(regs.map(r => r.unregister()));
                }
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
                localStorage.removeItem("app_version");
                window.location.reload();
              }}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Clear Cache
            </Button>
            <Link href="/home">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Enter App (Full Access)
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Row 1: Primary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            sub="One-time purchases"
            color="text-emerald-400"
          />
          <StatCard
            icon={<CreditCard className="w-4 h-4" />}
            label="Total Sales"
            value={purchases.length}
            sub={`${conversionRate}% conversion`}
            color="text-white"
          />
          <StatCard
            icon={<Download className="w-4 h-4" />}
            label="Free Downloads"
            value={leads.length}
            sub="Bracket downloads"
            color="text-blue-400"
          />
          <StatCard
            icon={<Users className="w-4 h-4" />}
            label="Unique Users"
            value={uniqueCustomers}
            sub="All emails captured"
            color="text-purple-400"
          />
        </div>

        {/* Row 2: Per-Tier Breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-card border-blue-500/20 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Team Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{teamInfoCount}</p>
              <p className="text-xs text-muted-foreground">× $1.99 = <span className="text-emerald-400">${(teamInfoCount * 1.99).toFixed(2)}</span></p>
            </CardContent>
          </Card>
          <Card className="bg-card border-purple-500/20 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Fan Travel Pack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{fanTravelCount}</p>
              <p className="text-xs text-muted-foreground">× $7.99 = <span className="text-emerald-400">${(fanTravelCount * 7.99).toFixed(2)}</span></p>
            </CardContent>
          </Card>
          <Card className="bg-card border-emerald-500/20 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                AI Concierge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{conciergeCount}</p>
              <p className="text-xs text-muted-foreground">× $14.99 = <span className="text-emerald-400">${(conciergeCount * 14.99).toFixed(2)}</span></p>
            </CardContent>
          </Card>
        </div>

        {/* Production Stats Panel */}
        <Card className="bg-gradient-to-r from-emerald-950/60 to-blue-950/60 border border-emerald-500/30 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Globe className="w-4 h-4 text-emerald-400" />
                Live Production Data
                {isDevEnv && (
                  <Badge className="text-xs bg-blue-600 ml-1">From Live App</Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {prodStats && (
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(prodStats.refreshedAt).toLocaleTimeString()}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-emerald-500/30 hover:border-emerald-500"
                  onClick={fetchProdStats}
                  disabled={prodLoading}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${prodLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                {isDevEnv && (
                  <a href={`${PROD_URL}/admin`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-xs border-emerald-500/30 hover:border-emerald-500">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Prod Admin
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {prodLoading && !prodStats ? (
              <p className="text-muted-foreground text-sm">Connecting to production...</p>
            ) : prodError && !prodStats ? (
              <p className="text-red-400 text-sm">Could not reach production. Make sure the app is published and deployed.</p>
            ) : prodStats ? (
              <div className="space-y-4">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-400">${prodStats.totalRevenue}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Revenue</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-white">{prodStats.purchaseCount}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Sales</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{prodStats.leadCount}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Leads</p>
                  </div>
                </div>
                {/* Tier breakdown */}
                {Object.keys(prodStats.tierCounts).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(prodStats.tierCounts).map(([tier, count]) => (
                      <Badge key={tier} variant="outline" className="text-xs">
                        {tier === "ai_concierge" ? "AI Concierge" : tier === "team_info" ? "Team Info" : "Fan Travel"}: {count}
                      </Badge>
                    ))}
                  </div>
                )}
                {/* Downloads */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-white/10">
                  <p className="text-xs text-muted-foreground w-full mb-1">Export from production:</p>
                  <a
                    href={isDevEnv
                      ? `${PROD_URL}/api/admin/leads/export?key=${ADMIN_KEY}`
                      : `/api/admin/leads/export?key=${ADMIN_KEY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      {prodStats.leadCount} Leads CSV
                    </Button>
                  </a>
                  <a
                    href={isDevEnv
                      ? `${PROD_URL}/api/admin/purchases/export?key=${ADMIN_KEY}`
                      : `/api/admin/purchases/export?key=${ADMIN_KEY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      {prodStats.purchaseCount} Purchases CSV
                    </Button>
                  </a>
                </div>
                {/* Recent activity */}
                {prodStats.recentPurchases.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Recent purchases (production):</p>
                    <div className="space-y-1">
                      {prodStats.recentPurchases.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-white/5 rounded px-3 py-1.5">
                          <span className="text-white">{p.email}</span>
                          <Badge className="text-xs bg-emerald-600">
                            {p.tier === "ai_concierge" ? "AI Concierge" : p.tier === "team_info" ? "Team Info" : "Fan Travel"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Purchases */}
          <Card className="bg-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Purchases
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{purchases.length} total</Badge>
                  <a href="/api/admin/purchases/export" download>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Export CSV
                    </Button>
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {purchasesLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : purchases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No purchases yet — share the app!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {purchases.slice().reverse().map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          {purchase.email}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(purchase.purchasedAt).toLocaleDateString()} {new Date(purchase.purchasedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={`text-xs ${tierColors[purchase.tier] || "bg-gray-500"}`}>
                        {tierLabels[purchase.tier] || purchase.tier}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Free Bracket Downloads */}
          <Card className="bg-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-400" />
                  Free Bracket Downloads
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{leads.length} total</Badge>
                  <a href="/api/admin/leads/export" download>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Export CSV
                    </Button>
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : leads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Download className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No downloads yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {leads.slice().reverse().map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          {lead.email}
                        </p>
                        {lead.name && <p className="text-xs text-muted-foreground mt-0.5">{lead.name}{lead.city ? ` — ${lead.city}` : ""}</p>}
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">Free</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card className="bg-card border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Recent Activity
              <Badge variant="outline" className="ml-auto">{allActivity.length} events</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === "purchase" ? "bg-emerald-500/20" : "bg-blue-500/20"
                    }`}>
                      {item.type === "purchase"
                        ? <CreditCard className="w-4 h-4 text-emerald-400" />
                        : <Download className="w-4 h-4 text-blue-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type === "purchase"
                          ? `Purchased: ${tierLabels[item.tier!] || item.tier}`
                          : "Downloaded free bracket"
                        }
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Tools */}
        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-yellow-400" />
              Admin Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm font-medium text-white">Update Teams</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Sync the database with the final 48 FIFA 2026 qualified teams.
                  Removes unqualified teams and adds confirmed ones.
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => updateTeamsMutation.mutate()}
                  disabled={updateTeamsMutation.isPending || updateTeamsMutation.isSuccess}
                >
                  {updateTeamsMutation.isPending ? (
                    <><RefreshCw className="w-3 h-3 mr-2 animate-spin" />Updating...</>
                  ) : updateTeamsMutation.isSuccess ? (
                    <><CheckCircle2 className="w-3 h-3 mr-2" />Done!</>
                  ) : (
                    "Update Teams Now"
                  )}
                </Button>
                {updateTeamsMutation.isSuccess && (
                  <p className="text-xs text-emerald-400 mt-2 text-center">
                    {(updateTeamsMutation.data as any)?.message}
                  </p>
                )}
                {updateTeamsMutation.isError && (
                  <p className="text-xs text-red-400 mt-2 text-center">Update failed. Try again.</p>
                )}
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <p className="text-sm font-medium text-white">Seed Player Profiles</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Add key player data for all remaining 37 teams not yet in the database. Safe to run — skips any players already added.
                </p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => seedPlayersMutation.mutate()}
                  disabled={seedPlayersMutation.isPending || seedPlayersMutation.isSuccess}
                >
                  {seedPlayersMutation.isPending ? (
                    <><RefreshCw className="w-3 h-3 mr-2 animate-spin" />Adding Players...</>
                  ) : seedPlayersMutation.isSuccess ? (
                    <><CheckCircle2 className="w-3 h-3 mr-2" />Done!</>
                  ) : (
                    "Add All Team Players"
                  )}
                </Button>
                {seedPlayersMutation.isSuccess && (
                  <p className="text-xs text-emerald-400 mt-2 text-center">
                    {(seedPlayersMutation.data as any)?.message}
                  </p>
                )}
                {seedPlayersMutation.isError && (
                  <p className="text-xs text-red-400 mt-2 text-center">Failed. Try again.</p>
                )}
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <p className="text-sm font-medium text-white">Export Purchases</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Download a full CSV of all {purchases.length} purchase records including emails, tiers, and timestamps.
                </p>
                <a href="/api/admin/purchases/export" download>
                  <Button size="sm" variant="outline" className="w-full">
                    Download CSV
                  </Button>
                </a>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <p className="text-sm font-medium text-white">Export Downloads</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Download a full CSV of all {leads.length} bracket download leads including names and emails.
                </p>
                <a href="/api/admin/leads/export" download>
                  <Button size="sm" variant="outline" className="w-full">
                    Download CSV
                  </Button>
                </a>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/leads">
            <Button variant="outline" size="sm">View Leads Page</Button>
          </Link>
          <Link href="/admin/venues">
            <Button variant="outline" size="sm">Manage Venues</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">View Live App</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
