import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';

/*** SUPABASE ***/
import {
  createServerSupabaseClient,
  type SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

import { Badge, Paper, Table, Text, Title } from '@mantine/core';

/*** UTILITIES */
import formatdate from '@/src/utils/formatDate';

async function getOrders(
  supabase: SupabaseClient,
  user_id: string | undefined
) {
  return await supabase.from('orders').select().eq('user_id', user_id);
}

type OrderResponse = Awaited<ReturnType<typeof getOrders>>;
type OrderResponseSuccess = OrderResponse['data'];

type PageProps = {
  orders: OrderResponseSuccess;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // fetch all orders for this user
  const { data } = await getOrders(supabase, session?.user.id);

  return {
    props: {
      orders: data,
    },
  };
};

export default function Orders({ orders }: PageProps) {
  console.log('order', orders);
  return (
    <>
      <Head>
        <title>My Orders</title>
      </Head>

      <div className="space-y-3">
        <Title order={2} className="text-center">
          My Orders
        </Title>
        <Text size="lg" className="text-center">
          <Link href="/account/" className="hover:underline">
            &#8249; Account
          </Link>
        </Text>
        <Paper shadow="xs" p="md">
          <Table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders && !!orders.length ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>CU{order.id}</td>
                    <td>{formatdate(order.created_at)}</td>
                    <td>${order.price.toFixed(2)}</td>
                    <td>
                      {order.status === 'pending' ? (
                        <Badge color="pink">{order.status}</Badge>
                      ) : (
                        <Badge color="green">{order.status}</Badge>
                      )}
                    </td>
                    <td>
                      <Link href={`/account/orders/${order.id}`}>
                        View Order
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colSpan={5}>You do not have any orders.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Paper>
      </div>
    </>
  );
}
