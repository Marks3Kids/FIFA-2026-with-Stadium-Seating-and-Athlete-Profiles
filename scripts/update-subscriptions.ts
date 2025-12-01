import Stripe from 'stripe';

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', 'stripe');
  url.searchParams.set('environment', 'development');

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X_REPLIT_TOKEN': xReplitToken
    }
  });

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings?.settings?.secret) {
    throw new Error('Stripe connection not found');
  }

  return connectionSettings.settings.secret;
}

async function updateSubscriptions() {
  console.log('Getting Stripe credentials...');
  const secretKey = await getCredentials();
  
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
