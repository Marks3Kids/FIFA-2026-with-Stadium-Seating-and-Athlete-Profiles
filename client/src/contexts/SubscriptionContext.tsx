import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const PAYWALL_ENABLED = true;

export type SubscriptionTier = "none" | "free" | "team_info" | "logistics" | "ai_concierge";

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionTier: SubscriptionTier;
  email: string | null;
  name: string | null;
  city: string | null;
  isLoading: boolean;
  isVerified: boolean;
  setSubscription: (email: string, tier: SubscriptionTier, name?: string, city?: string) => void;
  setFreeUser: (email: string, name: string, city: string) => void;
  clearSubscription: () => void;
  verifySubscription: () => Promise<boolean>;
  hasAccess: (requiredTier: SubscriptionTier) => boolean;
}

const TIER_LEVELS: Record<SubscriptionTier, number> = {
  none: 0,
  free: 1,
  team_info: 2,
  logistics: 3,
  ai_concierge: 4,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(!PAYWALL_ENABLED);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(PAYWALL_ENABLED ? "none" : "ai_concierge");
  const [email, setEmail] = useState<string | null>(PAYWALL_ENABLED ? null : "demo@championshipconcierge.com");
  const [name, setName] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(PAYWALL_ENABLED);
  const [isVerified, setIsVerified] = useState(!PAYWALL_ENABLED);

  useEffect(() => {
    if (!PAYWALL_ENABLED) {
      return;
    }
    
    const initializeSubscription = async () => {
      const storedEmail = localStorage.getItem("subscription_email");
      const storedTier = localStorage.getItem("subscription_tier") as SubscriptionTier | null;
      const storedName = localStorage.getItem("subscription_name");
      const storedCity = localStorage.getItem("subscription_city");
      
      if (storedEmail && storedTier) {
        try {
          const response = await fetch(`/api/subscription/verify?email=${encodeURIComponent(storedEmail)}`);
          const data = await response.json();
          
          if (data.valid && data.tier) {
            setEmail(storedEmail);
            setSubscriptionTier(data.tier as SubscriptionTier);
            setName(storedName);
            setCity(storedCity);
            setIsSubscribed(true);
            setIsVerified(true);
            localStorage.setItem("subscription_tier", data.tier);
          } else if (storedTier === "free") {
            setEmail(storedEmail);
            setSubscriptionTier("free");
            setName(storedName);
            setCity(storedCity);
            setIsSubscribed(true);
            setIsVerified(true);
          } else {
            localStorage.removeItem("subscription_email");
            localStorage.removeItem("subscription_tier");
            localStorage.removeItem("subscription_name");
            localStorage.removeItem("subscription_city");
          }
        } catch (error) {
          console.error("Failed to verify subscription:", error);
          if (storedTier === "free") {
            setEmail(storedEmail);
            setSubscriptionTier("free");
            setName(storedName);
            setCity(storedCity);
            setIsSubscribed(true);
          } else {
            localStorage.removeItem("subscription_email");
            localStorage.removeItem("subscription_tier");
            localStorage.removeItem("subscription_name");
            localStorage.removeItem("subscription_city");
          }
        }
      }
      setIsLoading(false);
    };

    initializeSubscription();
  }, []);

  const setSubscription = (userEmail: string, tier: SubscriptionTier, userName?: string, userCity?: string) => {
    const normalizedEmail = userEmail.toLowerCase().trim();
    localStorage.setItem("subscription_email", normalizedEmail);
    localStorage.setItem("subscription_tier", tier);
    if (userName) localStorage.setItem("subscription_name", userName);
    if (userCity) localStorage.setItem("subscription_city", userCity);
    setEmail(normalizedEmail);
    setSubscriptionTier(tier);
    setName(userName || null);
    setCity(userCity || null);
    setIsSubscribed(true);
    setIsVerified(true);
  };

  const setFreeUser = (userEmail: string, userName: string, userCity: string) => {
    const normalizedEmail = userEmail.toLowerCase().trim();
    localStorage.setItem("subscription_email", normalizedEmail);
    localStorage.setItem("subscription_tier", "free");
    localStorage.setItem("subscription_name", userName);
    localStorage.setItem("subscription_city", userCity);
    setEmail(normalizedEmail);
    setName(userName);
    setCity(userCity);
    setSubscriptionTier("free");
    setIsSubscribed(true);
    setIsVerified(true);
  };

  const clearSubscription = () => {
    localStorage.removeItem("subscription_email");
    localStorage.removeItem("subscription_tier");
    localStorage.removeItem("subscription_name");
    localStorage.removeItem("subscription_city");
    setEmail(null);
    setName(null);
    setCity(null);
    setSubscriptionTier("none");
    setIsSubscribed(false);
    setIsVerified(false);
  };

  const verifySubscription = async (): Promise<boolean> => {
    if (!email) return false;
    
    try {
      const response = await fetch(`/api/subscription/verify?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.valid && data.tier) {
        setSubscriptionTier(data.tier as SubscriptionTier);
        setIsVerified(true);
        localStorage.setItem("subscription_tier", data.tier);
        return true;
      } else if (subscriptionTier === "free") {
        return true;
      } else {
        clearSubscription();
        return false;
      }
    } catch (error) {
      console.error("Failed to verify subscription:", error);
      return false;
    }
  };

  const hasAccess = (requiredTier: SubscriptionTier): boolean => {
    return TIER_LEVELS[subscriptionTier] >= TIER_LEVELS[requiredTier];
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        subscriptionTier,
        email,
        name,
        city,
        isLoading,
        isVerified,
        setSubscription,
        setFreeUser,
        clearSubscription,
        verifySubscription,
        hasAccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
