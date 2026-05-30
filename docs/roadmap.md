# Roadmap

This roadmap keeps the project focused on the same promise as the front page: turning AI coding into an engineering workflow.

## Current Position

The repository already includes:

- a full Chinese guide
- a full English guide
- PDF versions for both languages
- a GitHub Pages reader and 16-day Feynman learning checklist
- front-door documentation for English and Chinese readers

The next work should make the guide easier to apply, verify, and share without inventing product claims that are not present in the repository.

## Near-Term Priorities

| Priority | Why it matters | Good first contribution |
|---|---|---|
| Bilingual parity | Readers should get the same core guidance in either language | Compare one chapter and submit a meaning-preserving correction |
| Workflow templates | The guide becomes more reusable when concepts turn into files | Add a spec template, handoff template, or review checklist |
| Tool-specific notes | Codex, Claude Code, Cursor, and Aider have different mechanics | Add clearly labeled notes without making them universal claims |
| Case examples | Agent behavior testing is easier to understand with real cases | Add a small case with input, context, expected behavior, and failure signals |
| Website navigation | The Pages entry should stay useful for both skimming and deep reading | Improve static navigation without adding a build framework |
| Docs CI | Link regressions are easy to catch automatically | Extend the existing docs sanity check only if it stays dependency-light |

## Possible Additions

- `docs/templates/spec.md`
- `docs/templates/handoff.md`
- `docs/templates/agent-review.md`
- `docs/examples/worktree-parallel-workflow.md`
- `docs/examples/agent-behavior-case.md`
- a short glossary for spec, context, subagent, workflow, worktree, skill, and guardrail

## Not Planned Right Now

- Turning the repository into a software package
- Adding a frontend framework or build pipeline for the static site
- Claiming benchmarked productivity improvements without evidence
- Replacing the guide with tool-specific marketing copy
- Adding a license type without an explicit repository-owner decision

## 中文摘要

当前仓库已经有中英完整教程、PDF 和 GitHub Pages 学习清单。下一步最值得做的，是补可复用模板、真实 case、双语一致性、工具差异说明和轻量文档检查。

暂不建议把它包装成软件包，也不建议在没有证据的情况下写效率提升数字；许可证类型也需要仓库所有者明确选择后再添加。
