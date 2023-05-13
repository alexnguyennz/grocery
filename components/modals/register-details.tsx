import { useState } from "react";
import { Button, Flex, Group, Stack, Stepper, TextInput } from "@mantine/core";
import { closeModal, closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { DatePicker } from "@mantine/dates";
import {
  IconCalendar,
  IconPhone,
  IconUser,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

import { useStore } from "@/src/state/store";

/*** SUPABASE ***/
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { insertUser, type InsertUser } from "@/src/utils/supabase";

/*** COMPONENTS ***/
import AddressFinder from "@/components/address-finder";

import useRegisterDetailsForm from "@/components/modals/useRegisterDetailsForm";

export function RegisterStepperTwo() {
  return (
    <Stepper color="cyan.6" active={1} breakpoint="sm">
      <Stepper.Step
        onClick={() => alert("test")}
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

  const setAccount = useStore<InsertUser>((state) => state.setAccount);

  const form = useRegisterDetailsForm();

  const [selectedAddress, setSelectedAddress] = useState<AddressComponent[]>(
    []
  );

  const supabase = useSupabaseClient();

  async function addDetails({
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
  }: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date | null;
  }) {
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
      .from("users")
      .update({ selected_user_address: addressData.id })
      .eq("id", session?.user.id);

    setLoading(false);

    if (error) {
      showNotification({
        message: error.message,
        color: "red",
        icon: <IconX />,
      });
    } else {
      showNotification({
        message: "Registration successful",
        color: "green",
        icon: <IconCheck />,
      });

      setAccount(data);
      closeAllModals();
    }
  }

  async function addAddress(address: AddressComponent[], user_id: string) {
    const { data } = await supabase
      .from("user_addresses")
      .insert({
        user_id: user_id,
        address_line1: address[0].long_name + " " + address[1].long_name,
        address_line2: address[2].long_name,
        city: address[3].long_name,
        post_code: address[6].long_name,
      })
      .select()
      .single();

    return data;
  }

  return (
    <form onSubmit={form.onSubmit(addDetails)}>
      <Stack>
        <Flex gap="md">
          <TextInput
            type="text"
            label="First Name"
            placeholder="Your first name"
            icon={<IconUser size={20} />}
            size="md"
            {...form.getInputProps("firstName")}
          />

          <TextInput
            type="text"
            label="Last Name"
            placeholder="Your last name"
            icon={<IconUser size={20} />}
            size="md"
            {...form.getInputProps("lastName")}
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
          size="md"
          {...form.getInputProps("phoneNumber")}
        />

        <DatePicker
          label="Date of Birth"
          placeholder="Your date of birth"
          icon={<IconCalendar size={20} />}
          size="md"
          allowFreeInput
          inputFormat="DD/MM/YYYY"
          width={1000}
          {...form.getInputProps("dateOfBirth")}
        />

        <Group position="right">
          <Button
            onClick={() => closeModal("register-two")}
            color="cyan.6"
            variant="subtle"
          >
            Back
          </Button>
          <Button
            type="submit"
            color="cyan.6"
            loading={loading}
            loaderPosition="right"
          >
            Register
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
