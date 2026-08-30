/* =====================================================================
 * GeoStudy AI · 主程序（配置驱动引擎）
 * ---------------------------------------------------------------------
 * 全部内容来自 config.js（CONFIG）。本文件只负责：路由 / 渲染 / 交互 /
 * 容错 / 离线降级。改文案请改 config.js，不要在本文件里写死字符串。
 * ===================================================================== */
(function () {
  "use strict";

  const NAV = CONFIG.nav;
  const S = { route: location.hash.slice(1) || "home", generated: false, logs: [] };

  /* ---------- 工具 ---------- */
  const el = (s) => document.querySelector(s);
  const pct = (n) => `<div class="meter"><i style="width:${n}%"></i></div>`;
  const esc = (s) => String(s).replace(/[<>]/g, "");

  /* ---------- 本地存储（全程 try/catch 容错） ---------- */
  const STORE = "geostudy-course-learning-v2";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (_) {}
  S.generated = Boolean(saved.coursePlanGenerated);
  S.logs = Array.isArray(saved.logs) ? saved.logs : [];
  function persist(patch) {
    try {
      saved = Object.assign(saved, patch, { updatedAt: new Date().toISOString() });
      localStorage.setItem(STORE, JSON.stringify(saved));
    } catch (_) {}
  }

  /* ---------- 全局错误兜底：单点出错不白屏 ---------- */
  window.addEventListener("error", (e) => {
    console.error("GeoStudy runtime error:", e.error || e.message);
    const app = el("#app");
    if (app && !app.dataset.errored) {
      app.dataset.errored = "1";
      toast("页面发生小错误，已记录到控制台；其余功能仍可正常使用。");
    }
  });

  function toast(msg) {
    let t = el("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.style.cssText =
        "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#0a1530;border:1px solid #51e9eb66;color:#cfefff;padding:10px 16px;border-radius:8px;font-size:12px;z-index:99;opacity:0;transition:opacity .25s;max-width:80vw;text-align:center";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(() => (t.style.opacity = "0"), 2000);
  }

  function downloadBlob(content, type, name) {
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([content], { type }));
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 0);
    } catch (e) { console.error(e); toast("导出失败，请检查浏览器下载权限"); }
  }

  /* ---------- 外壳 ---------- */
  function shell(body) {
    const m = CONFIG.meta;
    const routeName = (NAV.find((x) => x[0] === S.route) || [, m.brand])[1];
    return `<div class="static"><aside><a class="logo" href="#home"><i>G</i><b>GeoStudy <em>AI</em></b></a><div class="sys"><i></i> ${m.systemName} <b>${m.version}</b></div><nav>${NAV.map(
      (x) => `<a href="#${x[0]}" class="${S.route === x[0] ? "on" : ""}"><i>${x[2]}</i><span>${x[1]}</span></a>`
    ).join("")}</nav><div class="user"><i>${m.learner.initials}</i><p><b>${m.learner.name}</b><small>${m.learner.sub}</small><em>${m.growth.label}　${m.growth.value}</em><span><u></u></span></p></div></aside><div class="screen"><header><span>${m.brand}　/　${routeName}</span><div class="live"><i></i> ${m.liveText}</div><div><button onclick="location.hash='dashboard'">${m.headerBtn}</button><button>◴</button></div></header>${body}</div></div>`;
  }

  const title = (k, t, d, a = "") =>
    `<div class="title"><p><label>━ ${k}</label><b>${t}</b><span>${d}</span></p>${a}</div>`;

  /* ---------- 首页：课程驾驶舱 ---------- */
  function home() {
    const h = CONFIG.home, c = h.copy, o = h.orchestrator, pl = o.projectLive;
    const ev = c.evidence
      .map((e) => `<a href="#proof" onclick="sessionStorage.setItem('proofTab','${e.tab}')">${e.text}</a>`)
      .join("");
    const agents = o.agentFlow
      .map(
        (x, i) =>
          `<button onclick="runAgent(${i},this)"><i>${i + 1}</i><span><b>${x.name}</b><small>${x.sub}</small></span><em>${x.status}</em></button>`
      )
      .join("");
    const stats = h.liveStats
      .map(
        (x, i) =>
          `<article><i>0${i + 1}</i><p><small>${x.label}</small><b class="counter" data-target="${x.value}">0</b><em>${x.delta}</em></p></article>`
      )
      .join("");
    const loop = h.loop
      .map(
        (x, i) =>
          `<article><i>0${i + 1}</i><p><b>${x.topic}</b><small>${x.agent} · ${x.meta}</small></p></article>`
      )
      .join("");
    return `<section class="hero cockpit os-home"><canvas id="globe"></canvas><div id="cesiumContainer" aria-label="Cesium数字地球"></div><div class="streams"><i></i><i></i><i></i></div><div class="space-hud"><span>● ${h.hud.label}</span><b>${h.hud.coord}</b><div><i>${h.hud.items.join("</i><i>")}</i></div></div><div class="copy"><label>${c.label}</label><h1>GeoStudy <i>AI</i></h1><h2>${c.h2}</h2><p>${c.p}</p><div class="ctas"><a href="${c.cta1.href}">${c.cta1.text}</a><a href="${c.cta2.href}">${c.cta2.text}</a></div><div class="evidence">${ev}</div></div><section class="assistant orchestrator"><div class="a-head"><i>✦</i><p><b>${o.title}</b><small>${o.status}</small></p><em>${o.agentsText}</em></div><div class="agent-flow clickable">${agents}</div><div id="miniConsole" class="mini-console"><p><i></i><span>${o.miniConsole}</span><b>刚刚</b></p></div><div class="bubble project-live"><b>${pl.title}</b><p><span>${pl.stage}</span><span>${pl.pctText}</span></p><div class="meter"><i style="width:${pl.pct}%"></i></div><small>${pl.loaded}</small></div><button onclick="location.hash='task'">继续执行本周任务　→</button></section></section><section class="live-stats">${stats}</section><section class="loop-wrap"><div class="title"><p><label>━ TODAY'S LEARNING</label><b>今日学习闭环</b><span>每一步都有输入、AI调用、过程证据与输出成果</span></p></div><div class="loop">${loop}</div></section></section>`;
  }

  window.runAgent = (i, button) => {
    document.querySelectorAll(".agent-flow button").forEach((x) => x.classList.remove("running"));
    button.classList.add("running");
    const names = CONFIG.home.orchestrator.agentFlow.map((a) => a.name);
    const steps = [
      ["读取学生画像", "查询GIS能力模型", "输出五维画像"],
      ["读取能力差距", "检索GIS知识库", "匹配项目模板", "生成12周路线"],
      ["读取课程配置", "检索Cesium案例", "生成诊断路径"],
      ["读取成果清单", "执行规范检查", "生成五维评价"],
      ["汇总过程证据", "映射职业能力", "更新成长档案"]
    ];
    const c = el("#miniConsole"), n = 0;
    c.innerHTML = "";
    const t = setInterval(() => {
      if (n < steps[i].length) {
        c.insertAdjacentHTML("beforeend", `<p><i></i><span>${names[i]} · ${steps[i][n]}</span><b>${180 + n * 97}ms</b></p>`);
        c.scrollTop = c.scrollHeight; n++;
      } else {
        clearInterval(t); button.classList.remove("running");
        c.insertAdjacentHTML("beforeend", `<p class="done"><i></i><span>${names[i]} 运行完成</span><b>✓</b></p>`);
      }
    }, 350);
  };

  function animateCounters() {
    document.querySelectorAll(".counter").forEach((e) => {
      const target = +e.dataset.target, n = 0, step = Math.max(1, Math.ceil(target / 45));
      const timer = setInterval(() => {
        const v = Math.min(target, n + step); e.textContent = v.toLocaleString(); n = v;
        if (n >= target) clearInterval(timer);
      }, 28);
    });
  }

  /* ---------- 任务工作流：个人课程学习路线 ---------- */
  function task() {
    const T = CONFIG.task;
    const cc = T.courseCard;
    const courseCard = `<section class="input-card" style="margin-bottom:14px"><div class="card-label"><i>00</i><p><b>课程中心 · ${cc.course}</b><small>${cc.sub}</small></p></div><div class="formgrid"><label>课程简介<textarea readonly style="height:72px">${cc.intro}</textarea></label><label>核心技术<textarea readonly style="height:72px">${cc.tech}</textarea></label></div><div class="input-foot"><span>${cc.weekText}</span><button class="primary" onclick="joinCourse()">${cc.joinedText}</button></div></section>`;
    const workflow = T.workflow.map((w, i) => `<i class="${i === 0 ? "active" : ""}">${i + 1}<span>${w}</span></i>${i < T.workflow.length - 1 ? "<b></b>" : ""}`).join("");
    const levels = T.levels
      .map((x, i) => `<label><input type="checkbox" ${T.levelsChecked.includes(i) ? "checked" : ""}>${x}</label>`)
      .join("");
    const body = `<div class="page taskv2">${title(T.title.k, T.title.t, T.title.d, `<em>${T.title.a}</em>`)}${courseCard}<div class="workflow">${workflow}</div><section class="input-card"><div class="card-label"><i>01</i><p><b>学生基础与课程目标</b><small>信息可按实际情况修改，生成后仍可调整个人学习路线</small></p></div><label>学习目标<textarea id="goal">${T.goal}</textarea></label><div class="formgrid"><label>专业方向<select id="major">${T.majors.map((m) => `<option>${m}</option>`).join("")}</select></label><label>计划周期<select id="dur">${T.durations.map((d) => `<option>${d}</option>`).join("")}</select></label></div><div class="level"><span>当前能力（可多选）</span>${levels}</div><div class="input-foot"><span>${T.privacy}</span><button class="primary" onclick="runAgents()">${T.generateBtn}</button></div></section><div id="agentResult">${S.generated ? taskResult() : emptyTask()}</div></div>`;
    return body;
  }

  function emptyTask() {
    return `<section class="empty-result"><i>⌁</i><h3>${CONFIG.task.emptyTitle}</h3><p>${CONFIG.task.emptyDesc}</p></section>`;
  }

  window.joinCourse = () => { persist({ courseJoined: true }); location.hash = "progress"; };

  window.runAgents = () => {
    const box = el("#agentResult");
    box.innerHTML = `<section class="agent-console"><header><b>AI 正在分析...</b><span id="runpct">0%</span></header><div class="scan"><i></i></div><div id="calls"></div></section>`;
    const calls = [
      ["学习基础分析", "解析目标与已有能力"],
      ["GIS知识库", "检索空间数据工程知识点"],
      ["Cesium案例库", "匹配数字孪生项目模板"],
      ["学习路径模型", "计算12周任务依赖"],
      ["评价量规模型", "生成成果验收标准"]
    ];
    let i = 0;
    const t = setInterval(() => {
      if (i < calls.length) {
        el("#calls").insertAdjacentHTML("beforeend", `<p><i>✓</i><span>${calls[i][0]}</span><em>${calls[i][1]}</em><b>${120 + i * 83}ms</b></p>`);
        el("#runpct").textContent = (i + 1) * 20 + "%"; i++;
      } else {
        clearInterval(t); S.generated = true; persist({ coursePlanGenerated: true });
        box.innerHTML = taskResult();
        document.querySelectorAll(".workflow i").forEach((x) => x.classList.add("active"));
      }
    }, 420);
  };

  function taskResult() {
    const T = CONFIG.task;
    const stages = T.stages
      .map((d) => {
        const pitfalls = d.pitfalls.map((p) => `<div class="reason"><em>⚠</em><p><b>${p.t}</b><span>${p.d}</span></p></div>`).join("");
        const exps = d.expansions.map((x) => `<li>${x}</li>`).join("");
        return `<article><div class="stage-head"><strong>${d.no}</strong><p><small>${d.weeks}</small><b>${d.title}</b></p><em>阶段 ${d.no}</em></div><section><label>学习与实验任务</label>${d.tasks
          .map((t, i) => `<p><i>${i + 1}</i>${t}</p>`)
          .join("")}<label>知识与工具</label><div class="tags">${d.tools.map((t) => `<span>${t}</span>`).join("")}</div><div class="enrich"><div class="enrich-col"><label>◆ 实操经验</label><p>${d.experience}</p></div><div class="enrich-col"><label>⚠ 避坑指南</label>${pitfalls}</div><div class="enrich-col"><label>✦ 拓展知识点</label><ul>${exps}</ul></div></div><footer>◆　<span><small>课程阶段成果</small><b>${d.artifact}</b></span></footer></section></article>`;
      })
      .join("");
    const radar = T.radar.map((x) => `<p><span>${x.name}</span><b>${x.pct}%</b>${pct(x.pct)}</p>`).join("");
    const gapItems = T.gap.items.map((x) => `<p><small>${x.k}</small><b>${x.v}</b></p>`).join("");
    const sources = T.gap.sources.map((s) => `<span>${s}</span>`).join("");
    const rubric = T.rubric.map((x) => `<b>${x.label} ${x.weight}%</b>`).join("");
    return `<section class="result-head"><div><label>COURSE PATH · ID ${T.traceId}</label><h2>${T.courseCard.course}个人学习任务包</h2><p>生成依据：${T.traceDesc}</p></div><div class="result-actions"><button onclick="downloadPlan()">⇩ 导出任务包 JSON</button><button onclick="downloadPlanMd()">⇩ 导出 Markdown</button></div></section><div class="analysis-grid"><section class="radar-card"><div class="boxhead"><i>◎</i><p><small>LEARNING PROFILE</small><b>入课基础诊断</b></p></div><div class="skill-radar"><div class="pentagon"><i></i></div>${radar}</div></section><section class="gap-card"><div class="boxhead"><i>⌁</i><p><small>LEARNING GAP</small><b>基础差距与调整建议</b></p></div><div class="job"><span>课程目标</span><b>${T.gap.target}</b><em>${T.gap.matchText}</em></div>${gapItems}<div class="sources"><b>本次使用的课程依据</b>${sources}</div></section></div><div class="stages v2">${stages}</div><section class="rubric"><div><small>课程学习评价量规</small>${rubric}</div><button onclick="location.hash='progress'">进入课程学习与记录　→</button></section>`;
  }

  window.downloadPlan = () => {
    const T = CONFIG.task;
    const data = {
      course_id: "GS-WEBGIS-001",
      course_name: T.courseCard.course,
      goal: el("#goal")?.value || T.goal,
      duration_weeks: 12,
      profile: T.radar.reduce((o, x) => ((o[x.name] = x.pct), o), {}),
      stages: T.stages.map((d) => ({
        phase: d.no, weeks: d.weeks, title: d.title, tasks: d.tasks, tools: d.tools,
        artifact: d.artifact, experience: d.experience, pitfalls: d.pitfalls, expansions: d.expansions
      })),
      rubric: T.rubric,
      final_artifact: "校园数字孪生可视化系统"
    };
    downloadBlob(JSON.stringify(data, null, 2), "application/json", T.exportName + ".json");
    toast("已导出任务包 JSON");
  };

  window.downloadPlanMd = () => {
    const T = CONFIG.task;
    let md = `# ${T.courseCard.course} 个人学习任务包\n\n> 生成依据：${T.traceDesc}\n\n## 入课基础诊断\n`;
    T.radar.forEach((x) => (md += `- ${x.name}：${x.pct}%\n`));
    md += `\n## 基础差距\n- 课程目标：${T.gap.target}\n- ${T.gap.matchText}\n` + T.gap.items.map((i) => `- ${i.k}：${i.v}`).join("\n") + `\n\n`;
    T.stages.forEach((d) => {
      md += `## 阶段 ${d.no}（${d.weeks}）${d.title}\n\n### 学习与实验任务\n` + d.tasks.map((t, i) => `${i + 1}. ${t}`).join("\n") +
        `\n\n### 知识与工具\n${d.tools.join("、")}\n\n### ◆ 实操经验\n${d.experience}\n\n### ⚠ 避坑指南\n` +
        d.pitfalls.map((p) => `- **${p.t}**：${p.d}`).join("\n") + `\n\n### ✦ 拓展知识点\n` +
        d.expansions.map((x) => `- ${x}`).join("\n") + `\n\n### 课程阶段成果\n${d.artifact}\n\n`;
    });
    md += `## 课程学习评价量规\n` + T.rubric.map((x) => `- ${x.label}：${x.weight}%`).join("\n") + `\n`;
    downloadBlob(md, "text/markdown", T.exportName + ".md");
    toast("已导出任务包 Markdown");
  };

  /* ---------- GIS专家 / 课程导师 ---------- */
  function pickTopic(text) {
    const km = CONFIG.mentor.keywordMap;
    const lower = (text || "").toLowerCase();
    for (const key in km) if (km[key].some((w) => lower.includes(w.toLowerCase()))) return key;
    return "default";
  }

  function mentorAnswerHTML(key) {
    const topic = CONFIG.mentor.topics[key] || CONFIG.mentor.topics.default;
    const op = key === "coordinate" ? "≠" : "→";
    return `<div class="answer expert"><i>✦</i><section><small>GeoStudy课程导师 · 已读取课程、章节、实验与薄弱点 · 1.42s</small><p>我结合当前课程上下文，给出知识定位与分步检查建议，不直接代做。</p><div class="diagnosis"><header><span>${topic.badge}</span><b>${topic.assoc}</b></header><div><p><small>${topic.from.small}</small><b>${topic.from.b}</b></p><i>${op}</i><p><small>${topic.to.small}</small><b>${topic.to.b}</b></p></div><footer>${topic.footer}</footer></div>${topic.reasons
      .map((x) => `<div class="reason"><em>${x.no}</em><p><b>${x.title}</b><span>${x.desc}</span></p></div>`)
      .join("")}<div class="code"><header><span>${topic.code.label}</span><button onclick="copyCode(this)">复制</button></header><pre>${esc(topic.code.body)}</pre></div><div class="mentor-rule"><b>${topic.rule.title}</b><span>${topic.rule.body}</span></div></section></div>`;
  }

  function mentor() {
    const M = CONFIG.mentor, ctx = M.contextCard, ch = M.chat;
    const tree = M.projectTree.items
      .map((x, i) => `<p class="${x.state === "●" ? "active" : ""}"><i>${x.state}</i><span>${x.name}</span><b>${x.pct}</b></p>`)
      .join("");
    const ctxItems = ctx.items
      .map((x) => `<p><span>${x.label}</span><b class="${x.warn ? "warn" : ""}">${x.value}</b></p>`)
      .join("");
    const files = M.files.map((f) => `<p>▤ ${f}</p>`).join("");
    return `<div class="mentor v2"><aside><div class="mentorbrand"><i>◇</i><p><b>${M.brand.name}</b><small>${M.brand.status}</small></p></div><div class="project-tree"><label>当前课程</label><h3>${M.projectTree.course}</h3>${tree}</div><section class="context-card"><small>${ctx.title}</small>${ctxItems}</section><section class="files"><small>关联课程资料</small>${files}</section></aside><div class="chat"><header><p><b>${ch.headerTitle}</b><small>${ch.headerSub}</small></p><div><span>${ch.ctxText}</span><button onclick="location.hash='dashboard'">${ch.ctxBtn}</button></div></header><div class="messages" id="messages"><div class="student"><i>${ch.studentName}</i><p><small>你 · 刚刚</small><span>${esc(M.demoQuestion)}</span></p></div>${mentorAnswerHTML(M.demoTopic)}</div><footer><div><textarea id="ask" placeholder="${ch.placeholder}"></textarea><p><span>＋ 关联代码　　AI 不会直接代做，将提供学习思路与检查路径</span><button onclick="sendMentor()">↑</button></p></div><small>${ch.footerNote}</small></footer></div></div>`;
  }

  window.copyCode = (b) => {
    const pre = b.closest(".code")?.querySelector("pre");
    const txt = pre ? pre.textContent : "";
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => (b.textContent = "已复制"), () => (b.textContent = "复制失败"));
    else b.textContent = "已复制";
  };
  /* ---------- 实时 AI：DeepSeek（经本地代理，前端不含密钥） ---------- */
  function buildMentorSystemPrompt() {
    const M = CONFIG.mentor, pt = M.projectTree, ctx = M.contextCard;
    const topics = Object.keys(M.topics)
      .map((k) => "- " + M.topics[k].assoc + "：" + M.topics[k].footer)
      .join("\n");
    return (
      "你是「" + M.brand.name + "」，高校 GIS / WebGIS 与三维可视化课程的 AI 学习导师，辅导学生《" +
      pt.course + "》。\n" +
      "当前学习上下文：" + ctx.items.map((i) => i.label + "＝" + (i.warn ? "（需注意）" : "") + i.value).join("；") + "。\n" +
      "关联课程资料：" + M.files.join("、") + "。\n" +
      "你已掌握的知识点与排查路径：\n" + topics + "\n" +
      "教学原则：不直接代做学生的代码或作业，而是提供知识定位、分步检查思路与学习路径；用中文、条理清晰，必要时给出可运行的小段示例与避坑提示。"
    );
  }

  async function askDeepSeek(question) {
    const d = CONFIG.mentor.deepseek;
    if (!d || !d.enabled) return null;
    const payload = {
      model: d.model || "deepseek-v4-flash",
      stream: false,
      temperature: 0.4,
      messages: [
        { role: "system", content: buildMentorSystemPrompt() },
        { role: "user", content: question }
      ]
    };
    let url, headers = { "Content-Type": "application/json" };
    if (d.proxyUrl) {
      url = d.proxyUrl;
    } else if (d.direct && d.directApiKey) {
      url = (d.baseUrl || "https://api.deepseek.com").replace(/\/$/, "") + "/chat/completions";
      headers["Authorization"] = "Bearer " + d.directApiKey;
    } else {
      return null;
    }
    let r;
    try {
      r = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(payload) });
    } catch (e) {
      throw new Error("network:" + (e && e.message));
    }
    if (!r.ok) throw new Error("DeepSeek HTTP " + r.status);
    const j = await r.json();
    return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
  }

  function mentorExpertHTML(text) {
    const html = esc(text).replace(/\n/g, "<br>");
    return (
      '<div class="answer expert"><i>✦</i><section><small>GeoStudy课程导师 · DeepSeek 实时回答 · ' +
      new Date().toLocaleTimeString("zh-CN") +
      "</small><p>" + html + "</p></section></div>"
    );
  }

  window.sendMentor = async () => {
    const a = el("#ask");
    if (!a || !a.value.trim()) return;
    const text = a.value;
    const msgs = el("#messages");
    msgs.insertAdjacentHTML(
      "beforeend",
      '<div class="student"><i>' + CONFIG.mentor.chat.studentName + '</i><p><small>你 · 刚刚</small><span>' + esc(text) + "</span></p></div>"
    );
    a.value = "";
    const id = "liveAns_" + Date.now();
    msgs.insertAdjacentHTML(
      "beforeend",
      '<div class="answer expert" id="' + id + '"><i>✦</i><section><small>GeoStudy课程导师 · 正在思考…</small><p>正在调用 DeepSeek 生成回答</p></section></div>'
    );
    msgs.scrollTop = msgs.scrollHeight;
    const box = el("#" + id);
    try {
      const ans = await askDeepSeek(text);
      if (!ans) throw new Error("empty");
      if (box) box.outerHTML = mentorExpertHTML(ans);
    } catch (e) {
      if (box) box.outerHTML = mentorAnswerHTML(pickTopic(text));
      toast("实时 AI 暂不可用，已切换为本地知识库回答");
    }
  };

  /* ---------- AI学习控制台 ---------- */
  function dashboard() {
    const D = CONFIG.dashboard;
    const arch = D.agents
      .map(
        (a, i) =>
          `<article><i>${i + 1}</i><h3>${a.name}</h3><span class="${a.status === "运行中" ? "running" : ""}">● ${a.status}</span><p>${a.sub}</p><button onclick="showTrace(${i})">查看证据</button></article>`
      )
      .join("");
    const res = D.architecture.resourceNode.items.map((x) => `<span>${x}</span>`).join("");
    return `<div class="page">${title(D.title.k, D.title.t, D.title.d, `<em>${D.title.a}</em>`)}<div class="agent-architecture"><div class="student-node">${D.architecture.userNode.label}<br><b>${D.architecture.userNode.value}</b></div><div class="agent-line">${arch}</div><div class="resource-node"><b>${D.architecture.resourceNode.title}</b>${res}</div></div><section class="trace"><header><b>Agent 调用记录</b><span>${D.traceHeader}</span></header><div id="tracebody">${trace(0)}</div></section></div>`;
  }
  const traces = CONFIG.dashboard.traces;
  function trace(i) { return traces[i].map((x, j) => `<p><i>0${j + 1}</i><span>${x}</span></p>`).join(""); }
  window.showTrace = (i) => { const b = el("#tracebody"); if (b) b.innerHTML = trace(i); };

  /* ---------- 学习记录 ---------- */
  function progress() {
    const P = CONFIG.progress;
    const taskRows = P.taskBoard
      .map((x) => `<div class="task-row"><i></i><p><b>${x.name}</b><small>${x.sub}</small></p><span>${x.status}</span></div>`)
      .join("");
    const recentLogs = S.logs.slice(-5).reverse().map((l) => `<div class="log-row"><i>${l.time}</i><p><b>${esc(l.title)}</b><small>本地学习记录 · 已保存</small></p></div>`).join("");
    const seedLogs = P.logs
      .map((x) => `<div class="log-row"><i>${x.time}</i><p><b>${x.name}</b><small>${x.sub}</small></p></div>`)
      .join("");
    const stats = P.stats.map((x) => `<article><small>${x.label}</small><b>${x.value}</b></article>`).join("");
    const heat = Array.from({ length: P.heatmapDays }, (_, i) => `<i class="l${(i * 7 + i % 5) % 5}" title="第${i + 1}天"></i>`).join("");
    return `<div class="page">${title(P.title.k, P.title.t, P.title.d, `<button class="ghost" onclick="addLog()">${P.title.action}</button>`)}<div class="progress-top"><section><small>当前课程</small><h2>${P.course} · 第 6 周</h2>${pct(P.pct)}<p><span>${P.tasksDone} / ${P.tasksTotal} 任务完成</span><b>${P.pctText}</b></p></section>${stats}</div><section class="heat-card"><header><div><small>LEARNING HEATMAP</small><h3>学习贡献热力图</h3></div><span>过去12周 · 共 48.6 小时</span></header><div class="heatmap">${heat}</div><footer>少　<i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i>　多</footer></section><div class="evidence-grid"><section><div class="boxhead"><i>✓</i><p><small>TASK BOARD</small><b>本周任务</b></p></div>${taskRows}</section><section><div class="boxhead"><i>▤</i><p><small>EVIDENCE LOG</small><b>最近过程证据</b></p></div><div id="logs">${recentLogs || seedLogs}</div></section></div></div>`;
  }
  window.addLog = () => {
    const logs = Array.isArray(saved.logs) ? saved.logs : [];
    const row = { time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), title: CONFIG.progress.addLogName };
    logs.push(row);
    persist({ logs: logs.slice(-20) });
    S.logs = logs;
    const box = el("#logs");
    if (box) box.insertAdjacentHTML("afterbegin", `<div class="log-row"><i>刚刚</i><p><b>${CONFIG.progress.addLogName}</b><small>本地学习记录 · 已保存</small></p></div>`);
  };

  /* ---------- 课程成果：上传与检测 ---------- */
  function upload() {
    const U = CONFIG.upload;
    const pipeline = U.pipeline.map((x) => `<article><i>${x.no}</i><b>${x.name}</b><small>${x.desc}</small></article>`).join("");
    return `<div class="page">${title(U.title.k, U.title.t, U.title.d, `<em>${U.title.a}</em>`)}<section class="drop" id="drop"><input id="file" type="file" multiple accept="${U.accept}" onchange="inspectFiles(this.files)"><i>⇧</i><h3>${U.dropTitle}</h3><p>${U.dropDesc}</p><span>${U.dropNote}</span></section><div class="pipeline">${pipeline}</div><section id="inspection" class="inspection"><div class="empty-result"><i>⌁</i><h3>${U.emptyTitle}</h3><p>${U.emptyDesc}</p><button class="primary" onclick="demoInspect()">${U.demoText}</button></div></section></div>`;
  }
  window.inspectFiles = (fs) => inspect([...fs].map((f) => [f.name, (f.size / 1024).toFixed(1) + " KB"]));
  window.demoInspect = () => inspect(CONFIG.upload.demoFiles);

  function inspect(files) {
    const U = CONFIG.upload, box = el("#inspection");
    box.innerHTML = `<div class="inspect-run"><b>成果评价Agent 正在检测 ${files.length} 个文件...</b><div class="scan"><i></i></div></div>`;
    setTimeout(() => {
      const list = files.map((f, i) => `<p><i>${["ZIP", "GEO", "GLB", "MD"][i] || "FILE"}</i><span><b>${esc(f[0])}</b><small>${f[1]}</small></span><em>✓ 格式有效</em></p>`).join("");
      const checks = U.checks.map((x) => `<article><i>✓</i><p><b>${x.name}</b><small>${x.desc}</small></p><span>${x.status}</span></article>`).join("");
      box.innerHTML = `<div class="file-list">${list}</div><div class="checks">${checks}<button onclick="location.hash='evaluation'">${U.inspectBtn}</button></div>`;
    }, 1100);
  }

  /* ---------- 课程能力评价 ---------- */
  function evaluation() {
    const E = CONFIG.evaluation;
    const scores = E.scores.map((x) => `<div class="score-row"><p><b>${x.name}</b><small>${x.desc}</small></p><span>${x.pct}</span>${pct(x.pct)}</div>`).join("");
    const adv = E.improvements.map((x) => `<div class="advice"><i>${x.p}</i><p><b>${x.title}</b><small>${x.desc}</small></p></div>`).join("");
    const flags = E.scoreFlags.map((f) => `<span>${f}</span>`).join("");
    return `<div class="page">${title(E.title.k, E.title.t, E.title.d, `<em>${E.title.a}</em>`)}<div class="score-hero"><div class="score-ring"><b>${E.score}</b><span>${E.scoreLabel}</span><small>${E.scoreLevel}</small></div><div><label>${E.courseTag}</label><h2>${E.scoreDesc}</h2><p>${E.evalTime}</p><div>${flags}</div></div></div><div class="evaluation-grid"><section><div class="boxhead"><i>◎</i><p><small>FIVE-DIMENSION RUBRIC</small><b>课程五维评分</b></p></div>${scores}</section><section><div class="boxhead"><i>✦</i><p><small>NEXT LEARNING PLAN</small><b>证据化改进建议</b></p></div>${adv}<button onclick="location.hash='archive'">${E.nextBtn}</button></section></div><section class="eval-note"><b>${E.note}</b><span>${E.noteText}</span></section></div>`;
  }

  /* ---------- GIS学习集市 ---------- */
  function market() {
    const M = CONFIG.market;
    const filters = M.filters.map((f, i) => `<button class="${i === 0 ? "on" : ""}" data-f="${f}" onclick="marketFilter(this)">${f}</button>`).join("");
    const items = M.items
      .map((x, i) => `<article data-text="${(x.title + x.desc + x.tag).toLowerCase()}"><div class="cover c${i}"><span>${x.tag}</span><i>${["◫", "◎", "▧", "⌁"][i]}</i></div><section><small>${x.type}　·　来源已核验</small><h3>${x.title}</h3><p>${x.desc}</p><footer><span>☆ ${x.stars} 收藏</span><button onclick="marketOpen(this)">查看资源 →</button></footer></section></article>`)
      .join("");
    return `<div class="page">${title(M.title.k, M.title.t, M.title.d, `<button class="ghost" onclick="toast('发布功能需接入资源服务')">${M.title.action}</button>`)}<div class="market-filter">${filters}<input id="marketSearch" placeholder="${M.searchPlaceholder}" oninput="marketSearch(this.value)"></div><div class="market-grid" id="marketGrid">${items}</div><section class="source-rule"><b>${M.sourceRuleTitle}</b>${M.sourceRules.map((s) => `<span>${s}</span>`).join("")}</section></div>`;
  }
  window.marketFilter = (btn) => {
    const f = btn.dataset.f;
    document.querySelectorAll(".market-filter button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    const kw = f.replace("课程", "").replace("优秀", "");
    document.querySelectorAll("#marketGrid article").forEach((a) => {
      a.style.display = f === "为你推荐" || a.dataset.text.includes(kw) ? "" : "none";
    });
  };
  window.marketSearch = (q) => {
    const kw = (q || "").toLowerCase();
    document.querySelectorAll("#marketGrid article").forEach((a) => {
      a.style.display = !kw || a.dataset.text.includes(kw) ? "" : "none";
    });
  };
  window.marketOpen = () => toast("示例资源仅作演示，接入资源服务后可查看完整内容");

  /* ---------- 专业能力成长档案 ---------- */
  function archive() {
    const A = CONFIG.archive, p = A.profile;
    const career = A.careerPath
      .map((x, i) => `<article class="${i === 2 ? "now" : ""}"><i>${i < 2 ? "✓" : i === 2 ? "●" : "○"}</i><p><b>${x.name}</b><small>${x.records}</small></p><span>${x.status}</span></article>`)
      .join("");
    const cap = A.capability.map((x) => `<div class="archive-skill"><p><b>${x.name}</b><span>${x.records}项学习记录</span></p>${pct(x.pct)}<em>${x.pct}%</em></div>`).join("");
    const ms = A.milestones.map((x) => `<article><i></i><time>${x.date}</time><p><b>${x.title}</b><small>${x.ref}</small></p></article>`).join("");
    return `<div class="page">${title(A.title.k, A.title.t, A.title.d, `<button class="ghost" onclick="window.print()">${A.title.action}</button>`)}<div class="profile-hero"><div class="profile-avatar">${p.id.slice(-3)}</div><div><small>${p.idLabel} · ${p.id}</small><h2>${p.name}</h2><p>${p.sub}</p><span>${p.course}</span></div><div class="profile-score"><b>${p.pct}</b><small>${p.pctLabel}</small></div></div><div class="archive-grid"><section><div class="boxhead"><i>◇</i><p><small>COURSE LEARNING PATH</small><b>课程能力成长路线</b></p></div><div class="career-path">${career}</div></section><section><div class="boxhead"><i>◎</i><p><small>PROFESSIONAL CAPABILITY</small><b>专业能力成长</b></p></div>${cap}</section></div><section class="milestones"><header><div><small>GROWTH MILESTONES</small><h3>${A.milestonesTitle}</h3></div><span>${A.milestonesSub}</span></header><div>${ms}</div></section></div>`;
  }

  /* ---------- 产品与数据说明 ---------- */
  function proof() {
    const P = CONFIG.proof;
    const tab = sessionStorage.getItem("proofTab") || "prompt";
    const tabs = P.tabs.map((t) => `<button class="${t.id === tab ? "on" : ""}" onclick="switchProof('${t.id}')">${t.label}</button>`).join("");
    const panel = P.panels[tab];
    let body = "";
    if (tab === "prompt") {
      body = `<header><div><small>AI CALL & PROMPT EVIDENCE</small><h3>${panel.head}</h3></div><span>${panel.sub}</span></header>${panel.rows
        .map((r) => `<article><i>${r.id}</i><p><b>${r.name}</b><small>${r.meta}</small><code>${r.prompt}</code></p><span>✓ ${r.status}</span></article>`)
        .join("")}<div class="proof-note">${panel.note}</div>`;
    } else if (tab === "test") {
      body = `<header><div><small>TEST EXECUTION RECORD</small><h3>${panel.head}</h3></div><span>${panel.sub}</span></header><div class="test-summary"><b>${panel.summary}</b><span>${panel.summaryDesc}</span></div>${panel.rows
        .map((r) => `<article><i>${r.id}</i><p><b>${r.name}</b><small>${r.meta}</small></p><span>✓ ${r.status}</span></article>`)
        .join("")}`;
    } else if (tab === "data") {
      body = `<header><div><small>DATA PROVENANCE</small><h3>${panel.head}</h3></div><span>${panel.sub}</span></header>${panel.rows
        .map((r) => `<article><i>${r.id}</i><p><b>${r.name}</b><small>${r.meta}</small><code>${r.code}</code></p><span>${r.status}</span></article>`)
        .join("")}`;
    } else {
      body = `<header><div><small>AI & DATA COMPLIANCE</small><h3>${panel.head}</h3></div><span>${panel.sub}</span></header>${panel.rows
        .map((r) => `<article><i>${r.id}</i><p><b>${r.name}　${r.desc}</b></p><span>✓ 通过</span></article>`)
        .join("")}`;
    }
    return `<div class="page">${title(P.title.k, P.title.t, P.title.d, `<button class="ghost" onclick="window.print()">打印说明</button>`)}<div class="proof-tabs">${tabs}</div><section class="proof-panel">${body}</section></div>`;
  }
  window.switchProof = (t) => { sessionStorage.setItem("proofTab", t); render(); };
  window.printProof = () => window.print();

  /* ---------- Cesium（可选增强，离线降级） ---------- */
  function initCesium() {
    const box = el("#cesiumContainer");
    if (!box) return;
    if (!window.Cesium) { box.dataset.offline = "1"; return; }
    if (box.querySelector(".cesium-viewer")) return;
    try {
      const v = new Cesium.Viewer(box, {
        baseLayer: false, geocoder: false, homeButton: false, sceneModePicker: false, baseLayerPicker: false,
        navigationHelpButton: false, animation: false, timeline: false, fullscreenButton: false, infoBox: false,
        selectionIndicator: false, skyBox: false, skyAtmosphere: false
      });
      v.scene.globe.baseColor = Cesium.Color.fromCssColorString("#071a38");
      v.scene.backgroundColor = Cesium.Color.TRANSPARENT;
      v.scene.globe.enableLighting = true;
      v.scene.globe.showGroundAtmosphere = true;
      v.scene.screenSpaceCameraController.enableZoom = false;
      [["116.391", "39.900", "GIS实验楼"], ["116.393", "39.901", "图书馆"], ["116.389", "39.902", "空间中心"]].forEach((p) =>
        v.entities.add({
          position: Cesium.Cartesian3.fromDegrees(+p[0], +p[1], 120),
          point: { pixelSize: 8, color: Cesium.Color.CYAN, outlineColor: Cesium.Color.WHITE, outlineWidth: 1 },
          label: { text: p[2], font: "11px sans-serif", fillColor: Cesium.Color.CYAN, pixelOffset: new Cesium.Cartesian2(0, -18), showBackground: true, backgroundColor: Cesium.Color.fromCssColorString("#071027cc") }
        })
      );
      v.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(116.391, 39.900, 14500000), duration: 0 });
      const h = 0.0008;
      v.clock.onTick.addEventListener(() => v.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -h));
      box.classList.add("ready");
    } catch (e) { console.warn("Cesium init failed, fallback to canvas globe", e); box.dataset.offline = "1"; }
  }

  /* ---------- Canvas 自转地球（默认，离线可用） ---------- */
  function drawGlobe() {
    const c = el("#globe");
    if (!c) return;
    const ctx = c.getContext("2d");
    let w = 0, h = 0, R = 0, cx = 0, cy = 0, rot = -0.55, raf, texReady = false;
    const tex = new Image();
    tex.decoding = "async";
    tex.onload = () => (texReady = true);
    tex.src = "./assets/earth-equirect.webp";
    const rand = (a, b) => a + Math.random() * (b - a), rad = (d) => (d * Math.PI) / 180;
    const land = [];
    const regions = [[-100, 42, 48, 29, 360], [-62, -16, 25, 37, 180], [84, 40, 62, 28, 460], [22, 2, 31, 37, 230], [134, -25, 22, 13, 100], [5, 54, 22, 14, 110]];
    regions.forEach(([lo, la, rx, ry, n]) => { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, q = Math.sqrt(Math.random()); const lon = lo + Math.cos(a) * rx * q, lat = la + Math.sin(a) * ry * q; if (lat > -58 && lat < 76) land.push([rad(lon), rad(lat), Math.random()]); } });
    const cities = [[116, 40], [121, 31], [139, 36], [103, 1], [77, 29], [37, 56], [2, 49], [-74, 41], [-118, 34], [-47, -23], [151, -34], [18, -34]].map((p) => p.map(rad));
    const arcs = [[0, 2], [0, 4], [0, 5], [0, 7], [2, 10], [5, 7], [4, 9], [1, 11]];
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: rand(0.3, 1.5), a: rand(0.15, 0.8), s: rand(0.002, 0.009) }));
    function resize() { const d = Math.min(devicePixelRatio || 1, 2); w = c.width = c.clientWidth * d; h = c.height = c.clientHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); w /= d; h /= d; R = Math.min(h * 0.68, w * 0.3); cx = w * 0.565; cy = h * 0.57; }
    function project(lon, lat) { const L = lon + rot, x = Math.cos(lat) * Math.sin(L), z = Math.cos(lat) * Math.cos(L), y = -Math.sin(lat); return { x: cx + x * R, y: cy + y * R, z }; }
    function textureSphere() {
      if (!texReady) return;
      ctx.save(); ctx.imageSmoothingEnabled = true;
      const strips = Math.ceil(R * 1.35);
      for (let i = -strips; i <= strips; i++) {
        const xn = i / strips; if (Math.abs(xn) >= 1) continue;
        const lon = Math.asin(xn); let u = ((lon + rot) / (Math.PI * 2) + 0.5) % 1; if (u < 0) u += 1;
        const sx = Math.floor(u * tex.width), dx = cx + xn * R, dw = R / strips + 1.35;
        ctx.drawImage(tex, sx, 0, Math.max(1, tex.width / strips * 0.7), tex.height, dx, cy - R, dw, R * 2);
      }
      const shade = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.36, R * 0.08, cx + R * 0.18, cy + R * 0.05, R * 1.08);
      shade.addColorStop(0, "rgba(100,214,255,.12)"); shade.addColorStop(0.48, "rgba(0,24,79,.02)"); shade.addColorStop(0.78, "rgba(0,8,35,.22)"); shade.addColorStop(1, "rgba(0,2,20,.88)");
      ctx.fillStyle = shade; ctx.fillRect(cx - R, cy - R, R * 2, R * 2); ctx.restore();
    }
    function grid() { ctx.save(); ctx.strokeStyle = "rgba(28,171,255,.32)"; ctx.lineWidth = 0.7; for (let lat = -60; lat <= 60; lat += 15) { ctx.beginPath(); let started = false; for (let lon = -180; lon <= 180; lon += 3) { const p = project(rad(lon), rad(lat)); if (p.z > 0) { if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y); } else started = false; } ctx.stroke(); } for (let lon = -180; lon < 180; lon += 15) { ctx.beginPath(); let started = false; for (let lat = -88; lat <= 88; lat += 2) { const p = project(rad(lon), rad(lat)); if (p.z > 0) { if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y); } else started = false; } ctx.stroke(); } ctx.restore(); }
    function orbit() { ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.24); ctx.strokeStyle = "rgba(70,78,255,.42)"; ctx.lineWidth = 1.2; ctx.shadowBlur = 15; ctx.shadowColor = "#684bff"; ctx.beginPath(); ctx.ellipse(0, 0, R * 1.45, R * 0.34, 0, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = "rgba(11,224,255,.25)"; ctx.beginPath(); ctx.ellipse(0, 0, R * 1.66, R * 0.48, 0.04, 0, Math.PI * 2); ctx.stroke(); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + rot * 1.7; ctx.fillStyle = i % 3 ? "#196dff" : "#c33cff"; ctx.beginPath(); ctx.arc(Math.cos(a) * R * 1.45, Math.sin(a) * R * 0.34, 1.7, 0, 7); ctx.fill(); } ctx.restore(); }
    function dataArcs() { ctx.save(); ctx.lineWidth = 1; arcs.forEach((pair, i) => { const a = project(...cities[pair[0]]), b = project(...cities[pair[1]]); if (a.z > 0.05 && b.z > 0.05) { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.24; const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y); g.addColorStop(0, "rgba(25,225,255,.15)"); g.addColorStop(0.5, "rgba(55,193,255,.95)"); g.addColorStop(1, "rgba(177,55,255,.45)"); ctx.strokeStyle = g; ctx.shadowBlur = 7; ctx.shadowColor = "#1bdcff"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo(mx, my, b.x, b.y); ctx.stroke(); const t = (performance.now() / 1800 + i * 0.17) % 1, qx = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x, qy = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y; ctx.fillStyle = "#c8fbff"; ctx.beginPath(); ctx.arc(qx, qy, 1.8, 0, 7); ctx.fill(); } }); ctx.restore(); }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => { const alpha = s.a * (0.65 + 0.35 * Math.sin(t * s.s)); ctx.fillStyle = `rgba(51,151,255,${alpha})`; ctx.fillRect(s.x * w, s.y * h, s.r, s.r); });
      ctx.save(); ctx.shadowBlur = 55; ctx.shadowColor = "#006dff"; const halo = ctx.createRadialGradient(cx - R * 0.18, cy - R * 0.18, R * 0.2, cx, cy, R * 1.18); halo.addColorStop(0, "rgba(0,114,255,.08)"); halo.addColorStop(0.7, "rgba(0,83,255,.2)"); halo.addColorStop(0.9, "rgba(0,211,255,.2)"); halo.addColorStop(1, "rgba(0,77,255,0)"); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.23, 0, 7); ctx.fill(); ctx.restore();
      orbit();
      const ocean = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R); ocean.addColorStop(0, "#0758bb"); ocean.addColorStop(0.5, "#032f83"); ocean.addColorStop(0.82, "#021544"); ocean.addColorStop(1, "#02091f"); ctx.fillStyle = ocean; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip(); textureSphere(); grid();
      if (!texReady) land.forEach((p) => { const q = project(p[0], p[1]); if (q.z > 0) { const alpha = 0.22 + q.z * 0.75; ctx.fillStyle = p[2] > 0.92 ? `rgba(203,242,255,${alpha})` : `rgba(23,202,255,${alpha})`; const z = 0.55 + q.z * 1.55; ctx.fillRect(q.x, q.y, z, z); } });
      cities.forEach((p, i) => { const q = project(...p); if (q.z > 0.05) { ctx.shadowBlur = 12; ctx.shadowColor = i < 3 ? "#29f5ff" : "#8f4cff"; ctx.fillStyle = "#e5ffff"; ctx.beginPath(); ctx.arc(q.x, q.y, 2.2, 0, 7); ctx.fill(); ctx.strokeStyle = "rgba(34,230,255,.6)"; ctx.beginPath(); ctx.arc(q.x, q.y, 5 + Math.sin(t / 350 + i) * 1.3, 0, 7); ctx.stroke(); } });
      ctx.restore(); dataArcs();
      ctx.save(); ctx.strokeStyle = "#24ddff"; ctx.lineWidth = 2; ctx.shadowBlur = 24; ctx.shadowColor = "#00c8ff"; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      const rim = ctx.createLinearGradient(cx - R, cy, cx + R, cy); rim.addColorStop(0, "rgba(21,99,255,.05)"); rim.addColorStop(0.72, "rgba(18,160,255,.3)"); rim.addColorStop(1, "rgba(93,242,255,.95)"); ctx.strokeStyle = rim; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, R - 2, -1.25, 1.25); ctx.stroke(); ctx.restore();
      rot += 0.00115; raf = requestAnimationFrame(frame);
    }
    resize(); addEventListener("resize", resize); raf = requestAnimationFrame(frame);
    c._cleanup = () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }

  /* ---------- 路由渲染（带错误兜底） ---------- */
  function render() {
    try {
      const oldGlobe = el("#globe");
      if (oldGlobe && oldGlobe._cleanup) oldGlobe._cleanup();
      S.route = location.hash.slice(1) || "home";
      const f = ({ home, task, mentor, dashboard, progress, upload, evaluation, market, archive, proof })[S.route] || home;
      const app = el("#app");
      app.dataset.errored = "";
      app.innerHTML = shell(f());
      drawGlobe();
      if (S.route === "home") {
        setTimeout(() => {
          initCesium();
          if (!window.Cesium) {
            const hud = el(".space-hud");
            if (hud && !hud.querySelector(".offline")) {
              const n = document.createElement("small");
              n.className = "offline";
              n.style.cssText = "display:block;color:#7f90b0;font-size:6px;margin-top:4px";
              n.textContent = "离线模式 · 本地 Canvas 地球";
              hud.appendChild(n);
            }
          }
        }, 120);
        animateCounters();
      }
      scrollTo(0, 0);
    } catch (err) {
      console.error("render error:", err);
      const app = el("#app");
      if (app) app.innerHTML = `<div class="page simple-page"><h1>页面渲染出错</h1><p>${esc(err && err.message ? err.message : err)}</p><button onclick="location.reload()">重新加载</button></div>`;
    }
  }

  addEventListener("hashchange", render);
  render();
})();
