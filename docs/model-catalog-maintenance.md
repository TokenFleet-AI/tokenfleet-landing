# 模型目录维护指南

面向仓库维护者。 `/models`（中文）与 `/en/models`（英文）目录页及其衍生产物（`/llms.txt`、`/pricing.md`、`/sitemap.xml`）全部在 **构建期** 由数据文件生成，运行时无请求、无 CORS。本文档说明这些模型相关信息的来源、职责边界，以及「新增 / 下线 / 改名 / 调价 / 改限速」时的标准操作流程。

快照 `pricing-api.json` **已由 `sync-models` workflow 每日自动刷新并开 PR**（见第 2 节），人工只需审阅 PR 并补机器无法推断的字段。

> 真值原则：**绝不臆造数值**。任何无法从上游核实的字段一律留空，渲染为 `—`，而不是填一个看起来合理的数字。这是 TokenFleet 对工程师与采购双层可信度的底线（见 `PRODUCT.md` Brand Personality）。

---

## 1. 数据流总览

```text
https://tokenfleet.cn/api/pricing
        │
        │  scripts/sync-pricing.mjs   （sync-models workflow 每日跑，有变化才开 PR）
        ▼
pricing-api.json  ──┐
                    ├─▶  src/data/pricing.ts     （目录加载 + 价格 + 厂商 + 模态 + 图标）
                    │        ├─▶ src/components/ModelsPage.astro
                    │        │       └─▶ src/components/ModelsExplorer.astro
                    │        │              └─▶ src/components/ModelRow.astro  （一行一模型）
                    │        ├─▶ src/pages/llms.txt.ts        （AI 上下文）
                    │        ├─▶ src/pages/pricing.md.ts      （机器可读价格）
                    │        └─▶ src/pages/sitemap.xml.ts     （可索引页面清单）
                    │
src/data/catalog-overrides.ts ─▶ 展示名 / 类型归类 / 图标 slug  （被 pricing.ts 消费）
src/data/featured.ts          ─▶ 四组人工选集                    （被首页组件消费）
src/data/model-meta.ts        ─▶ contextK / maxOutputK / docs   （被 pricing.md.ts 消费）
src/data/model-limits.ts      ─▶ tpm / rpm                       （被 ModelRow.astro 消费）

scripts/check-catalog.mjs     ── 把上述人工数据与快照对账（npm run check:catalog，已接入 ci.yml）
```

- 模型列表页**不再有详情页**。卡片 + 对话框方案已于 `task 07-29-models-static-list-page` 移除，现改为单列 hairline 分隔的列表行（`ModelRow.astro`），五列：模型名 | 模型 ID | 类型 | TPM | RPM。`/models/<slug>`、`/en/models/<slug>` 路由已删除，sitemap 也不再收录（见 `src/seo/pages.ts`）。
- 所有列表页内容按 `model_name`（API 模型 ID）作为主键关联各数据源。**键名必须是 `pricing-api.json` 里的 `model_name` 原值**（区分大小写，例如 `MiniMax-M2.7`、`glm-5.1`），不要用展示名或自造 slug。

---

## 2. 自动同步（`sync-models` workflow）

### 2.1 触发与产出

`.github/workflows/sync-models.yml`：

- **定时**：cron `0 22 * * *`（UTC）= 每天北京时间 06:00。
- **手动**：`workflow_dispatch`，带一个 `allow_shrink` 布尔输入（含义见 2.3）。
- 流程：`scripts/sync-pricing.mjs` 拉取 → 安全阀 → 归一化 → 写 `pricing-api.json` → 无 diff 则**直接结束，不开 PR、不产生空提交**；有 diff 则跑完整自检序列（`format:check` / `lint` / `build` / `check` / `check:catalog`），再用 `peter-evans/create-pull-request` 在固定分支 `automation/model-catalog-sync` 上开 / 更新 PR。
- PR **只改 `pricing-api.json`**（`add-paths` 限定），正文包含变更摘要（新增 / 下线 / 调价 / 厂商变动）、自检结果表，以及 `check:catalog` 列出的待补人工字段 checklist。
- 合并由人工点击。**注意**：该 PR 由默认 `GITHUB_TOKEN` 创建，GitHub 为防递归**不会**为它触发 `ci.yml`，所以完整检查在 workflow 内已经跑过一遍、结果写进了正文；若确实需要 PR 上的状态检查，close 再 reopen 该 PR 即可触发。

