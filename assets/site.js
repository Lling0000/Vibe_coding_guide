const CHAPTER_COUNT = 19;
const REVIEW_INTERVALS = [2, 3, 5, 7];
const REVIEW_OFFSETS = REVIEW_INTERVALS.reduce((offsets, interval) => {
  const previous = offsets.at(-1) || 0;
  offsets.push(previous + interval);
  return offsets;
}, []);
const PLAN_DAY_COUNT = CHAPTER_COUNT + REVIEW_OFFSETS.at(-1);

const docs = {
  zh: {
    label: "中文",
    path: "./vibe-coding-guide-zh.md",
    pdf: "./vibe-coding-guide-zh.pdf",
    title: "AI Coding -> 可复用的工程工作流。",
    summary:
      "这不是 prompt 话术合集，而是一套从 spec、上下文、subagent、worktree、skill 到 CI、测试和审查的工程操作手册。",
    status: "中文教程",
    sections: "章",
    metrics: {
      chapters: "章",
      languages: "种语言",
      pdf: "已包含",
    },
  },
  en: {
    label: "EN",
    path: "./vibe-coding-guide-en.md",
    pdf: "./vibe-coding-guide-en.pdf",
    title: "AI coding -> repeatable engineering workflow.",
    summary:
      "Not a prompt collection: a field guide to specs, context, subagents, worktrees, skills, CI, tests, and review habits around AI-written code.",
    status: "English guide",
    sections: "chapters",
    metrics: {
      chapters: "chapters",
      languages: "languages",
      pdf: "included",
    },
  },
};

const chapters = {
  zh: [
    {
      title: "什么是 Vibe Coding?",
      focus: "理解你的角色从写每个字符，变成管理 Agent 的注意力、边界和验收。",
      teachPrompt: "为什么 Vibe Coding 的核心不是写代码，而是管理 Agent 的注意力?",
      applyPrompt: "把你当前项目的一项任务拆成 spec、context、review、verify 四步。",
    },
    {
      title: "Spec 是什么?为什么它是一切的起点?",
      focus: "把模糊愿望改写成背景、目标、非目标、方案和验收。",
      teachPrompt: "什么样的 Spec 能让 Agent 少猜、少跑偏?",
      applyPrompt: "为一个真实小功能写出背景、目标、非目标和验收标准。",
    },
    {
      title: "AGENTS.md / CLAUDE.md 里存什么?",
      focus: "把项目约定、命令、红线和坑沉淀成 Agent 可复用的上下文。",
      teachPrompt: "AGENTS.md 应该保存哪些长期约定，哪些内容不该放进去?",
      applyPrompt: "给一个真实项目补 5 条命令、红线或历史坑。",
    },
    {
      title: "冷启动:接手一个新项目怎么办?",
      focus: "在新项目或陌生项目里先建地图，再让 Agent 动手。",
      teachPrompt: "冷启动时为什么要先建地图，再让 Agent 改代码?",
      applyPrompt: "列出一个新仓库探索清单：入口、命令、风险和热身任务。",
    },
    {
      title: "上下文管理:压缩、切换、清零",
      focus: "判断什么时候继续、压缩、交接或重开，保护会话质量。",
      teachPrompt: "什么时候应该压缩上下文、写 handoff，或者直接重开 session?",
      applyPrompt: "写一份 handoff 或 blocker note 模板，并填一个真实例子。",
    },
    {
      title: "MCP:给 Agent 接上工具与外部上下文",
      focus: "用 MCP 把 GitHub、数据库、Sentry 等外部能力接入 Agent。",
      teachPrompt: "MCP 解决了什么问题，又把哪些安全风险带进来了?",
      applyPrompt: "给一个任务列出应该开启和关闭的 MCP server，并写出原因。",
    },
    {
      title: "Subagent 的使用",
      focus: "把独立问题交给子 Agent，用隔离上下文降低主线噪音。",
      teachPrompt: "什么任务适合派给 subagent，什么任务不适合?",
      applyPrompt: "把一个复杂任务拆成主线任务和两个 subagent 调研任务。",
    },
    {
      title: "Agent 协作模式与 Workflow",
      focus: "区分 workflow 和 autonomous agent，选择合适的协作模式。",
      teachPrompt: "Workflow 和 autonomous agent 的根本区别是什么?",
      applyPrompt: "为一个真实需求选择 chaining、routing 或 evaluator 等协作模式。",
    },
    {
      title: "仓库卫生与 Git Worktree",
      focus: "用 .gitignore 和 worktree 保护仓库并隔离多 Agent 并行。",
      teachPrompt: "为什么 worktree 是多 Agent 并行的安全底座?",
      applyPrompt: "画出三个并行 worktree 的目录、分支和各自允许改动范围。",
    },
    {
      title: "云端 / 后台 / 异步 Agent",
      focus: "用云端 Agent 和 loop engineering 做长周期、目标驱动的自动化。",
      teachPrompt: "本地、云端、后台 Agent 分别适合什么类型的工作?",
      applyPrompt: "写一个异步 Agent 派活 spec，包含范围、权限和验收标准。",
    },
    {
      title: "Skill 的创建",
      focus: "把反复做的任务沉淀成可调用、可迭代的工作流。",
      teachPrompt: "Skill、AGENTS.md 和一次性 Spec 的边界分别是什么?",
      applyPrompt: "把一个重复任务改写成 Skill 的触发条件、输入和步骤。",
    },
    {
      title: "系统提示词 vs User 提示词",
      focus: "把长期行为约束和一次性任务输入分层管理。",
      teachPrompt: "system prompt 和 user prompt 应该分别承载什么?",
      applyPrompt: "把一个混乱 prompt 拆成长期规则和本次任务两部分。",
    },
    {
      title: "CI/CD",
      focus: "用自动化验证、HTML artifact 审查和 review 给 Agent 产出加护栏。",
      teachPrompt: "CI/CD 在 Agent 写代码的流程里应该拦住哪些问题?",
      applyPrompt: "给一个项目列出最小 CI 检查和合并前人工 review checklist。",
    },
    {
      title: "Hooks:确定性护栏",
      focus: "在工具调用前后用脚本拦截危险操作，补 AGENTS.md 约束。",
      teachPrompt: "Hooks 和 CI 的边界有什么不同?",
      applyPrompt: "设计一个 preToolUse 或提交前 hook，明确它要拦什么。",
    },
    {
      title: "测试",
      focus: "既测试普通代码，也用 TDD 和 eval harness 测试 Agent 行为。",
      teachPrompt: "为什么要同时测试普通代码和 Agent 行为?",
      applyPrompt: "为一个 Agent 任务写 case、期望行为、失败信号和证据。",
    },
    {
      title: "安全:Prompt 注入与 Agent 权限",
      focus: "理解 lethal trifecta，最小化权限并配合 Hooks 与 CI。",
      teachPrompt: "什么是 lethal trifecta，为什么它对 coding agent 特别危险?",
      applyPrompt: "给你的工具权限做一次最小权限审计，列出需要降权的项。",
    },
    {
      title: "几个高阶心法",
      focus: "建立先听计划、频繁 commit、拒绝看起来对等操作习惯。",
      teachPrompt: "哪些习惯能让你更像 Agent 指挥官，而不是被动验收者?",
      applyPrompt: "挑一个自己的坏习惯，写成下次对 Agent 的开场约束。",
    },
    {
      title: "一个完整的工作流示例",
      focus: "把 spec、拆分、实现、验证、提交和交接串成完整闭环。",
      teachPrompt: "从 spec 到提交，一个完整 Agent 工作流有哪些关口?",
      applyPrompt: "按本章结构，把一个自己的小任务画成流程图或步骤表。",
    },
    {
      title: "常见反模式速查",
      focus: "识别会让 Agent 产出失控、难审、难回滚的习惯。",
      teachPrompt: "哪些反模式最容易在你的日常 AI Coding 中出现?",
      applyPrompt: "从反模式表里选 3 个，分别写出对应修正动作。",
    },
  ],
  en: [
    {
      title: "What Is Vibe Coding?",
      focus: "Shift from typing every character to directing agent attention, boundaries, and acceptance.",
      teachPrompt: "Why is Vibe Coding about directing agent attention rather than simply writing code?",
      applyPrompt: "Break one current project task into spec, context, review, and verification.",
    },
    {
      title: "Specs: The Starting Point",
      focus: "Turn vague wishes into background, goals, non-goals, plans, and acceptance checks.",
      teachPrompt: "What makes a spec reduce guessing and drift?",
      applyPrompt: "Write background, goals, non-goals, and acceptance checks for one real feature.",
    },
    {
      title: "What Goes Into AGENTS.md or CLAUDE.md",
      focus: "Capture project rules, commands, red lines, and pitfalls as durable agent context.",
      teachPrompt: "What durable rules belong in AGENTS.md, and what should stay out?",
      applyPrompt: "Add five commands, red lines, or historical pitfalls for a real project.",
    },
    {
      title: "Cold Starts: Joining or Creating a Project",
      focus: "Map the project before asking an agent to change it.",
      teachPrompt: "Why should a cold start build a map before changing code?",
      applyPrompt: "Draft a repository exploration checklist: entry points, commands, risks, warm-up task.",
    },
    {
      title: "Context Management",
      focus: "Decide when to continue, compress, hand off, or reset a session.",
      teachPrompt: "When should you compact, write a handoff, or restart the session?",
      applyPrompt: "Write a handoff or blocker-note template and fill it with one real example.",
    },
    {
      title: "MCP",
      focus: "Connect GitHub, databases, Sentry, and other external tools through MCP.",
      teachPrompt: "What does MCP unlock, and what risks does it introduce?",
      applyPrompt: "List which MCP servers should be enabled or disabled for one task, with reasons.",
    },
    {
      title: "Using Subagents",
      focus: "Delegate isolated questions while protecting the main thread from noise.",
      teachPrompt: "Which tasks are good subagent work, and which should stay on the main thread?",
      applyPrompt: "Split one complex task into a mainline task and two subagent research tasks.",
    },
    {
      title: "Agent Workflows and Collaboration Patterns",
      focus: "Separate workflows from autonomous agents and choose the right collaboration shape.",
      teachPrompt: "What is the core difference between a workflow and an autonomous agent?",
      applyPrompt: "Choose chaining, routing, evaluator, or another pattern for one real requirement.",
    },
    {
      title: "Repository Hygiene and Git Worktrees",
      focus: "Use .gitignore and worktrees to protect the repo and isolate parallel agent work.",
      teachPrompt: "Why are worktrees the safety foundation for parallel agent work?",
      applyPrompt: "Map three parallel worktrees with branches and allowed edit scopes.",
    },
    {
      title: "Cloud, Background, and Async Agents",
      focus: "Run cloud agents and loop engineering for long, goal-driven automation.",
      teachPrompt: "What work belongs to local, cloud, and background agents respectively?",
      applyPrompt: "Write an async-agent assignment spec with scope, permissions, and acceptance checks.",
    },
    {
      title: "Creating Skills",
      focus: "Turn repeated tasks into reusable, improvable workflows.",
      teachPrompt: "Where are the boundaries between a skill, AGENTS.md, and a one-off spec?",
      applyPrompt: "Turn one repeated task into a skill trigger, inputs, and steps.",
    },
    {
      title: "System Prompts vs User Prompts",
      focus: "Separate durable behavior constraints from one-time task input.",
      teachPrompt: "What belongs in the system prompt versus the user prompt?",
      applyPrompt: "Split a messy prompt into durable rules and the current task request.",
    },
    {
      title: "CI/CD for Agent-Written Code",
      focus: "Use automation, HTML artifact review, and review skills to guardrail agent output.",
      teachPrompt: "What should CI/CD catch in an agent-written-code workflow?",
      applyPrompt: "List minimal CI checks and a pre-merge human review checklist for one project.",
    },
    {
      title: "Hooks",
      focus: "Use deterministic scripts before and after tool calls to block unsafe actions.",
      teachPrompt: "How are hooks different from CI?",
      applyPrompt: "Design one preToolUse or pre-commit hook and state exactly what it blocks.",
    },
    {
      title: "Testing Code and Testing Agent Behavior",
      focus: "Test regular code and agent behavior with TDD and eval harnesses.",
      teachPrompt: "Why do you need to test both code and agent behavior?",
      applyPrompt: "Write one agent-behavior case with expected behavior, failure signals, and evidence.",
    },
    {
      title: "Security",
      focus: "Understand the lethal trifecta, minimize permissions, and pair with hooks and CI.",
      teachPrompt: "What is the lethal trifecta, and why is it dangerous for coding agents?",
      applyPrompt: "Audit your tool permissions and list the items that should be reduced.",
    },
    {
      title: "Advanced Principles",
      focus: "Build habits around plan-first work, frequent commits, and rejecting plausible guesses.",
      teachPrompt: "Which habits make you an agent commander instead of a passive acceptor?",
      applyPrompt: "Pick one bad habit and turn it into an opening instruction for your next agent task.",
    },
    {
      title: "A Complete Workflow Example",
      focus: "Connect spec, decomposition, implementation, verification, commit, and handoff.",
      teachPrompt: "What checkpoints connect spec to commit in a complete agent workflow?",
      applyPrompt: "Turn one small task of yours into a workflow diagram or step list.",
    },
    {
      title: "Anti-Patterns Checklist",
      focus: "Spot habits that make agent output hard to review, control, or recover.",
      teachPrompt: "Which anti-patterns are most likely in your own AI coding routine?",
      applyPrompt: "Pick three anti-patterns and write one corrective action for each.",
    },
  ],
};

