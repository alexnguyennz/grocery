import { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import type { GetServerSideProps } from 'next';

import {
  Button,
  Input,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  Paper,
} from '@mantine/core';

import { useStore } from '@/src/state/store';

/*** COMPONENTS ***/
import Quantity from '@/components/product/product-quantity';

/*** SUPABASE ***/
import {
  createServerSupabaseClient,
  type SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  getSelectedAddress,
  getUserAddresses,
  type Cart,
} from '@/src/utils/supabase';

/*** UTILS ***/
import capitalize from '@/src/utils/capitalize';

type SelectedAddressResponse = Awaited<ReturnType<typeof getSelectedAddress>>;
type SelectedAddressResponseSuccess = SelectedAddressResponse['data'];
type UserAddressesResponse = Awaited<ReturnType<typeof getUserAddresses>>;
type UserAddressesResponseSuccess = UserAddressesResponse['data'];

type PageProps = {
  user: SelectedAddressResponseSuccess;
  user_addresses: UserAddressesResponseSuccess;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // fetch current selected address to place into potential order
  const { data } = await getSelectedAddress(supabase, session?.user.id);

  // get all user's addresses
  const { data: user_addresses } = await getUserAddresses(
    supabase,
    session?.user.id
  );

  return {
    props: {
      user: data,
      user_addresses,
    },
  };
};

export default function ReviewOrder({ user, user_addresses }: PageProps) {
  const { push } = useRouter();

  /*** STATE ***/
  const account = useStore((state) => state.account);

  const cart = useStore((state) => state.cart);
  const clearTrolley = useStore((state) => state.clearTrolley);
  const [total, setTotal] = useState(0.0);

  const [cartTotal, setCartTotal] = useState(0);

  const [selectedAddress, setSelectedAddress] = useState(
    user.selected_user_address
  );

  useEffect(() => {
    setCartTotal(cart.length);
  }, [cart]);

  const [list, setList] = useState('');

  const [listSuccess, setListSuccess] = useState(false);

  const supabase = useSupabaseClient();

  /*** MODALS ***/
  const [addressOpened, setAddressOpened] = useState(false);
  const [clearCartOpened, setClearCartOpened] = useState(false);
  const [emptyCartOpened, setEmptyCartOpened] = useState(false);

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

  async function clear() {
    clearTrolley([]);
    setClearCartOpened(false);
  }

  async function changeAddress(user_address_id: number) {
    const { data } = await supabase
      .from('users')
      .update({ selected_user_address: user_address_id })
      .eq('id', user.id)
      .select('*, selected_user_address (*)')
      .single();

    setSelectedAddress(data?.selected_user_address);

    setAddressOpened(false);
  }

  return (
    <div className="space-y-5">
      <Head>
        <title>Review Order</title>
      </Head>
      {/* Trolley */}
      <Paper shadow="xs" p="md">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Title order={1}>Cart</Title>
            <p className="text-xl">{cartTotal} items</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* <FormControl as="fieldset">
              <Checkbox colorScheme="green" size="lg" defaultChecked>
                Allow substitutes for all
              </Checkbox>
            </FormControl> */}
          </div>
        </div>
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
                    {/* <Text>
                      {product.weight / 1000}
                      {product.measurement} ${product.price / 10} / 100m
                      {product.measurement}
                    </Text> */}
                  </NextLink>
                  <Text className="mt-5">
                    ${product.price.salePrice.toFixed(2)} each
                  </Text>
                </div>
              </div>
              <div className="flex space-x-10 items-center">
                <Quantity product={product} />
                <Text className="font-semibold">
                  $
                  {(product.price.salePrice * product.cart_quantity).toFixed(2)}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Paper>
      {/* Totals */}
      <Paper shadow="xs" p="md">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <Text>Deliver to:</Text>

            <Text>
              {selectedAddress.address_line1}
              <br />
              {selectedAddress.address_line2}
              <br />
              {selectedAddress.city + ' ' + selectedAddress.post_code}
            </Text>

            <Text className="font-semibold space-x-3">
              <span className="font-normal">
                <Button
                  onClick={() => setAddressOpened(true)}
                  color="cyan.6"
                  variant="outline"
                >
                  Change address
                </Button>
              </span>
            </Text>
          </div>
          <div className="flex gap-10">
            <div>
              <ul className="space-y-5">
                <li className="text-lg">Delivery fee</li>
                <li className="text-lg">Subtotal</li>
                <li className="text-2xl font-bold">Total (incl. GST)</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-5 text-right">
                <li className="text-lg">Free</li>
                <li className="text-lg">${total}</li>
                <li className="text-2xl font-bold">${total}</li>
              </ul>
            </div>
          </div>
        </div>
      </Paper>

      <Paper shadow="xs" p="md">
        <div className="flex justify-between">
          <div className="space-x-3">
            <Button onClick={() => push('/')} color="cyan.6" variant="outline">
              Continue shopping
            </Button>
            <Button onClick={() => setClearCartOpened(true)} color="red">
              Clear cart
            </Button>
          </div>

          <Button
            onClick={
              cartTotal > 0
                ? () => push('/checkout/payment')
                : () => setEmptyCartOpened(true)
            }
            color={'cyan.6'}
          >
            Payment
          </Button>
        </div>
      </Paper>
      <Modal
        title="Choose a delivery address"
        opened={addressOpened}
        onClose={() => setAddressOpened(false)}
        centered
      >
        <Stack>
          <div className="space-y-5">
            {user_addresses &&
              user_addresses.map((address) => (
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
                    onClick={() => changeAddress(address.id)}
                    color="cyan.6"
                    disabled={selectedAddress.id == address.id}
                  >
                    Change
                  </Button>
                </div>
              ))}
          </div>
        </Stack>
      </Modal>
      <Modal
        title="Clear your cart?"
        opened={clearCartOpened}
        onClose={() => setClearCartOpened(false)}
        centered
      >
        <Stack>
          <Text>All items will be removed from your cart.</Text>
          <Group>
            <Button onClick={clear} color="cyan.6">
              Yes, clear cart
            </Button>
            <Button onClick={() => setClearCartOpened(false)} color={'red.8'}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        title="Please add some items to your cart before checking out."
        opened={emptyCartOpened}
        onClose={() => setEmptyCartOpened(false)}
        centered
      >
        <Stack>
          <Button onClick={() => setEmptyCartOpened(false)} color={'green.8'}>
            Continue
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}
