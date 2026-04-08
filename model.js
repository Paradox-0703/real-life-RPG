// ===============================
// SAFE DOM SHORTCUT
// ===============================

const $ = id => document.getElementById(id);
// coin system
let coins = Number(localStorage.getItem("coins")) || 0;

const DIFFICULTY_COINS = {
  easy: 5,
  normal: 10,
  hard: 50,
  extreme: 100
};
// warnning
let pendingAuthorityAction = null;

function showSystemWarning(message, onConfirm) {
  $("systemWarningText").innerHTML = message;
  $("systemWarningModal").classList.remove("hidden");
  pendingAuthorityAction = onConfirm;
}
// shop
let activeProtection = null; // { difficulty }
let skipAvailable = false;
function buyProtection() {
  const diff = $("protectionDifficulty").value;

  const COST = {
    easy: 1000,
    normal: 2000,
    hard: 5000,
    extreme: 10000
  };

  const cost = COST[diff];

  if (coins < cost) {
    showSystemMessage("NOT ENOUGH COINS", "fail");
    return;
  }

  activeProtection = { difficulty: diff };
  coins -= cost;

  showSystemMessage(`🛡️ ${diff.toUpperCase()} PROTECTION READY`, "success");
  updateUI();
}
function buySkip() {
  if (coins < 10000) {
    showSystemMessage("NOT ENOUGH COINS", "fail");
    return;
  }

  skipAvailable = true;
  coins -= 10000;

  showSystemMessage("⏭️ SKIP READY (CLICK A QUEST)", "success");
  updateUI();
}



// ===============================
// ELEMENT REFERENCES
// ===============================
const streakListEl = $("streakList");
const habitNameEl = $("habitName");
const habitXPEl = $("habitXP");
const habitPresetEl = $("habitPreset");
const habitTimeEl = $("habitTime");
const habitDifficultyEl = $("habitDifficulty");
const habitTimerModeEl = $("habitTimerMode");
const habitListEl = $("habitList");
// ===============================
// DATE HELPERS (STREAK SAFE)
// ===============================
const todayKey = () => {
  const d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
};
console.log("Today Key:", todayKey());


function isYesterday(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);

  const last = new Date(y, m - 1, d);
  const yesterday = new Date();
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  last.setHours(0, 0, 0, 0);

  return last.getTime() === yesterday.getTime();
}


// streaktag system
const STREAK_TAGS = [
  { days: 0, name: "Total Beginner", reward: 0, color: "#aaa" },
  { days: 7, name: "Beginner", reward: 50, color: "#4caf50" },
  { days: 14, name: "Intermediate", reward: 100, color: "#2196f3" },
  { days: 30, name: "Advanced", reward: 250, color: "#9c27b0" },
  { days: 60, name: "Mastery", reward: 500, color: "#ff9800" },
  { days: 100, name: "Godlike", reward: 1000, color: "#e91e63" },
  { days: 365, name: "Unstoppable", reward: 10000, color: "#f44336" }
];
function getStreakTag(streakCount) {
  return STREAK_TAGS
    .filter(t => streakCount >= t.days)
    .slice(-1)[0];
}


// ===============================
// SYSTEM POPUP
// ===============================
const systemPopupContainer = $("systemPopupContainer");

function showSystemMessage(message, type = "info", duration = 4000) {
  if (!systemPopupContainer) return;

  const popup = document.createElement("div");
  popup.className = `system-popup ${type}`;
  popup.textContent = message;

  // <-- STAGGER MULTIPLE POPUPS -->

  systemPopupContainer.appendChild(popup);

  requestAnimationFrame(() => popup.classList.add("show"));

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => {
      if (popup.parentNode) systemPopupContainer.removeChild(popup);
    }, 600);
  }, duration);
}
// theme

const root = document.documentElement;

const saved = localStorage.getItem("theme");
root.dataset.theme = saved || "dark";

const toggleTheme = () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
};


// ===============================
// PLAYER DATA
// ===============================
let level = Number(localStorage.getItem("level")) || 1;
let xp = Number(localStorage.getItem("xp")) || 0;
let rank = localStorage.getItem("rank") || "E";


// ===============================
// STATS
// ===============================
const DEFAULT_STATS = {
  str: { level: 1, xp: 0 },
  agi: { level: 1, xp: 0 },
  end: { level: 1, xp: 0 },
  spd: { level: 1, xp: 0 },
  int: { level: 1, xp: 0 },
  ctrl: { level: 1, xp: 0 }
};

let stats;
try {
  stats = JSON.parse(localStorage.getItem("stats")) || structuredClone(DEFAULT_STATS);
} catch {
  stats = structuredClone(DEFAULT_STATS);
}

// ===============================
// XP CURVES
// ===============================
const statXpNeeded = lvl => Math.floor(20 * Math.pow(1.3, lvl - 1));
const xpNeeded = () => Math.floor(100 * Math.pow(1.5, level - 1));

// ===============================
// RANK SYSTEM
// ===============================
function getRank(lvl = level) {
  if (lvl >= 50) return "S";
  if (lvl >= 30) return "A";
  if (lvl >= 20) return "B";
  if (lvl >= 10) return "C";
  if (lvl >= 5) return "D";
  return "E";
}

// ===============================
// PRESETS
// ===============================
const PRESETS = {
  workout: { str: 3, end: 2, agi: 1 },
  study: { int: 3, ctrl: 2, end: 1 },
  focus: { ctrl: 3, end: 2, int: 1 },
  speed: { spd: 3, agi: 2, end: 1 },
  discipline: { ctrl: 3, end: 2, str: 1 },

  // 🔥 STREAK PRESET
  streak: {}
};

// ===============================
// DIFFICULTY CONFIG
// ===============================
const DIFFICULTY = {
  easy: 1,
  normal: 1,
  hard: 2,
  extreme: 3
};

// ===============================
// QUEST STORAGE
// ===============================
let habits;
try {
  habits = JSON.parse(localStorage.getItem("habits")) || [];
} catch {
  habits = [];
}

// ===============================
// QUEST CHAINS (NEW)
// ===============================
let chains;
try {
  chains = JSON.parse(localStorage.getItem("chains")) || [];
} catch {
  chains = [];
}

const emptyStats = () => ({ str: 0, agi: 0, end: 0, spd: 0, int: 0, ctrl: 0 });

function saveChains() {
  localStorage.setItem("chains", JSON.stringify(chains));
}

function getChain(chainId) {
  return chains.find(c => c.id === chainId);
}

function spawnChainStepQuest(chain) {
  const idx = chain.currentStep || 0;
  const step = chain.steps[idx];
  if (!step) return;

  // Keep steps simple: no timers, no streak, no difficulty coins.
  habits.push({
    id: crypto.randomUUID(),
    name: `${step.name}`,
    baseXP: Number(step.xp) || 0,
    stats: { ...emptyStats(), ...(step.stats || {}) },
    difficulty: "normal",
    timeLimit: 0,
    timerMode: "fail",
    startTime: Date.now(),
    failed: false,

    isStreak: false,
    lastCompletedDay: null,
    streakCount: 0,
    milestonesClaimed: [],
    bestStreak: 0,
    coinsEarned: 0,

    // 🔗 chain metadata
    isChainStep: true,
    chainId: chain.id,
    chainStepIndex: idx
  });
}