const copy = {
  zh: {
    brandLine: "AI Coding 工程工作流手册",
    plannerMode: "学习清单",
    scheduleMode: "学习计划",
    readerMode: "全文阅读",
    navKicker: "Feynman Loop",
    navTitle: "19 章 · 36 天费曼间隔练习",
    navCopy: "每天一个新章，到期旧章按 2-3-5-7 间隔短复述。",
    sideProgress: "总进度",
    resetAll: "重置全部进度",
    resetAllConfirm: "确定要清空整条学习路径的所有进度吗?",
    plannerKicker: "Feynman Practice",
    dayTitle: (day) => `Day ${day}: ${dayTitleText("zh", day)}`,
    daySummary: (day) => daySummaryText("zh", day),
    prevDay: "前一天",
    nextDay: "下一天",
    openReader: "打开原文",
    heroCaption: "新学、复述、查漏、应用",
    scopeStat: "今日安排",
    todayStat: "今日完成",
    overallStat: "总进度",
    partSingular: "章",
    partPlural: "章",
    scopeKicker: "Spaced Practice",
    scopeTitle: "今天的新学与复习",
    noteKicker: "Teach Back",
    noteTitle: "费曼讲解草稿",
    notePlaceholder: "我会这样向一个刚开始用 AI Coding 的朋友解释今天的内容...",
    scheduleKicker: "Learning Plan",
    scheduleTitle: "36 天学习计划",
    scheduleSummary: "每天一个新章，到期旧章按 2-3-5-7 间隔短复述。",
    scheduleOpenDay: "回到今日清单",
    matrixKicker: "Schedule Table",
    matrixTitle: "间隔学习总表",
    resetMatrix: "清空表格勾选",
    resetMatrixConfirm: "确定要清空总表里的所有勾选吗?",
    matrixDay: "天",
    matrixLearn: "新学",
    matrixReview: (index) => `复习${index}`,
    matrixItem: (chapterIndex) => `第${chapterIndex}章`,
    checklistKicker: "Daily List",
    checklistTitle: "今日任务清单",
    resetDay: "重置今天",
    startGroup: "先说再读",
    finishGroup: "查漏应用",
    chapterLabel: (index) => `Chapter ${String(index).padStart(2, "0")}`,
    dayLabel: (day) => `Day ${day}`,
    dayScope: (day) => scheduleLabel("zh", day),
    dayProgress: (done, total) => `${done}/${total}`,
    search: "搜索章节",
    top: "顶部",
    readerKicker: "Engineering Field Guide",
    chapterKicker: "章节片段",
    loading: "Loading guide...",
    loadError: "Could not load guide",
    pdf: "下载 PDF",
    github: "GitHub 仓库",
    openChapter: "读原文章节",
    kickoff: (day) => preReadTaskText("zh", day),
    newPart: (day) => `打开第 ${day} 章前，写下一个和它相关的真实工作场景。`,
    explainGoal: "读完后准备一个 3 分钟白话讲解：只讲问题、类比、步骤、例子。",
    finishSummary: (day) => `把「${scheduleLabel("zh", day)}」各写成一句 if-then 规则。`,
    finishAction: "从今天的新学或复习里选一个点，变成今天能执行的微动作。",
    finishQuestion: "记录一个讲不顺的点，并回原文补一个证据。",
    reviewLabel: (review) => `第 ${review.chapterIndex} 章 · Review ${review.reviewNumber} · +${review.offset}d`,
    reviewTitle: (review) => `间隔复习: ${review.chapter.title}`,
    reviewFocus: (review) =>
      `第 ${review.reviewNumber} 次复习：不重读整章，先复述，卡住才回原文。`,
    scopeCount: (schedule) =>
      `${schedule.newChapterIndex ? 1 : 0} 新 · ${schedule.reviews.length} 复`,
  },
  en: {
    brandLine: "AI coding engineering workflow",
    plannerMode: "Checklist",
    scheduleMode: "Plan",
    readerMode: "Reader",
    navKicker: "Feynman Loop",
    navTitle: "19 Chapters · 36-Day Feynman Spacing",
    navCopy: "One new chapter per day; due reviews return on a 2-3-5-7 cadence.",
    sideProgress: "Overall",
    resetAll: "Reset all progress",
    resetAllConfirm: "Clear all progress for this learning path?",
    plannerKicker: "Feynman Practice",
    dayTitle: (day) => `Day ${day}: ${dayTitleText("en", day)}`,
    daySummary: (day) => daySummaryText("en", day),
    prevDay: "Previous",
    nextDay: "Next",
    openReader: "Open guide",
    heroCaption: "Learn, explain, repair, apply",
    scopeStat: "Plan",
    todayStat: "Today",
    overallStat: "Overall",
    partSingular: "chapter",
    partPlural: "chapters",
    scopeKicker: "Spaced Practice",
    scopeTitle: "New and Due Today",
    noteKicker: "Teach Back",
    noteTitle: "Feynman Draft",
    notePlaceholder: "I would explain today's material to a friend starting AI coding like this...",
    scheduleKicker: "Learning Plan",
    scheduleTitle: "36-Day Learning Plan",
    scheduleSummary: "One new chapter per day; due reviews return on a 2-3-5-7 cadence.",
    scheduleOpenDay: "Today's checklist",
    matrixKicker: "Schedule Table",
    matrixTitle: "Spaced Learning Table",
    resetMatrix: "Clear table checks",
    resetMatrixConfirm: "Clear all table checks?",
    matrixDay: "Day",
    matrixLearn: "Learn",
    matrixReview: (index) => `Review ${index}`,
    matrixItem: (chapterIndex) => `Ch. ${chapterIndex}`,
    checklistKicker: "Daily List",
    checklistTitle: "Today's Checklist",
    resetDay: "Reset today",
    startGroup: "Explain First",
    finishGroup: "Repair and Apply",
    chapterLabel: (index) => `Chapter ${String(index).padStart(2, "0")}`,
    dayLabel: (day) => `Day ${day}`,
    dayScope: (day) => scheduleLabel("en", day),
    dayProgress: (done, total) => `${done}/${total}`,
    search: "Search chapters",
    top: "Top",
    readerKicker: "Engineering Field Guide",
    chapterKicker: "Chapter Focus",
    loading: "Loading guide...",
    loadError: "Could not load guide",
    pdf: "Download PDF",
    github: "GitHub repository",
    openChapter: "Read chapter",
    kickoff: (day) => preReadTaskText("en", day),
    newPart: (day) => `Before opening Chapter ${day}, write one real work situation it should help with.`,
    explainGoal: "After reading, prepare a 3-minute plain-language explanation: problem, analogy, steps, example.",
    finishSummary: (day) => `Turn "${scheduleLabel("en", day)}" into one if-then rule each.`,
    finishAction: "Choose one point from today's new or review work and turn it into a micro-action.",
    finishQuestion: "Record one point that still feels hard to explain, then repair it from the guide.",
    reviewLabel: (review) => `Ch. ${review.chapterIndex} · Review ${review.reviewNumber} · +${review.offset}d`,
    reviewTitle: (review) => `Spaced review: ${review.chapter.title}`,
    reviewFocus: (review) =>
      `Review ${review.reviewNumber}: explain first, then reopen the guide only where you get stuck.`,
    scopeCount: (schedule) =>
      `${schedule.newChapterIndex ? 1 : 0} new · ${schedule.reviews.length} review`,
  },
};

