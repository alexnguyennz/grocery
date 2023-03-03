import { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import type { GetServerSideProps } from 'next';

import { Button, Paper, Text } from '@mantine/core';

import { useStore } from '@/src/state/store';

/*** SUPABASE ***/
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Cart } from '@/src/utils/supabase';

/*** COMPONENTS ***/
import CheckoutForm from '@/components/checkout-form';
import LoadingSpinner from '@/components/loading-spinner';

/*** STRIPE ***/
import getStripe from '@/src/utils/stripe';
import { type PaymentIntent } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

/*** UTILS ***/
import { POST } from '@/src/utils/fetch';
import capitalize from '@/src/utils/capitalize';

import { getSelectedAddress, type User } from '@/src/utils/supabase';

type PageProps = {
  user: User;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // fetch current selected address to place into potential order
  const { data } = await getSelectedAddress(supabase, session?.user.id);

  return {
    props: {
      user: data,
    },
  };
};

export default function Payment({ user }: PageProps) {
  const { push } = useRouter();

  /*** STATE ***/
  const cart = useStore((state) => state.cart);
  const [total, setTotal] = useState(0.0);
  const [address, setAddress] = useState(user.selected_user_address);

  useEffect(() => {
    // get total of all cart items * quantities
    setTotal(
      // `This expression is not callable` TS issue https://github.com/microsoft/TypeScript/issues/36390
      (cart as any[])
        .reduce(
          (accumulator: string, item: Cart) =>
            accumulator + item.cart_quantity * item.price.salePrice,
          0
        )
        .toFixed(2)
    );
  }, [cart]);

  /*** STRIPE ***/
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );

  useEffect(() => {
    // create payment intent after total is updated
    if (total > 0)
      POST('/api/payment-intents', { amount: total }).then((data) => {
        setPaymentIntent(data);
      });
  }, [total]);

  if (!paymentIntent) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <Head>
        <title>Enter payment details</title>
      </Head>

      <div className="flex self-start justify-between gap-5">
        {paymentIntent && paymentIntent.client_secret && (
          <Elements
            stripe={getStripe()}
            options={{
              clientSecret: paymentIntent.client_secret,
            }}
          >
            <CheckoutForm cart={cart} user={user}></CheckoutForm>

            <div className="grow self-start justify-between space-y-5 ">
              <Paper shadow="xs" p="md">
                {/* products start*/}
                <div className="space-y-5">
                  {cart.map((product: Cart) => (
                    <div
                      key={product.sku}
                      className="flex space-x-10 items-center justify-between"
                    >
                      <div className="flex space-x-10 items-center">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${product.sku}/${product.sku}.jpg`}
                          alt={product.name!}
                          width={85}
                          height={85}
                        />
                        <div>
                          <NextLink href={`/shop/product/${product.sku}`}>
                            <Text className="font-semibold">
                              {capitalize(product.name!)}
                            </Text>
                          </NextLink>
                          <Text className="mt-5">
                            ${product?.price?.salePrice.toFixed(2)} each
                          </Text>
                        </div>
                      </div>
                      <div className="flex space-x-10 items-center">
                        <Text className="font-semibold">
                          $
                          {(
                            product.price.salePrice * product.cart_quantity
                          ).toFixed(2)}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Paper>

              <Paper shadow="xs" p="md">
                <div className="space-y-3">
                  <Text className="font-bold">Deliver to:</Text>

                  <Text>
                    {address.address_line1}
                    <br />
                    {address.address_line2}
                    <br />
                    {address.city + ' ' + address.post_code}
                  </Text>

                  <Button
                    onClick={() => push('/checkout/revieworder')}
                    color="cyan.6"
                    variant="outline"
                  >
                    Return to cart
                  </Button>
                </div>
              </Paper>
            </div>
          </Elements>
        )}
      </div>
    </div>
  );
}
