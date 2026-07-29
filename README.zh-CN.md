<p align="center">
  <img src="public/xy-logo-transparent.png" alt="TokenFleet" width="160" />
</p>

<h1 align="center">TokenFleet Landing</h1>

<p align="center">
  TokenFleet 的公开 Astro 官网：面向工程团队与企业采购的一站式 AI 模型 API 网关落地页。
</p>

<p align="center">
  简体中文 · <a href="README.md">English</a>
</p>

<p align="center">
  <strong>Astro 6</strong> · <strong>静态模型列表页</strong> · <strong>AI SEO 端点</strong> · <strong>OpenAI 兼容接入叙事</strong>
</p>

> [!NOTE]
> 这个仓库包含静态官网、模型目录与面向 SEO / AI 引擎的生成页面，不包含 TokenFleet API 服务端或控制台应用。

## 项目概览

TokenFleet Landing 是 **TokenFleet** 的公开站点。它以中文为默认语言，同时提供 `/en` 英文版本，传达“一把 API key、OpenAI 兼容接入、人民币对公结算、增值税发票，以及可搜索的生产模型目录”的产品定位。

| 项目         | 说明                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| 框架         | Astro 6 静态站点                                                             |
| 交互         | Vanilla browser scripts：代码 tab、复制、筛选、排序、二维码弹层、reveal 动效 |
| 多语言       | 中文 `/`，英文 `/en`                                                         |
| 主要路由     | `/`、`/models`、`/en`、`/en/models`                                          |
| 机器可读路由 | `/sitemap.xml`、`/llms.txt`、`/pricing.md`、`/robots.txt`                    |
| 目录数据源   | 根目录 `pricing-api.json` 快照                                               |
| 当前目录     | 15 个 AI 模型，来自 5 家活跃厂商；源快照注册了 13 家厂商                     |
| 质量门禁     | ESLint、Prettier、`astro check`、生产构建、GitHub Actions CI                 |
| 构建产物     | 输出到 `dist/` 的静态文件                                                    |

## 目录

