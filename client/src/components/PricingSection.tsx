import { Check, Download, Users, MapPin, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price: number;
  priceId: string | null;
  icon: ReactNode;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  monthlyValue?: string;
}

export const PRICING_TIERS: PricingTier[] = [
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
    monthlyValue: "Less than $0.75/month during the 2026 games",
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
    monthlyValue: "Less than $2.25/month during the 2026 games",
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
      "50 AI messages/month",
      "Option to buy more as needed",
      "Personalized recommendations",
      "Real-time travel support",
      "Visa & entry guidance",
      "Trip planning tools",
    ],
    buttonText: "Get AI Concierge",
    monthlyValue: "Less than $3.60/month during the 2026 games",
  },
];

interface PricingSectionProps {
  cancelUrl?: string;
  showHeader?: boolean;
}

export function PricingSection({ cancelUrl = "/pricing", showHeader = true }: PricingSectionProps) {
  const { setFreeUser } = useSubscription();
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
      window.open("/downloads/world-cup-2026-bracket.html", "_blank");
      
      toast({
        title: "Success!",
        description: "Your bracket is ready to download.",
      });
      setShowEmailCapture(false);
    } catch (error) {
      console.error("Failed to save lead:", error);
      window.open("/downloads/world-cup-2026-bracket.html", "_blank");
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
          cancelUrl: `${window.location.origin}${cancelUrl}`,
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
    <>
      {showHeader && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-primary border border-primary px-5 py-2.5 rounded-full mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
            <span className="text-base text-primary-foreground font-bold uppercase tracking-wide">One-Time Purchase</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 uppercase tracking-wide">
            Choose Your Experience
          </h2>
          <p className="text-muted-foreground">
            Access through August 2026 - No monthly subscription required
          </p>
          <p className="text-sm text-primary mt-2">
            Starting at just $4.99 - less than a cup of coffee!
          </p>
        </div>
      )}

      {showEmailCapture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-2">Get Your Free Bracket</h3>
            <p className="text-muted-foreground mb-6">
              Enter your details to download the printable knockout bracket.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="City / Country"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailCapture(false)}
                  className="flex-1 border border-white/20 text-white py-3 rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading === "free"}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  {isLoading === "free" ? "..." : "Download"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative bg-card border rounded-2xl p-6 ${
              tier.popular
                ? "border-primary shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                : "border-white/10"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {tier.icon}
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-sm">{tier.name}</h3>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
              </div>
            </div>

            <div className="mb-6">
              {tier.price === 0 ? (
                <span className="text-4xl font-bold text-primary">FREE</span>
              ) : (
                <>
                  <div>
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">USD one-time</span>
                  </div>
                  {tier.monthlyValue && (
                    <p className="text-xs text-primary mt-1">{tier.monthlyValue}</p>
                  )}
                </>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePurchase(tier)}
              disabled={isLoading === tier.id}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                tier.popular
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "border border-white/20 text-white hover:bg-white/5"
              } disabled:opacity-50`}
            >
              {isLoading === tier.id ? "Processing..." : tier.buttonText}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
