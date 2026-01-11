function getStartOfToday(): number {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today.getTime();
}

function getStartOfTomorrow(): number {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);
	return tomorrow.getTime();
}

export function isOverdue(timestamp: number): boolean {
	return timestamp < getStartOfToday();
}

export function isToday(timestamp: number): boolean {
	return timestamp >= getStartOfToday() && timestamp < getStartOfTomorrow();
}

function isTomorrow(timestamp: number): boolean {
	const tomorrowStart = getStartOfTomorrow();
	return timestamp >= tomorrowStart && timestamp < tomorrowStart + 86400000;
}

export function formatRelativeDate(timestamp: number): string {
	if (isToday(timestamp)) return "Today";
	if (isTomorrow(timestamp)) return "Tomorrow";
	return new Date(timestamp).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}
