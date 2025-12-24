import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredTier?: SubscriptionTier;
}

export function ProtectedRoute({ children, requiredTier = "team_info" }: ProtectedRouteProps) {
  const { isSubscribed, hasAccess, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isSubscribed) {
    return <Redirect to="/pricing" />;
  }

  if (!hasAccess(requiredTier)) {
    return <Redirect to="/pricing" />;
  }

  return <>{children}</>;
}
