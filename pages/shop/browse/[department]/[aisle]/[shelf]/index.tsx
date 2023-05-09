import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";

import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useQuery } from "@tanstack/react-query";

/*** COMPONENTS ***/
import ProductsLayout from "@/components/products/products";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

import { prisma } from "@/prisma/client";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    department: departmentSlug,
    aisle: aisleSlug,
    shelf: shelfSlug,
  } = ctx.query;

  // get shelf's aisle and department information and the product count
  const shelf = await prisma.$queryRaw`SELECT a.*, 
    b.name AS aisle_name, b.slug as aisle_slug,
    c.name AS department_name, c.slug AS department_slug,
    COUNT(*)::int 
    FROM shelf a
    INNER JOIN aisle b ON a.aisle = b.value
    INNER JOIN department C ON b.department = c.id
    INNER JOIN products ON products.shelf = a.value
    WHERE a.slug = ${shelfSlug}
    GROUP BY a.id, b.name, b.slug, c.name, c.slug
`;

  return {
    props: {
      shelf,
      aisleSlug: aisleSlug,
      departmentSlug: departmentSlug,
    },
  };
};

export default function SubCategory({
  shelf,
  aisleSlug,
  departmentSlug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  /*** STATE ***/
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("sku");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const {
    name,
    slug,
    aisle_name,
    aisle_slug,
    department_name,
    department_slug,
    count,
  } = shelf[0];

  /*** QUERY ***/
  const { data } = useQuery({
    queryKey: [
      "shelf",
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
        <title>{name}</title>
      </Head>

      <ProductsLayout.Breadcrumbs>
        <NextLink href={`/shop/browse/${department_slug}`}>
          {department_name}
        </NextLink>
        <NextLink href={`/shop/browse/${department_slug}/${aisle_slug}`}>
          {aisle_name}
        </NextLink>
        <NextLink
          href={`/shop/browse/${department_slug}/${aisle_slug}/${slug}`}
        >
          {name}
        </NextLink>
      </ProductsLayout.Breadcrumbs>

      <ProductsLayout.Heading title={name} data={data} />

      <ProductsLayout.Body>
        <ProductsLayout.Categories>
          <li>
            <NextLink
              href={`/shop/browse/${department_slug}/${aisle_slug}/${slug}`}
            >
              {name} ({count})
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