function startChain(chainId) {
  const chain = getChain(chainId);
  if (!chain || chain.completed) return;

  // If already has an active step quest, don't spawn again
  const alreadyActive = habits.some(h => h.chainId === chainId && h.isChainStep && !h.failed);
  if (alreadyActive) return;

  chain.currentStep = chain.currentStep ?? 0;
  spawnChainStepQuest(chain);
  saveChains();
  saveAll();
  updateUI();
}

function advanceChain(chainId) {
  const chain = getChain(chainId);
  if (!chain || chain.completed) return;

  const nextIndex = (chain.currentStep ?? 0) + 1;

  if (nextIndex >= chain.steps.length) {
    chain.completed = true;
    chain.completedAt = Date.now();

    const finalXP = Number(chain.finalReward?.xp) || 0;
    const finalCoins = Number(chain.finalReward?.coins) || 0;

    if (finalXP > 0) xp += finalXP;
    if (finalCoins > 0) coins += finalCoins;

    while (xp >= xpNeeded()) {
      xp -= xpNeeded();
      level++;
      showSystemMessage(`LEVEL UP → ${level}`, "success");
    }

    showSystemMessage(`🏁 CHAIN COMPLETED: ${chain.name} (+${finalXP} XP, +${finalCoins} coins)`, "success");
    saveChains();
    saveAll();
    updateUI();
    return;
  }

  chain.currentStep = nextIndex;
  spawnChainStepQuest(chain);

  showSystemMessage(`⛓️ CHAIN PROGRESS: ${chain.name} → Step ${nextIndex + 1}/${chain.steps.length}`, "info");

  saveChains();
  saveAll();
  updateUI();
}
// ===============================
// RENDER CHAIN PROGRESS
// ===============================
function renderChainProgress(chain) {

  const description = chain.desc
    ? `<div class="chain-desc">${chain.desc}</div>`
    : "";

  return `
    <div class="chain-progress">

      <div class="chain-title">⚔ ${chain.name}</div>

      ${description}

      <div class="chain-progress-bar">
        Step ${chain.currentStep + 1} / ${chain.steps.length}
      </div>

    </div>
  `;
}
function renderChains() {
  const list = $("chainList");
  if (!list) return;

  const active = chains.filter(c => !c.completed);
  list.innerHTML = "";

  if (active.length === 0) return;

  active.forEach(c => {
    const cur = (c.currentStep ?? 0) + 1;
    const total = c.steps?.length || 0;

    const card = document.createElement("div");
    card.className = "chain-card";

    card.innerHTML = `
      <div class="chain-card__title">
        <span>${c.name}</span>
        <span class="chain-badge">STEP ${cur}/${total}</span>
      </div>
      ${c.desc ? `<div class="chain-card__meta">${c.desc}</div>` : ""}
      <div class="chain-card__meta">Current: <b>${c.steps?.[c.currentStep ?? 0]?.name ?? "—"}</b></div>
    `;

    const btnRow = document.createElement("div");
    btnRow.className = "quest-buttons";

    const resumeBtn = document.createElement("button");
    resumeBtn.textContent = "SYNC STEP";
    resumeBtn.onclick = () => startChain(c.id);

    const abandonBtn = document.createElement("button");
    abandonBtn.textContent = "ABANDON";
    abandonBtn.className = "reset-btn";
    abandonBtn.onclick = () => {
      showSystemWarning(
        `Abandon chain "<b>${c.name}</b>"?<br><br>⚠ Active step quest will be erased.`,
        () => {
          habits = habits.filter(h => h.chainId !== c.id);
          c.completed = true;
          c.abandoned = true;
          c.completedAt = Date.now();
          saveChains();
          updateUI();
          showSystemMessage("CHAIN ABANDONED", "fail");
        }
      );
    };

    btnRow.appendChild(resumeBtn);
    btnRow.appendChild(abandonBtn);
    card.appendChild(btnRow);

    list.appendChild(card);
  });
}

// ===============================
// QUEST TREES (NEW)
// ===============================
let trees;
try {
  trees = JSON.parse(localStorage.getItem("trees")) || [];
} catch {
  trees = [];
}

function saveTrees() {
  localStorage.setItem("trees", JSON.stringify(trees));
}

function getTree(treeId) {
  return trees.find(t => t.id === treeId);
}

function treeAllNodes(tree) {
  return Array.isArray(tree?.nodes) ? tree.nodes : [];
}

function treeCompletedCount(tree) {
  return treeAllNodes(tree).filter(n => n.completed).length;
}

function treeTotalCount(tree) {
  return treeAllNodes(tree).length;
}

function treeIsUnlocked(tree, node) {
  const prereq = node.prereq || [];
  if (prereq.length === 0) return true;
  const map = new Map(treeAllNodes(tree).map(n => [n.id, n]));
  return prereq.every(pid => map.get(pid)?.completed);
}

function spawnTreeNodeQuest(tree, node) {
  // Avoid duplicates (if already active in habits)
  const alreadyActive = habits.some(h => h.isTreeNode && h.treeId === tree.id && h.treeNodeId === node.id && !h.failed);
  if (alreadyActive) return;

  habits.push({
    id: crypto.randomUUID(),
    name: node.name,
    baseXP: Number(node.xp) || 0,
    stats: { ...emptyStats(), ...(node.stats || {}) },

    // design choice: tree nodes are “system objectives”
    difficulty: "normal",
    timeLimit: 0,
    timerMode: "fail",
    startTime: Date.now(),
    failed: false,

    isStreak: false,
    lastCompletedDay: null,
    streakCount: 0,
    milestonesClaimed: [],
    bestStreak: 0,
    coinsEarned: 0,

    // 🌳 tree metadata
    isTreeNode: true,
    treeId: tree.id,
    treeNodeId: node.id
  });
}

function syncTree(treeId) {
  const tree = getTree(treeId);
  if (!tree || tree.completed) return;

  // Spawn every unlocked+incomplete node
  treeAllNodes(tree).forEach(node => {
    if (node.completed) return;
    if (!treeIsUnlocked(tree, node)) return;
    spawnTreeNodeQuest(tree, node);
  });

  saveTrees();
  saveAll();
  updateUI();
}

