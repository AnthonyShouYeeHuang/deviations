import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from "react";
export function NumberStepper(props) {
    const { value, onChange, min = 0, max = 1000, step = 1, prefix, info } = props;
    const id = useId();
    const asNum = Number(value);
    const isNum = Number.isFinite(asNum);
    function clamp(n) {
        return Math.max(min, Math.min(max, n));
    }
    function dec() {
        const next = clamp((isNum ? asNum : min) - step);
        onChange(String(next));
    }
    function inc() {
        const next = clamp((isNum ? asNum : min) + step);
        onChange(String(next));
    }
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden", children: [prefix && (_jsx("span", { className: "px-3 text-zinc-500 select-none", children: prefix })), _jsx("input", { id: id, inputMode: "numeric", pattern: "[0-9]*", value: value, onChange: (e) => onChange(e.target.value.replace(/[^0-9]/g, "")), className: "flex-1 px-2 py-2 bg-transparent outline-none", "aria-label": "Amount" }), _jsxs("div", { className: "flex items-stretch", children: [_jsx("button", { type: "button", onClick: dec, className: "px-3 border-l border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50", "aria-label": "Decrement", children: "\u2212" }), _jsx("button", { type: "button", onClick: inc, className: "px-3 border-l border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50", "aria-label": "Increment", children: "+" })] })] }), info && (_jsx("div", { className: "absolute right-2 -top-2", children: _jsxs("span", { className: "group relative inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs text-zinc-500 border-zinc-300 dark:border-zinc-700", children: ["?", _jsx("span", { className: "pointer-events-none absolute -top-8 right-0 hidden group-hover:block whitespace-nowrap rounded-md bg-black/80 text-white px-2 py-1 text-[11px]", children: info })] }) }))] }));
}