const chapterTaskTemplates = {
  zh: [
    {
      key: "predict",
      text: (_chapter, index) => `不看原文，先用 3 句话说出你以为第 ${index} 章要解决的问题。`,
    },
    {
      key: "read",
      text: (chapter) => `阅读「${chapter.title}」，只标 3 个关键词或 1 个贴近工作的例子。`,
    },
    {
      key: "plain",
      text: (chapter) => `合上教程，用 150 字或 3 分钟回答: ${chapter.teachPrompt}`,
    },
    {
      key: "gap",
      text: () => "找出一个讲不顺的词或步骤，回原文补证据。",
    },
    {
      key: "rule",
      text: () => "把本章改写成一句「如果...就...」的操作规则。",
    },
    {
      key: "apply",
      text: (chapter) => `落地练习: ${chapter.applyPrompt}`,
    },
  ],
  en: [
    {
      key: "predict",
      text: (_chapter, index) => `Before reading, explain what problem Chapter ${index} probably solves in three sentences.`,
    },
    {
      key: "read",
      text: (chapter) => `Read "${chapter.title}" and mark only 3 keywords or 1 work-relevant example.`,
    },
    {
      key: "plain",
      text: (chapter) => `Close the guide and answer in 150 words or 3 minutes: ${chapter.teachPrompt}`,
    },
    {
      key: "gap",
      text: () => "Find one term or step that still feels fuzzy, then repair it from the guide.",
    },
    {
      key: "rule",
      text: () => "Rewrite the chapter as one practical if-then rule.",
    },
    {
      key: "apply",
      text: (chapter) => `Practice: ${chapter.applyPrompt}`,
    },
  ],
};

const reviewTaskTemplates = {
  zh: [
    {
      key: "recall",
      text: (review) => `不看原文，用 90 秒讲出「${review.chapter.title}」解决什么问题、怎么做。`,
    },
    {
      key: "repair",
      text: () => "对照原文，只修补一个忘掉或讲不顺的点。",
    },
    {
      key: "connect",
      text: (review) => `把这章和真实项目连起来: ${review.chapter.applyPrompt}`,
    },
  ],
  en: [
    {
      key: "recall",
      text: (review) => `Without reading, explain in 90 seconds what "${review.chapter.title}" solves and how.`,
    },
    {
      key: "repair",
      text: () => "Reopen the guide and repair only one forgotten or fuzzy point.",
    },
    {
      key: "connect",
      text: (review) => `Connect this chapter to a real project: ${review.chapter.applyPrompt}`,
    },
  ],
};

