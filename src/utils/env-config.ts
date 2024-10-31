import { load } from "https://deno.land/std@0.214.0/dotenv/mod.ts";

const env = await load();

export default {
  host: env["HOST"] || 'localhost',
  port: +(env["PORT"] || 8080),
  dbUrl: env["DATABASE_URL"] || 'postgresql://chinisik:chinisik@localhost:5432/chinisik_dev',
};
