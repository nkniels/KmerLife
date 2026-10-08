# Interfaces: the contract between domains 
 
The owner of a contract may change it only by editing this file in the same pull request and 
announcing it. Consumers never change it. 
 
## Shared kernel (DEV-01), `src/game/` 
```ts 
applyAction(state: PlayerState, action: unknown, now: number): ActionResult 
accrue(state: PlayerState, now: number): { state: PlayerState; events: GameEvent[] } 
createPlayer(input: CreatePlayerInput, now: number): PlayerState 
actionSchema, createPlayerSchema            // zod 
CITIES, MVP_CITIES, ORIGINS, JOB_IDS, JOBS, HOUSING_TIERS, MEAL, ...   // constants 
type PlayerState, GameAction, GameEvent, ActionResult, ErrorCode 
``` 
A feature module adds its actions by extending `actionSchema` and the engine switch in a PR 
reviewed by DEV-01. 
 
## Action API (DEV-01 and DEV-04), `src/server/` 
``` 
POST /api/game 
body:     GameAction              (includes the idempotency key) 
success:  { ok: true,  state: PlayerState, events: GameEvent[] } 
failure:  { ok: false, code: ErrorCode } 
``` 
Repeating the same key returns the stored result unchanged. 
 
## Platform (DEV-04) 
- Tables: `characters`, `action_log`, `transactions`, `world_state` (see `docs/ARCHITECTURE.md`). 
- Generated types: `src/lib/database.types.ts`. 
- Auth: the server resolves the current player from the session; clients never send a player id. 
 
## Realtime (DEV-05), `src/services/realtime/` 
```ts 
interface RealtimeTransport { 
  subscribe(channel: string, onMessage: (m: unknown) => void): () => void 
  publish(channel: string, message: unknown): Promise<void> 
  presence(venueId: string): { enter(): void; leave(): void; members(): string[] } 
} 
// React hooks built on it: 
useVenuePresence(venueId: string): string[] 
useCityChat(city: City): ChatMessage[] 
sendChat(city: City, text: string): Promise<void> 
``` 
`/api/ably-token` issues tokens scoped to the player's own city. 
 
## World (DEV-06), `src/services/world/` 
```ts 
type WorldEvent = { 
  id: string 
  city: City 
  type: 'rumor' | 'power_cut' | 'market_fluctuation' | 'rent_due' 
  messageKey: string 
  isTrue?: boolean            // rumors only, never sent to clients until resolved 
  effect?: { kind: string; magnitude: number } 
  expiresAt: string 
} 
useWorldEvents(city: City): WorldEvent[] 
runWorldJob(city: City): Promise<void>   // scheduled, server-only, idempotent 
``` 