### 2.2 手动跑同步

```sh
TF_USERNAME=... TF_PASSWORD=... npm run sync:models -- --dry-run
```

| 参数                    | 作用                                                      |
| ----------------------- | --------------------------------------------------------- |
| `--dry-run`             | 只报告变更，不写盘                                        |
| `--allow-shrink`        | 放行模型数腰斩（见 2.3）                                  |
| `--summary-file <path>` | 把 markdown 摘要另写一份到文件（workflow 用它拼 PR 正文） |

环境变量：

| 变量                 | 说明                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `TF_USERNAME`        | 必填，专用只读账号的用户名                                                                              |
| `TF_PASSWORD`        | 必填，其密码                                                                                            |
| `TF_PRICING_FIXTURE` | 可选，指向一份本地 JSON，**跳过登录与网络**直接用它当上游响应。仅供离线调试脚本逻辑，**不要在 CI 里设** |

摘要写 stdout（以及存在时的 `$GITHUB_STEP_SUMMARY`），进度与错误写 stderr；凭证与 session cookie 不会出现在任何输出里。

### 2.3 安全阀

以下任一条件命中即 `exit 1` 且**绝不写盘**：

| 条件                             | 理由                                                    |
| -------------------------------- | ------------------------------------------------------- |
| 登录失败 / 拿不到 session cookie | 凭证问题                                                |
| HTTP 非 2xx、超时、JSON 解析失败 | 网络或网关异常                                          |
| `success !== true`               | 上游显式报错                                            |
| **`data` 为空**                  | 见下方警告 —— 唯一能拦住「凭证失效 → 目录被清空」的防线 |
| `vendors` 为空                   | 同上量级的异常                                          |
| 某条模型缺 `model_name`          | 快照不可用                                              |
| 模型数较现快照下降超 50%         | 疑似分组配置事故，需人工判断                            |

> **不要把 `data` 为空这一条「优化」掉。** `/api/pricing` 走 newAPI 的 `TryUserAuth`，鉴权失败时**静默降级为匿名**而不是报 401 —— 密码过期、账号被停用、session 失效，全部表现为 HTTP 200 + `success: true` + `data: []`，与正常响应唯一的区别就是那个空数组。

模型数腰斩只有在人工确认过确实发生了大规模下架时才放行：手动 `workflow_dispatch` 勾选 `allow_shrink`，或本地加 `--allow-shrink`。

### 2.4 归一化（防噪音 PR）

上游返回的数组顺序不保证稳定，直接写盘会天天产生无意义 diff。写盘前脚本统一：

- 顶层键按字母序输出；`data[]` 按 `model_name` 升序；`vendors[]` 按 `id` 升序；模型内 `enable_groups`、`supported_endpoint_types` 升序。
- 保留 API 返回的**全部顶层字段**（快照定位仍是「API 镜像」），只有一个例外：**模型级的 `pricing_version` 被丢弃**。上游每次响应会把这个哈希随机挂到某一个模型上（实测约一半响应根本没有，有的时候值还相同但挂在不同模型上），保留它会让约每隔一次同步就产生一行无意义 diff，而且会让快照断言一件不成立的事。顶层的 `pricing_version` 是稳定的，予以保留。
- 用 Prettier Node API（读仓库 `.prettierrc`）格式化后写入 —— **必须**，因为 `pricing-api.json` 未被 `.prettierignore` 排除，`npm run format:check` 会检查它。

因此对同一份线上数据连续跑两次，第二次 `git diff` 为空。

### 2.5 凭证与轮换

Secrets：`TF_USERNAME` / `TF_PASSWORD`，存在仓库 Settings → Secrets and variables → Actions。

**账号要求**：tokenfleet.cn 上**专用的普通只读账号** —— default 分组、无管理员权限、无余额、不建 API 令牌。仓库是 public，一旦 Secret 泄露，管理员凭证的爆炸半径是整站。

**这同时定义了快照的口径**：newAPI 按调用者的 `usable_group` 过滤 `data[]`，所以快照 = 「新注册用户现在就能调用的模型」。将来若上线仅对 svip / vip 开放的模型，它不会自动出现在 `/models` —— 这是有意的取舍，不是缺陷。

轮换步骤：

