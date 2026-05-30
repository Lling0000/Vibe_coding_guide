const DAY_COUNT = 16;

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
    },
    {
      title: "Spec 是什么?为什么它是一切的起点?",
      focus: "把模糊愿望改写成背景、目标、非目标、方案和验收。",
    },
    {
      title: "AGENTS.md / CLAUDE.md 里存什么?",
      focus: "把项目约定、命令、红线和坑沉淀成 Agent 可复用的上下文。",
    },
    {
      title: "冷启动:接手一个新项目怎么办?",
      focus: "在新项目或陌生项目里先建地图，再让 Agent 动手。",
    },
    {
      title: "上下文管理:压缩、切换、清零",
      focus: "判断什么时候继续、压缩、交接或重开，保护会话质量。",
    },
    {
      title: "Subagent 的使用",
      focus: "把独立问题交给子 Agent，用隔离上下文降低主线噪音。",
    },
    {
      title: "Agent 协作模式与 Workflow:把任务编排明白",
      focus: "区分 workflow 和 autonomous agent，选择合适的协作模式。",
    },
    {
      title: "`.gitignore`:你必须懂的一个文件",
      focus: "用仓库卫生保护密钥、缓存、产物和 Agent 临时文件。",
    },
    {
      title: "Codex 工作树:多 Agent 并行的硬件基础",
      focus: "用 git worktree 隔离多个 Agent 的动手现场。",
    },
    {
      title: "Skill 的创建:把重复模式固化下来",
      focus: "把反复做的任务沉淀成可调用、可迭代的工作流。",
    },
    {
      title: "系统提示词 vs User 提示词:Agent 行为的\"硬件 vs 输入\"",
      focus: "把长期行为约束和一次性任务输入分层管理。",
    },
    {
      title: "CI/CD:让 Agent 在你睡觉时干活",
      focus: "用自动化验证和部署流程给 Agent 产出加护栏。",
    },
    {
      title: "测试:让 Agent 写代码容易,让 Agent 写出\"对的\"代码难",
      focus: "既测试普通代码，也用 case 和证据测试 Agent 行为。",
    },
    {
      title: "几个高阶心法",
      focus: "建立先听计划、频繁 commit、拒绝看起来对等操作习惯。",
    },
    {
      title: "一个完整的工作流示例",
      focus: "把 spec、拆分、实现、验证、提交和交接串成完整闭环。",
    },
    {
      title: "常见反模式速查",
      focus: "识别会让 Agent 产出失控、难审、难回滚的习惯。",
    },
  ],
  en: [
    {
      title: "What Is Vibe Coding?",
      focus: "Shift from typing every character to directing agent attention, boundaries, and acceptance.",
    },
    {
      title: "Specs: The Starting Point",
      focus: "Turn vague wishes into background, goals, non-goals, plans, and acceptance checks.",
    },
    {
      title: "What Goes Into AGENTS.md or CLAUDE.md",
      focus: "Capture project rules, commands, red lines, and pitfalls as durable agent context.",
    },
    {
      title: "Cold Starts: Joining or Creating a Project",
      focus: "Map the project before asking an agent to change it.",
    },
    {
      title: "Context Management",
      focus: "Decide when to continue, compress, hand off, or reset a session.",
    },
    {
      title: "Using Subagents",
      focus: "Delegate isolated questions while protecting the main thread from noise.",
    },
    {
      title: "Agent Workflows and Collaboration Patterns",
      focus: "Separate workflows from autonomous agents and choose the right collaboration shape.",
    },
    {
      title: "`.gitignore`: The Hygiene File",
      focus: "Keep secrets, caches, build output, and agent scratch files out of version control.",
    },
    {
      title: "Git Worktrees and Codex Worktrees",
      focus: "Use worktrees to isolate parallel agent work.",
    },
    {
      title: "Creating Skills",
      focus: "Turn repeated tasks into reusable, improvable workflows.",
    },
    {
      title: "System Prompts vs User Prompts",
      focus: "Separate durable behavior constraints from one-time task input.",
    },
    {
      title: "CI/CD for Agent-Written Code",
      focus: "Use automation to guardrail agent output while you are away.",
    },
    {
      title: "Testing Code and Testing Agent Behavior",
      focus: "Test regular code and evaluate agent behavior with cases and evidence.",
    },
    {
      title: "Advanced Principles",
      focus: "Build habits around plan-first work, frequent commits, and rejecting plausible guesses.",
    },
    {
      title: "A Complete Workflow Example",
      focus: "Connect spec, decomposition, implementation, verification, commit, and handoff.",
    },
    {
      title: "Anti-Patterns Checklist",
      focus: "Spot habits that make agent output hard to review, control, or recover.",
    },
  ],
};

