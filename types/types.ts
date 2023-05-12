export interface CategoriesSettings {
  filter: "all" | "specials";
  sort: "sku" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
  pageSize: number;
  page: number;
}
