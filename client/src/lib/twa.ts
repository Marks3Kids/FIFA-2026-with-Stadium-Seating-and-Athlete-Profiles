/**
 * Detect whether the app is running inside an Android TWA (Trusted Web Activity).
 * No single signal is 100% reliable; we combine three.
 */
export function isRunningInTWA(): boolean {
  if (typeof window === "undefined") return false;

  // Most reliable: TWAs launch with an android-app:// referrer.
  if (document.referrer.startsWith("android-app://")) return true;

  // Fallback: standalone display mode + Android Chrome WebView.
  const ua = navigator.userAgent || "";
  const isAndroidChrome = /Android/i.test(ua) && /Chrome/i.test(ua);
  const isStandalone =
    typeof window.matchMedia === "function" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches);

  return isAndroidChrome && isStandalone;
}

/**
 * Whether the Digital Goods API is available — required for Google Play
 * Billing inside a TWA (Chrome 91+ on Android).
 */
export function hasDigitalGoodsAPI(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof (window as any).getDigitalGoodsService === "function"
  );
}

/**
 * Whether the current environment can perform Google Play Billing
 * via the Digital Goods + Payment Request APIs.
 */
export function canUseGooglePlayBilling(): boolean {
  return isRunningInTWA() && hasDigitalGoodsAPI();
}