function completeTreeNode(treeId, nodeId) {
  const tree = getTree(treeId);
  if (!tree || tree.completed) return;

  const node = treeAllNodes(tree).find(n => n.id === nodeId);
  if (!node || node.completed) return;

  node.completed = true;
  node.completedAt = Date.now();

  // If all nodes done, grant final reward
  const done = treeCompletedCount(tree);
  const total = treeTotalCount(tree);

  if (total > 0 && done >= total) {
    tree.completed = true;
    tree.completedAt = Date.now();

    const finalXP = Number(tree.finalReward?.xp) || 0;
    const finalCoins = Number(tree.finalReward?.coins) || 0;

    if (finalXP > 0) xp += finalXP;
    if (finalCoins > 0) coins += finalCoins;

    while (xp >= xpNeeded()) {
      xp -= xpNeeded();
      level++;
      showSystemMessage(`LEVEL UP → ${level}`, "success");
    }

    showSystemMessage(`🌳 TREE CLEARED: ${tree.name} (+${finalXP} XP, +${finalCoins} coins)`, "success");
  } else {
    showSystemMessage(`🌿 NODE CLEARED: ${node.name} (${done}/${total})`, "info");
  }

  // After completion, spawn newly unlocked nodes
  syncTree(treeId);
  saveTrees();
  saveAll();
  updateUI();
}
function renderTrees() {
  const list = $("treeList");
  if (!list) return;

  list.innerHTML = "";

  const active = trees.filter(t => !t.completed);
  if (active.length === 0) return;

  active.forEach(t => {
    const done = treeCompletedCount(t);
    const total = treeTotalCount(t);

    const card = document.createElement("div");
    card.className = "tree-card";

    card.innerHTML = `
      <div class="tree-card__title">
        <span>🌳 ${t.name}</span>
        <span class="tree-badge">${done}/${total}</span>
      </div>
      ${t.desc ? `<div class="tree-card__meta">${t.desc}</div>` : ""}
      <div class="tree-card__meta">Unlocked nodes are auto-synced into Active Quests.</div>
    `;

    const btnRow = document.createElement("div");
    btnRow.className = "quest-buttons";

    const syncBtn = document.createElement("button");
    syncBtn.textContent = "SYNC";
    syncBtn.onclick = () => syncTree(t.id);

    const abandonBtn = document.createElement("button");
    abandonBtn.textContent = "ABANDON";
    abandonBtn.className = "reset-btn";
    abandonBtn.onclick = () => {
      showSystemWarning(
        `Abandon tree "<b>${t.name}</b>"?<br><br>⚠ Active tree quests will be erased.`,
        () => {
          habits = habits.filter(h => !(h.isTreeNode && h.treeId === t.id));
          t.completed = true;
          t.abandoned = true;
          t.completedAt = Date.now();
          saveTrees();
          updateUI();
          showSystemMessage("TREE ABANDONED", "fail");
        }
      );
    };

    btnRow.appendChild(syncBtn);
    btnRow.appendChild(abandonBtn);
    card.appendChild(btnRow);

    list.appendChild(card);
  });
}
// ===============================
// QUEST TREE BUILDER (UI)
// ===============================
(function initTreeBuilder() {
  const creator = $("treeCreator");
  const nodesHost = $("treeNodes");

  const open = () => { creator?.classList.remove("hidden"); rebuildPrereqLists(); };
  const close = () => creator?.classList.add("hidden");

  $("createTreeBtn")?.addEventListener("click", () => {
    if (!nodesHost) return;
    creator?.classList.toggle("hidden");
    if (!creator?.classList.contains("hidden") && nodesHost.children.length === 0) addTreeNodeRow();
    rebuildPrereqLists();
  });

  $("treeCreatorCloseBtn")?.addEventListener("click", close);

  function addTreeNodeRow() {
    if (!nodesHost) return;

    const row = document.createElement("div");
    row.className = "tree-node";
    row.dataset.nodeLocalId = crypto.randomUUID();

    row.innerHTML = `
      <div class="tree-node__top">
        <div class="tree-node__label">NODE</div>
        <button type="button" class="reset-btn treeRemoveNodeBtn">Remove</button>
      </div>

      <div class="tree-node__grid">
        <input class="treeNodeName" placeholder="Node Name (Quest)">
        <input class="treeNodeXP" type="number" min="0" placeholder="XP">
      </div>

      <div class="quest-stats" style="margin-top:8px;">
        <input class="treeNodeStat" data-stat="str" type="number" placeholder="STR">
        <input class="treeNodeStat" data-stat="agi" type="number" placeholder="AGI">
        <input class="treeNodeStat" data-stat="end" type="number" placeholder="END">
        <input class="treeNodeStat" data-stat="spd" type="number" placeholder="SPD">
        <input class="treeNodeStat" data-stat="int" type="number" placeholder="INT">
        <input class="treeNodeStat" data-stat="ctrl" type="number" placeholder="CTRL">
      </div>

      <div class="tree-node__prereq">
        <div class="tree-node__prereqTitle">Prerequisites (select nodes that must be cleared first)</div>
        <div class="tree-node__checks treePrereqChecks"></div>
      </div>
    `;

    row.querySelector(".treeRemoveNodeBtn").onclick = () => {
      row.remove();
      rebuildPrereqLists();
    };

    nodesHost.appendChild(row);
    rebuildPrereqLists();
  }

  function getDraftNodeLabels() {
    if (!nodesHost) return [];
    return [...nodesHost.children].map((el, idx) => {
      const id = el.dataset.nodeLocalId;
      const name = el.querySelector(".treeNodeName")?.value?.trim() || `Node ${idx + 1}`;
      return { id, name };
    });
  }

  function rebuildPrereqLists() {
    if (!nodesHost) return;
    const labels = getDraftNodeLabels();

    [...nodesHost.children].forEach((el) => {
      const checks = el.querySelector(".treePrereqChecks");
      if (!checks) return;

      const selfId = el.dataset.nodeLocalId;
      // preserve selected prereqs
      const selected = new Set(
        [...checks.querySelectorAll("input[type=checkbox]:checked")].map(x => x.value)
      );

      checks.innerHTML = "";

      labels
        .filter(l => l.id !== selfId)
        .forEach(l => {
          const wrap = document.createElement("label");
          wrap.style.display = "inline-flex";
          wrap.style.gap = "6px";
          wrap.style.alignItems = "center";

          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.value = l.id;
          cb.checked = selected.has(l.id);

          const txt = document.createElement("span");
          txt.textContent = l.name;

          wrap.appendChild(cb);
          wrap.appendChild(txt);

          checks.appendChild(wrap);
        });
    });
  }

  nodesHost?.addEventListener("input", (e) => {
    if (
      e.target?.classList?.contains("treeNodeName") ||
      e.target?.classList?.contains("treeNodeXP")
    ) rebuildPrereqLists();
  });

  $("addTreeNodeBtn")?.addEventListener("click", addTreeNodeRow);

  $("clearTreeNodesBtn")?.addEventListener("click", () => {
    if (!nodesHost) return;
    nodesHost.innerHTML = "";
    addTreeNodeRow();
  });

  $("saveTreeBtn")?.addEventListener("click", () => {
    const name = $("treeName")?.value?.trim();
    const desc = $("treeDesc")?.value?.trim() || "";

    if (!name) { showSystemMessage("TREE NAME REQUIRED", "fail"); return; }

    const nodeEls = [...(nodesHost?.children || [])];
    if (nodeEls.length === 0) { showSystemMessage("ADD AT LEAST 1 NODE", "fail"); return; }

    const nodes = nodeEls.map((el, idx) => {
      const id = el.dataset.nodeLocalId || crypto.randomUUID();
      const nodeName = el.querySelector(".treeNodeName")?.value?.trim() || "";
      const nodeXP = Number(el.querySelector(".treeNodeXP")?.value) || 0;

      const st = emptyStats();
      el.querySelectorAll(".treeNodeStat").forEach(inp => {
        const k = inp.getAttribute("data-stat");
        st[k] = Number(inp.value) || 0;
      });

      const prereq = [...el.querySelectorAll(".treePrereqChecks input[type=checkbox]:checked")]
        .map(cb => cb.value);

      return { id, name: nodeName, xp: nodeXP, stats: st, prereq, completed: false };
    });

    if (nodes.some(n => !n.name)) { showSystemMessage("EVERY NODE NEEDS A NAME", "fail"); return; }

    const finalXP = Number($("treeFinalXP")?.value) || 0;
    const finalCoins = Number($("treeFinalCoins")?.value) || 0;

    const tree = {
      id: crypto.randomUUID(),
      name,
      desc,
      nodes,
      finalReward: { xp: finalXP, coins: finalCoins },
      completed: false,
      createdAt: Date.now()
    };

    trees.push(tree);
    saveTrees();

    // spawn unlocked nodes immediately
    syncTree(tree.id);

    // reset
    $("treeName").value = "";
    $("treeDesc").value = "";
    $("treeFinalXP").value = "";
    $("treeFinalCoins").value = "";
    if (nodesHost) nodesHost.innerHTML = "";
    addTreeNodeRow();

    close();
    showSystemMessage("TREE CREATED", "success");
  });
})();
// ===============================
// CODEX SYSTEM
// ===============================

