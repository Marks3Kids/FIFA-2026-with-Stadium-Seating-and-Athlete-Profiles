import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredTier?: SubscriptionTier;
}

// Canonical tier hierarchy — single source of truth.
// A purchase of a higher tier ALWAYS includes all lower tiers.
// ai_concierge > logistics > team_info > free > none
export const TIER_LEVELS: Record<string, number> = {
  none: 0,
  free: 1,
  team_info: 2,
  logistics: 3,
  ai_concierge: 4,
};

export function ProtectedRoute({ children, requiredTier = "team_info" }: ProtectedRouteProps) {
  const { isSubscribed, hasAccess, subscriptionTier, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const granted = isSubscribed && hasAccess(requiredTier);
  console.log(`[ProtectedRoute] required=${requiredTier} user=${subscriptionTier} subscribed=${isSubscribed} granted=${granted}`);

  if (!isSubscribed) {
    console.log(`[ProtectedRoute] Not subscribed — redirect to /pricing`);
    return <Redirect to="/pricing" />;
  }

  if (!hasAccess(requiredTier)) {
    console.log(`[ProtectedRoute] Tier insufficient (${subscriptionTier} < ${requiredTier}) — redirect to /pricing`);
    return <Redirect to="/pricing" />;
  }

  return <>{children}</>;
}
