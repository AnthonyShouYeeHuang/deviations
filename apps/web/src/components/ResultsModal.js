"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsModal = ResultsModal;
function ResultsModal(props) {
    var _a, _b;
    var open = props.open, onClose = props.onClose, yesterdayId = props.yesterdayId, problem = props.problem, yourAnswer = props.yourAnswer, youWon = props.youWon, aggregates = props.aggregates;
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold">Yesterday's Results</h3>
          <button onClick={onClose} className="text-2xl leading-none px-2">×</button>
        </div>

        <div className="p-5 space-y-4">
          {youWon != null && (<div className={"rounded-lg px-4 py-2 ".concat(youWon ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
              {youWon ? 'You won against the world! 🎉' : 'Not a win yesterday — try again today!'}
            </div>)}

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h4 className="font-semibold mb-2">{(_a = problem === null || problem === void 0 ? void 0 : problem.category) !== null && _a !== void 0 ? _a : "Yesterday’s Question"}</h4>
            <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">{(_b = problem === null || problem === void 0 ? void 0 : problem.prompt) !== null && _b !== void 0 ? _b : "—"}</p>

            {yourAnswer != null && (<div className="mt-4 rounded-md bg-green-50 text-green-700 px-3 py-2 inline-block">
                You entered: <span className="font-semibold">{formatAnswer(yourAnswer)}</span>.
              </div>)}

            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              <WorldResults aggregates={aggregates}/>
            </div>
          </div>

          <p className="text-xs text-zinc-500">Day: {yesterdayId}</p>
        </div>
      </div>
    </div>);
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
function WorldResults(_a) {
    var _b, _c;
    var aggregates = _a.aggregates;
    if (!aggregates)
        return <>No world results yet.</>;
    var top = ((_b = aggregates.counts) !== null && _b !== void 0 ? _b : [])[0];
    return (<div className="space-y-1">
      <div>Total players: <b>{(_c = aggregates.total) !== null && _c !== void 0 ? _c : 0}</b></div>
      {aggregates.average != null && <div>Average: <b>{Number(aggregates.average).toFixed(2)}</b></div>}
      {aggregates.stddev != null && <div>Std dev: <b>{Number(aggregates.stddev).toFixed(2)}</b></div>}
      {top && top.opt && <div>Most common choice: <b>{top.opt}</b> ({top.n})</div>}
    </div>);
}
