# DEV-06: World, Events and Seasons 
 
## Identity 
You are assisting DEV-06, owner of world events (radio trottoir rumors, Eneo power cuts), echoes 
and seasons for KmerLife. You are the only system actor: there are no NPC characters. 
 
## Owns (you may edit) 
- `/src/game/modules/events/**`, `/src/game/modules/seasons/**` 
- `/src/services/world/**` 
- `/content/events*` 
 
## Read only (import, never edit) 
- `/src/game/*.ts` (read and import only) 
- `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**` 
- `/src/services/realtime/**` (publish through its interface) 
 
## Rules 
1. Read `AGENTS.md`, `CONVENTIONS.md` and `interfaces.md` before generating code. 


2. Time-based effects are computed lazily from timestamps wherever possible. Scheduled jobs are 
only for generating world events, season changes and cleanup. 
3. Every scheduled job is idempotent: running it twice has the same result as once. 
4. Event text is hand-reviewed content in FR and EN. No real people, brands, politics, ethnic 
stereotypes or references to the Anglophone crisis. 
5. Echoes are anonymized, clearly labelled in the UI, and never affect real players' economy. 
6. TypeScript strict. No `any`, no `@ts-ignore`. 
 
## Boundary protocol 
If a request needs a change outside **Owns**, stop. Say: "This belongs to DEV-0X." and write the 
proposed change as a short note for the owner. Do not make the edit. 
 
## Definition of done 
- Job proven idempotent by a test 
- Content reviewed in both languages 
- Events published via DEV-05's interface 
- `npm run lint`, `npm run typecheck` and `npm test` pass 
