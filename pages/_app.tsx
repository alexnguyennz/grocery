import { useState } from 'react';
import dynamic from 'next/dynamic';

import type { AppProps } from 'next/app';

/*** APP ***/
import '@/src/styles/globals.css';
import Layout from '@/components/layout';
//import '@fontsource/mulish';

/*** SUPABASE */
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

/*** REACT QUERY ***/
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/src/config/react-query';

/*** MANTINE ***/
import {
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
  createEmotionCache,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const Layout = dynamic(() => import('@/components/layout'), { ssr: false });

  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());

  /*** MANTINE ***/
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  const emotionCache = createEmotionCache({ key: 'mantine', prepend: false });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            emotionCache={emotionCache}
            theme={{
              colorScheme,
              colors: {
                dark: [
                  '#E2E8F0',
                  '#A6A7AB',
                  '#909296',
                  '#5c5f66',
                  '#373A40',
                  '#2C2E33',
                  'rgb(31 41 55)',
                  'rgb(17 24 39)',
                  '#141517',
                  '#101113',
                ],
              },
              fontFamily: 'Mulish, sans-serif',
              headings: { fontFamily: 'Mulish, sans-serif' },
            }}
          >
            <NotificationsProvider position="top-center" limit={5}>
              <ModalsProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ModalsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
