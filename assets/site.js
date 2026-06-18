const CHAPTER_COUNT = 19;
const REVIEW_INTERVALS = [2, 3, 5, 7];
const REVIEW_OFFSETS = REVIEW_INTERVALS.reduce((offsets, interval) => {
  const previous = offsets.at(-1) || 0;
  offsets.push(previous + interval);
  return offsets;
}, []);
const PLAN_DAY_COUNT = CHAPTER_COUNT + REVIEW_OFFSETS.at(-1);
const ANNOTATABLE_SELECTOR = "h1, h2, h3, h4, h5, h6, p, li, blockquote, td, th, pre";
const DISCUSSION_NEW_URL = "https://github.com/Lling0000/Vibe_coding_guide/discussions/new?category=q-a";
const PDF_EXPORT_SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js",
];
const PDF_A4_PORTRAIT = {
  widthMm: 210,
  heightMm: 297,
  widthPx: 794,
  heightPx: 1122,
  rowsPerPage: 18,
};
const scriptPromises = new Map();

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
    exportMatrixPdf: "导出 PDF",
    exportMatrixPdfBusy: "生成 A4 PDF...",
    exportMatrixPdfTitle: "Vibe Coding Guide · 36 天学习计划",
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
    prevChapterKicker: "上一章",
    nextChapterKicker: "下一章",
    chapterPageTitle: (index, title) => `第 ${index} 章 · ${title}`,
    chapterUnavailable: "没有更多章节",
    annotationKicker: "Reader Notes",
    annotationTitle: "批注评论",
    annotationStatus: "选中正文后，点击高亮、下划线或评论。",
    annotationEmpty: "当前阅读范围还没有批注。",
    annotationNeedSelection: "先在正文里选中一段文字。",
    annotationOutside: "请选中正文里的文字。",
    annotationSameBlock: "这段选择暂时无法转换成批注，请少选一点，或避开图表区域。",
    annotationCommentPrompt: "给这段文字添加评论：",
    annotationNoComment: "没有评论",
    annotationSaved: "批注已保存。",
    annotationDeleted: "批注已删除。",
    annotationHighlight: "高亮",
    annotationUnderline: "下划线",
    annotationComment: "评论",
    annotationDelete: "删除",
    annotationDiscuss: "发到讨论",
    annotationCopied: "已复制批注内容，并打开 GitHub Discussions。",
    annotationCopyFailed: "已打开 GitHub Discussions；如果没有自动复制，请手动复制卡片内容。",
    annotationChapterLabel: (index) => `第 ${index} 章`,
    annotationDiscussionTitle: (chapterLabel, title) => `阅读批注：${chapterLabel} ${title}`,
    annotationDiscussionBody: ({ chapterLabel, chapterTitle, quote, comment, url }) =>
      [
        `## 章节`,
        `${chapterLabel} · ${chapterTitle}`,
        "",
        "## 原文摘录",
        `> ${quote}`,
        "",
        "## 我的评论",
        comment || "（这里补充你的想法）",
        "",
        "## 页面",
        url,
      ].join("\n"),
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
    exportMatrixPdf: "Export PDF",
    exportMatrixPdfBusy: "Building A4 PDF...",
    exportMatrixPdfTitle: "Vibe Coding Guide · 36-Day Learning Plan",
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
    prevChapterKicker: "Previous",
    nextChapterKicker: "Next",
    chapterPageTitle: (index, title) => `Chapter ${index} · ${title}`,
    chapterUnavailable: "No more chapters",
    annotationKicker: "Reader Notes",
    annotationTitle: "Annotations",
    annotationStatus: "Select text in the guide, then highlight, underline, or comment.",
    annotationEmpty: "No annotations in the current reading range yet.",
    annotationNeedSelection: "Select text in the guide first.",
    annotationOutside: "Please select text inside the guide.",
    annotationSameBlock: "This selection cannot be annotated yet. Try a shorter selection or avoid diagram areas.",
    annotationCommentPrompt: "Add a comment for this text:",
    annotationNoComment: "No comment",
    annotationSaved: "Annotation saved.",
    annotationDeleted: "Annotation deleted.",
    annotationHighlight: "Highlight",
    annotationUnderline: "Underline",
    annotationComment: "Comment",
    annotationDelete: "Delete",
    annotationDiscuss: "Discuss",
    annotationCopied: "Copied the annotation and opened GitHub Discussions.",
    annotationCopyFailed: "Opened GitHub Discussions; copy the card text manually if needed.",
    annotationChapterLabel: (index) => `Chapter ${index}`,
    annotationDiscussionTitle: (chapterLabel, title) => `Reader note: ${chapterLabel} ${title}`,
    annotationDiscussionBody: ({ chapterLabel, chapterTitle, quote, comment, url }) =>
      [
        `## Chapter`,
        `${chapterLabel} · ${chapterTitle}`,
        "",
        "## Quote",
        `> ${quote}`,
        "",
        "## Comment",
        comment || "(Add your thought here.)",
        "",
        "## Page",
        url,
      ].join("\n"),
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
  annotations: [],
  activeAnnotationId: null,
  annotationRange: null,
  annotationStatusTimer: null,
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
  readerShell: document.querySelector(".reader-shell"),
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
  exportMatrixPdf: document.querySelector("#export-matrix-pdf-button"),
  exportMatrixPdfLabel: document.querySelector("#export-matrix-pdf-label"),
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
  chapterPager: document.querySelector("#chapter-pager"),
  prevChapter: document.querySelector("#prev-chapter-button"),
  prevChapterKicker: document.querySelector("#prev-chapter-kicker"),
  prevChapterTitle: document.querySelector("#prev-chapter-title"),
  nextChapter: document.querySelector("#next-chapter-button"),
  nextChapterKicker: document.querySelector("#next-chapter-kicker"),
  nextChapterTitle: document.querySelector("#next-chapter-title"),
  annotationKicker: document.querySelector("#annotation-kicker"),
  annotationTitle: document.querySelector("#annotation-title"),
  annotationPopover: document.querySelector("#annotation-popover"),
  annotationStatus: document.querySelector("#annotation-status"),
  annotationList: document.querySelector("#annotation-list"),
  highlightButton: document.querySelector("#highlight-button"),
  underlineButton: document.querySelector("#underline-button"),
  commentButton: document.querySelector("#comment-button"),
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
  if (requested === "planner" || requested === "checklist") return "planner";
  return "schedule";
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

