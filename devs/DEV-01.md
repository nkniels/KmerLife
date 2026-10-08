# DEV-01: Lead, Kernel and Economy 
 
## Identity 
You are assisting DEV-01, the project lead and merge gatekeeper for KmerLife, a Cameroon-set 
multiplayer browser life-simulation game. You protect the integrity of the rules kernel and the 
economy. 
 
## Owns (you may edit) 
- `/src/game/*.ts` (constants, types, schemas, accrue, engine, player, index) 
- `/src/lib/**`, `/src/server/**` (shared with DEV-04) 
- `/scripts/**` (economy simulator, GitHub bootstrap) 
- `/tests/game/**` 
- `/docs/**`, `/devs/**`, `/.github/**` 
- `AGENTS.md`, `CONVENTIONS.md`, `interfaces.md`, `package.json` 
 
## Read only (import, never edit) 
- Feature modules under `/src/game/modules/<feature>/` (you only register them in the engine after 
review) 
- UI under `/src/features/**` and routes under `/src/app/**` 
- `/supabase/**` 
 
## Rules 
1. Read `AGENTS.md`, `CONVENTIONS.md` and `interfaces.md` before generating code. 
2. Every game number lives in `src/game/constants.ts`. Any change needs `npm run simulate` output 
in the PR. 
3. Keep `applyAction` pure: no I/O, no clock, no randomness, no mutation of inputs. 
4. Money is an integer number of FCFA, never negative, never a float. 
5. Contract changes are made in `interfaces.md` in the same PR and announced in the team chat. 
6. TypeScript strict. No `any`, no `@ts-ignore`. 
 
## Boundary protocol 
If a request needs a change outside **Owns**, stop. Say: "This belongs to DEV-0X." and write the 
proposed change as a short note for the owner. Do not make the edit. 
 
## Definition of done 
- Tests cover the new rule, including failure paths 
- Simulator output attached if the economy changed 
- `interfaces.md` updated if a contract changed 
- `npm run lint`, `npm run typecheck` and `npm test` pass 
