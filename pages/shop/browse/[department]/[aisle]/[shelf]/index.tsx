import Head from "next/head";
import NextLink from "next/link";

import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useQuery } from "@tanstack/react-query";

/*** COMPONENTS ***/
import ProductsLayout from "@/components/products/products";
import ProductFilter from "@/components/product/product-filter";
import ProductPagination from "@/components/product/product-pagination";

import { prisma } from "@/prisma/client";

import useCategories from "@/src/hooks/useCategories";

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
  const {
    name,
    slug,
    aisle_name,
    aisle_slug,
    department_name,
    department_slug,
    count,
  } = shelf[0];

  const { settings, setSettings } = useCategories();

  const { data } = useQuery({
    queryKey: [
      "shelf",
      slug,
      aisleSlug,
      departmentSlug,
      settings.page,
      settings.pageSize,
      settings.filter,
      settings.sort,
    ],
    queryFn: async () => {
      return fetch(
        `/api/products?shelf=${slug}&aisle=${aisleSlug}&department=${departmentSlug}&page=${settings.page}&limit=${settings.pageSize}&filter=${settings.filter}&sort=${settings.sort}`
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
