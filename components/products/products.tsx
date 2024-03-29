import { useState, type ReactNode } from "react";
import NextLink from "next/link";
import {
  Breadcrumbs as MantineBreadcrumbs,
  Collapse,
  Divider,
  Group,
  UnstyledButton,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconHome2 } from "@tabler/icons-react";
/*** COMPONENTS ***/
import ProductCard from "@/components/product/product-card";

import type { products } from "@prisma/client";

type Children = {
  children: ReactNode;
};

type CardData = {
  data: [];
};

const ProductsLayout = ({ children }: Children) => <>{children}</>;

const Breadcrumbs = ({ children }: Children) => (
  <div className="hidden md:block">
    <MantineBreadcrumbs separator="→" className="breadcrumbs flex flex-wrap">
      <NextLink href="/">
        <IconHome2 />
      </NextLink>
      {children}
    </MantineBreadcrumbs>
  </div>
);

const Heading = ({
  title,
  data,
}: {
  title: string;
  data: { count: number };
}) => (
  <>
    <Title order={2} align="center">
      {title}
    </Title>
    <Group spacing={10} position="center">
      {data ? (
        <Text>{data.count} items</Text>
      ) : (
        <>
          <Skeleton height={10} circle />
          <Text>items</Text>
        </>
      )}
    </Group>
  </>
);

const Body = ({ children }: Children) => {
  return <div className="flex flex-col gap-5 md:flex-row">{children}</div>;
};

const Categories = ({ children }: Children) => {
  const [categoriesOpened, setCategoriesOpened] = useState(true);

  return (
    <div className="basis-1/6 space-y-2">
      <UnstyledButton
        onClick={() => setCategoriesOpened((o) => !o)}
        className="block w-full"
      >
        <Group spacing={5} position="apart">
          <Text size="sm">Categories</Text>
          {categoriesOpened ? (
            <IconChevronUp size={20} stroke={2} />
          ) : (
            <IconChevronDown size={20} stroke={2} />
          )}
        </Group>
      </UnstyledButton>
      <Divider size="md" />
      <Collapse in={categoriesOpened} animateOpacity={false}>
        <ul className="space-y-2 text-lg">{children}</ul>
      </Collapse>
    </div>
  );
};

const Main = ({ children }: Children) => {
  return <div className="basis-5/6 space-y-3">{children}</div>;
};

const Cards = ({ data }: { data: CardData }) => {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {data && data.data
        ? data.data.map((product: products) => (
            <ProductCard product={product} key={product.sku} />
          ))
        : [0, 1, 2, 3, 4].map((number, idx) => (
            <Skeleton key={idx} height={350} mb="xl" />
          ))}
    </div>
  );
};

ProductsLayout.Breadcrumbs = Breadcrumbs;
ProductsLayout.Heading = Heading;
ProductsLayout.Body = Body;
ProductsLayout.Categories = Categories;
ProductsLayout.Main = Main;
ProductsLayout.Cards = Cards;

export default ProductsLayout;
