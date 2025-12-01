import { useLocation } from "wouter";
import { ArrowLeft, Star, Lock, Zap, MessageSquare, Plane, Utensils, Calendar } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

const premierOnlyFeatures = [
  { icon: Calendar, title: "Full Match Schedules", description: "All rounds from Group Stage to Final" },
  { icon: Plane, title: "Transportation Planner", description: "Flights, trains, buses & car rentals" },
  { icon: Utensils, title: "Dining & Lodging", description: "Restaurant and hotel recommendations" },
  { icon: MessageSquare, title: "AI Concierge", description: "Your personal World Cup assistant" },
  { icon: Zap, title: "Trip Planning Tools", description: "Currency converter, planner & more" },
];

export default function Upgrade() {
  const [, navigate] = useLocation();
  const { email } = useSubscription();

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId: "price_1SYdnrLI0BitNJUzShtUbJpV",
          email: email 
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4 px-4 py-3">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-display font-bold text-white">Upgrade to Premier</h1>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Premier Feature
          </h2>
          <p className="text-muted-foreground">
            This feature requires a Premier Pass to access
          </p>
        </div>

        <div className="bg-card border border-primary/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-white">Premier Pass - $19.99</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Unlock the complete World Cup experience with full access to all features through August 2026.
          </p>

          <div className="space-y-3 mb-6">
            {premierOnlyFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
            data-testid="button-upgrade"
          >
            Upgrade Now - $19.99
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          One-time payment. Valid through August 2026.
        </p>
      </div>
    </div>
  );
}
