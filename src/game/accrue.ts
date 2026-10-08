import { 
  ENERGY_MAX, 
  ENERGY_REGEN_PER_MIN, 
  EVICTION_ARREARS_PERIODS, 
  HOUSING_TIERS, 
  MAX_RENT_CATCHUP, 
  MS_PER_MINUTE, 
  RENT_INTERVAL_MS, 
} from './constants'; 
import type { GameEvent, PlayerState } from './types'; 
 
const round2 = (n: number): number => Math.round(n * 100) / 100; 
 
/** 
 * Lazy time accrual. Brings a player's state up to `now` by computing, from timestamps, 
 * what the simulation "would have done": energy regeneration and rent charges. 
 * Pure and idempotent: accrue(accrue(s, t), t) equals accrue(s, t). 
 * No background tick is needed for any of this. 
 */ 
export function accrue( 
  state: PlayerState, 
  now: number, 
): { state: PlayerState; events: GameEvent[] } { 
  if (now <= state.lastAccruedAt) return { state, events: [] }; 
 
  const events: GameEvent[] = []; 
  const next: PlayerState = { ...state }; 
  const housing = HOUSING_TIERS[state.housingTier]; 
 
  // Energy 
  const minutes = (now - state.lastAccruedAt) / MS_PER_MINUTE; 
  const regenPerMin = ENERGY_REGEN_PER_MIN * housing.regenMult; 
  next.energy = round2(Math.min(ENERGY_MAX, state.energy + minutes * regenPerMin)); 
 
  // Rent (auto-debit; any shortfall becomes arrears) 
  if (housing.rentFcfa > 0 && now >= state.nextRentDueAt) { 
    const periodsElapsed = Math.floor((now - state.nextRentDueAt) / RENT_INTERVAL_MS) + 1; 
    const periodsCharged = Math.min(periodsElapsed, MAX_RENT_CATCHUP); 
    const totalDue = periodsCharged * housing.rentFcfa; 
    const paid = Math.min(next.fcfa, totalDue); 
    const added = totalDue - paid; 
    next.fcfa -= paid; 


    next.rentArrearsFcfa += added; 
    next.nextRentDueAt = state.nextRentDueAt + periodsElapsed * RENT_INTERVAL_MS; 
    events.push({ 
      type: 'rent_charged', 
      periods: periodsCharged, 
      paidFcfa: paid, 
      arrearsAddedFcfa: added, 
    }); 
 
    if (next.rentArrearsFcfa >= EVICTION_ARREARS_PERIODS * housing.rentFcfa) { 
      next.housingTier = 0; 
      events.push({ type: 'evicted' }); 
    } 
  } 
 
  next.lastAccruedAt = now; 
  return { state: next, events }; 
} 
