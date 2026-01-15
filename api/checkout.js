/**
 * Japan Method - Checkout API Endpoint
 * Handles payment processing with Stripe
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret
 */

// This is a Vercel serverless function
// For it to work, you need to:
// 1. Set STRIPE_SECRET_KEY in Vercel environment variables
// 2. Install stripe package: npm install stripe

const PLANS = {
  essential: {
    name: 'Essential Plan',
    price: 1900, // in cents
    description: 'All 6 method guides, worksheets, and checklists'
  },
  master: {
    name: 'Master Plan',
    price: 3500,
    description: 'Complete digital system with tracking tools'
  },
  ultimate: {
    name: 'Ultimate Plan',
    price: 5500,
    description: 'Premium experience with personalized coaching'
  }
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get plan from query or body
  const plan = req.query.plan || req.body?.plan;

  if (!plan || !PLANS[plan]) {
    return res.status(400).json({
      error: 'Invalid plan',
      validPlans: Object.keys(PLANS)
    });
  }

  // Check for Stripe key
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    // Stripe not configured - return helpful error
    return res.status(503).json({
      error: 'Payment system not configured',
      message: 'Please contact hello@japanmethod.com to complete your purchase.',
      plan: PLANS[plan]
    });
  }

  try {
    // Dynamic import of Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const selectedPlan = PLANS[plan];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
              images: ['https://japanmethod.com/images/logo.png']
            },
            unit_amount: selectedPlan.price
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://japanmethod.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://japanmethod.com'}/pricing`,
      metadata: {
        plan: plan
      }
    });

    // Return checkout URL
    return res.status(200).json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({
      error: 'Payment processing error',
      message: 'Please try again or contact hello@japanmethod.com'
    });
  }
}
