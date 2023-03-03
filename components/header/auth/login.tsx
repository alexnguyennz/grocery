import { Group, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconLogout, IconSettings } from '@tabler/icons-react';

import { openModal } from '@mantine/modals';

/*** COMPONENTS ***/
import LoginModal from '@/components/modals/login';

export default function Login() {
  return (
    <UnstyledButton
      onClick={() => {
        openModal({
          centered: true,
          children: (
            <>
              <LoginModal />
            </>
          ),
        });
      }}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.sm,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group spacing={3}>
        <Text>Sign in</Text>
        <IconChevronDown size={12} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