function readAnnotations(lang = state.lang) {
  const raw = getStoredText(annotationStorageKey(lang));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id && item.quote) : [];
  } catch {
    return [];
  }
}

function writeAnnotations() {
  setStoredText(annotationStorageKey(state.lang), JSON.stringify(state.annotations));
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

function annotationStorageKey(lang = state.lang) {
  return `feynman:v5:annotations:${lang}`;
}

function annotationId() {
  if (window.crypto?.randomUUID) return `ann-${window.crypto.randomUUID()}`;
  return `ann-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

function defaultReaderChapter() {
  return state.focusedChapterIndex || preferredChapter() || firstChapterForDay(state.day) || 1;
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
  if (els.topLabel) {
    els.topLabel.textContent = text.top;
  }
  els.readerKicker.textContent = text.readerKicker;
  els.readerTitle.textContent = doc.title;
  els.readerSummary.textContent = doc.summary;
  els.metricChapters.innerHTML = `<strong>${CHAPTER_COUNT}</strong> ${doc.metrics.chapters}`;
  els.metricLanguages.innerHTML = `<strong>2</strong> ${doc.metrics.languages}`;
  els.metricPdf.innerHTML = `<strong>PDF</strong> ${doc.metrics.pdf}`;
  els.prevChapterKicker.textContent = text.prevChapterKicker;
  els.nextChapterKicker.textContent = text.nextChapterKicker;
  els.annotationKicker.textContent = text.annotationKicker;
  els.annotationTitle.textContent = text.annotationTitle;
  els.annotationPopover.setAttribute("aria-label", text.annotationTitle);
  clearAnnotationStatusTimer();
  els.annotationStatus.classList.remove("is-visible");
  els.annotationStatus.textContent = text.annotationStatus;
  [
    [els.highlightButton, text.annotationHighlight],
    [els.underlineButton, text.annotationUnderline],
    [els.commentButton, text.annotationComment],
  ].forEach(([button, label]) => {
    button.title = label;
    button.setAttribute("aria-label", label);
  });
  renderReaderHeader();
  renderAnnotationList();

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
  hideAnnotationPopover();
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
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

function focusedChapterSection() {
  if (!state.focusedChapterIndex) return null;
  return state.chapterSections[state.focusedChapterIndex - 1] || null;
}

function readerVisibleHeadings() {
  return state.headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
}

function headingChapterIndex(heading) {
  const section = state.chapterSections.find((candidate) => candidate.nodes.includes(heading.element));
  return section?.chapterIndex || null;
}

function headingById(id) {
  return state.headings.find((heading) => heading.id === id) || null;
}

function chapterPageText(index) {
  const text = copy[state.lang];
  const title = chapters[state.lang]?.[index - 1]?.title || state.chapterTargets[index - 1]?.text || "";
  return text.chapterPageTitle(index, title);
}

function updateChapterPageButton(button, titleElement, index) {
  const text = copy[state.lang];
  const isAvailable = Number.isInteger(index) && index >= 1 && index <= CHAPTER_COUNT && state.chapterTargets[index - 1];

  button.disabled = !isAvailable;
  if (isAvailable) {
    const label = chapterPageText(index);
    button.dataset.openChapter = String(index);
    button.title = label;
    button.setAttribute("aria-label", label);
    titleElement.textContent = label;
  } else {
    delete button.dataset.openChapter;
    button.removeAttribute("title");
    button.setAttribute("aria-label", text.chapterUnavailable);
    titleElement.textContent = text.chapterUnavailable;
  }
}

function renderChapterPager() {
  if (!els.chapterPager) return;

  const current = state.focusedChapterIndex || 0;
  const prevIndex = current > 1 ? current - 1 : null;
  const nextIndex = current ? current + 1 : 1;

  els.prevChapterKicker.textContent = copy[state.lang].prevChapterKicker;
  els.nextChapterKicker.textContent = copy[state.lang].nextChapterKicker;
  updateChapterPageButton(els.prevChapter, els.prevChapterTitle, prevIndex);
  updateChapterPageButton(els.nextChapter, els.nextChapterTitle, nextIndex);
}

function renderReaderHeader() {
  const doc = docs[state.lang];
  const text = copy[state.lang];
  const section = focusedChapterSection();
  renderChapterPager();

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
  if (!els.status) return;

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
  hideAnnotationPopover();
  applyReaderFocus();
  renderToc();
  observeHeadings();
  renderAnnotations();
  updateReadingProgress();
}

function cssEscape(value) {
  return window.CSS?.escape ? CSS.escape(value) : String(value).replace(/["\\]/g, "\\$&");
}

function clearAnnotationStatusTimer() {
  if (state.annotationStatusTimer) {
    window.clearTimeout(state.annotationStatusTimer);
    state.annotationStatusTimer = null;
  }
}

function setAnnotationStatus(message) {
  if (els.annotationStatus) {
    clearAnnotationStatusTimer();
    const fallback = copy[state.lang].annotationStatus;
    const nextMessage = message || fallback;
    els.annotationStatus.textContent = nextMessage;
    els.annotationStatus.classList.toggle("is-visible", Boolean(message));

    if (message) {
      state.annotationStatusTimer = window.setTimeout(() => {
        els.annotationStatus.classList.remove("is-visible");
        els.annotationStatus.textContent = fallback;
        state.annotationStatusTimer = null;
      }, 2200);
    }
  }
}

function selectionRangeInArticle() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!range.toString().trim()) return null;
  if (!els.article.contains(range.commonAncestorContainer)) return null;

  return range;
}

function selectedRangeRect(range) {
  const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
  return rects[0] || range.getBoundingClientRect();
}

function hideAnnotationPopover(options = {}) {
  if (els.annotationPopover) {
    els.annotationPopover.hidden = true;
    els.annotationPopover.classList.remove("is-below");
  }

  if (options.keepRange) return;
  state.annotationRange = null;
}

function positionAnnotationPopover(range) {
  if (!els.annotationPopover || !range) return;

  const rect = selectedRangeRect(range);
  if (!rect || (rect.width <= 0 && rect.height <= 0)) {
    hideAnnotationPopover();
    return;
  }

  els.annotationPopover.hidden = false;
  els.annotationPopover.classList.remove("is-below");

  const popoverRect = els.annotationPopover.getBoundingClientRect();
  const inset = 10;
  const left = Math.min(
    window.innerWidth - popoverRect.width / 2 - inset,
    Math.max(popoverRect.width / 2 + inset, rect.left + rect.width / 2),
  );
  const shouldPlaceBelow = rect.top < popoverRect.height + 18;
  const top = shouldPlaceBelow ? rect.bottom : rect.top;

  els.annotationPopover.classList.toggle("is-below", shouldPlaceBelow);
  els.annotationPopover.style.left = `${left}px`;
  els.annotationPopover.style.top = `${Math.min(window.innerHeight - inset, Math.max(inset, top))}px`;
}

function updateAnnotationPopoverFromSelection() {
  if (state.mode !== "reader" || els.article.classList.contains("loading")) {
    hideAnnotationPopover();
    return;
  }

  const range = selectionRangeInArticle();
  if (!range) {
    hideAnnotationPopover();
    return;
  }

  state.annotationRange = range.cloneRange();
  positionAnnotationPopover(range);
}

function scheduleAnnotationPopoverUpdate() {
  window.setTimeout(updateAnnotationPopoverFromSelection, 0);
}

function annotationRangeForAction() {
  const liveRange = selectionRangeInArticle();
  if (liveRange) {
    state.annotationRange = liveRange.cloneRange();
    return liveRange.cloneRange();
  }

  return state.annotationRange ? state.annotationRange.cloneRange() : null;
}

function rangeIntersectsNode(range, node) {
  try {
    return range.intersectsNode(node);
  } catch {
    return false;
  }
}

function textNodeSelectionOffsets(range, node) {
  const length = node.textContent.length;
  let start = 0;
  let end = length;

  if (node === range.startContainer) {
    start = range.startOffset;
  }
  if (node === range.endContainer) {
    end = range.endOffset;
  }

  return {
    start: Math.max(0, Math.min(length, start)),
    end: Math.max(0, Math.min(length, end)),
  };
}

function segmentsFromRange(range) {
  const grouped = new Map();
  const walker = document.createTreeWalker(els.article, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent || !rangeIntersectsNode(range, node)) continue;

    const block = findAnnotationBlock(node);
    if (!block?.dataset.blockId) continue;

    const { start, end } = textNodeSelectionOffsets(range, node);
    if (end <= start || !node.textContent.slice(start, end).trim()) continue;

    const startOffset = offsetInBlock(block, node, start);
    const endOffset = offsetInBlock(block, node, end);
    const chapterIndex = Number(block.dataset.chapterIndex);
    if (startOffset < 0 || endOffset <= startOffset || !Number.isInteger(chapterIndex)) continue;

    const key = block.dataset.blockId;
    const existing = grouped.get(key);
    if (existing) {
      existing.startOffset = Math.min(existing.startOffset, startOffset);
      existing.endOffset = Math.max(existing.endOffset, endOffset);
    } else {
      grouped.set(key, {
        block,
        blockId: key,
        chapterIndex,
        startOffset,
        endOffset,
      });
    }
  }

  return [...grouped.values()]
    .map((segment) => ({
      ...segment,
      quote: segment.block.textContent.slice(segment.startOffset, segment.endOffset),
    }))
    .filter((segment) => segment.quote.trim());
}

function storedAnnotationSegments(segments) {
  return segments.map(({ block, ...segment }) => segment);
}

function annotationSegments(annotation) {
  if (Array.isArray(annotation.segments) && annotation.segments.length) {
    return annotation.segments;
  }

  return [
    {
      blockId: annotation.blockId,
      chapterIndex: annotation.chapterIndex,
      startOffset: annotation.startOffset,
      endOffset: annotation.endOffset,
      quote: annotation.quote,
    },
  ];
}

function annotationStyleLabel(style) {
  const text = copy[state.lang];
  if (style === "underline") return text.annotationUnderline;
  if (style === "comment") return text.annotationComment;
  return text.annotationHighlight;
}

function chapterMeta(index) {
  const chapterTitleText = chapters[state.lang]?.[index - 1]?.title || state.chapterTargets[index - 1]?.text || "";
  return {
    label: copy[state.lang].annotationChapterLabel(index),
    title: chapterTitleText,
  };
}

function collectAnnotatableBlocks(section = null) {
  const roots = section ? section.nodes : [...els.article.children];
  const blocks = [];
  const seen = new Set();

  roots.forEach((root) => {
    if (root.matches?.(ANNOTATABLE_SELECTOR)) {
      blocks.push(root);
      seen.add(root);
    }
    root.querySelectorAll?.(ANNOTATABLE_SELECTOR).forEach((block) => {
      if (!seen.has(block)) {
        blocks.push(block);
        seen.add(block);
      }
    });
  });

  return blocks.filter((block) => els.article.contains(block) && !block.closest(".mermaid"));
}

function assignAnnotatableBlocks() {
  state.chapterSections.forEach((section) => {
    collectAnnotatableBlocks(section).forEach((block, index) => {
      block.dataset.blockId = `${state.lang}-ch-${section.chapterIndex}-b-${index}`;
      block.dataset.chapterIndex = String(section.chapterIndex);
    });
  });
}

function findAnnotationBlock(node) {
  const element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  if (!element || !els.article.contains(element)) return null;
  if (element.closest(".mermaid")) return null;

  const block = element.closest(ANNOTATABLE_SELECTOR);
  return block && els.article.contains(block) ? block : null;
}

function offsetInBlock(block, container, offset) {
  try {
    const range = document.createRange();
    range.selectNodeContents(block);
    range.setEnd(container, offset);
    const length = range.toString().length;
    range.detach();
    return length;
  } catch {
    return -1;
  }
}

function clearAnnotationMarks() {
  els.article.querySelectorAll(".annotation-mark").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;

    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    mark.remove();
    parent.normalize();
  });
}

function rangeFromOffsets(block, startOffset, endOffset) {
  if (!block || endOffset <= startOffset) return null;

  const range = document.createRange();
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let position = 0;
  let hasStart = false;
  let hasEnd = false;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const length = node.textContent.length;
    const nextPosition = position + length;

    if (!hasStart && startOffset >= position && startOffset <= nextPosition) {
      range.setStart(node, Math.min(length, startOffset - position));
      hasStart = true;
    }

    if (!hasEnd && endOffset >= position && endOffset <= nextPosition) {
      range.setEnd(node, Math.min(length, endOffset - position));
      hasEnd = true;
      break;
    }

    position = nextPosition;
  }

  if (hasStart && hasEnd) return range;
  range.detach();
  return null;
}

function locateAnnotationSegment(annotation, segment) {
  const quote = segment.quote || "";
  const trimmedQuote = quote.trim();
  const block = segment.blockId
    ? els.article.querySelector(`[data-block-id="${cssEscape(segment.blockId)}"]`)
    : null;

  function locateInBlock(candidate) {
    if (!candidate) return null;
    const text = candidate.textContent || "";
    const start = Number(segment.startOffset);
    const end = Number(segment.endOffset);

    if (Number.isFinite(start) && Number.isFinite(end) && text.slice(start, end) === quote) {
      return { block: candidate, startOffset: start, endOffset: end };
    }

    const rawIndex = quote ? text.indexOf(quote) : -1;
    if (rawIndex >= 0) {
      return { block: candidate, startOffset: rawIndex, endOffset: rawIndex + quote.length };
    }

    const trimmedIndex = trimmedQuote ? text.indexOf(trimmedQuote) : -1;
    if (trimmedIndex >= 0) {
      return {
        block: candidate,
        startOffset: trimmedIndex,
        endOffset: trimmedIndex + trimmedQuote.length,
      };
    }

    return null;
  }

  const direct = locateInBlock(block);
  if (direct) return direct;

  const sectionIndex = Number(segment.chapterIndex) || Number(annotation.chapterIndex);
  const section = state.chapterSections[sectionIndex - 1] || null;
  for (const candidate of collectAnnotatableBlocks(section)) {
    const located = locateInBlock(candidate);
    if (located) return located;
  }

  return null;
}

function applyAnnotationMark(annotation, segment) {
  const located = locateAnnotationSegment(annotation, segment);
  if (!located) return false;

  const range = rangeFromOffsets(located.block, located.startOffset, located.endOffset);
  if (!range) return false;

  const wrapper = document.createElement(annotation.style === "underline" ? "span" : "mark");
  wrapper.className = `annotation-mark is-${annotation.style || "highlight"}`;
  wrapper.dataset.annotationId = annotation.id;
  wrapper.classList.toggle("is-active", annotation.id === state.activeAnnotationId);
  if (annotation.comment) {
    wrapper.classList.add("has-comment");
  }

  const contents = range.extractContents();
  wrapper.append(contents);
  range.insertNode(wrapper);
  range.detach();
  return true;
}

function annotationsForCurrentRange() {
  const section = focusedChapterSection();
  return state.annotations.filter((annotation) => !section || annotation.chapterIndex === section.chapterIndex);
}

function renderAnnotationList() {
  if (!els.annotationList) return;

  const text = copy[state.lang];
  const annotations = annotationsForCurrentRange().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  els.annotationList.innerHTML = "";
  els.readerShell?.classList.toggle("has-annotations", annotations.length > 0);

  if (!annotations.length) {
    return;
  }

  annotations.forEach((annotation) => {
    const meta = chapterMeta(annotation.chapterIndex);
    const card = document.createElement("article");
    card.className = "annotation-card";
    card.classList.toggle("is-active", annotation.id === state.activeAnnotationId);
    card.dataset.annotationCard = "";
    card.dataset.annotationId = annotation.id;

    const kicker = document.createElement("span");
    kicker.className = "annotation-card-kicker";
    kicker.textContent = `${meta.label} · ${annotationStyleLabel(annotation.style)}`;

    const quote = document.createElement("blockquote");
    quote.className = "annotation-card-quote";
    quote.textContent = (annotation.quote || "").trim();

    const comment = document.createElement("p");
    comment.className = "annotation-card-comment";
    comment.textContent = annotation.comment || text.annotationNoComment;

    const actions = document.createElement("div");
    actions.className = "annotation-card-actions";

    const discuss = document.createElement("button");
    discuss.type = "button";
    discuss.className = "text-button";
    discuss.dataset.discussAnnotation = annotation.id;
    discuss.innerHTML = '<i data-lucide="external-link" aria-hidden="true"></i>';
    const discussLabel = document.createElement("span");
    discussLabel.textContent = text.annotationDiscuss;
    discuss.append(discussLabel);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "text-button";
    remove.dataset.deleteAnnotation = annotation.id;
    remove.innerHTML = '<i data-lucide="trash-2" aria-hidden="true"></i>';
    const removeLabel = document.createElement("span");
    removeLabel.textContent = text.annotationDelete;
    remove.append(removeLabel);

    actions.append(discuss, remove);
    card.append(kicker, quote, comment, actions);
    els.annotationList.append(card);
  });

  window.lucide?.createIcons();
}

function renderAnnotations() {
  if (!els.article || els.article.classList.contains("loading")) return;

  clearAnnotationMarks();
  const markSegments = state.annotations.flatMap((annotation) =>
    annotationSegments(annotation).map((segment) => ({ annotation, segment })),
  );

  markSegments
    .sort((a, b) => {
      if (a.segment.blockId === b.segment.blockId) {
        return Number(b.segment.startOffset) - Number(a.segment.startOffset);
      }
      return String(a.segment.blockId).localeCompare(String(b.segment.blockId));
    })
    .forEach(({ annotation, segment }) => applyAnnotationMark(annotation, segment));
  renderAnnotationList();
}

function createAnnotation(style) {
  const text = copy[state.lang];
  const range = annotationRangeForAction();
  if (!range || range.collapsed) {
    setAnnotationStatus(text.annotationNeedSelection);
    return;
  }

  if (!els.article.contains(range.commonAncestorContainer)) {
    setAnnotationStatus(text.annotationOutside);
    return;
  }

  const segments = segmentsFromRange(range);
  if (!segments.length) {
    setAnnotationStatus(text.annotationSameBlock);
    return;
  }

  const quote = segments.map((segment) => segment.quote.trim()).filter(Boolean).join("\n\n");
  if (!quote.trim()) {
    setAnnotationStatus(text.annotationNeedSelection);
    return;
  }

  let comment = "";
  if (style === "comment") {
    const entered = window.prompt(text.annotationCommentPrompt, "");
    if (entered === null) return;
    comment = entered.trim();
  }

  const firstSegment = segments[0];
  const chapterIndex = Number(firstSegment.chapterIndex);
  if (!Number.isInteger(chapterIndex) || chapterIndex < 1) {
    setAnnotationStatus(text.annotationOutside);
    return;
  }

  const annotation = {
    id: annotationId(),
    lang: state.lang,
    chapterIndex,
    blockId: firstSegment.blockId,
    style,
    quote,
    startOffset: firstSegment.startOffset,
    endOffset: firstSegment.endOffset,
    segments: storedAnnotationSegments(segments),
    comment,
    createdAt: new Date().toISOString(),
  };

  state.annotations.push(annotation);
  state.activeAnnotationId = annotation.id;
  writeAnnotations();
  const selection = window.getSelection();
  selection?.removeAllRanges();
  hideAnnotationPopover();
  renderAnnotations();
  setAnnotationStatus(text.annotationSaved);
}

function focusAnnotation(id) {
  state.activeAnnotationId = id;
  renderAnnotations();

  const mark = els.article.querySelector(`.annotation-mark[data-annotation-id="${cssEscape(id)}"]`);
  mark?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteAnnotation(id) {
  state.annotations = state.annotations.filter((annotation) => annotation.id !== id);
  if (state.activeAnnotationId === id) {
    state.activeAnnotationId = null;
  }
  writeAnnotations();
  renderAnnotations();
  setAnnotationStatus(copy[state.lang].annotationDeleted);
}

function annotationDiscussionPayload(annotation) {
  const meta = chapterMeta(annotation.chapterIndex);
  const pageUrl = new URL(window.location.href);
  pageUrl.searchParams.set("lang", state.lang);
  pageUrl.searchParams.set("view", "reader");
  pageUrl.searchParams.set("chapter", String(annotation.chapterIndex));
  const target = state.chapterTargets[annotation.chapterIndex - 1];
  if (target?.id) {
    pageUrl.hash = target.id;
  }

  const title = copy[state.lang].annotationDiscussionTitle(meta.label, meta.title);
  const body = copy[state.lang].annotationDiscussionBody({
    chapterLabel: meta.label,
    chapterTitle: meta.title,
    quote: (annotation.quote || "").trim(),
    comment: annotation.comment,
    url: pageUrl.toString(),
  });

  return { title, body };
}

async function openDiscussionForAnnotation(id) {
  const annotation = state.annotations.find((item) => item.id === id);
  if (!annotation) return;

  const text = copy[state.lang];
  const payload = annotationDiscussionPayload(annotation);
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard is unavailable.");
    await navigator.clipboard.writeText(`${payload.title}\n\n${payload.body}`);
    setAnnotationStatus(text.annotationCopied);
  } catch {
    setAnnotationStatus(text.annotationCopyFailed);
  }

  const url = `${DISCUSSION_NEW_URL}&title=${encodeURIComponent(payload.title)}`;
  window.open(url, "_blank", "noopener");
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
  els.exportMatrixPdfLabel.textContent = text.exportMatrixPdf;
  els.exportMatrixPdf.title = text.exportMatrixPdf;
  els.exportMatrixPdf.setAttribute("aria-label", text.exportMatrixPdf);
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

function loadScriptOnce(src) {
  if (scriptPromises.has(src)) return scriptPromises.get(src);

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Unable to load ${src}`)), { once: true });

    if (!existing) {
      document.head.append(script);
    }
  });

  scriptPromises.set(src, promise);
  return promise;
}

