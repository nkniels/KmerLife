# KmerLife: Game Design 
 
## 1. Vision 
KmerLife is a browser life-simulation game set in Cameroon. Players create a character, earn FCFA, 
pay rent, join njangi groups and live in a shared Yaoundé (Douala and Buea come later). It is built 
for mobile phones, slow networks and short sessions, in French and English. 
 
### Design pillars 
- **Authentically Cameroonian.** Njangi, radio trottoir, Eneo power cuts, benskin rides, concours. 
Not a reskin of another country's game. 
- **Time is the currency of play.** Energy and rent run on real clocks, so a few minutes a day is 
enough. 
- **The server decides everything.** Clients never edit money, energy or housing. 
- **The city is never empty.** Echoes (replayed real-player sessions) keep venues alive. 
- **Fair and bounded.** Seasons reset the economy, FCFA has no cash value, nothing can be bought 
for an advantage. 
 
## 2. Core loop 
1. Create a character: name, origin, city. 
2. Take a job. 
3. Work: spend energy, earn FCFA. 
4. Eat: spend FCFA, regain energy. 
5. Pay rent every week. Fall behind and arrears build up; fall far behind and you are evicted. 
6. Grow: move to better housing, join a njangi, travel, socialize. 
7. React to the world: rumors, power cuts, market swings. 
8. At season end the economy resets and the hall of fame is recorded. 
 
## 3. MVP scope 
| Feature | MVP | Later | 
|---------|-----|-------| 
| City | Yaoundé | Douala, Buea | 
| Careers | 5 | More careers with levels and requirements (concours, dossiers) | 
| Venues | 8 | More per city | 
| Housing | 3 tiers | More tiers, furniture | 
| Transport | On foot, benskin, taxi, car | Clando, intercity bus | 
| Social | Venue presence, city chat | Friends, guilds | 
| Njangi | Week 5 | Variants | 
| Events | Rumors, power cuts | Water cuts, rainy season, scams | 
| Echoes | Week 5 | Richer replay | 
| Languages | French and English | Camfranglais flavor in event text | 
 
Out of scope: cash-out of FCFA, real-money purchases, NPC characters, voice chat, user-generated 
content. 
 
## 4. Characters 
- Name: 2 to 24 characters. 
- Origin: **privileged** (starts with 300 000 FCFA and a rented room) or **struggling** (starts 
with 0 FCFA, staying with relatives). 
- City: Yaoundé only in the MVP. 
- No cosmetic customization in the MVP. 
 
## 5. Jobs (MVP careers) 
| Id | English | French | Wage per shift (FCFA) | Energy per shift | 
|----|---------|--------|-----------------------|------------------| 
| benskin_rider | Benskin rider | Conducteur de moto-taxi | 900 | 15 | 
| market_trader | Market trader | Commerçant(e) de marché | 700 | 12 | 


| tailor | Tailor | Couturier(ère) | 1 000 | 15 | 
| momo_agent | Mobile money agent | Agent de transfert d'argent mobile | 650 | 10 | 
| private_tutor | Private tutor | Répétiteur(trice) | 1 300 | 18 | 
 
The authoritative values live in `src/game/constants.ts`. Later, careers get levels and entry 
requirements such as an exam (concours) or paperwork (dossier). 
 
## 6. Energy and meals 
- Energy ranges from 0 to 100. 
- Base regeneration is 0.1 per minute (6 per hour, full in under 17 hours), multiplied by the 
housing factor (0.8, 1.0 or 1.2). 
- Working spends the job's energy cost. 
- A meal costs 1 500 FCFA and restores 25 energy. You cannot eat when energy is full. 
 
## 7. Housing and rent 
| Tier | Id | Weekly rent (FCFA) | Deposit (FCFA) | Regeneration factor | 
|------|----|--------------------|----------------|---------------------| 
| 0 | relatives | 0 | 0 | 0.8 | 
| 1 | chambre | 10 000 | 20 000 | 1.0 | 
| 2 | studio | 25 000 | 50 000 | 1.2 | 
 
Rules: 
- Rent is charged automatically each week from the balance. Any shortfall becomes **arrears**. 
- Arrears of two weekly rents or more mean **eviction** to tier 0. The debt remains. 
- You must clear arrears before moving. 
- Moving costs the deposit, which is not refunded in the MVP. 
- If a player is away for a long time, at most 8 weeks of rent are charged in one catch-up. 
 
