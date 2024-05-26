import { POSTGRES_SECRETS } from "../secrets/index.js";
import pg from "pg";

const pool = new pg.Pool(POSTGRES_SECRETS);

export async function query(sql, variables) {
  const client = await pool.connect();
  try {
    const res = await client.query(sql, variables);
    return res;
  } finally {
    client.release();
  }
}
