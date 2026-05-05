# Vibe Coding Guide

## 中文介绍

这是一个面向 AI Agent 协作开发的 Vibe Coding 实战教程仓库。

本仓库包含中文原版与英文版本，覆盖从写 spec、维护 AGENTS.md、管理上下文，到 subagent、workflow、worktree、skill、CI/CD 和 Agent 行为测试的完整实践。

这份教程强调的不是“让 AI 自动写代码”，而是如何像工程负责人一样指挥 Agent：给清楚的上下文，拆分任务，审查 diff，沉淀项目知识，用测试和 CI 把 Agent 产出的代码管住。

## 文档

- 中文版：[vibe-coding-guide-zh.md](./vibe-coding-guide-zh.md)
- English version: [vibe-coding-guide-en.md](./vibe-coding-guide-en.md)

## 适合谁读

- 正在使用 Codex、Claude Code、Cursor、Aider 等 AI Coding 工具的人
- 想把 AI Agent 纳入日常开发流程的工程师
- 需要组织多个 Agent、多个 worktree 或多个 session 协作的人
- 正在建设团队级 AI coding 规范、skill、CI 和 review 流程的人

## 核心主题

- 如何写清楚 spec，并把验收标准变成 Agent 的工作边界
- 如何维护 AGENTS.md / CLAUDE.md，让项目知识长期沉淀
- 如何管理上下文窗口，什么时候压缩、切换、清零
- 如何使用 subagent、workflow 和多 Agent 协作模式
- 如何用 git worktree 支撑并行开发
- 如何把重复任务固化成 Skill
- 如何区分 system prompt 与 user prompt
- 如何用 CI/CD 和测试约束 Agent 产出的代码质量
- 如何测试 Agent 行为本身，而不只是测试普通代码

## 建议阅读路径

1. 先读中文版或英文版的第 1-5 章，建立 Vibe Coding 的基本工作方式。
2. 如果你要并行开发，重点读第 6-9 章。
3. 如果你要把流程产品化或团队化，重点读第 10-13 章。
4. 最后用第 14-16 章检查自己的日常工作流和反模式。

## English Introduction

This repository contains a practical Vibe Coding guide for developers who collaborate with AI coding agents.

It includes both the original Chinese edition and an English edition. The guide covers the full working loop: writing specs, maintaining `AGENTS.md`, managing context, using subagents and workflows, working with git worktrees, creating reusable skills, designing prompts, setting up CI/CD, and testing agent behavior.

The core idea is not to let AI "just write code." The goal is to direct agents like an engineering lead: provide precise context, split work into reviewable steps, inspect diffs, preserve project knowledge in files, and use tests plus CI to control quality.

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
├── vibe-coding-guide-zh.md
└── vibe-coding-guide-en.md
```

## License

No license has been specified yet. Add one before redistributing or reusing this material in a public project.
