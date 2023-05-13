import Head from "next/head";
import NextLink from "next/link";

import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useQuery } from "@tanstack/react-query";

/*** COMPONENTS ***/
import ProductsLayout from "@/components/products/products";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

import { prisma } from "@/prisma/client";
import { type shelf } from "@prisma/client";

import useCategories from "@/src/hooks/useCategories";

interface Shelf extends shelf {
  count: string;
  department_slug: string;
  aisle_slug: string;
}

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

export default function Category({
  shelves,
  slug,
  departmentSlug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { aisle_name, aisle_slug, department_name, department_slug } =
    shelves![0];

  const { settings, setSettings } = useCategories();

  /*** QUERY ***/
  const { data } = useQuery({
    queryKey: [
      "aisle",
      slug,
      departmentSlug,
      settings.page,
      settings.pageSize,
      settings.filter,
      settings.sort,
    ],
    queryFn: async () => {
      return fetch(
        `/api/products?aisle=${slug}&department=${departmentSlug}&page=${settings.page}&limit=${settings.pageSize}&filter=${settings.filter}&sort=${settings.sort}`
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
          {shelves.map((shelf: Shelf) => (
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
