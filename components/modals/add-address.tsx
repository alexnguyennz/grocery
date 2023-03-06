import { useState, type Dispatch, type SetStateAction } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

/*** SUPABASE ***/
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  getUserAddresses,
  type User,
  type GetUserAddresses,
} from '@/src/utils/supabase';

/*** COMPONENTS ***/
import AddressFinder from '@/components/address-finder';

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PageProps = {
  user: User;
  setAddresses: Dispatch<SetStateAction<GetUserAddresses>>;
};

export default function AddAddressModal({ user, setAddresses }: PageProps) {
  const supabase = useSupabaseClient();

  /*** STATE ***/
  const [loading, setLoading] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<AddressComponent[]>(
    []
  );

  async function addAddress(address: AddressComponent[]) {
    setLoading(true);

    const { error } = await supabase.from('user_addresses').insert({
      user_id: user.id,
      address_line1: address[0].long_name + ' ' + address[1].long_name,
      address_line2: address[2].long_name,
      city: address[3].long_name,
      post_code: address[6].long_name,
    });

    if (!error)
      showNotification({
        message: 'Address successfully added',
        color: 'green',
        icon: <IconCheck />,
      });

    const { data } = await getUserAddresses(supabase);

    setAddresses(data);

    // reset state
    setLoading(false);
    closeAllModals();
  }

  return (
    <Stack>
      <AddressFinder
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
      <Group position="right">
        <Button
          onClick={() => addAddress(selectedAddress)}
          type="submit"
          loading={loading}
          loaderPosition="right"
          disabled={!selectedAddress.length}
          color="cyan.6"
        >
          Add address
        </Button>
      </Group>
    </Stack>
  );
}
