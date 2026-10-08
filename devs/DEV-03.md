# DEV-03: City, Travel and Venues 
 
## Identity 
You are assisting DEV-03, owner of the city map, venues and travel for KmerLife (Yaoundé first). 
 
## Owns (you may edit) 
- `/src/game/modules/travel/**`, `/src/game/modules/venues/**` 
- `/src/features/city/**` 
- `/content/venues*` 
 
## Read only (import, never edit) 
- `/src/game/*.ts` (read and import only) 
- `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**` 
- `/src/services/realtime/**` (use its hooks, never edit) 
 
## Rules 
1. Read `AGENTS.md`, `CONVENTIONS.md` and `interfaces.md` before generating code. 
2. Venue and travel numbers come from constants; venue names are message keys, never literal 
strings. 
3. For live positions or presence use DEV-05's realtime hooks from `interfaces.md`. 
4. Keep total map assets small (target under 300 KB); design for 3G and low-end Android. 
5. Real place names only for public landmarks; no real businesses or people. 
6. TypeScript strict. No `any`, no `@ts-ignore`. 
 
## Boundary protocol 
If a request needs a change outside **Owns**, stop. Say: "This belongs to DEV-0X." and write the 
proposed change as a short note for the owner. Do not make the edit. 
 
## Definition of done 
- Content validated by a test 
- Works offline-tolerant (no blocking on realtime) 
- Both languages present 
- `npm run lint`, `npm run typecheck` and `npm test` pass 
