import { useState } from "react";
import { useLocation } from "wouter";
import { Trophy, Check, Star, Shield, Zap, Globe } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  priceId: string;
  popular?: boolean;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic App",
    description: "Essential World Cup info",
    price: 4.99,
    interval: "one-time",
    priceId: "price_1SYdnrLI0BitNJUz4cpm9MAw",
    features: [
      "All 48 qualified teams",
      "16 host city guides",
      "First Round Schedule"
    ]
  },
  {
    id: "premier",
    name: "Premier Pass",
    description: "Complete World Cup experience",
    price: 19.99,
    interval: "one-time",
    priceId: "price_1SYdnrLI0BitNJUzShtUbJpV",
    popular: true,
    features: [
      "Everything in Basic App",
      "Full match schedules (all rounds)",
      "Transportation planner",
      "Dining & lodging guides",
      "AI Concierge assistant",
      "Valid through August 2026"
    ]
  }
];

const basicFeatures = [
  "All 48 qualified teams",
  "16 host city guides",
  "First Round Schedule"
];

const premierFeatures = [
  "All 48 qualified teams",
  "16 host city guides",
  "Full match schedules",
  "Transportation planner",
  "Dining & lodging guides",
  "AI Concierge assistant",
  "Trip planner tools",
  "Critical info & safety",
  "Valid through Aug 2026"
];

export default function Pricing() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubscribe = async (priceId: string) => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(priceId);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email }),
      });

      const data = await response.json();

      if (data.url) {
        localStorage.setItem("pending_checkout_email", email);
        window.location.href = data.url;
      } else {
        setError("Failed to start checkout. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-amber-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/30 blur-[120px] rounded-full" />
        
        <div className="relative pt-12 pb-8 px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">FIFA 2026 World Cup</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-3">
              Your Ultimate<br />
              <span className="text-primary">World Cup Companion</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to experience the biggest sporting event across USA, Canada & Mexico
            </p>
          </div>

          <div className="mb-8">
            <div className="max-w-sm mx-auto">
              <label className="block text-sm font-medium text-white mb-2">Enter your email to get started</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-card border border-white/10 rounded-xl text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-email"
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-card border rounded-2xl p-5 ${
                  plan.popular 
                    ? "border-primary shadow-lg shadow-primary/20" 
                    : "border-white/10"
                }`}
                data-testid={`plan-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> BEST VALUE
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${plan.price}</div>
                    <div className="text-xs text-muted-foreground">
                      {plan.interval === "one-time" ? "one-time" : `/${plan.interval}`}
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading === plan.priceId}
                  className={`w-full py-3 rounded-xl font-bold transition-colors ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-white/10 text-white hover:bg-white/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  data-testid={`button-subscribe-${plan.id}`}
                >
                  {loading === plan.priceId ? "Processing..." : "Get Started"}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white text-center">What You Get</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card/50 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Basic</h3>
                    <p className="text-xs text-muted-foreground">$4.99</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {basicFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <Check className="w-3 h-3 text-white/60 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-card/50 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm">Premier</h3>
                    <p className="text-xs text-muted-foreground">$19.99</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {premierFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure Payment
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Instant Access
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Works Worldwide
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Powered by Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
