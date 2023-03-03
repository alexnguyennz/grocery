import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

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
import { IconAt, IconPhone } from '@tabler/icons-react';

import { useStore } from '@/src/state/store';

/*** SUPABASE ***/
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function ForgotPassword() {
  const supabase = useSupabaseClient();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function resetPassword() {
    /**
     * Step 1: Send the user an email to get a password reset token.
     * This email contains a link which sends the user back to your application.
     */

    setLoading(true);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: '/shop/resetpassword',
    });
    console.log('reset', data);

    setLoading(false);
    setSuccess(true);
  }

  // useEffect(() => {
  //   supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (event == 'PASSWORD_RECOVERY') {
  //       const newPassword = prompt(
  //         'What would you like your new password to be?'
  //       );
  //       const { data, error } = await supabase.auth.updateUser({
  //         password: newPassword,
  //       });

  //       if (data) alert('Password updated successfully!');
  //       if (error) alert('There was an error updating your password.');
  //     }
  //   });
  // }, []);

  return (
    <>
      <div className="space-y-3">
        <Title className="text-center">Reset Password</Title>

        <Paper p={20} className="max-w-sm mx-auto border border-gray-400">
          <Stack>
            <Group>
              <Text>
                Please enter your email address to reset your password.
              </Text>
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
              <Button onClick={resetPassword}>Reset password</Button>
            </Group>
          </Stack>
        </Paper>
      </div>
    </>
  );
}

{
  /*<Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          //highlight-start
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                email_input_placeholder: '',
                password_label: 'Password',
                password_input_placeholder: '',
                button_label: 'Add your details',
              },
            },
          }}

          //highlight-end
        />*/
}