async function loadPdfExportLibraries() {
  if (window.html2canvas && window.jspdf?.jsPDF) return;
  await Promise.all(PDF_EXPORT_SCRIPTS.map(loadScriptOnce));

  if (!window.html2canvas || !window.jspdf?.jsPDF) {
    throw new Error("PDF export libraries are unavailable.");
  }
}

function schedulePdfFilename() {
  const lang = state.lang === "zh" ? "zh" : "en";
  return `vibe-coding-guide-schedule-a4-portrait-${lang}.pdf`;
}

function createSchedulePdfCell(item, text) {
  const cell = document.createElement("td");
  if (!item) return cell;

  const chapter = document.createElement("span");
  chapter.className = "pdf-export-chapter";
  chapter.textContent = text.matrixItem(item.chapterIndex);
  cell.append(chapter);

  if (isChecked(item.id)) {
    const check = document.createElement("span");
    check.className = "pdf-export-check";
    check.textContent = "✓";
    cell.append(check);
  }

  return cell;
}

function createSchedulePdfTable(startDay, endDay) {
  const text = copy[state.lang];
  const columns = [
    text.matrixDay,
    text.matrixLearn,
    ...REVIEW_INTERVALS.map((_, index) => text.matrixReview(index + 1)),
  ];

  const table = document.createElement("table");
  table.className = "pdf-export-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  columns.forEach((label) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headRow.append(th);
  });
  thead.append(headRow);

  const tbody = document.createElement("tbody");
  for (let day = startDay; day <= endDay; day += 1) {
    const row = document.createElement("tr");
    const dayHeader = document.createElement("th");
    dayHeader.scope = "row";
    dayHeader.textContent = text.dayLabel(day);
    row.append(dayHeader);

    const itemsByColumn = new Map(getScheduleMatrixItems(day).map((item) => [item.column, item]));
    for (let column = 0; column <= REVIEW_INTERVALS.length; column += 1) {
      row.append(createSchedulePdfCell(itemsByColumn.get(column), text));
    }

    tbody.append(row);
  }

  table.append(thead, tbody);
  return table;
}

