import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';

/*** MANTINE ***/
import { Skeleton } from '@mantine/core';
import { Carousel } from '@mantine/carousel';

import ProductsLayout from '@/components/products/products';

import { useQuery } from '@tanstack/react-query';

import ProductDetails from '@/components/product/product-details';

/*** UTILS ***/
import capitalize from '@/src/utils/capitalize';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { sku } = ctx.query;
  return {
    props: {
      sku,
    },
  };
};

export default function Product({ sku }: { sku: string }) {
  /*** QUERIES ***/
  const { data } = useQuery({
    queryKey: ['product', sku],
    queryFn: async () => {
      return fetch(`/api/product?sku=${sku}`).then((response) =>
        response.json()
      );
    },
    keepPreviousData: true,
  });

  const images = useQuery({
    queryKey: ['productImages', sku],
    queryFn: async () => {
      return fetch(`/api/product-images?sku=${sku}`).then((response) =>
        response.json()
      );
    },
    keepPreviousData: true,
  });

  return (
    <>
      <Head>
        <title>{'Buy ' + capitalize('test')}</title>
      </Head>

      {data ? (
        <ProductsLayout.Breadcrumbs>
          <Link href={`/shop/browse/${data.data.shelf.aisle.department.slug}`}>
            {data.data.shelf.aisle.department.name}
          </Link>
          <Link
            href={`/shop/browse/${data.data.shelf.aisle.department.slug}/${data.data.shelf.aisle.slug}`}
          >
            {data.data.shelf.aisle.name}
          </Link>
          <Link
            href={`/shop/browse/${data.data.shelf.aisle.department.slug}/${data.data.shelf.aisle.slug}/${data.data.shelf.slug}`}
          >
            {data.data.shelf.name}
          </Link>
          <Link href="#">{capitalize(data.data.name)}</Link>
        </ProductsLayout.Breadcrumbs>
      ) : (
        <Skeleton h={20} />
      )}

      <div className="grid md:grid-cols-2 gap-10 mt-5">
        <div>
          {images && images?.data ? (
            <Carousel
              mx="auto"
              loop
              withIndicators
              classNames={{ root: ' border border-gray-400 shadow-lg' }}
              styles={{
                indicator: {
                  background: '#15aabf',
                },
              }}
            >
              {images.data.data.map((image: { name: string }) => (
                <Carousel.Slide key={image.name}>
                  <div className="w-full mx-auto bg-white">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}${sku}/${image.name}`}
                      width={500}
                      height={500}
                      alt={image.name}
                      className="mx-auto py-10"
                    />
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Skeleton h={500} />
          )}
        </div>

        <div className="space-y-5">
          {data ? (
            <ProductDetails product={data?.data} />
          ) : (
            <>
              <Skeleton height={40} mb="xl" />
              <Skeleton height={15} mb="xl" />
              <Skeleton height={25} mb="xl" />
              <Skeleton height={100} mb="xl" />
              <Skeleton height={100} mb="xl" />
            </>
          )}
        </div>
      </div>
    </>
  );
}
