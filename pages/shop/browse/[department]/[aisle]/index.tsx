import { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';

import type { GetServerSideProps } from 'next';

/*** SUPABASE ***/
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getAisleShelves, type AisleShelves } from '@/src/utils/supabase';
import { useQuery } from '@tanstack/react-query';

/*** COMPONENTS ***/
import ProductsLayout from '@/components/products/products';
import ProductFilter from '@/components/product/product-filter';
import ProductPagination from '@/components/product/product-pagination';

type PageProps = {
  shelves: AisleShelves;
  slug: string;
  departmentSlug: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { aisle: aisleSlug, department: departmentSlug } = ctx.query;

  const supabase = createServerSupabaseClient(ctx);

  // get all shelves for this aisle as well as product count for each shelf
  const { data: shelves } = await getAisleShelves(supabase, aisleSlug);

  return {
    props: {
      shelves,
      slug: aisleSlug,
      departmentSlug,
    },
  };
};

export default function Category({ shelves, slug, departmentSlug }: PageProps) {
  const { aisle } = shelves?.[0];

  /*** STATE ***/
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('sku');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  /*** QUERY ***/
  const { data } = useQuery({
    queryKey: ['aisle', slug, departmentSlug, page, pageSize, filter, sort],
    queryFn: async () => {
      return fetch(
        `/api/products?aisle=${slug}&department=${departmentSlug}&page=${page}&limit=${pageSize}&filter=${filter}&sort=${sort}`
      ).then((response) => response.json());
    },
    keepPreviousData: true,
  });

  return (
    <>
      <Head>
        <title>{aisle.name}</title>
      </Head>

      <ProductsLayout.Breadcrumbs>
        <NextLink href={`/shop/browse/${aisle.department.slug}`}>
          {aisle.department.name}
        </NextLink>
        <NextLink href={`/shop/browse/${aisle.department.slug}/${aisle.slug}`}>
          {aisle.name}
        </NextLink>
      </ProductsLayout.Breadcrumbs>

      <ProductsLayout.Heading title={aisle.name} data={data} />

      <ProductsLayout.Body>
        <ProductsLayout.Categories>
          {shelves!.map((shelf) => (
            <li key={shelf.name}>
              <NextLink
                href={`/shop/browse/${shelf.aisle.department.slug}/${shelf.aisle.slug}/${shelf.slug}`}
              >
                {shelf.name} ({shelf.products[0].count})
              </NextLink>
            </li>
          ))}
        </ProductsLayout.Categories>

        <ProductsLayout.Main>
          <ProductFilter
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
          />

          <ProductsLayout.Cards data={data} />

          {data && (
            <ProductPagination
              page={page}
              pageSize={pageSize}
              count={data && data.count}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          )}
        </ProductsLayout.Main>
      </ProductsLayout.Body>
    </>
  );
}
