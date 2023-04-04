import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";

import { Card, Skeleton, Stack, Text } from "@mantine/core";

/*** COMPONENTS ***/
import Quantity from "@/components/product/product-quantity";

/*** UTILS */
import capitalize from "@/src/utils/capitalize";

import { type Products } from "@/src/utils/supabase";
import type { products } from "@prisma/client";

type Price = {
  isSpecial: boolean;
  salePrice: number;
  savePrice: number;
};

export default function ProductCard({
  product,
  priority = false,
}: {
  product: products;
  priority?: boolean;
}) {
  const { sku, name, unit } = product;
  const price = product.price as Price;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [errorImage, setErrorImage] = useState<string | null>(null);

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : "#ffffff",
        transition: "transform 150ms ease",
        "&:hover": {
          //transform: 'scale(1.05)',
        },
      })}
    >
      <Card.Section className="mb-3 bg-white p-5">
        <NextLink href={`/shop/product/${sku}`}>
          <Skeleton height={160} radius={0} visible={!imageLoaded}>
            <Image
              src={`${
                errorImage ??
                `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${sku}/${sku}.jpg`
              }`}
              alt={name!}
              width={160}
              height={160}
              priority={priority}
              className={`mx-auto ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
              onLoadingComplete={() => setImageLoaded(true)}
              onError={() => {
                setErrorImage("/no-image.png");
              }}
            />
          </Skeleton>
        </NextLink>
      </Card.Section>

      <div className="h-16">
        <NextLink href={`/shop/product/${sku}`}>
          <Text lineClamp={2}>{capitalize(name!)}</Text>
        </NextLink>
      </div>

      <div className="mt-auto space-y-3 text-right">
        <div className="flex items-end justify-between">
          <div className="">
            <Text size="xl" weight="bold" color={`${price.isSpecial && "red"}`}>
              ${price.salePrice.toFixed(2)}
              {unit === "Kg" && (
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
