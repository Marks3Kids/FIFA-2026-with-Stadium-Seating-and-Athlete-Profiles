import Stripe from 'stripe';

function getCredentials(): string {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe credentials not configured. Set STRIPE_SECRET_KEY env var.');
  }
  return process.env.STRIPE_SECRET_KEY;
}

async function createNewPricing() {
  console.log('Getting Stripe credentials...');
  const secretKey = getCredentials();
  
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });

  console.log('\n=== Creating Championship Concierge Products ===\n');

  // Check for existing products
  const existingProducts = await stripe.products.list({ limit: 100 });
  console.log(`Found ${existingProducts.data.length} existing products`);

  // Archive old products first (optional - comment out if you want to keep them)
  // for (const product of existingProducts.data) {
  //   if (product.active) {
  //     await stripe.products.update(product.id, { active: false });
  //     console.log(`Archived: ${product.name}`);
  //   }
  // }

  // Create 4-tier pricing structure

  // Tier 1: Team Info ($4.99) - Basic team and playoff info
  const teamInfoProduct = await stripe.products.create({
    name: 'Championship Concierge - Team Info',
    description: 'Access to all 48 qualified teams, player rosters, knockout brackets, match schedules, and tournament news through August 2026.',
    metadata: {
      tier: 'team_info',
      features: 'teams,players,brackets,matches,news,history,odds'
    }
  });
  console.log(`Created: ${teamInfoProduct.name} (${teamInfoProduct.id})`);

  const teamInfoPrice = await stripe.prices.create({
    product: teamInfoProduct.id,
    unit_amount: 499,
    currency: 'usd',
    metadata: { tier: 'team_info', display_name: 'Team Info' }
  });
  console.log(`  Price: $4.99 (${teamInfoPrice.id})`);

  // Tier 2: Logistics ($14.99) - City guides, transportation, lodging, dining
  const logisticsProduct = await stripe.products.create({
    name: 'Championship Concierge - Logistics',
    description: 'Everything in Team Info PLUS complete city guides for all 16 host cities, transportation options, lodging recommendations, dining guides, and essential travel information.',
    metadata: {
      tier: 'logistics',
      features: 'teams,players,brackets,matches,news,history,odds,cities,transportation,lodging,dining,essential_travel,safety,medical,religious'
    }
  });
  console.log(`Created: ${logisticsProduct.name} (${logisticsProduct.id})`);

  const logisticsPrice = await stripe.prices.create({
    product: logisticsProduct.id,
    unit_amount: 1499,
    currency: 'usd',
    metadata: { tier: 'logistics', display_name: 'Logistics' }
  });
  console.log(`  Price: $14.99 (${logisticsPrice.id})`);

  // Tier 3: AI Concierge ($24.99) - Everything + AI assistant
  const aiConciergeProduct = await stripe.products.create({
    name: 'Championship Concierge - AI Concierge',
    description: 'The complete experience! Everything in Logistics PLUS unlimited AI Concierge assistant for personalized trip planning, real-time recommendations, visa guidance, and 24/7 travel support.',
    metadata: {
      tier: 'ai_concierge',
      features: 'teams,players,brackets,matches,news,history,odds,cities,transportation,lodging,dining,essential_travel,safety,medical,religious,ai_concierge,trip_planner'
    }
  });
  console.log(`Created: ${aiConciergeProduct.name} (${aiConciergeProduct.id})`);

  const aiConciergePrice = await stripe.prices.create({
    product: aiConciergeProduct.id,
    unit_amount: 2499,
    currency: 'usd',
    metadata: { tier: 'ai_concierge', display_name: 'AI Concierge' }
  });
  console.log(`  Price: $24.99 (${aiConciergePrice.id})`);

  console.log('\n=== Products Created Successfully ===\n');
  console.log('Pricing Tiers:');
  console.log('  FREE     - Knockout Bracket PDF (requires email capture)');
  console.log(`  $4.99    - Team Info        (${teamInfoPrice.id})`);
  console.log(`  $14.99   - Logistics        (${logisticsPrice.id})`);
  console.log(`  $24.99   - AI Concierge     (${aiConciergePrice.id})`);
  console.log('\nUpdate your Pricing component with these price IDs!');
}

createNewPricing().catch(console.error);
