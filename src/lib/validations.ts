import { z } from "zod";

// ============================================
// COMMON FIELD VALIDATORS
// ============================================

/**
 * Email field with proper validation
 */
export const emailSchema = z
	.string()
	.min(1, "Email is required")
	.email("Please enter a valid email address");

/**
 * Required string field
 */
export const requiredString = (fieldName = "This field") =>
	z.string().min(1, `${fieldName} is required`);

/**
 * Optional string that converts empty strings to undefined
 */
export const optionalString = z
	.string()
	.transform((val) => (val === "" ? undefined : val))
	.optional();

/**
 * URL field with validation
 */
export const urlSchema = z
	.string()
	.url("Please enter a valid URL")
	.or(z.literal(""));

// ============================================
// DATE VALIDATORS
// ============================================

/**
 * Date that must be in the future
 */
export const futureDateSchema = z.date().refine((date) => date > new Date(), {
	message: "Date must be in the future",
});

/**
 * Date that must be today or in the future
 */
export const todayOrFutureDateSchema = z.date().refine(
	(date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date >= today;
	},
	{ message: "Date cannot be in the past" },
);

/**
 * Optional date field
 */
export const optionalDateSchema = z.date().optional();

// ============================================
// NUMBER VALIDATORS
// ============================================

/**
 * Positive number
 */
export const positiveNumberSchema = z
	.number()
	.positive("Must be a positive number");

/**
 * Non-negative number (0 or greater)
 */
export const nonNegativeNumberSchema = z
	.number()
	.min(0, "Must be 0 or greater");

/**
 * Integer only
 */
export const integerSchema = z.number().int("Must be a whole number");

/**
 * Percentage (0-100)
 */
export const percentageSchema = z
	.number()
	.min(0, "Must be at least 0")
	.max(100, "Must be at most 100");

// ============================================
// FORM SCHEMAS
// ============================================

/**
 * Todo form schema (matches Convex schema)
 */
export const todoFormSchema = z.object({
	text: requiredString("Task description").max(
		500,
		"Task must be less than 500 characters",
	),
	dueDate: optionalDateSchema,
	priority: z.enum(["low", "medium", "high"]).optional(),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a required select schema from an array of options
 */
export function createSelectSchema<T extends string>(
	options: readonly T[],
	errorMessage = "Please select an option",
) {
	return z.enum(options as [T, ...T[]], {
		message: errorMessage,
	});
}

/**
 * Create an optional select schema from an array of options
 */
export function createOptionalSelectSchema<T extends string>(
	options: readonly T[],
) {
	return z.enum(options as [T, ...T[]]).optional();
}

/**
 * Validate data against a schema and return typed result
 */
export function validateForm<T extends z.ZodSchema>(
	schema: T,
	data: unknown,
):
	| { success: true; data: z.infer<T> }
	| { success: false; errors: z.ZodError } {
	const result = schema.safeParse(data);
	if (result.success) {
		return { success: true, data: result.data };
	}
	return { success: false, errors: result.error };
}
