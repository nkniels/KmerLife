# KmerLife: Architecture 
 
## 1. Principles 
1. **Pure rules kernel.** All game rules live in `src/game/` as pure functions: `applyAction(state, 
action, now)` returns a new state and events. No I/O, no clock, no randomness. 
2. **Server-authoritative.** Only the server writes player state. Clients may predict, but the 
server's answer wins. 
3. **Lazy time.** Energy regeneration and rent are computed from timestamps when a player acts or 
loads. No tick loop is needed for them. 
4. **Idempotent actions.** Every action carries a client-generated UUID key. Repeating a key never 
repeats the effect. 
5. **Slow multiplayer.** Real-time is limited to presence, chat and events. Everything else 
refreshes on a slow cadence. 
6. **Vertical features.** Each developer owns a feature end to end (rules, UI, content). The shared 
kernel stays small and is owned by the lead. 
7. **Cheap by design.** Free tiers, small bundles, cost alerts. Built for 3G and low-end Android. 
 
## 2. Layers 
``` 
Browser (Next.js, Zustand, local prediction with src/game) 
   |  POST /api/game  { action }              ^  realtime: presence, chat, events 
   v                                          | 
Server  src/server/handle-action.ts  --  applyAction (src/game)  --  Postgres (Supabase) 
``` 
 
## 3. One action, step by step 
1. The client creates a UUID `key` and POSTs the action. 
2. The server authenticates the player. 
3. It opens a transaction and selects the player row `FOR UPDATE`. 
4. If `action_log` already holds (player, key), it returns the stored result and stops. 
5. It calls `applyAction(state, action, Date.now())`, using the server clock only. 
6. On success it updates the player row (checking `version`), inserts `action_log` with the result, 
and inserts `transactions` rows for FCFA changes. 
7. It commits and returns the new state and events. 
8. If relevant, it publishes a realtime event. 
 
## 4. Data model (outline) 
All money columns are `bigint` FCFA. The kernel uses epoch milliseconds; the database uses 
`timestamptz`; a mapper in `src/server/` converts. 
 
| Table | Key columns | 
|-------|-------------| 
| characters | id, user_id (unique), name, origin, city, fcfa, energy numeric(5,2), job_id, 
housing_tier, rent_arrears_fcfa, next_rent_due_at, last_accrued_at, season_id, version, created_at 
| 
| action_log | id, player_id, key, action jsonb, result jsonb, created_at, UNIQUE (player_id, key) 
| 


| transactions | id, player_id, delta_fcfa, reason, season_id, created_at | 
| world_state | city, key, value jsonb, updated_at | 
| njangi_groups, njangi_members, njangi_rounds | Added in week 5 | 
| echo_recordings | Added in week 5 | 
 
Row-level security on every table: a player reads only their own rows; nothing in the browser can 
write money, energy or housing. 
 
## 5. Realtime 
- Channels: `city:{city}`, `venue:{venueId}`, and a private `player:{id}`. 
- The browser gets a scoped token from `/api/ably-token`; the provider API key never leaves the 
server. 
- All access goes through the `RealtimeTransport` interface in `interfaces.md`. 
 
## 6. Scheduled work 
Only for world events, season changes, reminders and cleanup. Use Supabase `pg_cron` or Vercel Cron 
(check current plan limits). Every job is idempotent. 
 
## 7. Security 
- Validate every request with the zod schemas in `src/game/schemas.ts`. 
- Rate-limit per player. 
- Service-role and provider keys are server-only; `.env` is never committed. 
- Secrets scanning enabled on the repository. 
- Automated tests prove one player cannot read or write another's data. 
 
## 8. Environments 
Local, Preview (one per pull request), Production. Variables are listed in `.env.example`. 
 
## 9. Testing 
- Unit tests for the kernel (`tests/game/`), including purity and idempotency. 
- Property tests (week 1) for money and energy invariants. 
- API tests for the action handler, including concurrent calls with the same key. 
- RLS tests in CI against a local Supabase. 
- The economy simulator runs as a smoke test in CI. 
 
## 10. Performance and cost guardrails 
- Initial JavaScript budget: aim under 150 KB gzipped; images lazy-loaded and small. 
- Realtime message volume is monitored; alerts on every paid service. 
- Offline-tolerant UI: queue actions and replay with the same keys. 
 
## 11. Decision records 
- **ADR-0001 Pure kernel.** Rules are pure functions shared by server, client and simulator. This 
makes them testable, predictable and safe for AI-assisted development. 
- **ADR-0002 Realtime provider.** Ably is the team's choice and is the default, behind 
`RealtimeTransport`. Supabase Realtime is the documented alternative if cost or complexity argues 
for it. 
- **ADR-0003 Reminders.** PWA web push plus a Telegram bot (free) rather than WhatsApp Business API 
(paid). 
- **ADR-0004 Seasons.** The economy resets about every 90 days to control inflation and give late 
joiners a fair start. 
