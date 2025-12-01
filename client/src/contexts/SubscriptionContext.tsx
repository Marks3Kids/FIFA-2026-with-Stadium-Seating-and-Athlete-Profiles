import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const PAYWALL_ENABLED = false;

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionTier: "none" | "basic" | "premier";
  email: string | null;
  isLoading: boolean;
  isVerified: boolean;
  setSubscription: (email: string, tier: "basic" | "premier") => void;
  clearSubscription: () => void;
  verifySubscription: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(!PAYWALL_ENABLED);
  const [subscriptionTier, setSubscriptionTier] = useState<"none" | "basic" | "premier">(PAYWALL_ENABLED ? "none" : "premier");
  const [email, setEmail] = useState<string | null>(PAYWALL_ENABLED ? null : "demo@worldcup2026.app");
  const [isLoading, setIsLoading] = useState(PAYWALL_ENABLED);
  const [isVerified, setIsVerified] = useState(!PAYWALL_ENABLED);

  useEffect(() => {
    if (!PAYWALL_ENABLED) {
      return;
    }
    
    const initializeSubscription = async () => {
      const storedEmail = localStorage.getItem("subscription_email");
      const storedTier = localStorage.getItem("subscription_tier") as "basic" | "premier" | null;
      
      if (storedEmail && storedTier) {
        try {
          const response = await fetch(`/api/subscription/verify?email=${encodeURIComponent(storedEmail)}`);
          const data = await response.json();
          
          if (data.valid && data.tier) {
            setEmail(storedEmail);
            setSubscriptionTier(data.tier);
            setIsSubscribed(true);
            setIsVerified(true);
            localStorage.setItem("subscription_tier", data.tier);
          } else {
            localStorage.removeItem("subscription_email");
            localStorage.removeItem("subscription_tier");
          }
        } catch (error) {
          console.error("Failed to verify subscription:", error);
          setEmail(storedEmail);
          setSubscriptionTier(storedTier);
          setIsSubscribed(true);
        }
      }
      setIsLoading(false);
    };

    initializeSubscription();
  }, []);

  const setSubscription = (userEmail: string, tier: "basic" | "premier") => {
    localStorage.setItem("subscription_email", userEmail);
    localStorage.setItem("subscription_tier", tier);
    setEmail(userEmail);
    setSubscriptionTier(tier);
    setIsSubscribed(true);
    setIsVerified(true);
  };

  const clearSubscription = () => {
    localStorage.removeItem("subscription_email");
    localStorage.removeItem("subscription_tier");
    setEmail(null);
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
        setSubscriptionTier(data.tier);
        setIsVerified(true);
        localStorage.setItem("subscription_tier", data.tier);
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

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        subscriptionTier,
        email,
        isLoading,
        isVerified,
        setSubscription,
        clearSubscription,
        verifySubscription,
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
