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

async function createProducts() {
  console.log('Getting Stripe credentials...');
  const secretKey = await getCredentials();
  
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });

  console.log('Checking for existing products...');
  const existingProducts = await stripe.products.list({ limit: 10 });
  
  if (existingProducts.data.length > 0) {
    console.log('Products already exist:');
    for (const product of existingProducts.data) {
      console.log(`  - ${product.name} (${product.id})`);
    }
    console.log('\nTo recreate products, archive them in the Stripe Dashboard first.');
    return;
  }

  console.log('Creating FIFA 2026 subscription products...');

  const monthlyProduct = await stripe.products.create({
    name: 'FIFA 2026 Monthly Pass',
    description: 'Monthly access to the FIFA 2026 World Cup Companion app with all features.',
    metadata: {
      plan_type: 'monthly',
      features: 'teams,matches,cities,transportation,dining,lodging,concierge'
    }
  });
  console.log(`Created product: ${monthlyProduct.name} (${monthlyProduct.id})`);

  const monthlyPrice = await stripe.prices.create({
    product: monthlyProduct.id,
    unit_amount: 999,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { price_id: 'price_monthly' }
  });
  console.log(`Created price: $9.99/month (${monthlyPrice.id})`);

  const tournamentProduct = await stripe.products.create({
    name: 'FIFA 2026 Tournament Pass',
    description: 'One-time purchase for full access through August 2026. Best value for World Cup fans!',
    metadata: {
      plan_type: 'tournament',
      features: 'teams,matches,cities,transportation,dining,lodging,concierge,offline,priority,insights,vip'
    }
  });
  console.log(`Created product: ${tournamentProduct.name} (${tournamentProduct.id})`);

  const tournamentPrice = await stripe.prices.create({
    product: tournamentProduct.id,
    unit_amount: 2499,
    currency: 'usd',
    metadata: { price_id: 'price_tournament' }
  });
  console.log(`Created price: $24.99 one-time (${tournamentPrice.id})`);

  console.log('\n✓ Products created successfully!');
  console.log('\nUpdate your Pricing.tsx with these price IDs:');
  console.log(`  Monthly: ${monthlyPrice.id}`);
  console.log(`  Tournament: ${tournamentPrice.id}`);
}

createProducts().catch(console.error);