1. 在控制台改掉该账号的密码。
2. 更新 Secret（`gh` 会交互式提示粘贴，值不进 shell 历史）：

   ```sh
   gh secret set TF_PASSWORD --repo TokenFleet-AI/tokenfleet-landing
   # 若用户名也换了
   gh secret set TF_USERNAME --repo TokenFleet-AI/tokenfleet-landing
   ```

3. 手动 `workflow_dispatch` 触发一次 `sync-models` 验证：跑通即为成功（无变化时正常空跑），登录失败会在 exit 1 且不动快照。

> **为什么不能用 access token。** 2026-07-31 实测：`/api/pricing` 只认浏览器 session cookie。带合法 access token（哪怕是 default 分组的管理员令牌）并配上正确的数字 `New-API-User`，返回的仍是空 `data`；`sk-` 开头的渠道令牌与匿名请求的输出完全一致。同一账号用浏览器 session 请求则能拿到完整目录。因此脚本只能走 `POST /api/user/login` 换 session cookie 再拉取。另：`/v1/models` 对渠道令牌可用，但每条只有 id，无任何价格字段，不能作数据源。

---

## 3. 计数是自动派生的，选集是人工编排的

理解整套机制的关键，是把这两类东西分开：

| 类别     | 内容                                                                                         | 新增模型时的行为             |
| -------- | -------------------------------------------------------------------------------------------- | ---------------------------- |
| **计数** | 首页 / WhyUs / 模型页的模型总数、活跃厂商数，以及 WhyUs A 卡的 `+N 更多`                     | **自动 +1**，无需人工维护    |
| **选集** | 首页精选 7 卡、WhyUs A 卡的模型名网格、首页代码示例的模型 ID、WhyUs C 卡 endpoint demo 的 ID | **原样不动**，需要时人工编排 |

所有计数都走 `totalModelCount()` / `usedVendors()` 或 `(total) => ...` 形式的函数插值（`Hero.astro`、`FeaturedModels.astro`、`WhyUs.astro`、`ModelsPage.astro`、`ModelsExplorer.astro`、`i18n.ts` 的 SEO 标题与描述、`llms.txt.ts`、`pricing.md.ts`）。`i18n.ts` 里**没有任何写死的模型数 / 厂商数**，同步后不需要改文案。

所以一次自动同步引入新模型的正确表现是：**首页 7 张卡片与 WhyUs 名字列表逐字不变，而总数、厂商数、`+N 更多` 自动递增。** `check:catalog` 也据此设计 —— 「新模型没进某个选集」是软警告，不是错误。

---

## 4. 九个维护点

| #   | 文件                              | 人工 / 自动 | 职责                                                                     |
| --- | --------------------------------- | ----------- | ------------------------------------------------------------------------ |
| 1   | `pricing-api.json`                | **自动**    | 模型清单、价格 ratio、厂商、计费方式                                     |
| 2   | `src/data/featured.ts`            | 人工        | **四组模型 ID 选集**（首页精选 / WhyUs 网格 / 代码示例 / endpoint demo） |
| 3   | `src/data/catalog-overrides.ts`   | 人工        | 展示名、模型类型归类、无彩色品牌集、图标 slug 推导                       |
| 4   | `src/data/pricing.ts`             | 人工        | 厂商 slug、厂商英文名、模态启发、价格公式                                |
| 5   | `src/data/model-meta.ts`          | 人工        | 上下文窗口、最大输出、官方文档链接                                       |
| 6   | `src/data/model-limits.ts`        | 人工        | **TPM / RPM 限速**                                                       |
| 7   | `src/i18n.ts`                     | 人工        | `featured.blurbs`（中英两份），以及文案里举例的厂商名                    |
| 8   | `src/components/BrandStrip.astro` | 人工        | 首页厂商 logo 条的 SVG 文件名与标签                                      |
| 9   | `public/ai-brand-logo/`           | 人工        | 厂商 / 品牌 SVG 图标本地快照                                             |

下文逐个说明编辑方式。

### 4.1 `pricing-api.json` — 目录快照