let codex = JSON.parse(localStorage.getItem("codex")) || {
  problemsToday: 0,
  lastSolveDate: "",
  dailyStreak: 0
};

function saveCodex() {
  localStorage.setItem("codex", JSON.stringify(codex));
}
const CF_DIV_REWARDS = {
  4: { baseXP: 200, baseINT: 2 },
  3: { baseXP: 500, baseINT: 5 },
  2: { baseXP: 1000, baseINT: 10 },
  1: { baseXP: 3000, baseINT: 30 }
};

const LC_REWARDS = {
  easy: { xp: 500, int: 5 },
  medium: { xp: 2000, int: 20 },
  hard: { xp: 5000, int: 50 }
};
function applyCodexReward({ xpGain, intGain, coinsGain }) {

  const today = todayKey();

  // Reset daily counter if new day
  if (codex.lastSolveDate !== today) {

    // Daily streak evaluation
    if (codex.problemsToday >= 3 && isYesterday(codex.lastSolveDate)) {
      codex.dailyStreak++;
    } else if (codex.problemsToday >= 3) {
      codex.dailyStreak = 1;
    } else {
      codex.dailyStreak = 0;
    }

    codex.problemsToday = 0;
  }

  codex.lastSolveDate = today;

  // Base rewards
  xp += xpGain;
  stats.int.xp += intGain;
  coins += coinsGain;

  // Stat level-up check
  while (stats.int.xp >= statXpNeeded(stats.int.level)) {
    stats.int.xp -= statXpNeeded(stats.int.level);
    stats.int.level++;
    glowStat("int", true);
  }

  // Player level-up
  while (xp >= xpNeeded()) {
    xp -= xpNeeded();
    level++;
    showSystemMessage(`LEVEL UP → ${level}`, "success");
  }

  // Same-day streak logic
  codex.problemsToday++;
  saveCodex();
  updateUI();
  if (codex.problemsToday >= 3) {
    const ctrlBonus = codex.problemsToday;
    stats.ctrl.xp += ctrlBonus;

    showSystemMessage(`🔥 SAME DAY STREAK +${ctrlBonus} CTRL`, "info");

    while (stats.ctrl.xp >= statXpNeeded(stats.ctrl.level)) {
      stats.ctrl.xp -= statXpNeeded(stats.ctrl.level);
      stats.ctrl.level++;
      glowStat("ctrl", true);
    }
  }

  // Daily streak bonus
  if (codex.dailyStreak > 0) {
    const dailyBonus = 10 + (codex.dailyStreak - 1) * 2;
    stats.ctrl.xp += dailyBonus;

    showSystemMessage(
      `📅 DAILY STREAK ${codex.dailyStreak} → +${dailyBonus} CTRL`,
      "success"
    );

    while (stats.ctrl.xp >= statXpNeeded(stats.ctrl.level)) {
      stats.ctrl.xp -= statXpNeeded(stats.ctrl.level);
      stats.ctrl.level++;
      glowStat("ctrl", true);
    }
  }
  renderCodexStreak();
  saveCodex();
  updateUI();
}
function solveCodeforces({ division, problemsSolved }) {

  const base = CF_DIV_REWARDS[division];
  if (!base) return;

  problemsSolved.forEach((_, index) => {

    let xpGain = base.baseXP;
    let intGain = base.baseINT;

    if (division >= 2) {
      xpGain *= Math.pow(2, index);
      intGain *= Math.pow(2, index);
    } else {
      xpGain += base.baseXP * index;
      intGain += base.baseINT * index;
    }

    const coinsGain = 100 + index * 50;

    applyCodexReward({
      xpGain,
      intGain,
      coinsGain
    });

  });
}
function solveLeetCode(type, count = 1) {

  const reward = LC_REWARDS[type];
  if (!reward) return;

  for (let i = 0; i < count; i++) {

    const xpGain = reward.xp;
    const intGain = reward.int;
    const coinsGain = 100 + i * 50;

    applyCodexReward({
      xpGain,
      intGain,
      coinsGain
    });
  }
}
$("codexInitBtn")?.addEventListener("click", () => {

  const source = $("codexSource").value;
  const panel = $("codexDynamicPanel");
  panel.innerHTML = "";

  if (source === "codeforces") {

    panel.innerHTML = `
      <select id="cfDivision">
        <option value="4">Div 4</option>
        <option value="3">Div 3</option>
        <option value="2">Div 2</option>
        <option value="1">Div 1</option>
      </select>

      <input id="cfSolvedCount" type="number" placeholder="Problems Solved (1-9)">

      <button id="cfSubmit">SUBMIT</button>
    `;

    $("cfSubmit").onclick = () => {
      const division = Number($("cfDivision").value);
      const count = Number($("cfSolvedCount").value);

      if (!count || count <= 0) return;

      solveCodeforces({
        division,
        problemsSolved: Array(count).fill(0)
      });
    };

  }

  if (source === "leetcode") {

    panel.innerHTML = `
      <select id="lcType">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <input id="lcCount" type="number" placeholder="Problems Solved">

      <button id="lcSubmit">SUBMIT</button>
    `;

    $("lcSubmit").onclick = () => {
      const type = $("lcType").value;
      const count = Number($("lcCount").value);

      if (!count || count <= 0) return;

      solveLeetCode(type, count);
    };
  }

});


// ===============================
// SAVE
// ===============================
function saveAll() {
  localStorage.setItem("coins", coins);
  localStorage.setItem("level", level);
  localStorage.setItem("xp", xp);
  localStorage.setItem("rank", rank);
  localStorage.setItem("stats", JSON.stringify(stats));
  localStorage.setItem("habits", JSON.stringify(habits));
  localStorage.setItem("chains", JSON.stringify(chains));
  localStorage.setItem("trees", JSON.stringify(trees));
}

