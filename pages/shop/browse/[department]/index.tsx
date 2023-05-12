import Head from "next/head";
import NextLink from "next/link";

import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useQuery } from "@tanstack/react-query";

/*** COMPONENTS ***/
import ProductsLayout from "@/components/products/products";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

import { prisma } from "@/prisma/client";
import { type aisle } from "@prisma/client";

import useCategories from "@/src/hooks/useCategories";

interface Aisle extends aisle {
  count: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { department: departmentSlug } = ctx.query;

  // get all aisles for this department and the product count for each of these aisles
  const aisles: aisle[] =
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
      departmentName: aisles[0].department,
    },
  };
};

export default function Department({
  aisles,
  slug,
  departmentName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { settings, setSettings } = useCategories();

  const { data } = useQuery({
    queryKey: [
      "department",
      slug,
      settings.page,
      settings.pageSize,
      settings.filter,
      settings.sort,
    ],
    queryFn: async () => {
      return fetch(
        `/api/products?department=${slug}&page=${settings.page}&limit=${settings.pageSize}&filter=${settings.filter}&sort=${settings.sort}`
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
          {aisles.map((aisle: Aisle) => (
            <li key={aisle.name}>
              <NextLink href={`${slug}/${aisle.slug}`}>
                {aisle.name} ({aisle.count})
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
