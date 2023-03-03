import type { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15', // https://github.com/stripe/stripe-node
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {
      amount,
      payment_intent_id,
    }: { amount: number; payment_intent_id?: string } = req.body;

    if (payment_intent_id) {
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );

      // update a Payment Intent
      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: amount * 100,
          }
        );

        console.log('Updated paymentIntent', updated_intent);

        res.status(200).json(updated_intent);
      }
    }

    // create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // minimum of $0.50 amount is required
      currency: 'nzd',
      automatic_payment_methods: { enabled: true },
    });

    console.log('Created paymentIntent', paymentIntent);

    res.status(200).json(paymentIntent);
  }
}
