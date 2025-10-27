"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberStepper = NumberStepper;
var react_1 = require("react");
function NumberStepper(props) {
    var value = props.value, onChange = props.onChange, _a = props.min, min = _a === void 0 ? 0 : _a, _b = props.max, max = _b === void 0 ? 1000 : _b, _c = props.step, step = _c === void 0 ? 1 : _c, prefix = props.prefix, info = props.info;
    var id = (0, react_1.useId)();
    var asNum = Number(value);
    var isNum = Number.isFinite(asNum);
    function clamp(n) {
        return Math.max(min, Math.min(max, n));
    }
    function dec() {
        var next = clamp((isNum ? asNum : min) - step);
        onChange(String(next));
    }
    function inc() {
        var next = clamp((isNum ? asNum : min) + step);
        onChange(String(next));
    }
    return (<div className="relative">
      <div className="flex items-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
        {prefix && (<span className="px-3 text-zinc-500 select-none">{prefix}</span>)}
        <input id={id} inputMode="numeric" pattern="[0-9]*" value={value} onChange={function (e) { return onChange(e.target.value.replace(/[^0-9]/g, "")); }} className="flex-1 px-2 py-2 bg-transparent outline-none" aria-label="Amount"/>
        <div className="flex items-stretch">
          <button type="button" onClick={dec} className="px-3 border-l border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50" aria-label="Decrement">−</button>
          <button type="button" onClick={inc} className="px-3 border-l border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50" aria-label="Increment">+</button>
        </div>
      </div>
      {info && (<div className="absolute right-2 -top-2">
          <span className="group relative inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs text-zinc-500 border-zinc-300 dark:border-zinc-700">
            ?
            <span className="pointer-events-none absolute -top-8 right-0 hidden group-hover:block whitespace-nowrap rounded-md bg-black/80 text-white px-2 py-1 text-[11px]">
              {info}
            </span>
          </span>
        </div>)}
    </div>);
}
