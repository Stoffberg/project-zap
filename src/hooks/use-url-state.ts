import {
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs";

export const parsers = {
	string: parseAsString.withDefault(""),
	integer: parseAsInteger.withDefault(0),
	boolean: parseAsBoolean.withDefault(false),
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	sortOrder: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
	stringArray: parseAsArrayOf(parseAsString),
	id: parseAsString,
} as const;
