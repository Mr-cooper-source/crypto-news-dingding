# Crypto-News-DingDing

## 项目简介

Crypto-News-DingDing 是一个轻量的钉钉机器人程序，用于定时获取最新的加密货币快讯 (数据来源于 BlockBeats)，并将获取到的快讯内容推送到指定的钉钉群组。该项目基于 Cloudflare Workers 构建，免费、高效、稳定和易于部署。

![预览图](https://pic.otaku.ren/20241019/AQADvsIxG33loFR9.jpg)

## 快速开始

### 前置条件

- **Node.js**: 请确保已安装 [Node.js](https://nodejs.org/)（推荐版本 >=18）。

### 本地运行

1. **克隆仓库**

   ```bash
   git clone https://github.com/beilunyang/crypto-news-dingding.git
   cd crypto-news-dingding
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **配置环境变量**

   复制 `wrangler.example.toml` 为 `wrangler.toml` 并填入相关配置：

   ```bash
   cp wrangler.example.toml wrangler.toml
   ```

   然后编辑 `wrangler.toml` 文件，填写以下字段：

   ```toml:path/to/wrangler.toml
   # wrangler.toml
   name = "crypto-news-dingding"
   main = "src/index.ts"
   compatibility_date = "2024-10-16"
   compatibility_flags = [ "nodejs_compat" ]

   account_id = "你的Cloudflare账户ID"

   [vars]
   DINGDING_ACCESS_TOKEN = "你的钉钉机器人 Access Token"
   DINGDING_SECRET_KEY = "你的钉钉机器人 Secret Key"

   [[kv_namespaces]]
   binding = "CRYPTO_NEWS_DINGDING_KV"
   id = "你的 KV 命名空间 ID"

   [triggers]
   crons = ["*/1 * * * *"]
   ```

4. **本地开发**

  运行如下命令：
   ```bash
   npm run dev
   ```

   这将启动一个本地服务器，你可以在浏览器中访问进行测试。

### 部署到 Cloudflare Workers

本地运行如下命令：
   ```bash
   npm run deploy
   ```

### Github Actions 自动部署
要使用 GitHub Actions 部署 Cloudflare Workers，需要在 GitHub 仓库中设置 Secrets：

在你的 GitHub 仓库中，导航到 Settings -> Secrets and variables -> Actions，并添加以下 Secrets：
- DINGDING_ACCESS_TOKEN：你的钉钉机器人 Access Token
- DINGDING_SECRET_KEY：你的钉钉机器人 Secret Key
- CLOUDFLARE_ACCOUNT_ID：你的 Cloudflare 账户 ID
- CLOUDFLARE_KV_NAMESPACE_ID：你的 KV 命名空间 ID
- CLOUDFLARE_API_TOKEN：用于部署的 Cloudflare API Token

配置好后，当推送代码到 master 分支，GitHub Actions 工作流将会使用这些 Secrets 动态生成 wrangler.toml 配置文件并自动部署您的 Cloudflare Workers。

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/beilunyang/crypto-news-dingding)

## 未来计划

- [ ] 增加更多加密新闻数据源
- [ ] 增加更多功能

## 贡献

欢迎贡献者为 Crypto-News-DingDing 项目做出贡献！请按照以下步骤进行：

1. **Fork 本仓库**

2. **基于 master 创建新分支**

   ```bash
   git checkout -b feature/你的功能
   ```

3. **提交更改**

   ```bash
   git commit -m "添加了某某功能"
   ```

4. **推送到分支**

   ```bash
   git push origin feature/你的功能
   ```

5. **创建 Pull Request**

   请描述你的更改和原因

## 赞助
<img src="https://pic.otaku.ren/20240212/AQADPrgxGwoIWFZ-.jpg" style="width: 400px;"/>
<br />
<br />
<a href="https://www.buymeacoffee.com/beilunyang" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="width: 400px;" ></a>

## License

MIT License.
