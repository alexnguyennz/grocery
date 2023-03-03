import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Autocomplete, Paper, Title, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

/*** STATE ***/
import { useStore } from '@/src/state/store';

/*** SUPABASE ***/
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { User } from '@/src/utils/supabase';

import Auth from './auth';
import HeaderDepartments from '@/components/header/header-departments';

import CartButton from './cart-button';

export default function Header() {
  const { push, isReady, query } = useRouter();

  /*** STATE ***/
  const { account, setAccount } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  const supabase = useSupabaseClient();

  // // sync local state with user's record for any updates
  supabase
    .channel('any')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${account?.id}`,
      },
      (payload) => {
        setAccount(payload.new as User);
      }
    )
    .subscribe();

  useEffect(() => {
    if (isReady && query.q) setSearchQuery(query.q as string);
  }, [isReady, query]);

  //const Auth = dynamic(() => import('./auth'), { ssr: false });

  return (
    <>
      <header className="shadow-sm">
        <Paper>
          <div className="container mx-auto p-3">
            <div className="flex items-center justify-between my-3">
              <Link href="/">
                <h1 className="font-extrabold text-4xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    Grocery
                  </span>
                </h1>
              </Link>

              <Auth />
            </div>

            <div className="flex items-center justify-between gap-3">
              <ul className="flex text-lg">
                <li>
                  <HeaderDepartments />
                </li>
              </ul>

              <div className="flex gap-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    push(`/shop/search?q=${searchQuery}`);
                  }}
                >
                  <Autocomplete
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onItemSubmit={(item) => {
                      push(`/shop/search?q=${item.value}`);
                    }}
                    placeholder="Search Groceries"
                    data={[
                      'Milk',
                      'Bread',
                      'Eggs',
                      'Biscuits',
                      'Butter',
                      'Crackers',
                      'Bananas',
                      'Chips',
                      'Cheese',
                    ]}
                    limit={10}
                    icon={<IconSearch size={20} />}
                  />
                </form>
                {/* <Address /> */}

                <CartButton />
              </div>
            </div>
          </div>
        </Paper>
      </header>
    </>
  );
}