- 位于仓库根目录，镜像 `https://tokenfleet.cn/api/pricing`（default 分组口径，见 2.5）。镜像有且只有一个例外 —— 模型级的 `pricing_version` 会被剥掉，理由见 2.4；比对快照与线上响应时不要把它当 bug。
- 结构：`{ auto_groups, data: [...RawModel], group_ratio, pricing_version, success, supported_endpoint, usable_group, vendors }`（归一化后按字母序）。
- **不要手改这个文件**：它由 `scripts/sync-pricing.mjs` 独占写入，任何手工编辑都会被下一次自动同步覆盖。价格一律以 API 为准，落地页只是只读快照。
- 当前快照：16 个模型、14 家注册厂商、5 家活跃厂商（被至少一个模型引用）。

关键字段（被 `pricing.ts` 消费）：

| 字段                                      | 含义                                                   |
| ----------------------------------------- | ------------------------------------------------------ |
| `model_name`                              | 主键，API 模型 ID，原样透传到列表页 ID 列与代码示例    |
| `vendor_id`                               | 关联 `vendors[].id`                                    |
| `quota_type`                              | `0` = 按 token 计费；`1` = 按次计费（多为图像 / 视频） |
| `model_ratio`                             | token 计费倍率，`1 ratio = $2 / 1M tokens`             |
| `completion_ratio`                        | 输出相对输入的倍率                                     |
| `cache_ratio` / `create_cache_ratio`      | 缓存命中 / 建缓存的输入倍率                            |
| `model_price`                             | 按次计费的单次价格（`quota_type === 1` 时生效）        |
| `has_graduated_pricing` / `pricing_tiers` | 阶梯定价                                               |
| `icon`                                    | 品牌图标字段，如 `"OpenAI.Color"`、`"Minimax.Color"`   |
| `supported_endpoint_types`                | `openai` / `anthropic` / `gemini` / `open`             |

### 4.2 `src/data/featured.ts` — 四组人工选集

首页与 WhyUs 里所有硬编码的模型 ID 都集中在这里（原先散落在三个 `.astro` 组件里）。集中的目的有二：一是 `check-catalog.mjs` 能在 Node 里读到同一份真源，二是下线模型时只有一个地方要清。**这个文件必须保持无 import**，否则 Node 的原生 type stripping 加载不了。

| 导出               | 消费方                 | 内容                                              | 下线模型不清理的后果                   |
| ------------------ | ---------------------- | ------------------------------------------------- | -------------------------------------- |
| `featuredModelIds` | `FeaturedModels.astro` | 首页精选 7 卡，数组顺序 = 展示顺序                | `.filter(Boolean)` 静默丢卡，无报错    |
| `marqueeIds`       | `WhyUs.astro` A 卡     | 模型名网格；未列入的折进 `+N 更多`（计数自动）    | 静默少一格                             |
| `SAMPLE_MODEL_ID`  | `CodeBlock.astro`      | 首页 curl / Python / Node 三份代码示例里的模型 ID | 首页教用户调用不存在的模型，复制即 400 |
| `endpointDemoIds`  | `WhyUs.astro` C 卡     | endpoint demo 轮播的 6 个 ID，首个渲染为激活态    | 同上，首页示范一个已下线的模型         |

四项的孤儿 ID 都是 `check:catalog` 的**硬错误**。C 卡的 `via …` 厂商标签由目录里的品牌 slug 派生，不需要跟着 ID 一起手填，因此永远不会和它标注的模型对不上。

### 4.3 `src/data/catalog-overrides.ts` — 覆盖表

从 `pricing.ts` 拆出来的纯常量表（同样**必须无 import**，理由同上）。

- `DISPLAY_NAME_OVERRIDES`：**展示名覆盖**。键 = `model_name`，值 = 用户可见的友好名（如 `glm-5.1 → GLM 5.1`）。缺失则回退到 `model_name` 本身。新增模型若 `model_name` 不适合直接展示（含连字符、版本号小写等），在此加一条。
- `TYPE_OVERRIDES`：**模型类型轴**（`language` / `multimodal` / `video`），用于列表页的「类型」筛选 chip。默认 `language`；视觉输入模型（如 `glm-5v-turbo`）显式标 `multimodal`，视频生成模型标 `video`。新增模型如不属于默认 `language`，必须在此显式归类，否则会被错放到「语言」桶。
- `NO_COLOR_VARIANT`（`Set(['openai','moonshot','anthropic'])`）：LobeHub 这些品牌**没有彩色图标**，强制剥掉 `-color` 后缀以免 404。新增厂商时若其 SVG 无彩色版，把 base slug 加进这个集合。
- `iconSlugFromField`：`icon` 字段 → 本地 SVG 文件名的推导（`OpenAI.Color → openai-color`）。`pricing.ts` 与 `check-catalog.mjs` 共用它，所以校验器和站点不可能对图标各说各话。

