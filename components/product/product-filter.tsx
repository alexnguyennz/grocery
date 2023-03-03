import type { Dispatch, SetStateAction } from 'react';

import { Select } from '@mantine/core';

export default function ProductFilter({
  filter,
  setFilter,
  sort,
  setSort,
}: {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex justify-between items-center">
      <Select
        label="Filter"
        value={filter}
        onChange={(e: string) => setFilter(e)}
        data={[
          { value: 'all', label: 'All' },
          { value: 'specials', label: 'Specials' },
        ]}
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="ease"
        styles={(theme) => ({
          item: {
            '&[data-selected]': {
              '&, &:hover': {
                backgroundColor: theme.colors.cyan[6],
              },
            },
          },
          input: {
            '&:focus': {
              borderColor: theme.colors.cyan[6],
            },
          },
        })}
      />

      <Select
        label="Sort"
        value={sort}
        onChange={(e: string) => setSort(e)}
        data={[
          { value: 'sku', label: 'SKU' },
          { value: 'price-asc', label: 'Lowest Price' },
          { value: 'price-desc', label: 'Highest Price' },
          { value: 'name-asc', label: 'Name Ascending' },
          { value: 'name-desc', label: 'Name Descending' },
        ]}
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="ease"
        styles={(theme) => ({
          item: {
            '&[data-selected]': {
              '&, &:hover': {
                backgroundColor: theme.colors.cyan[6],
              },
            },
          },
          input: {
            '&:focus': {
              borderColor: theme.colors.cyan[6],
            },
          },
        })}
      />
    </div>
  );
}
