import { useEffect, useState } from "react";
import { evaluate, validateAnswer } from "@acme/core";
import { getToday, getResults } from "../lib/api";
export function useYesterdayResults() {
    const [state, setState] = useState({
        yesterdayId: "",
        problem: null,
        aggregates: null,
        yourAnswer: null,
        youWon: null,
        loading: true,
        error: null,
    });
    // helper to compute YYYY-MM-DD - 1 day from a YYYY-MM-DD string (server authoritative)
    function minusOneDay(id) {
        const d = new Date(id + "T00:00:00");
        d.setDate(d.getDate() - 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    const refetch = async () => {
        try {
            setState(s => ({ ...s, loading: true, error: null }));
            const today = await getToday(); // server NY today
            const yId = minusOneDay(today.todayId);
            const res = await getResults(yId); // { day, problem, aggregates }
            const { problem, aggregates } = res;
            // read your answer for yesterday from local storage
            let yourAnswer = null;
            const raw = localStorage.getItem(`answer:${yId}`);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    yourAnswer = parsed?.answer ?? null;
                }
                catch { }
            }
            // compute win using shared core logic
            let youWon = null;
            if (problem && yourAnswer != null && validateAnswer(yourAnswer)) {
                const detailAgg = {};
                if (aggregates?.average != null)
                    detailAgg.average = Number(aggregates.average);
                if (aggregates?.stddev != null)
                    detailAgg.stddev = Number(aggregates.stddev);
                if (Array.isArray(aggregates?.counts)) {
                    const map = {};
                    for (const { opt, n } of aggregates.counts)
                        map[opt] = n;
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
        }
        catch (e) {
            setState(s => ({ ...s, loading: false, error: String(e?.message || e) }));
        }
    };
    useEffect(() => { void refetch(); }, []);
    return [state, refetch];
}