// ===============================
// UI UPDATE
// ===============================
function updateUI() {
  $("level").textContent = level;
  $("xp").textContent = xp;
  $("xpNeeded").textContent = xpNeeded();
  $("coins").textContent = coins;

  rank = getRank();

  const rankEl = $("rank");
  rankEl.textContent = rank;
  rankEl.className = `rank-${rank}`;

  $("xpFill").style.width = Math.min((xp / xpNeeded()) * 100, 100) + "%";

  renderStats();
  renderHabits();
  renderChains();
  renderStreaks();
  renderCodexStreak();
  renderTrees();
  saveAll();
}


// ===============================
// ADD QUEST
// ===============================
function addHabit() {
  const name = habitNameEl.value.trim();
  const baseXP = Number(habitXPEl.value);
  const timeMin = Number(habitTimeEl.value) || 0;
  const preset = habitPresetEl.value;
  const difficulty = habitDifficultyEl.value || "normal";
  const timerMode = habitTimerModeEl.value || "fail";

  if (!name || baseXP <= 0) { showSystemMessage("INVALID QUEST", "fail"); return; }

  let rewards = { str: 0, agi: 0, end: 0, spd: 0, int: 0, ctrl: 0 };
  if (PRESETS[preset]) Object.assign(rewards, PRESETS[preset]);
  Object.keys(rewards).forEach(k => { rewards[k] += Number($(k)?.value) || 0; });


  habits.push({
    id: crypto.randomUUID(),
    name,
    baseXP,
    stats: rewards,
    difficulty,
    timeLimit: timeMin > 0 ? timeMin * 60 : 0,
    timerMode,
    startTime: Date.now(),
    failed: false,

    // 🔥 STREAK DATA
    isStreak: preset === "streak",
    lastCompletedDay: null,
    streakCount: 0,

    // 🔥 REQUIRED FOR TAGS
    milestonesClaimed: [],
    bestStreak: 0,
    coinsEarned: 0
  });


  habitNameEl.value = "";
  habitXPEl.value = "";
  habitTimeEl.value = "";
  habitPresetEl.value = "";
  habitDifficultyEl.value = "normal";
  habitTimerModeEl.value = "fail";
  ["str", "agi", "end", "spd", "int", "ctrl"].forEach(id => $(id).value = "");

  showSystemMessage("QUEST REGISTERED", "success");
  updateUI();
}
// auto scroll
function focusPlayerStats(callback) {
  const panel = document.querySelector(".panel-left");
  if (!panel) return;

  panel.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  // 🔥 wait for scroll to finish before animating
  if (callback) {
    setTimeout(callback, 700); // adjust timing here
  }
}


// ===============================
// COMPLETE QUEST
// ===============================
function completeHabit(id) {
  const q = habits.find(h => h.id === id);
  if (!q || q.failed) return;

  xp += q.baseXP || 0;
  // ===============================
  // APPLY STAT XP (LOGIC)
  // ===============================
  const leveledStats = [];

  for (let key in q.stats) {
    const gain = q.stats[key];
    if (!gain || !stats[key]) continue;

    stats[key].xp += gain;

    while (stats[key].xp >= statXpNeeded(stats[key].level)) {
      stats[key].xp -= statXpNeeded(stats[key].level);
      stats[key].level++;
      leveledStats.push(key);
    }
  }
  focusPlayerStats(() => {
    for (let key in q.stats) {
      if (!q.stats[key]) continue;
      glowStat(key, leveledStats.includes(key));
    }
  });



  // 🔥 STREAK CHECK

  if (q.isStreak) {
    const today = todayKey();
    if (q.lastCompletedDay === today) {
      showSystemMessage("STREAK ALREADY COMPLETED TODAY", "info");
      return;
    }
    coins += 50;
    q.coinsEarned = (q.coinsEarned || 0) + 50;

    if (q.lastCompletedDay && isYesterday(q.lastCompletedDay)) {
      q.streakCount++;
    } else {
      q.streakCount = 1;
    }

    q.lastCompletedDay = today;
    const tag = STREAK_TAGS.find(t => t.days === q.streakCount);

    if (tag && !q.milestonesClaimed.includes(tag.days)) {
      coins += tag.reward;
      q.milestonesClaimed.push(tag.days);

      showSystemMessage(
        `🏷️ ${tag.name} unlocked! +${tag.reward} coins`,
        "success"
      );
    }

    showSystemMessage(`🔥 STREAK DAY ${q.streakCount}`, "success");
  }



  while (xp >= xpNeeded()) {
    xp -= xpNeeded();
    level++;
    showSystemMessage(`LEVEL UP → ${level}`, "success");
  }

  showSystemMessage(`QUEST COMPLETED: ${q.name}`, "success");

  // Coins: normal quests use difficulty coins. Chain steps do NOT (your design: step rewards = XP + stats).
  if (!q.isStreak && !q.isChainStep && !q.isTreeNode) {
    const reward = DIFFICULTY_COINS[q.difficulty] || 0;
    coins += reward;
    q.coinsEarned = (q.coinsEarned || 0) + reward;
  }

  // 🔥 Remove ONLY non-streak quests on completion
  if (!q.isStreak) {
    habits = habits.filter(h => h.id !== id);
  }

  // 🔗 Chain progression (after removing the completed step quest)
  if (q.isChainStep && q.chainId) {
    advanceChain(q.chainId);
    return; // advanceChain already saves + updates UI
  }
  // 🌳 Tree progression
  if (q.isTreeNode && q.treeId && q.treeNodeId) {
    completeTreeNode(q.treeId, q.treeNodeId);
    return; // completeTreeNode will save + update UI
  }

  saveAll();
  updateUI();

}


// ===============================
// PENALTY
// ===============================
function deductXP(amount) {
  while (amount > 0 && level > 1) {
    if (xp >= amount) { xp -= amount; amount = 0; }
    else { amount -= xp; level--; xp = xpNeeded() - 1; }
  }
  if (level === 1) xp = Math.max(0, xp - amount);
}

function deductStat(statKey, amount) {
  const s = stats[statKey];
  while (amount > 0 && s.level > 1) {
    if (s.xp >= amount) { s.xp -= amount; amount = 0; }
    else { amount -= s.xp; s.level--; s.xp = statXpNeeded(s.level) - 1; }
  }
  if (s.level === 1) s.xp = Math.max(0, s.xp - amount);
}

function applyFailPenalty(h) {
  // ❌ No protection for extreme streaks
  if (
    activeProtection &&
    activeProtection.difficulty === h.difficulty &&
    !(h.isStreak && h.difficulty === "extreme")
  ) {
    showSystemMessage("🛡️ PROTECTION USED", "info");
    activeProtection = null;
    return;
  }

  const mult = DIFFICULTY[h.difficulty] || 1;
  deductXP(Math.floor(h.baseXP * mult));

  for (let k in h.stats) {
    deductStat(k, Math.floor(h.stats[k] * mult));
    glowStat(k);
  }

  showSystemMessage(`QUEST FAILED: ${h.name}`, "fail");
}


