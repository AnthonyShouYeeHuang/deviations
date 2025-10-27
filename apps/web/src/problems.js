export const PROBLEMS = [
    {
        id: "sample-1",
        category: "The Greed Line",
        prompt: "Pick any dollar amount — from $0 to as high as you want.\nYou only win if you’re below the average—\nbut not too far below.\nFind the sweet spot and cash in.",
        winType: "within_sd_below_mean",
        config: {}
    },
    {
        id: "sample-2",
        category: "Common Sense",
        prompt: "Which pet would most people choose today?",
        winType: "most_common_choice",
        config: {
            options: [
                { id: "dog", label: "Dog" },
                { id: "cat", label: "Cat" },
                { id: "fish", label: "Fish" }
            ]
        }
    },
    {
        id: "sample-3",
        category: "Hide and Seek",
        prompt: "Guess the hidden target (0–100). Closest wins (±2).",
        winType: "closest_to_target",
        config: { min: 0, max: 100, threshold: 2 }
    },
    {
        id: "sample-4",
        category: "The Fine Line",
        prompt: `Pick a number (0–1000).\nYou only win if your answer is close to 80% of today's average.`,
        winType: "closest_to_pct_of_mean",
        config: { min: 0, max: 1000, pctOfMean: 0.8, sigmaWindow: 0.5 }
    },
    {
        id: "sample-5",
        category: "The Fine Line",
        prompt: `Pick a number (0–100).\nYou only win if your answer is close to 120% of today's average.`,
        winType: "closest_to_pct_of_mean",
        config: { min: 0, max: 1000, pctOfMean: 1.2, sigmaWindow: 0.5 }
    },
    {
        id: "sample-6",
        category: "The Greed Line",
        prompt: "Pick any dollar amount — from $0 to as high as you want.\nYou only win if you’re above the average—\nbut not too far above.\nFind the sweet spot and cash in.",
        winType: "within_sd_above_mean",
        config: {}
    },
];
// pick an item “by date” deterministically (placeholder)
export function pickTodayProblem(todayId) {
    const idx = Math.abs(Math.imul(hash(todayId), 2654435761)) % PROBLEMS.length;
    return PROBLEMS[idx];
}
function hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++)
        h = (h * 31 + s.charCodeAt(i)) | 0;
    return h | 0;
}
