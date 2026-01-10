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
 * Password with strength requirements
 */
export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one number");

/**
 * Simple password (no strength requirements)
 */
export const simplePasswordSchema = z
	.string()
	.min(6, "Password must be at least 6 characters");

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

/**
 * Phone number (basic validation)
 */
export const phoneSchema = z
	.string()
	.regex(
		/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
		"Please enter a valid phone number",
	)
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

/**
 * Currency amount (2 decimal places)
 */
export const currencySchema = z
	.number()
	.multipleOf(0.01, "Must have at most 2 decimal places")
	.min(0, "Must be 0 or greater");

// ============================================
// FORM SCHEMAS (Examples)
// ============================================

/**
 * Login form schema
 */
export const loginFormSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * Registration form schema
 */
export const registerFormSchema = z
	.object({
		name: requiredString("Name"),
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
		terms: z.boolean().refine((val) => val === true, {
			message: "You must accept the terms and conditions",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

/**
 * Profile update form schema
 */
export const profileFormSchema = z.object({
	name: requiredString("Name").max(
		100,
		"Name must be less than 100 characters",
	),
	email: emailSchema,
	bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
	website: urlSchema.optional(),
	phone: phoneSchema.optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

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

/**
 * Search/filter form schema
 */
export const searchFormSchema = z.object({
	query: z.string().optional(),
	status: z.enum(["all", "active", "completed"]).default("all"),
	sortBy: z.enum(["createdAt", "dueDate", "priority"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

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
