/**
 * Runtime detection for the Capacitor native shell.
 *
 * - Native shell (Android APK / iOS app): bridges Capacitor plugins (including
 *   RevenueCat) and must use in-app billing — Stripe checkout is not allowed
 *   by Google/Apple inside a store-distributed app.
 * - Web (PWA, mobile browser, desktop): no Capacitor bridge, use Stripe.
 */
export function isCapacitorNative(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as any).Capacitor;
  return !!cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform();
}

export function getCapacitorPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  const cap = (window as any).Capacitor;
  if (!cap || typeof cap.getPlatform !== "function") return "web";
  const p = cap.getPlatform();
  return p === "ios" || p === "android" ? p : "web";
}
