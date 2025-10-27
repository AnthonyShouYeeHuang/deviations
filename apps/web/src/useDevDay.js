import * as React from "react";
const KEY = "dev:dayOverride"; // localStorage key
function pad2(n) { return String(n).padStart(2, "0"); }
function toDateId(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function fromDateId(id) {
    const m = id.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m)
        return null;
    const y = +m[1], mo = +m[2] - 1, da = +m[3];
    const d = new Date(y, mo, da);
    if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== da)
        return null;
    return d;
}
function addDays(id, delta) {
    const base = fromDateId(id) ?? new Date();
    const d = new Date(base);
    d.setDate(d.getDate() + delta);
    return toDateId(d);
}
function initial() {
    const url = new URL(window.location.href);
    const qs = url.searchParams.get("devDay");
    if (qs && fromDateId(qs))
        return { id: qs, source: "url" };
    const saved = localStorage.getItem(KEY);
    if (saved && fromDateId(saved))
        return { id: saved, source: "storage" };
    return { id: toDateId(new Date()), source: "system" };
}
export function useDevDay() {
    const init = initial();
    const [dayId, setDayIdState] = React.useState(init.id);
    const [source, setSource] = React.useState(init.source);
    function setDayId(next) {
        const ok = fromDateId(next);
        if (!ok)
            return;
        const id = toDateId(ok);
        localStorage.setItem(KEY, id);
        setDayIdState(id);
        setSource("storage");
        const url = new URL(window.location.href);
        url.searchParams.set("devDay", id);
        history.replaceState(null, "", url.toString());
    }
    function clearOverride() {
        localStorage.removeItem(KEY);
        const url = new URL(window.location.href);
        url.searchParams.delete("devDay");
        history.replaceState(null, "", url.toString());
        const today = toDateId(new Date());
        setDayIdState(today);
        setSource("system");
    }
    return {
        dayId,
        setDayId,
        nextDay: () => setDayId(addDays(dayId, +1)),
        prevDay: () => setDayId(addDays(dayId, -1)),
        clearOverride,
        isOverridden: source !== "system",
        source
    };
}
