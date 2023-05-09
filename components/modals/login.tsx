import { useState, type FormEventHandler } from "react";
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

export default function LoginModal() {
  /*** STATE ***/
  const setAccount = useStore((state) => state.setAccount);
  const [loading, setLoading] = useState(false);

  // form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formData = {
      email,
      password,
    };

    const data = await POST("/api/login", formData);

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
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          type="email"
          label="Email"
          placeholder="Your email address"
          icon={<IconAt size={20} />}
          size="md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-autofocus
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          icon={<IconLock size={20} />}
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