// ===============================
// TIMER CHECK
// ===============================
function updateTimers() {
  const now = Date.now();
  let updated = false;

  habits.forEach(h => {
    if (h.isStreak) return;
    if (h.failed || !h.timeLimit) return;
    const elapsed = now - h.startTime;
    if (elapsed < 0) return; // prevents negative elapsed (clock change)

    const remaining = h.timeLimit * 1000 - elapsed;

    // Update remaining time for display
    h.remainingTime = Math.max(0, Math.ceil(remaining / 1000));

    // Check if time expired
    if (remaining <= 0) {
      if (h.timerMode === "fail" && !h.failed) {
        applyFailPenalty(h);
        h.failed = true;
        updated = true;
      } else if (h.timerMode === "auto-complete") {
        completeHabit(h.id);
        updated = true;
      }
    }
  });

  if (updated) {
    // 🔥 Remove failed NON-STREAK quests only
    habits = habits.filter(h => !(h.failed && !h.isStreak));
    updateUI();
    saveAll();
  }


  renderHabits(); // refresh the quest list with updated timers
}
setInterval(updateTimers, 1000);


// ===============================
// RENDER STATS
// ===============================
function renderStats() {
  for (let k in stats) {
    const s = stats[k];
    const need = statXpNeeded(s.level);
    const pct = Math.min((s.xp / need) * 100, 100);
    $(`stat-${k}`).textContent = `Lv ${s.level} (${s.xp}/${need})`;
    $(`bar-${k}`).style.width = pct + "%";
  }
}

// ===============================
// RENDER QUESTS
// ===============================

function renderHabits() {

  habitListEl.innerHTML = "";
  habits.forEach(h => {
    // 🔥 hide archived streaks
    if (h.isStreak && h.archived) return;

    // 🔥 check if streak was completed today
    const completedToday =
      h.isStreak && h.lastCompletedDay === todayKey();

    // 🔥 hide completed streaks until tomorrow
    if (completedToday) return;

    const li = document.createElement("li");

    if (h.failed) li.classList.add("quest-failed");

    // Timer
    let timerHtml = "";
    if (h.timeLimit) {
      const remain = h.remainingTime ?? Math.max(0, Math.ceil((h.timeLimit * 1000 - (Date.now() - h.startTime)) / 1000));
      timerHtml = `<div class="quest-timer">⏱ ${remain}s left</div>`;
    }


    // Stats display
    const statsHtml = Object.entries(h.stats)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => `<span class="quest-stat">${k.toUpperCase()}: +${v}</span>`)
      .join(" ");

    // Difficulty badge
    const diffBadge = `<span class="quest-difficulty quest-diff-${h.difficulty}">${h.difficulty.toUpperCase()}</span>`;

    // Penalty display
    const mult = DIFFICULTY[h.difficulty] || 1;
    let penaltyHtml = "";
    if (mult > 0) {
      const statPenalty = Object.entries(h.stats)
        .filter(([_, v]) => v > 0)
        .map(([k, v]) => `-${v * mult} ${k.toUpperCase()}`)
        .join(", ");
      penaltyHtml = `<div class="quest-penalty">⚠ On Fail: -${h.baseXP * mult} XP, ${statPenalty}</div>`;
    }

    li.innerHTML = `
      <div class="quest-info">
      ${h.isChainStep && h.chainId ? renderChainProgress(getChain(h.chainId)) : ""}
        <strong>${h.name}</strong> ${diffBadge}
        ${h.isTreeNode ? `<div class="quest-streak">🌳 ${getTree(h.treeId)?.name || "TREE"} • Node</div>` : ""}
         ${h.isChainStep ? `<div class="quest-streak">⛓️ ${getChain(h.chainId)?.name || "CHAIN"} • Step ${(h.chainStepIndex || 0) + 1}/${getChain(h.chainId)?.steps?.length || "?"}</div>` : ""}
        ${h.isStreak ? `<div class="quest-streak">🔥 ${h.streakCount} day streak</div>` : ""}
        <div class="quest-meta">+${h.baseXP} XP</div>
        ${statsHtml ? `<div class="quest-stats">${statsHtml}</div>` : ""}
        ${penaltyHtml}
        ${timerHtml}
      </div>
    `;

    // Buttons
    // Buttons
    const btnContainer = document.createElement("div");
    btnContainer.className = "quest-buttons";

    const editBtn = document.createElement("button");
    editBtn.textContent = "EDIT";
    editBtn.onclick = () => openEditQuestModal(h.id);
    btnContainer.appendChild(editBtn);

    const completeBtn = document.createElement("button");
    completeBtn.textContent = h.isStreak ? "DAILY COMPLETE" : "COMPLETE";
    completeBtn.disabled = h.failed;
    completeBtn.onclick = () => {
      if (skipAvailable) {
        showSystemWarning(
          `Apply <b>Authority Seal</b> to "${h.name}"?<br><br>
       ⚠ Quest will be erased<br>
       ⚠ No XP<br>
       ⚠ No coins<br>
       ⚠ No streak progress`,
          () => {
            skipAvailable = false;

            if (h.isStreak) {
              showSystemMessage("CANNOT ERASE STREAK QUEST", "fail");
              return;
            }
            habits = habits.filter(x => x.id !== h.id);
            showSystemMessage("⏭️ QUEST ERASED", "fail");
            updateUI();
          }
        );
        return;
      }

      completeHabit(h.id);
    };



    btnContainer.appendChild(completeBtn);
    if (h.isStreak) {
      const archiveBtn = document.createElement("button");
      archiveBtn.textContent = "ARCHIVE";
      archiveBtn.onclick = () => {
        if (confirm("ARCHIVE THIS STREAK? You can restore it later.")) {
          h.archived = true;
          saveAll();
          renderHabits();
        }
      };
      btnContainer.appendChild(archiveBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "DELETE";
      deleteBtn.className = "reset-btn";
      deleteBtn.onclick = () => {
        if (confirm("DELETE THIS STREAK PERMANENTLY? This cannot be undone.")) {
          habits = habits.filter(x => x.id !== h.id);
          saveAll();
          renderHabits();
        }
      };
      btnContainer.appendChild(deleteBtn);
    }


    if (!h.timeLimit && !h.failed) {
      const failBtn = document.createElement("button");
      failBtn.textContent = "FAIL";
      failBtn.onclick = () => {
        applyFailPenalty(h);
        h.failed = true;
        habits = habits.filter(x => !(x.failed && !x.isStreak));
        updateUI();
      };
      btnContainer.appendChild(failBtn);
    }

    li.appendChild(btnContainer);
    habitListEl.appendChild(li);
  });
}
// ===============
// renderstreaks
// ===============
function renderStreaks() {
  if (!streakListEl) return;
  streakListEl.innerHTML = "";

  habits
    .filter(h => h.isStreak)
    .forEach(h => {
      const li = document.createElement("li");

      li.innerHTML = `
        <div class="quest-info">
          <strong>${h.name}</strong>
          <div class="quest-meta">
            🔥 Streak: ${h.streakCount || 0} days
            ${h.archived ? " (ARCHIVED)" : ""}
          </div>
        </div>
      `;
      // 🏷️ STREAK TAG DISPLAY
      const tag = getStreakTag(h.streakCount);

      const tagEl = document.createElement("div");
      tagEl.className = "streak-tag";
      tagEl.textContent = `🏷️ ${tag.name}`;
      tagEl.style.color = tag.color;

      li.querySelector(".quest-info").appendChild(tagEl);

      const btns = document.createElement("div");
      btns.className = "quest-buttons";

      // ARCHIVE / RESTORE
      const archiveBtn = document.createElement("button");
      archiveBtn.textContent = h.archived ? "RESTORE" : "ARCHIVE";
      archiveBtn.onclick = () => {
        h.archived = !h.archived;
        saveAll();
        renderHabits();
        renderStreaks();
      };
      btns.appendChild(archiveBtn);
      const editBtn = document.createElement("button");
      editBtn.textContent = "EDIT";
      editBtn.onclick = () => openEditQuestModal(h.id);
      btns.appendChild(editBtn);
      // DELETE
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "DELETE";
      deleteBtn.className = "reset-btn";
      deleteBtn.onclick = () => {
        if (confirm("DELETE THIS STREAK PERMANENTLY?")) {
          habits = habits.filter(x => x.id !== h.id);
          saveAll();
          renderHabits();
          renderStreaks();
        }
      };
      btns.appendChild(deleteBtn);

      li.appendChild(btns);
      streakListEl.appendChild(li);
    });
}
function renderCodexStreak() {

  const today = todayKey();

  // Reset today counter if day changed
  if (codex.lastSolveDate !== today) {
    codex.problemsToday = 0;
  }

  $("codexTodayCount").textContent = codex.problemsToday;
  $("codexDailyStreak").textContent = codex.dailyStreak;

  const statusEl = $("codexStreakStatus");

  if (codex.problemsToday >= 3) {
    statusEl.textContent = "STREAK ACTIVE";
    statusEl.style.color = "#4caf50";
  } else {
    statusEl.textContent = "Need 3+ solves to activate";
    statusEl.style.color = "#aaa";
  }
}



