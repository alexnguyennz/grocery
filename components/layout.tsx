import { ReactNode } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

/*** COMPONENTS ***/
import Header from '@/components/header';
import Footer from '@/components/footer';

import { Box } from '@mantine/core';

import Main from './main';

export default function Layout({ children }: { children: ReactNode }) {
  //const Main = dynamic(() => import('./main'), { ssr: false });

  return (
    <>
      <Head>
        <title>Online Grocery Shopping - Grocery</title>
        <meta
          name="description"
          content="Online grocery shopping with Grocery"
        />
      </Head>
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
        })}
      >
        <div className="flex flex-col min-h-screen">
          <Header />

          <Main>{children}</Main>

          <Footer />
        </div>
      </Box>
    </>
  );
}
