import { describe, expect, it } from 'vitest'; 
import { 
  ENERGY_MAX, 
  EVICTION_ARREARS_PERIODS, 
  HOUSING_TIERS, 
  JOBS, 
  MEAL, 
  MS_PER_DAY, 
  MS_PER_HOUR, 


  MS_PER_WEEK, 
  accrue, 
  applyAction, 
  createPlayer, 
  type GameAction, 
  type PlayerState, 
} from '../../src/game'; 
 
const T0 = 1_800_000_000_000; 
let n = 0; 
const k = (): string => `key-${String(++n).padStart(8, '0')}`; 
 
const fresh = (origin: 'privileged' | 'struggling' = 'struggling'): PlayerState => 
  createPlayer({ id: 'p1', name: 'Niels', origin, city: 'yaounde' }, T0); 
 
const ok = (state: PlayerState, action: GameAction, now: number): PlayerState => { 
  const r = applyAction(state, action, now); 
  if (!r.ok) throw new Error(`expected ok, got ${r.code}`); 
  return r.state; 
}; 
 
describe('createPlayer', () => { 
  it('privileged starts richer and housed; struggling starts broke with relatives', () => { 
    const rich = fresh('privileged'); 
    const poor = fresh('struggling'); 
    expect(rich.fcfa).toBeGreaterThan(poor.fcfa); 
    expect(rich.housingTier).toBe(1); 
    expect(poor.housingTier).toBe(0); 
    expect(Number.isInteger(rich.fcfa)).toBe(true); 
  }); 
 
  it('rejects closed cities and bad names', () => { 
    expect(() => createPlayer({ id: 'x', name: 'Ab', origin: 'struggling', city: 'douala' }, 
T0)).toThrow(); 
    expect(() => createPlayer({ id: 'x', name: 'A', origin: 'struggling', city: 'yaounde' }, 
T0)).toThrow(); 
  }); 
}); 
 
describe('accrue', () => { 
  it('regenerates energy over time and caps at ENERGY_MAX', () => { 
    const s = { ...fresh(), energy: 10 }; 
    const later = accrue(s, T0 + 2 * MS_PER_HOUR).state; 
    expect(later.energy).toBeGreaterThan(10); 
    const muchLater = accrue(s, T0 + 30 * MS_PER_DAY).state; 
    expect(muchLater.energy).toBe(ENERGY_MAX); 
  }); 
 
  it('is idempotent for the same instant', () => { 
    const s = fresh('privileged'); 
    const t = T0 + 3 * MS_PER_WEEK; 
    const once = accrue(s, t).state; 
    const twice = accrue(once, t).state; 
    expect(twice).toEqual(once); 
  }); 
 
  it('does not go backwards if the clock is behind', () => { 
    const s = fresh(); 
    const r = accrue(s, T0 - 1000); 
    expect(r.state).toBe(s); 
    expect(r.events).toEqual([]); 
  }); 
 
  it('charges rent from balance and records arrears when short', () => { 
    const s: PlayerState = { ...fresh('privileged'), fcfa: 4_000 }; // tier 1, rent 10 000 
    const r = accrue(s, T0 + MS_PER_WEEK + 1); 
    expect(r.state.fcfa).toBe(0); 
    expect(r.state.rentArrearsFcfa).toBe(HOUSING_TIERS[1].rentFcfa - 4_000); 
    expect(r.events.some((e) => e.type === 'rent_charged')).toBe(true); 
  }); 
 
  it('evicts to tier 0 once arrears reach the threshold', () => { 
    const s: PlayerState = { ...fresh('privileged'), fcfa: 0 }; 
    const r = accrue(s, T0 + (EVICTION_ARREARS_PERIODS + 1) * MS_PER_WEEK); 
    expect(r.state.housingTier).toBe(0); 
    expect(r.events.some((e) => e.type === 'evicted')).toBe(true); 
  }); 
 
  it('caps catch-up so long absences are not infinitely punishing', () => { 
    const s: PlayerState = { ...fresh('privileged'), fcfa: 0 }; 
    const r = accrue(s, T0 + 200 * MS_PER_WEEK); 


    expect(r.state.rentArrearsFcfa).toBeLessThanOrEqual(8 * HOUSING_TIERS[1].rentFcfa); 
  }); 
}); 
 
