import { Check, Download, Users, MapPin, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

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
    priceId: "price_1SoSQYKAEwbrdBYlW0kPI4ww",
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
    priceId: "price_1SoSSoKAEwbrdBYlphO1lVDx",
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
    priceId: "price_1SoSU6KAEwbrdBYloERNzAzQ",
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
  const { setFreeUser, setSubscription } = useSubscription();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", city: "" });
  const [showRestore, setShowRestore] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);

  const getTierName = (id: string) => {
    const nameMap: Record<string, string> = {
      free: t("pricing.freeBracket"),
      team_info: t("pricing.teamInfo"),
      logistics: t("pricing.logistics"),
      ai_concierge: t("pricing.aiConcierge"),
    };
    return nameMap[id] || id;
  };

  const getTierDescription = (id: string) => {
    const descMap: Record<string, string> = {
      free: t("pricing.freeBracketDesc"),
      team_info: t("pricing.teamInfoDesc"),
      logistics: t("pricing.logisticsDesc"),
      ai_concierge: t("pricing.aiConciergeDesc"),
    };
    return descMap[id] || "";
  };

  const getTierButton = (id: string) => {
    const buttonMap: Record<string, string> = {
      free: t("pricing.getFree"),
      team_info: t("pricing.getTeamInfo"),
      logistics: t("pricing.getLogistics"),
      ai_concierge: t("pricing.getAiConcierge"),
    };
    return buttonMap[id] || "";
  };

  const getTierFeatures = (id: string) => {
    const featureMap: Record<string, string[]> = {
      free: [
        t("pricing.downloadable"),
        t("pricing.printFill"),
        t("pricing.trackPredictions"),
      ],
      team_info: [
        t("pricing.allTeams"),
        t("pricing.playerRosters"),
        t("pricing.knockoutBrackets"),
        t("pricing.fullSchedules"),
        t("pricing.tournamentNews"),
        t("pricing.worldCupHistory"),
        t("pricing.tournamentOdds"),
      ],
      logistics: [
        t("pricing.everythingTeam"),
        t("pricing.hostCityGuides"),
        t("pricing.transportationOptions"),
        t("pricing.lodgingRecs"),
        t("pricing.restaurantGuides"),
        t("pricing.essentialTravel"),
        t("pricing.safetyMedical"),
        t("pricing.religiousServices"),
      ],
      ai_concierge: [
        t("pricing.everythingLogistics"),
        t("pricing.aiMessages"),
        t("pricing.buyMore"),
        t("pricing.personalizedRecs"),
        t("pricing.realTimeSupport"),
        t("pricing.visaGuidance"),
        t("pricing.tripPlanning"),
      ],
    };
    return featureMap[id] || [];
  };

  const getMonthlyValue = (id: string) => {
    const valueMap: Record<string, string> = {
      team_info: t("pricing.teamInfoMonthly"),
      logistics: t("pricing.logisticsMonthly"),
      ai_concierge: t("pricing.aiConciergeMonthly"),
    };
    return valueMap[id] || "";
  };

  const MAX_FREE_DOWNLOADS = 2;
  
  const getDownloadCount = (): number => {
    try {
      return parseInt(localStorage.getItem("bracketDownloads") || "0", 10);
    } catch {
      return 0;
    }
  };

  const incrementDownloadCount = () => {
    try {
      const current = getDownloadCount();
      localStorage.setItem("bracketDownloads", String(current + 1));
    } catch {
      // localStorage not available
    }
  };

  const handleRestorePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreEmail.trim()) return;
    
    setIsRestoring(true);
    try {
      const res = await fetch(`/api/subscription/verify?email=${encodeURIComponent(restoreEmail.toLowerCase().trim())}`);
      const data = await res.json();
      
      if (data.valid && data.tier) {
        setSubscription(restoreEmail, data.tier as SubscriptionTier);
        toast({
          title: "Purchase Restored!",
          description: `Welcome back! Your ${data.tier.replace('_', ' ')} access has been restored.`,
        });
        setShowRestore(false);
        setRestoreEmail("");
        navigate("/");
      } else {
        toast({
          title: "No Purchase Found",
          description: "We couldn't find a purchase with that email address. Please check your email and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleFreeTier = () => {
    const downloads = getDownloadCount();
    if (downloads >= MAX_FREE_DOWNLOADS) {
      toast({
        title: t("pricing.downloadLimitTitle", "Download Limit Reached"),
        description: t("pricing.downloadLimitDesc", "You've reached the maximum of 2 free bracket downloads. Upgrade to Team Info for unlimited access to brackets and more!"),
        variant: "destructive",
      });
      return;
    }
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.city) {
      toast({
        title: t("pricing.missingInfo", "Missing Information"),
        description: t("pricing.fillAllFields", "Please fill in all fields to download the bracket."),
        variant: "destructive",
      });
      return;
    }

    const downloads = getDownloadCount();
    if (downloads >= MAX_FREE_DOWNLOADS) {
      toast({
        title: t("pricing.downloadLimitTitle", "Download Limit Reached"),
        description: t("pricing.downloadLimitDesc", "You've reached the maximum of 2 free bracket downloads. Upgrade to Team Info for unlimited access to brackets and more!"),
        variant: "destructive",
      });
      setShowEmailCapture(false);
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
      incrementDownloadCount();
      window.open("/world-cup-2026-bracket.html", "_blank");
      
      const remaining = MAX_FREE_DOWNLOADS - getDownloadCount();
      toast({
        title: t("pricing.bracketOpened", "Bracket Opened!"),
        description: remaining > 0 
          ? t("pricing.bracketOpenedDesc", "Your printable bracket opened in a new tab. Use Ctrl+P (or Cmd+P on Mac) to print or save as PDF.") + ` (${remaining} ${t("pricing.downloadsRemaining", "download(s) remaining")})`
          : t("pricing.bracketOpenedDescFinal", "Your printable bracket opened in a new tab. This was your last free download."),
      });
      setShowEmailCapture(false);
    } catch (error) {
      console.error("Failed to save lead:", error);
      incrementDownloadCount();
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
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 200)}`);
      }
      
      if (!response.ok) {
        const errorDetail = data.details || data.error || `HTTP ${response.status}`;
        throw new Error(errorDetail);
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL in response");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage = error?.message || "Unknown error";
      toast({
        title: "Checkout Error",
        description: errorMessage,
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
            <span className="text-base text-primary-foreground font-bold uppercase tracking-wide">{t("pricing.oneTimePurchase")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 uppercase tracking-wide">
            {t("pricing.chooseExperience")}
          </h2>
          <p className="text-muted-foreground">
            {t("pricing.accessInfo")} - {t("pricing.noMonthlySubscription")}
          </p>
          <p className="text-sm text-primary mt-2">
            {t("pricing.coffeeComparison")}
          </p>
        </div>
      )}

      {showEmailCapture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-2">{t("pricing.emailCapture.title")}</h3>
            <p className="text-muted-foreground mb-6">
              {t("pricing.emailCapture.subtitle")}
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={t("pricing.emailCapture.namePlaceholder")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder={t("pricing.emailCapture.emailPlaceholder")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder={t("pricing.emailCapture.cityPlaceholder")}
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
                  {t("pricing.emailCapture.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading === "free"}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  {isLoading === "free" ? "..." : t("pricing.emailCapture.download")}
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
                {t("pricing.mostPopular")}
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {tier.icon}
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-sm">{getTierName(tier.id)}</h3>
                <p className="text-xs text-muted-foreground">{getTierDescription(tier.id)}</p>
              </div>
            </div>

            <div className="mb-6">
              {tier.price === 0 ? (
                <span className="text-4xl font-bold text-primary">{t("pricing.free", "FREE")}</span>
              ) : (
                <>
                  <div>
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{t("pricing.usdOneTime")}</span>
                  </div>
                  {getMonthlyValue(tier.id) && (
                    <p className="text-xs text-primary mt-1">{getMonthlyValue(tier.id)}</p>
                  )}
                </>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {getTierFeatures(tier.id).map((feature, index) => (
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
              {isLoading === tier.id ? t("pricing.processing") : getTierButton(tier.id)}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setShowRestore(true)}
          className="text-sm text-primary hover:underline flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Already purchased? Restore your access
        </button>
      </div>

      {showRestore && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-2">Restore Purchase</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter the email address you used when purchasing to restore your access.
            </p>
            <form onSubmit={handleRestorePurchase}>
              <input
                type="email"
                value={restoreEmail}
                onChange={(e) => setRestoreEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowRestore(false);
                    setRestoreEmail("");
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRestoring}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRestoring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Restore"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
