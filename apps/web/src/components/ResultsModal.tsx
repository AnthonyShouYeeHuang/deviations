export function ResultsModal(props: {
  open: boolean;
  onClose: () => void;
  yesterdayId: string;
  problem: { category: string; prompt: string } | null;
  yourAnswer: unknown;
  youWon: boolean | null;
  aggregates: { total:number; average:number|null; stddev:number|null; counts:Array<{opt:string; n:number}> } | null;
}) {
  const { open, onClose, yesterdayId, problem, yourAnswer, youWon, aggregates } = props;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold">Yesterday's Results</h3>
          <button onClick={onClose} className="text-2xl leading-none px-2">×</button>
        </div>

        <div className="p-5 space-y-4">
          {youWon != null && (
            <div className={`rounded-lg px-4 py-2 ${youWon ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {youWon ? 'You won against the world! 🎉' : 'Not a win yesterday — try again today!'}
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h4 className="font-semibold mb-2">{problem?.category ?? "Yesterday’s Question"}</h4>
            <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">{problem?.prompt ?? "—"}</p>

            {yourAnswer != null && (
              <div className="mt-4 rounded-md bg-green-50 text-green-700 px-3 py-2 inline-block">
                You entered: <span className="font-semibold">{formatAnswer(yourAnswer)}</span>.
              </div>
            )}

            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              <WorldResults aggregates={aggregates}/>
            </div>
          </div>

          <p className="text-xs text-zinc-500">Day: {yesterdayId}</p>
        </div>
      </div>
    </div>
  );
}

function formatAnswer(a: unknown) {
  if (typeof a === 'number') return a.toString();
  if (typeof a === 'string') return a;
  if (a && typeof a === 'object' && 'optionId' in (a as any)) return (a as any).optionId;
  if (a && typeof a === 'object' && 'value' in (a as any)) return String((a as any).value);
  return '—';
}

function WorldResults({aggregates}:{aggregates: { total:number; average:number|null; stddev:number|null; counts:Array<{opt:string; n:number}> } | null}) {
  if (!aggregates) return <>No world results yet.</>;
  const top = (aggregates.counts ?? [])[0];
  return (
    <div className="space-y-1">
      <div>Total players: <b>{aggregates.total ?? 0}</b></div>
      {aggregates.average != null && <div>Average: <b>{Number(aggregates.average).toFixed(2)}</b></div>}
      {aggregates.stddev  != null && <div>Std dev: <b>{Number(aggregates.stddev).toFixed(2)}</b></div>}
      {top && top.opt && <div>Most common choice: <b>{top.opt}</b> ({top.n})</div>}
    </div>
  );
}
