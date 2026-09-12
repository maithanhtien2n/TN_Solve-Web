---
name: patrol-tn-solve
description: "Autonomous, unattended bug-patrol for the 3 TN Solve repos — runs fix-tn-solve's full investigate-fix-commit-push process on a schedule and reports back. Does NOT deploy to production on its own initiative under any circumstance — every actual deploy stays a separate, explicit, human-triggered action. Two distinct trigger modes (patrol vs nightly-check) driven by the schedule that invokes it. Runs the investigate/fix/push flow straight through without pausing for confirmation — that part IS pre-authorized; deploying never is. Triggers on: chạy patrol, dò bug tự động, patrol tn solve, nightly deploy flush."
---

Base directory for this skill: resolve at run time per the "Local repos"
rule below — this file is deliberately duplicated verbatim into all 3 repos
(`TN_Solve-Server/.claude/skills/patrol-tn-solve/SKILL.md`,
`TN_Solve-Extension/.claude/skills/patrol-tn-solve/SKILL.md`,
`TN_Solve-Web/.claude/skills/patrol-tn-solve/SKILL.md`) so it works no matter
which repo the scheduled run starts in. Same reasoning as `deploy-tn-solve`
and `fix-tn-solve`.

[2026-09-12] Revised after an explicit user safety concern, replacing an
earlier version of this skill. That earlier version let this skill decide on
its own, unsupervised, whether to run `deploy-tn-solve` immediately for a
bug it judged "severe enough", or at the nightly 00:00 batch otherwise. The
user pushed back — correctly — on 2 real gaps: (1) both the fix's 90%
confidence gate AND the deploy-severity judgment are self-assessed by the
same unattended run, with nothing independent checking either one; (2) there
is no full regression-test suite backing that self-assessment, only a
syntax check and whatever manual repro the investigation happened to build.
Combined with this routine running unattended and repeatedly (every 3
hours), an autonomous production deploy on that basis was judged too risky
to keep. **This skill therefore now NEVER runs `deploy-tn-solve`, in either
mode, for any reason — full stop.** It remains pre-authorized to run
`fix-tn-solve`'s investigate-fix-commit-push flow straight through without
pausing for confirmation, because that part never touches live production
and a bad commit is trivially reversible via `git revert` before it's ever
deployed. Every actual production deploy is a separate, explicit,
human-triggered action from here on, exactly like any other time
`deploy-tn-solve` gets invoked.

## Local repos — resolve by RELATIVE path

Same rule as `deploy-tn-solve`/`fix-tn-solve`: resolve "this repo" via
`git rev-parse --show-toplevel`, the other 2 repos are its sibling folders
(`../TN_Solve-Server`, `../TN_Solve-Extension`, `../TN_Solve-Web`). If a
sibling isn't found, stop and say so in the report rather than guessing.

## Two trigger modes

This skill is invoked by two separate scheduled runs with different
prompts — read which mode you were asked to run and follow ONLY that
section. Never run both modes in the same invocation.

### Mode A — Patrol (every 3 hours)

1. Run `fix-tn-solve` in full — Steps 1 through 5 exactly as documented
   there (pull logs from all 4 apps, classify Google-origin/capacity/
   internal, the zero-th "already fixed?" check, the severity queue, the
   90%-confidence loop with its 30-minute-per-bug cap and the `Confidence:
   NN%` hard gate, commit + push any real fixes, report). This step already
   stops at "commit + push to git" — it does not touch production on its
   own, per `fix-tn-solve`'s own Step 4.
2. For every bug this run ACTUALLY FIXED (not skipped, not left unresolved,
   not "already fixed pending deploy" from the zero-th check), still write a
   `Severity: HIGH | NORMAL — <one-sentence reason>` line using the same 4
   criteria as below — but treat it as PURELY INFORMATIONAL now, never as a
   trigger for any action. Its only purpose is to make your final report
   immediately scannable, so the user can tell at a glance which pushed
   commits are worth deploying soon versus which can comfortably wait.
3. Do NOT call `deploy-tn-solve` from this mode, under any circumstance,
   regardless of what the `Severity:` line says. Deploying — even for
   something this run judges HIGH — is left entirely to the user's own
   judgment once they actually read the report. The commits sit pushed in
   git, undeployed, until the user runs `deploy-tn-solve` themselves.

#### Severity line — informational only, for the report

Write `Severity: HIGH | NORMAL — <one-sentence reason>` for every bug fixed
this run. Only mark `HIGH` when you can point to concrete, current evidence
(not a hypothetical) for at least one of:

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

When genuinely unsure, mark `NORMAL` — this label no longer gates any
action, so there's no cost to being conservative with `HIGH`; it exists only
to help the user triage the report quickly.

### Mode B — Nightly check (once daily, 00:00)

Purpose: give the user a clear daily snapshot of what's pushed-but-undeployed
across the 2 deployable repos, so nothing sits forgotten for days — WITHOUT
deploying anything itself.

1. For TN_Solve-Server and TN_Solve-Extension: check each local clone (this
   session's working copies) for anything committed-but-unpushed — push it
   first if so (same as `deploy-tn-solve` Step 1). Then check whether
   production is behind the repo's remote `main` — SSH in, `git fetch &&
   git log HEAD..origin/main --oneline` (or equivalent) for each of the
   production paths (`/var/www/TN_Solve-Server`, `/var/www/TN_Solve-Extension`).
2. Report plainly whether either repo has anything pending: list the exact
   commits (hash + message) production is missing, if any.
3. Do NOT run `deploy-tn-solve` from this mode, under any circumstance, even
   if production is clearly behind. This mode is a visibility check only —
   the user deploys manually, whenever they judge it's a good time.

## Report

Same spirit as `fix-tn-solve` Step 5 and `deploy-tn-solve` Step 3 — plain,
concrete, no hedging. State which mode ran, what `fix-tn-solve` found/fixed/
skipped/left unresolved (Mode A) or what the production-vs-remote check
found (Mode B), and the `Severity:` line + reasoning for every bug fixed in
Mode A. Always end with one explicit, unambiguous line for the user to
skim: either "Không có gì cần deploy gấp — N commit đang chờ, deploy khi
tiện" or "Có bug mức HIGH vừa fix (<tên bug>) — cân nhắc deploy sớm" (Mode A),
or "Production đã cập nhật đầy đủ, không có gì đang chờ" / "Production đang
thiếu N commit: <liệt kê>" (Mode B). Never phrase this line as though a
deploy already happened or will happen automatically — it never does from
this skill. If something looked ambiguous or you were genuinely unsure of a
severity call, say so explicitly rather than presenting a judgment call as
obviously correct.
