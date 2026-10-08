/** 
 * GAME CONSTANTS: the economy. 
 * Owner: DEV-01 only (enforced by CODEOWNERS). 
 * 
 * Money is FCFA, always an integer. Durations are milliseconds. 
 * Every number here is a PLACEHOLDER until validated with `npm run simulate` 
 * (see docs/ECONOMY.md). Do not hardcode any of these values elsewhere. 
 */ 
 
export const MS_PER_MINUTE = 60_000; 
export const MS_PER_HOUR = 3_600_000; 
export const MS_PER_DAY = 86_400_000; 
export const MS_PER_WEEK = 604_800_000; 
 
export const CITIES = ['yaounde', 'douala', 'buea'] as const; 
export const MVP_CITIES = ['yaounde'] as const; 
export const ORIGINS = ['privileged', 'struggling'] as const; 
 
export const ENERGY_MAX = 100; 
export const ENERGY_REGEN_PER_MIN = 0.1; 
export const STARTING_ENERGY = 100; 
 
export const MEAL = { costFcfa: 1_500, energy: 25 } as const; 
 
export const STARTING_FCFA = { privileged: 300_000, struggling: 0 } as const; 
export const STARTING_HOUSING_TIER = { privileged: 1, struggling: 0 } as const; 
 
export const RENT_INTERVAL_MS = MS_PER_WEEK; 
/** Max rent periods charged in one catch-up (a player away for months is not instantly ruined). */ 
export const MAX_RENT_CATCHUP = 8; 
/** Arrears of this many weekly rents or more => eviction to tier 0. */ 
export const EVICTION_ARREARS_PERIODS = 2; 
 
export const JOB_IDS = [ 
  'benskin_rider', 
  'market_trader', 
  'tailor', 
  'momo_agent', 
  'private_tutor', 
] as const; 
 
export interface JobDef { 
  readonly wageFcfa: number; 
  readonly energyCost: number; 
} 
 
export const JOBS: Readonly<Record<(typeof JOB_IDS)[number], JobDef>> = { 
  benskin_rider: { wageFcfa: 900, energyCost: 15 }, 


  market_trader: { wageFcfa: 700, energyCost: 12 }, 
  tailor: { wageFcfa: 1_000, energyCost: 15 }, 
  momo_agent: { wageFcfa: 650, energyCost: 10 }, 
  private_tutor: { wageFcfa: 1_300, energyCost: 18 }, 
}; 
 
export interface HousingDef { 
  readonly id: string; 
  readonly rentFcfa: number; 
  readonly depositFcfa: number; 
  /** Multiplier on energy regeneration while living here. */ 
  readonly regenMult: number; 
} 
 
/** Index = tier. Tier 0 is the fallback (staying with relatives), always free. */ 
export const HOUSING_TIERS: readonly [HousingDef, HousingDef, HousingDef] = [ 
  { id: 'relatives', rentFcfa: 0, depositFcfa: 0, regenMult: 0.8 }, 
  { id: 'chambre', rentFcfa: 10_000, depositFcfa: 20_000, regenMult: 1.0 }, 
  { id: 'studio', rentFcfa: 25_000, depositFcfa: 50_000, regenMult: 1.2 }, 
]; 
