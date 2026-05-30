# Contributing to Vibe Coding Guide

Thank you for improving this guide. The best contributions make AI coding workflows more concrete, reviewable, and safe to reuse.

## Contribution Principles

- Prefer field-tested workflow advice over abstract claims.
- Add examples that a developer can run, review, or adapt in a real repository.
- Keep the distinction clear between prompt wording and engineering workflow.
- Do not present tool-specific behavior as universal unless it is true across tools.
- Avoid hype, invented metrics, or unverifiable productivity claims.
- Preserve the bilingual nature of the project when changing front-door content.

## Useful Contribution Types

| Contribution | Good shape |
|---|---|
| Clarify a chapter | Smaller wording change with a concrete before/after example |
| Add a workflow | A repeatable sequence with inputs, steps, verification, and handoff |
| Add an anti-pattern | Symptom, cause, risk, and safer replacement |
| Improve bilingual parity | Matching meaning across English and Chinese, not literal translation |
| Improve the website | Static HTML/CSS/JS changes that keep the guide readable without a build step |
| Fix links or PDFs | A small patch that preserves existing entry points |

## Before Opening a Pull Request

1. Read the relevant chapter in both languages if your change affects both versions.
2. Check that local links in edited Markdown files still point to existing files.
3. Keep examples honest: if a behavior is tool-specific, name the tool.
4. Do not add a package manager, framework, telemetry, or external service unless there is a clear documentation need.
5. If you add a new recurring concept, consider whether it belongs in the roadmap first.

## Local Verification

This repository is a static documentation project. Useful checks are:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/
```

For Markdown/front-door changes, also check that referenced local files exist.

## Language Notes

- English pages should use direct engineering language.
- Chinese pages should keep the original practical, operator-focused tone.
- Prefer "AI coding", "agent workflow", "spec", "context", "subagent", "worktree", "skill", "CI", and "testing" consistently.
- Keep code identifiers such as `AGENTS.md`, `CLAUDE.md`, `.gitignore`, and `worktree` unchanged.

## License Note

No license has been specified for this repository yet. Until the repository owner adds a license, contributors should not assume broad redistribution or reuse rights beyond normal GitHub viewing and contribution workflows.
