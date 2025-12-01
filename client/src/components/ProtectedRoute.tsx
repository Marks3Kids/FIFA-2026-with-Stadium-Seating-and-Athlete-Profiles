import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredTier?: "basic" | "premier";
}

export function ProtectedRoute({ children, requiredTier = "basic" }: ProtectedRouteProps) {
  const { isSubscribed, subscriptionTier, isLoading } = useSubscription();

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

  if (requiredTier === "premier" && subscriptionTier === "basic") {
    return <Redirect to="/upgrade" />;
  }

  return <>{children}</>;
}
