import { query } from "./postgres-handler.js";

export async function insertData(sku, name, price, count) {
  const sqlQuery =
    "INSERT INTO public.products (sku, name, price, count) VALUES ($1, $2, $3, $4)";
  const variables = [sku, name, price, count];

  return query(sqlQuery, variables);
}
