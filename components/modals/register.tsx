import { useState } from 'react';
import {
  Button,
  Group,
  Stack,
  Stepper,
  TextInput,
  PasswordInput,
} from '@mantine/core';
import { openModal, closeModal, closeAllModals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconAt, IconLock, IconX } from '@tabler/icons-react';

/*** COMPONENTS ***/
import RegisterDetailsModal, { RegisterStepperTwo } from './register-details';

/*** SUPABASE ***/
import { useSupabaseClient } from '@supabase/auth-helpers-react';

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
  const form = useForm();

  const [loading, setLoading] = useState(false);

  // form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const supabase = useSupabaseClient();

  async function signUp() {
    setLoading(true);

    // create user and set session if successful
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      form.setErrors({ email: 'Invalid email' });

      showNotification({
        message: error.message,
        color: 'red',
        icon: <IconX />,
      });
    } else {
      openModal({
        modalId: 'register-two',
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
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter password"
          icon={<IconLock size={20} />}
          size="md"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
          required
        />
        <Group position="right">
          <Button
            onClick={() => closeModal('register-one')}
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
