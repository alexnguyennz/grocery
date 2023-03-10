import NextLink from 'next/link';
import Image from 'next/image';

import { Card, Skeleton, Stack, Text } from '@mantine/core';

/*** COMPONENTS ***/
import Quantity from '@/components/product/product-quantity';

/*** UTILS */
import capitalize from '@/src/utils/capitalize';

import { type Products } from '@/src/utils/supabase';

type Price = {
  isSpecial: boolean;
  salePrice: number;
  savePrice: number;
};

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Products;
  priority?: boolean;
}) {
  const { sku, name, unit } = product;
  const price = product.price as Price;

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#ffffff',
        transition: 'transform 150ms ease',
        '&:hover': {
          //transform: 'scale(1.05)',
        },
      })}
    >
      <Card.Section className="bg-white p-5 mb-3">
        <NextLink href={`/shop/product/${sku}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${sku}/${sku}.jpg`}
            alt={name!}
            width="160"
            height="160"
            className="mx-auto"
            priority={priority}
          />
        </NextLink>
      </Card.Section>

      <div className="h-16">
        <NextLink href={`/shop/product/${sku}`}>
          <Text>{capitalize(name!)}</Text>
        </NextLink>
      </div>

      <div className="mt-auto space-y-3 text-right">
        <div className="flex justify-between items-end">
          <div className="">
            <Text size="xl" weight="bold" color={`${price.isSpecial && 'red'}`}>
              ${price.salePrice.toFixed(2)}
              {unit === 'Kg' && (
                <span className="text-lg">{unit.toLowerCase()}</span>
              )}
            </Text>
          </div>
          <div>
            {price.isSpecial && (
              <>
                {/* <Text className="text-sm">
                    Was ${price.originalPrice.toFixed(2)}
                  </Text> */}
                <Text color="red" className="text-sm">
                  Save ${price.savePrice.toFixed(2)}
                </Text>
              </>
            )}
          </div>
        </div>

        <Quantity product={product} />
      </div>
    </Card>
  );
}
