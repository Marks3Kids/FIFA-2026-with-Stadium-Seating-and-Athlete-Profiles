import Stripe from 'stripe';

function getCredentials() {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe credentials not configured. Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY env vars.');
  }
  return {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  };
}

export function getUncachableStripeClient() {
  const { secretKey } = getCredentials();
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });
}

export function getStripePublishableKey() {
  return getCredentials().publishableKey;
}

export function getStripeSecretKey() {
  return getCredentials().secretKey;
}
