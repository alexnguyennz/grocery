import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import type { GetServerSideProps } from 'next';

/*** QUERY ***/
import { type Products, type Department } from '@/src/utils/supabase';

import { useQuery } from '@tanstack/react-query';

/*** COMPONENTS ***/
import ProductsLayout from '@/components/products/products';
import ProductFilter from '@/components/product/product-filter';
import ProductPagination from '@/components/product/product-pagination';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { q, department = '', aisle = '', shelf = '' } = ctx.query;

  return {
    props: {
      q,
      department,
      aisle,
      shelf,
    },
  };
};

// use types from `department` which match `aisle` and `shelf`
type CategoryProducts = Department & {
  products: Products[];
};

type PageProps = {
  q: string;
  department: string;
  aisle: string;
  shelf: string;
};

export default function MainCategory({
  q,
  department,
  aisle,
  shelf,
}: PageProps) {
  /*** STATE ***/
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('sku');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  /*** QUERY ***/
  const { data } = useQuery({
    queryKey: [
      'search',
      q,
      department,
      aisle,
      shelf,
      page,
      pageSize,
      filter,
      sort,
    ],
    queryFn: async () => {
      return fetch(
        `/api/searchProducts?q=${q}&page=${page}&limit=${pageSize}&filter=${filter}&sort=${sort}&department=${department}&aisle=${aisle}&shelf=${shelf}`
      ).then((response) => response.json());
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  return (
    <>
      <Head>
        <title>Results for &quot;{q}&quot;</title>
      </Head>

      <ProductsLayout.Breadcrumbs>
        <Link href={`?q=${q}`}>All Search Results</Link>

        {data?.departmentBreadcrumbs && (
          <Link
            key={data.departmentBreadcrumbs.slug}
            href={`?q=${q}&department=${data.departmentBreadcrumbs.slug}`}
          >
            {data.departmentBreadcrumbs.name}
          </Link>
        )}

        {data?.aisleBreadcrumbs && (
          <Link
            key={data.aisleBreadcrumbs.slug}
            href={`?q=${q}&department=${data.departmentBreadcrumbs.slug}&aisle=${data.aisleBreadcrumbs.slug}`}
          >
            {data.aisleBreadcrumbs.name}
          </Link>
        )}

        {data?.shelfBreadcrumbs && (
          <Link
            key={data.aisleBreadcrumbs.slug}
            href={`?q=${q}&department=${data.departmentBreadcrumbs.slug}&aisle=${data.aisleBreadcrumbs.slug}&shelf=${data.shelfBreadcrumbs.slug}`}
          >
            {data.shelfBreadcrumbs.name}
          </Link>
        )}
        <Link href={`#`}>&quot;{q}&quot;</Link>
      </ProductsLayout.Breadcrumbs>

      <ProductsLayout.Heading title={` Results for "${q}"`} data={data} />

      <ProductsLayout.Body>
        <ProductsLayout.Categories>
          {data &&
            data.categories.map((category: CategoryProducts) => (
              <li key={category.name}>
                {aisle ? (
                  <Link
                    href={`?q=${q}&department=${department}&aisle=${aisle}&shelf=${category.slug}`}
                  >
                    {category.name} ({category.products.length})
                  </Link>
                ) : department ? (
                  <Link
                    href={`?q=${q}&department=${department}&aisle=${category.slug}`}
                  >
                    {category.name} ({category.products.length})
                  </Link>
                ) : (
                  <Link href={`?q=${q}&department=${category.slug}`}>
                    {category.name} ({category.products.length})
                  </Link>
                )}
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
