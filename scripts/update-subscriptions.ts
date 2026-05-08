import Stripe from 'stripe';

function getCredentials(): string {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe credentials not configured. Set STRIPE_SECRET_KEY env var.');
  }
  return process.env.STRIPE_SECRET_KEY;
}

async function updateSubscriptions() {
  console.log('Getting Stripe credentials...');
  const secretKey = getCredentials();
  
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });

  // Archive old prices
  console.log('Archiving old prices...');
  try {
    await stripe.prices.update('price_1SYdhHLI0BitNJUzvIeFcx7R', { active: false });
    await stripe.prices.update('price_1SYdhHLI0BitNJUz4g5KnugH', { active: false });
  } catch (e) {
    console.log('Some prices already archived, continuing...');
  }

  // Archive old products and create new ones
  console.log('Archiving old products...');
  const oldProducts = await stripe.products.list({ limit: 10 });
  for (const product of oldProducts.data) {
    if (product.active) {
      await stripe.products.update(product.id, { active: false });
    }
  }

  // Create new Basic App product
  console.log('Creating Basic App product...');
  const basicProduct = await stripe.products.create({
    name: 'FIFA 2026 Basic App',
    description: 'One-time access to essential World Cup information including all 48 qualified teams, 16 host city guides, and First Round Schedule.',
    metadata: {
      plan_type: 'basic',
      features: 'teams,cities,first_round_schedule'
    }
  });

  const basicPrice = await stripe.prices.create({
    product: basicProduct.id,
    unit_amount: 499, // $4.99
    currency: 'usd',
    metadata: { price_id: 'price_basic' }
  });
  console.log(`Created: Basic App $4.99 one-time (${basicPrice.id})`);

  // Create new Premier Pass product
  console.log('Creating Premier Pass product...');
  const premierProduct = await stripe.products.create({
    name: 'FIFA 2026 Premier Pass',
    description: 'Full access to all features through August 2026. Best value for World Cup fans!',
    metadata: {
      plan_type: 'premier',
      features: 'teams,matches,cities,transportation,dining,lodging,concierge,offline,priority,insights,vip'
    }
  });

  const premierPrice = await stripe.prices.create({
    product: premierProduct.id,
    unit_amount: 1999, // $19.99
    currency: 'usd',
    metadata: { price_id: 'price_premier' }
  });
  console.log(`Created: Premier Pass $19.99 one-time (${premierPrice.id})`);

  console.log('\n✓ Products updated successfully!');
  console.log(`Basic App: ${basicPrice.id}`);
  console.log(`Premier Pass: ${premierPrice.id}`);
}

updateSubscriptions().catch(console.error);