const state = {
  lang: "zh",
  mode: "planner",
  day: 1,
  headings: [],
  chapterTargets: [],
  chapterSections: [],
  focusedChapterIndex: null,
  observer: null,
  guidePromise: null,
};

const els = {
  body: document.body,
  topbar: document.querySelector(".topbar"),
  sidebar: document.querySelector(".sidebar"),
  brandLine: document.querySelector("#brand-line"),
  plannerModeLabel: document.querySelector("#planner-mode-label"),
  scheduleModeLabel: document.querySelector("#schedule-mode-label"),
  readerModeLabel: document.querySelector("#reader-mode-label"),
  plannerView: document.querySelector("#planner-view"),
  scheduleView: document.querySelector("#schedule-view"),
  readerView: document.querySelector("#reader-view"),
  plannerNav: document.querySelector("#planner-nav"),
  readerNav: document.querySelector("#reader-nav"),
  modeButtons: [...document.querySelectorAll(".view-toggle button[data-mode]")],
  langButtons: [...document.querySelectorAll("button[data-lang]")],
  pdf: document.querySelector("#pdf-link"),
  plannerNavKicker: document.querySelector("#planner-nav-kicker"),
  plannerNavTitle: document.querySelector("#planner-nav-title"),
  plannerNavCopy: document.querySelector("#planner-nav-copy"),
  sideProgressLabel: document.querySelector("#side-progress-label"),
  sideProgressValue: document.querySelector("#side-progress-value"),
  sideProgressBar: document.querySelector("#side-progress-bar"),
  resetAllButton: document.querySelector("#reset-all-button"),
  resetAllLabel: document.querySelector("#reset-all-label"),
  dayList: document.querySelector("#day-list"),
  plannerKicker: document.querySelector("#planner-kicker"),
  plannerTitle: document.querySelector("#planner-title"),
  plannerSummary: document.querySelector("#planner-summary"),
  prevDay: document.querySelector("#prev-day-button"),
  nextDay: document.querySelector("#next-day-button"),
  openReader: document.querySelector("#open-reader-button"),
  prevDayLabel: document.querySelector("#prev-day-label"),
  nextDayLabel: document.querySelector("#next-day-label"),
  openReaderLabel: document.querySelector("#open-reader-label"),
  heroCaption: document.querySelector("#hero-visual-caption"),
  scopeStatLabel: document.querySelector("#scope-stat-label"),
  scopeStatValue: document.querySelector("#scope-stat-value"),
  todayStatLabel: document.querySelector("#today-stat-label"),
  todayStatValue: document.querySelector("#today-stat-value"),
  todayProgressBar: document.querySelector("#today-progress-bar"),
  overallStatLabel: document.querySelector("#overall-stat-label"),
  overallStatValue: document.querySelector("#overall-stat-value"),
  overallProgressBar: document.querySelector("#overall-progress-bar"),
  scopeKicker: document.querySelector("#scope-kicker"),
  scopeTitle: document.querySelector("#scope-title"),
  scopeList: document.querySelector("#scope-list"),
  matrixKicker: document.querySelector("#matrix-kicker"),
  matrixTitle: document.querySelector("#matrix-title"),
  matrixTable: document.querySelector("#schedule-table"),
  resetMatrix: document.querySelector("#reset-matrix-button"),
  resetMatrixLabel: document.querySelector("#reset-matrix-label"),
  noteKicker: document.querySelector("#note-kicker"),
  noteTitle: document.querySelector("#note-title"),
  note: document.querySelector("#explain-note"),
  scheduleKicker: document.querySelector("#schedule-kicker"),
  scheduleTitle: document.querySelector("#schedule-title"),
  scheduleSummary: document.querySelector("#schedule-summary"),
  scheduleOpenDayLabel: document.querySelector("#schedule-open-day-label"),
  checklistKicker: document.querySelector("#checklist-kicker"),
  checklistTitle: document.querySelector("#checklist-title"),
  resetDay: document.querySelector("#reset-day-button"),
  resetDayLabel: document.querySelector("#reset-day-label"),
  checklist: document.querySelector("#checklist"),
  article: document.querySelector("#guide-content"),
  toc: document.querySelector("#toc-list"),
  search: document.querySelector("#toc-search"),
  status: document.querySelector("#doc-status"),
  progress: document.querySelector("#reading-progress"),
  top: document.querySelector("#top-button"),
  topLabel: document.querySelector("#top-label"),
  readerKicker: document.querySelector("#reader-kicker"),
  readerTitle: document.querySelector("#reader-title"),
  readerSummary: document.querySelector("#reader-summary"),
  readerMetrics: document.querySelector(".reader-metrics"),
  metricChapters: document.querySelector("#metric-chapters"),
  metricLanguages: document.querySelector("#metric-languages"),
  metricPdf: document.querySelector("#metric-pdf"),
};

function preferredLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang");

  if (requested && docs[requested]) return requested;
  if (window.location.hash === "#en" || window.location.hash === "#zh") {
    return window.location.hash.slice(1);
  }
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function preferredMode() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("view") || params.get("mode");
  if (requested === "reader" || requested === "read") return "reader";
  if (requested === "schedule" || requested === "plan") return "schedule";
  return "planner";
}

function preferredDay() {
  const params = new URLSearchParams(window.location.search);
  const requested = Number(params.get("day"));
  if (Number.isInteger(requested) && requested >= 1 && requested <= PLAN_DAY_COUNT) {
    return requested;
  }

  const stored = Number(getStoredText("feynman:v4:last-day"));
  return Number.isInteger(stored) && stored >= 1 && stored <= PLAN_DAY_COUNT ? stored : 1;
}

function preferredChapter() {
  const params = new URLSearchParams(window.location.search);
  const requested = Number(params.get("chapter"));
  return Number.isInteger(requested) && requested >= 1 && requested <= CHAPTER_COUNT ? requested : null;
}

function getStoredText(key) {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function setStoredText(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Local progress is optional; the static guide still works without storage.
  }
}

function removeStored(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
}

function isChecked(key) {
  return getStoredText(key) === "1";
}

function setChecked(key, checked) {
  if (checked) {
    setStoredText(key, "1");
  } else {
    removeStored(key);
  }
}

function taskId(day, scope, key) {
  return `feynman:v4:day-${day}:${scope}:${key}`;
}

function noteId(day) {
  return `feynman:v4:day-${day}:note`;
}

function matrixId(day, type, chapterIndex, reviewNumber = 0) {
  return `feynman:v4:matrix:day-${day}:${type}-${chapterIndex}-${reviewNumber}`;
}

function chapterTitle(lang, day) {
  return chapters[lang]?.[day - 1]?.title || (lang === "zh" ? "间隔复习" : "Spaced Review");
}

function getDaySchedule(day, lang = state.lang) {
  const newChapter = day <= CHAPTER_COUNT ? chapters[lang][day - 1] : null;
  const reviews = [];

  chapters[lang].forEach((chapter, index) => {
    const chapterIndex = index + 1;
    REVIEW_OFFSETS.forEach((offset, reviewIndex) => {
      if (chapterIndex + offset !== day) return;

      reviews.push({
        chapter,
        chapterIndex,
        offset,
        interval: REVIEW_INTERVALS[reviewIndex],
        reviewNumber: reviewIndex + 1,
      });
    });
  });

  return {
    day,
    newChapter,
    newChapterIndex: newChapter ? day : null,
    reviews,
  };
}

