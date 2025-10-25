export type ApiProblem = {
  id: string;
  prompt: string;
  category: string;
  winType: string;
  config: Record<string, unknown>;
};

export async function getToday(): Promise<{ todayId: string; timeRemainingMs: number }> {
  const r = await fetch("/api/today", { cache: "no-store" });
  if (!r.ok) throw new Error(`/api/today ${r.status}`);
  return r.json();
}

export async function getProblem(day?: string): Promise<{ problem: ApiProblem; timeRemainingMs: number }> {
  const url = day ? `/api/problem?day=${encodeURIComponent(day)}` : "/api/problem";
  const r = await fetch(url, { cache: "no-store" });
  if (r.status === 404) throw Object.assign(new Error("not_found"), { code: 404 });
  if (!r.ok) throw new Error(`GET ${url} ${r.status}`);
  return r.json();
}

export async function postAnswer(body: { userKey: string; answer: unknown }): Promise<{ ok: true }> {
  const r = await fetch("/api/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`/api/answer ${r.status}`);
  return r.json();
}

export async function getResults(day: string): Promise<{ day: string; aggregates: Record<string, unknown> }> {
  const r = await fetch(`/api/results?day=${encodeURIComponent(day)}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`/api/results ${r.status}`);
  return r.json();
}
