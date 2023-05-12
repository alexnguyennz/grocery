import Head from "next/head";
import Link from "next/link";

import type { GetServerSideProps } from "next";

/*** QUERY ***/
import { type Products, type Department } from "@/src/utils/supabase";

import { useQuery } from "@tanstack/react-query";

import ProductsLayout from "@/components/products/products";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

import useCategories from "@/src/hooks/useCategories";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { q, department = "", aisle = "", shelf = "" } = ctx.query;

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
  const { settings, setSettings } = useCategories();

  const { data } = useQuery({
    queryKey: [
      "search",
      q,
      department,
      aisle,
      shelf,
      settings.page,
      settings.pageSize,
      settings.filter,
      settings.sort,
    ],
    queryFn: async () => {
      return fetch(
        `/api/searchProducts?q=${q}&page=${settings.page}&limit=${settings.pageSize}&filter=${settings.filter}&sort=${settings.sort}&department=${department}&aisle=${aisle}&shelf=${shelf}`
      ).then((response) => response.json());
    },
    keepPreviousData: true,
  });

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
            filter={settings.filter}
            sort={settings.sort}
            setSettings={setSettings}
          />

          <ProductsLayout.Cards data={data} />

          {data && (
            <ProductPagination
              page={settings.page}
              pageSize={settings.pageSize}
              setSettings={setSettings}
              count={data && data.count}
            />
          )}
        </ProductsLayout.Main>
      </ProductsLayout.Body>
    </>
  );
}
