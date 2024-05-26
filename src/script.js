import "dotenv/config";
import { query } from "./database/postgres-handler.js";
import { insertData } from "./database/query.js";
import fs from "fs";
import { parse } from "csv-parse";

const localData = [];

fs.createReadStream("./database.csv")
  .pipe(
    parse({
      delimiter: ",",
      columns: true,
      ltrim: true,
    })
  )
  .on("data", function (row) {
    // This will push the object row into the array
    localData.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    // Here log the result array
    console.log("parsed csv data:");
    console.log(localData);
  });

async function processData(localData) {
  const onlineData = await query("SELECT * FROM public.products");

  for (const line of localData) {
    const updateQuery = `
      UPDATE public.products
      SET name = $2, price = $3, count = $4
      WHERE sku = $1
    `;

    const insertQuery =
      "INSERT INTO public.products (sku, name, price, count) VALUES ($1, $2, $3, $4)";

    const updateValues = [line.sku, line.name, line.price, line.count];

    if (onlineData.rows.some((row) => row.sku === line.sku)) {
      await query(updateQuery, updateValues);
    } else {
      await query(insertQuery, updateValues);
    }

    const deleteQuery = "DELETE FROM public.products WHERE sku = $1";

    for (const row of onlineData.rows) {
      if (!localData.some((line) => line.sku === row.sku)) {
        await query(deleteQuery, [row.sku]);
      }
    }
  }
}

processData(localData);
