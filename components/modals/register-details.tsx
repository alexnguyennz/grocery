import { useEffect, useState } from 'react';
import { Button, Flex, Group, Stack, Stepper, TextInput } from '@mantine/core';
import { closeModal, closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import {
  IconCalendar,
  IconPhone,
  IconUser,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

import { useStore } from '@/src/state/store';

/*** SUPABASE ***/
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { insertUser, type InsertUser } from '@/src/utils/supabase';

/*** COMPONENTS ***/
import AddressFinder from '@/components/address-finder';

export function RegisterStepperTwo() {
  return (
    <Stepper color="cyan.6" active={1} breakpoint="sm">
      <Stepper.Step
        onClick={() => alert('test')}
        label="Step 1"
        description="Create an account"
      ></Stepper.Step>
      <Stepper.Step
        label="Step 2"
        description="Add your details"
      ></Stepper.Step>
    </Stepper>
  );
}

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export default function RegisterDetailsModal() {
  const [loading, setLoading] = useState(false);

  /*** STATE ***/
  const setAccount = useStore<InsertUser>((state) => state.setAccount);

  // form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<AddressComponent[]>(
    []
  );

  const supabase = useSupabaseClient();

  async function addDetails() {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data, error } = await insertUser(
      supabase,
      session?.user.id,
      firstName,
      lastName,
      session?.user?.email,
      phoneNumber,
      dateOfBirth
    );

    // insert user address
    const addressData = await addAddress(selectedAddress, session?.user.id!);

    // update user's record with user address
    const { error: updatedAddressError } = await supabase
      .from('users')
      .update({ selected_user_address: addressData.id })
      .eq('id', session?.user.id);

    setLoading(false);

    if (error) {
      showNotification({
        message: error.message,
        color: 'red',
        icon: <IconX />,
      });
    } else {
      showNotification({
        message: 'Registration successful',
        color: 'green',
        icon: <IconCheck />,
      });

      setAccount(data);
      closeAllModals();
    }
  }

  async function addAddress(address: AddressComponent[], user_id: string) {
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: user_id,
        address_line1: address[0].long_name + ' ' + address[1].long_name,
        address_line2: address[2].long_name,
        city: address[3].long_name,
        post_code: address[6].long_name,
      })
      .select()
      .single();

    console.log('data', data);
    console.log('error', error);

    return data;
  }

  return (
    <Stack>
      <Flex gap="md">
        <TextInput
          type="text"
          label="First Name"
          placeholder="Your first name"
          icon={<IconUser size={20} />}
          size="md"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <TextInput
          type="text"
          label="Last Name"
          placeholder="Your last name"
          icon={<IconUser size={20} />}
          size="md"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </Flex>

      <AddressFinder
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />

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

      <DatePicker
        label="Date of Birth"
        placeholder="Your date of birth"
        icon={<IconCalendar size={20} />}
        size="md"
        value={dateOfBirth}
        onChange={setDateOfBirth}
        allowFreeInput
        inputFormat="DD/MM/YYYY"
        required
        width={1000}
      />

      <Group position="right">
        <Button
          onClick={() => closeModal('register-two')}
          color="cyan.6"
          variant="subtle"
        >
          Back
        </Button>
        <Button
          onClick={addDetails}
          color="cyan.6"
          loading={loading}
          loaderPosition="right"
          disabled={!selectedAddress.length}
        >
          Register
        </Button>
      </Group>
    </Stack>
  );
}
