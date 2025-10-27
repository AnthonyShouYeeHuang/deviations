"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDevDay = useDevDay;
var React = require("react");
var KEY = "dev:dayOverride"; // localStorage key
function pad2(n) { return String(n).padStart(2, "0"); }
function toDateId(d) {
    return "".concat(d.getFullYear(), "-").concat(pad2(d.getMonth() + 1), "-").concat(pad2(d.getDate()));
}
function fromDateId(id) {
    var m = id.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m)
        return null;
    var y = +m[1], mo = +m[2] - 1, da = +m[3];
    var d = new Date(y, mo, da);
    if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== da)
        return null;
    return d;
}
function addDays(id, delta) {
    var _a;
    var base = (_a = fromDateId(id)) !== null && _a !== void 0 ? _a : new Date();
    var d = new Date(base);
    d.setDate(d.getDate() + delta);
    return toDateId(d);
}
function initial() {
    var url = new URL(window.location.href);
    var qs = url.searchParams.get("devDay");
    if (qs && fromDateId(qs))
        return { id: qs, source: "url" };
    var saved = localStorage.getItem(KEY);
    if (saved && fromDateId(saved))
        return { id: saved, source: "storage" };
    return { id: toDateId(new Date()), source: "system" };
}
function useDevDay() {
    var init = initial();
    var _a = React.useState(init.id), dayId = _a[0], setDayIdState = _a[1];
    var _b = React.useState(init.source), source = _b[0], setSource = _b[1];
    function setDayId(next) {
        var ok = fromDateId(next);
        if (!ok)
            return;
        var id = toDateId(ok);
        localStorage.setItem(KEY, id);
        setDayIdState(id);
        setSource("storage");
        var url = new URL(window.location.href);
        url.searchParams.set("devDay", id);
        history.replaceState(null, "", url.toString());
    }
    function clearOverride() {
        localStorage.removeItem(KEY);
        var url = new URL(window.location.href);
        url.searchParams.delete("devDay");
        history.replaceState(null, "", url.toString());
        var today = toDateId(new Date());
        setDayIdState(today);
        setSource("system");
    }
    return {
        dayId: dayId,
        setDayId: setDayId,
        nextDay: function () { return setDayId(addDays(dayId, +1)); },
        prevDay: function () { return setDayId(addDays(dayId, -1)); },
        clearOverride: clearOverride,
        isOverridden: source !== "system",
        source: source
    };
}