function scheduleLabel(lang, day) {
  const schedule = getDaySchedule(day, lang);
  const parts = [];

  if (schedule.newChapterIndex) {
    parts.push(lang === "zh" ? `新第 ${schedule.newChapterIndex} 章` : `New Ch. ${schedule.newChapterIndex}`);
  }

  if (schedule.reviews.length) {
    const indices = schedule.reviews.map((review) => review.chapterIndex).join(lang === "zh" ? "、" : ", ");
    parts.push(lang === "zh" ? `复第 ${indices} 章` : `Review Ch. ${indices}`);
  }

  return parts.join(" · ") || (lang === "zh" ? "间隔复习" : "Spaced review");
}

function dayTitleText(lang, day) {
  const schedule = getDaySchedule(day, lang);
  if (schedule.newChapterIndex) {
    return lang === "zh" ? `新学第 ${schedule.newChapterIndex} 章` : `Learn Chapter ${schedule.newChapterIndex}`;
  }
  return lang === "zh" ? "间隔复习日" : "Spaced Review Day";
}

function daySummaryText(lang, day) {
  const schedule = getDaySchedule(day, lang);
  const reviewIndices = schedule.reviews.map((review) => review.chapterIndex);

  if (lang === "zh") {
    const newText = schedule.newChapterIndex
      ? `新学第 ${schedule.newChapterIndex} 章「${schedule.newChapter.title}」`
      : "不新增章节";
    const reviewText = reviewIndices.length ? `到期复习第 ${reviewIndices.join("、")} 章` : "没有到期复习";
    return `${newText}；${reviewText}。新章走完整费曼流程，复习章只做短复述、查漏和连接。`;
  }

  const newText = schedule.newChapterIndex
    ? `Learn Chapter ${schedule.newChapterIndex}, "${schedule.newChapter.title}"`
    : "No new chapter";
  const reviewText = reviewIndices.length ? `review Chapter ${reviewIndices.join(", ")}` : "no due reviews";
  return `${newText}; ${reviewText}. New chapters get the full Feynman loop; reviews stay short: explain, repair, connect.`;
}

function preReadTaskText(lang, day) {
  const schedule = getDaySchedule(day, lang);
  if (schedule.newChapterIndex) {
    return lang === "zh"
      ? `不看原文，先用 3 句话说出你以为「${schedule.newChapter.title}」要解决的问题。`
      : `Before reading, explain what problem "${schedule.newChapter.title}" probably solves in three sentences.`;
  }

  return lang === "zh"
    ? "不看原文，先把今天到期复习的每一章各讲 60 秒。"
    : "Before opening the guide, explain each due review chapter for 60 seconds.";
}

function getScheduleMatrixItems(day, lang = state.lang) {
  const schedule = getDaySchedule(day, lang);
  const items = [];

  if (schedule.newChapter) {
    items.push({
      type: "learn",
      column: 0,
      day,
      chapter: schedule.newChapter,
      chapterIndex: schedule.newChapterIndex,
      reviewNumber: 0,
      id: matrixId(day, "learn", schedule.newChapterIndex),
    });
  }

  schedule.reviews.forEach((review) => {
    items.push({
      type: "review",
      column: review.reviewNumber,
      day,
      chapter: review.chapter,
      chapterIndex: review.chapterIndex,
      reviewNumber: review.reviewNumber,
      id: matrixId(day, "review", review.chapterIndex, review.reviewNumber),
    });
  });

  return items;
}

function firstChapterForDay(day, lang = state.lang) {
  const schedule = getDaySchedule(day, lang);
  return schedule.newChapterIndex || schedule.reviews[0]?.chapterIndex || 1;
}

function slugify(text, index) {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[`"'’‘“”]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-_.]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `section-${index + 1}`;
}

function setLanguageChrome(lang) {
  const doc = docs[lang];
  const text = copy[lang];

  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  els.brandLine.textContent = text.brandLine;
  els.plannerModeLabel.textContent = text.plannerMode;
  els.scheduleModeLabel.textContent = text.scheduleMode;
  els.readerModeLabel.textContent = text.readerMode;
  els.pdf.href = doc.pdf;
  els.pdf.title = text.pdf;
  els.pdf.setAttribute("aria-label", text.pdf);
  els.search.placeholder = text.search;
  els.topLabel.textContent = text.top;
  els.readerKicker.textContent = text.readerKicker;
  els.readerTitle.textContent = doc.title;
  els.readerSummary.textContent = doc.summary;
  els.metricChapters.innerHTML = `<strong>${CHAPTER_COUNT}</strong> ${doc.metrics.chapters}`;
  els.metricLanguages.innerHTML = `<strong>2</strong> ${doc.metrics.languages}`;
  els.metricPdf.innerHTML = `<strong>PDF</strong> ${doc.metrics.pdf}`;
  renderReaderHeader();

  els.langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateFixedChromeMetrics();
}

function setMode(mode, shouldUpdateUrl = true) {
  const modes = new Set(["planner", "schedule", "reader"]);
  state.mode = modes.has(mode) ? mode : "planner";
  els.body.dataset.mode = state.mode;
  els.plannerView.hidden = state.mode !== "planner";
  els.scheduleView.hidden = state.mode !== "schedule";
  els.readerView.hidden = state.mode !== "reader";
  els.plannerNav.hidden = state.mode === "reader";
  els.readerNav.hidden = state.mode !== "reader";

  els.modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (shouldUpdateUrl) updateUrl();
  updateReadingProgress();
  window.lucide?.createIcons();
  updateFixedChromeMetrics();
}

function updateFixedChromeMetrics() {
  window.requestAnimationFrame(() => {
    const topbarHeight = Math.ceil(els.topbar?.getBoundingClientRect().height || 0);
    const sidebarHeight = window.matchMedia("(max-width: 920px)").matches
      ? Math.ceil(els.sidebar?.getBoundingClientRect().height || 0)
      : 0;

    if (topbarHeight > 0) {
      document.documentElement.style.setProperty("--topbar-offset", `${topbarHeight}px`);
    }
    if (sidebarHeight > 0) {
      document.documentElement.style.setProperty("--sidebar-offset", `${sidebarHeight}px`);
    }
  });
}

function updateUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set("lang", state.lang);
  params.set("day", String(state.day));
  params.set("view", state.mode);
  if (state.mode === "reader" && state.focusedChapterIndex) {
    params.set("chapter", String(state.focusedChapterIndex));
  } else {
    params.delete("chapter");
  }
  const hash = state.mode === "reader" && state.focusedChapterIndex ? window.location.hash : "";
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${hash}`);
}

function focusedChapterSection() {
  if (!state.focusedChapterIndex) return null;
  return state.chapterSections[state.focusedChapterIndex - 1] || null;
}

function readerVisibleHeadings() {
  const headings = state.headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
  const section = focusedChapterSection();
  if (!section) return headings;

  const nodes = new Set(section.nodes);
  return headings.filter((heading) => nodes.has(heading.element));
}

function renderReaderHeader() {
  const doc = docs[state.lang];
  const text = copy[state.lang];
  const section = focusedChapterSection();

  if (section) {
    const chapter = chapters[state.lang][section.chapterIndex - 1];
    els.readerKicker.textContent = text.chapterKicker;
    els.readerTitle.textContent = section.text;
    els.readerSummary.textContent = chapter?.focus || doc.summary;
    els.readerMetrics.hidden = true;
    return;
  }

  els.readerKicker.textContent = text.readerKicker;
  els.readerTitle.textContent = doc.title;
  els.readerSummary.textContent = doc.summary;
  els.readerMetrics.hidden = false;
}

function updateReaderStatus() {
  const section = focusedChapterSection();
  els.status.textContent = section
    ? `${docs[state.lang].status} · ${section.text}`
    : `${docs[state.lang].status} · ${state.chapterTargets.length} ${docs[state.lang].sections}`;
}