// ===============================
// STAT EFFECT
// ===============================
function glowStat(key, levelUp = false) {
  const el = $(`stat-wrap-${key}`);
  if (!el) return;
  el.classList.remove("stat-glow", "stat-levelup");
  void el.offsetWidth;
  el.classList.add(levelUp ? "stat-levelup" : "stat-glow");

}
// Live preview
function refreshEditPreview() {
  const name = $("editQuestName")?.value?.trim() || "—";
  const xpVal = Number($("editQuestXP")?.value) || 0;

  const totalStats =
    (Number($("editStr")?.value) || 0) +
    (Number($("editAgi")?.value) || 0) +
    (Number($("editEnd")?.value) || 0) +
    (Number($("editSpd")?.value) || 0) +
    (Number($("editInt")?.value) || 0) +
    (Number($("editCtrl")?.value) || 0);

  $("editPreviewName").textContent = name;
  $("editPreviewXP").textContent = `+${xpVal} XP`;
  $("editPreviewStats").textContent = `+${totalStats} total stats`;
}
// ===============================
// EDIT QUEST SYSTEM
// ===============================

let editingQuestId = null;

function openEditQuestModal(questId) {
  const q = habits.find(h => h.id === questId);
  if (!q) return;

  editingQuestId = questId;

  // Fill fields
  $("editQuestName").value = q.name || "";
  $("editQuestXP").value = Number(q.baseXP || 0);

  // Time / timerMode (only really used for non-streak quests)
  $("editQuestTime").value = q.timeLimit ? Math.floor(q.timeLimit / 60) : "";
  $("editQuestTimerMode").value = q.timerMode || "fail";

  // Stats
  $("editStr").value = q.stats?.str ?? 0;
  $("editAgi").value = q.stats?.agi ?? 0;
  $("editEnd").value = q.stats?.end ?? 0;
  $("editSpd").value = q.stats?.spd ?? 0;
  $("editInt").value = q.stats?.int ?? 0;
  $("editCtrl").value = q.stats?.ctrl ?? 0;

  // If streak: hide time + timer mode (optional, but cleaner)
  const isStreak = !!q.isStreak;
  $("editQuestTime").style.display = isStreak ? "none" : "";
  $("editQuestTimerMode").style.display = isStreak ? "none" : "";

  $("editQuestModal").classList.remove("hidden");
  // show/hide wraps for timer UI too
  $("editTimeWrap").style.display = isStreak ? "none" : "";
  $("editModeWrap").style.display = isStreak ? "none" : "";

  // preview refresh
  if (typeof refreshEditPreview === "function") refreshEditPreview();
}

function closeEditQuestModal() {
  $("editQuestModal").classList.add("hidden");
  editingQuestId = null;
}

