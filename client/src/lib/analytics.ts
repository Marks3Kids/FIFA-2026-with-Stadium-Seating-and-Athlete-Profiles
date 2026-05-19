/**
 * Tiny gtag wrapper for Google Analytics 4 + Google Ads conversion tracking.
 *
 * The gtag script and `config()` calls for both properties live in
 * client/index.html so they fire before React boots. Helpers below are for
 * runtime events fired from React (page views on SPA route change, purchase
 * conversions, etc.).
 *
 * All helpers no-op gracefully on the server (where window is undefined) and
 * if the gtag script failed to load (e.g. ad-blocker).
 */

const GA4_ID = "G-HRK5HFMGDZ";
const ADS_ID = "AW-17888742843";

type GtagFn = (...args: any[]) => void;

function getGtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const g = (window as any).gtag;
  return typeof g === "function" ? g : null;
}

/**
 * Fire a virtual page_view to GA4 when the SPA route changes.
 * Called from a useEffect on the location value in App.tsx.
 */
export function trackPageView(path: string): void {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", "page_view", {
    send_to: GA4_ID,
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : path,
  });
}

/**
 * Fire a GA4 + Google Ads purchase event when a checkout completes.
 * `value` is in USD (we charge in USD across all tiers).
 */
export function trackPurchase(opts: {
  tier: string;
  value: number;
  transactionId?: string;
}): void {
  const gtag = getGtag();
  if (!gtag) return;
  const txnId = opts.transactionId || `${opts.tier}_${Date.now()}`;
  // GA4 purchase event
  gtag("event", "purchase", {
    send_to: GA4_ID,
    transaction_id: txnId,
    value: opts.value,
    currency: "USD",
    items: [
      {
        item_id: opts.tier,
        item_name: opts.tier,
        price: opts.value,
        quantity: 1,
      },
    ],
  });
  // Mirror to Google Ads as a conversion (no conversion label set yet —
  // Mark can add one in Google Ads and update ADS_CONVERSION_LABEL below).
  gtag("event", "conversion", {
    send_to: ADS_ID,
    value: opts.value,
    currency: "USD",
    transaction_id: txnId,
  });
}

/** Generic event helper for ad-hoc product analytics. */
export function trackEvent(name: string, params: Record<string, any> = {}): void {
  const gtag = getGtag();
  if (!gtag) return;
  gtag("event", name, { send_to: GA4_ID, ...params });
}