function applyReaderFocus() {
  let section = focusedChapterSection();
  if (state.focusedChapterIndex && !section) {
    state.focusedChapterIndex = null;
    section = null;
  }

  const visibleNodes = new Set(section?.nodes || []);
  els.article.classList.toggle("is-chapter-focused", Boolean(section));
  els.article.querySelectorAll(".is-focused-chapter-start").forEach((heading) => {
    heading.classList.remove("is-focused-chapter-start");
  });

  [...els.article.children].forEach((node) => {
    node.hidden = Boolean(section) && !visibleNodes.has(node);
  });

  if (section) {
    section.element.classList.add("is-focused-chapter-start");
  }

  renderReaderHeader();
  updateReaderStatus();
}

function setReaderFocus(chapterIndex) {
  const next = Number(chapterIndex);
  state.focusedChapterIndex = Number.isInteger(next) && next >= 1 && next <= CHAPTER_COUNT ? next : null;
  applyReaderFocus();
  renderToc();
  observeHeadings();
  updateReadingProgress();
}

function currentHashTarget() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return window.location.hash.slice(1);
  }
}

function syncReaderHashToFocus() {
  const section = focusedChapterSection();
  if (state.mode !== "reader" || !section) return;
  if (currentHashTarget() !== section.id) {
    window.location.hash = section.id;
  }
}

function getDayTaskDefs(day, lang = state.lang) {
  const text = copy[lang];
  const schedule = getDaySchedule(day, lang);
  const defs = [];

  if (schedule.newChapter) {
    const chapter = schedule.newChapter;
    const index = schedule.newChapterIndex;
    chapterTaskTemplates[lang].forEach((task) => {
      defs.push({
        group: `new-${index}`,
        groupTitle: chapter.title,
        groupKicker: text.chapterLabel(index),
        groupFocus: chapter.focus,
        chapter,
        chapterIndex: index,
        scope: `new-${index}`,
        key: task.key,
        text: task.text(chapter, index, day),
      });
    });
  }

  schedule.reviews.forEach((review) => {
    reviewTaskTemplates[lang].forEach((task) => {
      defs.push({
        group: `review-${review.chapterIndex}-${review.reviewNumber}`,
        groupTitle: text.reviewTitle(review),
        groupKicker: text.reviewLabel(review),
        groupFocus: text.reviewFocus(review),
        chapter: review.chapter,
        chapterIndex: review.chapterIndex,
        scope: `review-${review.chapterIndex}-${review.reviewNumber}`,
        key: task.key,
        text: task.text(review, day),
      });
    });
  });

  defs.push(
    {
      group: "finish",
      groupTitle: text.finishGroup,
      scope: "finish",
      key: "summary",
      text: text.finishSummary(day),
    },
    {
      group: "finish",
      groupTitle: text.finishGroup,
      scope: "finish",
      key: "action",
      text: text.finishAction,
    },
    {
      group: "finish",
      groupTitle: text.finishGroup,
      scope: "finish",
      key: "question",
      text: text.finishQuestion,
    },
  );

  return defs.map((task) => ({
    ...task,
    id: taskId(day, task.scope, task.key),
  }));
}

function progressForDay(day) {
  const defs = getDayTaskDefs(day, state.lang);
  const done = defs.filter((task) => isChecked(task.id)).length;
  return {
    done,
    total: defs.length,
    percent: defs.length ? Math.round((done / defs.length) * 100) : 0,
  };
}

function overallProgress() {
  let done = 0;
  let total = 0;

  for (let day = 1; day <= PLAN_DAY_COUNT; day += 1) {
    const progress = progressForDay(day);
    done += progress.done;
    total += progress.total;
  }

  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
  };
}

function renderPlanner() {
  const text = copy[state.lang];
  const schedule = getDaySchedule(state.day);

  els.plannerNavKicker.textContent = text.navKicker;
  els.plannerNavTitle.textContent = text.navTitle;
  els.plannerNavCopy.textContent = text.navCopy;
  els.sideProgressLabel.textContent = text.sideProgress;
  els.resetAllLabel.textContent = text.resetAll;
  els.plannerKicker.textContent = text.plannerKicker;
  els.plannerTitle.textContent = text.dayTitle(state.day);
  els.plannerSummary.textContent = text.daySummary(state.day);
  els.prevDayLabel.textContent = text.prevDay;
  els.nextDayLabel.textContent = text.nextDay;
  els.openReaderLabel.textContent = text.openReader;
  els.heroCaption.textContent = text.heroCaption;
  els.scopeStatLabel.textContent = text.scopeStat;
  els.todayStatLabel.textContent = text.todayStat;
  els.overallStatLabel.textContent = text.overallStat;
  els.scopeKicker.textContent = text.scopeKicker;
  els.scopeTitle.textContent = text.scopeTitle;
  els.noteKicker.textContent = text.noteKicker;
  els.noteTitle.textContent = text.noteTitle;
  els.note.placeholder = text.notePlaceholder;
  els.checklistKicker.textContent = text.checklistKicker;
  els.checklistTitle.textContent = text.checklistTitle;
  els.resetDayLabel.textContent = text.resetDay;
  els.scopeStatValue.textContent = text.scopeCount(schedule);
  els.prevDay.disabled = state.day === 1;
  els.nextDay.disabled = state.day === PLAN_DAY_COUNT;
  els.note.value = getStoredText(noteId(state.day));

  renderDayList();
  renderScope();
  renderChecklist();
  updatePlannerProgress();
  window.lucide?.createIcons();
}

function renderSchedulePlan() {
  const text = copy[state.lang];

  els.scheduleKicker.textContent = text.scheduleKicker;
  els.scheduleTitle.textContent = text.scheduleTitle;
  els.scheduleSummary.textContent = text.scheduleSummary;
  els.scheduleOpenDayLabel.textContent = text.scheduleOpenDay;
  els.matrixKicker.textContent = text.matrixKicker;
  els.matrixTitle.textContent = text.matrixTitle;
  els.resetMatrixLabel.textContent = text.resetMatrix;

  renderScheduleTable();
  window.lucide?.createIcons();
}

function renderDayList() {
  const text = copy[state.lang];
  els.dayList.innerHTML = "";

  for (let day = 1; day <= PLAN_DAY_COUNT; day += 1) {
    const progress = progressForDay(day);
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-button";
    button.dataset.day = String(day);
    button.classList.toggle("is-active", day === state.day);
    button.setAttribute("aria-pressed", String(day === state.day));

    const index = document.createElement("span");
    index.className = "day-button-index";
    index.textContent = String(day).padStart(2, "0");

    const body = document.createElement("span");
    body.className = "day-button-body";

    const label = document.createElement("span");
    label.className = "day-button-label";
    label.textContent = text.dayLabel(day);

    const meta = document.createElement("span");
    meta.className = "day-button-meta";
    meta.textContent = `${text.dayScope(day)} · ${progress.percent}%`;

    const bar = document.createElement("span");
    bar.className = "day-button-progress";
    bar.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    fill.style.width = `${progress.percent}%`;
    bar.append(fill);

    body.append(label, meta, bar);
    button.append(index, body);
    item.append(button);
    els.dayList.append(item);
  }
}

function renderScope() {
  const text = copy[state.lang];
  const schedule = getDaySchedule(state.day);
  els.scopeList.innerHTML = "";

  function appendScopeChip({ chapter, chapterIndex, label, focus }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scope-chip";
    button.dataset.openChapter = String(chapterIndex);

    const labelEl = document.createElement("span");
    labelEl.className = "scope-chip-label";
    labelEl.textContent = label;

    const title = document.createElement("strong");
    title.textContent = chapter.title;

    const focusEl = document.createElement("span");
    focusEl.className = "scope-chip-focus";
    focusEl.textContent = focus;

    button.append(labelEl, title, focusEl);
    els.scopeList.append(button);
  }

  if (schedule.newChapter) {
    appendScopeChip({
      chapter: schedule.newChapter,
      chapterIndex: schedule.newChapterIndex,
      label: text.chapterLabel(schedule.newChapterIndex),
      focus: schedule.newChapter.focus,
    });
  }

  schedule.reviews.forEach((review) => {
    appendScopeChip({
      chapter: review.chapter,
      chapterIndex: review.chapterIndex,
      label: text.reviewLabel(review),
      focus: text.reviewFocus(review),
    });
  });
}

