/**
 * Informational banner shown across Transportation sub-pages.
 *
 * Replaces our previously-published static price ranges with a live-pricing
 * pointer: fares change daily based on demand, fuel costs, and seasonality,
 * so users get a more accurate number directly on the operator's booking
 * page. Each route row already links out to the relevant airline / rail
 * line / bus company; this banner sets that expectation up-front.
 */
import { Info } from "lucide-react";

export function LivePricingBanner() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
      <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-100">
        <p className="font-semibold mb-1">For live pricing, check the operator's site</p>
        <p className="text-xs text-amber-200/80">
          Fares change daily based on demand, fuel costs, and seasonality. Tap any airline, rail line, bus company, or rental brand to see current rates directly on their booking page.
        </p>
      </div>
    </div>
  );
}