function createSchedulePdfRoot() {
  const text = copy[state.lang];
  const pageCount = Math.ceil(PLAN_DAY_COUNT / PDF_A4_PORTRAIT.rowsPerPage);
  const pageSizeLabel = state.lang === "zh" ? "A4 纵向" : "A4 portrait";
  const root = document.createElement("div");
  root.className = "pdf-export-root";
  root.setAttribute("aria-hidden", "true");

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const startDay = pageIndex * PDF_A4_PORTRAIT.rowsPerPage + 1;
    const endDay = Math.min(PLAN_DAY_COUNT, startDay + PDF_A4_PORTRAIT.rowsPerPage - 1);
    const page = document.createElement("section");
    page.className = "pdf-export-page";

    const header = document.createElement("header");
    header.className = "pdf-export-header";
    const kicker = document.createElement("p");
    kicker.textContent = text.matrixKicker;
    const title = document.createElement("h1");
    title.textContent = text.exportMatrixPdfTitle;
    const meta = document.createElement("span");
    meta.textContent = `${text.dayLabel(startDay)} - ${text.dayLabel(endDay)} / ${pageSizeLabel}`;
    header.append(kicker, title, meta);

    page.append(header, createSchedulePdfTable(startDay, endDay));
    root.append(page);
  }

  return root;
}

