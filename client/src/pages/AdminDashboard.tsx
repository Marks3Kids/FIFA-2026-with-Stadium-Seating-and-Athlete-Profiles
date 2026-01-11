import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Download, Users, CreditCard, Mail, Calendar, ArrowLeft } from "lucide-react";

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

export default function AdminDashboard() {
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
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
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