const copy = {
  zh: {
    brandLine: "AI Coding 工程工作流手册",
    plannerMode: "学习清单",
    readerMode: "全文阅读",
    navKicker: "Feynman Loop",
    navTitle: "16 天工程清单",
    navCopy: "每天复习旧章节，再把一章落到真实工作流。",
    sideProgress: "总进度",
    resetAll: "重置全部进度",
    resetAllConfirm: "确定要清空 16 天的所有学习进度吗?",
    plannerKicker: "Engineering Sprint",
    dayTitle: (day) => `Day ${day}: 累计学到第 ${day} 部分`,
    daySummary: (day) => {
      if (day === 1) {
        return "今天只学第一部分：先读懂，再用自己的话讲清楚，最后落到一个真实工作动作。";
      }
      const reviewRange = day === 2 ? "第 1 部分" : `第 1-${day - 1} 部分`;
      return `今天复习${reviewRange}，并新增第 ${day} 部分。旧知识要讲得更短，新知识要讲得更清楚。`;
    },
    prevDay: "前一天",
    nextDay: "下一天",
    openReader: "打开原文",
    heroCaption: "Spec、上下文、审查、验证",
    scopeStat: "今日范围",
    todayStat: "今日完成",
    overallStat: "总进度",
    partSingular: "部分",
    partPlural: "部分",
    scopeKicker: "Cumulative Scope",
    scopeTitle: "今天学习范围",
    noteKicker: "Teach Back",
    noteTitle: "费曼讲解草稿",
    notePlaceholder: "我会这样向一个刚开始用 AI Coding 的朋友解释今天的内容...",
    checklistKicker: "Daily List",
    checklistTitle: "今日任务清单",
    resetDay: "重置今天",
    startGroup: "开场回忆",
    finishGroup: "收尾沉淀",
    chapterLabel: (index) => `Part ${String(index).padStart(2, "0")}`,
    dayLabel: (day) => `Day ${day}`,
    dayScope: (day) => (day === 1 ? "第 1 部分" : `1-${day} 部分`),
    dayProgress: (done, total) => `${done}/${total}`,
    search: "搜索章节",
    top: "顶部",
    readerKicker: "Engineering Field Guide",
    loading: "Loading guide...",
    loadError: "Could not load guide",
    pdf: "下载 PDF",
    github: "GitHub 仓库",
    openChapter: "读原文章节",
    kickoff: (day) => {
      if (day === 1) return "不看正文，写下你对 Vibe Coding 的原始理解。";
      const reviewRange = day === 2 ? "第 1 部分" : `第 1-${day - 1} 部分`;
      return `不看正文，用 5 句话回忆${reviewRange}。`;
    },
    newPart: (day) => `把第 ${day} 部分当作今天的新知识入口，先说出你期待解决的问题。`,
    explainGoal: "准备一个 3 分钟讲解：不用术语堆砌，只讲人、问题、动作和结果。",
    finishSummary: (day) => `写下第 1-${day} 部分的一句话总解释。`,
    finishAction: "把今天最有用的一点变成明天能直接执行的 checklist。",
    finishQuestion: "记录一个还没讲顺的问题,明天复习时先处理它。",
  },
  en: {
    brandLine: "AI coding engineering workflow",
    plannerMode: "Checklist",
    readerMode: "Reader",
    navKicker: "Feynman Loop",
    navTitle: "16-Day Engineering Checklist",
    navCopy: "Review previous parts, then apply one new chapter to real work.",
    sideProgress: "Overall",
    resetAll: "Reset all progress",
    resetAllConfirm: "Clear all progress for the 16-day plan?",
    plannerKicker: "Engineering Sprint",
    dayTitle: (day) => `Day ${day}: cumulative study through Part ${day}`,
    daySummary: (day) => {
      if (day === 1) {
        return "Study only Part 1 today: understand it, explain it plainly, then turn it into one real action.";
      }
      const reviewRange = day === 2 ? "Part 1" : `Parts 1-${day - 1}`;
      return `Review ${reviewRange}, then add Part ${day}. Make old ideas shorter and the new idea clearer.`;
    },
    prevDay: "Previous",
    nextDay: "Next",
    openReader: "Open guide",
    heroCaption: "Spec, context, review, verify",
    scopeStat: "Scope",
    todayStat: "Today",
    overallStat: "Overall",
    partSingular: "part",
    partPlural: "parts",
    scopeKicker: "Cumulative Scope",
    scopeTitle: "Today's Scope",
    noteKicker: "Teach Back",
    noteTitle: "Feynman Draft",
    notePlaceholder: "I would explain today's material to a friend starting AI coding like this...",
    checklistKicker: "Daily List",
    checklistTitle: "Today's Checklist",
    resetDay: "Reset today",
    startGroup: "Recall",
    finishGroup: "Make It Stick",
    chapterLabel: (index) => `Part ${String(index).padStart(2, "0")}`,
    dayLabel: (day) => `Day ${day}`,
    dayScope: (day) => (day === 1 ? "Part 1" : `Parts 1-${day}`),
    dayProgress: (done, total) => `${done}/${total}`,
    search: "Search chapters",
    top: "Top",
    readerKicker: "Engineering Field Guide",
    loading: "Loading guide...",
    loadError: "Could not load guide",
    pdf: "Download PDF",
    github: "GitHub repository",
    openChapter: "Read chapter",
    kickoff: (day) => {
      if (day === 1) return "Without reading, write your current understanding of Vibe Coding.";
      const reviewRange = day === 2 ? "Part 1" : `Parts 1-${day - 1}`;
      return `Without reading, recall ${reviewRange} in five sentences.`;
    },
    newPart: (day) => `Treat Part ${day} as today's new idea and name the problem you expect it to solve.`,
    explainGoal: "Prepare a 3-minute explanation with people, problems, actions, and outcomes instead of jargon.",
    finishSummary: (day) => `Write one plain-language summary for Parts 1-${day}.`,
    finishAction: "Turn the most useful idea into a checklist item you can use tomorrow.",
    finishQuestion: "Record one question that still feels hard to explain.",
  },
};