describe('applyAction', () => { 
  it('rejects malformed actions', () => { 
    expect(applyAction(fresh(), { type: 'fly' }, T0)).toEqual({ ok: false, code: 'INVALID_ACTION' 
}); 
    expect(applyAction(fresh(), { type: 'work', key: 'x' }, T0)).toEqual({ ok: false, code: 
'INVALID_ACTION' }); 
  }); 
 
  it('work requires a job and energy, then pays the wage', () => { 
    const s0 = fresh(); 
    expect(applyAction(s0, { type: 'work', key: k() }, T0)).toEqual({ ok: false, code: 'NO_JOB' }); 
 
    const s1 = ok(s0, { type: 'take_job', key: k(), jobId: 'tailor' }, T0); 
    const s2 = ok(s1, { type: 'work', key: k() }, T0); 
    expect(s2.fcfa).toBe(s1.fcfa + JOBS.tailor.wageFcfa); 
    expect(s2.energy).toBe(s1.energy - JOBS.tailor.energyCost); 
 
    const drained: PlayerState = { ...s2, energy: 1 }; 
    expect(applyAction(drained, { type: 'work', key: k() }, T0)).toEqual({ 
      ok: false, 
      code: 'NOT_ENOUGH_ENERGY', 
    }); 
  }); 
 
  it('meals restore energy for money and refuse waste', () => { 
    const tired: PlayerState = { ...fresh('privileged'), energy: 20 }; 
    const fed = ok(tired, { type: 'buy_meal', key: k() }, T0); 
    expect(fed.energy).toBe(20 + MEAL.energy); 
    expect(fed.fcfa).toBe(tired.fcfa - MEAL.costFcfa); 
    expect(applyAction(fresh('privileged'), { type: 'buy_meal', key: k() }, T0)).toEqual({ 
      ok: false, 
      code: 'ENERGY_FULL', 
    }); 
    const broke: PlayerState = { ...fresh(), energy: 10 }; 
    expect(applyAction(broke, { type: 'buy_meal', key: k() }, T0)).toEqual({ 
      ok: false, 
      code: 'NOT_ENOUGH_FCFA', 
    }); 
  }); 
 
  it('moving housing costs a deposit, needs zero arrears, and resets the rent clock', () => { 
    const s = fresh('privileged'); 
    const moved = ok(s, { type: 'move_housing', key: k(), tier: 2 }, T0 + MS_PER_DAY); 
    expect(moved.housingTier).toBe(2); 
    expect(moved.fcfa).toBe(s.fcfa - HOUSING_TIERS[2].depositFcfa); 
    expect(moved.nextRentDueAt).toBe(T0 + MS_PER_DAY + MS_PER_WEEK); 
    expect(applyAction(moved, { type: 'move_housing', key: k(), tier: 2 }, T0 + 
MS_PER_DAY)).toEqual({ 
      ok: false, 
      code: 'SAME_HOUSING', 
    }); 
    const indebted: PlayerState = { ...s, rentArrearsFcfa: 5_000 }; 
    expect(applyAction(indebted, { type: 'move_housing', key: k(), tier: 2 }, T0)).toEqual({ 
      ok: false, 
      code: 'HAS_ARREARS', 
    }); 
  }); 
 
  it('pay_arrears pays at most what is owed', () => { 
    const s: PlayerState = { ...fresh('privileged'), rentArrearsFcfa: 5_000 }; 
    const r = applyAction(s, { type: 'pay_arrears', key: k(), amountFcfa: 99_000 }, T0); 
    if (!r.ok) throw new Error(r.code); 
    expect(r.state.rentArrearsFcfa).toBe(0); 
    expect(r.state.fcfa).toBe(s.fcfa - 5_000); 
    expect(applyAction(r.state, { type: 'pay_arrears', key: k(), amountFcfa: 10 }, T0)).toEqual({ 
      ok: false, 
      code: 'NOTHING_OWED', 
    }); 
  }); 
 
  it('is pure: same input gives same output and the input is never mutated', () => { 
    const s = Object.freeze(fresh('privileged')) as PlayerState; 
    const a: GameAction = { type: 'take_job', key: 'fixed-key-01', jobId: 'momo_agent' }; 
    const r1 = applyAction(s, a, T0 + 1000); 
    const r2 = applyAction(s, a, T0 + 1000); 
    expect(r1).toEqual(r2); 
    expect(s.jobId).toBeNull(); 
  }); 


 
  it('increments version only on success', () => { 
    const s = fresh(); 
    const r = applyAction(s, { type: 'take_job', key: k(), jobId: 'tailor' }, T0); 
    if (!r.ok) throw new Error(r.code); 
    expect(r.state.version).toBe(s.version + 1); 
  }); 
}); 
