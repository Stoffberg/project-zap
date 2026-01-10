import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const GRID_SIZE = 12;

/**
 * Get all checked cells in the demo grid
 */
export const getChecked = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("demoGrid"),
      _creationTime: v.number(),
      row: v.number(),
      col: v.number(),
      checked: v.boolean(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db
      .query("demoGrid")
      .filter((q) => q.eq(q.field("checked"), true))
      .collect();
  },
});

/**
 * Toggle a cell in the demo grid
 */
export const toggleCell = mutation({
  args: {
    row: v.number(),
    col: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Validate bounds
    if (args.row < 0 || args.row >= GRID_SIZE || args.col < 0 || args.col >= GRID_SIZE) {
      return null;
    }

    // Find existing cell
    const existing = await ctx.db
      .query("demoGrid")
      .withIndex("by_position", (q) => q.eq("row", args.row).eq("col", args.col))
      .unique();

    if (existing) {
      // Toggle existing cell
      if (existing.checked) {
        // If checked, delete it (unchecked cells don't need to exist)
        await ctx.db.delete(existing._id);
      } else {
        await ctx.db.patch(existing._id, { checked: true });
      }
    } else {
      // Create new checked cell
      await ctx.db.insert("demoGrid", {
        row: args.row,
        col: args.col,
        checked: true,
      });
    }

    return null;
  },
});

/**
 * Clear all cells in the demo grid
 */
export const clearAll = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const cells = await ctx.db.query("demoGrid").collect();
    for (const cell of cells) {
      await ctx.db.delete(cell._id);
    }
    return null;
  },
});
