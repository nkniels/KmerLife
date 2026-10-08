#!/usr/bin/env node 
/** 
 * Seeds GitHub labels, milestones, issues and branch protection for KmerLife. 
 * Requires the GitHub CLI (`gh`), already authenticated (`gh auth status`). 
 * Safe to re-run: labels are upserted, existing milestones/issues are skipped. 
 * 
 * Usage: 
 *   node scripts/bootstrap-github.mjs --repo OWNER/NAME [--dry-run] [--skip-protection] 
 */ 
import { execFileSync } from 'node:child_process'; 
import { readFileSync } from 'node:fs'; 
 
const args = process.argv.slice(2); 
const flag = (name) => args.includes(`--${name}`); 
const value = (name) => { 
  const i = args.indexOf(`--${name}`); 
  return i >= 0 ? args[i + 1] : undefined; 
}; 
 
const repo = value('repo'); 
const dry = flag('dry-run'); 
 
if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) { 
  console.error('Usage: node scripts/bootstrap-github.mjs --repo OWNER/NAME [--dry-run] [--skip-protection]'); 
  process.exit(1); 
} 
 
function gh(ghArgs, input) { 
  if (dry) { 
    console.log(`[dry-run] gh ${ghArgs.join(' ')}`); 
    return ''; 
  } 
  return execFileSync('gh', ghArgs, { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }); 
} 
 
const LABELS = [ 
  ['dev-01', '1D76DB', 'Owner: DEV-01 Kernel and Economy'], 
  ['dev-02', '0052CC', 'Owner: DEV-02 Character, Jobs and Housing'], 
  ['dev-03', '006B75', 'Owner: DEV-03 City, Travel and Venues'], 
  ['dev-04', '5319E7', 'Owner: DEV-04 Platform (auth, database, deploy)'], 
  ['dev-05', 'B60205', 'Owner: DEV-05 Social and Realtime'], 
  ['dev-06', 'E99695', 'Owner: DEV-06 World, Events and Seasons'], 
  ['type:feature', '0E8A16', 'New functionality'], 
  ['type:bug', 'D73A4A', 'Something is broken'], 
  ['type:balance', 'FBCA04', 'Economy or difficulty tuning'], 
  ['type:content', 'C5DEF5', 'Game content (jobs, venues, events, text)'], 
  ['type:infra', 'BFD4F2', 'Tooling, CI, deploy, security'], 
]; 
 
const MILESTONES = [ 
  'Week 1: Foundations', 
  'Week 2: Economy and Content', 
  'Week 3: City and Deploy', 
  'Week 4: Multiplayer', 
  'Week 5: Culture and Pilot Prep', 
  'Week 6: Pilot', 
]; 
 
console.log('== Labels'); 
for (const [name, color, description] of LABELS) { 
  gh(['label', 'create', name, '--repo', repo, '--color', color, '--description', description, '--force']); 


} 
 
console.log('== Milestones'); 
for (const title of MILESTONES) { 
  try { 
    gh(['api', `repos/${repo}/milestones`, '-f', `title=${title}`]); 
  } catch (err) { 
    const msg = String(err?.stderr ?? err?.message ?? err); 
    if (msg.includes('already_exists')) console.log(`milestone exists: ${title}`); 
    else throw err; 
  } 
} 
 
console.log('== Issues'); 
const issues = JSON.parse(readFileSync(new URL('./issues.json', import.meta.url), 'utf8')); 
let existingTitles = new Set(); 
if (!dry) { 
  const out = gh(['issue', 'list', '--repo', repo, '--state', 'all', '--limit', '500', '--json', 
'title']); 
  existingTitles = new Set(JSON.parse(out).map((i) => i.title)); 
} 
for (const issue of issues) { 
  if (existingTitles.has(issue.title)) { 
    console.log(`issue exists: ${issue.title}`); 
    continue; 
  } 
  const ghArgs = ['issue', 'create', '--repo', repo, '--title', issue.title, '--body', issue.body]; 
  for (const label of issue.labels) ghArgs.push('--label', label); 
  ghArgs.push('--milestone', issue.milestone); 
  gh(ghArgs); 
} 
 
if (flag('skip-protection')) { 
  console.log('== Branch protection skipped (--skip-protection)'); 
} else { 
  console.log('== Branch protection on main'); 
  const protection = { 
    required_status_checks: { strict: true, contexts: ['validate'] }, 
    enforce_admins: false, 
    required_pull_request_reviews: { 
      required_approving_review_count: 1, 
      require_code_owner_reviews: true, 
      dismiss_stale_reviews: true, 
    }, 
    restrictions: null, 
  }; 
  try { 
    gh(['api', '-X', 'PUT', `repos/${repo}/branches/main/protection`, '--input', '-'], 
JSON.stringify(protection)); 
    console.log('branch protection applied'); 
  } catch (err) { 
    const msg = String(err?.stderr ?? err?.message ?? err); 
    console.error('BRANCH PROTECTION NOT APPLIED. GitHub said:\n' + msg); 
    console.error( 
      'Likely cause: private repos on a free personal plan cannot use branch protection. ' + 
        'Options: GitHub Pro (free via the Student Developer Pack), move the repo to an organization on a paid plan, ' + 
        'or make the repo public. Report this to the user; do not work around it silently.', 
    ); 
    process.exitCode = 2; 
  } 
} 
console.log('Done.'); 
