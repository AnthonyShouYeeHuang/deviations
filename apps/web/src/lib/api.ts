const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, ""); // trim trailing slash

function apiUrl(path: string) {
  return `${API}${path}`; // if API="", this becomes a relative "/api/..."
}

export async function getToday() {
  const r = await fetch(apiUrl("/api/today"), { cache: "no-store" });
  if (!r.ok) throw new Error(`/api/today ${r.status}`);
  return r.json();
}

export async function getProblem(day?: string) {
  const url = day ? apiUrl(`/api/problem?day=${encodeURIComponent(day)}`) : apiUrl("/api/problem");
  const r = await fetch(url, { cache: "no-store" });
  if (r.status === 404) throw Object.assign(new Error("not_found"), { code: 404 });
  if (!r.ok) throw new Error(`GET ${url} ${r.status}`);
  return r.json();
}

export async function postAnswer(body: { userKey: string; answer: unknown }) {
  const r = await fetch(apiUrl("/api/answer"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(`/api/answer ${r.status}`);
  return r.json();
}

export async function getResults(day: string) {
  const r = await fetch(apiUrl(`/api/results?day=${encodeURIComponent(day)}`), { cache: "no-store" });
  if (!r.ok) throw new Error(`/api/results ${r.status}`);
  return r.json();
}