import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Loader2 } from "lucide-react";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { apiUrl } from "@/lib/apiConfig";

export default function CheckoutSuccess() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { setSubscription } = useSubscription();

  useEffect(() => {
    // If running inside a Capacitor SFSafariViewController / Chrome Custom Tab,
    // close it immediately so the user returns to the native app shell.
    const cap = (window as any).Capacitor;
    const isNativeCapacitor = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
    if (isNativeCapacitor) {
      import('@capacitor/browser').then(({ Browser }) => {
        Browser.close().catch(() => {});
      });
    }
  }, []);

  useEffect(() => {
    const processAndRedirect = async () => {
      const params = new URLSearchParams(searchString);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        // No session ID — go straight to home, Restore modal will handle the rest
        console.log('[CheckoutSuccess] No session_id — redirecting to home');
        navigate("/home");
        return;
      }

      try {
        console.log('[CheckoutSuccess] Verifying session:', sessionId);
        const response = await fetch(apiUrl(`/api/checkout/verify?session_id=${sessionId}`));
        const data = await response.json();

        if (data.success && data.email && data.tier) {
          console.log(`[CheckoutSuccess] Verified: email=${data.email} tier=${data.tier}`);
          setSubscription(data.email, data.tier as SubscriptionTier);
          // Redirect into the real app — Home is the correct starting point for all tiers.
          // The ?purchased= param triggers a welcome toast inside Home.
          navigate(`/home?purchased=${encodeURIComponent(data.tier)}`);
        } else {
          console.warn('[CheckoutSuccess] Verification returned no tier — sending to home for restore');
          navigate("/home?restore=1");
        }
      } catch (error) {
        console.error('[CheckoutSuccess] Verify failed:', error);
        navigate("/home?restore=1");
      }
    };

    processAndRedirect();
  }, [searchString, setSubscription, navigate]);

  // Show a minimal, branded loading state while verifying — the user
  // will be redirected automatically. Never show a dead-end success card.
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-white font-display text-lg font-semibold">Setting up your access…</p>
        <p className="text-muted-foreground text-sm mt-1">Just a moment</p>
      </div>
    </div>
  );
}
