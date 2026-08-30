/* =====================================================================
 * GeoStudy AI · 课程导师 DeepSeek 代理（零依赖 Node 服务）
 * ---------------------------------------------------------------------
 * 作用：把浏览器发来的请求转发给 DeepSeek，密钥只保存在服务端，
 *       前端不直接持有任何密钥，也规避 DeepSeek 的浏览器 CORS 限制。
 *
 * 运行： node mentor-proxy.js
 * 前端 config.js 的 mentor.deepseek.proxyUrl 指向 http://localhost:8787/api/deepseek
 *
 * 安全提示：本文件的 API Key 仅用于本地 / 演示。若公开发布或上架，
 *       请改为环境变量 DEEPSEEK_API_KEY 并轮换密钥，不要提交到仓库。
 * ===================================================================== */
const http = require("http");
const https = require("https");
const { URL } = require("url");

const API_KEY = process.env.DEEPSEEK_API_KEY || "sk-f69ac2e75c134b11839d62a52b1be355";
const TARGET = "https://api.deepseek.com/chat/completions";
const PORT = process.env.PORT || 8787;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }
  if (req.method === "POST" && req.url === "/api/deepseek") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const u = new URL(TARGET);
      const r = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + API_KEY }
        },
        (dr) => {
          let out = "";
          dr.on("data", (d) => (out += d));
          dr.on("end", () => {
            res.writeHead(dr.statusCode, { "Content-Type": "application/json" });
            res.end(out);
          });
        }
      );
      r.on("error", (e) => {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String((e && e.message) || e) }));
      });
      r.write(body);
      r.end();
    });
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  console.log("[mentor-proxy] DeepSeek 转发服务已启动：http://localhost:" + PORT + "/api/deepseek");
  console.log(
    "[mentor-proxy] 密钥来源：" +
      (process.env.DEEPSEEK_API_KEY ? "环境变量 DEEPSEEK_API_KEY" : "内置默认值（演示用）")
  );
});
