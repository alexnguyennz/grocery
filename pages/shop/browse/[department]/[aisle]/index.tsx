import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";

import type { GetServerSideProps } from "next";

/*** SUPABASE ***/
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getAisleShelves, type AisleShelves } from "@/src/utils/supabase";
import { useQuery } from "@tanstack/react-query";

/*** COMPONENTS ***/
import ProductsLayout from "@/components/products/products";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

import { prisma } from "@/prisma/client";

type PageProps = {
  shelves: AisleShelves;
  slug: string;
  departmentSlug: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { aisle: aisleSlug, department: departmentSlug } = ctx.query;

  // get all shelves for this aisle and the product count for each of these shelves
  const shelves = await prisma.$queryRaw`SELECT a.id, a.name, a.slug, a.value, 
    b.name AS aisle_name, b.slug AS aisle_slug, 
    c.name AS department_name, c.slug AS department_slug,
    COUNT(*)::int FROM shelf a
    INNER JOIN aisle b ON a.aisle = b.value
    INNER JOIN department c ON b.department = c.id
    INNER JOIN products ON products.shelf = a.value
    WHERE b.slug = ${aisleSlug}
    GROUP BY a.id, b.name, b.slug, c.name, c.slug
    ORDER BY count DESC
    `;

  return {
    props: {
      shelves,
      slug: aisleSlug,
      departmentSlug,
    },
  };
};

export default function Category({ shelves, slug, departmentSlug }: PageProps) {
  const { aisle_name, aisle_slug, department_name, department_slug } =
    shelves![0];

  /*** STATE ***/
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("sku");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  /*** QUERY ***/
  const { data } = useQuery({
    queryKey: ["aisle", slug, departmentSlug, page, pageSize, filter, sort],
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
        <title>{aisle_name}</title>
      </Head>

      <ProductsLayout.Breadcrumbs>
        <NextLink href={`/shop/browse/${department_slug}`}>
          {department_name}
        </NextLink>
        <NextLink href={`/shop/browse/${department_slug}/${aisle_slug}`}>
          {aisle_name}
        </NextLink>
      </ProductsLayout.Breadcrumbs>

      <ProductsLayout.Heading title={aisle_name} data={data} />

      <ProductsLayout.Body>
        <ProductsLayout.Categories>
          {shelves!.map((shelf) => (
            <li key={shelf.name}>
              <NextLink
                href={`/shop/browse/${shelf.department_slug}/${shelf.aisle_slug}/${shelf.slug}`}
              >
                {shelf.name} ({shelf.count})
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
