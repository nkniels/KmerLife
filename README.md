# KmerLife 
 
A real-time multiplayer browser life-simulation game set in Cameroon. Players create characters, 
work, eat, pay rent, join njangi groups and live in a shared city. Yaoundé first, then Douala and 
Buea. French and English. 


 
## Quick start 
``` 
node -v        # 20 or newer 
npm install 
npm run lint && npm run typecheck && npm test 
npm run simulate -- --players 400 --days 60 --seed 7 
``` 
 
## The team 
See `devs/README.md`. Six developers, each owning a feature end to end. Ownership is enforced by 
`.github/CODEOWNERS`. 
 
## How we work 
1. Load your dev card (`devs/DEV-0X.md`) into your AI IDE as persistent context. 
2. Start every prompt with `[DEV-0X] [DOMAIN: your-domain]`. 
3. Edit only inside your owned paths. If you need something elsewhere, open an issue or a note for 
the owner. 
4. Every change is a pull request. CI must pass and a code owner must approve. 
5. Game numbers live only in `src/game/constants.ts`. Economy changes need simulator output. 
 
## Documents 
- `docs/GAME_DESIGN.md`: what we are building 
- `docs/ARCHITECTURE.md`: how it is built 
- `docs/ECONOMY.md`: the numbers and how to tune them 
- `docs/ROADMAP.md`: six-week plan (also in GitHub issues and milestones) 
- `AGENTS.md`, `CONVENTIONS.md`, `interfaces.md`: rules for humans and AI agents 
