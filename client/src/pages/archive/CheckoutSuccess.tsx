import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { CheckCircle, ArrowRight, Trophy, Loader2 } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function CheckoutSuccess() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { setSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processSuccess = async () => {
      const params = new URLSearchParams(searchString);
      const sessionId = params.get("session_id");

      if (sessionId) {
        try {
          const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
          const data = await response.json();

          if (data.success && data.email && data.tier) {
            setSubscription(data.email, data.tier);
          }
        } catch (error) {
          console.error("Failed to verify session:", error);
          const storedEmail = localStorage.getItem("pending_checkout_email");
          if (storedEmail) {
            setSubscription(storedEmail, "premier");
            localStorage.removeItem("pending_checkout_email");
          }
        }
      }
      
      setIsProcessing(false);
    };

    processSuccess();
  }, [searchString, setSubscription]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-white">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-2">
            Welcome to FIFA 2026!
          </h1>
          <p className="text-muted-foreground">
            Your purchase is complete. Get ready for the greatest World Cup experience!
          </p>
        </div>

        <div className="bg-card border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-8 h-8 text-primary" />
            <div className="text-left">
              <p className="font-bold text-white">Access Unlocked</p>
              <p className="text-xs text-muted-foreground">Your features are now available</p>
            </div>
          </div>
          <ul className="text-sm text-left text-white/80 space-y-1">
            <li>✓ All 48 qualified teams</li>
            <li>✓ 16 host city guides</li>
            <li>✓ Match schedules</li>
            <li>✓ And more...</li>
          </ul>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          data-testid="button-go-to-app"
        >
          Start Exploring
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
