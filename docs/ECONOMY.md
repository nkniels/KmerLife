# KmerLife: Economy 
 
## 1. Principles 
- Money is virtual FCFA, always an integer, never negative. 
- Faucets (wages, starting money) must be balanced by sinks (rent, meals, deposits, and later 
transport, upgrades, njangi stakes). 
- No number is final until the simulator says it is fine. 
 
## 2. Current parameters 
These mirror `src/game/constants.ts`, which is the single source of truth. 
 
| Parameter | Value | 
|-----------|-------| 
| Energy maximum | 100 | 
| Energy regeneration (base) | 0.1 per minute | 
| Meal | 1 500 FCFA for 25 energy | 
| Starting FCFA | 300 000 (privileged), 0 (struggling) | 
| Rent interval | 7 days | 
| Eviction | Arrears of 2 weekly rents or more | 
| Maximum rent catch-up | 8 periods | 
| Wages per shift | benskin 900, trader 700, tailor 1 000, MoMo agent 650, tutor 1 300 | 
| Energy per shift | benskin 15, trader 12, tailor 15, MoMo agent 10, tutor 18 | 
| Housing rent / deposit | chambre 10 000 / 20 000, studio 25 000 / 50 000 | 
 
## 3. Baseline simulation 


Command: `npm run simulate -- --players 400 --days 60 --seed 7` 
 
| Strategy | Players | p10 FCFA | Median | p90 | Average per day | 
|----------|---------|----------|--------|-----|-----------------| 
| grinder (6 logins a day) | 100 | 461 000 | 1 247 500 | 2 558 000 | 22 557 | 
| regular (2 logins a day) | 100 | 214 600 | 520 000 | 932 600 | 9 724 | 
| casual (1 login a day) | 100 | 336 000 | 390 000 | 610 000 | 7 881 | 
| spender (2 logins, eats often) | 100 | 324 000 | 720 000 | 1 252 000 | 12 598 | 
 
**Reading:** the faucet is larger than the sinks. A casual player nets about 55 000 FCFA a week 
against a rent of 10 000 to 25 000. Players hoard. More money sinks are required before the pilot 
(issue: "Design and add money sinks"). 
 
## 4. Targets (proposals for DEV-01 to confirm) 
1. A player who works every day is never evicted. 
2. A grinder earns at most about 3 times a casual player's weekly net. 
3. Median wealth grows roughly linearly over a season, not exponentially. 
4. A player can afford the studio deposit within about 4 weeks of steady play, but not in week 1. 
 
## 5. How to tune 
1. Change values in `src/game/constants.ts` only. 
2. Run `npm run simulate` with several seeds. 
3. Paste the output table into the pull request and into section 3 above. 
4. Do not merge economy changes without that evidence. 
 
## 6. Known simplifications 
- Energy regeneration over a period uses the housing tier at the start of the period. 
- Deposits are not refunded. 
- Eating is close to break-even against wages by design: it buys time, not profit. 
- The simulator's bots are simple; real players will be cleverer. 
