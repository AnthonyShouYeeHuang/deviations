import { useEffect, useState } from "react";
import { evaluate, type Answer, validateAnswer } from "@acme/core";
import { getToday, getResults } from "../lib/api";

export type YesterdayData = {
  yesterdayId: string;
  problem: {
    id: string; category: string; prompt: string; winType: string; config: Record<string,unknown>;
  } | null;
  aggregates: { total:number; average:number|null; stddev:number|null; counts: Array<{opt:string; n:number}> } | null;
  yourAnswer: Answer | null;
  youWon: boolean | null;
  loading: boolean;
  error: string | null;
};

export function useYesterdayResults(): [YesterdayData, () => void] {
  const [state, setState] = useState<YesterdayData>({
    yesterdayId: "",
    problem: null,
    aggregates: null,
    yourAnswer: null,
    youWon: null,
    loading: true,
    error: null,
  });

  // helper to compute YYYY-MM-DD - 1 day from a YYYY-MM-DD string (server authoritative)
  function minusOneDay(id: string) {
    const d = new Date(id + "T00:00:00");
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  const refetch = async () => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      const today = await getToday();                              // server NY today
      const yId = minusOneDay(today.todayId);
      const res = await getResults(yId);                           // { day, problem, aggregates }
      const { problem, aggregates } = res as any;

      // read your answer for yesterday from local storage
      let yourAnswer: Answer | null = null;
      const raw = localStorage.getItem(`answer:${yId}`);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          yourAnswer = parsed?.answer ?? null;
        } catch {}
      }

      // compute win using shared core logic
      let youWon: boolean | null = null;
      if (problem && yourAnswer != null && validateAnswer(yourAnswer)) {
        const detailAgg: Record<string, unknown> = {};
        if (aggregates?.average != null) detailAgg.average = Number(aggregates.average);
        if (aggregates?.stddev  != null) detailAgg.stddev  = Number(aggregates.stddev);
        if (Array.isArray(aggregates?.counts)) {
          const map: Record<string, number> = {};
          for (const {opt, n} of aggregates.counts) map[opt] = n;
          detailAgg.counts = map;
        }
        const resEval = evaluate(problem, yourAnswer, detailAgg);
        youWon = !!resEval.won;
      }

      setState({
        yesterdayId: yId,
        problem,
        aggregates,
        yourAnswer,
        youWon,
        loading: false,
        error: null
      });
    } catch (e:any) {
      setState(s => ({ ...s, loading: false, error: String(e?.message || e) }));
    }
  };

  useEffect(() => { void refetch(); }, []);

  return [state, refetch];
}