function renderScheduleTable() {
  const text = copy[state.lang];
  const columns = [
    { key: "day", label: text.matrixDay },
    { key: "learn", label: text.matrixLearn },
    ...REVIEW_INTERVALS.map((_, index) => ({
      key: `review-${index + 1}`,
      label: text.matrixReview(index + 1),
    })),
  ];

  els.matrixTable.innerHTML = "";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column.label;
    headRow.append(th);
  });
  thead.append(headRow);

  const tbody = document.createElement("tbody");
  for (let day = 1; day <= PLAN_DAY_COUNT; day += 1) {
    const row = document.createElement("tr");
    row.classList.toggle("is-active", day === state.day);

    const dayHeader = document.createElement("th");
    dayHeader.scope = "row";
    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "schedule-day-link";
    dayButton.dataset.day = String(day);
    dayButton.textContent = text.dayLabel(day);
    dayHeader.append(dayButton);
    row.append(dayHeader);

    const itemsByColumn = new Map(getScheduleMatrixItems(day).map((item) => [item.column, item]));
    for (let column = 0; column <= REVIEW_INTERVALS.length; column += 1) {
      const cell = document.createElement("td");
      const item = itemsByColumn.get(column);

      if (item) {
        const cellWrap = document.createElement("div");
        cellWrap.className = "schedule-cell";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "schedule-cell-link";
        button.dataset.day = String(item.day);
        button.dataset.openChapter = String(item.chapterIndex);
        button.dataset.scheduleJump = "true";
        button.title = item.chapter.title;
        button.textContent = text.matrixItem(item.chapterIndex);

        const label = document.createElement("label");
        label.className = "schedule-check";
        label.title = item.chapter.title;

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = isChecked(item.id);
        input.dataset.matrixId = item.id;

        const mark = document.createElement("span");
        mark.className = "schedule-check-mark";
        mark.setAttribute("aria-hidden", "true");

        label.append(input, mark);
        cellWrap.append(button, label);
        cell.append(cellWrap);
        cell.classList.toggle("is-complete", input.checked);
      }

      row.append(cell);
    }

    tbody.append(row);
  }

  els.matrixTable.append(thead, tbody);
}

function renderChecklist() {
  const text = copy[state.lang];
  const defs = getDayTaskDefs(state.day);
  const groups = new Map();
  els.checklist.innerHTML = "";

  defs.forEach((task) => {
    if (!groups.has(task.group)) {
      groups.set(task.group, {
        title: task.groupTitle,
        kicker: task.groupKicker,
        focus: task.groupFocus,
        chapter: task.chapter,
        chapterIndex: task.chapterIndex,
        tasks: [],
      });
    }
    groups.get(task.group).tasks.push(task);
  });

  groups.forEach((group, key) => {
    const card = document.createElement("article");
    card.className = "task-group";
    card.dataset.group = key;

    const header = document.createElement("div");
    header.className = "task-group-header";

    const headingWrap = document.createElement("div");
    const kicker = document.createElement("span");
    kicker.className = "task-group-kicker";
    kicker.textContent = group.kicker || (group.chapterIndex ? text.chapterLabel(group.chapterIndex) : group.title);

    const title = document.createElement("h3");
    title.textContent = group.chapterIndex ? group.title : group.title;

    headingWrap.append(kicker, title);

    const meta = document.createElement("div");
    meta.className = "task-group-meta";
    meta.dataset.groupCount = "";
    meta.textContent = "0/0";

    if (group.chapterIndex) {
      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.className = "icon-button small";
      openButton.dataset.openChapter = String(group.chapterIndex);
      openButton.title = text.openChapter;
      openButton.setAttribute("aria-label", text.openChapter);
      openButton.innerHTML = '<i data-lucide="book-open-text" aria-hidden="true"></i>';
      meta.append(openButton);
    }

    header.append(headingWrap, meta);

    if (group.focus || group.chapter?.focus) {
      const focus = document.createElement("p");
      focus.className = "task-group-focus";
      focus.textContent = group.focus || group.chapter.focus;
      card.append(header, focus);
    } else {
      card.append(header);
    }

    const list = document.createElement("ul");
    list.className = "task-list";

    group.tasks.forEach((task) => {
      const item = document.createElement("li");
      const label = document.createElement("label");
      label.className = "task-check";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = isChecked(task.id);
      input.dataset.taskId = task.id;

      const box = document.createElement("span");
      box.className = "task-box";
      box.setAttribute("aria-hidden", "true");

      const copySpan = document.createElement("span");
      copySpan.className = "task-text";
      copySpan.textContent = task.text;

      label.append(input, box, copySpan);
      item.append(label);
      list.append(item);
    });

    card.append(list);
    els.checklist.append(card);
  });

  updateGroupCompletion();
}

function updateGroupCompletion() {
  els.checklist.querySelectorAll(".task-group").forEach((group) => {
    const inputs = [...group.querySelectorAll("input[type='checkbox']")];
    const done = inputs.filter((input) => input.checked).length;
    const total = inputs.length;
    group.classList.toggle("is-complete", total > 0 && done === total);
    const counter = group.querySelector("[data-group-count]");
    if (counter) {
      const textNode = [...counter.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = `${done}/${total}`;
      } else {
        counter.prepend(document.createTextNode(`${done}/${total}`));
      }
    }
  });
}

function updatePlannerProgress() {
  const text = copy[state.lang];
  const today = progressForDay(state.day);
  const overall = overallProgress();

  els.todayStatValue.textContent = text.dayProgress(today.done, today.total);
  els.todayProgressBar.style.width = `${today.percent}%`;
  els.overallStatValue.textContent = `${overall.percent}%`;
  els.overallProgressBar.style.width = `${overall.percent}%`;
  els.sideProgressValue.textContent = `${overall.percent}%`;
  els.sideProgressBar.style.width = `${overall.percent}%`;
  updateGroupCompletion();
}

