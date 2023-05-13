import React, { useState, useEffect, useRef } from "react";

import {
  Accordion,
  Button,
  Table,
  Paper,
  Text,
  Title,
  NumberInput,
  Group,
  NumberInputHandlers,
} from "@mantine/core";

import { useStore } from "@/src/state/store";

import capitalize from "@/src/utils/capitalize";
import parse from "html-react-parser";

import { type ProductDetails, type Cart } from "@/src/utils/supabase";

type NutritionRow = {
  columns: string[];
  rows: NutritionRowColumn[];
};

type NutritionRowColumn = {
  columns: string[];
};

type NutritionHeaderColumn = {
  name: string;
  suffix: string | null;
};

export default function ProductDetails({ product }: ProductDetails) {
  const {
    sku,
    name,
    price,
    description,
    unit,
    size,
    origins,
    ingredients,
    nutrition,
    claims,
  } = product;

  const { cart, addToCart, addQuantity, subtractQuantity } = useStore();

  useEffect(() => {
    const item = cart.find((item: Cart) => item.sku === sku);

    if (item) {
      setQuantity(item.cart_quantity);
    } else {
      setQuantity(0);
    }
  }, [cart]);

  const [quantity, setQuantity] = useState(0);
  const handlers = useRef<NumberInputHandlers>();

  return (
    <>
      <Title order={1}>{capitalize(name)}</Title>

      <Text>
        {size.packageType && capitalize(size.packageType)} {size.volumeSize}
      </Text>

      <div className="grid grid-cols-2">
        <Title color={`${price.isSpecial && "red"}`} order={2}>
          ${price.salePrice.toFixed(2)}
          {unit === "Kg" && (
            <span className="text-lg">{unit.toLowerCase()}</span>
          )}
        </Title>
      </div>

      {quantity === 0 && (
        <Button
          onClick={() => addToCart(product)}
          color="dark.5"
          size="lg"
          radius="xl"
        >
          Add to cart
        </Button>
      )}

      {quantity > 0 && (
        <>
          <Group spacing={0}>
            <NumberInput
              size="lg"
              hideControls
              value={quantity}
              onChange={(val) => setQuantity(val!)}
              handlersRef={handlers}
              max={10}
              min={0}
              step={1}
              styles={{
                input: { width: 100, borderRadius: "32px 0px 0px 32px" },
              }}
            />
            <Button
              onClick={() => subtractQuantity(product)}
              color="dark.5"
              px={20}
              size="lg"
              radius={0}
            >
              &#8211;
            </Button>
            <Button
              onClick={() => addQuantity(product)}
              color="dark.5"
              px={20}
              size="lg"
              styles={{
                root: { borderRadius: "0px 32px 32px 0px" },
              }}
            >
              +
            </Button>
          </Group>
        </>
      )}

      {description && <Text>{parse(description)}</Text>}

      <Paper shadow="xs">
        <Accordion
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[7] : "#ffffff",
          })}
        >
          {origins && (
            <Accordion.Item value="origin">
              <Accordion.Control>
                <span className="mb-20 overflow-visible">
                  Country of origin
                </span>
              </Accordion.Control>
              <Accordion.Panel>
                {origins[0] ===
                  "Made in New Zealand from local and imported ingredients." ||
                "Made in New Zealand from imported and local ingredients."
                  ? "Product of New Zealand"
                  : origins[0]}
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {!!ingredients?.ingredients.length && (
            <Accordion.Item value="ingredients">
              <Accordion.Control>Ingredients</Accordion.Control>
              <Accordion.Panel>{ingredients.ingredients[0]}</Accordion.Panel>
            </Accordion.Item>
          )}

          {!!nutrition.length && (
            <Accordion.Item value="nutrition">
              <Accordion.Control>Nutrition</Accordion.Control>
              <Accordion.Panel>
                <Text>{nutrition[0].servings}</Text>
                <Table
                  captionSide="bottom"
                  striped
                  highlightOnHover
                  verticalSpacing="md"
                >
                  <caption>
                    {nutrition[0].footnotes[0]?.prefix}
                    {nutrition[0].footnotes[0]?.displayText}
                  </caption>

                  <thead>
                    <tr>
                      {nutrition[0].columnHeaders?.map(
                        (column: NutritionHeaderColumn) => (
                          <th key={column.name}>{column.name}</th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {nutrition[0].rows.map((row: NutritionRow, idx: number) => (
                      <React.Fragment key={idx}>
                        <tr className="font-bold">
                          {row.columns.map((column, idx: number) => (
                            <td key={idx}>{column}</td>
                          ))}
                        </tr>
                        {/* if any nested rows exist */}
                        {row.rows && row.rows.length > 0 && (
                          <tr>
                            {row.rows[0].columns.map(
                              (column: string, idx: number) => (
                                <td key={idx}>{column}</td>
                              )
                            )}
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {claims.length > 0 && (
            <Accordion.Item value="claims">
              <Accordion.Control>Claims</Accordion.Control>
              <Accordion.Panel>
                <ul className="list-disc pl-8">
                  {claims.map((claim: string) => (
                    <li key={claim}>{claim}</li>
                  ))}
                </ul>
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      </Paper>
    </>
  );
}
