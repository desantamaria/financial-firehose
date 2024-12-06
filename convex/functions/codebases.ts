import { query } from "../_generated/server";

export const list = query(async ({ db }) => {
  return await db.query("codebases").collect();
});