function setDay(day, shouldUpdateUrl = true) {
  const next = Math.min(PLAN_DAY_COUNT, Math.max(1, Number(day)));
  if (!Number.isInteger(next)) return;

  state.day = next;
  setStoredText("feynman:v4:last-day", String(next));
  renderPlanner();
  renderSchedulePlan();
  if (shouldUpdateUrl) updateUrl();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDay(day) {
  getDayTaskDefs(day).forEach((task) => removeStored(task.id));
  removeStored(noteId(day));
  renderPlanner();
  renderSchedulePlan();
}

function resetAllProgress() {
  if (!window.confirm(copy[state.lang].resetAllConfirm)) return;

  for (let day = 1; day <= PLAN_DAY_COUNT; day += 1) {
    getDayTaskDefs(day).forEach((task) => removeStored(task.id));
    getScheduleMatrixItems(day).forEach((item) => removeStored(item.id));
    removeStored(noteId(day));
  }
  renderPlanner();
  renderSchedulePlan();
}

function resetMatrixProgress() {
  if (!window.confirm(copy[state.lang].resetMatrixConfirm)) return;

  for (let day = 1; day <= PLAN_DAY_COUNT; day += 1) {
    getScheduleMatrixItems(day).forEach((item) => removeStored(item.id));
  }
  renderSchedulePlan();
}

async function loadGuide(lang, shouldUpdateUrl = true) {
  state.lang = lang;
  setLanguageChrome(lang);
  renderPlanner();
  renderSchedulePlan();
  els.article.classList.add("loading");
  els.article.innerHTML = copy[lang].loading;
  els.status.textContent = `${docs[lang].status} · loading`;

  if (!window.marked || !window.DOMPurify) {
    throw new Error("Markdown renderer is unavailable.");
  }

  const response = await fetch(docs[lang].path, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Unable to load ${docs[lang].path}`);
  }

  const markdown = await response.text();
  const rendered = marked.parse(markdown, {
    gfm: true,
  });

  els.article.innerHTML = DOMPurify.sanitize(rendered);
  els.article.classList.remove("loading");

  postProcessArticle();
  applyReaderFocus();
  syncReaderHashToFocus();
  renderToc();
  observeHeadings();
  updateReadingProgress();
  window.lucide?.createIcons();

  updateReaderStatus();

  if (shouldUpdateUrl) updateUrl();

  if (state.mode === "reader" && window.location.hash.length > 1) {
    window.setTimeout(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" });
    }, 0);
  }
}

function postProcessArticle() {
  const headingCounts = new Map();
  state.headings = [...els.article.querySelectorAll("h1, h2, h3")].map((heading, index) => {
    const text = heading.textContent.trim();
    const base = slugify(text, index);
    const count = headingCounts.get(base) || 0;
    headingCounts.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    heading.id = id;

    return {
      id,
      text,
      depth: Number(heading.tagName.slice(1)),
      element: heading,
    };
  });

  const chapterPattern = state.lang === "zh" ? /^[一二三四五六七八九十]+、/ : /^\d+\.\s/;
  state.chapterTargets = state.headings
    .filter((heading) => heading.depth === 2 && chapterPattern.test(heading.text))
    .slice(0, CHAPTER_COUNT);

  els.article.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    if (href.endsWith("vibe-coding-guide-zh.md")) {
      link.setAttribute("href", "?lang=zh");
    } else if (href.endsWith("vibe-coding-guide-en.md")) {
      link.setAttribute("href", "?lang=en");
    } else if (/^https?:\/\//.test(href)) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
  });

  els.article.querySelectorAll("pre code.language-mermaid").forEach((code) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mermaid";
    wrapper.textContent = code.textContent;
    code.closest("pre").replaceWith(wrapper);
  });

  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        background: "#ffffff",
        primaryColor: "#d8ede8",
        primaryTextColor: "#1d2528",
        primaryBorderColor: "#0f766e",
        lineColor: "#6b665d",
        secondaryColor: "#edf4f2",
        tertiaryColor: "#f6faf8",
      },
    });
    mermaid.run({ querySelector: ".mermaid" });
  }

  const articleChildren = [...els.article.children];
  state.chapterSections = state.chapterTargets
    .map((target, index) => {
      const start = articleChildren.indexOf(target.element);
      const nextTarget = state.chapterTargets[index + 1];
      const end = nextTarget ? articleChildren.indexOf(nextTarget.element) : articleChildren.length;
      if (start < 0) return null;

      return {
        ...target,
        chapterIndex: index + 1,
        nodes: articleChildren.slice(start, end > start ? end : articleChildren.length),
      };
    })
    .filter(Boolean);
}

function renderToc() {
  const query = els.search.value.trim().toLowerCase();
  els.toc.innerHTML = "";

  readerVisibleHeadings()
    .forEach((heading) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.className = `depth-${heading.depth}`;
      link.textContent = heading.text;

      if (query && !heading.text.toLowerCase().includes(query)) {
        item.classList.add("is-hidden");
      }

      item.append(link);
      els.toc.append(item);
    });
}

function observeHeadings() {
  state.observer?.disconnect();
  const links = new Map([...els.toc.querySelectorAll("a")].map((link) => [link.hash.slice(1), link]));

  state.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((candidate) => candidate.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    {
      rootMargin: "-18% 0px -72% 0px",
      threshold: 0,
    },
  );

  readerVisibleHeadings().forEach((heading) => state.observer.observe(heading.element));
}

function updateReadingProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
  els.progress.style.width = `${progress}%`;
}

async function openChapter(chapterIndex) {
  if (state.guidePromise) {
    await state.guidePromise.catch(() => {});
  }

  const target = state.chapterTargets[chapterIndex - 1];
  if (!target) return;

  setReaderFocus(chapterIndex);
  setMode("reader");
  window.location.hash = target.id;
  window.setTimeout(() => {
    target.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 40);
}

function showError(error) {
  console.error(error);
  const text = copy[state.lang];
  els.status.textContent = text.loadError;
  els.article.classList.remove("loading");
  els.article.innerHTML = `<h1>${text.loadError}</h1><p>${error.message}</p>`;
}

document.addEventListener("click", (event) => {
  const scheduleJump = event.target.closest("[data-schedule-jump]");
  if (scheduleJump) {
    const day = Number(scheduleJump.dataset.day);
    const chapter = Number(scheduleJump.dataset.openChapter);
    setDay(day);
    openChapter(chapter);
    return;
  }

  const modeButton = event.target.closest("button[data-mode]");
  if (modeButton) {
    if (modeButton.dataset.mode === "reader") {
      setReaderFocus(null);
    }
    setMode(modeButton.dataset.mode);
    return;
  }

  const langButton = event.target.closest("button[data-lang]");
  if (langButton) {
    const lang = langButton.dataset.lang;
    if (lang && docs[lang] && lang !== state.lang) {
      state.guidePromise = loadGuide(lang).catch(showError);
    }
    return;
  }

  const dayButton = event.target.closest("button[data-day]");
  if (dayButton) {
    const isScheduleDay = Boolean(dayButton.closest("#schedule-table"));
    setDay(Number(dayButton.dataset.day));
    if (isScheduleDay) {
      setMode("planner");
    }
    return;
  }

  const openChapterButton = event.target.closest("[data-open-chapter]");
  if (openChapterButton) {
    openChapter(Number(openChapterButton.dataset.openChapter));
    return;
  }

  const link = event.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href");
  if (href !== "?lang=zh" && href !== "?lang=en") return;

  event.preventDefault();
  const lang = new URL(link.href).searchParams.get("lang");
  if (lang && docs[lang]) {
    state.guidePromise = loadGuide(lang).catch(showError);
  }
});

els.checklist.addEventListener("change", (event) => {
  const input = event.target.closest("input[type='checkbox'][data-task-id]");
  if (!input) return;

  setChecked(input.dataset.taskId, input.checked);
  updatePlannerProgress();
  renderDayList();
});

els.matrixTable.addEventListener("change", (event) => {
  const input = event.target.closest("input[type='checkbox'][data-matrix-id]");
  if (!input) return;

  setChecked(input.dataset.matrixId, input.checked);
  input.closest("td")?.classList.toggle("is-complete", input.checked);
});

els.note.addEventListener("input", () => {
  setStoredText(noteId(state.day), els.note.value);
});

els.prevDay.addEventListener("click", () => setDay(state.day - 1));
els.nextDay.addEventListener("click", () => setDay(state.day + 1));
els.openReader.addEventListener("click", () => openChapter(firstChapterForDay(state.day)));
els.resetDay.addEventListener("click", () => resetDay(state.day));
els.resetAllButton.addEventListener("click", resetAllProgress);
els.resetMatrix.addEventListener("click", resetMatrixProgress);
els.search.addEventListener("input", renderToc);
els.top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", () => {
  updateFixedChromeMetrics();
  updateReadingProgress();
});
window.visualViewport?.addEventListener("resize", updateFixedChromeMetrics);

if (window.ResizeObserver) {
  const fixedChromeObserver = new ResizeObserver(updateFixedChromeMetrics);
  [els.topbar, els.sidebar].filter(Boolean).forEach((node) => fixedChromeObserver.observe(node));
}

state.lang = preferredLanguage();
state.mode = preferredMode();
state.day = preferredDay();
state.focusedChapterIndex = state.mode === "reader" ? preferredChapter() : null;
setLanguageChrome(state.lang);
renderPlanner();
renderSchedulePlan();
setMode(state.mode, false);
state.guidePromise = loadGuide(state.lang, false).catch(showError);
