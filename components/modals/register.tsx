import { useState } from "react";
import {
  Button,
  Group,
  Stack,
  Stepper,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { openModal, closeModal, closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconLock, IconX } from "@tabler/icons-react";

/*** COMPONENTS ***/
import RegisterDetailsModal, { RegisterStepperTwo } from "./register-details";

/*** SUPABASE ***/
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import useRegisterForm from "@/src/hooks/useRegisterForm";

export function RegisterStepperOne() {
  return (
    <Stepper color="cyan.6" active={0} breakpoint="sm">
      <Stepper.Step
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

export default function RegisterModal() {
  const form = useRegisterForm();

  const [loading, setLoading] = useState(false);

  const supabase = useSupabaseClient();

  async function signUp(values: { email: string; password: string }) {
    setLoading(true);

    // create user and set session if successful
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      showNotification({
        message: error.message,
        color: "red",
        icon: <IconX />,
      });
    } else {
      openModal({
        modalId: "register-two",
        title: <RegisterStepperTwo />,
        centered: true,
        children: <RegisterDetailsModal />,
        onClose: closeAllModals,
      });
    }

    setLoading(false);
  }

  return (
    <form onSubmit={form.onSubmit(signUp)}>
      <Stack>
        <TextInput
          name="email"
          label="Email"
          placeholder="Your email address"
          icon={<IconAt size={20} />}
          size="md"
          data-autofocus
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          icon={<IconLock size={20} />}
          size="md"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter password"
          icon={<IconLock size={20} />}
          size="md"
          {...form.getInputProps("confirmPassword")}
        />
        <Group position="right">
          <Button
            onClick={() => closeModal("register-one")}
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
            Next
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
