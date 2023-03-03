import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import type { GetServerSideProps } from 'next';

/*** SUPABASE ***/
import {
  createServerSupabaseClient,
  type SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

import { Table, Text, Title } from '@mantine/core';

/*** UTILITIES ***/
import capitalize from '@/src/utils/capitalize';
import formatAddress from '@/src/utils/formatAddress';
import formatDate from '@/src/utils/formatDate';

async function getOrderItems(
  supabase: SupabaseClient,
  id: string | string[] | undefined,
  user_id: string | undefined
) {
  return await supabase
    .from('order_items')
    .select('*, orders(*), products(name, sku)')
    .eq('order_id', id)
    .eq('orders.user_id', user_id);
}

type Orders = Database['public']['Tables']['orders']['Row'];
type OrderItemsResponse = Awaited<ReturnType<typeof getOrderItems>>;
type OrderItemsResponseSuccess = OrderItemsResponse['data'] & {
  orders: Orders[];
};

type PageProps = {
  order_items: OrderItemsResponseSuccess;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const supabase = createServerSupabaseClient<Database>(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // fetch all order items
  const { data } = await getOrderItems(supabase, id, session?.user.id);

  return {
    props: {
      order_items: data,
    },
  };
};

export default function Order({ order_items }: PageProps) {
  return (
    <>
      <Head>
        <title>Order CU{order_items[0].order_id} Details</title>
      </Head>
      <div className="space-y-3">
        <Title className="text-center">
          Order CU{order_items[0].order_id} Details
        </Title>
        <NextLink href="/account/orders" className="hover:no-underline">
          <Text className="text-center text-xl text-green-700 font-semibold hover:text-green-800">
            Orders
          </Text>
        </NextLink>
        <div className="p-5 bg-white space-y-4 border border-gray-400">
          <Text>
            Order date:
            <br />
            {order_items.length > 0 && (
              <strong>{formatDate(order_items[0].orders.created_at)}</strong>
            )}
          </Text>
          <Text className="whitespace-pre-line">
            Deliver to:
            <br />
            {order_items.length > 0 && (
              <strong>{formatAddress(order_items[0].orders.address)}</strong>
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
              {order_items &&
                order_items.map((order) => (
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
                    $
                    {order_items.length > 0 &&
                      order_items[0].orders.price.toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
