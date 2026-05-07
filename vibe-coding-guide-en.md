# Vibe Coding: A Practical Field Guide

> Vibe Coding is not just "asking AI to write code." It is a way to collaborate with AI agents as working members of a software team. This guide covers the full loop, from cold start (the early phase of a project before any code or conventions exist) through long-term maintenance: starting a project, giving agents context, reviewing their output, managing long sessions, using subagents, and shipping safely.

---

## Table of Contents

1. [What Is Vibe Coding?](#1-what-is-vibe-coding)
2. [Specs: The Starting Point](#2-specs-the-starting-point)
3. [What Goes Into AGENTS.md or CLAUDE.md](#3-what-goes-into-agentsmd-or-claudemd)
4. [Cold Starts: Joining or Creating a Project](#4-cold-starts-joining-or-creating-a-project)
5. [Context Management](#5-context-management)
6. [Using Subagents](#6-using-subagents)
7. [Agent Workflows and Collaboration Patterns](#7-agent-workflows-and-collaboration-patterns)
8. [`.gitignore`: The Hygiene File](#8-gitignore-the-hygiene-file)
9. [Git Worktrees and Codex Worktrees](#9-git-worktrees-and-codex-worktrees)
10. [Creating Skills](#10-creating-skills)
11. [System Prompts vs User Prompts](#11-system-prompts-vs-user-prompts)
12. [CI/CD for Agent-Written Code](#12-cicd-for-agent-written-code)
13. [Testing Code and Testing Agent Behavior](#13-testing-code-and-testing-agent-behavior)
14. [Advanced Principles](#14-advanced-principles)
15. [A Complete Workflow Example](#15-a-complete-workflow-example)
16. [Anti-Patterns Checklist](#16-anti-patterns-checklist)

---

## 1. What Is Vibe Coding?

The phrase "vibe coding" became popular after Andrej Karpathy described a style of programming where you rely heavily on AI, accept most generated code, and paste errors back when something breaks. In real engineering work, the idea becomes more serious and more disciplined.

The practical version is this:

> You are not only writing code. You are directing one or more AI agents that write code.

Your main work shifts from typing every character to managing four things.

### 1.1 Describe Intent Clearly

Do not say:

```text
Build login.
```

Say:

```text
Add email + OTP login using the existing auth module.
Store OTP codes in Redis, expire them after 5 minutes, and reuse the current session creation path.
```

Good intent tells the agent:

- what to build
- where it belongs
- which existing system it must respect
- how success will be verified

### 1.2 Provide the Right Context

Agents do not automatically know your project conventions, hidden constraints, deployment history, or past mistakes. You need to give that context in durable forms:

- `AGENTS.md` or `CLAUDE.md`
- feature specs
- architecture docs
- file paths instead of pasted files
- examples of good local code
- test data or ground truth cases

The quality of the context usually matters more than the model choice.

### 1.3 Review, Steer, and Correct

This is most of the work.

**Review** means you inspect what the agent changed:

- read the diff
- run tests or start the app
- check logs and browser output
- ask why a design was chosen
- challenge new dependencies and abstractions

Never accept "it should work" as proof. Make the agent show command output, or run the command yourself.

**Steer** means you set boundaries before the agent starts:

```text
Before editing files, tell me:
- your implementation plan
- which files you expect to touch
- what decisions you need from me
- what risks or edge cases you see
```

This catches bad direction early.

> 💡 **On Plan modes**: Claude Code, Codex (CLI/App), and Cursor have largely converged here. The agent proposes a few candidate plans (A/B/C), you can add a D, and once a draft is settled you choose to revise further or execute. The interaction is now nearly identical across these tools, so the "plan first, then act" habit transfers cleanly between them.

Useful constraints:

```text
Do not introduce new dependencies.
Do not change public method signatures.
Do not edit migrations.
Keep the existing error handling style.
```

**Correct** means you interrupt when the direction is wrong:

```text
Stop. This is going in the wrong direction. Reset the plan and explain a smaller approach.
```

Letting a wrong session continue usually creates more code to revert and more context pollution.

> 💡 **"Undo" mechanisms across tools**:
> - **Codex (CLI/App)**: `/fork` branches off a new conversation thread from any earlier turn. This is a fork of **conversation history**, not a git branch.
> - **Claude Code**: `/rewind` rolls both the conversation and the code snapshot back to a saved checkpoint.
> - **Cursor**: "Restore Checkpoint" works similarly to `/rewind`.
>
> These are orthogonal to **git worktrees**:
> - Conversation fork / rewind / checkpoint restore = switch **conversation state** (same directory, history rewound).
> - Worktree = switch **directory** (a separate git checkout that isolates the agent's working area).
>
> All three tools now support both layers, and you can stack them — e.g. let an agent work inside a dedicated worktree, and rewind inside it when something goes wrong, while the main checkout stays untouched.

### 1.4 Decompose, Compress, and Switch Agents at the Right Time

Vibe coding requires knowing when to stop:

- split large work into phases
- open a new session after a milestone
- write a handoff file before context gets too full
- use a subagent for broad search or independent research
- commit frequently so git becomes your undo system

### 1.5 From Managing Characters to Managing Attention

Traditional programming is character-level control. You type variables, brackets, function calls, and tests.

With agents, the characters are generated by the agent. Your job is to manage the agent's attention:

- What should it focus on now?
- Which files should it read?
- Which constraints must stay active?
- Which old topic should be cleared?
- When should the session be reset?

The agent's context window is a limited budget. If you fill it with old logs, irrelevant files, and stale decisions, it will perform worse. Vibe coding is largely the practice of spending that attention budget well.

---

## 2. Specs: The Starting Point

A spec is a clear description of what you want the agent to build. It can be a short chat message, a Markdown document, or an issue (a ticket on GitHub/GitLab/etc. used to record tasks, bugs, or requirements — essentially a structured description, which makes it a natural fit for a spec; agents can also read an issue link directly).

### 2.1 What Makes a Good Spec

A good spec has three properties.

**Clear intent**

```text
Add email + OTP login to the existing auth module.
```

is better than:

```text
Build login.
```

**Explicit constraints**

Mention style, dependencies, performance, security, compatibility, error handling, and areas that must not be touched.

**Testable acceptance criteria**

The agent needs to know what "done" means:

- which endpoint returns what
- which command must pass
- which UI flow must work
- which edge cases must be covered

### 2.2 Lightweight Specs

Use lightweight specs for small changes:

```text
Add UserService.deleteAccount:
- soft delete by setting deleted_at
- revoke all sessions for that user
- return NotFound if the user does not exist
- add unit tests for success and missing user
```

This is enough when the task is small and local.

### 2.3 Heavyweight Specs

Use a document for work that spans multiple sessions, days, or agents:

```markdown
# Account Deletion

## Background

The product supports disabling accounts but not true deletion. We need a compliant deletion flow.

## Goals

- Users can request deletion.
- A 30-day grace period allows cancellation.
- After 30 days, data is deleted or anonymized.

## Non-Goals

- Ownership transfer for published content is not part of this phase.

## Technical Plan

To be drafted and reviewed before implementation.

## Acceptance Criteria

- [ ] POST /account/deletion creates a deletion request.
- [ ] Cancellation works during the grace period.
- [ ] Background cleanup is idempotent.
- [ ] Tests cover success, cancellation, missing user, and retry behavior.
```

The spec is not a one-time artifact. Update it when you discover a constraint, make a decision, or defer a scope item.

---

## 3. What Goes Into AGENTS.md or CLAUDE.md

`AGENTS.md` and `CLAUDE.md` are project-level operating manuals for coding agents. Put them at the repository root unless a subdirectory needs more specific rules.

### 3.1 Project Identity

```markdown
## Project Overview

This is a B2B SaaS backend.
Stack: Go 1.22, PostgreSQL, Redis, AWS ECS Fargate.
The frontend lives in a separate repository.
```

The agent should quickly understand what kind of system it is in.

### 3.2 Directory Map

This is usually the most valuable section:

```markdown
## Code Structure

- `cmd/api/` - HTTP entrypoint
- `internal/auth/` - authentication; read SECURITY.md before changing
- `internal/billing/` - billing; use decimal for money, never float
- `pkg/` - public reusable packages; change carefully
- `migrations/` - database migrations; only add new files, never edit old ones
```

Agents make better changes when they know ownership boundaries.

### 3.3 Coding Conventions

```markdown
## Coding Rules

- Wrap errors with `fmt.Errorf("doing X: %w", err)`.
- Use `slog` for logging, not `fmt.Println`.
- Use table-driven tests.
- Do not add comments unless they explain a non-obvious decision.
```

Write rules that are specific enough to change behavior.

### 3.4 Commands

```markdown
## Commands

- Test: `make test`
- Start local dev: `make dev`
- Run migrations: `make migrate-up`
- Lint: `make lint`
```

Do not make the agent guess command names.

### 3.5 Red Lines

```markdown
## Do Not

- Do not edit existing migration files.
- Do not commit without running tests.
- Do not add TODOs in production code.
- PII fields must go through `internal/crypto/pii.go`.
```

Red lines should be direct and unambiguous.

### 3.6 Lessons Learned

This section captures project-specific traps:

```markdown
## Known Pitfalls

- PostgreSQL stores timestamps in UTC, but API responses use the user's timezone.
  Use `utils/tz.go`; do not manually call `.In()` everywhere.
- Redis keys must use the namespace helper in `internal/cache/keys.go`.
```

Every time an agent repeats a mistake, add the lesson here.

### 3.7 What Not to Put There

Avoid:

- long architecture essays
- one-off feature requirements
- personal preferences unrelated to the project
- giant pasted files

Keep `AGENTS.md` short enough to be useful. Around 200-400 lines is often enough for a real project.

### 3.8 Which Language Should You Write It In?

**Short answer: agents don't care.** They read English, Chinese, mixed, and other languages equally well. The choice is a team UX question, not a technical one.

| Situation | Recommendation |
|---|---|
| Solo or small team, all working in one language | Write in your team's working language |
| Mixed team with some cross-region collaboration | Mixed style: prose in the working language, code/commands in English |
| Open source project aimed at international contributors | English |
| Cross-border team where English is the working language | English |

The most common pattern in real engineering is **mixed**:

- **Code, commands, paths, library names, API names → English.** They're already English in the source; translating them is awkward.
- **Explanations, conventions, rationale, business terms, "why" → the team's native language.** Native prose captures nuance better, especially for implicit knowledge.

```markdown
## Project Conventions

- Commit messages must follow Conventional Commits (e.g., `feat(auth): add OTP login`).
- Use `pkg/errors.Wrap` for error handling; never `return err` directly.
- Test command: `make test`; coverage must stay above 70%.

## Red Lines (NEVER)

- Do not edit anything under `auth/` without architect sign-off.
- Handlers must never call the DB directly; go through the service layer.
```

**The one anti-pattern to avoid**: writing stilted, "professional-sounding" English (or any other language) when the team isn't fluent. An AGENTS.md that's awkward to read is one nobody updates, and that's the slow path to rot. Natural beats fancy.

> 💡 **Implicit knowledge especially benefits from your native language.** The most valuable parts of `AGENTS.md` (the things `/init` can't capture — conventions, traps, red lines, historical decisions) carry subtle context. Native prose lets you say "**absolutely never** touch `auth/`" with the right intensity, and agents pick up that nuance.

---

## 4. Cold Starts: Joining or Creating a Project

Cold starts are where agents can help the most, but also where they can do the most damage if they start coding too early.

### 4.1 Brand-New Projects

Start with a spec:

```text
I want to build X. Do not write code yet.
Help me draft a spec and ask every important question before choosing a technical design.
```

Then ask for options:

```text
Based on the spec, propose three technical approaches.
Compare tradeoffs. Do not create files yet.
```

After the choice is clear:

- initialize the project skeleton
- create `AGENTS.md`
- write setup commands
- commit small milestones

The first `AGENTS.md` does not need to be perfect. It needs to exist and improve as the project teaches you things.

### 4.2 Existing Projects

When joining someone else's project, do not start with:

```text
Add feature X.
```

**Step 1: Use `/init` to draft an initial AGENTS.md**

Claude Code and Codex (CLI/App) both ship with a built-in `/init` slash command that scans the repo and generates a first draft of `CLAUDE.md`/`AGENTS.md`:

```text
> /init
```

> 💡 **Two clarifications people often ask about**:
> 1. **`/init` isn't "you write the prompt."** It's a built-in slash command backed by a curated official prompt. You just type `/init`, and the agent scans the repo, infers the project, creates the file (Claude Code writes `CLAUDE.md`, Codex writes `AGENTS.md`) and fills it in. One command, not "you craft a prompt for it to run."
> 2. **Does the file still matter once `/init` is done? Yes — more than ever.** `/init` is a one-shot generator. The `CLAUDE.md`/`AGENTS.md` file lives on after that and is **read at the start of every session** as the project's persistent context. `/init` produces the first draft; the file then evolves on its own as you and the agent add to it. The longer the project runs, the more valuable the file becomes.

> 📝 **How is the file kept up to date afterward?** Three options. The first two are everyday; the third is rare:
>
> 1. **Edit it manually (most common).** It's just Markdown. Open it and edit, no different from a README.
> 2. **Ask the agent to update it during normal conversation (recommended).** No special command — just say:
>    ```
>    > Add "all commit messages must follow Conventional Commits" to the conventions section of CLAUDE.md.
>    > Review CLAUDE.md and flag anything that looks stale, so I can decide what to remove.
>    ```
>    The agent uses the Edit tool to update the file. This is the most natural ongoing-maintenance flow.
> 3. **Rerun `/init` (⚠️ not recommended for updates).** `/init` is designed for from-scratch generation, not incremental edits. If the file already exists, the tools usually detect it and ask before overwriting; even when overwriting works, it discards the hand-written implicit knowledge that's the most valuable part of the file. Only consider rerunning when the project itself has gone through a major structural change (language, framework swap) and you genuinely want to start over.
>
> **In one line**: `/init` is for cold start, not maintenance. Maintain by hand-editing or by asking the agent in chat. The file should grow over time.

`/init` typically does this:
- reads README, `package.json`/`go.mod`/`Cargo.toml`, etc.
- infers framework, build tool, and test commands
- maps directory structure and module responsibilities
- writes a first-draft `AGENTS.md` (or `CLAUDE.md`) at the repo root

#### A concrete example: what `/init` runs internally + what it produces

> ⚠️ **Disclosure**: Anthropic and OpenAI haven't published the exact official `/init` prompt. The prompt below is a **behavior-equivalent reconstruction** (the goal is to show what `/init` is asking the agent to do); the generated `CLAUDE.md` is a **realistic but trimmed example** of what you'd actually get on a typical Node.js + TypeScript project.

**The kind of prompt `/init` runs under the hood** (equivalent version):

```
You've just entered a new repository. Scan the project and produce a CLAUDE.md
(or AGENTS.md) so that future Claude / Codex instances can start working
without asking basic questions.

Cover:
1. Project overview: what is this, what problem does it solve, what is the stack
2. Directory structure: responsibility of each top-level directory
3. How to run it: dev, test, build commands
4. Key dependencies and versions
5. Any conventions inferable from README, CONTRIBUTING, or config files

Requirements:
- Be concise. No filler.
- Prefer runnable commands the agent can copy-paste.
- Do not invent things; mark uncertain items as "needs human confirmation".
- Output Markdown, save to CLAUDE.md (or AGENTS.md).
```

In practice the agent runs `Glob`/`LS` over the repo, `Read`s the key files (`README.md`, `package.json`/`Cargo.toml`/`go.mod`, `Makefile`, CI configs), and only then starts writing.

**The generated CLAUDE.md looks like this** (excerpt, Node.js + TypeScript):

````markdown
# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

A Fastify-based REST API for managing user subscriptions. TypeScript, Node.js 20+,
PostgreSQL via Prisma.

## Development Commands

- `npm install` — install dependencies
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build to `./dist`
- `npm test` — Vitest unit tests
- `npm run lint` — ESLint
- `npm run typecheck` — strict TypeScript check

## Architecture

- `src/server/` — Fastify routes and HTTP handlers
- `src/db/` — Prisma client; migrations in `prisma/migrations/`
- `src/services/` — business logic, organized by domain
- `src/utils/` — shared helpers
- `tests/` — mirrors `src/` structure

## Key Dependencies

- Fastify 4.x, Prisma 5.x, Vitest, Zod (runtime validation)

## Conventions (inferred from code)

- All async functions have explicit return types
- Named exports preferred over default exports
- Database access goes through `services/` only — handlers never touch Prisma directly

## Notes

- Env vars documented in `.env.example`
- `scripts/seed.ts` populates a fresh DB with sample data
````

**What you can learn from this:**

✅ **`/init` captures**: stack, commands, directories, dependencies, conventions visible in the code itself.
❌ **`/init` does not (and cannot) capture**:
- Why Prisma over Drizzle? (historical decision)
- Which tables must never be `DROP`ped? (ops red line)
- Which functions in `services/` are hot paths that need load testing before changes? (performance lore)
- What did the last P0 incident involve? (scar tissue)

These belong to **Step 2 (the "archaeologist" pass)** — they're the implicit knowledge that makes the file genuinely valuable over time.

The bottom line: `/init` is the fastest possible starting point — seconds to a usable draft — and far better than a blank file. But it's a starting point, not a finished AGENTS.md:

- It only sees file structure and explicit configs, so it **misses unwritten conventions** (e.g. "all commit messages must follow Conventional Commits").
- It tends toward generic phrasing ("This is a Node.js project using npm" — not useful).
- It doesn't know where the **traps** are.
- It doesn't know what the **red lines** are.

So: run `/init`, then **review what it wrote**, prune filler, and mark anything you're not sure about.

**Step 2: Code archaeologist (filling in what `/init` can't)**

```text
Act like a code archaeologist. Do not edit files.
Answer:
1. Draw a module dependency graph (mermaid).
2. List the 5 most complex files and what they do.
3. Skim recent git log (~50 commits). Where do bugs keep coming back? That signals hidden complexity.
4. Where is test coverage weak?
5. What in the code looks suspicious or that you don't understand?
6. What conventions exist but aren't written down — the **implicit knowledge**:
   - **Naming**: camelCase or snake_case for functions/variables/files? Interface prefixes (`I-`/`IFace`)? Test file naming (`*_test.go` vs `__tests__/*`)?
   - **Error handling**: throw exceptions vs return `error` vs return `Result`? Should errors carry a trace_id? How are business errors distinguished from system errors?
   - **Logging**: which logger? How are levels assigned? Which fields must **never** be logged in production (passwords, tokens, PII)?
   - **Directory rules**: is `internal/` actually off-limits to external imports? Is `scripts/` for throwaways or long-lived assets? Which folders are "auto-generated, do not edit by hand"?
   - **Commit/PR conventions**: message format? Squash policy? Who is allowed to merge to main?
```

> 💡 Item 6 is where the real value lives — `/init` can't see any of this. Implicit knowledge typically **lives only in old engineers' heads and chat history**; without writing it down, every new engineer (or new agent) has to learn it the hard way through code review pushback. Letting the agent surface it once and writing the result into AGENTS.md pays off for every future session and every new teammate.

**Step 3: Get the project running locally (run before you edit)**

> ⚠️ **Iron rule: don't modify before running it.** Until the project starts locally, every code change is **blind editing** — you don't know what the baseline looks like, and you can't verify whether your change actually works. Even if the agent confidently says "this should be fine," you have no way to falsify it. Step 3 must complete before any warmup edits.

```text
Help me get this project running locally.
When an error appears, report it exactly. Do not guess configuration.
Record every manual step so we can update AGENTS.md.

Until this step is done, do not modify any code — I want to confirm the baseline works first.
```

Getting it running is real progress. **A lot of implicit knowledge surfaces during setup**: a port that needs changing, an undocumented env var, a service that has to start first — none of which `/init` could ever see.

> 💡 **Why "run before edit" is non-negotiable**:
> - **You need a baseline before you can tell what you broke.** Running successfully = you have a known-good version. After that, any failed change can be `git stash`/`git reset`'d back to that known-good state. Without a baseline, when something breaks you can't tell whether it was your edit or the project itself.
> - **Setup is the cheapest form of "reading the code."** Error messages force the agent (and you) into the configs, entrypoints, and dependency boundaries that actually matter. That's far more efficient than asking the agent to cold-read source.
> - **Implicit knowledge surfaces during setup.** Missing `.env` keys, services with start-order dependencies, port conflicts — these only appear when you try to run things. They're exactly what AGENTS.md most needs to record.

**Step 4: Merge findings into AGENTS.md.** Take the archaeology output plus the setup steps and fold them into the file from Step 1.

**Step 5: A low-risk warmup task**:

- fix a typo
- add a log line
- add a small test
- update documentation

This gives both you and the agent a safe full loop: read, edit, test, commit.

---

## 5. Context Management

Agent context is limited. Long sessions degrade.

Common symptoms:

- the agent repeats mistakes you already corrected
- it forgets important constraints
- it invents files that do not exist
- tool use becomes slower or less precise
- output becomes vague

### 5.1 When to Switch or Compress

Switch at natural stopping points:

- a feature phase is complete
- a bug is fixed and the next task is unrelated
- backend work is done and you are moving to UI
- exploration is done and implementation is next

Do not wait until the agent becomes bad. Switch before the session gets heavy.

Rough context usage guide:

- 0-40%: normal work
- 40-65%: be aware
- 65-80%: prepare a handoff
- above 80%: write a handoff immediately and start fresh

### 5.2 Built-In Session Commands

**Common commands (Claude Code and Codex both have these)**

| Command | Purpose | Use When |
|---|---|---|
| `/compact` | summarize and keep going | you need more room in the same session |
| `/clear` | clear current conversation | you want a clean topic in the same window |
| `/init` | scan project and draft agent instructions | first step in an existing repo |
| `/resume` (or `--continue`) | continue a previous session | unfinished work continues later |

`/compact` is useful, but it lets the AI decide which details survive. A handoff file is often safer because you choose what gets preserved.

> 🎯 **`handoff.md` vs `/compact` — two kinds of compression, different jobs**:
>
> | Dimension | Write a `handoff.md` file | `/compact` in-session |
> |---|---|---|
> | **What it is** | **File on disk** — persistent, can be committed to git | **In-session rewrite** — context is summarized in place to free up tokens |
> | **Session handling** | **Start a new session** (clean slate, full context) | **Same session continues** |
> | **Who decides what survives** | **You** (you write/review the handoff) | **The AI** (auto-summary; you accept what it picks) |
> | **Survives across days / people?** | ✅ Yes, the file is still there | ❌ No, gone when the session closes |
> | **Typical use** | Phase done, end of day, handing off to a teammate | Same task still in progress, don't break flow, just need room |
>
> **Quick rule**:
> - Switching sessions (or continuing tomorrow / handing off) → **`handoff.md`** (file persistence).
> - Staying in the current session → **`/compact`** (in-session compression).
>
> They aren't replacements — they're different tools. Best practice: **`/compact` for tactical endurance, `handoff.md` for strategic handoff.** A long single-task push uses `/compact`; finishing a phase or crossing a day/person boundary uses `handoff.md`.

**Codex-specific commands**

Codex (CLI/App) ships a few additional slash commands worth calling out:

| Command | Purpose | Use When |
|---|---|---|
| `/review` | Have **another** Codex agent review your current changes before you commit | Before commit/PR, when you want a second pair of eyes |
| `/fork` | Branch off a new thread from any earlier turn; the original transcript is preserved | "What if I tried a different approach?" — exploratory experiments without losing the main thread |
| `/clear` | Clear the visible transcript while staying in the same CLI session | You just want the screen clean, no need to swap sessions |
| `/compact` | Replace earlier turns with a summary, freeing context but keeping key details | Long conversation — usually more useful than `/clear` because details survive |
| `/plan` | Enter **plan mode**, optionally with an initial prompt | Refactors, migrations, anything you want to think through first, e.g. `/plan Propose a migration plan for this service` |

A few notes from practice:

- **`/review` is high-leverage**. Spending 30 seconds before commit on a separate agent's review consistently catches problems the original agent can't see — missed test updates, unnecessary new dependencies, naming inconsistent with the rest of the code.
- **`/fork` fits "I want to try something risky without losing the main thread"**. Want to see what an aggressive refactor of a core function looks like, without polluting the main discussion? Fork, explore, throw it away if it doesn't work or merge the conclusion back if it does.
- **`/plan` pairs with the "plan first, then code" habit**: for refactors, migrations, and cross-module work, `/plan` first to get candidate approaches (A/B/C), review, then execute. This is the standard usage now that plan modes have converged across tools (see Section 1.3).

### 5.3 Emergency Recovery

If the session is already overloaded, stop adding work. Ask for a handoff:

```text
Pause. Before we lose context, write docs/notes/handoff.md with:
- what we are doing
- the spec or issue link
- files changed
- tests run and results
- current blockers
- next recommended step
```

Then start a new session:

```text
Read AGENTS.md, the spec, and docs/notes/handoff.md.
Continue from the previous session, but restate the plan before editing.
```

### 5.4 Prevention

Good habits:

- one session per clear task or phase
- commit after each meaningful milestone (just `git commit` — nothing special, plain git) plus a short "what we've done so far" note from the agent
- store decisions in files, not only chat
- reference file paths instead of pasting large content
- send broad searches and large output (build logs, test logs) to subagents
- close solved topics explicitly

**Push expanding output to subagents.** Tasks that involve "scan the whole codebase," "read 50 files," or "process a long build log" should go to a subagent.

> 📖 **What's a build log?** It's the output a project produces while building — what scrolls past when you run `npm run build`/`make`/`cargo build`/`mvn package`: dependency resolution, compile progress, warnings, error stacks, linker output. A build log on a medium-sized project is often **thousands of lines**, and pasting it into the main agent burns half a context window. Same goes for **test logs** (full `pytest`/`go test` output), **CI logs** (a failed GitHub Actions run), **docker build output**. Standard practice is to send these to a subagent — it reads thousands of lines, then comes back with one sentence: "Line 1273 has an unhandled promise rejection."

> 💡 **How are subagents invoked? Two modes, and they don't conflict**:
>
> 1. **Main agent dispatches automatically**: while working, the main agent decides "this is going to blow up my context, I'll send a subagent" and creates one with **its own prompt**. You don't have to manage it. Claude Code's `Agent` tool and Codex's parallel tasks are like this.
> 2. **You dispatch explicitly**: you tell the main agent "**send a subagent to scan the whole codebase for uses of the deprecated API and return only a list**" — now the subagent's prompt is **the one you wrote**, and the main agent just dispatches and receives.
>
> **They mix freely**: you can manually launch one for a key investigation, and after it returns, the main agent might auto-dispatch several more in parallel based on the result. You stay in control — you can intercept, edit, or block any auto-dispatched prompt.
>
> **Which to choose?** For routine "scan and summarize" work, let the main agent dispatch. For **decision-affecting investigation**, write the prompt yourself — you know best what you want found, what to ignore, and what format you want back.

**Don't repeat what you've already said.** If you find yourself re-explaining a constraint, write it down instead.

```text
✗  Me: "this function should return Result<T, E>"
   [10 turns later] agent goes back to using throw

✓  Me: "Add 'all new functions return Result<T, E>' to the conventions section of AGENTS.md"
```

> 📖 **What's `throw`? Why is this two competing styles?**
>
> `throw` (raise an exception) and `Result<T, E>` (return a result object) are the **two dominant error-handling styles**:
>
> | Style | How you write it | How errors are handled | Languages |
> |---|---|---|---|
> | **Throw exceptions** | `throw new Error("not found")` | Caller wraps with `try/catch` | JavaScript, Java, Python |
> | **Return a Result** | `return Err("not found")` | Caller checks `if result.is_ok()` before using it | Rust, Go (via `error`), Haskell |
>
> **Quick mental model**:
> - `throw` is like throwing a grenade — toss it up the call stack and hope someone has a `catch` ready. **Quick to write, easy to forget to handle** (no catcher = the program dies).
> - `Result<T, E>` is like a delivery package — wrap up success or failure and hand it back; **the caller has to "sign for it" (explicitly check ok/err) before they can use the contents**. Forces handling at every step. **Safer, more verbose.**
>
> **What this example illustrates**: the team picked `Result<T, E>` (safer), but you only mentioned it once in chat. Ten turns later that turn got compacted out, and the agent — drawing on its training, where most code uses `throw` — slid back to `throw`. This is exactly why **"don't say it only in chat, write it into AGENTS.md"** matters: written conventions survive context drift.

**Don't paste large files. Reference paths.**

```text
✗  Me: [pastes 5000-line schema.sql] this is the schema, please...
✓  Me: schema is in db/schema.sql; grep for the parts you need.
```

Let the agent pull what it actually needs rather than force-feeding the whole file.

**Surviving long sessions**

> 🤔 **How do you tell it's a "long session"?** Watch for these signals — three or more means yes:
> 1. **Wall time**: the same session has been running **over 1.5–2 hours** (regardless of token usage, both you and the AI start to fatigue).
> 2. **Turn count**: you've gone back and forth **30–50+ times** (threshold varies by model; 4o/Sonnet hold up longer).
> 3. **Context usage**: the tool shows **>50% of the context window used** (visible in Claude Code's header or Codex's status bar, e.g. `127k / 200k`).
> 4. **Task scope drift**: you've drifted across **multiple subtasks** ("write login" → "while we're at it, tweak the schema" → "fix this unrelated bug").
> 5. **Subjective**: you have to scroll through screens to find earlier context, the agent re-asks things you've already answered. That's the "wrap it up" signal.
>
> If only 1–2 hold, the techniques below can keep going. **At 3+, the right move isn't to extend — it's to write `handoff.md` and start a fresh session** (see the comparison earlier in 5.2).

If you really must keep the session running:

- **Commit + summarize regularly**: every milestone, `git commit` plus a short agent-written progress note. If context collapses, your git history still has the work.
- **Disable tools you aren't using**: tool **schemas** themselves cost tokens. If you don't need them, turn them off.
- **Brief-reply mode**: tell the agent to "keep replies under 3 paragraphs unless I ask for detail."
- **Explicitly close resolved topics**: "Issue X is solved; no need to revisit it."

> 📖 **What's a "schema"?** It's the **usage spec for a tool**.
>
> Every tool (`Read`, `Edit`, `Bash`, `WebSearch`, etc.) has a description that tells the agent:
> - what the tool is and what it does (`Read` = read a file)
> - what parameters it takes and their types (`file_path: string`, `limit?: number`)
> - what it returns and any caveats
>
> That description is the schema. **The catch: it's sent to the agent at the start of every turn** — that's how the agent knows what tools exist and how to call them.
>
> **Why it costs tokens**:
> - A single tool's schema is typically **200–800 tokens**.
> - Claude Code and Codex enable dozens of tools by default (potentially with several MCP connectors attached) — total can be **5k–15k tokens**.
> - It's **resent every turn**, so cost compounds in long sessions.
>
> **How to disable unused tools**:
> - Claude Code: `/mcp` to disable an MCP server; `disabledMcpjsonServers` in `.claude/settings.json` for fine-grained control.
> - Codex: similar MCP/plugin management UI.
> - **Typical case**: this session doesn't need a browser? Disable the Chrome/Playwright MCP. Doesn't need doc lookup? Disable the web fetch tools. Each one saves 1–3k tokens, which adds up over a long session.

Context is not long-term memory. Files are.

---

## 6. Using Subagents

A subagent is a separate agent with its own context, assigned a specific task. It returns a result to the main agent without polluting the main context with every file it read.

### 6.1 Why Use Subagents

Suppose the main agent is implementing payments, but it needs to find every use of an old `PaymentClient`.

If the main agent reads 50 files, its context gets filled with search noise.

If a subagent does it, the main agent receives:

```text
Found 12 usages:
- path A: old constructor
- path B: direct method call
- path C: test fixture
```

The main context stays focused.

### 6.2 Good Subagent Tasks

Use subagents for:

- large codebase searches
- isolated research
- independent test writing
- parallel module changes
- verification that can run while you implement
- gathering evidence from logs or CI output

### 6.3 Bad Subagent Tasks

Avoid subagents for:

- tiny tasks
- tasks that require the main conversation context
- work that needs many rounds of user clarification
- tightly coupled edits to the same files

### 6.4 Write Subagent Instructions Like Function Signatures

Bad:

```text
Look around and tell me what you find.
```

Good:

```text
Task: Search `src/` for direct reads of `process.env`.
Input: repository files only.
Output: list lines as `path:line - variable name`.
Constraints: do not edit files; ignore node_modules.
Completion: include total count and any risky usage patterns.
```

Subagents work best when the task is bounded and the output format is fixed.

---

## 7. Agent Workflows and Collaboration Patterns

Many "agent systems" fail because they confuse two ideas:

- workflow: the steps are predefined by you
- agent: the model decides the next step dynamically

Use workflows whenever the steps are predictable. Use autonomous agents only when the path is genuinely unknown.

### 7.1 Workflow vs Agent

| Question | Workflow | Agent |
|---|---|---|
| Who decides the steps? | you or code | the LLM |
| Structure | fixed steps, maybe branches | dynamic loop |
| Predictability | high | lower |
| Debuggability | easier | harder |
| Cost | controlled | can expand |
| Best for | known processes | open-ended tasks |

Decision test:

> Can I know the steps in advance?

If yes, use a workflow. If not, use an agent with guardrails.

### 7.2 Five Core Workflow Patterns

#### Pattern 1: Prompt Chaining

Output from one step becomes input to the next:

```text
draft spec -> review spec -> design -> review design -> implement -> test
```

Use this when each step can be checked before moving on.

Example:

```text
Step 1: Read specs/001.md and extract a checklist.
Step 2: Wait for my confirmation.
Step 3: Design the implementation for each checklist item.
Step 4: Wait for my confirmation.
Step 5: Implement one item at a time.
```

#### Pattern 2: Routing

Classify the input, then send it to a specialized path:

```text
PR files -> language router
         -> Go reviewer
         -> TypeScript reviewer
         -> Python reviewer
```

Use routing when one prompt for all cases would become too vague.

#### Pattern 3: Parallelization

Split independent work and run it at the same time:

```text
module A tests
module B tests
module C tests
-> aggregate results
```

Use this only when tasks do not edit the same files or depend on each other.

Voting is another form:

```text
Run the same behavior test 3 times.
If one run fails, mark the prompt unstable.
```

#### Pattern 4: Orchestrator-Workers

The orchestrator decides the subtasks after seeing the input:

```text
request -> orchestrator reads repo -> creates worker tasks -> aggregates results
```

This is the pattern behind many subagent systems.

Use it when you cannot know the exact subtasks before inspection, but once discovered, each subtask is independent.

#### Pattern 5: Evaluator-Optimizer

One agent generates, another evaluates, and feedback loops until a threshold is met:

```text
generator -> candidate
candidate -> evaluator
if fail -> feedback to generator
if pass -> final output
```

Set an exit condition:

- maximum 3 iterations
- score >= 9/10
- evaluator must explicitly output `PASS`

Without an exit condition, this pattern can loop forever.

### 7.3 When to Use a True Agent

Use an autonomous agent when:

- the number of steps is unknown
- the next action depends on tool output
- the task requires reading, testing, editing, and retesting
- "done" is based on judgment rather than a fixed transform

Examples:

- debug a production-like failure
- review a complex PR
- implement a feature in an unfamiliar codebase

Guardrails:

- restrict tools to what is needed
- set max iterations or budget
- log every action
- require confirmation for destructive actions
- fail clearly when ambiguous

### 7.4 Multi-Agent Collaboration Modes

**Specialist agents**

Different agents or models handle different strengths:

- implementation
- deep reasoning
- documentation lookup
- security review
- test writing

**Role-based agents**

Same model, different instructions:

- architect
- coder
- reviewer
- tester
- documentation writer

This helps because a coder tends to justify its own output, while a reviewer is instructed to find problems.

**Adversarial review**

Ask one agent to attack another agent's design:

```text
You are reviewing this proposal. Do not praise it.
List concrete risks, missing cases, and simpler alternatives.
```

**Hierarchical collaboration**

A manager agent delegates to leads or workers. Use sparingly. More than two layers usually multiplies error and coordination cost.

### 7.5 Use Files as the Protocol Layer

Agents should exchange structured files instead of chatting endlessly:

```text
.
├── AGENTS.md
├── specs/
│   ├── 001-auth.md
│   └── 002-billing.md
├── docs/
│   ├── architecture.md
│   ├── decisions/
│   └── notes/
├── .agent/
│   ├── tasks/
│   ├── reviews/
│   ├── handoffs/
│   └── runs/
└── src/
```

Files give you:

- persistence across sessions
- auditability
- clearer handoffs
- fewer forgotten decisions

### 7.6 Decision Framework

```text
Can one LLM call solve it?
  yes -> use one call
  no -> continue

Can the steps be known in advance?
  yes -> workflow
    fixed sequence -> prompt chaining
    classification -> routing
    independent parts -> parallelization
    dynamic split -> orchestrator-workers
    quality iteration -> evaluator-optimizer
  no -> agent with guardrails

Do you need multiple agents?
  different skills -> specialist
  different responsibilities -> role-based
  critical review -> adversarial
  large hierarchy -> avoid unless necessary
```

### 7.7 Workflow Anti-Patterns

| Anti-Pattern | Result | Fix |
|---|---|---|
| using an agent when a workflow is enough | expensive and hard to debug | define steps |
| asking an agent to review itself | self-justifying review | use another role |
| agent-to-agent free chat | context bloat | exchange files |
| deep agent hierarchy | compounding errors | keep it flat |
| no exit condition | infinite loops | max iterations |
| parallel tasks with dependencies | conflicts | sequence them |

---

## 8. `.gitignore`: The Hygiene File

`.gitignore` tells git which files should not be tracked.

Example:

```gitignore
# dependencies
node_modules/
.venv/

# build output
dist/
build/
*.pyc
__pycache__/

# environment
.env
.env.local

# editor and OS files
.DS_Store
.idea/
.vscode/

# logs and cache
*.log
.cache/
```

### 8.1 Why It Matters

Your repository should contain source files, not machine-specific artifacts.

Do not commit:

- dependency directories
- build output
- local environment files
- logs
- caches
- secrets
- editor settings that are personal

Without a good `.gitignore`, agents may stage garbage or secrets when they run `git add`.

### 8.2 Patterns

```gitignore
node_modules/        # directory
*.log                # every .log file
/config.json         # root config.json only
!important.log       # exception
**/temp/             # temp directory at any depth
```

### 8.3 Common Trap: Already Tracked Files

Adding a file to `.gitignore` does not untrack it if it is already committed.

```bash
git rm --cached .env
git commit -m "remove env file from tracking"
```

If a secret was committed, rotate the secret immediately. Removing it from the latest commit is not enough if it remains in history.

### 8.4 Agent-Specific Ignores

For agent-heavy projects:

```gitignore
.agent/runs/
.agent/cache/
runs/
*.handoff.md.tmp
.llm-cache/
```

Do not ignore durable project knowledge:

```text
AGENTS.md
CLAUDE.md
specs/
docs/
skills/
```

`.gitignore` is project hygiene. It keeps `git status` readable and reduces the chance of unsafe commits.

---

## 9. Git Worktrees and Codex Worktrees

Multiple agents editing the same working directory will eventually collide:

- shared git index
- branch switching conflicts
- overwritten files
- dev server port conflicts
- dependency or lockfile churn

Git worktrees solve the filesystem part.

### 9.1 What Is a Git Worktree?

A worktree is another checkout of the same repository with its own working directory and branch.

```text
my-repo/
  src/

../wt/auth/
  src/       # branch agent/auth

../wt/billing/
  src/       # branch agent/billing
```

Each agent works in its own directory.

### 9.2 Basic Commands

```bash
mkdir -p ../wt

git worktree add -b agent/auth ../wt/auth main
git worktree add -b agent/billing ../wt/billing main

git worktree list

git worktree remove ../wt/auth
git branch -D agent/auth
```

### 9.3 The Biggest Worktree Trap

Ignored files do not appear in a new worktree:

- `node_modules/`
- `.env`
- `.venv/`
- build output
- caches

So a new worktree may not run immediately.

Create a setup script:

```bash
#!/usr/bin/env bash
set -euo pipefail

cp ../../main-repo/.env .
npm ci
```

Document it:

```markdown
## Worktree Setup

In a new worktree, run `bash scripts/setup-worktree.sh` before testing.
Each worktree must use a different dev server port.
```

### 9.4 When to Use Worktrees

Use worktrees when:

- tasks are independent
- you want A/B implementation experiments
- multiple agents need to work at the same time
- reviewer and coder agents should run separately

Do not use worktrees when:

- every task edits the same files
- setup cost is too high
- you only have one small task

### 9.5 Parallel Worktree Workflow

```text
1. Split the work into independent specs.
2. Check file overlap. If overlap exists, sequence the work.
3. Create one worktree per spec.
4. Run setup in each worktree.
5. Assign one agent per worktree.
6. Review each diff.
7. Run tests.
8. Merge or rebase carefully.
9. Remove worktrees.
```

The bottleneck is still human review bandwidth. More agents are not useful if nobody can review the output.

---

## 10. Creating Skills

A skill is a reusable, parameterized workflow template for an agent.

Create a skill when you have explained the same task pattern at least three times.

Examples:

- add a REST API endpoint
- create a database migration
- write a weekly engineering report
- refactor a React component into hooks
- review a PR using team rules
- fix lint errors and add tests

### 10.1 Skill Structure

Typical layout:

```text
.skills/
└── add-api-endpoint/
    ├── SKILL.md
    ├── templates/
    │   ├── handler.ts.tmpl
    │   └── test.ts.tmpl
    └── scripts/
        └── update-openapi.sh
```

`SKILL.md` is the core:

```markdown
---
name: add-api-endpoint
description: Use when adding a new REST API endpoint, route, handler, service, tests, and OpenAPI updates.
---

# Add API Endpoint

## Use When

The user asks to add a new HTTP endpoint.

Do not use for:
- modifying an existing endpoint
- adding a gRPC method

## Inputs

- HTTP method
- path
- request schema
- response schema

## Steps

1. Add the route.
2. Add the handler.
3. Add the service method.
4. Add repository access if needed.
5. Add tests for success, validation failure, auth failure, and internal error.
6. Update OpenAPI.
7. Run the test command.

## Project Rules

- Use the existing error wrapper.
- Auth is enforced in middleware.
- Times are RFC3339.

## Done When

- [ ] tests pass
- [ ] OpenAPI is updated
- [ ] at least one manual request was verified
```

### 10.2 Skill Quality Rules

Good skills:

- have a clear trigger description
- use numbered steps
- reference exact local paths and commands
- capture project-specific conventions
- include acceptance criteria
- stay short enough to execute

Bad skills:

- are vague
- are 1,000-line essays
- overlap with other skills
- hard-code one-off business details
- reference old paths after the project changes

### 10.3 Skill vs AGENTS.md vs Spec

| Artifact | Scope | Purpose |
|---|---|---|
| `AGENTS.md` | whole project | project map, rules, commands, red lines |
| skill | repeated task type | standard operating procedure |
| spec | one feature | concrete requirements and acceptance |

Analogy:

- `AGENTS.md` is the employee handbook
- a skill is an SOP
- a spec is the ticket

---

## 11. System Prompts vs User Prompts

This distinction improves every agent interaction.

**System prompt**: durable behavior and rules for the agent.

**User prompt**: the current task.

### 11.1 What Belongs in the System Prompt

Put stable rules there:

- role and expertise
- behavior rules
- output format
- tool usage rules
- project knowledge
- security constraints
- recurring coding conventions

Example:

```text
You are a senior Go backend engineer.

You are good at:
- PostgreSQL
- distributed systems
- table-driven tests

You must:
- wrap errors with context
- never use float for money
- run tests before finalizing
- ask before editing migrations
```

### 11.2 What Belongs in the User Prompt

Put current work there:

- the task
- the relevant data
- temporary constraints
- acceptance criteria

Example:

```text
Context: We are implementing account deletion. The spec is specs/003-delete.md.

Task: Implement Phase 2, the background cleanup job.

Constraints:
- use cron, not a worker queue
- make the job idempotent
- do not change the Phase 1 API

Acceptance:
- tests pass
- one manual cleanup run marks expired requests completed
```

### 11.3 Decision Test

Ask:

> Will the next session need this rule?

If yes, put it in `AGENTS.md`, a project instruction, or a skill.

If no, keep it in the user prompt.

### 11.4 Good User Prompt Formula

```text
Context + Task + Constraints + Acceptance
```

Do not paste large files. Reference paths:

```text
Read specs/003-data-export.md, especially the idempotency section.
```

State what not to do early:

```text
Add deleteAccount.
Do not refactor UserService.
Do not change public method signatures.
Do not modify schema.
```

Keep each prompt to one main task.

### 11.5 Prompt Anti-Patterns

| Anti-Pattern | Result | Fix |
|---|---|---|
| system prompt is a novel | rules get buried | short numbered rules |
| repeating project background in every prompt | wasted context | move to system |
| putting one-time tasks in system | future sessions polluted | keep tasks in user prompts |
| no acceptance criteria | unclear done state | define verification |
| only saying what to do | agent overreaches | include boundaries |

System prompt is the agent's gravity. User prompt is today's destination.

---

## 12. CI/CD for Agent-Written Code

Agents can produce code faster than you can review. CI is the machine reviewer that catches basic failures before they reach main.

CI should catch:

- tests
- lint
- type errors
- formatting
- build failures
- dependency vulnerabilities
- secret leaks
- coverage regressions

### 12.1 Minimal GitHub Actions CI

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

Adjust commands to your stack.

### 12.2 Add Local CI

Agents should run the same checks locally before pushing.

Example `Makefile`:

```makefile
ci-local: lint test build
	@echo "local CI passed"

lint:
	npm run lint

test:
	npm test

build:
	npm run build
```

Then write in `AGENTS.md`:

```markdown
## CI Rules

Before committing, run `make ci-local`.
If CI fails, inspect the failing step and reproduce locally before changing code.
Do not guess fixes from partial logs.
```

### 12.3 AI in CI

AI can also run inside CI for:

- PR review
- changelog generation
- issue labeling
- documentation checks

Non-interactive CI agents need stricter rules:

- if ambiguous, fail and explain
- never push directly to main
- limit changed files
- write structured PR comments
- do not hide failures

### 12.4 CD Guardrails

Never let AI directly deploy to production.

Prefer:

```text
feature branch -> CI
PR -> CI + AI review + human review
main -> staging deploy
staging smoke tests
human approval
production deploy
```

The human approval is not just code review. It is a final operational brake.

### 12.5 CI/CD Anti-Patterns

| Anti-Pattern | Result | Fix |
|---|---|---|
| no CI | bad agent code reaches main | add minimal CI |
| local and CI commands differ | "works locally" failures | one local CI entrypoint |
| CI too slow | people ignore it | split fast and slow checks |
| AI deploys production | high operational risk | require human approval |
| secrets in workflow files | leaked credentials | use GitHub Secrets |
| agents modify CI silently | checks get bypassed | require explicit review |

CI is not extra ceremony. For agent-written code, it is part of the control system.

---

## 13. Testing Code and Testing Agent Behavior

Vibe coding has two layers of testing.

**A. Testing normal code**

You verify functions, APIs, UI flows, and integrations.

**B. Testing agent behavior**

You verify prompts, skills, tool calls, and agent loops.

### 13.1 Testing Normal Code

Three useful modes:

**You write tests, agent implements**

```text
Implement MergeIntervals.
Here are the cases:
- [] -> []
- [[1,3],[2,6],[8,10]] -> [[1,6],[8,10]]
- [[1,2],[3,4]] -> unchanged
- [[1,10],[2,3]] -> [[1,10]]
```

This gives you control over correctness.

**Agent writes tests first, you review**

```text
Before implementing, write the test cases you intend to cover.
Wait for my approval before writing production code.
```

Reviewing tests is often easier than reviewing implementation.

**Agent lists edge cases**

```text
Before writing tests, list edge cases and invalid inputs.
I will choose which ones matter.
```

The agent is good at enumeration. You still make the engineering judgment.

Do not let the agent implement first and then write tests that fit its implementation.

### 13.2 Testing Agent Behavior

When the product includes prompts, skills, or agent loops, function tests are not enough.

Agent behavior is:

- non-deterministic
- hard to define with a single correct answer
- affected by tool calls and hidden state
- vulnerable to prompt wording changes

Use case-driven testing.

### 13.3 Case-Driven Agent Testing

Create a case file:

```markdown
# Case: Monthly spending question

## Input Prompt

"How much did I spend last month? Break it down by category."

## Context

- user_id=42
- database has 30 transactions across August and September
- current date is 2024-09-15

## Expected Behavior

1. Agent calls `get_transactions` with:
   - user_id=42
   - start=2024-08-01
   - end=2024-08-31
2. Agent does not call `get_user_profile`.
3. Response includes:
   - correct total
   - category breakdown
   - currency format
   - no more than 5 lines

## Failure Signals

- wrong date range
- extra tool calls
- incorrect total
- wrong currency
```

Run it 2-3 times. Save evidence:

```text
runs/case01/
├── case.md
├── run1-tui.txt
├── run1-tools.json
├── run1-db-diff.txt
├── run2-tools.json
├── run3-tools.json
└── observation.md
```

Write observations manually:

```markdown
## Stability

- tool call was correct in runs 1 and 2
- run 3 used start=2024-08-15, which is wrong
- run 2 made an unnecessary profile call

## Main Problems

1. Date range is unstable.
2. Currency format differs across runs.
```

Then give the evidence to an agent:

```text
This is a prompt debugging task.
Read case.md, observation.md, run*-tools.json, and the current system prompt.
The main issue is a 1/3 failure rate in date range selection.
Give 2-3 hypotheses before changing the prompt.
```

After changing the prompt, rerun the same cases.

### 13.4 Agent Behavior Testing Rules

| Rule | Reason |
|---|---|
| run each case at least 2-3 times | one success can be luck |
| keep a written case file | memory is unreliable |
| capture tool calls, not only final text | hidden behavior matters |
| do human observation | agents justify their own output |
| rerun old cases after prompt changes | prevent regressions |

Agent behavior is statistical. Your tests need to measure stability, not just one clean output.

---

## 14. Advanced Principles

### 14.1 Make the Agent Speak First

For important work, first ask for understanding and plan:

```text
I want to add user search.
Before editing, tell me:
- how you would implement it
- files you expect to change
- edge cases
- decisions you need from me
```

The extra minute often saves a bad half-hour.

### 14.2 Commit Frequently

Use git as your undo system.

```text
After each independent change, show the diff and commit it with a clear message.
```

Small commits make agent experiments safer.

### 14.3 Reject "Looks Correct"

Agent code can look professional and still be wrong. Names, comments, and structure do not prove behavior.

Tests and runtime verification do.

### 14.4 Put Knowledge in Files

When an agent discovers something useful, ask:

> Will future me or a future agent need this?

If yes, store it in:

- `AGENTS.md`
- `docs/`
- `specs/`
- an ADR
- a focused code comment

### 14.5 Stop Early When Direction Is Wrong

Do not keep negotiating with a bad direction.

```text
Stop. This is not the right approach.
Summarize what went wrong, reset the plan, and propose a smaller path.
```

Interrupting is a core skill.

---

## 15. A Complete Workflow Example

A realistic feature flow might look like this.

### Day 1 Morning: Spec

```text
We are building "user data export."
Read AGENTS.md and specs/template.md.
Draft specs/003-data-export.md.
Ask every unclear question before writing implementation details.
```

The agent asks questions. You answer. The agent writes the spec. You review and commit.

### Day 1 Afternoon: Design

Start a new session because the exploration context is heavy:

```text
Read specs/003-data-export.md.
Design the implementation.
Do not write code yet.
Tell me which tables, APIs, background jobs, and files are involved.
```

You iterate on the design, then store it:

```text
Write the final design to docs/design/003-data-export.md.
```

### Day 2: Phase 1 Implementation

Start fresh:

```text
Read AGENTS.md, the spec, and the design.
Implement Phase 1: create export request API.
After each file, show the diff before continuing.
```

If a complex database question appears:

```text
Use a subagent to research large PostgreSQL export patterns.
Return three options and tradeoffs. Do not edit files.
```

After implementation:

- run tests
- commit
- write notes

```text
Write docs/notes/003-data-export-phase1.md with progress, changed files, validation, and next steps.
```

### Day 3: Phase 2

```text
Read AGENTS.md, spec, design, and phase1 notes.
Continue with Phase 2.
Restate the plan before editing.
```

Each session has a narrow purpose. Files carry memory across sessions.

---

## 16. Anti-Patterns Checklist

| Anti-Pattern | Result | Better Practice |
|---|---|---|
| no spec before coding | wrong direction | write spec first |
| one session all day | quality collapse | switch at milestones |
| stale AGENTS.md | repeated mistakes | update it weekly |
| coding immediately in an inherited repo | inconsistent changes | explore and run locally first |
| trusting generated AGENTS.md blindly | missing implicit rules | review and improve it |
| agent reviews its own code | weak review | use another role |
| large task without phases | unreviewable diff | split and commit |
| no tests | plausible broken code | test first or review tests first |
| trusting "tests passed" without output | false confidence | inspect command output |
| treating chat as memory | forgotten decisions | write files |
| multiple agents in one directory | file conflicts | use worktrees |
| worktree without setup | missing env/deps | write setup script |
| overloaded context | degraded agent | write handoff and restart |
| pasting huge files | context waste | reference paths |
| repeating the same instructions | inconsistent work | create a skill |
| skill written as prose | poor execution | numbered steps |
| tests after implementation | tests fit bugs | test before code |
| agent behavior tested once | unstable prompts | run cases 2-3 times |
| prompt debugging without evidence | guessing | save tool calls and observations |
| direction is wrong but session continues | messy rollback | stop and reset |
| project background in every user prompt | wasted context | move to system prompt |
| one-time task in system prompt | future pollution | keep it in user prompt |
| bad `.gitignore` | garbage or secrets committed | fix ignore rules first |
| committed secrets | history leak | rotate secrets and rewrite history |
| no CI | broken code reaches main | add minimal CI |
| local checks differ from CI | surprise failures | one local CI command |
| AI deploys production | operational risk | require human approval |
| using agents when workflow is enough | unpredictable cost | define workflow |
| no evaluator exit condition | endless loop | max iterations |

---

## Closing

Vibe Coding is not about abandoning engineering discipline. It moves your discipline up a level.

You become the person who writes the spec, sets the boundaries, gives the context, reviews the diff, designs the workflow, and decides when to stop.

The agent writes many of the characters. You still own the software.
