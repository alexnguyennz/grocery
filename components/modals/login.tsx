import { useState } from "react";
import {
  Anchor,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconLock, IconX } from "@tabler/icons-react";

import { useStore } from "@/src/state/store";

/*** UTILS ***/
import { POST } from "@/src/utils/fetch";

/*** COMPONENTS ***/
import RegisterModal, { RegisterStepperOne } from "./register";

import useLoginForm from "@/src/hooks/useLoginForm";

export default function LoginModal() {
  const { setAccount } = useStore();

  const [loading, setLoading] = useState(false);

  const form = useLoginForm();

  async function handleSubmit(values: { email: string; password: string }) {
    setLoading(true);

    const data = await POST("/api/login", values);

    if (!data?.status) {
      setAccount(data);
      closeAllModals();
    } else {
      showNotification({
        message: "Invalid username and/or password",
        color: "red",
        icon: <IconX />,
      });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Email"
          placeholder="Your email address"
          icon={<IconAt size={20} />}
          size="md"
          {...form.getInputProps("email")}
          data-autofocus
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          icon={<IconLock size={20} />}
          size="md"
          {...form.getInputProps("password")}
        />
        <Group position="apart">
          <Text>
            Don&apos;t have an account?{" "}
            <Anchor
              color="cyan.6"
              onClick={() => {
                openModal({
                  modalId: "register-one",
                  title: <RegisterStepperOne />,
                  centered: true,
                  children: <RegisterModal />,
                });
              }}
            >
              Sign up
            </Anchor>
          </Text>
          <Button
            type="submit"
            color="cyan.6"
            loading={loading}
            loaderPosition="right"
          >
            Sign in
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
