/* =====================================================================
 * GeoStudy AI · 课程模式配置文件（数据驱动单一数据源）
 * ---------------------------------------------------------------------
 * 本文件是唯一的内容来源。改这里即可把 Demo 改造成你自己的课程，
 * 无需触碰 main.js 的渲染逻辑。所有文案均为「示例数据」，可自由替换。
 * ===================================================================== */
const CONFIG = {
  /* 站点与学习者元信息（学习者身份为示例占位，可替换为真实学员） */
  meta: {
    title: "GeoStudy AI｜WebGIS 与三维可视化开发",
    description:
      "GeoStudy AI，高校 GIS 专业课程 AI 学习平台，提供个人课程路线、AI 课程导师、Cesium 实验、课程成果评价与专业能力成长档案。",
    systemName: "GIS专业课程学习平台",
    version: "v2.0",
    brand: "GeoStudy AI",
    learner: { name: "学习者", sub: "地理信息科学 · 示例学员", initials: "学" },
    growth: { label: "课程进度", value: "68% · 连续学习8天" },
    liveText: "课程服务就绪 · 本地记录已保存",
    headerBtn: "AI学习记录",
    idLabel: "GEOSTUDY LEARNER ID",
    idValue: "GS-DEMO-001",
    cesiumNote: "课程实验环境 · Cesium 1.126"
  },

  /* 顶部导航：[id, 显示名, 图标] */
  nav: [
    ["home", "课程驾驶舱", "◈"],
    ["task", "课程学习路线", "✦"],
    ["mentor", "GeoStudy课程导师", "◇"],
    ["dashboard", "AI学习控制台", "▦"],
    ["progress", "学习记录", "◌"],
    ["upload", "课程成果", "⇧"],
    ["evaluation", "课程能力评价", "◎"],
    ["market", "GIS学习集市", "⊞"],
    ["archive", "成长档案", "▤"],
    ["proof", "产品与数据说明", "◫"]
  ],

  /* 首页：驾驶舱 */
  home: {
    hud: {
      label: "CESIUM LAB ONLINE",
      coord: "课程实验环境 · Cesium 1.126",
      items: ["当前章节 06", "知识点 08", "本周实验 03", "状态 进行中"]
    },
    copy: {
      label: "COURSE LEARNING × AI TUTOR × CESIUM LAB",
      h1: "GeoStudy AI",
      h2: "面向高校GIS专业课程的 AI学习平台",
      p: "围绕一门真实专业课程，将每日学习、AI辅导、Cesium实验与成果评价连接成持续学习闭环。",
      cta1: { text: "▶ 继续今日学习 →", href: "#task" },
      cta2: { text: "◇ 询问GeoStudy课程导师", href: "#mentor" },
      evidence: [
        { text: "✓ 课程大纲", tab: "prompt" },
        { text: "✓ AI指导规则", tab: "prompt" },
        { text: "✓ 学习记录", tab: "test" },
        { text: "✓ 数据与隐私", tab: "compliance" }
      ]
    },
    orchestrator: {
      title: "课程学习总控",
      status: "● 课程上下文已加载",
      agentsText: "5项服务",
      agentFlow: [
        { name: "入课学情分析", sub: "学情 PF-286", status: "在线" },
        { name: "课程路线生成", sub: "路线 LP-532", status: "在线" },
        { name: "课程导师", sub: "上下文 4/4", status: "运行中" },
        { name: "成果评价", sub: "实验待提交", status: "等待" },
        { name: "成长档案", sub: "42项记录", status: "在线" }
      ],
      miniConsole: "课程服务已读取章节、实验与个人进度",
      projectLive: {
        title: "当前课程：《WebGIS与三维可视化开发》",
        stage: "当前章节 第6周 · Entity与空间对象",
        pct: 68,
        pctText: "学习进度 68%",
        loaded: "已加载：课程大纲 · 第6章知识库 · POI实验要求"
      }
    },
    liveStats: [
      { label: "今日学习（分钟）", value: 48, delta: "今日目标 63" },
      { label: "本周已完成", value: 12, delta: "共 18 项" },
      { label: "课程总进度", value: 68, delta: "第 6 / 12 周" },
      { label: "连续学习（天）", value: 8, delta: "状态良好" }
    ],
    /* 首页「今日学习」流水线（5 步学习闭环） */
    loop: [
      { topic: "Cesium Entity学习", agent: "入课学情分析Agent", meta: "20分钟 · 知识学习" },
      { topic: "POI三维可视化实验", agent: "课程路线生成Agent", meta: "35分钟 · 课程实验" },
      { topic: "第6章知识检测", agent: "GeoStudy课程导师", meta: "10题 · 约8分钟" },
      { topic: "询问课程导师", agent: "成果智能检测", meta: "已读取当前章节" },
      { topic: "成果与成长档案", agent: "学习档案Agent", meta: "学习记录自动沉淀" }
    ]
  },

  /* 任务工作流：个人课程学习路线（含任务包增值字段） */
  task: {
    title: {
      k: "PERSONAL COURSE LEARNING PATH",
      t: "个人课程学习路线",
      d: "基于专业基础和课程目标，生成可执行、可调整、可评价的12周个人课程学习路线。",
      a: "● 学习记录自动保存在本机"
    },
    workflow: ["学情信息", "AI分析", "基础诊断", "课程路线"],
    courseCard: {
      course: "《WebGIS与三维可视化开发》",
      sub: "专业核心课 · 地理信息科学 · 12周",
      intro:
        "从Web地图与空间数据基础进入Cesium三维开发，通过章节实验逐步完成校园数字孪生可视化课程设计。",
      tech: "GIS · JavaScript · GeoJSON · Cesium · 3D Tiles",
      weekText: "当前学习：第6周 · Entity与空间对象 · 总进度68%",
      joinedText: "继续课程学习 →"
    },
    goal:
      "12周学完《WebGIS与三维可视化开发》，掌握WebGIS与Cesium开发并完成课程综合实践",
    majors: ["地理信息科学（GIS）", "遥感科学与技术", "测绘工程"],
    durations: ["12周 / 1学期", "16周 / 1学期"],
    levels: ["GIS基础", "JavaScript基础", "空间数据库", "Web地图原理", "Cesium入门"],
    levelsChecked: [0, 1, 2],
    privacy: "学情数据仅用于生成课程路线，当前版本保存在本机浏览器",
    generateBtn: "✦ 生成个人课程学习路线 →",
    emptyTitle: "等待生成个人课程学习路线",
    emptyDesc:
      "系统将结合课程大纲、先修知识、学生基础与每周可用时间组织12周学习内容。",
    /* 四阶段任务包：每个阶段含 实操经验 / 避坑指南 / 拓展知识点 */
    stages: [
      {
        no: "01", weeks: "第1–2周", title: "WebGIS与JavaScript基础",
        tasks: [
          "理解Web地图、地图服务与前后端交互",
          "补充JavaScript对象、事件与异步请求",
          "完成第一个Web地图页面"
        ],
        tools: ["HTML/CSS", "JavaScript", "Web地图"],
        artifact: "实验01 · 第一个Web地图",
        experience:
          "先用静态 HTML 把地图跑起来，再逐步加交互；把每一次报错截图标号，形成自己的「排错笔记」，比直接抄答案更有用。",
        pitfalls: [
          { t: "地图容器高度为 0", d: "地图 DIV 必须显式给高度，否则瓦片不显示；用 CSS 给 #map{height:100%} 或固定像素。" },
          { t: "API Key 暴露在前端", d: "地图服务 Key 放前端可被扒取；练习用免费额度即可，正式项目走代理或后端转发。" }
        ],
        expansions: [
          "了解 OGC 标准（WMS/WMTS/WFS）与栅格/矢量瓦片区别",
          "预习 Promise / async-await，它是后续所有异步请求的基础"
        ]
      },
      {
        no: "02", weeks: "第3–5周", title: "空间数据与坐标系统",
        tasks: [
          "读取与展示GeoJSON空间数据",
          "理解WGS84、投影坐标与EPSG编码",
          "完成空间数据转换与质量检查"
        ],
        tools: ["GeoJSON", "QGIS", "GDAL"],
        artifact: "实验04 · 坐标转换报告",
        experience:
          "拿到任何空间数据先问三个问题：什么坐标系？什么精度？来源是否可追溯？把 EPSG 编号写进文件名，能省掉后续 80% 的偏移纠纷。",
        pitfalls: [
          { t: "经纬度顺序写反", d: "Cesium.fromDegrees 是(经度,纬度,高度)，很多人习惯(纬度,经度)导致点位落到海里或非洲。" },
          { t: "GCJ-02 当地图叠加偏移", d: "国内互联网地图常用 GCJ-02 偏移加密，与 WGS84 直接叠加会整体偏移数百米，需先脱密/转换。" }
        ],
        expansions: [
          "理解 CGCS2000 与 WGS84 在国内近似一致、但高精度场景仍有差异",
          "用 QGIS 做一次「重新投影」并对比前后面积/长度变化"
        ]
      },
      {
        no: "03", weeks: "第6–9周", title: "Cesium三维开发",
        tasks: [
          "掌握Viewer、Entity与空间对象",
          "加载Imagery、Terrain与3D Tiles",
          "完成POI与校园建筑三维可视化"
        ],
        tools: ["CesiumJS", "Entity", "3D Tiles"],
        artifact: "Cesium章节实验集",
        experience:
          "Entity API 适合「对象级」交互（点/线/面/模型），Primitive 适合海量数据；先用 Entity 把业务逻辑跑通，再考虑性能优化，不要过早抽象。",
        pitfalls: [
          { t: "3D Tiles 整体偏移", d: "优先检查 tileset.root.transform 与项目坐标系是否一致；用 3 个已知控制点验证偏移是否近似恒定，再决定是否改变换矩阵。" },
          { t: "模型中心点错位", d: "glTF→3D Tiles 转换时记录经纬度与高度；不要同时套用「平移矩阵」和「坐标转换」，否则会叠加两次偏移。" }
        ],
        expansions: [
          "了解 3D Tiles 1.1 与 glTF 的关系，及 b3dm/i3dm/pnts 各自适用场景",
          "尝试给 Entity 加 description，用 property 实现点击弹窗与属性查询"
        ]
      },
      {
        no: "04", weeks: "第10–12周", title: "综合课程设计",
        tasks: [
          "实现三维交互查询与空间量测",
          "整理代码、实验报告与学习反思",
          "完成测试、部署说明和课程展示"
        ],
        tools: ["WebGIS", "空间分析", "成果表达"],
        artifact: "校园数字孪生可视化系统",
        experience:
          "综合设计 = 可运行 + 可讲清 + 可追溯。提交前用「他人视角」过一遍：换台电脑能跑吗？数据来源写了吗？最关键的坑讲了吗？这三点决定评价上限。",
        pitfalls: [
          { t: "只交代码不交说明", d: "课程评价看「证据」，README、实验报告、测试记录缺失会直接拉低代码规范与数据正确性得分。" },
          { t: "本地能跑部署报错", d: "Cesium 等库走 CDN 时离线即失效；部署前确认资源路径，或把关键静态资源本地化。" }
        ],
        expansions: [
          "用 GitHub Pages / 静态托管把成果变成可访问链接，方便评优佐证",
          "写一份「1 分钟讲解稿」：背景→技术→成果→反思，竞赛答辩高频用到"
        ]
      }
    ],
    /* 入课基础诊断雷达 */
    radar: [
      { name: "GIS基础", pct: 85 },
      { name: "JavaScript", pct: 52 },
      { name: "Cesium", pct: 30 },
      { name: "空间数据", pct: 70 },
      { name: "项目实践", pct: 45 }
    ],
    gap: {
      target: "掌握WebGIS与Cesium开发",
      matchText: "入课匹配度 56% → 课程目标 85%",
      items: [
        { k: "优先补齐", v: "JavaScript异步请求" },
        { k: "关键依赖", v: "坐标系统与空间参考" },
        { k: "学习策略", v: "知识学习 → 小实验 → 综合课程设计" }
      ],
      sources: ["课程大纲 v1.0", "GIS知识库 48项", "章节实验 10项"]
    },
    /* 课程学习评价量规 */
    rubric: [
      { label: "知识掌握", weight: 25 },
      { label: "实验完成", weight: 30 },
      { label: "代码规范", weight: 20 },
      { label: "空间数据正确性", weight: 15 },
      { label: "学习反思", weight: 10 }
    ],
    traceId: "GS-COURSE-2026-001",
    traceDesc: "生成依据：学情诊断 + 课程大纲 + GIS课程知识库 + 章节先修关系",
    exportName: "GeoStudy-WebGIS-course-plan"
  },

  /* GIS专家 / 课程导师 */
  mentor: {
    brand: { name: "GeoStudy课程导师", status: "● 已读取课程上下文" },
    projectTree: {
      course: "WebGIS与三维可视化开发",
      items: [
        { name: "WebGIS基础", state: "✓", pct: "" },
        { name: "空间数据与坐标", state: "✓", pct: "" },
        { name: "Entity与空间对象", state: "●", pct: "68%" },
        { name: "3D Tiles", state: "○", pct: "" },
        { name: "综合课程设计", state: "○", pct: "" }
      ]
    },
    contextCard: {
      title: "已读取学习上下文",
      items: [
        { label: "当前章节", value: "第6章 Entity", warn: false },
        { label: "当前实验", value: "POI三维可视化", warn: false },
        { label: "学生薄弱点", value: "坐标转换", warn: true },
        { label: "Cesium版本", value: "1.126", warn: false }
      ]
    },
    files: ["chapter-06.pdf", "entity-lab.js", "course-outline.json"],
    chat: {
      headerTitle: "课程辅导会话",
      headerSub: "GeoStudy课程导师 · 坐标诊断技能已启用",
      ctxText: "上下文 4/4",
      ctxBtn: "查看学习记录",
      placeholder: "继续描述学习问题，可包含章节、代码或报错信息...",
      footerNote: "回答基于当前课程与学生进度；关键空间参数需要结合实验数据复核。",
      studentName: "我"
    },
    /* 关键字 → 诊断主题；命中即用对应主题，否则用 default */
    keywordMap: {
      coordinate: ["坐标", "偏移", "经纬度", "投影", "epsg", "cgcs2000", "wgs84", "gcj"],
      tiles: ["3d tiles", "tiles", "模型", "加载", "倾斜", "b3dm", "gltf"],
      perf: ["性能", "卡", "fps", "内存", "慢", "掉帧"]
    },
    topics: {
      coordinate: {
        badge: "课程知识定位", assoc: "关联度 92%",
        from: { small: "当前实验", b: "第6章 · POI Entity" },
        to: { small: "需要复习", b: "第4章 · 坐标系统" },
        footer: "问题类型：坐标参考或经纬度顺序 · 影响：水平位置偏移",
        reasons: [
          { no: "01", title: "确认坐标顺序", desc: "Cesium.fromDegrees 的顺序应为经度、纬度、高度。" },
          { no: "02", title: "确认坐标参考", desc: "检查原始数据是 WGS84、GCJ-02 还是投影坐标，并记录EPSG。" },
          { no: "03", title: "设置对照点", desc: "选择一个已知地标坐标，判断偏移来自数据还是代码。" }
        ],
        code: { label: "课堂验证代码", body: "const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);\nviewer.entities.add({ position, point: { pixelSize: 10 } });" },
        rule: { title: "为什么不直接给最终坐标？", body: "直接给出参数不能帮助你判断坐标来源。先完成三步验证，系统会把结果记入本章实验记录。" }
      },
      tiles: {
        badge: "课程知识定位", assoc: "关联度 88%",
        from: { small: "当前实验", b: "第6章 · POI / 模型" },
        to: { small: "需要复习", b: "第3章 · 3D Tiles 管线" },
        footer: "问题类型：模型变换或坐标系不一致 · 影响：整体位置/朝向错误",
        reasons: [
          { no: "01", title: "核对 transform", desc: "检查 tileset.root.transform，确认它已包含正确的定位矩阵。" },
          { no: "02", title: "避免重复平移", desc: "不要同时设置 modelMatrix 和平移后的顶点，否则偏移会被叠加。" },
          { no: "03", title: "用控制点验证", desc: "选 3 个已知建筑角点，判断是否整片一致偏移。" }
        ],
        code: { label: "课堂验证代码", body: "const tileset = await Cesium.Cesium3DTileset.fromUrl(url);\ntileset.modelMatrix = Cesium.Matrix4.IDENTITY;\nviewer.scene.primitives.add(tileset);" },
        rule: { title: "为什么不直接给变换矩阵？", body: "变换矩阵依赖你的数据来源与区域，先验证控制点能避免「看似对齐但量测错误」。" }
      },
      perf: {
        badge: "课程知识定位", assoc: "关联度 80%",
        from: { small: "当前实验", b: "第6章 · 场景渲染" },
        to: { small: "需要复习", b: "性能与请求优化" },
        footer: "问题类型：渲染负载或请求策略 · 影响：交互卡顿",
        reasons: [
          { no: "01", title: "控制实体数量", desc: "海量点用 Primitive / 3D Tiles，而非逐个 Entity。" },
          { no: "02", title: "按需加载", desc: "用 tileset 的 LOD 与大场景分块，避免一次性载入全量数据。" },
          { no: "03", title: "记录指标", desc: "用浏览器性能面板记录 FPS 与内存，作为评价证据。" }
        ],
        code: { label: "课堂验证代码", body: "viewer.scene.globe.maximumScreenSpaceError = 2; // 调大可降负载\nviewer.requestRenderMode = true; // 静止时不渲染" },
        rule: { title: "为什么不直接给最优参数？", body: "最优参数依赖你的机器与数据规模，先用性能面板量化再做取舍。" }
      },
      default: {
        badge: "课程辅导", assoc: "已读取上下文",
        from: { small: "当前课程", b: "《WebGIS与三维可视化开发》" },
        to: { small: "建议", b: "先描述具体现象" },
        footer: "问题类型：待澄清 · 影响：无法定位",
        reasons: [
          { no: "01", title: "描述现象", desc: "说清「预期是什么、实际是什么、报错原文」。截图比形容词有用。" },
          { no: "02", title: "给出上下文", desc: "附上章节、相关代码与数据来源，导师才能联系已学内容。" },
          { no: "03", title: "先验证后改", desc: "导师提供思路与检查路径，不直接代做；你验证后系统记入实验记录。" }
        ],
        code: { label: "提问模板", body: "【章节】第X章\n【现象】预期A，实际B\n【报错】粘贴原文\n【已试】…" },
        rule: { title: "导师的定位", body: "课程导师负责「引导验证、不代做」，帮你建立可迁移的排错能力，而非一次性给答案。" }
      }
    },
    /* 首页演示用的默认首条会话 */
    demoQuestion: "我的POI加载后位置发生偏移，应该怎么排查？",
    demoTopic: "coordinate",
    /* 实时 AI（DeepSeek）接入配置：密钥仅存于配套代理 mentor-proxy.js（服务端），前端不持有任何密钥 */
    deepseek: {
      enabled: true,
      proxyUrl: "/api/deepseek",
      model: "deepseek-v4-flash",
      baseUrl: "https://api.deepseek.com",
      direct: false
    }
  },

  /* AI学习控制台 */
  dashboard: {
    title: {
      k: "AI LEARNING SERVICE CONSOLE",
      t: "AI学习服务记录",
      d: "查看学情诊断、课程路线、导师辅导与成果评价使用了哪些课程上下文。",
      a: "● 运行记录已保存"
    },
    agents: [
      { name: "学习基础分析", status: "已完成", sub: "学情诊断 GS-PF-286" },
      { name: "课程路线生成", status: "已完成", sub: "12周课程路线 GS-LP-532" },
      { name: "GeoStudy课程导师", status: "运行中", sub: "上下文 4/4" },
      { name: "课程成果评价", status: "等待", sub: "等待课程成果" },
      { name: "成长档案更新", status: "已同步", sub: "42项学习记录" }
    ],
    architecture: {
      userNode: { label: "学习课程", value: "《WebGIS与三维可视化开发》" },
      resourceNode: { title: "专业资源层", items: ["课程大纲库", "GIS知识库", "章节实验库", "评价量规库"] }
    },
    traceHeader: "本会话 Token（模拟） 3,842 · 平均响应 1.28s",
    traces: [
      ["学习基础分析", "输入：专业、已有基础、课程目标", "规则：按课程先修知识评估基础差距", "输出：GIS、JavaScript、Cesium基础诊断", "数据：课程能力指标 v1.0"],
      ["课程路线生成", "输入：基础诊断、12周课程大纲", "规则：生成含章节、实验、成果和评价的学习路线", "输出：4阶段12周个人课程路线", "数据：课程大纲与章节先修关系"],
      ["GeoStudy课程导师", "输入：问题、当前章节、当前实验、薄弱点", "规则：联系已学内容，提供思路而不代做", "输出：课程知识定位与分步检查建议", "数据：WebGIS课程知识库"],
      ["课程成果评价", "输入：实验代码、空间数据、实验报告", "规则：按课程五维量规评价并引用证据", "输出：评分、教师复核项与改进任务", "数据：课程评价量规 v1.1"],
      ["成长档案更新", "输入：章节任务、实验与评价记录", "规则：映射为专业课程能力证据", "输出：个人专业能力成长档案", "数据：课程目标与能力映射表"]
    ]
  },

  /* 学习记录 */
  progress: {
    title: {
      k: "COURSE LEARNING RECORDS",
      t: "课程学习记录",
      d: "自动记录章节学习、实验、测验、导师反馈和成果版本，退出后仍可继续。",
      action: "＋ 新增学习记录"
    },
    course: "WebGIS与三维可视化开发 · 第 6 周",
    pct: 68,
    pctText: "课程进度 68%",
    tasksDone: 12, tasksTotal: 18,
    stats: [
      { label: "完成知识点", value: "36个" },
      { label: "课程实验", value: "5项" },
      { label: "导师辅导", value: "12次" },
      { label: "累计学习", value: "48.6h" }
    ],
    heatmapDays: 84,
    taskBoard: [
      { name: "完成Cesium Entity知识学习", status: "完成", sub: "第6章学习记录" },
      { name: "完成POI三维可视化实验", status: "进行中", sub: "实验记录 EXP-006" },
      { name: "完成第6章知识检测", status: "待开始", sub: "10题 · 待完成" }
    ],
    logs: [
      { time: "17:20", name: "完成 Entity 课堂练习", sub: "知识学习" },
      { time: "15:42", name: "记录POI坐标检查", sub: "实验记录" },
      { time: "昨天", name: "课程导师：复习第4章坐标系统", sub: "AI对话" }
    ],
    addLogName: "新增课程学习记录"
  },

  /* 课程成果：上传与检测 */
  upload: {
    title: {
      k: "COURSE ARTIFACT PIPELINE",
      t: "课程成果提交与检查",
      d: "提交章节实验、报告、代码、课程设计与展示视频，保留成果版本与评价记录。",
      a: "当前前端版本仅在本机读取文件"
    },
    accept: ".pdf,.doc,.docx,.ppt,.pptx,.zip,.html,.js,.glb,.geojson,.md,.mp4,.png,.jpg",
    dropTitle: "拖拽课程成果到这里",
    dropDesc: "或点击选择文件，支持实验报告 · 代码 · 空间数据 · 课程设计 · 图片与视频",
    dropNote: "当前前端版仅在浏览器读取文件名和大小；接入服务器后可保存真实文件与版本",
    pipeline: [
      { no: "01", name: "文件识别", desc: "格式与完整性" },
      { no: "02", name: "代码沙箱", desc: "结构与运行检查" },
      { no: "03", name: "空间规范", desc: "坐标系与字段" },
      { no: "04", name: "课程评价", desc: "五维量规评分" }
    ],
    emptyTitle: "等待课程成果",
    emptyDesc: "可先使用内置课程成果检查文件结构和评价流程。",
    demoText: "加载示例课程成果",
    demoFiles: [
      ["experiment-06.zip", "1.8 MB"],
      ["campus-poi.geojson", "86 KB"],
      ["course-design.html", "248 KB"],
      ["experiment-report.pdf", "1.2 MB"]
    ],
    checks: [
      { name: "代码结构完整", status: "通过", desc: "检测到 src、README 与配置文件" },
      { name: "空间数据规范", status: "通过", desc: "GeoJSON有效 · EPSG:4326" },
      { name: "模型可用性", status: "通过", desc: "glTF 2.0 · 纹理完整" },
      { name: "文档完整度", status: "良好", desc: "包含架构、部署与测试说明" }
    ],
    inspectBtn: "进入课程能力评价 →"
  },

  /* 课程能力评价 */
  evaluation: {
    title: {
      k: "COURSE LEARNING EVALUATION",
      t: "课程能力评价中心",
      d: "把章节学习、实验运行、代码和教师反馈映射到课程能力，不只输出一个分数。",
      a: "课程评价量规 v1.1"
    },
    score: 89,
    scoreLabel: "综合评分",
    scoreLevel: "优秀",
    courseTag: "《WebGIS与三维可视化开发》 · 阶段成果",
    scoreDesc: "已达到第6周“Cesium空间对象开发”学习要求",
    evalTime: "评价时间 2026-08-15 10:20 · Evaluation ID: GS-CE-089",
    scoreFlags: ["✓ 章节学习记录", "✓ 课程实验结果", "✓ 5维课程量规"],
    scores: [
      { name: "知识掌握", pct: 86, desc: "能解释Entity、坐标与场景对象关系" },
      { name: "实验完成度", pct: 94, desc: "核心步骤完整，运行结果可复核" },
      { name: "代码规范", pct: 88, desc: "结构清楚，建议补充异常处理" },
      { name: "空间数据正确性", pct: 91, desc: "坐标系说明明确，字段规范" },
      { name: "创新与表达", pct: 84, desc: "课程设计具有GIS应用特色" }
    ],
    improvements: [
      { p: "P1", title: "补做坐标转换强化练习", desc: "依据：坐标系统当前掌握度52%" },
      { p: "P2", title: "进入Imagery与Terrain章节", desc: "依据：Entity实验已通过" },
      { p: "P3", title: "为课程设计保留数据来源说明", desc: "依据：成果评价需要可追溯数据" }
    ],
    nextBtn: "更新专业能力成长档案 →",
    note: "评价边界",
    noteText: "AI评价用于形成性学习反馈，不替代教师最终评分；空间精度、代码安全与课程成绩由教师复核。"
  },

  /* GIS学习集市 */
  market: {
    title: {
      k: "GIS COURSE RESOURCE MARKET",
      t: "GIS学习集市",
      d: "共享经过教师或来源核验的课程任务包、实验案例、学习笔记、代码案例与优秀课程作品。",
      action: "发布课程资源"
    },
    filters: ["为你推荐", "课程任务包", "实验案例", "学习笔记", "优秀作品"],
    searchPlaceholder: "搜索 Cesium、坐标系统、3D Tiles...",
    items: [
      { tag: "课程任务包", title: "WebGIS与三维可视化12周学习路线", type: "优秀课程任务包", stars: "2.4k", desc: "按课程章节组织知识、实验、测验与阶段成果" },
      { tag: "实验案例", title: "Cesium Entity校园POI实验", type: "课程实验", stars: "1.8k", desc: "含实验要求、示例数据、代码骨架与检查清单" },
      { tag: "学习笔记", title: "坐标系统与空间参考易错点", type: "优秀笔记", stars: "1.2k", desc: "WGS84、投影坐标与常见偏移问题对照" },
      { tag: "课程作品", title: "校园数字孪生可视化系统", type: "优秀课程作品", stars: "986", desc: "将数字孪生作为课程综合实践成果完整呈现" }
    ],
    sourceRuleTitle: "课程资源准入规则",
    sourceRules: ["与课程目标一致", "来源与许可明确", "隐私数据脱敏", "AI生成内容标识"]
  },

  /* 专业能力成长档案 */
  archive: {
    title: {
      k: "COURSE GROWTH PORTFOLIO",
      t: "专业能力成长档案",
      d: "把章节任务、课程实验、测验与成果评价转化为可验证的GIS专业能力记录。",
      action: "⇩ 导出成长报告"
    },
    profile: {
      idLabel: "GEOSTUDY LEARNER ID",
      id: "GS-DEMO-001",
      name: "学习者",
      sub: "地理信息科学 · 示例学员",
      course: "当前课程：WebGIS与三维可视化开发 · 第6周",
      pct: "68%",
      pctLabel: "课程总进度"
    },
    careerPath: [
      { name: "GIS与Web基础", status: "已完成", records: "12项记录" },
      { name: "空间数据与坐标", status: "已完成", records: "14项记录" },
      { name: "Cesium三维开发", status: "当前阶段", records: "9项记录" },
      { name: "综合课程设计", status: "待学习", records: "3项准备" }
    ],
    capability: [
      { name: "GIS基础", pct: 86, records: "14" },
      { name: "空间数据", pct: 82, records: "12" },
      { name: "WebGIS", pct: 76, records: "10" },
      { name: "Cesium", pct: 65, records: "9" },
      { name: "数字孪生", pct: 70, records: "6" }
    ],
    milestonesTitle: "课程学习里程碑",
    milestonesSub: "记录均关联章节、实验或课程成果",
    milestones: [
      { date: "08.15", title: "完成Cesium Entity知识学习", ref: "第6章学习记录" },
      { date: "08.12", title: "Cesium基础场景实验获92分", ref: "课程实验 EXP-005" },
      { date: "08.06", title: "完成坐标系统与空间参考阶段", ref: "第4章测验 86分" },
      { date: "07.18", title: "生成12周个人课程学习路线", ref: "课程路线 GS-LP-532" }
    ]
  },

  /* 产品与数据说明（原 proof 页） */
  proof: {
    title: {
      k: "PRODUCT & DATA CENTER",
      t: "产品与数据说明",
      d: "说明AI课程导师的回答规则、前端测试、课程数据来源和用户隐私边界。",
      a: "● 当前版本说明"
    },
    tabs: [
      { id: "prompt", label: "AI课程导师规则" },
      { id: "test", label: "测试记录" },
      { id: "data", label: "数据来源" },
      { id: "compliance", label: "合规边界" }
    ],
    panels: {
      prompt: {
        head: "AI课程导师规则与记录",
        sub: "Prompt版本 v1.2 · 记录 5 项",
        note: "当前前端版使用本地课程规则，不伪称已接入远程AI；部署版可通过服务器安全接入模型服务。",
        rows: [
          { id: "GS-TR-001", name: "学习基础分析Agent", meta: "课程规则引擎 · 已记录", prompt: "根据课程先修知识评估学习基础，不编造学生经历。", status: "完成" },
          { id: "GS-TR-002", name: "课程路线生成Agent", meta: "课程规则引擎 · 已记录", prompt: "生成12周课程路线，包含章节、实验、成果和量规。", status: "完成" },
          { id: "GS-TR-003", name: "课程导师Agent", meta: "课程规则引擎 · 已记录", prompt: "读取当前课程上下文，先引导验证，不直接代做。", status: "完成" },
          { id: "GS-TR-004", name: "课程导师实时AI（DeepSeek）", meta: "服务端代理 · 可选", prompt: "经本地代理安全接入 DeepSeek，前端不持有密钥；接口异常自动回退本地课程知识库。", status: "可选" }
        ]
      },
      test: {
        head: "系统测试记录",
        sub: "10 / 10 通过",
        summary: "100%",
        summaryDesc: "页面交互、课程路线、成果检查、本地存储与移动端适配测试",
        rows: [
          { id: "T01", name: "九模块导航", meta: "2026-08-15 · Chrome / Edge", status: "通过" },
          { id: "T03", name: "个人课程路线生成", meta: "2026-08-15 · Chrome / Edge", status: "通过" },
          { id: "T05", name: "课程导师多轮辅导", meta: "2026-08-15 · Chrome / Edge", status: "通过" },
          { id: "T07", name: "课程成果文件检查", meta: "2026-08-15 · Chrome / Edge", status: "通过" },
          { id: "T09", name: "本地存储与移动端", meta: "2026-08-15 · Chrome / Edge", status: "通过" }
        ]
      },
      data: {
        head: "GIS课程数据来源与空间图层",
        sub: "4 图层已登记",
        rows: [
          { id: "DS-01", name: "campus.geojson", meta: "课程实验自建合成数据", code: "EPSG:4326 · 2个建筑要素", status: "来源已标注" },
          { id: "DS-02", name: "sample_3dtiles/tileset.json", meta: "自建结构样例", code: "3D Tiles 1.1 · 不含第三方模型", status: "来源已标注" },
          { id: "DS-03", name: "DEM 30m", meta: "演示图层元数据", code: "在线部署版需登记实际数据来源", status: "来源已标注" },
          { id: "DS-04", name: "能力评分数据", meta: "本地规则生成", code: "非真实学生数据", status: "来源已标注" }
        ]
      },
      compliance: {
        head: "合规与安全边界",
        sub: "审查状态：通过",
        rows: [
          { id: "✓", name: "隐私最小化", desc: "不收集身份证、精确定位与人脸等敏感信息" },
          { id: "✓", name: "上传边界", desc: "当前前端版仅读取文件名和大小，不向外部上传" },
          { id: "✓", name: "AI标识", desc: "课程导师与评价明确标注AI生成，并要求教师复核" },
          { id: "✓", name: "数据许可", desc: "课程实验只使用已授权或自建的合成数据" },
          { id: "✓", name: "密钥安全", desc: "前端不包含任何API密钥" }
        ]
      }
    }
  }
};

/* 暴露到全局，供 main.js 读取 */
if (typeof window !== "undefined") window.CONFIG = CONFIG;
