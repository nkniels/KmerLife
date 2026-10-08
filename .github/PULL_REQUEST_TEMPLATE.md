## What and why 
<!-- One short paragraph. Link the issue: Closes #123 --> 
 
## Owner and domain 
- Dev: DEV-0_ 
- Files touched are all inside my domain (see .github/CODEOWNERS): yes / no (explain) 
 
## Checklist 
- [ ] `npm run lint`, `npm run typecheck`, `npm test` pass locally 
- [ ] No hardcoded game numbers (everything from `src/game/constants.ts`) 
- [ ] No user-facing strings in code (messages in `src/messages/en.json` and `fr.json`) 
- [ ] If I changed a contract, I updated `interfaces.md` in this PR 
- [ ] If I touched the economy, I attached `npm run simulate` output 
