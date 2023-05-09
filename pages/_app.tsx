import dynamic from "next/dynamic";
import type { AppProps } from "next/app";

import "@/src/styles/main.css";
import Layout from "@/components/layout";

import ReactQueryProvider from "@/src/providers/react-query";
import SupabaseProvider from "@/src/providers/supabase";
import CustomMantineProvider from "@/src/providers/mantine";

export default function App({ Component, pageProps }: AppProps) {
  const Layout = dynamic(() => import("@/components/layout"), { ssr: false });

  return (
    <ReactQueryProvider>
      <SupabaseProvider initialSession={pageProps.initialSession}>
        <CustomMantineProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CustomMantineProvider>
      </SupabaseProvider>
    </ReactQueryProvider>
  );
}