### 4.4 `src/data/pricing.ts` — 派生逻辑

把原始 JSON 变成 UI 模型的核心。**通常不需要改逻辑**，只改其中的常量映射表。

- `vendorSlugOverrides`（`{ 8: 'zhipu', 9: 'kuaishou' }`）：厂商筛选 chip 的 URL slug。中文名厂商需在此显式给 ASCII slug，保证 `?vendor=zhipu` 这类深链可读。新增中文名厂商时补一条。
- `vendorNameEn`（目前 `8 → Zhipu`、`9 → Kuaishou`、`11 → Xiaomi`、`13 → ByteDance`）：厂商英文展示名。**不只是 UI 英文版在用** —— `/llms.txt` 与 `/pricing.md` 的线上响应头不带 `charset`，任何非 ASCII 字符都会在浏览器里变乱码，所以新增中文名厂商时必须在此登记，否则中文名会直接漏进这两个文件。
- `modalityOf` / `VIDEO_HINTS` / `IMAGE_HINTS` / `AUDIO_HINTS`：按 `model_name` 子串启发判定模态（chat / image / video / audio），仅供 `llms.txt` 的模态标签。
- 价格函数 `priceBreakdown` / `priceLabel` / `fmtUsd`：已封装的计费公式，**不要在组件里重算价格**。需要新的价格展示形式时在此扩展。

> 价格公式（newAPI / oneAPI 约定，`BASE_USD_PER_MTOK = 2`）：
>
> - token 计费：`输入 = model_ratio × $2 / 1M`；`输出 = model_ratio × completion_ratio × $2 / 1M`；`缓存命中 = model_ratio × cache_ratio × $2 / 1M`。
> - 按次计费：`单次 = model_price × $2`。
> - 阶梯定价：在每段内对基线 ratio 乘 `tier.{input,output}_ratio_multiplier`。
>
> `scripts/sync-pricing.mjs` 的摘要里复刻了同一套公式（它无法 import `pricing.ts`，因为后者 import 了 JSON 快照）。改公式时两边都要改。

### 4.5 `src/data/model-meta.ts` — 上下文 / 最大输出 / 文档链接

- 键 = `model_name`。值 `{ contextK?, maxOutputK?, docs? }`。
- **仅被 `src/pages/pricing.md.ts` 消费**，用于 `pricing.md` 的 `Context` 列。`/models` 列表页本身不渲染这些字段。
- 缺失条目或缺失字段 → `pricing.md` 渲染 `—`，**不要编造**。
- 数据来源：各厂商官方文档，优先填 `docs` 链接以便核对。

### 4.6 `src/data/model-limits.ts` — TPM / RPM 限速（重点）

这是用户在 `/models` 列表页能直接看到的「TPM」「RPM」两列的唯一来源。**`pricing-api.json` 不暴露限速字段**，因此必须人工维护。

```ts
export interface ModelLimits {
  tpm?: number; // Tokens per minute
  rpm?: number; // Requests per minute
}

export const modelLimits: Record<string, ModelLimits> = {
  // TODO: populate with real TPM/RPM values per model (keyed by model_name).
};
```

维护要点：

- **键必须是 `pricing-api.json` 的 `model_name` 原值**，不是展示名。例如写 `'deepseek-v3.1'`，不是 `'DeepSeek V3.1'`。
- `tpm` / `rpm` 都是可选。只填了 `tpm` 没填 `rpm`，则 RPM 列显示 `—`，反之亦然。整条缺失则两列都显示 `—`。
- 渲染逻辑见 `ModelRow.astro`：`fmtLimit` 用 `n.toLocaleString('en-US')` 输出千分位（如 `1,000,000`）；`undefined` / `null` 输出 `—`。
- 数值来源：厂商官方限速文档或 TokenFleet 控制台配额。**拿到之前留空**，列表页会以 `—` 占位上线——这是设计意图（见文件顶部注释），不要填占位假数字。该表目前是空的，所以 `check:catalog` 会对每个模型各报一条软警告，属预期。
- 改完后跑 `npm run build`，访问 `/models` 或 `/en/models` 核对两列。

