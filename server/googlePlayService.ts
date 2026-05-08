/**
 * Google Play Billing receipt verification.
 *
 * When a user purchases via Google Play Billing in the TWA, the client
 * receives a `purchaseToken`. The token must be verified server-side by
 * calling the Android Publisher API; only after Google confirms the token
 * is valid should we mark the user as subscribed.
 *
 * Setup required (one-time):
 * 1. Create a Google Cloud project linked to the Play Console app
 * 2. Enable the "Google Play Android Developer API"
 * 3. Create a service account, download the JSON key
 * 4. Grant the service account "Financial data, order management, app information (read-only)"
 *    permission on the linked app in Play Console
 * 5. Set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON env var to the JSON string contents
 */

import { google } from "googleapis";

const PACKAGE_NAME = "com.mingledtreasures.championshipconcierge";

let publisherClient: any = null;

async function getPublisherClient() {
  if (publisherClient) return publisherClient;

  const keyJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!keyJson) {
    throw new Error(
      "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON not configured. Add the service account JSON to env vars."
    );
  }

  const credentials = JSON.parse(keyJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });

  publisherClient = google.androidpublisher({ version: "v3", auth });
  return publisherClient;
}

export interface PurchaseVerification {
  valid: boolean;
  productId: string;
  orderId?: string;
  purchaseTimeMillis?: string;
  purchaseState?: number;
  consumptionState?: number;
  acknowledgementState?: number;
  rawResponse?: any;
}

/**
 * Verify a one-time product purchase token.
 * Use for in-app products like "team_info", "fan_travel_pack", "ai_concierge", "message_pack".
 */
export async function verifyProductPurchase(
  productId: string,
  purchaseToken: string
): Promise<PurchaseVerification> {
  const client = await getPublisherClient();

  try {
    const result = await client.purchases.products.get({
      packageName: PACKAGE_NAME,
      productId,
      token: purchaseToken,
    });

    // purchaseState: 0 = purchased, 1 = canceled, 2 = pending
    const valid = result.data.purchaseState === 0;

    return {
      valid,
      productId,
      orderId: result.data.orderId,
      purchaseTimeMillis: result.data.purchaseTimeMillis,
      purchaseState: result.data.purchaseState,
      consumptionState: result.data.consumptionState,
      acknowledgementState: result.data.acknowledgementState,
      rawResponse: result.data,
    };
  } catch (err: any) {
    console.error("[GooglePlay] Product purchase verification failed:", err.message);
    return { valid: false, productId };
  }
}

/**
 * Acknowledge a verified purchase. Google requires acknowledgement within
 * 3 days or the purchase is auto-refunded.
 */
export async function acknowledgeProductPurchase(
  productId: string,
  purchaseToken: string
): Promise<boolean> {
  const client = await getPublisherClient();

  try {
    await client.purchases.products.acknowledge({
      packageName: PACKAGE_NAME,
      productId,
      token: purchaseToken,
    });
    return true;
  } catch (err: any) {
    console.error("[GooglePlay] Acknowledgement failed:", err.message);
    return false;
  }
}
