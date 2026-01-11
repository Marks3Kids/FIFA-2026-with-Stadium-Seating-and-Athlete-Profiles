import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Download, Users, CreditCard, Mail, Calendar, ArrowLeft, Lock, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Lead {
  id: number;
  email: string;
  createdAt: string;
}

interface Purchase {
  id: number;
  email: string;
  tier: string;
  stripeSessionId: string;
  purchasedAt: string;
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiRequest("POST", "/api/admin/login", { password: pwd });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        sessionStorage.setItem("admin_authenticated", "true");
        onLogin();
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
          <Lock className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-white">Admin Access</CardTitle>
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboardContent onLogout={handleLogout} />;
}

function AdminDashboardContent({ onLogout }: { onLogout: () => void }) {
  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads"],
  });

  const { data: purchases = [], isLoading: purchasesLoading } = useQuery<Purchase[]>({
    queryKey: ["/api/admin/purchases"],
  });

  const tierLabels: Record<string, string> = {
    team_info: "Team Info ($4.99)",
    logistics: "Logistics ($14.99)",
    ai_concierge: "AI Concierge ($24.99)",
  };

  const tierColors: Record<string, string> = {
    team_info: "bg-blue-500",
    logistics: "bg-purple-500",
    ai_concierge: "bg-emerald-500",
  };

  const totalRevenue = purchases.reduce((sum, p) => {
    if (p.tier === "team_info") return sum + 4.99;
    if (p.tier === "logistics") return sum + 14.99;
    if (p.tier === "ai_concierge") return sum + 24.99;
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Download className="w-4 h-4" />
                Free Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{leads.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Total Purchases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{purchases.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                AI Concierge Subs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-500">
                {purchases.filter(p => p.tier === "ai_concierge").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-500">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Purchases
                </CardTitle>
                <Badge variant="outline">{purchases.length} total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {purchasesLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : purchases.length === 0 ? (
                <p className="text-muted-foreground">No purchases yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {purchases.slice().reverse().map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {purchase.email}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(purchase.purchasedAt).toLocaleDateString()} {new Date(purchase.purchasedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={tierColors[purchase.tier]}>
                        {tierLabels[purchase.tier] || purchase.tier}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Free Bracket Downloads
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{leads.length} total</Badge>
                  <a href="/api/admin/leads/export" download>
                    <Button variant="outline" size="sm">
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
                <p className="text-muted-foreground">No leads yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {leads.slice().reverse().map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <p className="text-white font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {lead.email}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
