import { loadStripe, type Stripe } from '@stripe/stripe-js';

const getStripe = () =>
  <Promise<Stripe | null>>(
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  );

export default getStripe;
