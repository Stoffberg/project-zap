import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================
// QUERIES
// ============================================

/**
 * List demo users with pagination
 * Supports cursor-based pagination for efficient data loading
 */
export const list = query({
	args: {
		paginationOpts: paginationOptsValidator,
	},
	// Note: Don't specify returns for paginated queries - Convex handles the type automatically
	handler: async (ctx, args) => {
		return await ctx.db
			.query("demoUsers")
			.order("desc")
			.paginate(args.paginationOpts);
	},
});

/**
 * Search demo users by name with pagination
 */
export const search = query({
	args: {
		searchQuery: v.string(),
		paginationOpts: paginationOptsValidator,
	},
	// Note: Don't specify returns for paginated queries - Convex handles the type automatically
	handler: async (ctx, args) => {
		if (!args.searchQuery.trim()) {
			return await ctx.db
				.query("demoUsers")
				.order("desc")
				.paginate(args.paginationOpts);
		}

		return await ctx.db
			.query("demoUsers")
			.withSearchIndex("search_name", (q) => q.search("name", args.searchQuery))
			.paginate(args.paginationOpts);
	},
});

/**
 * Get total count of demo users (for pagination UI)
 */
export const count = query({
	args: {
		searchQuery: v.optional(v.string()),
	},
	returns: v.number(),
	handler: async (ctx, args) => {
		const trimmedQuery = args.searchQuery?.trim();
		if (trimmedQuery) {
			const results = await ctx.db
				.query("demoUsers")
				.withSearchIndex("search_name", (q) => q.search("name", trimmedQuery))
				.collect();
			return results.length;
		}

		const results = await ctx.db.query("demoUsers").collect();
		return results.length;
	},
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Seed demo users with sample data
 */
export const seed = mutation({
	args: {},
	returns: v.number(),
	handler: async (ctx) => {
		// Check if already seeded
		const existing = await ctx.db.query("demoUsers").first();
		if (existing) {
			return 0;
		}

		const departments = [
			"Engineering",
			"Design",
			"Marketing",
			"Sales",
			"Support",
			"HR",
			"Finance",
		];
		const roles = ["admin", "moderator", "user"] as const;
		const statuses = ["active", "inactive", "pending"] as const;

		const firstNames = [
			"Alice",
			"Bob",
			"Carol",
			"David",
			"Eva",
			"Frank",
			"Grace",
			"Henry",
			"Ivy",
			"Jack",
			"Kate",
			"Liam",
			"Mia",
			"Noah",
			"Olivia",
			"Peter",
			"Quinn",
			"Ruby",
			"Sam",
			"Tara",
			"Uma",
			"Victor",
			"Wendy",
			"Xavier",
			"Yara",
			"Zack",
			"Anna",
			"Ben",
			"Clara",
			"Dan",
			"Emma",
			"Felix",
			"Gina",
			"Hugo",
			"Iris",
			"James",
			"Kelly",
			"Leo",
			"Maya",
			"Nick",
			"Ora",
			"Paul",
			"Quincy",
			"Rosa",
			"Steve",
			"Tina",
			"Uri",
			"Vera",
			"Will",
			"Xena",
			"Yuri",
			"Zoe",
			"Adam",
			"Beth",
			"Carl",
			"Diana",
			"Eric",
			"Fiona",
			"George",
			"Helen",
			"Ivan",
			"Julia",
			"Kevin",
			"Luna",
		];

		const lastNames = [
			"Smith",
			"Johnson",
			"Williams",
			"Brown",
			"Jones",
			"Garcia",
			"Miller",
			"Davis",
			"Rodriguez",
			"Martinez",
			"Hernandez",
			"Lopez",
			"Gonzalez",
			"Wilson",
			"Anderson",
			"Thomas",
			"Taylor",
			"Moore",
			"Jackson",
			"Martin",
			"Lee",
			"Perez",
			"Thompson",
			"White",
			"Harris",
			"Sanchez",
			"Clark",
			"Ramirez",
			"Lewis",
			"Robinson",
			"Walker",
			"Young",
		];

		const users = [];
		for (let i = 0; i < 100; i++) {
			const firstName = firstNames[i % firstNames.length];
			const lastName = lastNames[Math.floor(i / 2) % lastNames.length];
			const name = `${firstName} ${lastName}`;
			const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

			users.push({
				name,
				email,
				role: roles[i % roles.length],
				status: statuses[Math.floor(Math.random() * 3)],
				department: departments[i % departments.length],
			});
		}

		for (const user of users) {
			await ctx.db.insert("demoUsers", user);
		}

		return users.length;
	},
});

/**
 * Clear all demo users
 */
export const clear = mutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const users = await ctx.db.query("demoUsers").collect();
		for (const user of users) {
			await ctx.db.delete(user._id);
		}
		return null;
	},
});

/**
 * Delete a single demo user
 */
export const remove = mutation({
	args: {
		id: v.id("demoUsers"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return null;
	},
});

/**
 * Update a demo user
 */
export const update = mutation({
	args: {
		id: v.id("demoUsers"),
		name: v.optional(v.string()),
		email: v.optional(v.string()),
		role: v.optional(
			v.union(v.literal("admin"), v.literal("moderator"), v.literal("user")),
		),
		status: v.optional(
			v.union(v.literal("active"), v.literal("inactive"), v.literal("pending")),
		),
		department: v.optional(v.string()),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		const filteredUpdates: Record<string, string> = {};

		for (const [key, value] of Object.entries(updates)) {
			if (value !== undefined) {
				filteredUpdates[key] = value;
			}
		}

		if (Object.keys(filteredUpdates).length > 0) {
			await ctx.db.patch(id, filteredUpdates);
		}
		return null;
	},
});
