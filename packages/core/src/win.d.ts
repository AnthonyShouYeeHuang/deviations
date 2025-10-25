import type { Problem, Answer } from "./types";
export type Aggregates = {
    average?: number;
    target?: number;
    threshold?: number;
    counts?: Record<string, number>;
};
export type EvalResult = {
    won: boolean;
    detail?: Record<string, unknown>;
};
export declare function evaluate(problem: Problem, yourAnswer: Answer, aggregates: Aggregates): EvalResult;
//# sourceMappingURL=win.d.ts.map