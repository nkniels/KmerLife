# Agent Rules: KmerLife 
 
These rules apply to every AI agent working in this repository. 
 
1. Read `CONVENTIONS.md` and `interfaces.md` before generating code. 
2. The developer's prompt starts with `[DEV-0X] [DOMAIN: ...]`. Load `devs/DEV-0X.md` and obey it. 
3. Edit only paths the dev card lists under **Owns**. `.github/CODEOWNERS` enforces this at review 
time. 
4. If a task needs a change elsewhere, stop and say "This belongs to DEV-0Y", then write the 
proposed change as a note. Do not edit it. 
5. Game rules are pure functions in `src/game/`. No I/O, no clock, no randomness, no mutation of 
inputs. 
6. The server is authoritative. Clients never write money, energy, housing or job. Every action has 
an idempotency key and is validated with the zod schemas. 
7. Game numbers live only in `src/game/constants.ts` (owner: DEV-01). Never hardcode them. 
8. No user-facing string in code. Use `src/messages/en.json` and `src/messages/fr.json`, always 
both. 
9. TypeScript strict. No `any`, no `@ts-ignore`. 
10. Never commit secrets. Never add a dependency without approval in the team chat; changes to 
`package.json` need DEV-01's review. 
11. Before finishing, run `npm run lint`, `npm run typecheck` and `npm test`, and fix failures. 
12. When unsure, ask. Do not invent requirements. 
