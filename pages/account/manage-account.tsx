import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import type { GetServerSideProps } from 'next';

import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAt, IconPhone, IconUser } from '@tabler/icons-react';

import { useStore } from '@/src/state/store';

/*** SUPABASE ***/
/*** SUPABASE ***/
import {
  createServerSupabaseClient,
  type SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

/*** UTILS ***/
import formatDateOfBirth from '@/src/utils/formatDateOfBirth';

async function getUser(supabase: SupabaseClient, user_id: string | undefined) {
  return await supabase.from('users').select().eq('id', user_id).single();
}

type UserResponse = Awaited<ReturnType<typeof getUser>>;
type UserResponseSuccess = UserResponse['data'];

type PageProps = {
  user: UserResponseSuccess;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient<Database>(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', session?.user.id)
    .single();

  return {
    props: {
      user: data,
    },
  };
};

export default function ManageAccount({ user }: PageProps) {
  const supabase = useSupabaseClient();

  const [email, setEmail] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    setEmail(user.email);
    setOldEmail(user.email);
    setPhoneNumber(user.phone_number);
  }, [user]);

  async function updateDetails() {
    const { data, error } = await supabase
      .from('users')
      .update({ phone_number: phoneNumber })
      .eq('id', user.id);

    console.log('data', data);
  }

  async function updateEmail() {
    console.log('new email', email);

    const { data, error } = await supabase.auth.updateUser({ email });

    console.log('data', data);

    setOldEmail(email);
  }

  return (
    <>
      <Head>
        <title>Manage Account</title>
      </Head>

      <div className="space-y-3">
        <Title order={2} className="text-center">
          Manage Account
        </Title>
        <Text size="lg" className="text-center">
          <Link href="/account/" className="hover:underline">
            &#8249; Account
          </Link>
        </Text>

        <Paper p={20} className="max-w-sm mx-auto" shadow="xs">
          <Stack>
            <Group>
              <Title order={2} className="text-center">
                Personal details
              </Title>
              <TextInput
                type="text"
                label="Name"
                placeholder="Your name"
                icon={<IconUser size={20} />}
                size="md"
                value={user.first_name + ' ' + user.last_name}
                className="w-full"
                disabled
              />

              {/* <Text>
                <span className="font-semibold">Date of birth</span>:{' '}
                {formatDateOfBirth(user.date_of_birth)}
              </Text> */}

              <TextInput
                type="text"
                label="Phone Number"
                placeholder="Your phone number"
                icon={<IconPhone size={20} />}
                description="We'll use this if we need to contact you about your order."
                inputWrapperOrder={['label', 'error', 'input', 'description']} // put description below input
                size="md"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <Button onClick={updateDetails} color="cyan.6" fullWidth>
                Update details
              </Button>
            </Group>
            <Group>
              <Title order={2} className="text-center">
                Update email
              </Title>
              <TextInput
                type="email"
                name="email"
                label="Email"
                placeholder="Your email address"
                icon={<IconAt size={20} />}
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-autofocus
                required
                className="w-full"
              />
              <Button
                onClick={updateEmail}
                color="cyan.6"
                disabled={email === oldEmail}
                fullWidth
              >
                Update details
              </Button>
            </Group>
            <Group>
              <Title order={2} className="text-center">
                Reset password
              </Title>
              <Button
                component={Link}
                href="/account/forgotpassword"
                color="cyan.6"
                fullWidth
              >
                Reset password
              </Button>
            </Group>
          </Stack>
        </Paper>
      </div>
    </>
  );
}
