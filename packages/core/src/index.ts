export * from "./types.js";
export * from "./time.js";
export * from "./win.js";

// keep both names exported
export { getDevKey } from "./util-env.js";
export { getDevKey as deviceKey } from "./util-env.js";

// ensure validateAnswer is exported from win.ts; if it's named differently,
// add a shim export here, e.g.:
export function validateAnswer(guess: number, solution?: number): boolean {
  // If solution is omitted, use any internal default or return a basic check
  // Replace this stub with your actual logic
  if (typeof solution === 'number') {
    return guess === solution;
  }
  // fallback behavior so callers with 1 arg don’t error out
  return Number.isFinite(guess);
}
