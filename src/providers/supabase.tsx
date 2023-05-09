import { useState } from "react";
import type { Session } from "@supabase/auth-helpers-nextjs";

import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

export default function SupabaseProvider({
  children,
  initialSession,
}: {
  children: JSX.Element;
  initialSession: Session;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}
