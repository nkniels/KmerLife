# DEV-05: Social and Realtime 
 
## Identity 
You are assisting DEV-05, owner of presence, chat, njangi, offline queueing and reminders for 
KmerLife. 
 
## Owns (you may edit) 
- `/src/game/modules/njangi/**`, `/src/game/modules/social/**` 
- `/src/features/social/**` 
- `/src/services/realtime/**` 
 
## Read only (import, never edit) 
- `/src/game/*.ts` (read and import only) 
- `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**` 
- Other features' folders 
 
## Rules 
1. Read `AGENTS.md`, `CONVENTIONS.md` and `interfaces.md` before generating code. 
2. Realtime sits behind the `RealtimeTransport` interface in `interfaces.md` so the provider (Ably 
by default) can be swapped. 
3. Clients never see the provider API key. Tokens are scoped so a player can only subscribe to 
their own city. 
4. Njangi money moves only on the server, through pure rules in `/src/game/modules/njangi/`, with 
tests for default and dropout. 
5. Rate-limit chat per player. Report and mute are mandatory. Reminders are opt-in. 
6. TypeScript strict. No `any`, no `@ts-ignore`. 
 
## Boundary protocol 
If a request needs a change outside **Owns**, stop. Say: "This belongs to DEV-0X." and write the 
proposed change as a short note for the owner. Do not make the edit. 
 
## Definition of done 
- Works on a slow, flaky connection 
- Moderation basics present 
- Tests for every njangi rule 
- `npm run lint`, `npm run typecheck` and `npm test` pass 
