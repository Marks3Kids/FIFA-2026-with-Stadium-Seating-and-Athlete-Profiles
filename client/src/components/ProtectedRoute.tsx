import { ReactNode } from "react";
import { Redirect, Link } from "wouter";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";

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

const TIER_LABELS: Record<string, string> = {
  none: "No subscription",
  free: "Free Bracket",
  team_info: "Team Info ($1.99)",
  logistics: "Fan Travel Pack ($7.99)",
  ai_concierge: "AI Concierge ($14.99)",
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  team_info: "All 48 teams, match schedules, player rosters, brackets, and tournament odds",
  logistics: "Everything in Team Info plus 16 host city guides, transportation, lodging, dining, and travel essentials",
  ai_concierge: "Everything in Fan Travel Pack plus 50 AI Concierge messages for personalized trip planning",
};

/**
 * Renders an upgrade prompt INLINE (without changing the URL) when the user
 * is logged in but their tier is too low. Replacing the previous redirect-to-
 * pricing flow that felt like users were being kicked out of the app.
 */
function UpgradePrompt({ requiredTier, currentTier }: { requiredTier: SubscriptionTier; currentTier: SubscriptionTier }) {
  const requiredLabel = TIER_LABELS[requiredTier] ?? requiredTier;
  const currentLabel = TIER_LABELS[currentTier] ?? currentTier;
  const description = TIER_DESCRIPTIONS[requiredTier] ?? "";

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-card border border-white/10 rounded-2xl p-8 text-center space-y-5">
          <div className="inline-flex w-16 h-16 rounded-full bg-primary/15 items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Included in {requiredLabel}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div className="text-xs text-muted-foreground border-t border-white/5 pt-4">
            Your current plan: <span className="text-white font-medium">{currentLabel}</span>
          </div>
          <Link href="/pricing">
            <a className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-5 rounded-xl transition-colors">
              See upgrade options
              <ArrowRight className="w-4 h-4" />
            </a>
          </Link>
          <Link href="/home">
            <a className="inline-block text-xs text-muted-foreground hover:text-white transition-colors">
              Back to home
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

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

  // Unsubscribed users: send to /pricing (no current tier to compare against)
  if (!isSubscribed) {
    console.log(`[ProtectedRoute] Not subscribed — redirect to /pricing`);
    return <Redirect to="/pricing" />;
  }

  // Subscribed but lower tier: render inline upgrade prompt instead of
  // redirecting. URL stays at the requested route so the user understands
  // which feature requires the upgrade — feels much less like "logged out".
  if (!hasAccess(requiredTier)) {
    console.log(`[ProtectedRoute] Tier insufficient (${subscriptionTier} < ${requiredTier}) — inline upgrade prompt`);
    return <UpgradePrompt requiredTier={requiredTier} currentTier={subscriptionTier} />;
  }

  return <>{children}</>;
}
