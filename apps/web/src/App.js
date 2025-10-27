import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { deviceKey, validateAnswer } from "@acme/core";
import { useDevDay } from "./useDevDay";
import { NumberStepper } from "./components/NumberStepper";
import { getToday, getProblem, postAnswer } from "./lib/api";
import { ResultsModal } from "./components/ResultsModal";
import { useYesterdayResults } from "./hooks/useYesterdayResults";
export default function App() {
    const { dayId, setDayId, nextDay, prevDay, clearOverride, isOverridden, source } = useDevDay();
    // server data
    const [todayId, setTodayId] = useState("");
    const [, setTimeRemainingMs] = useState(0);
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    // input state
    const [text, setText] = useState("");
    const [choice, setChoice] = useState("");
    const [submitted, setSubmitted] = useState(false);
    // Results state (modal + data)
    const [yData, refetchY] = useYesterdayResults();
    const [showResults, setShowResults] = useState(false);
    // Auto-open the results modal once per day (after we know yesterdayId)
    useEffect(() => {
        if (!yData.loading && !yData.error && yData.yesterdayId) {
            const flagKey = `seenResults:${yData.yesterdayId}`;
            if (!localStorage.getItem(flagKey)) {
                setShowResults(true);
                localStorage.setItem(flagKey, "1");
            }
        }
    }, [yData.loading, yData.error, yData.yesterdayId]);
    // fetch today + problem whenever dayId changes (dev picker lets you test past/future)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setErr("");
                // Get authoritative today + countdown (NY)
                const t = await getToday();
                if (cancelled)
                    return;
                setTodayId(t.todayId);
                setTimeRemainingMs(t.timeRemainingMs);
                // If you want to always show the server's "today", call getProblem()
                // without the day param. For dev testing of other days, we allow ?day=...
                const p = await getProblem(isOverridden ? dayId : undefined);
                if (cancelled)
                    return;
                setProblem(p.problem);
                setTimeRemainingMs(p.timeRemainingMs);
                // check local submission flag per day
                setSubmitted(!!localStorage.getItem(`answer:${isOverridden ? dayId : t.todayId}`));
                setText("");
                setChoice("");
            }
            catch (e) {
                if (cancelled)
                    return;
                if (e?.code === 404) {
                    setErr(`No problem found for day ${isOverridden ? dayId : "today"}. Seed the DB row.`);
                }
                else {
                    setErr(String(e?.message || e));
                }
                setProblem(null);
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [dayId, isOverridden]);
    const isNumeric = useMemo(() => problem?.winType !== "most_common_choice", [problem]);
    function currentAnswer() {
        if (!problem)
            return null;
        if (problem.winType === "most_common_choice") {
            return choice ? { optionId: choice } : null;
        }
        const raw = text.trim();
        if (!raw)
            return null;
        const asNum = Number(raw);
        return Number.isFinite(asNum) && raw !== "" ? asNum : raw;
    }
    async function submit() {
        if (!problem)
            return;
        const ans = currentAnswer();
        if (ans == null || !validateAnswer(ans))
            return;
        // persist locally (useful for UX)
        const dayKey = isOverridden ? dayId : todayId || problem.id;
        localStorage.setItem(`answer:${dayKey}`, JSON.stringify({ userKey: deviceKey(), problemId: problem.id, answer: ans }));
        // send to server
        await postAnswer({ userKey: deviceKey(), answer: ans });
        setSubmitted(true);
    }
    return (_jsxs("div", { className: "min-h-full", children: [_jsx("div", { className: "h-12" }), _jsxs("main", { className: "mx-auto w-full max-w-3xl px-4", children: [err && (_jsx("div", { className: "mx-auto mb-4 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700", children: err })), !err && loading && (_jsx("div", { className: "mx-auto mb-4 max-w-xl rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600", children: "Loading\u2026" })), _jsx("div", { className: "mx-auto mb-6 w-full max-w-xl", children: _jsx("div", { className: "rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200 px-4 py-2 text-center text-sm font-medium", children: todayId ? `New York day: ${todayId}` : "Welcome back player!" }) }), _jsx("h1", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-center text-zinc-800 dark:text-zinc-100", children: "Deviations" }), _jsx("div", { className: "mx-auto my-4 w-full max-w-xl", children: _jsx("button", { className: "w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300", onClick: () => { setShowResults(true); refetchY(); }, children: "Yesterday\u2019s Results" }) }), _jsxs("div", { className: "mx-auto w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]", children: [_jsx("h2", { className: "text-xl font-semibold text-center mb-3 text-zinc-800 dark:text-zinc-100", children: problem?.category || "Today's Problem" }), _jsx("p", { className: "text-center text-zinc-600 dark:text-zinc-400 whitespace-pre-line", children: problem?.prompt || "—" }), _jsx("div", { className: "mt-6", children: isNumeric ? (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm text-zinc-600 dark:text-zinc-400", children: "Your answer:" }), _jsx(NumberStepper, { value: text, onChange: setText, min: 0, max: 1000000, step: 1, prefix: "$", info: "Numbers only" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2", children: ((problem?.config?.options) ?? []).map((opt) => (_jsxs("label", { className: `cursor-pointer rounded-lg border px-3 py-2 text-center ${choice === opt.id
                                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                                            : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`, children: [_jsx("input", { type: "radio", name: "opt", value: opt.id, checked: choice === opt.id, onChange: () => setChoice(opt.id), className: "hidden" }), opt.label] }, opt.id))) })) }), _jsx("div", { className: "mt-6", children: !submitted ? (_jsx("button", { onClick: submit, disabled: !problem, className: "w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5", children: "Submit" })) : (_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "text-green-600 dark:text-green-400 font-medium", children: "Submitted for this day \u2705" }) })) })] }), import.meta.env.DEV && (_jsxs("div", { className: "mx-auto mt-6 w-full max-w-xl rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-3 text-sm flex items-center gap-2 bg-white/70 dark:bg-zinc-900/70", children: [_jsx("button", { onClick: prevDay, className: "px-2.5 py-1 rounded-md border bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80", children: "\u25C0 Prev" }), _jsx("input", { value: dayId, onChange: (e) => setDayId(e.target.value), className: "px-2 py-1 rounded-md border bg-white dark:bg-zinc-800 w-[140px] font-mono", title: "YYYY-MM-DD" }), _jsx("button", { onClick: nextDay, className: "px-2.5 py-1 rounded-md border bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80", children: "Next \u25B6" }), _jsx("button", { onClick: clearOverride, className: "px-2.5 py-1 rounded-md border bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80", children: "Clear" }), _jsx("span", { className: "ml-auto text-zinc-500", children: isOverridden ? `DEV override (${source})` : "system date" })] })), _jsx(ResultsModal, { open: showResults, onClose: () => setShowResults(false), yesterdayId: yData.yesterdayId, problem: yData.problem ? { category: yData.problem.category, prompt: yData.problem.prompt } : null, yourAnswer: yData.yourAnswer, youWon: yData.youWon, aggregates: yData.aggregates }), _jsx("div", { className: "h-12" })] })] }));
}