function printSchedulePdfFallback() {
  const previousTitle = document.title;
  document.body.dataset.printMode = "schedule";
  document.title = copy[state.lang].exportMatrixPdfTitle;

  window.addEventListener(
    "afterprint",
    () => {
      delete document.body.dataset.printMode;
      document.title = previousTitle;
    },
    { once: true },
  );

  window.requestAnimationFrame(() => window.print());
}

async function exportSchedulePdf() {
  const text = copy[state.lang];
  const previousLabel = els.exportMatrixPdfLabel.textContent;
  els.exportMatrixPdf.disabled = true;
  els.exportMatrixPdfLabel.textContent = text.exportMatrixPdfBusy;

  let root = null;
  try {
    await loadPdfExportLibraries();
    root = createSchedulePdfRoot();
    document.body.append(root);
    await document.fonts?.ready;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    const pages = [...root.querySelectorAll(".pdf-export-page")];

    for (const [index, page] of pages.entries()) {
      const canvas = await window.html2canvas(page, {
        backgroundColor: "#ffffff",
        logging: false,
        scale: 2,
        useCORS: true,
        windowWidth: PDF_A4_PORTRAIT.widthPx,
        windowHeight: PDF_A4_PORTRAIT.heightPx,
      });

      if (index > 0) {
        pdf.addPage("a4", "portrait");
      }

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        PDF_A4_PORTRAIT.widthMm,
        PDF_A4_PORTRAIT.heightMm,
        undefined,
        "FAST",
      );
    }

    pdf.save(schedulePdfFilename());
  } catch (error) {
    console.warn("A4 PDF export failed, falling back to browser print.", error);
    printSchedulePdfFallback();
  } finally {
    root?.remove();
    els.exportMatrixPdf.disabled = false;
    els.exportMatrixPdfLabel.textContent = previousLabel || text.exportMatrixPdf;
  }
}

