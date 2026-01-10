import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { DEMO_GRID_SIZE } from "./lib/constants";

/**
 * Smiley face pattern for a 12x12 grid.
 * Each [row, col] pair represents a checked cell.
 */
const SMILEY_PATTERN: Array<[number, number]> = [
	// Left eye
	[2, 3],
	[2, 4],
	[3, 3],
	[3, 4],
	// Right eye
	[2, 7],
	[2, 8],
	[3, 7],
	[3, 8],
	// Smile curve
	[7, 2],
	[7, 9],
	[8, 3],
	[8, 8],
	[9, 4],
	[9, 5],
	[9, 6],
	[9, 7],
];

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
		}),
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
		if (
			args.row < 0 ||
			args.row >= DEMO_GRID_SIZE ||
			args.col < 0 ||
			args.col >= DEMO_GRID_SIZE
		) {
			return null;
		}

		// Find existing cell
		const existing = await ctx.db
			.query("demoGrid")
			.withIndex("by_position", (q) =>
				q.eq("row", args.row).eq("col", args.col),
			)
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

// ============================================
// INTERNAL FUNCTIONS (for cron jobs)
// ============================================

/**
 * Reset the demo grid to show a smiley face pattern.
 * Called by cron job to keep the demo engaging.
 */
export const resetToSmiley = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		// Clear existing cells
		const cells = await ctx.db.query("demoGrid").collect();
		for (const cell of cells) {
			await ctx.db.delete(cell._id);
		}

		// Insert smiley pattern
		for (const [row, col] of SMILEY_PATTERN) {
			await ctx.db.insert("demoGrid", {
				row,
				col,
				checked: true,
			});
		}

		return null;
	},
});
