import { useState } from "react";
import { useLocation } from "wouter";
import { RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";
import { apiUrl } from "@/lib/apiConfig";

export default function RestoreAccess() {
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [, navigate] = useLocation();
  const { setSubscription } = useSubscription();

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setIsChecking(true);
    setError("");
    try {
      const res = await fetch(
        apiUrl(`/api/subscription/verify?email=${encodeURIComponent(trimmed)}&t=${Date.now()}`)
      );
      const data = await res.json();
      if (data.valid && data.tier && data.tier !== "free") {
        // Unregister stale service workers so the app reloads clean
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        setSubscription(trimmed, data.tier as SubscriptionTier);
        setSuccess(true);
        setTimeout(() => {
          window.location.replace("/home");
        }, 900);
      } else {
        setError(
          "No paid purchase found for this email. Please double-check the address you used at checkout, or contact support@championshipconcierge.com"
        );
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl">⚽</span>
          <span className="text-sm font-bold tracking-widest text-emerald-400 uppercase">
            Championship Concierge 2026
          </span>
        </div>

        {success ? (
          <div className="py-4">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Access Restored!</h1>
            <p className="text-sm text-gray-400">Redirecting you now…</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Restore Your Access</h1>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Enter the email you used when you purchased. We'll look it up and unlock your
              content immediately.
            </p>

            <form onSubmit={handleRestore} className="space-y-3 text-left">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="w-full bg-[#0a0f0a] border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
              />
              {error && (
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              )}
              <button
                type="submit"
                disabled={isChecking || !email.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-default text-black font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking…
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Restore Access
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-600 mt-6">
              Problems?{" "}
              <a
                href="mailto:support@championshipconcierge.com"
                className="text-emerald-500 hover:underline"
              >
                support@championshipconcierge.com
              </a>
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              ← Back to home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
