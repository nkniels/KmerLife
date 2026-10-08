/** 
 * Headless economy simulator. 
 * Usage: npm run simulate -- --players 500 --days 60 --seed 7 
 * 
 * Runs bots with different play styles through the REAL rules (applyAction) and prints the 
 * resulting wealth distribution. Use it to tune src/game/constants.ts BEFORE building UI. 
 */ 
import { 
  HOUSING_TIERS, 
  JOB_IDS, 
  MEAL, 
  MS_PER_DAY, 
  MS_PER_HOUR, 
  applyAction, 
  createPlayer, 
  type GameAction, 
  type JobId, 
  type PlayerState, 
} from '../src/game'; 
 
interface Strategy { 
  name: string; 
  loginsPerDay: number; 
  eatBelowEnergy: number; 
  upgrades: boolean; 
} 
 
const STRATEGIES: Strategy[] = [ 
  { name: 'grinder', loginsPerDay: 6, eatBelowEnergy: 30, upgrades: true }, 
  { name: 'regular', loginsPerDay: 2, eatBelowEnergy: 20, upgrades: true }, 
  { name: 'casual', loginsPerDay: 1, eatBelowEnergy: 0, upgrades: false }, 
  { name: 'spender', loginsPerDay: 2, eatBelowEnergy: 70, upgrades: false }, 
]; 
 
function arg(name: string, fallback: number): number { 
  const i = process.argv.indexOf(`--${name}`); 
  const raw = i >= 0 ? process.argv[i + 1] : undefined; 
  const v = raw === undefined ? NaN : Number(raw); 
  return Number.isFinite(v) ? v : fallback; 
} 
 
/** Small deterministic PRNG so runs are reproducible. */ 
function mulberry32(seed: number): () => number { 
  let a = seed >>> 0; 
  return () => { 
    a = (a + 0x6d2b79f5) >>> 0; 
    let t = a; 
    t = Math.imul(t ^ (t >>> 15), t | 1); 
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); 
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; 


  }; 
} 
 
const START = 1_800_000_000_000; 
let keyCounter = 0; 
const nextKey = (): string => `sim-${String(++keyCounter).padStart(10, '0')}`; 
 
function step(state: PlayerState, action: GameAction, now: number): PlayerState { 
  const r = applyAction(state, action, now); 
  return r.ok ? r.state : state; 
} 
 
function play(strategy: Strategy, rand: () => number, days: number, id: string): PlayerState { 
  const origin = rand() < 0.5 ? 'privileged' : 'struggling'; 
  let s = createPlayer({ id, name: `Bot ${id}`, origin, city: 'yaounde' }, START); 
  const job = JOB_IDS[Math.floor(rand() * JOB_IDS.length)] as JobId; 
  s = step(s, { type: 'take_job', key: nextKey(), jobId: job }, START); 
 
  for (let d = 0; d < days; d++) { 
    for (let l = 0; l < strategy.loginsPerDay; l++) { 
      const now = 
        START + d * MS_PER_DAY + Math.floor((l * 16 * MS_PER_HOUR) / strategy.loginsPerDay) + 7 * 
MS_PER_HOUR; 
 
      if (s.rentArrearsFcfa > 0) { 
        s = step(s, { type: 'pay_arrears', key: nextKey(), amountFcfa: Math.min(s.fcfa, 
s.rentArrearsFcfa) || 1 }, now); 
      } 
      // work until exhausted, eating when allowed 
      for (let guard = 0; guard < 40; guard++) { 
        const before = s; 
        s = step(s, { type: 'work', key: nextKey(), }, now); 
        if (s === before) { 
          if (s.energy < strategy.eatBelowEnergy || (strategy.eatBelowEnergy > 0 && guard === 0)) { 
            const afterEat = step(s, { type: 'buy_meal', key: nextKey() }, now); 
            if (afterEat === s) break; 
            s = afterEat; 
          } else break; 
        } 
      } 
      if (strategy.upgrades && s.rentArrearsFcfa === 0) { 
        const next = (s.housingTier + 1) as 1 | 2; 
        if (s.housingTier < 2) { 
          const need = HOUSING_TIERS[next].depositFcfa + 3 * HOUSING_TIERS[next].rentFcfa; 
          if (s.fcfa >= need) s = step(s, { type: 'move_housing', key: nextKey(), tier: next }, 
now); 
        } 
      } 
    } 
  } 
  // final accrual at the end of the horizon 
  const end = START + days * MS_PER_DAY; 
  const r = applyAction(s, { type: 'take_job', key: nextKey(), jobId: s.jobId ?? 'tailor' }, end); 
  return r.ok ? r.state : s; 
} 
 
function pct(sorted: number[], p: number): number { 
  if (sorted.length === 0) return 0; 
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length)); 
  return sorted[idx] as number; 
} 
 
function main(): void { 
  const players = arg('players', 400); 
  const days = arg('days', 60); 
  const seed = arg('seed', 1); 
  const rand = mulberry32(seed); 
 
  console.log(`KmerLife economy simulation: ${players} players x ${days} days (seed ${seed})`); 
  console.log(`Meal: ${MEAL.costFcfa} FCFA -> ${MEAL.energy} energy\n`); 
  console.log('strategy  n    p10 FCFA   median     p90        evicted%  avg FCFA/day'); 
 
  for (const strat of STRATEGIES) { 
    const n = Math.max(1, Math.floor(players / STRATEGIES.length)); 
    const finals: PlayerState[] = []; 
    for (let i = 0; i < n; i++) finals.push(play(strat, rand, days, `${strat.name}-${i}`)); 
    const wealth = finals.map((f) => f.fcfa - f.rentArrearsFcfa).sort((a, b) => a - b); 
    const evicted = finals.filter((f) => f.housingTier === 0 && f.origin === 'privileged').length; 
    const avg = wealth.reduce((a, b) => a + b, 0) / wealth.length; 
    console.log( 
      [ 
        strat.name.padEnd(9), 


        String(n).padEnd(4), 
        String(pct(wealth, 10)).padEnd(10), 
        String(pct(wealth, 50)).padEnd(10), 
        String(pct(wealth, 90)).padEnd(10), 
        `${((evicted / n) * 100).toFixed(0)}%`.padEnd(9), 
        Math.round(avg / days), 
      ].join(' '), 
    ); 
  } 
  console.log('\nTargets are in docs/ECONOMY.md. Tune src/game/constants.ts, rerun, repeat.'); 
} 
 
main(); 
