import type { NextRequest, NextResponse } from 'next/server';

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { searchParams } = new URL(req.url);
  const sku = searchParams.get('sku');

  const response = await supabase.storage.from('product').list(sku as string);

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