示例：

```ts
export const modelLimits: Record<string, ModelLimits> = {
  'deepseek-v3.1': { tpm: 1_000_000, rpm: 1_000 },
  'glm-5.2': { tpm: 500_000 }, // rpm 暂未知，留空显示 —
};
```

### 4.7 `src/i18n.ts` — `featured.blurbs` 与文案里的厂商名

- 首页精选区的模型一句话描述硬编码在 `i18n.zh.featured.blurbs` 与 `i18n.en.featured.blurbs`，键 = `model_name`。
- 中英文两份都要填，且**键集合必须一致**（`check:catalog` 对不一致报硬错误）。缺失时 `FeaturedModels.astro` 会回退到 `description`（API 快照里的中文描述）或 `fallbackBlurb`（"生产级模型接入" / "Production model access"）。
- 模型下线或改名时，记得删掉对应的 blurb —— 孤儿键同样是硬错误。
- 另外，hero、SEO 描述与 FAQ 文案里点名举例了几家厂商（"DeepSeek、Moonshot、MiniMax、智谱 等"）。这是营销文案不是派生数据，厂商阵容发生实质变化时才需要人工斟酌改写；**模型数与厂商数不在文案里写死**，无需跟着同步动。

### 4.8 `src/components/BrandStrip.astro` — 首页厂商 logo 条

- `logos` 数组直接写 `public/ai-brand-logo/` 下的 SVG 文件名与标签（含中英两版标签），目前 5 家：DeepSeek / Kimi · Moonshot / MiniMax / 智谱 GLM / 豆包。
- 这是编排过的品牌墙，不随快照自动变：**新增活跃厂商时若希望它出现在首页，需要手工加一行**；文件名写错会直接 404 出一个空位。

### 4.9 `public/ai-brand-logo/` — 品牌图标

- 本地 LobeHub Icons SVG 快照，文件名 = `<slug>.svg`，彩色版 `<slug>-color.svg`。
- `slug` 由 `iconSlugFromField`（见 4.3）从 `pricing-api.json` 的 `icon` 字段推导。
- 新增厂商 / 新图标时：把 SVG 放进此目录，文件名与推导出的 slug 一致；若品牌无彩色版，记得把它加入 `NO_COLOR_VARIANT`。
- `check:catalog` 在这里有两条硬错误：**推导出的 SVG 文件缺失**（页面裂图），以及**模型自身与其厂商都没有 `icon` 字段**（`iconSlugFromField` 回退成 `openai`，于是某个非 OpenAI 模型旁边堂而皇之地挂着 OpenAI 的 logo）。后者的判据是「输入为空」，不是「结果等于 `openai`」—— 真正的 OpenAI 模型推导出 `openai` 是对的。碰到这条要么补上游的 `icon` 字段，要么给该厂商登记图标。
- mono 变体缺失只是软警告：当前没有任何地方渲染 mono，它什么都没断言。
- 当前快照：11 个 SVG（deepseek / doubao / kimi / minimax / moonshot / openai / zhipu，部分有 mono + color 两版）。

---

## 5. `check:catalog`：两级一致性校验

```sh
npm run check:catalog            # 人读的纯文本
npm run check:catalog -- --markdown   # markdown（workflow 用来拼 PR 正文）
```

`scripts/check-catalog.mjs` 把上述人工数据与快照逐一对账，已接入 `ci.yml`，对所有 PR 生效。软警告在 CI 里还会追加进 `$GITHUB_STEP_SUMMARY`。

分级的依据是**空值 vs 假值**，不是「填没填全」：

- 缺 TPM / RPM、缺上下文窗口 → 页面渲染 `—`，那是一句诚实的「我们不知道」。真值原则允许它上线，所以只能是软警告 —— 判成失败的唯一解法就是编数字。
- 孤儿 ID、图标回退 → 页面会**断言一件不成立的事**：教用户调用一个已下线的模型，或在某厂商的模型旁边挂上 OpenAI 的 logo。这类必须硬失败。

方向上也对得起来：模型**离开**快照留下的是假值（且每一种失效都是静默的），模型**进入**快照留下的是空值。

**硬错误（exit 1）：**

