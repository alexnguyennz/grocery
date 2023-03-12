import type { NextApiRequest, NextApiResponse } from 'next';

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method === 'POST') {
    const { email, password } = req.body;

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // query user that should be saved
    const { data } = await supabase
      .from('users')
      .select(
        'id, first_name, last_name, phone_number, date_of_birth, address:selected_user_address(address_line1, address_line2, city, post_code)'
      )
      .eq('id', user?.id)
      .single();

    if (error) res.status(400).json(error);

    res.status(200).json(data);
  }
}

/*
import type { NextRequest, NextResponse } from 'next/server';

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  if (req.method === 'POST') {
    // Process a POST request
    const { email, password } = await req.json();

    console.log('email', email);
    console.log('password', password);

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('user', user);

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}
*/
