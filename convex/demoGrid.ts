import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { DEMO_GRID_SIZE } from "./lib/constants";

const SMILEY_PATTERN: Array<[number, number]> = [
	[2, 3],
	[2, 4],
	[3, 3],
	[3, 4],
	[2, 7],
	[2, 8],
	[3, 7],
	[3, 8],
	[7, 2],
	[7, 9],
	[8, 3],
	[8, 8],
	[9, 4],
	[9, 5],
	[9, 6],
	[9, 7],
];

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

export const toggleCell = mutation({
	args: {
		row: v.number(),
		col: v.number(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		if (
			args.row < 0 ||
			args.row >= DEMO_GRID_SIZE ||
			args.col < 0 ||
			args.col >= DEMO_GRID_SIZE
		) {
			return null;
		}

		const existing = await ctx.db
			.query("demoGrid")
			.withIndex("by_position", (q) =>
				q.eq("row", args.row).eq("col", args.col),
			)
			.unique();

		if (existing) {
			if (existing.checked) {
				await ctx.db.delete(existing._id);
			} else {
				await ctx.db.patch(existing._id, { checked: true });
			}
		} else {
			await ctx.db.insert("demoGrid", {
				row: args.row,
				col: args.col,
				checked: true,
			});
		}

		return null;
	},
});

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

export const resetToSmiley = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const cells = await ctx.db.query("demoGrid").collect();
		for (const cell of cells) {
			await ctx.db.delete(cell._id);
		}

		for (const [row, col] of SMILEY_PATTERN) {
			await ctx.db.insert("demoGrid", { row, col, checked: true });
		}

		return null;
	},
});
