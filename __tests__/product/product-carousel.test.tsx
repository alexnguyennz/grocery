import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Carousel from "@/components/product/product-carousel";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { prismaMock } from "../../singleton";

import productData from "@/__mocks__/data/products.json";

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <MantineProvider>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};

describe("Carousel", () => {
  it("renders carousel", async () => {
    const mock = await prismaMock.products.findMany.mockResolvedValue(
      productData
    );
    const data = await mock();

    render(
      <Providers>
        <Carousel products={data} />
      </Providers>
    );
  });

  it("renders next carousel page", async () => {
    const user = userEvent.setup();

    const mock = await prismaMock.products.findMany.mockResolvedValue(
      productData
    );
    const data = await mock();

    render(
      <Providers>
        <Carousel products={data} />
      </Providers>
    );

    const nextPageButton = screen.getByRole("button", {
      name: /Next carousel page/i,
    });

    await user.click(nextPageButton);
  });
});
