import Link from 'next/link';
import { Button, Popover, Group, UnstyledButton, Text } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';

/*** STATE ***/
import { useStore } from '@/src/state/store';

export default function Address() {
  /*** STATE ***/
  /* const account = useStore<Account>(({ account }) => account);

  return (
    <div className="flex-none">
      <Popover position="bottom" withArrow shadow="md">
        <Popover.Target>
          <UnstyledButton className="transition rounded-lg hover:bg-lime-100 focus:bg-lime-100">
            <Group spacing={3} className="px-4 py-2">
              <IconHome />
              <Text size="lg">
                {account.selected_user_address &&
                  account.selected_user_address.address_line1}
              </Text>
            </Group>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
          <ul className="space-y-3">
            <li>
              {account.selected_user_address && (
                <Text>
                  {account.selected_user_address.address_line1}
                  <br />
                  {account.selected_user_address.address_line2}
                  <br />
                  {account.selected_user_address.city}{' '}
                  {account.selected_user_address.post_code}
                </Text>
              )}
            </li>
            <li>
              <Button
                component={Link}
                href="/checkout/revieworder"
                color="green"
              >
                Change address
              </Button>
            </li>
          </ul>
        </Popover.Dropdown>
      </Popover>
    </div>
  ); */
}
