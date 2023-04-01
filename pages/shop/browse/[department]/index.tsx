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

  const supabase = createServerSupabaseClient(ctx);

  // get all aisles for this department as well as product count for each aisle
  const { data: aisles } = await getDepartmentAisles(supabase, departmentSlug);

  const {
    department: { name },
  } = aisles?.[0];

  return {
    props: {
      aisles,
      name,
      slug: departmentSlug,
    },
  };
};

export default function Department({ slug, name, aisles }: PageProps) {
  /*** STATE ***/
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("sku");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

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
        <title>{name}</title>
      </Head>

      <ProductsLayout.Breadcrumbs>
        <NextLink href={slug}>{name}</NextLink>
      </ProductsLayout.Breadcrumbs>

      <ProductsLayout.Heading title={name} data={data} />

      <ProductsLayout.Body>
        <ProductsLayout.Categories>
          {aisles!.map((aisle) => (
            <li key={aisle.name}>
              <NextLink href={`${slug}/${aisle.slug}`}>
                {aisle.name} ({aisle.products[0].count})
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
