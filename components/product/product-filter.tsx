import type { Dispatch } from "react";

import { Select } from "@mantine/core";

import { CategoriesSettings } from "@/types/types";

export default function ProductFilter({
  filter,
  sort,
  setSettings,
}: {
  filter: string;
  sort: string;
  setSettings: Dispatch<Partial<CategoriesSettings>>;
}) {
  return (
    <div className="flex items-center justify-between">
      <Select
        label="Filter"
        value={filter}
        onChange={(e: "all" | "specials") => setSettings({ filter: e })}
        data={[
          { value: "all", label: "All" },
          { value: "specials", label: "Specials" },
        ]}
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="ease"
        styles={(theme) => ({
          item: {
            "&[data-selected]": {
              "&, &:hover": {
                backgroundColor: theme.colors.cyan[6],
              },
            },
          },
          input: {
            "&:focus": {
              borderColor: theme.colors.cyan[6],
            },
          },
        })}
      />

      <Select
        label="Sort"
        value={sort}
        onChange={(
          e: "sku" | "price-asc" | "price-desc" | "name-asc" | "name-desc"
        ) => setSettings({ sort: e })}
        data={[
          { value: "sku", label: "SKU" },
          { value: "price-asc", label: "Lowest Price" },
          { value: "price-desc", label: "Highest Price" },
          { value: "name-asc", label: "Name Ascending" },
          { value: "name-desc", label: "Name Descending" },
        ]}
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="ease"
        styles={(theme) => ({
          item: {
            "&[data-selected]": {
              "&, &:hover": {
                backgroundColor: theme.colors.cyan[6],
              },
            },
          },
          input: {
            "&:focus": {
              borderColor: theme.colors.cyan[6],
            },
          },
        })}
      />
    </div>
  );
}
