import { DateTime } from "luxon";
/** Returns YYYY-MM-DD string for current day in America/New_York. */
export function nyDate(d = new Date()) {
    return DateTime.fromJSDate(d, { zone: "America/New_York" }).toFormat("yyyy-LL-dd");
}
/** Milliseconds until next NY midnight (for countdown). */
export function msUntilNextNyMidnight(d = new Date()) {
    const now = DateTime.fromJSDate(d, { zone: "America/New_York" });
    const next = now.plus({ days: 1 }).startOf("day");
    return next.toMillis() - now.toMillis();
}
