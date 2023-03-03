import Head from 'next/head';
import NextLink from 'next/link';

import { Paper, Title } from '@mantine/core';

/*** STATE ***/
export default function ShopperDetails() {
  return (
    <>
      <Head>
        <title>Manage Account</title>
      </Head>

      <Paper shadow="xs" p="md">
        <Title order={1} className="text-center">
          Manage Account
        </Title>

        <div className="grid md:grid-cols-2">
          <div>
            <Title order={3}>Online shopping</Title>
            <ul className="text-lg space-y-3">
              <li>
                <NextLink href="/account/orders">My orders &rarr; </NextLink>
              </li>
              <li>
                <NextLink href="/account/delivery-addresses">
                  Delivery addresses &rarr;
                </NextLink>
              </li>
            </ul>
          </div>

          <div>
            <Title order={3}>Preferences and account details</Title>
            <ul className="text-lg space-y-3">
              <li>
                <NextLink href="/account/manage-account">
                  Manage account, email and password &rarr;
                </NextLink>
              </li>
            </ul>
          </div>
        </div>
      </Paper>
    </>
  );
}
