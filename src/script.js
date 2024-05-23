import "dotenv/config";
import { query } from "./database/postgres-handler.js";

const res = await query("SELECT * FROM public.products");

console.log(res.rows);
