import { createServerFn } from "@tanstack/react-start";
import {
	getSignInUrl,
	getSignUpUrl,
} from "@workos/authkit-tanstack-react-start";

/**
 * Server function to get the WorkOS sign-in URL
 */
export const getSignInUrlFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const signInUrl = await getSignInUrl();
		return { signInUrl };
	},
);

/**
 * Server function to get the WorkOS sign-up URL
 */
export const getSignUpUrlFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const signUpUrl = await getSignUpUrl();
		return { signUpUrl };
	},
);
