import { Layout } from "@/components/Layout";
import { Check, Download, Users, MapPin, Sparkles, Crown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price: number;
  priceId: string | null;
  icon: React.ReactNode;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free Bracket",
    price: 0,
    priceId: null,
    icon: <Download className="w-6 h-6" />,
    description: "Printable knockout bracket PDF",
    features: [
      "Downloadable knockout bracket",
      "Print and fill in yourself",
      "Track your predictions",
    ],
    buttonText: "Get Free Bracket",
  },
  {
    id: "team_info",
    name: "Team Info",
    price: 4.99,
    priceId: "price_1ShxFJEwO7dpbt1exGRi7Mbt",
    icon: <Users className="w-6 h-6" />,
    description: "Complete team and match coverage",
    features: [
      "All 48 qualified teams",
      "Player rosters & stats",
      "Knockout brackets",
      "Full match schedules",
      "Tournament news",
      "World Cup history",
      "Tournament odds",
    ],
    buttonText: "Get Team Info",
  },
  {
    id: "logistics",
    name: "Logistics",
    price: 14.99,
    priceId: "price_1ShxFKEwO7dpbt1e9luXFlYa",
    icon: <MapPin className="w-6 h-6" />,
    description: "Complete travel companion",
    popular: true,
    features: [
      "Everything in Team Info",
      "16 host city guides",
      "Transportation options",
      "Lodging recommendations",
      "Restaurant guides",
      "Essential travel info",
      "Safety & medical resources",
      "Religious services",
    ],
    buttonText: "Get Logistics",
  },
  {
    id: "ai_concierge",
    name: "AI Concierge",
    price: 24.99,
    priceId: "price_1ShxFKEwO7dpbt1eNndVr9yu",
    icon: <Sparkles className="w-6 h-6" />,
    description: "Your personal travel assistant",
    features: [
      "Everything in Logistics",
      "Unlimited AI assistance",
      "Personalized recommendations",
      "Real-time travel support",
      "Visa & entry guidance",
      "Trip planning tools",
      "24/7 concierge access",
    ],
    buttonText: "Get AI Concierge",
  },
];

export default function Pricing() {
  const { t } = useTranslation();
  const { setFreeUser, setSubscription } = useSubscription();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", city: "" });

  const handleFreeTier = () => {
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to download the bracket.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading("free");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      setFreeUser(formData.email, formData.name, formData.city);
      
      window.open("/world-cup-2026-bracket.html", "_blank");
      
      toast({
        title: "Success!",
        description: "Your bracket is ready to download.",
      });
      setShowEmailCapture(false);
    } catch (error) {
      console.error("Failed to save lead:", error);
      window.open("/world-cup-2026-bracket.html", "_blank");
    } finally {
      setIsLoading(null);
    }
  };

  const handlePurchase = async (tier: PricingTier) => {
    if (!tier.priceId) {
      handleFreeTier();
      return;
    }

    setIsLoading(tier.id);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: tier.priceId,
          successUrl: `${window.location.origin}/success?tier=${tier.id}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Layout pageTitle="nav.pricing">
      <div className="px-4 py-8 pb-24">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">One-Time Purchase</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Choose Your Experience
          </h1>
          <p className="text-muted-foreground">
            Access through August 2026 - No subscription required
          </p>
        </div>

        {showEmailCapture && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-white/10 rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-xl font-display font-bold text-white mb-2">
                Get Your Free Bracket
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your info to download the printable knockout bracket PDF.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">City / Country</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="New York, USA"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailCapture(false)}
                    className="flex-1 py-2.5 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading === "free"}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading === "free" ? "Processing..." : "Download Bracket"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-card border rounded-2xl p-5 ${
                tier.popular
                  ? "border-primary shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  : "border-white/10"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tier.popular ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                  }`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-white">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-display font-bold text-white">
                    {tier.price === 0 ? "FREE" : `$${tier.price}`}
                  </span>
                  {tier.price > 0 && (
                    <p className="text-xs text-muted-foreground">one-time</p>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-5">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className={`w-4 h-4 flex-shrink-0 ${tier.popular ? "text-primary" : "text-muted-foreground"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(tier)}
                disabled={isLoading === tier.id}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white/10 text-white hover:bg-white/20"
                } disabled:opacity-50`}
              >
                {isLoading === tier.id ? "Processing..." : tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          All purchases are one-time payments with access through August 2026.
          <br />
          Secure payments powered by Stripe.
        </p>
      </div>
    </Layout>
  );
}
