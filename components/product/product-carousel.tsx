/*** MANTINE ***/
import { Skeleton } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

/*** COMPONENTS ***/
import ProductCard from "@/components/product/product-card";

import type { products } from "@prisma/client";

export default function ProductCarousel({
  products,
}: {
  products: products[];
}) {
  if (!products) {
    return (
      <Carousel
        loop
        slideSize="20%"
        slideGap="xl"
        breakpoints={[
          { maxWidth: "md", slideSize: "33.3333%" },
          { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
        ]}
        sx={{ flex: 1 }}
        styles={{
          indicator: {
            background: "green",
            width: 12,
            height: 4,
            transition: "width 250ms ease",
            "&[data-active]": {
              width: 40,
            },
          },
        }}
        nextControlLabel="Next carousel page"
        previousControlLabel="Previous carousel page"
      >
        {[0, 1, 2, 3, 4, 5].map((number) => (
          <Carousel.Slide key={number}>
            <Skeleton height={350} mb="xl" />
          </Carousel.Slide>
        ))}
      </Carousel>
    );
  }

  return (
    <Carousel
      loop
      slideSize="20%"
      slideGap="xl"
      breakpoints={[
        { maxWidth: "md", slideSize: "33.3333%" },
        { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
      ]}
      sx={{ flex: 1 }}
      styles={{
        indicator: {
          background: "green",
          width: 12,
          height: 4,
          transition: "width 250ms ease",
          "&[data-active]": {
            width: 40,
          },
        },
      }}
      nextControlLabel="Next carousel page"
      previousControlLabel="Previous carousel page"
    >
      {products.map((product, idx) => (
        <Carousel.Slide key={product.id}>
          <ProductCard product={product} priority={idx === 0} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
