/**
 * RevenueCat client wrapper.
 *
 * Only safe to call inside the Capacitor native shell — the plugin's bridge
 * is not available on web. Every entry point guards with `isCapacitorNative()`.
 *
 * Mapping (must match RevenueCat dashboard):
 *   - Offering: `default`
 *   - Packages / Products: `team_info`, `fan_travel_pack`, `ai_concierge`, `ai_message_refill`
 *   - Entitlements: `team_info`, `fan_travel_pack`, `ai_concierge` (refill is consumable, no entitlement)
 */
import { Purchases, LOG_LEVEL } from "@revenuecat/purchases-capacitor";
import type { PurchasesPackage, CustomerInfo } from "@revenuecat/purchases-capacitor";
import { isCapacitorNative, getCapacitorPlatform } from "./capacitor";

let configured = false;

/**
 * Idempotent. Call once at app startup. No-op on web.
 */
export async function initRevenueCat(appUserID?: string): Promise<void> {
  if (!isCapacitorNative()) return;
  if (configured) {
    if (appUserID) await Purchases.logIn({ appUserID });
    return;
  }

  const platform = getCapacitorPlatform();
  const apiKey =
    platform === "android"
      ? import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY
      : import.meta.env.VITE_REVENUECAT_IOS_API_KEY;

  if (!apiKey) {
    console.error(`[RevenueCat] No API key configured for platform=${platform}`);
    return;
  }

  await Purchases.setLogLevel({ level: import.meta.env.DEV ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR });
  await Purchases.configure({ apiKey, appUserID });
  configured = true;
}

/**
 * Internal tier id (used in our PricingSection / DB) → RevenueCat package identifier.
 * The PricingSection uses `logistics` as the tier name for the Fan Travel Pack.
 */
export const TIER_TO_PACKAGE: Record<string, string> = {
  team_info: "team_info",
  logistics: "fan_travel_pack",
  ai_concierge: "ai_concierge",
  message_pack: "ai_message_refill",
};

/**
 * Look up a package in the `default` offering by our internal tier id.
 * Returns null if the offering isn't loaded or the package isn't found.
 */
export async function getPackageForTier(tierId: string): Promise<PurchasesPackage | null> {
  if (!isCapacitorNative()) return null;
  const packageId = TIER_TO_PACKAGE[tierId];
  if (!packageId) return null;

  const offerings = await Purchases.getOfferings();
  const current = offerings.current;
  if (!current) {
    console.warn("[RevenueCat] No current offering — check dashboard config");
    return null;
  }
  return current.availablePackages.find((p) => p.identifier === packageId) ?? null;
}

export interface PurchaseResult {
  customerInfo: CustomerInfo;
  productIdentifier: string;
}

/**
 * Trigger the native purchase sheet for a package.
 * Throws if the user cancels or the purchase fails.
 */
export async function purchaseTier(tierId: string, email?: string): Promise<PurchaseResult> {
  const pkg = await getPackageForTier(tierId);
  if (!pkg) throw new Error(`No RevenueCat package found for tier "${tierId}"`);

  // Attaching email as the reserved $email attribute means it comes back in
  // every webhook event, so the server can reconcile the purchase even if
  // the client's link-user call never lands.
  if (email) {
    try {
      await Purchases.setEmail({ email });
    } catch (err) {
      console.warn("[RevenueCat] setEmail failed (non-fatal):", err);
    }
  }

  const result = await Purchases.purchasePackage({ aPackage: pkg });
  return result;
}

/**
 * Restore purchases for the current device. Used by the "Restore" button
 * inside the native app — on web we still hit the email-based restore endpoint.
 */
export async function restoreNativePurchases(): Promise<CustomerInfo | null> {
  if (!isCapacitorNative()) return null;
  const { customerInfo } = await Purchases.restorePurchases();
  return customerInfo;
}

/**
 * Translate a RevenueCat CustomerInfo into our internal subscription tier.
 * Higher tier wins (ai_concierge > logistics > team_info > free).
 */
export function tierFromCustomerInfo(info: CustomerInfo): "free" | "team_info" | "logistics" | "ai_concierge" {
  const active = info.entitlements.active;
  if (active["ai_concierge"]) return "ai_concierge";
  if (active["fan_travel_pack"]) return "logistics";
  if (active["team_info"]) return "team_info";
  return "free";
}
