import type { NextRequest, NextResponse } from 'next/server';

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { searchParams } = new URL(req.url);
  const sku = searchParams.get('sku');

  const response = await supabase
    .from('products')
    .select(
      'sku, name, price, description, unit, size, origins, ingredients, nutrition, claims, shelf(name, slug, aisle(name, slug, department(name, slug)))'
    )
    .eq('sku', sku)
    .single();

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
