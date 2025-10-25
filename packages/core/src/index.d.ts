export * from "./types";
export * from "./time";
export * from "./win";
/** A stable per-device key; stored in localStorage. */
export declare function deviceKey(): string;
/** Minimal validation for answers. Extend later per winType. */
export declare function validateAnswer(a: unknown): boolean;
//# sourceMappingURL=index.d.ts.map