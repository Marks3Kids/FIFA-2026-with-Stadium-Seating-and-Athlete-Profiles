import { getUncachableStripeClient } from './stripeClient';
import { db } from '../db';
import { sql } from 'drizzle-orm';

export class StripeService {
  async createCustomer(email: string, userId: number) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      metadata: { userId: userId.toString() },
    });
  }

  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    locale?: string
  ) {
    const stripe = await getUncachableStripeClient();

    const price = await stripe.prices.retrieve(priceId);
    const isRecurring = !!price.recurring;

    return await stripe.checkout.sessions.create({
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      locale: locale || 'auto',
    } as any);
  }

  async createCheckoutSessionWithOptionalCustomer(
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    customerId?: string,
    metadata?: Record<string, string>,
    locale?: string
  ) {
    const stripe = await getUncachableStripeClient();

    const price = await stripe.prices.retrieve(priceId);
    const isRecurring = !!price.recurring;

    const sessionParams: any = {
      automatic_payment_methods: { enabled: true },
      line_items: [{ price: priceId, quantity: 1 }],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      metadata: metadata || {},
      locale: locale || 'auto',
    };

    // payment_intent_data only valid for one-time payment mode
    if (!isRecurring && metadata && Object.keys(metadata).length > 0) {
      sessionParams.payment_intent_data = { metadata };
    }

    if (customerId) {
      sessionParams.customer = customerId;
    }

    return await stripe.checkout.sessions.create(sessionParams);
  }

  async retrieveCheckoutSession(sessionId: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });
  }

  async retrieveCheckoutSessionWithProduct(sessionId: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async getProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE id = ${productId}`
    );
    return result.rows[0] || null;
  }

  async listProducts(active = true) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE active = ${active}`
    );
    return result.rows;
  }

  async listProductsWithPrices(active = true) {
    const result = await db.execute(
      sql`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.active as price_active
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = ${active}
        ORDER BY p.id, pr.unit_amount
      `
    );
    return result.rows;
  }

  async getSubscription(subscriptionId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
    );
    return result.rows[0] || null;
  }

  async getCustomerSubscriptions(customerId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE customer = ${customerId} AND status = 'active'`
    );
    return result.rows;
  }
}

export const stripeService = new StripeService();
