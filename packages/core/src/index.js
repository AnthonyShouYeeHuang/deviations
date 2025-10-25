export * from "./types";
export * from "./time";
export * from "./win";
/** A stable per-device key; stored in localStorage. */
export function deviceKey() {
    const k = localStorage.getItem("devkey");
    if (k)
        return k;
    const v = crypto.randomUUID();
    localStorage.setItem("devkey", v);
    return v; // <-- return the new value, not k
}
/** Minimal validation for answers. Extend later per winType. */
export function validateAnswer(a) {
    if (typeof a === "string")
        return a.trim().length > 0;
    if (typeof a === "number")
        return Number.isFinite(a);
    if (typeof a === "object" && a !== null && "optionId" in a)
        return typeof a.optionId === "string";
    return false;
}
