# Vibe Coding Guide

Language: [中文](./README.md) | English

## Introduction

This repository contains a practical Vibe Coding guide for developers who collaborate with AI coding agents.

It includes both the original Chinese edition and an English edition. The guide covers the full working loop: writing specs, maintaining `AGENTS.md`, managing context, using subagents and workflows, working with git worktrees, creating reusable skills, designing prompts, setting up CI/CD, and testing agent behavior.

The core idea is not to let AI "just write code." The goal is to direct agents like an engineering lead: provide precise context, split work into reviewable steps, inspect diffs, preserve project knowledge in files, and use tests plus CI to control quality.

## Documents

- Chinese edition: [vibe-coding-guide-zh.md](./vibe-coding-guide-zh.md)
- English edition: [vibe-coding-guide-en.md](./vibe-coding-guide-en.md)

## Who This Is For

- Developers using Codex, Claude Code, Cursor, Aider, or similar AI coding tools
- Engineers who want to make AI agents part of their daily development workflow
- Teams coordinating multiple agents, worktrees, sessions, specs, or reviews
- Anyone building team-level rules for AI coding, skills, prompts, CI, and agent review

## What You Will Learn

- How to write specs with clear acceptance criteria
- How to maintain `AGENTS.md` / `CLAUDE.md` as durable project knowledge
- How to manage context windows and know when to compress, switch, or restart
- How to use subagents, workflow patterns, and multi-agent collaboration
- How git worktrees support safe parallel agent development
- How to turn repeated work into reusable skills
- How to separate system prompts from user prompts
- How CI/CD and tests constrain agent-written code
- How to test agent behavior, not just ordinary functions

## Suggested Reading Path

1. Read chapters 1-5 first to understand the basic Vibe Coding workflow.
2. Read chapters 6-9 if you want to run parallel agent work.
3. Read chapters 10-13 if you want to turn the process into team practice.
4. Use chapters 14-16 as a checklist for advanced habits and anti-patterns.

## Repository Structure

```text
.
├── README.md
├── README.en.md
├── vibe-coding-guide-zh.md
└── vibe-coding-guide-en.md
```

## License

No license has been specified yet. Add one before redistributing or reusing this material in a public project.
