export * from "./types";
export * from "./time";
export * from "./win";  

/** A stable per-device key; stored in localStorage. */
export function deviceKey(): string {
  let k = localStorage.getItem("devkey");
  if (!k) {
    // crypto.randomUUID is supported on modern browsers
    const uuid = (crypto as any).randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    localStorage.setItem("devkey", uuid);
    k = uuid;
  }
  return k;
}

/** Minimal validation for answers. Extend later per winType. */
export function validateAnswer(a: unknown): boolean {
  if (typeof a === "string") return a.trim().length > 0;
  if (typeof a === "number") return Number.isFinite(a);
  if (typeof a === "object" && a !== null && "optionId" in (a as any))
    return typeof (a as any).optionId === "string";
  return false;
}
