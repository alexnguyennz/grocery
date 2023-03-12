import type { NextRequest, NextResponse } from 'next/server';

import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') as string;
  const limit = Number(searchParams.get('limit'));
  const page = Number(searchParams.get('page'));
  const filter = searchParams.get('filter');
  const sort = searchParams.get('sort');
  const department = searchParams.get('department');
  const aisle = searchParams.get('aisle');
  const shelf = searchParams.get('shelf');

  const range = [];

  // find correct range to use based on page and limit
  range[0] = (page - 1) * limit;
  range[1] = page * limit - 1;

  const sortBy = sort?.split('-');

  // separate sort column data so it can be used in query
  let sortColumn;

  if (sortBy?.[0] == 'price') {
    sortColumn = 'price -> salePrice';
  } else {
    sortColumn = sortBy?.[0];
  }

  // filter query based on which category types are inserted
  const specialsFilter = {
    ...(filter === 'specials' ? { 'price -> isSpecial': true } : {}),
  };

  const categoriesFilter = {
    ...(filter === 'specials' ? { 'products.price -> isSpecial': true } : {}),
  };

  const productFilter = {
    ...(department ? { 'department.slug': department } : {}),
    ...(aisle ? { 'aisle.slug': aisle } : {}),
    ...(shelf ? { 'shelf.slug': shelf } : {}),
  };

  console.log('productFilter', productFilter);

  // get all products
  const response = await supabase
    .from('products')
    .select(
      `sku, name, price, description, unit, size, origins, ingredients, nutrition, claims, shelf!inner(value), aisle!inner(value), department!inner(value)`,
      {
        count: 'exact',
        head: false,
      }
    )
    .match(specialsFilter)
    .match(productFilter)
    .textSearch('name', q)
    .order(sortColumn as string, { ascending: sortBy?.[1] === 'asc' })
    .limit(limit)
    .range(range[0], range[1])
    .throwOnError();

  // Filter search down by categories based on params
  let categories;

  const departmentFilter = {
    ...(department && aisle ? { 'aisle.department.slug': department } : {}),
    ...(aisle ? { 'aisle.slug': aisle } : {}),
    ...(shelf ? { 'shelf.slug': shelf } : {}),
  };

  let departmentBreadcrumbs;
  let aisleBreadcrumbs;
  let shelfBreadcrumbs;

  // get all shelves for this aisle and search term
  if (shelf) {
    const { data } = await supabase
      .from('products')
      .select(
        `*, products:name, shelf!inner(name, slug), aisle!inner(name, slug), department!inner(name, slug)`,
        {
          count: 'exact',
          head: false,
        }
      )
      .match(specialsFilter)
      .match(productFilter)
      .textSearch('name', q)
      .order(sortColumn as string, { ascending: sortBy?.[1] === 'asc' })
      .limit(limit)
      .range(range[0], range[1])
      .throwOnError();

    // manually set the shelf category
    categories = [
      {
        name: data?.[0]?.shelf.name,
        slug: data?.[0]?.shelf.slug,
        products: data,
      },
    ];

    departmentBreadcrumbs = {
      category: 'department',
      name: data?.[0]?.department.name,
      slug: data?.[0]?.department.slug,
    };

    aisleBreadcrumbs = {
      category: 'aisle',
      name: data?.[0]?.aisle.name,
      slug: data?.[0]?.aisle.slug,
    };

    shelfBreadcrumbs = {
      category: 'shelf',
      name: data?.[0]?.shelf.name,
      slug: data?.[0]?.shelf.slug,
    };
  } else if (aisle) {
    const { data } = await supabase
      .from('shelf')
      .select(
        '*, products!inner(name), aisle!inner(name, slug, department!inner(name, slug))'
      )
      .match(departmentFilter)
      .match(categoriesFilter)
      .textSearch('products.name', q)
      .throwOnError();

    categories = data;

    departmentBreadcrumbs = {
      category: 'department',
      name: data?.[0]?.aisle.department.name,
      slug: data?.[0]?.aisle.department.slug,
    };

    aisleBreadcrumbs = {
      category: 'aisle',
      name: data?.[0]?.aisle.name,
      slug: data?.[0]?.aisle.slug,
    };
  } else if (department) {
    // get all aisles for this department and search term
    const { data } = await supabase
      .from('aisle')
      .select('name, slug, products!inner(*), department!inner(*)')
      .match(productFilter)
      .match(categoriesFilter)
      .textSearch('products.name', q)
      .throwOnError();

    categories = data;

    departmentBreadcrumbs = {
      category: 'department',
      name: data?.[0]?.department.name,
      slug: data?.[0]?.department.slug,
    };
  } else {
    const { data } = await supabase
      .from('department')
      .select('name, slug, products!inner(name)')
      .match(categoriesFilter)
      .textSearch('products.name', q)
      .throwOnError();

    categories = data;
  }

  const data = {
    ...response,
    categories: categories ?? [],
    departmentBreadcrumbs,
    aisleBreadcrumbs,
    shelfBreadcrumbs,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
