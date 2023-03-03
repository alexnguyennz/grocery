import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import type { GetServerSideProps } from 'next';

import { Button, Paper, Stack, Text, Title } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

/*** SUPABASE ***/
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import {
  getUser,
  getUserAddresses,
  type User,
  type UserAddresses,
  type GetUserAddresses,
} from '@/src/utils/supabase';

/*** COMPONENTS ***/
import AddressFinderModal from '@/components/modals/add-address';

type UserAddressesResponse = Awaited<ReturnType<typeof getUser>>['data'];

type PageProps = {
  user: User;
  user_addresses: GetUserAddresses;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // get user data
  const { data: user } = await getUser(supabase, session?.user.id);

  // get all user's addresses
  const { data } = await getUserAddresses(supabase, session?.user.id);

  return {
    props: {
      user,
      user_addresses: data,
    },
  };
};

export default function DeliveryAddresses({ user, user_addresses }: PageProps) {
  const supabase = useSupabaseClient();

  const [addresses, setAddresses] = useState<GetUserAddresses>(user_addresses);

  async function deleteAddress(user_address_id: number) {
    // remove address based on index from delivery_addresses array

    // remove address based on id
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', user_address_id);

    if (!error)
      showNotification({
        message: 'Address successfully deleted',
        color: 'green',
        icon: <IconX />,
      });

    // requery table
    const { data } = await getUserAddresses(supabase, user.id);

    setAddresses(data);
  }

  return (
    <>
      <Head>
        <title>Delivery Addresses</title>
      </Head>

      <div className="space-y-3">
        <Title order={2} className="text-center">
          Delivery addresses
        </Title>
        <Text size="lg" className="text-center">
          <Link href="/account/" className="hover:underline">
            &#8249; Account
          </Link>
        </Text>

        <Paper p={20} className="max-w-sm mx-auto border border-gray-400">
          <Stack>
            <Button
              onClick={() => {
                openModal({
                  title: 'Add a delivery address',
                  centered: true,
                  children: (
                    <AddressFinderModal
                      user={user}
                      setAddresses={setAddresses}
                    />
                  ),
                });
              }}
              color="cyan.6"
              fullWidth
            >
              Add a new address
            </Button>

            <div className="space-y-3">
              {addresses &&
                addresses.map((address: UserAddressesResponse) => (
                  <div
                    className="flex justify-between items-center"
                    key={address.id}
                  >
                    <Text>
                      {address.address_line1}
                      <br />
                      {address.address_line2}
                      <br />
                      {address.city + ' ' + address.post_code}
                    </Text>

                    <Button
                      onClick={() => deleteAddress(address.id)}
                      color="red"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
            </div>
          </Stack>
        </Paper>
      </div>
    </>
  );
}