## 8. Venues (MVP, Yaoundé) 
Mokolo Market, Central Market, Mfoundi Market, Bastos, Mvog-Mbi, Mvan Bus Station, Municipal Lake, 
Ngoa-Ekellé Campus. The data lives in `content/venues.yaounde.json`; names are message keys. 
 
## 9. Travel 
Each trip costs time and FCFA depending on mode (on foot, benskin, taxi, car) and distance. The 
numbers are set in constants when the travel module is built in week 3. 
 
## 10. Social 
- Presence per venue and chat per city, in real time. 
- Report and mute are mandatory from the first release; chat is rate-limited. 
- **Echoes:** anonymized recordings of real players' action sequences are replayed as dimmed, 
clearly labelled figures in quiet venues. They never affect real players' economy. 
 
## 11. Njangi (rotating savings) 
A njangi (tontine in French) is a group where everyone pays a fixed amount each round and one 
member takes the whole pot, in turn. 
- Group size 3 to 12 players; fixed contribution and round length set at creation. 
- The order of receiving is drawn at random when the group starts. 
- Each round the server collects every contribution; the pot is paid to that round's beneficiary 
only when all contributions are in. 
- A missed contribution gets a 24-hour grace period. After that the defaulter is removed, loses any 
claim to a future pot, and carries a visible "unreliable" mark for the season. 
- A member who already took the pot and then defaults owes the shortfall as debt. 
- Open questions for DEV-05 and DEV-01: group discovery, invitations, whether members may swap 
turns. 
 
## 12. World events and radio trottoir 
Event types: **rumor**, **power_cut** (Eneo outage), **market_fluctuation**, **rent_due**. 
- Rumors are short texts that spread through the city. Each has a hidden truth flag. If true, it 
has an economic effect (for example, prices in a market rise for 24 hours). Acting on a false rumor 
costs the player. 
- Power cuts stop work shifts in the affected city for a time. 
- Event text is written in advance (generated offline, reviewed by a human), stored in `content/`, 
in French and English. There is no live text generation at runtime. 
 
Content rules: no real people, real brands, politics, ethnic stereotypes, or references to the 
Anglophone crisis. 
 
## 13. Seasons 
- A season lasts about 90 days. 
- At the end: balances, housing and jobs reset; a hall of fame (wealthiest, most reliable njangi 
member) is kept. 
- Calendar-linked events: Youth Day (11 February), National Day (20 May), and the December trip to 
the village (descente au village), when players save for gifts. 
 
## 14. Money, ads and legal 
- FCFA is virtual: it cannot be bought, sold or cashed out. No randomized paid rewards. 
- **Phygital ads:** local businesses can sponsor venues or billboards. Spending in the game can 
unlock real discount codes at the real business. Sponsors see redemption counts only. Sponsored 
content is clearly labelled. 


- Privacy: collect the minimum. Email for login. Phone numbers only for opt-in reminders. Publish a 
privacy notice in French and English, and have the current Cameroonian data-protection and 
cybersecurity rules checked before launch. 
- Decide a minimum player age before the pilot. 
 
## 15. Languages 
French and English are equal. Routes are prefixed `/fr` and `/en`. All text lives in 
`src/messages/en.json` and `fr.json`; content files store message keys only. 
 
## 16. Success metrics 
- Day-1 and day-7 retention of the pilot cohort. 
- Sessions per player per day and actions per session. 
- Median wealth against the targets in `docs/ECONOMY.md`. 
- Share of players evicted in their first two weeks. 
- Chat reports per 1 000 messages. 
 
## 17. Glossary 
| Term | Meaning | 
|------|---------| 
| FCFA | Central African CFA franc, the currency | 
| Njangi / tontine | Rotating savings group | 
| Benskin | Motorbike taxi | 
| Clando | Unlicensed shared taxi | 
| Radio trottoir | Street rumor network | 
| Eneo | Electricity distributor (power cuts) | 
| Concours | Competitive entrance exam | 
| Feyman | Con artist | 
| Descente au village | The year-end trip to one's home village | 
| MoMo | Mobile money | 
