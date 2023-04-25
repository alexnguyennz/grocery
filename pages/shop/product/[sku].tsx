import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

/*** MANTINE ***/
import { Skeleton } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

import ProductsLayout from "@/components/products/products";

import { useQuery } from "@tanstack/react-query";

import ProductDetails from "@/components/product/product-details";

/*** UTILS ***/
import capitalize from "@/src/utils/capitalize";

import { prisma } from "@/prisma/client";

import type { products, objects } from "@prisma/client";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { sku } = ctx.query;

  const data = await prisma.products.findUnique({
    where: {
      sku: Number(sku),
    },
    select: {
      sku: true,
      name: true,
      price: true,
      description: true,
      unit: true,
      size: true,
      origins: true,
      ingredients: true,
      nutrition: true,
      claims: true,
      shelf_products_shelfToshelf: {
        select: {
          name: true,
          slug: true,
          aisle_shelf_aisleToaisle: {
            select: {
              name: true,
              slug: true,
              department_aisle_departmentTodepartment: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const images = await prisma.objects.findMany({
    where: {
      name: {
        startsWith: sku as string,
      },
    },
  });

  return {
    props: {
      sku,
      product: JSON.parse(JSON.stringify(data)),
      images: JSON.parse(JSON.stringify(images)),
    },
  };
};

export default function Product({
  product,
  images,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  /*** QUERIES ***/
  const { name, shelf_products_shelfToshelf: shelf } = product;
  const { aisle_shelf_aisleToaisle: aisle } = shelf;
  const { department_aisle_departmentTodepartment: department } = aisle;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [errorImage, setErrorImage] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>{"Buy " + capitalize(name)}</title>
      </Head>
      <ProductsLayout.Breadcrumbs>
        <Link href={`/shop/browse/${department.slug}`}>{department.name}</Link>
        <Link href={`/shop/browse/${department.slug}/${aisle.slug}`}>
          {aisle.name}
        </Link>
        <Link
          href={`/shop/browse/${department.slug}/${aisle.slug}/${shelf.slug}`}
        >
          {shelf.name}
        </Link>
        <Link href="#" className="capitalize">
          {name}
        </Link>
      </ProductsLayout.Breadcrumbs>

      <div className="mt-5 grid gap-10 md:grid-cols-2">
        <div>
          <Carousel
            mx="auto"
            loop
            withIndicators
            classNames={{ root: "border border-gray-400 shadow-lg" }}
            styles={{
              indicator: {
                background: "#15aabf",
              },
            }}
          >
            {images.map((image: objects) => (
              <Carousel.Slide key={image.name}>
                <div className="mx-auto w-full bg-white py-10">
                  <Skeleton
                    width={500}
                    height={500}
                    radius={0}
                    className={"mx-auto"}
                    visible={!imageLoaded}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${image.name}`}
                      width={500}
                      height={500}
                      alt={image.name!}
                      className={`mx-auto ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      } transition-opacity duration-500`}
                      onLoadingComplete={() => setImageLoaded(true)}
                    />
                  </Skeleton>
                </div>
              </Carousel.Slide>
            ))}

            {!images.length && (
              <Carousel.Slide>
                <div className="mx-auto w-full bg-white py-10">
                  {" "}
                  <Skeleton
                    width={500}
                    height={500}
                    radius={0}
                    className={"mx-auto"}
                    visible={!imageLoaded}
                  >
                    <Image
                      src={`/no-image.png`}
                      width={500}
                      height={500}
                      alt="No image found"
                      className={`mx-auto ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      } transition-opacity duration-500`}
                      onLoadingComplete={() => setImageLoaded(true)}
                    />
                  </Skeleton>
                </div>
              </Carousel.Slide>
            )}
          </Carousel>
        </div>

        <div className="space-y-5">
          <ProductDetails product={product} />
        </div>
      </div>
    </>
  );
}
