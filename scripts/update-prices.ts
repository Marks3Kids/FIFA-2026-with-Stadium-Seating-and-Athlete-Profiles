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

async function updatePrices() {
  console.log('Getting Stripe credentials...');
  const secretKey = await getCredentials();
  
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });

  // Archive old prices
  console.log('Archiving old prices...');
  await stripe.prices.update('price_1SYdcYLI0BitNJUzp24Z4NLo', { active: false });
  await stripe.prices.update('price_1SYdcYLI0BitNJUzCxHY0rOs', { active: false });

  // Get products
  const products = await stripe.products.list({ limit: 10 });
  const monthlyProduct = products.data.find(p => p.name.includes('Monthly'));
  const tournamentProduct = products.data.find(p => p.name.includes('Tournament'));

  if (!monthlyProduct || !tournamentProduct) {
    throw new Error('Products not found');
  }

  // Create new prices
  console.log('Creating new prices...');
  const newMonthlyPrice = await stripe.prices.create({
    product: monthlyProduct.id,
    unit_amount: 499, // $4.99
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { price_id: 'price_monthly' }
  });
  console.log(`New Monthly price: $4.99/month (${newMonthlyPrice.id})`);

  const newTournamentPrice = await stripe.prices.create({
    product: tournamentProduct.id,
    unit_amount: 1999, // $19.99
    currency: 'usd',
    metadata: { price_id: 'price_tournament' }
  });
  console.log(`New Tournament price: $19.99 one-time (${newTournamentPrice.id})`);

  console.log('\n✓ Prices updated successfully!');
  console.log(`Monthly: ${newMonthlyPrice.id}`);
  console.log(`Tournament: ${newTournamentPrice.id}`);
}

updatePrices().catch(console.error);
