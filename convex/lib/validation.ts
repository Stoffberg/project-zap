import { ConvexError } from "convex/values";
import {
	TODO_TEXT_MAX_LENGTH,
	USER_NAME_MAX_LENGTH,
	USER_NAME_MIN_LENGTH,
} from "./constants";
import { ValidationError } from "./errors";

export { ValidationError };

export function validateTodoText(text: string): string {
	const trimmed = text.trim();

	if (trimmed.length === 0) {
		throw new ConvexError({
			code: ValidationError.TEXT_REQUIRED,
			message: "Todo text is required",
		});
	}

	if (trimmed.length > TODO_TEXT_MAX_LENGTH) {
		throw new ConvexError({
			code: ValidationError.TEXT_TOO_LONG,
			message: `Todo text must be ${TODO_TEXT_MAX_LENGTH} characters or less`,
		});
	}

	return trimmed;
}

export function validateUserName(name: string): string {
	const trimmed = name.trim();

	if (trimmed.length < USER_NAME_MIN_LENGTH) {
		throw new ConvexError({
			code: ValidationError.TEXT_TOO_SHORT,
			message: `Name must be at least ${USER_NAME_MIN_LENGTH} character`,
		});
	}

	if (trimmed.length > USER_NAME_MAX_LENGTH) {
		throw new ConvexError({
			code: ValidationError.TEXT_TOO_LONG,
			message: `Name must be ${USER_NAME_MAX_LENGTH} characters or less`,
		});
	}

	return trimmed;
}
