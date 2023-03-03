import type { NextApiRequest, NextApiResponse } from 'next';

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  const { error } = await supabase.auth.signOut();

  res.status(200).json(error);
}
