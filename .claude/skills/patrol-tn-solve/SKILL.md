---
name: patrol-tn-solve
description: "Autonomous, unattended bug-patrol for the 3 TN Solve repos — runs fix-tn-solve's full investigate-and-fix process, then decides whether any bug it actually fixed is severe enough to deploy to production immediately or should wait for the nightly midnight batch. Has two distinct trigger modes (patrol vs nightly-flush) driven by the schedule that invokes it. Runs straight through without pausing for confirmation — this IS the pre-authorized unattended routine. Triggers on: chạy patrol, dò bug tự động, patrol tn solve, nightly deploy flush."
---

Base directory for this skill: resolve at run time per the "Local repos"
rule below — this file is deliberately duplicated verbatim into all 3 repos
(`TN_Solve-Server/.claude/skills/patrol-tn-solve/SKILL.md`,
`TN_Solve-Extension/.claude/skills/patrol-tn-solve/SKILL.md`,
`TN_Solve-Web/.claude/skills/patrol-tn-solve/SKILL.md`) so it works no matter
which repo the scheduled run starts in. Same reasoning as `deploy-tn-solve`
and `fix-tn-solve`.

[2026-09-11] This skill exists because the user explicitly asked for an
unattended, scheduled "bug-hunter employee" for this project — running via
cron/schedule with nobody watching in real time. That changes what's safe to
do on its own initiative: this skill is EXPLICITLY pre-authorized to run
`fix-tn-solve`'s fix-and-push flow AND, when its own severity check below
says so, `deploy-tn-solve`'s production deploy — with NO confirmation
prompt, because there is no one there to answer one. This overrides the
general "ask before deploying" rule for this specific, scheduled, narrowly-
defined workflow only, exactly the way explicitly invoking `deploy-tn-solve`
already does for a live user request. Everything this skill does (or
deliberately doesn't do) must still be reported plainly when it finishes,
same as any other skill run.

## Local repos — resolve by RELATIVE path

Same rule as `deploy-tn-solve`/`fix-tn-solve`: resolve "this repo" via
`git rev-parse --show-toplevel`, the other 2 repos are its sibling folders
(`../TN_Solve-Server`, `../TN_Solve-Extension`, `../TN_Solve-Web`). If a
sibling isn't found, stop and say so in the report rather than guessing.

## Two trigger modes

This skill is invoked by two separate scheduled crons with different
prompts — read which mode you were asked to run and follow ONLY that
section. Never run both modes in the same invocation.

### Mode A — Patrol (every 3 hours)

1. Run `fix-tn-solve` in full — Steps 1 through 5 exactly as documented
   there (pull logs from all 4 apps, classify Google-origin/capacity/
   internal, the zero-th "already fixed?" check, the severity queue, the
   90%-confidence loop with its 30-minute-per-bug cap and the `Confidence:
   NN%` hard gate, commit + push any real fixes, report).
2. For every bug this run ACTUALLY FIXED (not skipped, not left unresolved,
   not "already fixed pending deploy" from the zero-th check) — run the
   severity check below. If ANY fixed bug in this run meets ANY of the
   immediate-deploy criteria, run `deploy-tn-solve` in full (its own Step 1
   will find nothing new to push for the repos already pushed by
   `fix-tn-solve` in step 1 above, and Step 2/2b/2c handle the rest exactly
   as that skill defines — no changes needed to it, just invoke it).
3. If nothing fixed this run meets the criteria (including "nothing was
   fixed at all this run"): do NOT deploy. The pushed commits (if any) sit
   in the repos, undeployed, until either a later patrol run finds something
   severe enough, or the Mode B nightly flush picks them up at midnight.

#### Severity check — deploy now vs wait for midnight

For each bug just fixed in step 1, explicitly write a line
`Severity: IMMEDIATE-DEPLOY | DEFER-TO-MIDNIGHT — <one-sentence reason>`
before deciding, mirroring `fix-tn-solve`'s `Confidence: NN%` gate. Default
to `DEFER-TO-MIDNIGHT` — only choose `IMMEDIATE-DEPLOY` when you can point
to concrete, current evidence (not a hypothetical) for at least one of:

- **Active crash loop**: `pm2 jlist` shows `unstable_restarts` climbing /
  the app is actively cycling right now on one of the 4 production apps —
  not just "it restarted once earlier."
- **Core flow fully broken for most/all users right now**: e.g. login
  failing for effectively everyone, video/image generation failing across
  the board (not one account/one worker/one content type), the public site
  returning 5xx broadly — not a rare edge case or a single affected
  account.
- **Security or data-integrity issue**: a leaked secret, an auth bypass, data
  corruption or loss actively happening or newly exposed by what you found.
- **High, currently-ongoing frequency in the very log window you just
  read**: the failure is dominating the log RIGHT NOW (not "it happened a
  lot earlier today and has since tapered off").

When genuinely unsure whether something clears this bar, that uncertainty
itself means `DEFER-TO-MIDNIGHT` — the cost of waiting a few hours for a
routine bug is far lower than an unsupervised deploy at 3am on a shaky
justification. This is a stricter, not laxer, bar than the 90% fix-confidence
gate — being confident IN THE ROOT CAUSE (required to fix it at all) is a
separate question from whether it's severe enough to interrupt production
unattended right now.

### Mode B — Nightly deploy flush (once daily, 00:00)

Purpose: catch anything patrol runs during the day pushed but judged not
severe enough to deploy immediately, so it doesn't sit undeployed
indefinitely.

1. For TN_Solve-Server and TN_Solve-Extension: check whether production is
   behind the repo's remote `main` — SSH in, `git fetch && git log
   HEAD..origin/main --oneline` (or equivalent) for each of the production
   paths (`/var/www/TN_Solve-Server`, `/var/www/TN_Solve-Extension`). Also
   check each local clone (this session's working copies) for anything
   committed-but-unpushed — push it first if so (same as `deploy-tn-solve`
   Step 1), then re-check production-vs-remote.
2. If EITHER repo shows production is behind remote main: run
   `deploy-tn-solve` in full (covers both repos' push/pull/build/restart/
   clean-slate together, exactly as documented there — do not invent a
   partial/manual version of it here).
3. If NEITHER repo has anything new since the last deploy: do nothing — do
   NOT run `deploy-tn-solve` just because midnight arrived. Restarting the 4
   production apps for no reason interrupts in-flight tasks for zero
   benefit; the whole point of this mode is "deploy only if something is
   actually waiting," not "deploy on a fixed schedule regardless." Report
   plainly that there was nothing pending and no deploy ran.

## Report

Same spirit as `fix-tn-solve` Step 5 and `deploy-tn-solve` Step 3 — plain,
concrete, no hedging. State which mode ran, what `fix-tn-solve` found/fixed/
skipped/left unresolved (Mode A) or what production-vs-remote check found
(Mode B), the `Severity:` line and reasoning for every bug fixed in Mode A,
and whether a deploy happened — and if so, its full `deploy-tn-solve`-style
summary (commits, restarts, health check). If something looked ambiguous or
you were genuinely unsure of a severity call, say so explicitly rather than
presenting a judgment call as obviously correct.
