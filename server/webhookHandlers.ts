import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';

const PRICE_TO_TIER_MAP: Record<string, string> = {
  "price_1SoSQYKAEwbrdBYlW0kPI4ww": "team_info",
  "price_1SoSSoKAEwbrdBYlphO1lVDx": "logistics", 
  "price_1SoSU6KAEwbrdBYloERNzAzQ": "ai_concierge",
  "price_1SoSVEKAEwbrdBYlYWUlAyJU": "ai_concierge",
  "price_1Sn6eHEwO7dpbt1eB8PGVFhA": "team_info",
  "price_1Sn6kREwO7dpbt1eKfbFJrIq": "logistics", 
  "price_1Sn6ovEwO7dpbt1eXZ45C5pP": "ai_concierge",
  "price_1Sn8dSEwO7dpbt1e9m1RS1cb": "ai_concierge",
};

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
    
    if (event.type === 'checkout.session.completed') {
      await WebhookHandlers.handleCheckoutCompleted(event.data.object);
    }
    
    try {
      await sync.processWebhook(payload, signature, uuid);
    } catch (syncError: any) {
      if (syncError?.message?.includes('Unhandled webhook event')) {
        console.log(`Webhook: Ignoring unhandled event type "${event.type}" — not a failure`);
      } else {
        throw syncError;
      }
    }
  }
  
  static async handleCheckoutCompleted(session: any): Promise<void> {
    try {
      if (session.payment_status !== 'paid') {
        return;
      }
      
      const email = session.customer_email || session.customer_details?.email;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      const sessionId = session.id;
      
      if (!email) {
        console.log('Webhook: No email found in checkout session');
        return;
      }
      
      const stripe = await getUncachableStripeClient();
      const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
      });
      
      const priceId = fullSession.line_items?.data?.[0]?.price?.id;
      const tier = priceId ? PRICE_TO_TIER_MAP[priceId] || 'team_info' : 'team_info';
      
      const existingPurchase = await storage.getPurchaseByEmail(email);
      
      if (!existingPurchase) {
        await storage.createPurchase({
          email,
          tier,
          priceId: priceId || '',
          stripeCustomerId: customerId || null,
          stripeSessionId: sessionId,
        });
        console.log(`Webhook: Created purchase for ${email} with tier ${tier}`);
      } else {
        const tierHierarchy = ["free", "team_info", "logistics", "ai_concierge"];
        const currentTierIndex = tierHierarchy.indexOf(existingPurchase.tier);
        const newTierIndex = tierHierarchy.indexOf(tier);
        if (newTierIndex > currentTierIndex) {
          await storage.updatePurchaseTier(email, tier);
          console.log(`Webhook: Upgraded ${email} from ${existingPurchase.tier} to ${tier}`);
        }
      }
    } catch (error) {
      console.error('Webhook: Error handling checkout completed:', error);
    }
  }
}
