export type WinType = "below_mean" | "most_common_choice" | "closest_to_target" | "within_sd_below_mean" | "within_sd_above_mean" | "closest_to_pct_of_mean" | "custom";
export interface Problem {
    id: string;
    category: string;
    prompt: string;
    winType: WinType;
    config: {
        min?: number;
        max?: number;
        pctOfMean?: number;
        sigmaWindow?: number;
    } | Record<string, unknown>;
}
export type Answer = number | string | {
    optionId: string;
};
//# sourceMappingURL=types.d.ts.map