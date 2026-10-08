import type { CITIES, JOB_IDS, ORIGINS } from './constants'; 
 
export type City = (typeof CITIES)[number]; 
export type Origin = (typeof ORIGINS)[number]; 
export type JobId = (typeof JOB_IDS)[number]; 
export type HousingTier = 0 | 1 | 2; 
 
/** The full, authoritative state of one player. Persisted as one row; the server is the only 
writer. */ 
export interface PlayerState { 
  id: string; 
  name: string; 
  origin: Origin; 
  city: City; 
  /** Integer FCFA. */ 
  fcfa: number; 
  /** 0..ENERGY_MAX, two decimals. */ 
  energy: number; 
  jobId: JobId | null; 
  housingTier: HousingTier; 
  rentArrearsFcfa: number; 
  /** Epoch ms. Ignored while housingTier is 0. */ 
  nextRentDueAt: number; 
  /** Epoch ms of the last time-based accrual (energy, rent). */ 
  lastAccruedAt: number; 
  seasonId: number; 
  /** Increments on every successful action (optimistic concurrency / audit). */ 
  version: number; 
} 
 
/** `key` is a client-generated idempotency key (UUID). The server stores (playerId, key) uniquely. 
*/ 
export type GameAction = 
  | { type: 'take_job'; key: string; jobId: JobId } 
  | { type: 'work'; key: string } 
  | { type: 'buy_meal'; key: string } 
  | { type: 'pay_arrears'; key: string; amountFcfa: number } 
  | { type: 'move_housing'; key: string; tier: HousingTier }; 
 
export type GameEvent = 
  | { type: 'rent_charged'; periods: number; paidFcfa: number; arrearsAddedFcfa: number } 
  | { type: 'evicted' } 
  | { type: 'job_taken'; jobId: JobId } 
  | { type: 'worked'; earnedFcfa: number; energySpent: number } 
  | { type: 'meal_bought'; costFcfa: number; energyGained: number } 
  | { type: 'arrears_paid'; paidFcfa: number; remainingFcfa: number } 
  | { type: 'moved'; tier: HousingTier; depositFcfa: number }; 
 
export const ERROR_CODES = [ 
  'INVALID_ACTION', 
  'NO_JOB', 
  'SAME_JOB', 
  'NOT_ENOUGH_ENERGY', 
  'NOT_ENOUGH_FCFA', 
  'ENERGY_FULL', 
  'NOTHING_OWED', 
  'HAS_ARREARS', 


  'SAME_HOUSING', 
] as const; 
 
export type ErrorCode = (typeof ERROR_CODES)[number]; 
 
export type ActionResult = 
  | { ok: true; state: PlayerState; events: GameEvent[] } 
  | { ok: false; code: ErrorCode }; 