const chapterTaskTemplates = {
  zh: [
    {
      key: "read",
      text: (chapter) => `阅读或复习「${chapter.title}」，标出一个最贴近你工作场景的例子。`,
    },
    {
      key: "plain",
      text: () => "合上教程，用 150 字或 3 分钟讲给刚入门的人听。",
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
      text: () => "写一个真实项目里的微行动,今天就能执行。",
    },
  ],
  en: [
    {
      key: "read",
      text: (chapter) => `Read or review "${chapter.title}" and mark one example close to your work.`,
    },
    {
      key: "plain",
      text: () => "Close the guide and explain it to a beginner in 150 words or 3 minutes.",
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
      text: () => "Write one micro-action you can apply in a real project today.",
    },
  ],
};

const state = {
  lang: "zh",
  mode: "planner",
  day: 1,
  headings: [],
  chapterTargets: [],
  observer: null,
  guidePromise: null,
};

const els = {
  body: document.body,
  brandLine: document.querySelector("#brand-line"),
  plannerModeLabel: document.querySelector("#planner-mode-label"),
  readerModeLabel: document.querySelector("#reader-mode-label"),
  plannerView: document.querySelector("#planner-view"),
  readerView: document.querySelector("#reader-view"),
  plannerNav: document.querySelector("#planner-nav"),
  readerNav: document.querySelector("#reader-nav"),
  modeButtons: [...document.querySelectorAll("button[data-mode]")],
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
  noteKicker: document.querySelector("#note-kicker"),
  noteTitle: document.querySelector("#note-title"),
  note: document.querySelector("#explain-note"),
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
  return requested === "reader" || requested === "read" ? "reader" : "planner";
}