| 检查                                                       | 静默后果                     |
| ---------------------------------------------------------- | ---------------------------- |
| `featuredModelIds` 含快照中不存在的 ID                     | 首页精选区少一张卡，无报错   |
| `marqueeIds` 含快照中不存在的 ID                           | WhyUs A 卡少一格             |
| `SAMPLE_MODEL_ID` 不在快照中                               | 首页代码示例复制即 400       |
| `endpointDemoIds` 含快照中不存在的 ID                      | C 卡示范一个已下线的模型     |
| `DISPLAY_NAME_OVERRIDES` / `TYPE_OVERRIDES` 有孤儿键       | 字典垃圾累积                 |
| `model-limits.ts` / `model-meta.ts` 有孤儿键               | 同上                         |
| `i18n` 中英 `featured.blurbs` 有孤儿键，或两边键集合不一致 | 字典垃圾 / 单语缺文案        |
| 某模型 `icon` 推导出的 SVG 在 `public/ai-brand-logo/` 缺失 | 图标 404                     |
| 某模型自身与其厂商**都没有 `icon` 字段**                   | 回退成 OpenAI 图标，张冠李戴 |

**软警告（exit 0）：**

| 检查                             | 现状表现                                 |
| -------------------------------- | ---------------------------------------- |
| 新模型未在 `TYPE_OVERRIDES` 归类 | 默认落入「语言」桶（文本模型本就该如此） |
| 新模型无 `model-limits.ts` 条目  | TPM / RPM 显示 `—`                       |
| 新模型无 `model-meta.ts` 条目    | `pricing.md` 的 Context 列显示 `—`       |
| 精选模型缺 blurb                 | 回退到 API description                   |
| 新模型未收录进 `marqueeIds`      | 折进 WhyUs 的 `+N 更多`，计数自动 +1     |
| 品牌 mono 变体 SVG 缺失          | 当前无人渲染 mono，属潜在问题            |

> **软警告为什么不能升级为硬错误。** 除了上面的空值 / 假值之分，还有一条：「新模型没进某个选集」若判为错误，就等于强制选集随目录膨胀，直接推翻第 3 节的设计。mono 变体缺失同理留在软警告 —— 当前没有任何地方渲染 mono，它什么都没断言。

---

## 6. 标准操作流程

### 6.1 新增一个模型

1. **快照**：等每日自动 PR，或手动跑 `npm run sync:models` / `workflow_dispatch`。确认新模型出现在 `data[]`。以下步骤都在这个 PR 上补（或另开 PR），按需选做。
2. **展示名**：若 `model_name` 不宜直接展示，在 `catalog-overrides.ts` 的 `DISPLAY_NAME_OVERRIDES` 加一条（中英通用，展示名不区分 locale）。
3. **模型类型**：若不是文本 LLM，在 `TYPE_OVERRIDES` 显式标 `multimodal` 或 `video`。
4. **限速**：拿到官方 TPM / RPM 后在 `model-limits.ts` 加一条；拿不到就留空。
5. **元信息**：在 `model-meta.ts` 加 `contextK` / `maxOutputK` / `docs`（至少填 `docs` 链接）。
6. **选集（可选）**：默认**什么都不用做** —— 计数会自动带上它。只有当你想让它进首页精选区 / WhyUs 网格 / 代码示例 / endpoint demo 时，才去改 `src/data/featured.ts`；进精选区的还要在 `i18n.ts` 的 `featured.blurbs`（中英两份）补一句话描述。
7. **图标**：确认 `public/ai-brand-logo/` 有对应 slug 的 SVG；缺失则补。若引入了新的活跃厂商，考虑同步 `BrandStrip.astro` 与 `pricing.ts` 的 `vendorNameEn` / `vendorSlugOverrides`。
8. **验证**：`npm run check:catalog` 应 exit 0（缺口以软警告列出）；`npm run build` 后检查 `/models`、`/en/models`、`/pricing.md`、`/llms.txt` 是否包含新模型且无 404 图标。

### 6.2 下线一个模型

1. 等自动同步把它从 `data[]` 移除（或手动跑一次）。
2. **清理人工数据**：`npm run check:catalog` 会把所有残留位置指名报出来 —— `featured.ts` 的四组选集、`catalog-overrides.ts` 的两张覆盖表、`model-limits.ts`、`model-meta.ts`、`i18n.ts` 的中英 `featured.blurbs`。逐条删干净直到 exit 0。
3. 验证 `npm run build` 无类型错误、首页精选卡片数量正常。

