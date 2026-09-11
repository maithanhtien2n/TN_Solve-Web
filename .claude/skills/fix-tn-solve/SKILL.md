---
name: fix-tn-solve
description: "Check production logs across all 3 TN Solve repos, skip errors that Google itself returned (quota/policy/timeout from Flow or Gemini), and for everything else investigate in a loop — never touch code below 90% confidence in the root cause, keep digging deeper until past that bar, only then fix. Triggers on: check logs prod, kiểm tra log production, tìm lỗi production, sửa lỗi production, check logs và sửa lỗi."
---

Base directory for this skill: resolve at run time per the "Local repos" rule
below — this file is deliberately duplicated verbatim into all 3 repos
(`TN_Solve-Server/.claude/skills/fix-tn-solve/SKILL.md`,
`TN_Solve-Extension/.claude/skills/fix-tn-solve/SKILL.md`,
`TN_Solve-Web/.claude/skills/fix-tn-solve/SKILL.md`) so it works no matter
which repo Claude Code is started in. Same reasoning as `deploy-tn-solve`.

## Who you are while running this skill

You are a notorious bug-killer, not a polite report-writer. This is not a
tone suggestion — it changes what "done" means. Finding a bug is not the job;
the job is finished only when the bug is DEAD (fixed at its actual root and
verified) or CLEARED (rigorously disproven with real evidence, not waved off
because digging further got hard or slow). A bug that survives a run of this
skill — still lurking, un-investigated, or patched-over-but-not-fixed — is a
failure of the run, full stop, no matter how good the write-up sounds.

Concretely, this means: no stopping at "I think it might be X" when one more
hour of digging would tell you for sure. No accepting the first
plausible-looking explanation without trying to break it. No treating a
retry/timeout/catch-and-ignore as a fix when it's actually camouflage for a
defect you didn't fully chase down. No writing "likely caused by..." in the
final report when what actually happened is you stopped early. If a bug is
still alive when you report back, SAY THAT PLAINLY — don't dress up an
incomplete kill as a finished one.

## Local repos — resolve by RELATIVE path, never hardcode an absolute one

1. "This repo" = wherever the current working directory's repo root is
   (`git rev-parse --show-toplevel` if unsure).
2. The other 2 repos = its SIBLING FOLDERS — `../TN_Solve-Server`,
   `../TN_Solve-Extension`, `../TN_Solve-Web` (whichever names are NOT the
   current repo), relative to this repo's root. Only requires the 3 repos
   sit side-by-side under the same parent folder — that parent's name/location
   doesn't matter and can differ machine to machine.
3. If a sibling folder isn't found next to the current repo, STOP and ask the
   user where the other repo is checked out instead of guessing a path.

## Production access

`ssh -i ~/.ssh/tnsolve_server root@110.172.28.201`, PM2/node on PATH via
`export PATH=/root/.nvm/versions/node/v22.21.1/bin:$PATH;` (prefix every SSH
command with this).

The 3 repos map to 4 PM2 apps / log prefixes on production:

| Repo | PM2 app | Production path | Error log | Out log |
|---|---|---|---|---|
| TN_Solve-Server | `tn_solve-be` | `/var/www/TN_Solve-Server` | `tn-solve-be-error.log` | `tn-solve-be-out.log` |
| TN_Solve-Extension | `tnsolve-gen` | `/var/www/TN_Solve-Extension/server` | `tnsolve-gen-error.log` | `tnsolve-gen-out.log` |
| TN_Solve-Extension | `gemini-hana-service` | `/var/www/TN_Solve-Extension/gemini-hana-service` | `gemini-hana-service-error.log` | `gemini-hana-service-out.log` |
| TN_Solve-Web | `tn_solve-fe` | `/var/www/TN_Solve-Web` | `tn-solve-fe-error.log` | `tn-solve-fe-out.log` |

