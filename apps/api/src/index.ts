import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { DateTime } from 'luxon'

// ---- helpers: NY date + next midnight
function nyDate(d = new Date()) {
  return DateTime.fromJSDate(d, { zone: 'America/New_York' }).toFormat('yyyy-LL-dd')
}
function msUntilNextNyMidnight(d = new Date()) {
  const now = DateTime.fromJSDate(d, { zone: 'America/New_York' })
  const next = now.plus({ days: 1 }).startOf('day')
  return next.toMillis() - now.toMillis()
}

type Bindings = {
  DATABASE_URL: string  // set in CF env if using Neon; or SUPABASE_URL/SUPABASE_ANON_KEY if using Supabase
}

const app = new Hono<{ Bindings: Bindings }>()
app.use('*', cors())

// GET /api/today
app.get('/api/today', (c) => {
  return c.json({ todayId: nyDate(), timeRemainingMs: msUntilNextNyMidnight() })
})

app.get('/api/health', (c) => c.json({ ok: true }));

// --- Choose ONE backend style ---

// 1) If using **Neon Postgres** (direct SQL over fetch):
// pnpm add -w @neondatabase/serverless
import { neon } from '@neondatabase/serverless'

// GET /api/problem
app.get('/api/problem', async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const day = c.req.query('day') || nyDate();  // ⬅️ allow override
  const rows = await sql/*sql*/`
    select id, prompt, category, win_type as "winType", config
    from problems where id = ${day} limit 1;`;
  if (!rows.length) return c.json({ error: 'not_found', day }, 404);
  return c.json({ problem: rows[0], timeRemainingMs: msUntilNextNyMidnight() });
});

app.post('/api/answer', async (c) => {
  const { userKey, answer } = await c.req.json()
  if (!userKey || String(userKey).length < 8) return c.json({ error: 'bad_userKey' }, 400)
  const sql = neon(c.env.DATABASE_URL)
  const pid = nyDate()
  await sql/*sql*/`
    insert into answers (problem_id, user_key, answer_json)
    values (${pid}, ${userKey}, ${JSON.stringify(answer)}::jsonb)
    on conflict (problem_id, user_key) do update
      set answer_json = excluded.answer_json;`
  return c.json({ ok: true })
})

app.get('/api/results', async (c) => {
  const dbUrl = c.env.DATABASE_URL
  if (!dbUrl) return c.json({ error: 'missing_DATABASE_URL' }, 500)

  const sql = neon(dbUrl)
  const day = c.req.query('day') || nyDate(DateTime.now().minus({ days: 1 }).toJSDate())

  try {
    // fetch problem first (to know winType)
    const probs = await sql/*sql*/`
      select id, prompt, category, win_type as "winType", config
      from problems where id = ${day} limit 1;`
    if (!probs.length) return c.json({ error: 'not_found', day }, 404)
    const problem = probs[0]

    // numeric expression helper
    const numExpr = sql/*sql*/`
      case
        when jsonb_typeof(answer_json->'value') = 'number' then (answer_json->>'value')::numeric
        when jsonb_typeof(answer_json)         = 'number' then (answer_json)::numeric
        else null
      end`

    // aggregates common to multiple types
    const [aggRow] = await sql/*sql*/`
      select
        count(*)::int as total,
        avg(${numExpr})      as average,
        stddev_samp(${numExpr}) as stddev
      from answers
      where problem_id = ${day};`

    // choice counts (for most_common_choice)
    const counts = await sql/*sql*/`
      select coalesce(answer_json->>'optionId','') as opt, count(*)::int as n
      from answers
      where problem_id = ${day}
      group by 1
      order by n desc;`

    return c.json({
      day,
      problem,
      aggregates: {
        total: aggRow?.total ?? 0,
        average: aggRow?.average,          // number | null
        stddev: aggRow?.stddev,            // number | null
        counts                              // [{opt, n}, ...]
      }
    })
  } catch (e) {
    console.error('SQL error /api/results:', e)
    return c.json({ error: 'sql_error', detail: String(e) }, 500)
  }
})

export default app
