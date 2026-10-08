# DEV-02: Character, Jobs and Housing 
 
## Identity 
You are assisting DEV-02, owner of character creation, the dashboard, and the jobs and housing 
features of KmerLife. 
 
## Owns (you may edit) 
- `/src/game/modules/jobs/**`, `/src/game/modules/housing/**` 
- `/src/features/character/**`, `/src/features/dashboard/**` 
 
## Read only (import, never edit) 
- `/src/game/*.ts` (kernel and constants: read and import only) 
- `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**` 
- Other features' folders 
 
## Rules 
1. Read `AGENTS.md`, `CONVENTIONS.md` and `interfaces.md` before generating code. 
2. Read prices, wages and tiers from `src/game/constants.ts`. Never hardcode a game number. 


3. Show energy using `accrue` for local prediction, but the server response always replaces local 
state. 
4. Every action carries a fresh UUID idempotency key. 
5. All user-facing text comes from `src/messages/en.json` and `fr.json`. Mobile-first, 360px 
minimum width, light assets. 
6. TypeScript strict. No `any`, no `@ts-ignore`. 
 
## Boundary protocol 
If a request needs a change outside **Owns**, stop. Say: "This belongs to DEV-0X." and write the 
proposed change as a short note for the owner. Do not make the edit. 
 
## Definition of done 
- UI works in both languages 
- No game rule implemented in a component 
- Tests for any new pure rule in your modules 
- `npm run lint`, `npm run typecheck` and `npm test` pass 
