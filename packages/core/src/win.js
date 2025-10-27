"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = evaluate;
function evaluate(problem, yourAnswer, aggregates) {
    var _a, _b, _c, _d;
    switch (problem.winType) {
        case "below_mean": {
            var mean = aggregates.average;
            var val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;
            return { won: typeof mean === "number" && val < mean, detail: { val: val, mean: mean } };
        }
        case "most_common_choice": {
            var counts = (_a = aggregates.counts) !== null && _a !== void 0 ? _a : {};
            var top_1 = (_b = Object.entries(counts).sort(function (a, b) { return b[1] - a[1]; })[0]) === null || _b === void 0 ? void 0 : _b[0];
            var mine = typeof yourAnswer === "object" && yourAnswer && "optionId" in yourAnswer
                ? yourAnswer.optionId
                : undefined;
            return { won: !!top_1 && mine === top_1, detail: { mine: mine, top: top_1, counts: counts } };
        }
        case "closest_to_target": {
            var t = aggregates.target;
            var tol = (_c = aggregates.threshold) !== null && _c !== void 0 ? _c : 0;
            var val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;
            return {
                won: typeof t === "number" && Math.abs(val - t) <= tol,
                detail: { val: val, target: t, tol: tol }
            };
        }
        case "within_sd_below_mean": {
            var mean = aggregates.average; // reuse the existing field name
            var std = aggregates.stddev;
            var val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;
            // Rule: val must be < mean AND >= mean - stddev
            var ok = typeof mean === "number" &&
                typeof std === "number" &&
                Number.isFinite(val) &&
                val < mean &&
                val >= mean - std;
            return { won: ok, detail: { val: val, mean: mean, std: std, lowerBound: (typeof mean === "number" && typeof std === "number") ? mean - std : undefined }
            };
        }
        case "within_sd_above_mean": {
            var mean = aggregates.average; // reuse the existing field name
            var std = aggregates.stddev;
            var val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;
            // Rule: val must be < mean AND >= mean - stddev
            var ok = typeof mean === "number" &&
                typeof std === "number" &&
                Number.isFinite(val) &&
                val > mean &&
                val <= mean - std;
            return { won: ok, detail: { val: val, mean: mean, std: std, upperBound: (typeof mean === "number" && typeof std === "number") ? mean - std : undefined }
            };
        }
        case "closest_to_pct_of_mean": {
            // Aggregates expected: average (mean), stddev
            var mean = aggregates.average;
            var std = aggregates.stddev;
            // Read optional config; defaults: 80% target, ±0.5σ window
            var cfg = ((_d = problem.config) !== null && _d !== void 0 ? _d : {});
            var pct = typeof cfg.pctOfMean === "number" ? cfg.pctOfMean : 0.8;
            var halfSigma = typeof cfg.sigmaWindow === "number" ? cfg.sigmaWindow : 0.5;
            // User's value (numeric only for this rule)
            var val = typeof yourAnswer === "number" ? yourAnswer : Number.NaN;
            // Optional clamping to a range the problem defines (e.g., 0–1000)
            var inRange = (typeof cfg.min !== "number" || val >= cfg.min) &&
                (typeof cfg.max !== "number" || val <= cfg.max);
            if (typeof mean !== "number" ||
                typeof std !== "number" ||
                !Number.isFinite(val) ||
                !inRange) {
                return { won: false, detail: { val: val, mean: mean, std: std, inRange: inRange } };
            }
            var target = pct * mean;
            var lower = target - halfSigma * std;
            var upper = target + halfSigma * std;
            var won = val >= lower && val <= upper;
            return {
                won: won,
                detail: { val: val, mean: mean, std: std, target: target, lower: lower, upper: upper, pct: pct, halfSigma: halfSigma }
            };
        }
        default:
            return { won: false };
    }
}
