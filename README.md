# Vibe Coding Guide

语言版本：中文 | [English](./README.en.md)

## 项目介绍

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

## 仓库结构

```text
.
├── README.md
├── README.en.md
├── vibe-coding-guide-zh.md
└── vibe-coding-guide-en.md
```

## 许可

当前尚未指定开源许可证。如果要公开复用、转载或二次分发，建议先补充明确的 License。
