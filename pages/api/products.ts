import type { NextRequest, NextResponse } from 'next/server';

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { searchParams } = new URL(req.url);
  const shelf = searchParams.get('shelf');
  const aisle = searchParams.get('aisle');
  const department = searchParams.get('department');
  const limit = Number(searchParams.get('limit'));
  const page = Number(searchParams.get('page'));
  const filter = searchParams.get('filter');
  const sort = searchParams.get('sort');

  const range = [];

  range[0] = (page - 1) * limit;
  range[1] = page * limit - 1;

  // range[0] = (Number(page) - 1) * Number(limit);
  // range[1] = Number(page) * Number(limit) - 1;

  const sortBy = sort?.split('-');

  let sortColumn: string | undefined;

  if (sortBy?.[0] == 'price') {
    sortColumn = 'price -> salePrice';
  } else {
    sortColumn = sortBy?.[0];
  }

  // filter query based on which category types are inserted
  const categoryFilter = {
    ...(shelf ? { 'shelf.slug': shelf } : {}),
    ...(aisle ? { 'aisle.slug': aisle } : {}),
    ...(department ? { 'department.slug': department } : {}),
    ...(filter === 'specials' ? { 'price -> isSpecial': true } : {}),
  };

  // create correct inner joins based on which category types are inserted
  const select = [
    ...(categoryFilter['shelf.slug'] ? ['shelf!inner(value)'] : []),
    ...(categoryFilter['aisle.slug'] ? ['aisle!inner(value)'] : []),
    ...(categoryFilter['department.slug'] ? ['department!inner(value)'] : []),
  ]
    .filter((a) => a)
    .join(', ');

  const response = await supabase
    .from('products')
    .select(
      `sku, name, price, description, unit, size, origins, ingredients, nutrition, claims, ${select}`,
      { count: 'exact', head: false }
    )
    .match(categoryFilter)
    .order(sortColumn as string, { ascending: sortBy?.[1] === 'asc' })
    .throwOnError()
    .limit(limit)
    .range(range[0], range[1]);

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
