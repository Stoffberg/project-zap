import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Convex Cron Jobs
 *
 * Cron jobs run on a schedule and execute internal functions.
 * Use internal functions (not public mutations) for security.
 *
 * @see https://docs.convex.dev/scheduling/cron-jobs
 */
const crons = cronJobs();

/**
 * Reset the demo grid to show a smiley face pattern every hour.
 * This keeps the landing page demo fresh and engaging.
 */
crons.interval(
	"reset demo grid to smiley",
	{ hours: 1 },
	internal.demoGrid.resetToSmiley,
	{},
);

/**
 * Clean up old demo todos every 6 hours.
 * Removes demo todos older than 24 hours to prevent clutter.
 */
crons.interval(
	"cleanup old demo todos",
	{ hours: 6 },
	internal.todos.cleanupOldDemoTodos,
	{},
);

export default crons;
