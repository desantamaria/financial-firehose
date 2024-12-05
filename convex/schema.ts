import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chat: defineTable({
    name: v.string(),
  }),
});
