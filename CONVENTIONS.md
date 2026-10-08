# Conventions 
 
## Stack 
- Next.js (App Router), React, TypeScript (strict), Tailwind CSS, Zustand 
- Supabase (Postgres, Auth), Ably (realtime, behind an interface), Vercel (hosting) 
- Vitest for tests, ESLint with typescript-eslint, zod for validation 
- Node 20 or newer 
 
## Folder structure 
- `src/game/`: pure rules kernel. Top-level files are owned by DEV-01; feature rules go in 
`src/game/modules/<feature>/`. 
- `src/features/<feature>/`: feature UI, owned by that feature's dev. 
- `src/app/`: Next.js routes. Thin shells that import from `src/features/*`. Owned by DEV-04. 
- `src/server/`: the action handler and database mapping. DEV-01 and DEV-04. 
- `src/services/`: realtime (DEV-05) and world (DEV-06). 
- `src/lib/`: shared clients and generated types. DEV-01. 
- `src/messages/`: `en.json` and `fr.json`, always updated together. 
- `content/`: game data as JSON; names are message keys. 
- `supabase/`: migrations and seed. DEV-04. 
- `scripts/`: simulator and GitHub bootstrap. DEV-01. 
 
## Naming 


- Files and folders: `kebab-case` 
- Components: `PascalCase`; functions and variables: `camelCase`; types: `PascalCase` 
- Constants: `SCREAMING_SNAKE_CASE` 
- Ids in content and constants: `snake_case` for jobs, `kebab-case` for venues 
 
## Rules 
- Money is an integer number of FCFA. Never use floats for money. 
- All times in the kernel are epoch milliseconds from the server clock. 
- Feature modules are registered with the engine through a small PR reviewed by DEV-01. 
- No new dependency without a vote in the team chat. 
- Commits: short imperative subject. Branches: `dev-0X/short-topic`. 
- Pull requests: use the template; one concern per PR. 
- Secrets: only in the hosting dashboards and local `.env.local`. Server-only keys never get a 
`NEXT_PUBLIC_` prefix. 
