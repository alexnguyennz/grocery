import { useReducer } from "react";
import { type CategoriesSettings } from "@/types/types";

export default function useCategories() {
  const [settings, setSettings] = useReducer(
    (prevState: CategoriesSettings, nextState: Partial<CategoriesSettings>) => {
      const newSettings = {
        ...prevState,
        ...nextState,
      };

      if (nextState.filter || nextState.pageSize) {
        newSettings.page = 1; // reset page to start products query from page 1
      }

      return newSettings;
    },
    {
      filter: "all",
      sort: "sku",
      page: 1,
      pageSize: 20,
    }
  );

  return { settings, setSettings };
}
