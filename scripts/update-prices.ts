import Stripe from 'stripe';

function getCredentials(): string {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe credentials not configured. Set STRIPE_SECRET_KEY env var.');
  }
  return process.env.STRIPE_SECRET_KEY;
}

async function updatePrices() {
  console.log('Getting Stripe credentials...');
  const secretKey = getCredentials();
  
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