async function loadGuide(lang, shouldUpdateUrl = true) {
  state.lang = lang;
  state.headings = [];
  state.chapterTargets = [];
  state.chapterSections = [];
  state.annotations = readAnnotations(lang);
  state.activeAnnotationId = null;
  setLanguageChrome(lang);
  renderPlanner();
  renderSchedulePlan();
  els.article.classList.add("loading");
  els.article.innerHTML = copy[lang].loading;
  if (els.status) {
    els.status.textContent = `${docs[lang].status} · loading`;
  }

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
  if (state.mode === "reader" && !state.focusedChapterIndex) {
    state.focusedChapterIndex = defaultReaderChapter();
  }
  applyReaderFocus();
  renderToc();
  observeHeadings();
  renderAnnotations();
  updateReadingProgress();
  window.lucide?.createIcons();

  updateReaderStatus();

  if (shouldUpdateUrl || (state.mode === "reader" && state.focusedChapterIndex)) updateUrl();
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
    .slice(0, CHAPTER_COUNT)
    .map((heading, index) => ({
      ...heading,
      chapterIndex: index + 1,
      chapterTitle: chapters[state.lang]?.[index]?.title || heading.text,
    }));

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

  assignAnnotatableBlocks();
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
      link.dataset.tocTarget = heading.id;
      const chapterIndex = headingChapterIndex(heading);
      if (chapterIndex) {
        link.dataset.tocChapter = String(chapterIndex);
      }
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
  const links = new Map([...els.toc.querySelectorAll("a")].map((link) => [link.dataset.tocTarget || link.hash.slice(1), link]));

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
  window.setTimeout(() => {
    els.readerView.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 40);
}

async function openTocTarget(id) {
  if (state.guidePromise) {
    await state.guidePromise.catch(() => {});
  }

  const heading = headingById(id);
  if (!heading) return;

  const chapterIndex = headingChapterIndex(heading);
  if (chapterIndex) {
    setReaderFocus(chapterIndex);
  }
  setMode("reader");

  window.setTimeout(() => {
    heading.element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 40);
}

function showError(error) {
  console.error(error);
  const text = copy[state.lang];
  if (els.status) {
    els.status.textContent = text.loadError;
  }
  els.article.classList.remove("loading");
  els.article.innerHTML = `<h1>${text.loadError}</h1><p>${error.message}</p>`;
}

document.addEventListener("click", (event) => {
  const deleteAnnotationButton = event.target.closest("[data-delete-annotation]");
  if (deleteAnnotationButton) {
    deleteAnnotation(deleteAnnotationButton.dataset.deleteAnnotation);
    return;
  }

  const discussAnnotationButton = event.target.closest("[data-discuss-annotation]");
  if (discussAnnotationButton) {
    openDiscussionForAnnotation(discussAnnotationButton.dataset.discussAnnotation);
    return;
  }

  const annotationMark = event.target.closest(".annotation-mark[data-annotation-id]");
  if (annotationMark) {
    focusAnnotation(annotationMark.dataset.annotationId);
    return;
  }

  const annotationCard = event.target.closest("[data-annotation-card][data-annotation-id]");
  if (annotationCard && !event.target.closest("button, a")) {
    focusAnnotation(annotationCard.dataset.annotationId);
    return;
  }

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
      openChapter(defaultReaderChapter());
      return;
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

  const tocLink = event.target.closest("#toc-list a[href^='#']");
  if (tocLink) {
    event.preventDefault();
    openTocTarget(tocLink.dataset.tocTarget || tocLink.hash.slice(1));
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
els.exportMatrixPdf.addEventListener("click", exportSchedulePdf);
els.resetMatrix.addEventListener("click", resetMatrixProgress);
els.search.addEventListener("input", renderToc);
els.top?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
els.annotationPopover.addEventListener("mousedown", (event) => event.preventDefault());
els.annotationPopover.addEventListener("pointerdown", (event) => event.preventDefault());
els.annotationPopover.addEventListener("touchstart", (event) => event.preventDefault());
els.annotationPopover.addEventListener("click", (event) => event.stopPropagation());
els.highlightButton.addEventListener("click", () => createAnnotation("highlight"));
els.underlineButton.addEventListener("click", () => createAnnotation("underline"));
els.commentButton.addEventListener("click", () => createAnnotation("comment"));
document.addEventListener("selectionchange", scheduleAnnotationPopoverUpdate);
document.addEventListener("mouseup", scheduleAnnotationPopoverUpdate);
document.addEventListener("keyup", scheduleAnnotationPopoverUpdate);
document.addEventListener("pointerdown", (event) => {
  if (event.target.closest("#annotation-popover") || event.target.closest("#guide-content")) return;
  hideAnnotationPopover();
});
window.addEventListener("scroll", () => {
  updateReadingProgress();
  hideAnnotationPopover();
}, { passive: true });
window.addEventListener("resize", () => {
  updateFixedChromeMetrics();
  updateReadingProgress();
  hideAnnotationPopover();
});
window.addEventListener("load", updateFixedChromeMetrics);
window.visualViewport?.addEventListener("resize", updateFixedChromeMetrics);
if (document.fonts?.ready) {
  document.fonts.ready.then(updateFixedChromeMetrics).catch(() => {});
}

if (window.ResizeObserver) {
  const fixedChromeObserver = new ResizeObserver(updateFixedChromeMetrics);
  [els.topbar, els.sidebar].filter(Boolean).forEach((node) => fixedChromeObserver.observe(node));
}

state.lang = preferredLanguage();
state.mode = preferredMode();
state.day = preferredDay();
state.focusedChapterIndex = state.mode === "reader" ? preferredChapter() || firstChapterForDay(state.day) : null;
setLanguageChrome(state.lang);
renderPlanner();
renderSchedulePlan();
setMode(state.mode, false);
state.guidePromise = loadGuide(state.lang, false).catch(showError);
