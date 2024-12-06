import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  codebases: defineTable({
    name: v.string(),
    gitUrl: v.string(),
  }),
});
