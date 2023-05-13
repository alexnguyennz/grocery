import type { Dispatch } from "react";

import { useEffect, useState } from "react";
import { Pagination, Select } from "@mantine/core";
import { type CategoriesSettings } from "@/types/types";

export default function ProductPagination({
  page,
  pageSize,
  setSettings,
  count,
}: {
  page: number;
  pageSize: number;
  setSettings: Dispatch<Partial<CategoriesSettings>>;
  count: number;
}) {
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(count / pageSize));
  }, [count, pageSize]);

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <Pagination
        page={page}
        onChange={(e) => setSettings({ page: e })}
        total={pageCount}
        boundaries={1}
        color="cyan.6"
      />
      <Select
        label="Items"
        value={String(pageSize)}
        onChange={(e: string) => setSettings({ pageSize: Number(e) })}
        data={[
          { value: "20", label: "20" },
          { value: "40", label: "40" },
          { value: "60", label: "60" },
          { value: "80", label: "80" },
          { value: "100", label: "100" },
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
