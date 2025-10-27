"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_1 = require("react");
var core_1 = require("@acme/core");
var useDevDay_1 = require("./useDevDay");
var NumberStepper_1 = require("./components/NumberStepper");
var api_1 = require("./lib/api");
var ResultsModal_1 = require("./components/ResultsModal");
var useYesterdayResults_1 = require("./hooks/useYesterdayResults");
function App() {
    var _this = this;
    var _a, _b;
    var _c = (0, useDevDay_1.useDevDay)(), dayId = _c.dayId, setDayId = _c.setDayId, nextDay = _c.nextDay, prevDay = _c.prevDay, clearOverride = _c.clearOverride, isOverridden = _c.isOverridden, source = _c.source;
    // server data
    var _d = (0, react_1.useState)(""), todayId = _d[0], setTodayId = _d[1];
    var _e = (0, react_1.useState)(0), setTimeRemainingMs = _e[1];
    var _f = (0, react_1.useState)(null), problem = _f[0], setProblem = _f[1];
    var _g = (0, react_1.useState)(true), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_1.useState)(""), err = _h[0], setErr = _h[1];
    // input state
    var _j = (0, react_1.useState)(""), text = _j[0], setText = _j[1];
    var _k = (0, react_1.useState)(""), choice = _k[0], setChoice = _k[1];
    var _l = (0, react_1.useState)(false), submitted = _l[0], setSubmitted = _l[1];
    // Results state (modal + data)
    var _m = (0, useYesterdayResults_1.useYesterdayResults)(), yData = _m[0], refetchY = _m[1];
    var _o = (0, react_1.useState)(false), showResults = _o[0], setShowResults = _o[1];
    // Auto-open the results modal once per day (after we know yesterdayId)
    (0, react_1.useEffect)(function () {
        if (!yData.loading && !yData.error && yData.yesterdayId) {
            var flagKey = "seenResults:".concat(yData.yesterdayId);
            if (!localStorage.getItem(flagKey)) {
                setShowResults(true);
                localStorage.setItem(flagKey, "1");
            }
        }
    }, [yData.loading, yData.error, yData.yesterdayId]);
    // fetch today + problem whenever dayId changes (dev picker lets you test past/future)
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var t, p, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        setLoading(true);
                        setErr("");
                        return [4 /*yield*/, (0, api_1.getToday)()];
                    case 1:
                        t = _a.sent();
                        if (cancelled)
                            return [2 /*return*/];
                        setTodayId(t.todayId);
                        setTimeRemainingMs(t.timeRemainingMs);
                        return [4 /*yield*/, (0, api_1.getProblem)(isOverridden ? dayId : undefined)];
                    case 2:
                        p = _a.sent();
                        if (cancelled)
                            return [2 /*return*/];
                        setProblem(p.problem);
                        setTimeRemainingMs(p.timeRemainingMs);
                        // check local submission flag per day
                        setSubmitted(!!localStorage.getItem("answer:".concat(isOverridden ? dayId : t.todayId)));
                        setText("");
                        setChoice("");
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        if (cancelled)
                            return [2 /*return*/];
                        if ((e_1 === null || e_1 === void 0 ? void 0 : e_1.code) === 404) {
                            setErr("No problem found for day ".concat(isOverridden ? dayId : "today", ". Seed the DB row."));
                        }
                        else {
                            setErr(String((e_1 === null || e_1 === void 0 ? void 0 : e_1.message) || e_1));
                        }
                        setProblem(null);
                        return [3 /*break*/, 5];
                    case 4:
                        if (!cancelled)
                            setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
        return function () { cancelled = true; };
    }, [dayId, isOverridden]);
    var isNumeric = (0, react_1.useMemo)(function () { return (problem === null || problem === void 0 ? void 0 : problem.winType) !== "most_common_choice"; }, [problem]);
    function currentAnswer() {
        if (!problem)
            return null;
        if (problem.winType === "most_common_choice") {
            return choice ? { optionId: choice } : null;
        }
        var raw = text.trim();
        if (!raw)
            return null;
        var asNum = Number(raw);
        return Number.isFinite(asNum) && raw !== "" ? asNum : raw;
    }
    function submit() {
        return __awaiter(this, void 0, void 0, function () {
            var ans, dayKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!problem)
                            return [2 /*return*/];
                        ans = currentAnswer();
                        if (ans == null || !(0, core_1.validateAnswer)(ans))
                            return [2 /*return*/];
                        dayKey = isOverridden ? dayId : todayId || problem.id;
                        localStorage.setItem("answer:".concat(dayKey), JSON.stringify({ userKey: (0, core_1.deviceKey)(), problemId: problem.id, answer: ans }));
                        // send to server
                        return [4 /*yield*/, (0, api_1.postAnswer)({ userKey: (0, core_1.deviceKey)(), answer: ans })];
                    case 1:
                        // send to server
                        _a.sent();
                        setSubmitted(true);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<div className="min-h-full">
      <div className="h-12"/>
      <main className="mx-auto w-full max-w-3xl px-4">
        {/* Info / errors */}
        {err && (<div className="mx-auto mb-4 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {err}
          </div>)}
        {!err && loading && (<div className="mx-auto mb-4 max-w-xl rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">
            Loading…
          </div>)}

        {/* Welcome pill */}
        <div className="mx-auto mb-6 w-full max-w-xl">
          <div className="rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200 px-4 py-2 text-center text-sm font-medium">
            {todayId ? "New York day: ".concat(todayId) : "Welcome back player!"}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center text-zinc-800 dark:text-zinc-100">
          Deviations
        </h1>

        {/* Yesterday’s Results */}
        <div className="mx-auto my-4 w-full max-w-xl">
          <button className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300" onClick={function () { setShowResults(true); refetchY(); }}>
            Yesterday’s Results
          </button>
        </div>

        {/* Card */}
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <h2 className="text-xl font-semibold text-center mb-3 text-zinc-800 dark:text-zinc-100">
            {(problem === null || problem === void 0 ? void 0 : problem.category) || "Today's Problem"}
          </h2>

          <p className="text-center text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
            {(problem === null || problem === void 0 ? void 0 : problem.prompt) || "—"}
          </p>

          {/* Input */}
          <div className="mt-6">
            {isNumeric ? (<div className="space-y-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">Your answer:</label>
                <NumberStepper_1.NumberStepper value={text} onChange={setText} min={0} max={1000000} step={1} prefix="$" info="Numbers only"/>
              </div>) : (<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {((_b = ((_a = problem === null || problem === void 0 ? void 0 : problem.config) === null || _a === void 0 ? void 0 : _a.options)) !== null && _b !== void 0 ? _b : []).map(function (opt) { return (<label key={opt.id} className={"cursor-pointer rounded-lg border px-3 py-2 text-center ".concat(choice === opt.id
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800")}>
                    <input type="radio" name="opt" value={opt.id} checked={choice === opt.id} onChange={function () { return setChoice(opt.id); }} className="hidden"/>
                    {opt.label}
                  </label>); })}
              </div>)}
          </div>

          {/* Submit */}
          <div className="mt-6">
            {!submitted ? (<button onClick={submit} disabled={!problem} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5">
                Submit
              </button>) : (<div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Submitted for this day ✅
                </span>
              </div>)}
          </div>
        </div>

        {/* Dev toolbar (only in dev) */}
        {import.meta.env.DEV && (<div className="mx-auto mt-6 w-full max-w-xl rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-3 text-sm flex items-center gap-2 bg-white/70 dark:bg-zinc-900/70">
            <button onClick={prevDay} className="px-2.5 py-1 rounded-md border bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80">◀ Prev</button>
            <input value={dayId} onChange={function (e) { return setDayId(e.target.value); }} className="px-2 py-1 rounded-md border bg-white dark:bg-zinc-800 w-[140px] font-mono" title="YYYY-MM-DD"/>
            <button onClick={nextDay} className="px-2.5 py-1 rounded-md border bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80">Next ▶</button>
            <button onClick={clearOverride} className="px-2.5 py-1 rounded-md border bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80">Clear</button>
            <span className="ml-auto text-zinc-500">{isOverridden ? "DEV override (".concat(source, ")") : "system date"}</span>
          </div>)}

        {/* Results Modal */}
        <ResultsModal_1.ResultsModal open={showResults} onClose={function () { return setShowResults(false); }} yesterdayId={yData.yesterdayId} problem={yData.problem ? { category: yData.problem.category, prompt: yData.problem.prompt } : null} yourAnswer={yData.yourAnswer} youWon={yData.youWon} aggregates={yData.aggregates}/>

        <div className="h-12"/>
      </main>
    </div>);
}
