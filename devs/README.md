# KmerLife Team Ownership Map

This is the quick-reference map for the entire KmerLife development team (both human developers and AI agents). It outlines domain responsibilities, strict ownership boundaries, and architectural dependencies.

## 1. KmerLife Team Ownership

| Developer ID | Domain | Primary responsibility | Main owned paths | Important shared paths | Read-only areas |
|---|---|---|---|---|---|
| **DEV-01** | Lead, Kernel and Economy | Rules engine, constants, simulator, CI, docs, merges | `/src/game/*.ts`, `/scripts/**`, `/tests/game/**`, `/docs/**`, `/devs/**`, `/.github/**`, root docs | `/src/lib/**`, `/src/server/**` | `/src/game/modules/<feature>/`, `/src/features/**`, `/src/app/**`, `/supabase/**` |
| **DEV-02** | Character, Jobs and Housing | Creation flow, dashboard, jobs, housing and rent UI | `/src/game/modules/jobs/**`, `/src/game/modules/housing/**`, `/src/features/character/**`, `/src/features/dashboard/**` | None | `/src/game/*.ts`, `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**`, other features |
| **DEV-03** | City, Travel and Venues | Map, venues, travel | `/src/game/modules/travel/**`, `/src/game/modules/venues/**`, `/src/features/city/**`, `/content/venues*` | None | `/src/game/*.ts`, `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**`, `/src/services/realtime/**` |
| **DEV-04** | Platform | Next.js shell, Supabase, auth, deploy, secrets | `/supabase/**`, `/src/app/**`, `/.env.example` | `/src/server/**` | `/src/game/**`, `/src/features/**`, `/src/services/**` |
| **DEV-05** | Social and Realtime | Presence, chat, njangi, offline queue, reminders | `/src/game/modules/njangi/**`, `/src/game/modules/social/**`, `/src/features/social/**`, `/src/services/realtime/**` | None | `/src/game/*.ts`, `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**`, other features |
| **DEV-06** | World, Events and Seasons | Rumors, power cuts, echoes, seasons | `/src/game/modules/events/**`, `/src/game/modules/seasons/**`, `/src/services/world/**`, `/content/events*` | None | `/src/game/*.ts`, `/src/app/**`, `/src/lib/**`, `/src/server/**`, `/supabase/**`, `/src/services/realtime/**` |

## 2. Ownership Boundaries

To protect the integrity of the project, **each developer owns their defined paths strictly:**
- Developers **must not edit** another developer's owned paths.
- Shared areas must be edited by following the precise rules outlined in the relevant developer cards.
- If a task crosses an ownership boundary, the responsible developer must be identified rather than silently editing their code.

If a required edit is outside your domain's ownership, you must stop and declare:
**"This belongs to DEV-0X."**

## 3. Architecture Dependency Map

The game relies on a strict foundation where feature logic safely depends on a centralized, pure rules kernel:

```text
DEV-02 / DEV-03 / DEV-05 / DEV-06 Feature Modules
                   ↓
            Shared contracts
                   ↓
         src/game/ Rules Kernel
                   ↓
           DEV-01 Foundation
                   ↓
            Server boundary
                   ↓
        Database / DEV-04 Platform
```

## 4. Where To Look

When determining facts or protocols, refer strictly to these global contracts:
* `AGENTS.md` — global AI-agent rules.
* `CONVENTIONS.md` — project coding conventions.
* `interfaces.md` — pure function APIs and cross-developer hooks.
* `devs/DEV-01.md` … `devs/DEV-06.md` — the authoritative detailed developer cards.
* `devs/README.md` — this quick team ownership map.
* `.github/CODEOWNERS` — the enforced ownership and PR review boundaries.

## 5. Developer Handoff Rules

When an AI agent receives a task that explicitly crosses ownership boundaries, it must behave cooperatively:
1. Identify the required owner of the external path.
2. Stop before editing outside the current developer's ownership limits.
3. State exactly: **"This belongs to DEV-0X."**
4. Describe the proposed required change clearly.
5. Let the currently assigned responsible developer finish and coordinate the handoff.

## 6. Keep This Document Synchronized

This document is exactly what it claims to be: a quick-reference map. **It must NOT become a second conflicting source of truth.**
* Detailed ownership constraints are sourced exclusively from the individual `devs/DEV-0X.md` cards.
* `.github/CODEOWNERS` is the mechanical enforcement mechanism at the CI/CD level.
* If any architectural ownership changes, the relevant `DEV-0X.md` developer card and `CODEOWNERS` must be updated together.
