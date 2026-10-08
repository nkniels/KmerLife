# KmerLife: Roadmap 
 
Six weeks from empty repo to a campus pilot. Every week must end in something playable. 
 
## Week 1: Foundations 
| Issue | Owner | 
|-------|-------| 
| Scaffold Next.js (App Router) into the existing repo | DEV-04 | 
| Supabase project, migrations and RLS | DEV-04 | 
| Auth and create-character endpoint | DEV-04 | 
| Server action handler: lock, reduce, persist | DEV-01 | 
| Character creation UI (FR/EN) | DEV-02 | 
| Dashboard: balance, energy, job picker, work button | DEV-02 | 
| Kernel hardening: property tests | DEV-01 | 
 
## Week 2: Economy and Content 
| Issue | Owner | 
|-------|-------| 
| Economy simulator v2 and tuning pass | DEV-01 | 
| Design and add money sinks: transport, living costs, upgrades | DEV-01 | 
| Housing UI and rent arrears flow | DEV-02 | 
| Venue content schema and eight Yaoundé venues | DEV-03 | 
| Event content schema and first ten radio trottoir rumors | DEV-06 | 
 
## Week 3: City and Deploy 
| Issue | Owner | 
|-------|-------| 
| City map UI | DEV-03 | 
| Travel module: on foot, benskin, taxi, car | DEV-03 | 
| Deploy: Vercel plus Supabase, preview environments | DEV-04 | 
 
## Week 4: Multiplayer 
| Issue | Owner | 
|-------|-------| 
| Ably token endpoint and venue presence | DEV-05 | 
| City chat with report and mute | DEV-05 | 
| Offline action queue with retry | DEV-05 | 
| Reminders: Telegram bot and web push | DEV-05 | 
 
## Week 5: Culture and Pilot Prep 
| Issue | Owner | 
|-------|-------| 
| Njangi module | DEV-05 | 
| Radio trottoir events engine and Eneo power cuts | DEV-06 | 
| Echoes: record and replay | DEV-06 | 


| Pilot readiness: analytics, flags, privacy notice | DEV-01 | 
 
## Week 6: Pilot 
| Issue | Owner | 
|-------|-------| 
| Run the campus pilot and review the data | DEV-01 | 
| Season 0 reset tooling | DEV-06 | 
| Security review: RLS tests and secrets audit | DEV-04 | 
 
## Definition of done for the pilot 
- A new player can sign up, create a character, work, eat, pay rent, chat in a venue and receive a 
reminder. 
- The economy simulator shows healthy targets (see `docs/ECONOMY.md`). 
- RLS and idempotency tests are green in CI. 
- Privacy notice published in French and English. 
 
## Risks 
| Risk | Mitigation | 
|------|------------| 
| No players | Closed campus pilot, echoes, seasons | 
| Team burnout and exams | Shippable weeks; two people know every module | 
| Scope creep | MVP scope table in `docs/GAME_DESIGN.md` is the contract | 
| Exploits | Row lock, idempotency keys, zod validation, ledger, rate limits | 
| Cost spikes | Free tiers, alerts, small bundles | 
