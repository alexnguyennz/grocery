import Link from 'next/link';
import { useRouter } from 'next/router';

import { Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconLogout, IconSettings } from '@tabler/icons-react';

import { useStore } from '@/src/state/store';

/*** UTILS ***/
import { GET } from '@/src/utils/fetch';

export default function Account() {
  const router = useRouter();

  /*** STATE ***/
  const setAccount = useStore((state) => state.setAccount);

  async function signOut() {
    const data = await GET('/api/logout');

    if (!data) setAccount(null);
    router.replace(router.asPath); // "reload" the page
  }

  return (
    <>
      <Menu width={200} withArrow shadow="md" transition="scale">
        <Menu.Target>
          <UnstyledButton
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.sm,
              color:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[0]
                  : theme.black,

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Group spacing={3}>
              <Text>Account</Text>
              <IconChevronDown size={12} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            href="/account"
            icon={<IconSettings size={14} />}
            className="hover:no-underline"
          >
            Manage Account
          </Menu.Item>
          <Menu.Item
            onClick={signOut}
            icon={<IconLogout size={14} />}
            color="red"
          >
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
