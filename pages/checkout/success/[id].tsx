import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import type { GetServerSideProps } from 'next';

import { Badge, Button, Table, Text, Title } from '@mantine/core';

/*** UTILITIES ***/
import formatAddress from '@/src/utils/formatAddress';
import formatdate from '@/src/utils/formatDate';
import capitalize from '@/src/utils/capitalize';

/*** SUPABASE ***/
import {
  createServerSupabaseClient,
  type SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

import Stripe from 'stripe';
import { useEffect } from 'react';

import { useStore } from '@/src/state/store';

async function getOrderItems(
  supabase: SupabaseClient,
  id: string | string[] | undefined,
  user_id: string | undefined
) {
  return await supabase
    .from('order_items')
    .select('*, orders(*), products(*)')
    .eq('order_id', id)
    .eq('orders.user_id', user_id);
}

type Orders = Database['public']['Tables']['orders']['Row'];
type OrderItemsResponse = Awaited<ReturnType<typeof getOrderItems>>;
type OrderItemsResponseSuccess = OrderItemsResponse['data'] & {
  orders: Orders[];
};

type PageProps = {
  order: OrderItemsResponseSuccess;
  status: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id, payment_intent } = ctx.query;

  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // fetch all order items
  const { data } = await getOrderItems(supabase, id, session?.user.id);

  console.log('data', data);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
  });

  const paymentIntent = await stripe.paymentIntents.retrieve(
    payment_intent as string
  );

  if (paymentIntent.status === 'succeeded') {
    console.log('updating status');

    // update order status
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', id)
      .eq('user_id', session?.user.id);

    if (error) console.log('Error updating order status', error);
  }

  return {
    props: {
      order: data,
      status: paymentIntent.status,
    },
  };
};

export default function OrderSuccess({ order, status }: PageProps) {
  const { push } = useRouter();

  /*** STATE ***/
  const { clearTrolley } = useStore();

  useEffect(() => {
    clearTrolley([]); // if no error, clear the cart
  }, []);

  return (
    <div className="space-y-3">
      <Head>
        <title>Order CU{order[0].order_id} Created</title>
      </Head>

      <Title order={1} className="text-center">
        Order CU{order[0].order_id} Created
      </Title>

      <div className="p-5 bg-white space-y-4 border border-gray-400">
        {status === 'succeeded' ? (
          <Badge color="green">Paid</Badge>
        ) : (
          <Badge color="red">Pending</Badge>
        )}
        <Text>
          Order date:
          <br />
          {order.length > 0 && (
            <strong>{formatdate(order[0].orders.created_at)}</strong>
          )}
        </Text>
        <Text className="whitespace-pre-line">
          Deliver to:
          <br />
          {order.length > 0 && (
            <strong>{formatAddress(order[0].orders.address)}</strong>
          )}
        </Text>

        <Table captionSide="bottom" highlightOnHover verticalSpacing="md">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order &&
              order.map((order) => (
                <tr key={order.sku}>
                  <td>
                    <div className="flex space-x-10 items-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${order.products.sku}/${order.products.sku}.jpg`}
                        alt={order.products.name}
                        width={85}
                        height={85}
                        className="hidden md:block"
                      />
                      <NextLink href={`/shop/product/${order.sku}`}>
                        <Text>{capitalize(order.products.name)}</Text>
                      </NextLink>
                    </div>
                  </td>

                  <td>${order.price.toFixed(2)}</td>
                  <td>{order.quantity}</td>
                  <td>${(order.price * order.quantity).toFixed(2)}</td>
                </tr>
              ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <strong>
                  ${!!order.length && order[0].orders.price.toFixed(2)}
                </strong>
              </td>
            </tr>
          </tbody>
        </Table>

        <div className="flex justify-between pt-5 mt-5 bg-white">
          <div className="space-x-3">
            <Button onClick={() => push('/')} color="cyan.6">
              Return home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
