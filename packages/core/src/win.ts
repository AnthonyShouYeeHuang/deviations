import type { Problem, Answer } from "./types.js";

export type Aggregates = {
  // below_average / closest_to_target
  average?: number;
  target?: number;
  threshold?: number; // optional tolerance for "closest" etc.
  // most_common_choice
  counts?: Record<string, number>; // optionId -> count
};

export type EvalResult = { won: boolean; detail?: Record<string, unknown> };

export function evaluate(
  problem: Problem,
  yourAnswer: Answer,
  aggregates: Aggregates
): EvalResult {
  switch (problem.winType) {
    case "below_mean": {
      const mean = aggregates.average;
      const val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;
      return { won: typeof mean === "number" && val < mean, detail: { val, mean } };
    }
    case "most_common_choice": {
      const counts = aggregates.counts ?? {};
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const mine =
        typeof yourAnswer === "object" && yourAnswer && "optionId" in yourAnswer
          ? (yourAnswer as any).optionId
          : undefined;
      return { won: !!top && mine === top, detail: { mine, top, counts } };
    }
    case "closest_to_target": {
      const t = aggregates.target;
      const tol = aggregates.threshold ?? 0;
      const val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;
      return {
        won: typeof t === "number" && Math.abs(val - t) <= tol,
        detail: { val, target: t, tol }
      };
    }
    case "within_sd_below_mean": {
      const mean = aggregates.average;          // reuse the existing field name
      const std = (aggregates as any).stddev as number | undefined;
      const val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;

      // Rule: val must be < mean AND >= mean - stddev
      const ok =
        typeof mean === "number" &&
        typeof std === "number" &&
        Number.isFinite(val) &&
        val < mean &&
        val >= mean - std;

      return { won: ok, detail: { val, mean, std, lowerBound: (typeof mean === "number" && typeof std === "number") ? mean - std : undefined }
      };
    }
    case "within_sd_above_mean": {
      const mean = aggregates.average;          // reuse the existing field name
      const std = (aggregates as any).stddev as number | undefined;
      const val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;

      // Rule: val must be < mean AND >= mean - stddev
      const ok =
        typeof mean === "number" &&
        typeof std === "number" &&
        Number.isFinite(val) &&
        val > mean &&
        val <= mean - std;

      return { won: ok, detail: { val, mean, std, upperBound: (typeof mean === "number" && typeof std === "number") ? mean - std : undefined }
      };
    }
    case "closest_to_pct_of_mean": {
      // Aggregates expected: average (mean), stddev
      const mean = aggregates.average as number | undefined;
      const std = (aggregates as any).stddev as number | undefined;

      // Read optional config; defaults: 80% target, ±0.5σ window
      const cfg = (problem.config ?? {}) as {
        pctOfMean?: number;
        sigmaWindow?: number;
        min?: number;
        max?: number;
      };
      const pct = typeof cfg.pctOfMean === "number" ? cfg.pctOfMean : 0.8;
      const halfSigma = typeof cfg.sigmaWindow === "number" ? cfg.sigmaWindow : 0.5;

      // User's value (numeric only for this rule)
      const val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;

      // Optional clamping to a range the problem defines (e.g., 0–1000)
      const inRange =
        (typeof cfg.min !== "number" || val >= cfg.min) &&
        (typeof cfg.max !== "number" || val <= cfg.max);

      if (
        typeof mean !== "number" ||
        typeof std !== "number" ||
        !Number.isFinite(val) ||
        !inRange
      ) {
        return { won: false, detail: { val, mean, std, inRange } };
      }

      const target = pct * mean;
      const lower = target - halfSigma * std;
      const upper = target + halfSigma * std;

      const won = val >= lower && val <= upper;

      return {
        won,
        detail: { val, mean, std, target, lower, upper, pct, halfSigma }
      };
    }
    default:
      return { won: false };
  }
};

export function validateAnswer(
  problemOrAnswer: any,
  maybeAnswer?: any
): boolean {
  // normalize to { problem, answer }
  let problem = undefined as any;
  let answer = undefined as any;

  if (arguments.length === 1) {
    // Caller passed a single value or an object { problem, answer }
    const arg = problemOrAnswer;
    if (arg && typeof arg === "object" && ("answer" in arg || "problem" in arg)) {
      problem = arg.problem;
      answer = arg.answer;
    } else {
      answer = arg;
    }
  } else {
    problem = problemOrAnswer;
    answer = maybeAnswer;
  }

  // If problem provides its own validator, use it
  if (problem && typeof problem.validate === "function") {
    try {
      return !!problem.validate(answer);
    } catch {
      // fall through to generic checks
    }
  }

  // Numeric problem with a target
  if (problem?.type === "number" && problem?.target != null) {
    const a = typeof answer === "number" ? answer : Number(answer);
    const b = typeof problem.target === "number" ? problem.target : Number(problem.target);
    if (Number.isFinite(a) && Number.isFinite(b)) {
      return Math.abs(a - b) < 1e-9;
    }
  }

  // Generic fallback: “is there a non-empty answer?”
  if (answer == null) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  return true;
}