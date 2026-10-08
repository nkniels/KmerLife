import { accrue } from './accrue'; 
import { 
  ENERGY_MAX, 
  HOUSING_TIERS, 
  JOBS, 
  MEAL, 
  RENT_INTERVAL_MS, 
} from './constants'; 
import { actionSchema } from './schemas'; 
import type { ActionResult, ErrorCode, GameEvent, PlayerState } from './types'; 
 


const fail = (code: ErrorCode): ActionResult => ({ ok: false, code }); 
 
/** 
 * THE rules of the game as one pure function. 
 * Given the current state, an action and the current time, return the new state and events, 
 * or an error code. No I/O, no clock, no randomness, no mutation of the inputs. 
 * 
 * The server calls this inside a row lock and persists the result. 
 * The client may call it for optimistic prediction; the server's answer always wins. 
 */ 
export function applyAction(state: PlayerState, action: unknown, now: number): ActionResult { 
  const parsed = actionSchema.safeParse(action); 
  if (!parsed.success) return fail('INVALID_ACTION'); 
  const act = parsed.data; 
 
  const accrued = accrue(state, now); 
  const s: PlayerState = { ...accrued.state }; 
  const events: GameEvent[] = [...accrued.events]; 
 
  switch (act.type) { 
    case 'take_job': { 
      if (s.jobId === act.jobId) return fail('SAME_JOB'); 
      s.jobId = act.jobId; 
      events.push({ type: 'job_taken', jobId: act.jobId }); 
      break; 
    } 
    case 'work': { 
      if (s.jobId === null) return fail('NO_JOB'); 
      const job = JOBS[s.jobId]; 
      if (s.energy < job.energyCost) return fail('NOT_ENOUGH_ENERGY'); 
      s.energy = Math.round((s.energy - job.energyCost) * 100) / 100; 
      s.fcfa += job.wageFcfa; 
      events.push({ type: 'worked', earnedFcfa: job.wageFcfa, energySpent: job.energyCost }); 
      break; 
    } 
    case 'buy_meal': { 
      if (s.energy >= ENERGY_MAX) return fail('ENERGY_FULL'); 
      if (s.fcfa < MEAL.costFcfa) return fail('NOT_ENOUGH_FCFA'); 
      const gained = Math.min(MEAL.energy, ENERGY_MAX - s.energy); 
      s.fcfa -= MEAL.costFcfa; 
      s.energy = Math.round((s.energy + gained) * 100) / 100; 
      events.push({ type: 'meal_bought', costFcfa: MEAL.costFcfa, energyGained: gained }); 
      break; 
    } 
    case 'pay_arrears': { 
      if (s.rentArrearsFcfa === 0) return fail('NOTHING_OWED'); 
      const pay = Math.min(act.amountFcfa, s.rentArrearsFcfa); 
      if (s.fcfa < pay) return fail('NOT_ENOUGH_FCFA'); 
      s.fcfa -= pay; 
      s.rentArrearsFcfa -= pay; 
      events.push({ type: 'arrears_paid', paidFcfa: pay, remainingFcfa: s.rentArrearsFcfa }); 
      break; 
    } 
    case 'move_housing': { 
      if (act.tier === s.housingTier) return fail('SAME_HOUSING'); 
      if (s.rentArrearsFcfa > 0) return fail('HAS_ARREARS'); 
      const deposit = HOUSING_TIERS[act.tier].depositFcfa; 
      if (s.fcfa < deposit) return fail('NOT_ENOUGH_FCFA'); 
      s.fcfa -= deposit; 
      s.housingTier = act.tier; 
      s.nextRentDueAt = now + RENT_INTERVAL_MS; 
      events.push({ type: 'moved', tier: act.tier, depositFcfa: deposit }); 
      break; 
    } 
  } 
 
  s.version = state.version + 1; 
  return { ok: true, state: s, events }; 
} 
