import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function ResultsModal(props) {
    const { open, onClose, yesterdayId, problem, yourAnswer, youWon, aggregates } = props;
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4", children: _jsxs("div", { className: "w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Yesterday's Results" }), _jsx("button", { onClick: onClose, className: "text-2xl leading-none px-2", children: "\u00D7" })] }), _jsxs("div", { className: "p-5 space-y-4", children: [youWon != null && (_jsx("div", { className: `rounded-lg px-4 py-2 ${youWon ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`, children: youWon ? 'You won against the world! 🎉' : 'Not a win yesterday — try again today!' })), _jsxs("div", { className: "rounded-xl border border-zinc-200 dark:border-zinc-800 p-4", children: [_jsx("h4", { className: "font-semibold mb-2", children: problem?.category ?? "Yesterday’s Question" }), _jsx("p", { className: "whitespace-pre-line text-zinc-600 dark:text-zinc-400", children: problem?.prompt ?? "—" }), yourAnswer != null && (_jsxs("div", { className: "mt-4 rounded-md bg-green-50 text-green-700 px-3 py-2 inline-block", children: ["You entered: ", _jsx("span", { className: "font-semibold", children: formatAnswer(yourAnswer) }), "."] })), _jsx("div", { className: "mt-4 text-sm text-zinc-600 dark:text-zinc-400", children: _jsx(WorldResults, { aggregates: aggregates }) })] }), _jsxs("p", { className: "text-xs text-zinc-500", children: ["Day: ", yesterdayId] })] })] }) }));
}
function formatAnswer(a) {
    if (typeof a === 'number')
        return a.toString();
    if (typeof a === 'string')
        return a;
    if (a && typeof a === 'object' && 'optionId' in a)
        return a.optionId;
    if (a && typeof a === 'object' && 'value' in a)
        return String(a.value);
    return '—';
}
function WorldResults({ aggregates }) {
    if (!aggregates)
        return _jsx(_Fragment, { children: "No world results yet." });
    const top = (aggregates.counts ?? [])[0];
    return (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { children: ["Total players: ", _jsx("b", { children: aggregates.total ?? 0 })] }), aggregates.average != null && _jsxs("div", { children: ["Average: ", _jsx("b", { children: Number(aggregates.average).toFixed(2) })] }), aggregates.stddev != null && _jsxs("div", { children: ["Std dev: ", _jsx("b", { children: Number(aggregates.stddev).toFixed(2) })] }), top && top.opt && _jsxs("div", { children: ["Most common choice: ", _jsx("b", { children: top.opt }), " (", top.n, ")"] })] }));
}
