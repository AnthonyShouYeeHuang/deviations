"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nyDate = nyDate;
exports.msUntilNextNyMidnight = msUntilNextNyMidnight;
var luxon_1 = require("luxon");
/** Returns YYYY-MM-DD string for current day in America/New_York. */
function nyDate(d) {
    if (d === void 0) { d = new Date(); }
    return luxon_1.DateTime.fromJSDate(d, { zone: "America/New_York" }).toFormat("yyyy-LL-dd");
}
/** Milliseconds until next NY midnight (for countdown). */
function msUntilNextNyMidnight(d) {
    if (d === void 0) { d = new Date(); }
    var now = luxon_1.DateTime.fromJSDate(d, { zone: "America/New_York" });
    var next = now.plus({ days: 1 }).startOf("day");
    return next.toMillis() - now.toMillis();
}
