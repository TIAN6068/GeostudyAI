/* =====================================================================
 * GeoStudy AI · 统一 Web 服务（静态资源 + DeepSeek 代理）
 * ---------------------------------------------------------------------
 * 作用：
 *   1) 提供静态文件（index.html / config.js / main.js / style.css / assets/...）
 *   2) 代理 DeepSeek 聊天接口（POST /api/deepseek），密钥只保存在服务端环境变量
 *   3) 单进程同端口，Railway / 反向代理场景只需暴露一个 PORT
 *
 * 运行：   node mentor-proxy.js
 * 环境：
 *   PORT               监听端口（Railway 会自动注入；本地默认 8787）
 *   DEEPSEEK_API_KEY   DeepSeek 密钥（推荐通过环境变量传入；缺省回退到内置 demo key）
 *
 * 端点：
 *   GET  /*              静态文件（缺失时回退 index.html，支持 SPA）
 *   POST /api/deepseek   转发到 https://api.deepseek.com/chat/completions
 *
 * 安全提示：
 *   - 内置默认 key 仅用于本地/演示，请通过 Railway Variables 注入 DEEPSEEK_API_KEY
 *   - 不要把真实生产 key 提交到仓库；本仓库为公开仓库时务必使用环境变量
 * ===================================================================== */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const API_KEY =
  process.env.DEEPSEEK_API_KEY || "sk-f69ac2e75c134b11839d62a52b1be355";
const TARGET = "https://api.deepseek.com/chat/completions";
const PORT = process.env.PORT || 8787;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".txt":  "text/plain; charset=utf-8",
  ".md":   "text/plain; charset=utf-8"
};

function send(res, status, body, type, extraHeaders) {
  const headers = Object.assign(
    { "Content-Type": type || "application/json; charset=utf-8" },
    extraHeaders || {}
  );
  res.writeHead(status, headers);
  res.end(body);
}

function serveStatic(req, res, pathname) {
  let rel = pathname === "/" ? "/index.html" : pathname;

  // 防路径穿越 + 不对外提供点文件（.gitignore / .workbuddy / .git 等）
  const base = path.basename(rel);
  if (base.startsWith(".")) {
    return send(res, 404, "not found", "text/plain");
  }
  const filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) {
    return send(res, 403, "forbidden", "text/plain");
  }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      // SPA 回退：未知路径返回 index.html
      return fs.readFile(path.join(ROOT, "index.html"), (e2, data) => {
        if (e2) return send(res, 500, "internal error", "text/plain");
        send(res, 200, data, MIME[".html"], { "Cache-Control": "no-cache" });
      });
    }
    fs.readFile(filePath, (e3, data) => {
      if (e3) return send(res, 500, "read error", "text/plain");
      const ext = path.extname(filePath).toLowerCase();
      send(
        res,
        200,
        data,
        MIME[ext] || "application/octet-stream",
        { "Cache-Control": "public, max-age=300" }
      );
    });
  });
}

const server = http.createServer((req, res) => {
  // CORS（即便同源也留着，方便日后拆分到独立子域）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const urlObj = new URL(req.url, "http://localhost");
  const pathname = urlObj.pathname;

  // 1) DeepSeek 代理
  if (req.method === "POST" && pathname === "/api/deepseek") {
    if (!API_KEY) {
      return send(
        res,
        500,
        JSON.stringify({ error: "DEEPSEEK_API_KEY 未配置" })
      );
    }
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const u = new URL(TARGET);
      const r = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY
          }
        },
        (dr) => {
          let out = "";
          dr.on("data", (d) => (out += d));
          dr.on("end", () => {
            res.writeHead(dr.statusCode || 502, {
              "Content-Type": "application/json"
            });
            res.end(out);
          });
        }
      );
      r.on("error", (e) => {
        send(
          res,
          502,
          JSON.stringify({ error: String((e && e.message) || e) })
        );
      });
      r.write(body);
      r.end();
    });
    return;
  }

  // 2) 静态文件 / SPA
  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res, pathname);
  }

  send(res, 404, JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  console.log("[geostudy] Listening on :" + PORT);
  console.log(
    "[geostudy] DeepSeek key: " +
      (process.env.DEEPSEEK_API_KEY
        ? "env DEEPSEEK_API_KEY ✓"
        : "内置默认值（建议通过环境变量注入）")
  );
  console.log("[geostudy] Endpoints: GET /* (static + SPA) | POST /api/deepseek");
});
