import type { Dispatch, SetStateAction } from 'react';

import { useEffect, useState } from 'react';
import { Pagination, Select } from '@mantine/core';

export default function ProductPagination({
  page,
  pageSize,
  count,
  setPage,
  setPageSize,
}: {
  page: number;
  pageSize: number;
  count: number;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
}) {
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize));
  }, [count, pageSize]);

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
      <Pagination
        page={page}
        onChange={setPage}
        total={pageCount}
        boundaries={1}
        color="cyan.6"
      />
      <Select
        label="Items"
        value={String(pageSize)}
        onChange={(e: string) => setPageSize(Number(e))}
        data={[
          { value: '20', label: '20' },
          { value: '40', label: '40' },
          { value: '60', label: '60' },
          { value: '80', label: '80' },
          { value: '100', label: '100' },
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
