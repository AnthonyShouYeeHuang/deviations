export type WinType =
  | "below_mean"
  | "most_common_choice"
  | "closest_to_target"
  | "within_sd_below_mean"
  | "within_sd_above_mean"
  | "closest_to_pct_of_mean"
  | "custom";

export interface Problem {
  id: string;                 // e.g. "2025-10-19"
  category: string;
  prompt: string;
  winType: WinType;
  config: {
    min?: number;
    max?: number;
    pctOfMean?: number;      // default 0.8
    sigmaWindow?: number;    // default 0.5 (half-σ on each side)
  } | Record<string, unknown>;
}

export type Answer = number | string | { optionId: string };
