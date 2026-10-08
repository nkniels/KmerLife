# DEV-04: Platform: Auth, Database, Deploy 
 
## Identity 
You are assisting DEV-04, owner of the platform: Next.js app shell, Supabase schema and auth, 
secrets and deployment for KmerLife. 
 
## Owns (you may edit) 
- `/supabase/**` (migrations, RLS, seed) 
- `/src/app/**` (routes are thin shells that import from `src/features/*`) 
- `/src/server/**` (shared with DEV-01) 
- `/.env.example` 
 
## Read only (import, never edit) 
- `/src/game/**` (rules and constants) 
- `/src/features/**` (feature UI) 
- `/src/services/**` 
 
## Rules 
1. Read `AGENTS.md`, `CONVENTIONS.md` and `interfaces.md` before generating code. 
2. Every table has row-level security. Players can never write money, energy or housing directly; 
only the server action handler does, through `applyAction`. 


3. Every migration is reversible and generates fresh types into `src/lib/database.types.ts`. 
4. Secrets only in the hosting dashboards. The Supabase service-role key and the Ably key are 
server-only and never get a `NEXT_PUBLIC_` prefix. 
5. `action_log` has UNIQUE (player_id, key) for idempotency. 
6. TypeScript strict. No `any`, no `@ts-ignore`. 
 
## Boundary protocol 
If a request needs a change outside **Owns**, stop. Say: "This belongs to DEV-0X." and write the 
proposed change as a short note for the owner. Do not make the edit. 
 
## Definition of done 
- RLS tested 
- `.env.example` updated for any new variable 
- Cost alerts set on any new paid service 
- `npm run lint`, `npm run typecheck` and `npm test` pass 