function saveQuestEdits() {
  if (!editingQuestId) return;

  const q = habits.find(h => h.id === editingQuestId);
  if (!q) { closeEditQuestModal(); return; }

  const newName = $("editQuestName").value.trim();
  const newXP = Number($("editQuestXP").value);

  if (!newName) { showSystemMessage("NAME REQUIRED", "fail"); return; }
  if (!Number.isFinite(newXP) || newXP <= 0) { showSystemMessage("INVALID XP", "fail"); return; }

  const newStats = {
    str: Number($("editStr").value) || 0,
    agi: Number($("editAgi").value) || 0,
    end: Number($("editEnd").value) || 0,
    spd: Number($("editSpd").value) || 0,
    int: Number($("editInt").value) || 0,
    ctrl: Number($("editCtrl").value) || 0
  };

  // Require at least one stat reward (matches your addHabit rule)


  q.name = newName;
  q.baseXP = newXP;
  q.stats = newStats;

  // Only non-streak quests use timers
  if (!q.isStreak) {
    const timeMin = Number($("editQuestTime").value) || 0;
    q.timeLimit = timeMin > 0 ? timeMin * 60 : 0;
    q.timerMode = $("editQuestTimerMode").value || "fail";

    // Reset timer baseline so the new time limit is fair
    q.startTime = Date.now();
    q.failed = false;
  }

  saveAll();
  updateUI();
  showSystemMessage("QUEST UPDATED", "success");
  closeEditQuestModal();
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Stepper buttons (+ / -)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".stepper__btn");
    if (!btn) return;

    const id = btn.getAttribute("data-step");
    const dir = Number(btn.getAttribute("data-dir"));
    const input = document.getElementById(id);
    if (!input) return;

    const cur = Number(input.value) || 0;
    const next = Math.max(0, cur + dir);
    input.value = next;
    input.dispatchEvent(new Event("input"));
  });



  ["editQuestName", "editQuestXP", "editStr", "editAgi", "editEnd", "editSpd", "editInt", "editCtrl"]
    .forEach(id => $(id)?.addEventListener("input", refreshEditPreview));
  $("editQuestCancelBtn")?.addEventListener("click", closeEditQuestModal);
  $("editQuestCancelBtn2")?.addEventListener("click", closeEditQuestModal);
  $("editQuestSaveBtn")?.addEventListener("click", saveQuestEdits);
  // ===============================
  // JOURNAL SYSTEM
  // ===============================

  const journalEl = $("futureJournal");

  if (journalEl) {
    // Load saved journal
    journalEl.value = localStorage.getItem("futureJournal") || "";

    // Auto-save on typing
    journalEl.addEventListener("input", () => {
      localStorage.setItem("futureJournal", journalEl.value);
    });
  }

  $("addQuestBtn")?.addEventListener("click", addHabit);

  // ===============================
  // CHAIN UI (NEW)
  // ===============================
  const creator = $("chainCreator");
  const stepsHost = $("chainSteps");

  function addChainStepRow(seed = null) {
    if (!stepsHost) return;

    const idx = stepsHost.children.length + 1;
    const wrap = document.createElement("div");
    wrap.className = "chain-step";

    wrap.innerHTML = `
      <div class="chain-step__top">
        <div class="chain-step__label">Step ${idx}</div>
        <button type="button" class="reset-btn chain-remove-step">Remove</button>
      </div>

      <div class="chain-step__grid">
        <input class="chainStepName" placeholder="Step Quest Name" value="${seed?.name ?? ""}">
        <input class="chainStepXP" type="number" min="0" placeholder="XP" value="${seed?.xp ?? 0}">
      </div>

      <div class="chain-step__stats">
        <input class="chainStepStat" data-stat="str" type="number" min="0" placeholder="STR" value="${seed?.stats?.str ?? 0}">
        <input class="chainStepStat" data-stat="agi" type="number" min="0" placeholder="AGI" value="${seed?.stats?.agi ?? 0}">
        <input class="chainStepStat" data-stat="end" type="number" min="0" placeholder="END" value="${seed?.stats?.end ?? 0}">
        <input class="chainStepStat" data-stat="spd" type="number" min="0" placeholder="SPD" value="${seed?.stats?.spd ?? 0}">
        <input class="chainStepStat" data-stat="int" type="number" min="0" placeholder="INT" value="${seed?.stats?.int ?? 0}">
        <input class="chainStepStat" data-stat="ctrl" type="number" min="0" placeholder="CTRL" value="${seed?.stats?.ctrl ?? 0}">
      </div>
    `;

    wrap.querySelector(".chain-remove-step").onclick = () => {
      wrap.remove();
      // relabel
      [...stepsHost.children].forEach((el, i) => {
        const label = el.querySelector(".chain-step__label");
        if (label) label.textContent = `Step ${i + 1}`;
      });
    };

    stepsHost.appendChild(wrap);
  }

  $("createChainBtn")?.addEventListener("click", () => {
    if (!creator) return;
    creator.classList.toggle("hidden");

    // first open: ensure at least 1 step row
    if (!creator.classList.contains("hidden") && stepsHost && stepsHost.children.length === 0) {
      addChainStepRow();
    }
  });

  $("chainCreatorCloseBtn")?.addEventListener("click", () => {
    creator?.classList.add("hidden");
  });

  $("addChainStepBtn")?.addEventListener("click", () => addChainStepRow());

  $("clearChainStepsBtn")?.addEventListener("click", () => {
    if (!stepsHost) return;
    stepsHost.innerHTML = "";
    addChainStepRow();
  });

  $("saveChainBtn")?.addEventListener("click", () => {
    const name = $("chainName")?.value?.trim();
    const desc = $("chainDesc")?.value?.trim() || "";

    if (!name) { showSystemMessage("CHAIN NAME REQUIRED", "fail"); return; }

    const stepEls = [...(stepsHost?.children || [])];
    if (stepEls.length === 0) { showSystemMessage("ADD AT LEAST 1 STEP", "fail"); return; }

    const steps = stepEls.map((el) => {
      const stepName = el.querySelector(".chainStepName")?.value?.trim() || "";
      const stepXP = Number(el.querySelector(".chainStepXP")?.value) || 0;

      const st = emptyStats();
      el.querySelectorAll(".chainStepStat").forEach(inp => {
        const k = inp.getAttribute("data-stat");
        st[k] = Number(inp.value) || 0;
      });

      return { name: stepName, xp: stepXP, stats: st };
    });

    if (steps.some(s => !s.name)) { showSystemMessage("EVERY STEP NEEDS A NAME", "fail"); return; }

    const finalXP = Number($("chainFinalXP")?.value) || 0;
    const finalCoins = Number($("chainFinalCoins")?.value) || 0;

    const chain = {
      id: crypto.randomUUID(),
      name,
      desc,
      steps,
      finalReward: { xp: finalXP, coins: finalCoins },
      currentStep: 0,
      completed: false,
      createdAt: Date.now()
    };

    chains.push(chain);
    saveChains();

    // spawn step 1 quest immediately
    startChain(chain.id);

    // reset form
    $("chainName").value = "";
    $("chainDesc").value = "";
    $("chainFinalXP").value = "";
    $("chainFinalCoins").value = "";
    if (stepsHost) stepsHost.innerHTML = "";
    addChainStepRow();

    creator?.classList.add("hidden");
    showSystemMessage("CHAIN CREATED", "success");
  });

  $("resetBtn")?.addEventListener("click", () => {
    if (confirm("RESET ALL PROGRESS?")) {
      level = 1; xp = 0; rank = "E";
      stats = structuredClone(DEFAULT_STATS);
      habits = [];
      localStorage.clear();
      location.reload();
    }
  });


  // 🔁 Change glow when difficulty changes
  $("protectionDifficulty")?.addEventListener("change", e => {
    const rarityMap = {
      easy: "common",
      normal: "uncommon",
      hard: "rare",
      extreme: "legendary"
    };

    const labelMap = {
      easy: "COMMON",
      normal: "UNCOMMON",
      hard: "RARE",
      extreme: "LEGENDARY"
    };

    const card = $("safeguardCard");
    if (!card) return;

    card.classList.remove("common", "uncommon", "rare", "legendary");
    card.classList.add(rarityMap[e.target.value]);
    $("sg-rarity").textContent = labelMap[e.target.value];
  });

  // 🔥 INITIALIZE GLOW ON PAGE LOAD (THIS WAS MISSING)
  const diffSelect = $("protectionDifficulty");
  const card = $("safeguardCard");

  if (diffSelect && card) {
    const rarityMap = {
      easy: "common",
      normal: "uncommon",
      hard: "rare",
      extreme: "legendary"
    };

    const labelMap = {
      easy: "COMMON",
      normal: "UNCOMMON",
      hard: "RARE",
      extreme: "LEGENDARY"
    };

    card.classList.add(rarityMap[diffSelect.value]);
    $("sg-rarity").textContent = labelMap[diffSelect.value];
  }


  $("systemCancelBtn")?.addEventListener("click", () => {
    $("systemWarningModal").classList.add("hidden");
    pendingAuthorityAction = null;
  });

  $("systemConfirmBtn")?.addEventListener("click", () => {
    $("systemWarningModal").classList.add("hidden");
    pendingAuthorityAction?.();
    pendingAuthorityAction = null;
  });

  updateUI();

  // 🔁 Keep streak quests in sync with the calendar
  setInterval(() => {
    renderHabits();
    renderChains();
    renderStreaks();
  }, 60 * 1000);

});
