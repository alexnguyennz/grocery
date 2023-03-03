import { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';

import type { GetServerSideProps } from 'next';

/*** SUPABASE ***/
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { getShelfCategories, type ShelfCategories } from '@/src/utils/supabase';
import { useQuery } from '@tanstack/react-query';

/*** COMPONENTS ***/
import ProductsLayout from '@/components/products/products';
import ProductFilter from '@/components/product/product-filter';
import ProductPagination from '@/components/product/product-pagination';

type PageProps = {
  shelf: ShelfCategories;
  slug: string;
  aisleSlug: string;
  departmentSlug: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    department: departmentName,
    aisle: aisleName,
    shelf: shelfName,
  } = ctx.query;

  const supabase = createServerSupabaseClient(ctx);

  const { data: shelf } = await getShelfCategories(
    supabase,
    shelfName,
    aisleName,
    departmentName
  );

  return {
    props: {
      shelf,
      slug: shelfName,
      aisleSlug: aisleName,
      departmentSlug: departmentName,
    },
  };
};

export default function SubCategory({
  shelf,
  slug,
  aisleSlug,
  departmentSlug,
}: PageProps) {
  /*** STATE ***/
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('sku');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [categoriesOpened, setCategoriesOpened] = useState(true);

  /*** QUERY ***/
  const { data } = useQuery({
    queryKey: [
      'shelf',
      slug,
      aisleSlug,
      departmentSlug,
      page,
      pageSize,
      filter,
      sort,
    ],
    queryFn: async () => {
      return fetch(
        `/api/products?shelf=${slug}&aisle=${aisleSlug}&department=${departmentSlug}&page=${page}&limit=${pageSize}&filter=${filter}&sort=${sort}`
      ).then((response) => response.json());
    },
    keepPreviousData: true,
  });

  return (
    <>
      <Head>
        <title>{shelf.name}</title>
      </Head>

      <ProductsLayout.Breadcrumbs>
        <NextLink href={`/shop/browse/${shelf.aisle.department.slug}`}>
          {shelf.aisle.department.name}
        </NextLink>
        <NextLink
          href={`/shop/browse/${shelf.aisle.department.slug}/${shelf.aisle.slug}`}
        >
          {shelf.aisle.name}
        </NextLink>
        <NextLink
          href={`/shop/browse/${shelf.aisle.department.slug}/${shelf.aisle.slug}/${shelf.slug}`}
        >
          {shelf.name}
        </NextLink>
      </ProductsLayout.Breadcrumbs>

      <ProductsLayout.Heading title={shelf.name} data={data} />

      <ProductsLayout.Body>
        <ProductsLayout.Categories>
          <li>
            <NextLink
              href={`/shop/browse/${shelf.aisle.department.slug}/${shelf.aisle.slug}/${shelf.slug}`}
            >
              {shelf.name} {data && `(${data.count})`}
            </NextLink>
          </li>
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