All logs live under `/root/.pm2/logs/` on the server. Re-verify this table via
`pm2 jlist` / `pm2 describe <app>` if it ever looks stale (paths/log names
change if PM2 is ever reconfigured).

## Step 1 — pull recent logs from all 4 apps

For each app above, pull a reasonable recent window (e.g. `tail -n 2000` of
the `-error.log`, more if the app is quiet and 2000 lines span too little
time, less if it's extremely chatty and 2000 lines is only a few minutes).
Also skim the matching `-out.log` tail — some real errors get logged at INFO
level there instead of to `-error.log` (this has happened before — see
`tn_solve-be` HTTP access logs written to stdout at what looks like ERROR
level, and worker-status lines that carry real failure info in `tnsolve-gen`'s
out log).

Get an overview first: `grep -oE` a handful of characteristic substrings and
`sort | uniq -c | sort -rn` to see WHICH distinct error shapes are actually
present and how often, before reading full stack traces one by one. Note the
restart count (`pm2 jlist` → `restart_time` / `unstable_restarts`) for each
app — a crash loop (`unstable_restarts` climbing) is a different urgency tier
than steady-state noise.

## Step 2 — classify every distinct error shape: Google-origin vs internal

This system (TN_Solve-Extension/tnsolve-gen) automates Google Flow
(flow.google.com) and calls Gemini to generate video/image content. A large
fraction of "errors" in its logs are Google itself refusing or failing the
request, not our bug. SKIP investigating these — known Google-origin shapes
seen so far (this list will go stale; use judgment for new ones, the
identifying trait is "the failure message IS Google's own response/behavior,
not something our code decided"):

- `QUOTA_EXCEEDED`, `NOT_FOUND` on `as29s`/`jwpduf` rpc calls — account
  throttled by Google mid-render.
- `PUBLIC_ERROR_*` (`PROMINENT_PEOPLE_FILTER_FAILED`, `UNSAFE_GENERATION`,
  `DANGER_FILTER`, `UNUSUAL_ACTIVITY`, `UNUSUAL_ACTIVITY_TOO_MUCH_TRAFFIC`,
  `USER_REQUESTS_THROTTLED`) — Google content-policy / abuse-detection
  rejecting the generation.
- `Video generation timed out after N minutes` where the diag shows the
  prompt was actually submitted (`onProjectPage:true`, `editorFound:true`)
  but Google's page never produced media (`videoElementCount:0`) — Flow just
  hung server-side.
- Gemini returning conversational prose instead of the requested JSON
  (`Gemini không trả về JSON hợp lệ`) — model didn't follow the schema; only
  Google-origin if the code already has retry/fallback handling for it (check
  before skipping — if there's NO fallback and this crashes something, that
  gap IS our bug even though the trigger was Gemini).

Do NOT skip an error just because it superficially resembles this list —
read the actual message and confirm the failure genuinely originated on
Google's side for THIS occurrence, not just that the general category has
looked Google-related before.

### Second skip category: genuine capacity/infrastructure limitation

Use human judgment here, the same way a strict, skeptical engineering
manager reviewing a root-cause report would — not a tired on-call engineer
looking for the fastest way to close the ticket. Approach every candidate for
this bucket assuming it's probably NOT actually external until proven
otherwise; this category only covers causes that are genuinely, verifiably
OUTSIDE the code's control (real resource provisioning is one instance of
that, not the definition of the category). It is not a convenient bucket for
"this looks infrastructure-y" or "this kind of error usually isn't our bug" —
those are exactly the assumptions a demanding reviewer would reject and send
back for more digging. Default to suspicion, not to skipping.

`"No available VideoTab slots. All workers are busy or disconnected"` is the
canonical legitimate example — if there genuinely are more concurrent
video_tab tasks queued than `(connected workers) × (configured max slots per
worker)` can serve, rejecting the excess is the SYSTEM WORKING AS DESIGNED,
not a bug — skip it, same as Google-origin. But that conclusion has to be
EARNED with real numbers, every time, not assumed from the message shape.

Do NOT reach for this category as an easy way out. Verify it with real
numbers before skipping — pull the actual connected worker count
(`GET /api/workers` or `pm2`/DB), the actual configured max-slots-per-worker
setting, and the actual concurrent demand at the time of the failures, and
confirm demand genuinely exceeds that ceiling. If instead the ACCOUNTING that
decides "no slots" looks internally inconsistent — e.g. the same task+worker
pair being redispatched dozens of times in a tight loop while that worker
simultaneously self-reports idle/available, two different tasks sharing one
counted "pool" when only one of them is actually rate-limited, a slot that
never gets released after its task finishes or times out, a counter that can
go negative or not reset — that is NOT "not enough resources", that is a code
bug in the capacity-tracking/dispatch logic, and belongs in Step 3, no matter
how much it superficially looks like an "out of capacity" message. When in
doubt, spend the extra round in Step 3 to check the numbers before skipping —
skipping a real code bug into this bucket is a worse mistake than spending 10
extra minutes confirming it's genuinely resource-bound.

Everything else — anything where OUR code decided the outcome (a thrown
exception, a bad state transition, a race condition, a missing null check, a
retry loop with no backoff hammering our own server, a UI bug, a wrong query,
a capacity-accounting bug per above, etc.) — goes to Step 3.

### Work the FULL list, most severe → least severe — never stop at the first one

Before investigating anything, compile every distinct error shape that didn't
get skipped in Step 2 into one queue, ordered by severity (crash/data-loss/
mass-failure first) then by frequency. Then work through the ENTIRE queue,
one at a time, via the Step 3 loop below — not just the loudest one.

[2026-09-11] Explicit user requirement: check logs and fix from the most
serious bug down to the smallest one — none get skipped, however minor.
Finishing the #1 issue is not a stopping point; it's one item off the queue.
A run that fixes 1 big bug and never looks at the 5 smaller ones sitting in
the same logs is an incomplete run, not a successful one.

### Zero-th check — has this EXACT error already been addressed?

[2026-09-11] Explicit user requirement, before spending a single minute of
the confidence loop below on an error: check whether it's already been
fixed in a past commit sitting in the local repo, and if so, whether that
fix has actually reached production yet. Skipping this check risks two real
mistakes: re-investigating (or re-fixing, possibly in a conflicting way)
something already solved but not yet deployed, OR — worse — silently
crediting a fix that was deployed but didn't actually work, and moving on
without noticing the bug is still alive.

1. Search for prior work on this exact failure: `git log --oneline` and grep
   the relevant source file's comments for the error's distinctive
   substrings. This codebase has a strong habit of documenting past
   investigations directly in code comments (date, root cause, what was
   tried, sometimes an explicit "why NOT fixed this way" decision) — a
   matching comment or commit is the common case, not the rare one. Check
   ALL 3 repos, not just the one the error superficially "belongs to" — a
   fix can live on the other side of a client/server boundary.
2. If a plausible past fix is found, determine whether it's actually live on
   production: SSH in and compare `git log -1` on the relevant app's
   production path against the commit that introduced the fix. A reliable
   way to place the log evidence in time relative to that: `deploy-tn-solve`
   ALWAYS flushes the 4 apps' PM2 logs as part of its own run (Step 2c) —
   so if the app has been deployed even once since the fix, and the log
   still shows the failure, that log line is guaranteed to be FROM AFTER
   the fix (the flush erased everything older); if the app's `pm2 jlist`
   restart time predates the fix commit entirely, the app hasn't picked up
   the fix yet regardless of what the log shows.
   - **Fixed locally, not yet deployed**: the log entries are almost
     certainly stale evidence from before the fix, not proof the system is
     still broken. Do NOT re-investigate or re-fix it. Note it in Step 5's
     report as "already fixed locally (commit X), pending deploy" and move
     to the next item in the queue — this is not a fresh bug needing a new
     fix, just an unshipped one.
   - **Deployed, and the failure still recurs in logs that postdate that
     deploy**: the earlier fix did not actually work. This is MORE serious
     than an untouched fresh bug of the same shape, not less — a fix that
     silently failed already burned one investigation cycle and gave false
     confidence. Bump it up the severity queue. Do not just re-confirm the
     old hypothesis or reapply the same fix harder — treat that hypothesis
     as FALSIFIED by the fact it's still happening, and go into Step 3's
     loop hunting for what the previous investigation actually missed.
   - **No past fix found at all**: proceed to Step 3's loop as normal — this
     one is genuinely fresh.

## Step 3 — investigate each non-Google, non-capacity error in a confidence loop

For every distinct internal-error shape found: **do not edit any code below
90% confidence that you have correctly identified the root cause and that
your fix addresses it.** This is a hard floor, not a guideline — guessing at
a plausible-sounding cause and patching it is exactly what this loop exists
to prevent.

**Be persistent. Do not give up after one or two rounds just because the
first obvious file didn't fully explain it.** Bouncing off a hard bug after a
shallow look and reporting "unresolved, needs more investigation" is a
failure mode this loop exists to prevent, same as guessing — if the evidence
so far points somewhere (another file, the OTHER side of a client/server
boundary, the browser, a different repo entirely) go there and keep going.
Reserve "stop and report unresolved" (point 5 below) for after you have
actually exhausted the concrete avenues available to you, not for after the
first one or two didn't pan out.

**Fix the root cause, not the symptom.** If the "fix" you're converging on is
mainly "add a retry", "add a delay/backoff", "catch and ignore", or "bump a
timeout/limit number" — that is very likely a band-aid, not a real fix, UNLESS
you have specifically identified that the underlying condition is genuinely
transient/external (e.g. a real network blip) and retrying is the CORRECT
handling for that specific condition. If the actual defect is a race
condition, a stale/leaked resource, a wrong counter, a logic error, a missing
state transition, etc., fix THAT — the thing that should never have happened
— not just make the symptom happen less often or get silently swallowed.

[2026-09-11] Explicit user requirement: cap the confidence-building loop below
at **30 minutes of wall-clock investigation PER BUG** (note the mental/actual
start time when you begin working a given bug from the queue). Inside that
30 minutes, be exactly as persistent as the rest of this section demands —
do not give up after 1-2 rounds, keep digging, keep verifying — the cap
exists to bound a single hard bug from consuming the whole run, not to give
permission to quit early. If you hit 90% before 30 minutes, fix it (normal
flow). If 30 minutes elapses and you're still below 90%, stop THIS bug per
point 5 below, record it as unresolved, and move to the next bug in the
severity queue — don't let one stubborn bug block investigating the rest.

Loop:
1. Gather evidence: read the exact source lines the log/stack trace points
   to, check `git log -p`/`git blame` on that code for recent related
   changes, correlate error timestamps with recent deploys or traffic
   patterns, check how often it happens and under what conditions (grep
   counts, time-of-day, specific accounts/workers/task types). If the trail
   crosses a repo boundary (e.g. server.js dispatch logic vs the Chrome
   extension's own worker.ts/content-script code actually running in the
   browser), follow it there too — don't stop at the first repo just because
   it's the one already open.
2. Form a specific, falsifiable hypothesis — not "something about the retry
   logic" but "X happens because function Y does Z when condition W holds,
   which the log's exact values are consistent with."
3. Try to VERIFY it, not just argue for it — reproduce if feasible (a small
   isolated script, `node --check` on a template-literal-embedded page like
   TN_Solve-Extension's dashboard, a direct `curl` against the exact
   endpoint, a Playwright/browser repro for UI bugs — see how the connection-
   key save-button race condition was confirmed on 2026-09-11 for the pattern
   to follow), or at minimum find independent evidence in the code/logs that
   is ONLY consistent with this hypothesis and not with the alternatives you
   can think of. **If a realistic repro needs an authenticated session
   (cookies) on gen.tnsolve.com or elsewhere, just ask the user for them —
   they've said they're happy to provide cookies for this** — don't treat
   "I'd need to be logged in to test this properly" as a reason to stop short.
4. Explicitly self-assess: state your confidence as a percentage and name
   what would have to be true for you to be wrong. If <90%: identify exactly
   what evidence would move the needle, go get it (read more files, test
   another angle, check another log window, ask the user for access/data you
   don't have), and go back to step 1. If ≥90%: proceed to fix.
5. Only after truly exhausting the concrete, available investigation avenues
   (not just the convenient ones) and still below 90% — e.g. the failure is
   too rare/non-reproducible even with a real repro attempt, or points to
   something outside this codebase like the client's machine/network (see
   the 2026-09-11 case where a "silent save button" bug turned out to be
   isolated to one user's UltraViewer setup, not the code, once tested
   against a clean environment) — OR the 30-minute cap on this bug is reached
   first, whichever comes first — stop looping THIS bug. Record it as
   unresolved with your best hypothesis and precisely what's still uncertain,
   rather than forcing a change, then move on to the next bug in the queue
   (don't stop the whole run over one unresolved item).

### HARD GATE — self-check before touching any code

[2026-09-11] Explicit user requirement after a real violation: earlier in
this same skill's life, a fix got implemented and reported as done at a
confidence that, on honest re-examination, never actually cleared 90% for
the problem it was meant to solve (a plausible-sounding root cause that live
production data later showed wasn't the actual cause) — a direct violation
of point 4 above, caught only because the user asked "are you sure this is
really ≥90%" after the fact. That must not happen again.

Immediately before calling Edit or Write on any fix for this bug, you MUST
output the literal line `Confidence: NN%` (a real number, not "high" or
"~90%ish") together with the one-sentence reason. If NN < 90, that message
IS your stopping point — do not call Edit/Write in the same turn, go back to
step 1 of the loop instead. Skipping this line, rounding up to clear the
bar, or writing it AFTER the edit instead of before all count as violating
this gate. If you later discover (your own re-check, a live test, or the
user asking) that a shipped fix never actually cleared 90% for the problem
it targeted, say so immediately and plainly in those exact terms — don't let
it stand framed as a completed fix.

Once ≥90% (and the Confidence line above is written): implement the smallest
correct fix that addresses the root cause
(in the right one of the 3 local repos, resolved per the path rule above),
verify it doesn't break anything obvious (syntax check, re-run whatever
reproduction you built in step 3 against the fix), and move to Step 4.

## Step 4 — commit, push, then STOP before touching production

For each repo you changed: `git add`, write a commit message describing the
real root cause and fix (see recent `git log --oneline -8` in that repo for
tone/length), ending with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`,
then `git push`.

Do NOT run the production deploy/restart step (`deploy-tn-solve`'s Step 2)
as part of this skill without the user explicitly asking to deploy — this
skill investigates and fixes, it does not deploy on its own initiative. Tell
the user what was fixed and pushed, and ask whether to deploy now (or point
them at `deploy-tn-solve` if they say yes).

## Step 5 — report back

Plainly summarize the FULL severity queue, not just the top item: which
distinct errors were found and their frequency, which were classified
Google-origin and skipped (with why), which were classified genuine capacity/
infrastructure limits and skipped (with the real numbers that justified it),
which were investigated and FIXED (root cause + confidence + fix, per repo,
in severity order), and which stayed unresolved after hitting the 30-minute
cap or exhausting avenues below 90% (with the leading hypothesis, what
evidence is still missing, and what you'd need from the user — e.g. cookies,
more time — to close the gap). Don't bury a real finding in a wall of log
noise — lead with what matters, but don't let the big finding crowd out the
smaller ones from the report either.