> 自动同步的 PR 正文也会在「下线模型」一节里列出它在 `model-limits.ts` / `model-meta.ts` / `featured.blurbs` 中的残留键，但**带退出码的权威检查是 `check:catalog`**（覆盖面更全，包括四组选集与覆盖表）。

### 6.3 改名一个模型（`model_name` 变更）

视为「下线旧 ID + 新增新 ID」：把人工数据里所有以旧 `model_name` 为键的条目改成新 `model_name`。`check:catalog` 会替你把旧键全部找出来（硬错误），改完跑到 exit 0 即为清干净。

### 6.4 调整 TPM / RPM

只改 `src/data/model-limits.ts` 对应 `model_name` 条目的 `tpm` / `rpm`。这是唯一需要动的文件。`npm run build` 后 `/models` 两列即更新。无需碰 `pricing-api.json`（限速不在 API 快照里）。

### 6.5 调价

价格由 `pricing-api.json` 决定，**不要改代码、也不要手改快照**。自动同步会带来新价格并在 PR 正文里给出「旧 → 新」对照，`pricing.ts` 的公式自动重算。若新模型引入了新的计费结构（新字段 / 新阶梯规则），才需要扩展 `priceBreakdown`。

---

## 7. 验证

每次改完，按 [`README.md`](../README.md) 的 CI 顺序本地复现：

```sh
npm run format:check && npm run lint && npm run build && npm run check && npm run check:catalog
```

> `scripts/` 下的两个脚本直接 import `.ts` 数据文件，依赖 Node 原生 TypeScript type stripping —— 需要 **Node 22.18+**（CI 的 `node-version: 22` 取最新 22.x，满足）。低于该版本会在加载 `src/data/*.ts` 时报错。

构建产物里重点核对：

- `dist/models/index.html` / `dist/en/models/index.html`：列表行数量、TPM/RPM 两列。
- `dist/pricing.md/index.html`（或 `/pricing.md` 路由产物）：模型行与 Context 列。
- `dist/llms.txt/index.html`（或 `/llms.txt`）：Models 清单。
- `dist/sitemap.xml/index.html`：仅 `/`、`/en`、`/models`、`/en/models` 四簇，**不应**含任何 `/models/<slug>`。

> 本地 Prettier 在 `autocrlf=true` 的 Windows 环境可能出现 CRLF 假阳性（见仓库 memory）。若 `format:check` 报错但 `git diff` 为空，以 git 已提交的 blob 为准，不要强行改行尾。

---

## 8. 常见坑

- **手改 `pricing-api.json`**：会被下一次自动同步整体覆盖。价格 / 模型清单只能从上游改。
- **键名用错**：用展示名 `DeepSeek V3.1` 当键，而不是 `model_name` `deepseek-v3.1` → 该条目静默失效，列表页显示 `—`。所有人工数据文件都以 `model_name` 为键。
- **新模型没在 `TYPE_OVERRIDES` 归类**：视频 / 多模态模型被默认分到「语言」桶，类型筛选 chip 找不到它。（软警告会提醒，但不阻断。）
- **限速填了占位假数字**：违反真值原则。拿不到就留空。
- **给 `featured.ts` 或 `catalog-overrides.ts` 加 import**：Node 的 type stripping 加载不了带 import 的模块，`check:catalog` 会直接崩，两个文件必须保持无 import。
- **图标 404**：新厂商有彩色 `icon` 字段但 `public/ai-brand-logo/` 没放彩色 SVG，或品牌本无彩色版却没加进 `NO_COLOR_VARIANT`。
- **图标张冠李戴**：新模型与其厂商都没有 `icon` 字段时会回退成 OpenAI 图标 —— 文件存在、页面不裂，纯靠肉眼很难发现，`check:catalog` 会硬失败拦下（见 4.9）。
- **以为新模型应该自动进首页**：不会，也不应该。选集人工编排，计数自动派生（第 3 节）。
- **凭证失效后以为「上游没模型了」**：`/api/pricing` 鉴权失败是静默的，脚本会以「data 为空」失败退出并保留快照 —— 看到这个报错先去查 Secret，不要加 `--allow-shrink` 绕过。
