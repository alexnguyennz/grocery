import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";

import type { GetServerSideProps } from "next";

/*** SUPABASE ***/
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  getDepartmentAisles,
  type DepartmentAisles,
} from "@/src/utils/supabase";

import { useQuery } from "@tanstack/react-query";

/*** COMPONENTS ***/
import ProductsLayout from "@/components/products/products";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

import { prisma } from "@/prisma/client";

type PageProps = {
  aisles: DepartmentAisles;
  slug: string;
  name: string;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { department: departmentSlug } = ctx.query;

  // get all aisles for this department and the product count for each of these aisles
  const aisles =
    await prisma.$queryRaw`SELECT a.id, a.name, a.slug, a.value, b.name AS department, COUNT(*)::int 
    FROM aisle a 
    INNER JOIN department b ON a.department = b.id 
    INNER JOIN products ON products.aisle = a.value
    WHERE b.slug = ${departmentSlug} 
    GROUP BY a.id, b.name 
    ORDER BY count DESC`;

  return {
    props: {
      aisles,
      slug: departmentSlug,
    },
  };
};

export default function Department({ aisles, slug }: PageProps) {
  /*** STATE ***/
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("sku");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const departmentName = aisles![0].department;

  /*** QUERY ***/
  const { data } = useQuery({
    queryKey: ["department", slug, page, pageSize, filter, sort],
    queryFn: async () => {
      return fetch(
        `/api/products?department=${slug}&page=${page}&limit=${pageSize}&filter=${filter}&sort=${sort}`
      ).then((response) => response.json());
    },
    keepPreviousData: true,
  });

  return (
    <>
      <Head>
        <title>{departmentName} - Grocery</title>
      </Head>

      <ProductsLayout.Breadcrumbs>
        <NextLink href={slug}>{departmentName}</NextLink>
      </ProductsLayout.Breadcrumbs>

      <ProductsLayout.Heading title={departmentName} data={data} />

      <ProductsLayout.Body>
        <ProductsLayout.Categories>
          {aisles!.map((aisle) => (
            <li key={aisle.name}>
              <NextLink href={`${slug}/${aisle.slug}`}>
                {aisle.name} ({aisle.count})
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