- [亮点](#亮点)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [可用脚本](#可用脚本)
- [页面路由](#页面路由)
- [项目结构](#项目结构)
- [关键文件](#关键文件)
- [更新模型目录](#更新模型目录)
- [部署说明](#部署说明)
- [持续集成](#持续集成)

## 亮点

- **双语官网**：中文与英文共用 Astro 组件，所有界面文案集中在 `src/i18n.ts`。
- **静态、可抓取的模型目录**：基于 `pricing-api.json` 生成，单列 hairline 分隔的列表行（`ModelRow.astro`），支持厂商筛选、类型筛选、搜索、名称排序与 URL 状态同步，并展示每个模型的 TPM / RPM 限速。
- **AI 搜索入口**：构建期生成 `llms.txt` 站点上下文与 `pricing.md` 机器可读定价快照（输入 / 输出价、计费方式、上下文窗口）。
- **结构化数据链路**：站点级 Organization / WebSite schema 与首页 FAQPage。
- **OpenAI 兼容接入示例**：首屏提供 `curl`、Python、Node 示例，支持复制与键盘可用的 tab。
- **企业能力表达**：覆盖统一计费、人民币对公结算、增值税发票、VPC/私有部署、SLA 沟通与专属技术联系人。
- **可访问性基础**：skip link、语义化页面与列表行、可见焦点态、无 JS 可抓取内容、reduced-motion 与响应式布局。

## 技术栈

| 层级       | 技术                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| 站点框架   | [Astro](https://astro.build/) 6                                                                           |
| 样式       | Plain CSS、设计 token、按钮原语、Tailwind CSS 4 Vite plugin                                               |
| 语言       | TypeScript 6 + Astro components                                                                           |
| 数据       | 构建期读取 `pricing-api.json`，并结合 `src/data/model-meta.ts` 与 `src/data/model-limits.ts` 的人工元信息 |
| 浏览器行为 | 小交互使用 Vanilla JavaScript；当前没有 React island 依赖                                                 |
| 图片       | `public/` 静态资源，二维码通过 `astro:assets` 处理                                                        |
| SEO        | 自定义 sitemap、canonical / hreflang、Open Graph 图、JSON-LD helpers、`llms.txt`、`pricing.md`            |
| 质量       | ESLint、Prettier + `prettier-plugin-astro`、`@astrojs/check`、GitHub Actions                              |

## 快速开始

### 环境要求

- Node.js 22.12 或更高版本
- npm

### 安装依赖

```sh
npm install
```

### 本地开发

```sh
npm run dev
```

Astro 会在终端输出本地开发地址，通常是 `http://localhost:4321`。

### 生产构建

```sh
npm run build
```

### 本地预览构建产物

```sh
npm run preview
```

## 可用脚本

| 命令                   | 说明                                              |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | 启动 Astro 开发服务器。                           |
| `npm run build`        | 构建静态站点到 `dist/`。                          |
| `npm run preview`      | 以 host 绑定方式本地预览生产构建。                |
| `npm run check`        | 运行 `astro check` 做类型与内容诊断。             |
| `npm run lint`         | 对 Astro、JS、MJS、TS、TSX、JSX 源码运行 ESLint。 |
| `npm run format:check` | 使用 Prettier 校验格式，不写回文件。              |
| `npm run astro`        | 直接运行 Astro CLI 命令。                         |

## 页面路由

| 路由           | 用途                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------- |
| `/`            | 中文落地页，包含首屏、模型精选、商务、企业能力与 FAQ。                                        |
| `/en`          | 英文落地页，与中文页共用 `HomePage.astro`。                                                   |
| `/models`      | 中文模型目录：hairline 分隔的列表行，支持厂商 / 类型筛选、搜索、名称排序与 TPM / RPM 限速列。 |
| `/en/models`   | `/models` 的英文版本。                                                                        |
| `/404`         | 自定义 noindex 未找到页，提供回首页和模型页的恢复入口。                                       |
| `/sitemap.xml` | 构建期 XML sitemap，包含 zh-CN / en / x-default alternate（仅首页与模型列表页）。             |
| `/llms.txt`    | 构建期 AI 助手可读站点摘要与完整模型列表。                                                    |
| `/pricing.md`  | 构建期 Markdown 定价快照，供代理和比价引擎读取。                                              |

## 项目结构

```text
docs/                  产品、设计与维护文档
public/                静态图片、favicon、OG 图、robots.txt 与品牌标识
public/ai-brand-logo/  列表行使用的 LobeHub 厂商 SVG 本地快照
public/images/         各 section 使用的营销图像
src/assets/            被组件 import 的二维码资源
src/components/        页面区块与可复用 Astro 组件
src/data/              价格加载、模型元信息与人工维护的限速数据
src/i18n.ts            语言类型、路径 helper 与中英文 UI 字典
src/layouts/           共享 HTML 外壳、metadata、JSON-LD 与全局导入
src/pages/             Astro 路由，包含生成式 SEO endpoints
src/seo/               JSON-LD helpers、FAQ 生成与 sitemap 页面清单
src/styles/            全局 CSS、设计 token、Tailwind 入口与按钮样式
```

## 关键文件

| 文件                                  | 作用                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `src/components/HomePage.astro`       | 中英文落地页的共享组合入口。                                                      |
| `src/components/ModelsPage.astro`     | 中英文模型目录页的共享页面外壳（hero + explorer）。                               |
| `src/components/ModelsExplorer.astro` | 可抓取目录列表工具栏，以及 Vanilla JS 厂商 / 类型筛选、搜索、名称排序、URL 状态。 |
| `src/components/ModelRow.astro`       | 目录列表中的一行模型（名称、ID、类型、TPM、RPM）。                                |
| `src/components/FeaturedModels.astro` | 首页精选模型区，由硬编码的 `featuredModelIds` 列表驱动。                          |
| `src/data/pricing.ts`                 | 导入 `pricing-api.json`，处理厂商、价格格式、模型形态与目录数据。                 |
| `src/data/model-meta.ts`              | 人工维护的上下文窗口、最大输出、官方文档链接（被 `pricing.md` 消费）。            |
| `src/data/model-limits.ts`            | 人工维护的每个模型 TPM / RPM 限速（被 `ModelRow.astro` 消费）。                   |
| `src/i18n.ts`                         | 双语 UI 文案、SEO 标题、FAQ、精选模型一句话描述与路由标签。                       |
| `src/seo/pages.ts`                    | 可索引页面注册表（仅首页 + 模型列表页；详情页已移除）。                           |
| `src/seo/schema.ts`                   | 站点级 Organization / WebSite / FAQPage JSON-LD。                                 |
| `src/pages/llms.txt.ts`               | 构建期 `llms.txt` endpoint。                                                      |
| `src/pages/pricing.md.ts`             | 构建期机器可读定价 endpoint。                                                     |
| `src/pages/sitemap.xml.ts`            | 自定义 sitemap endpoint，带 hreflang alternates。                                 |
| `src/site-links.ts`                   | 控制台、登录、文档等外部链接的单一来源。                                          |
| `src/layouts/Base.astro`              | 文档外壳、canonical / alternate、Open Graph、JSON-LD、skip link 与 reveal 行为。  |

> [!NOTE]
> 模型详情页（`/models/[slug]`、`/en/models/[slug]`）及其组件（`ModelCard.astro`、`ModelDetailPage.astro`、`ModelDetail.astro`）与 `src/data/model-slug.ts` 已改为单一静态列表页而移除，sitemap 不再收录单模型 URL。完整维护流程见 [`docs/model-catalog-maintenance.md`](docs/model-catalog-maintenance.md)。

## 更新模型目录

模型目录在构建时读取根目录 `pricing-api.json` 快照；该文件应与 `https://tokenfleet.cn/api/pricing` 保持一致。模型相关信息分散在七个维护点（JSON 快照 + 六个人工维护的文件）。**完整操作流程——新增 / 下线 / 改名模型，以及调整 TPM / RPM——见 [`docs/model-catalog-maintenance.md`](docs/model-catalog-maintenance.md)。**

各维护点速查：

| 文件                                  | 在此编辑                                                     |
| ------------------------------------- | ------------------------------------------------------------ |
| `pricing-api.json`                    | 从 API 刷新快照；价格在此只读。                              |
| `src/data/pricing.ts`                 | 展示名、模型类型、模态、厂商 slug、图标的覆盖表。            |
| `src/data/model-meta.ts`              | 上下文窗口、最大输出、官方文档链接（被 `pricing.md` 消费）。 |
| `src/data/model-limits.ts`            | **TPM / RPM 限速**（`/models` 列表展示，API 不暴露该字段）。 |
| `src/i18n.ts`                         | `featured.blurbs`：首页精选模型的一句话描述（中英两份）。    |
| `src/components/FeaturedModels.astro` | `featuredModelIds`：首页精选区展示哪些模型。                 |
| `public/ai-brand-logo/`               | LobeHub 厂商图标 SVG 本地快照。                              |

每次改动后，本地复现 CI：

```sh
npm run format:check && npm run lint && npm run build && npm run check
```

> [!IMPORTANT]
> 绝不臆造数值。无法从上游 API 或厂商文档核实的字段一律留空——缺失的 TPM / RPM 与上下文窗口会以 `—` 展示，这是设计意图。

> [!TIP]
> sitemap 只收录 `/`、`/en`、`/models`、`/en/models`，已无单模型详情路由，因此新增模型无需手动加 sitemap 条目。

## 部署说明

站点在 `astro.config.mjs` 中配置了：

- `site: 'https://tokenfleet.cn'`
- `trailingSlash: 'never'`
- 压缩 HTML 输出
- 构建资源输出到 `_assets`
- 通过 Vite plugin 接入 Tailwind CSS 4

生产构建产物会写入 `dist/`，可以部署到任意静态托管平台。

## 持续集成

`.github/workflows/ci.yml` 会在每次 push 到 `main` 或目标为 `main` 的 PR 上运行：

1. `actionlint` 检查工作流文件
2. Node.js 22 下执行 `npm ci`
3. `npm run format:check`
4. `npm run lint`
5. `npm run build`
6. `npm run check`

> [!TIP]
> 推送前运行 `npm run format:check && npm run lint && npm run build && npm run check`，可以在本地提前复现 CI。
