import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';

const PRICE_TO_TIER_MAP: Record<string, string> = {
  // Current confirmed live price IDs
  "price_1THSBaKAEwbrdBYlG9ZcGihH": "team_info",
  "price_1THSBbKAEwbrdBYlwHYKBEH3": "logistics",
  "price_1THSBbKAEwbrdBYlNqa3K4Cs": "ai_concierge",
  "price_1SoSVEKAEwbrdBYlYWUlAyJU": "ai_concierge", // AI Message Pack add-on
  // Legacy price IDs (kept for existing purchases)
  "price_1SoSQYKAEwbrdBYlW0kPI4ww": "team_info",
  "price_1SoSSoKAEwbrdBYlphO1lVDx": "logistics",
  "price_1SoSU6KAEwbrdBYloERNzAzQ": "ai_concierge",
  "price_1Sn6eHEwO7dpbt1eB8PGVFhA": "team_info",
  "price_1Sn6kREwO7dpbt1eKfbFJrIq": "logistics",
  "price_1Sn6ovEwO7dpbt1eXZ45C5pP": "ai_concierge",
  "price_1Sn8dSEwO7dpbt1e9m1RS1cb": "ai_concierge",
};

const TIER_HIERARCHY = ["free", "team_info", "logistics", "ai_concierge"];

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string, uuid: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    const event = JSON.parse(payload.toString());

    console.log(`[Webhook] Received event type="${event.type}" id="${event.id}"`);

    if (event.type === 'checkout.session.completed') {
      console.log(`[Webhook] Routing checkout.session.completed to handleCheckoutCompleted`);
      await WebhookHandlers.handleCheckoutCompleted(event.data.object);
    }

    try {
      await sync.processWebhook(payload, signature, uuid);
    } catch (syncError: any) {
      if (syncError?.message?.includes('Unhandled webhook event')) {
        console.log(`[Webhook] Ignoring unhandled event type "${event.type}" — not a failure`);
      } else {
        throw syncError;
      }
    }
  }

  static async handleCheckoutCompleted(session: any): Promise<void> {
    console.log(`[Webhook] handleCheckoutCompleted: session_id=${session.id} payment_status=${session.payment_status}`);

    try {
      if (session.payment_status !== 'paid') {
        console.log(`[Webhook] Skipping — payment_status=${session.payment_status} is not "paid"`);
        return;
      }

      // Source 1: Stripe session fields
      const emailFromSession = session.customer_email || session.customer_details?.email;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

      // Source 2: metadata we embedded at checkout creation — always reliable
      const meta = session.metadata || {};
      const emailFromMeta   = meta.email   || null;
      const priceIdFromMeta = meta.priceId || null;
      const tierFromMeta    = meta.tier    || null;

      // Resolve: prefer session fields, fall back to metadata
      const email = emailFromSession || emailFromMeta || null;

      console.log(`[Webhook] email=${email} priceIdFromMeta=${priceIdFromMeta} tierFromMeta=${tierFromMeta}`);

      if (!email) {
        // Last resort: retrieve the full session from Stripe to get customer details
        console.log(`[Webhook] No email in session fields or metadata — retrieving full session from Stripe`);
        try {
          const stripe = await getUncachableStripeClient();
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items', 'customer'],
          });
          const retrievedEmail = fullSession.customer_email || (fullSession.customer_details as any)?.email;
          if (retrievedEmail) {
            const priceId = (fullSession.line_items as any)?.data?.[0]?.price?.id || priceIdFromMeta;
            const tier = (priceId && PRICE_TO_TIER_MAP[priceId]) || tierFromMeta || 'team_info';
            await WebhookHandlers.upsertPurchase(retrievedEmail, tier, priceId || '', customerId || null, session.id);
          } else {
            console.warn(`[Webhook] Still no email after full session retrieve — cannot write purchase`);
          }
        } catch (err) {
          console.error(`[Webhook] Failed to retrieve full session:`, err);
        }
        return;
      }

      // Retrieve full session to get line_items (priceId)
      let resolvedPriceId = priceIdFromMeta;
      try {
        const stripe = await getUncachableStripeClient();
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items'],
        });
        const lineItemPriceId = (fullSession.line_items as any)?.data?.[0]?.price?.id;
        if (lineItemPriceId) resolvedPriceId = lineItemPriceId;
      } catch (err) {
        console.warn(`[Webhook] Could not retrieve line_items, using metadata priceId:`, err);
      }

      const tier = (resolvedPriceId && PRICE_TO_TIER_MAP[resolvedPriceId]) || tierFromMeta || 'team_info';
      console.log(`[Webhook] Resolved priceId=${resolvedPriceId} tier=${tier}`);

      await WebhookHandlers.upsertPurchase(email, tier, resolvedPriceId || '', customerId || null, session.id);

    } catch (error) {
      console.error('[Webhook] Error in handleCheckoutCompleted:', error);
    }
  }

  static async upsertPurchase(
    email: string,
    tier: string,
    priceId: string,
    stripeCustomerId: string | null,
    stripeSessionId: string
  ): Promise<void> {
    const existingPurchase = await storage.getPurchaseByEmail(email);

    if (!existingPurchase) {
      await storage.createPurchase({ email, tier, priceId, stripeCustomerId, stripeSessionId });
      console.log(`[Webhook] Created purchase email=${email} tier=${tier}`);
    } else {
      const currentIdx = TIER_HIERARCHY.indexOf(existingPurchase.tier);
      const newIdx     = TIER_HIERARCHY.indexOf(tier);
      if (newIdx > currentIdx) {
        await storage.updatePurchaseTier(email, tier);
        console.log(`[Webhook] Upgraded email=${email} ${existingPurchase.tier}→${tier}`);
      } else {
        console.log(`[Webhook] Purchase for email=${email} already at tier=${existingPurchase.tier} — no upgrade needed`);
      }
    }
  }
}
