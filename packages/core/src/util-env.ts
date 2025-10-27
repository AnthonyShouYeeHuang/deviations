/**
 * Works in both browser and Node:
 * - Uses localStorage only if it exists
 * - Uses crypto.randomUUID only if it exists, with a Node-safe fallback
 */
export function getDevKey(): string {
  const g = globalThis as any;

  const ls: any = g?.localStorage;
  let key: string | null =
    (ls?.getItem?.("devkey") as string | null | undefined) ?? null;

  if (!key) {
    const newKey: string =
      g?.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    key = newKey;
    ls?.setItem?.("devkey", newKey); // only persists if localStorage exists
  }

  // key is guaranteed to be a string by here
  return key;
}