function preferredDay() {
  const params = new URLSearchParams(window.location.search);
  const requested = Number(params.get("day"));
  if (Number.isInteger(requested) && requested >= 1 && requested <= DAY_COUNT) {
    return requested;
  }

  const stored = Number(getStoredText("feynman:v2:last-day"));
  return Number.isInteger(stored) && stored >= 1 && stored <= DAY_COUNT ? stored : 1;
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
  return `feynman:v2:day-${day}:${scope}:${key}`;
}

function noteId(day) {
  return `feynman:v2:day-${day}:note`;
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
  els.readerModeLabel.textContent = text.readerMode;
  els.pdf.href = doc.pdf;
  els.pdf.title = text.pdf;
  els.pdf.setAttribute("aria-label", text.pdf);
  els.search.placeholder = text.search;
  els.topLabel.textContent = text.top;
  els.readerKicker.textContent = text.readerKicker;
  els.readerTitle.textContent = doc.title;
  els.readerSummary.textContent = doc.summary;
  els.metricChapters.innerHTML = `<strong>16</strong> ${doc.metrics.chapters}`;
  els.metricLanguages.innerHTML = `<strong>2</strong> ${doc.metrics.languages}`;
  els.metricPdf.innerHTML = `<strong>PDF</strong> ${doc.metrics.pdf}`;

  els.langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setMode(mode, shouldUpdateUrl = true) {
  state.mode = mode === "reader" ? "reader" : "planner";
  els.body.dataset.mode = state.mode;
  els.plannerView.hidden = state.mode !== "planner";
  els.readerView.hidden = state.mode !== "reader";
  els.plannerNav.hidden = state.mode !== "planner";
  els.readerNav.hidden = state.mode !== "reader";

  els.modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (shouldUpdateUrl) updateUrl();
  updateReadingProgress();
  window.lucide?.createIcons();
}

function updateUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set("lang", state.lang);
  params.set("day", String(state.day));
  params.set("view", state.mode === "reader" ? "reader" : "planner");
  const hash = state.mode === "reader" ? window.location.hash : "";
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${hash}`);
}

function getDayTaskDefs(day, lang = state.lang) {
  const text = copy[lang];
  const dayChapters = chapters[lang].slice(0, day);
  const defs = [
    {
      group: "start",
      groupTitle: text.startGroup,
      scope: "start",
      key: "recall",
      text: text.kickoff(day),
    },
    {
      group: "start",
      groupTitle: text.startGroup,
      scope: "start",
      key: "new-part",
      text: text.newPart(day),
    },
    {
      group: "start",
      groupTitle: text.startGroup,
      scope: "start",
      key: "explain-goal",
      text: text.explainGoal,
    },
  ];

  dayChapters.forEach((chapter, index) => {
    chapterTaskTemplates[lang].forEach((task) => {
      defs.push({
        group: `chapter-${index + 1}`,
        groupTitle: chapter.title,
        chapter,
        chapterIndex: index + 1,
        scope: `chapter-${index + 1}`,
        key: task.key,
        text: task.text(chapter, index + 1, day),
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

  for (let day = 1; day <= DAY_COUNT; day += 1) {
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
  const currentChapters = chapters[state.lang].slice(0, state.day);

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
  els.scopeStatValue.textContent = `${currentChapters.length} ${
    currentChapters.length === 1 ? text.partSingular : text.partPlural
  }`;
  els.prevDay.disabled = state.day === 1;
  els.nextDay.disabled = state.day === DAY_COUNT;
  els.note.value = getStoredText(noteId(state.day));

  renderDayList();
  renderScope();
  renderChecklist();
  updatePlannerProgress();
  window.lucide?.createIcons();
}

function renderDayList() {
  const text = copy[state.lang];
  els.dayList.innerHTML = "";

  for (let day = 1; day <= DAY_COUNT; day += 1) {
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
  els.scopeList.innerHTML = "";

  chapters[state.lang].slice(0, state.day).forEach((chapter, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scope-chip";
    button.dataset.openChapter = String(index + 1);

    const label = document.createElement("span");
    label.className = "scope-chip-label";
    label.textContent = text.chapterLabel(index + 1);

    const title = document.createElement("strong");
    title.textContent = chapter.title;

    const focus = document.createElement("span");
    focus.className = "scope-chip-focus";
    focus.textContent = chapter.focus;

    button.append(label, title, focus);
    els.scopeList.append(button);
  });
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
    kicker.textContent = group.chapterIndex ? text.chapterLabel(group.chapterIndex) : group.title;

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

    if (group.chapter?.focus) {
      const focus = document.createElement("p");
      focus.className = "task-group-focus";
      focus.textContent = group.chapter.focus;
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
  const next = Math.min(DAY_COUNT, Math.max(1, Number(day)));
  if (!Number.isInteger(next)) return;

  state.day = next;
  setStoredText("feynman:v2:last-day", String(next));
  renderPlanner();
  if (shouldUpdateUrl) updateUrl();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDay(day) {
  getDayTaskDefs(day).forEach((task) => removeStored(task.id));
  removeStored(noteId(day));
  renderPlanner();
}

function resetAllProgress() {
  if (!window.confirm(copy[state.lang].resetAllConfirm)) return;

  for (let day = 1; day <= DAY_COUNT; day += 1) {
    getDayTaskDefs(day).forEach((task) => removeStored(task.id));
    removeStored(noteId(day));
  }
  renderPlanner();
}

async function loadGuide(lang, shouldUpdateUrl = true) {
  state.lang = lang;
  setLanguageChrome(lang);
  renderPlanner();
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
  renderToc();
  observeHeadings();
  updateReadingProgress();
  window.lucide?.createIcons();

  els.status.textContent = `${docs[lang].status} · ${state.chapterTargets.length} ${docs[lang].sections}`;

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
    .slice(0, DAY_COUNT);

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
}

function renderToc() {
  const query = els.search.value.trim().toLowerCase();
  els.toc.innerHTML = "";

  state.headings
    .filter((heading) => heading.depth === 2 || heading.depth === 3)
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

  state.headings.forEach((heading) => state.observer.observe(heading.element));
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

  setMode("reader");

  const target = state.chapterTargets[chapterIndex - 1];
  if (!target) return;

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
  const modeButton = event.target.closest("button[data-mode]");
  if (modeButton) {
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
    setDay(Number(dayButton.dataset.day));
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

els.note.addEventListener("input", () => {
  setStoredText(noteId(state.day), els.note.value);
});

els.prevDay.addEventListener("click", () => setDay(state.day - 1));
els.nextDay.addEventListener("click", () => setDay(state.day + 1));
els.openReader.addEventListener("click", () => openChapter(state.day));
els.resetDay.addEventListener("click", () => resetDay(state.day));
els.resetAllButton.addEventListener("click", resetAllProgress);
els.search.addEventListener("input", renderToc);
els.top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);

state.lang = preferredLanguage();
state.mode = preferredMode();
state.day = preferredDay();
setLanguageChrome(state.lang);
renderPlanner();
setMode(state.mode, false);
state.guidePromise = loadGuide(state.lang, false).catch(showError);
