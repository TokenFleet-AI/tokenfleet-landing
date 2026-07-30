# Landing Page (Stripe atmospheric editorial × fal.ai info skeleton)

> **v2 — 2026-05-20**：随 PRODUCT.md 重写（brand 方向转向 Stripe-grade × engineer-first）+ design-brief.md v2 同步重写。废弃 v1 (Calm Console + sienna ≤10% + flat + no shadow + Fine-tuning 主卡) 的全部视觉决策与 Tri-card 主卡 2 选择；保留 v1 的"fal.ai 信息骨架 / LLM 优先 / Hero 多 tab 代码 / 算力出租 Coming-soon / 数据盘点 / 国内化定位克制 / 备案" 等可移植结论。

## Goal

为 **TokenFleet**（一站式 AI 模型 API 网关，未来含 GPU 算力出租）打造首屏即懂、工程师可信、财务可备案的中文落地页。信息骨架沿用 fal.ai 8 段（升级为 9 段，新增 Built for Business），视觉系统全面对齐 `DESIGN.md` 的 Stripe-grade atmospheric editorial 语言（indigo CTA + gradient mesh hero + Sohne thin 编辑级排版 + tabular figures + cream interlude + 单 dark band），由此承接 PRODUCT.md 新设定的 **双读者层**：

1. **工程负责人 / CTO**（首要）：30 秒内判断 SDK 兼容 + 模型覆盖 + 接入成本 → 注册 API key
2. **企业采购 / 财务 / 法务**（新增）：在 Built for Business 段确认对公账户 + 增值税专票 + 多人权限 + SLA → 预约销售

核心成功标准（与 PRODUCT.md "Product Purpose" 落地页 3 条目标一致）：

1. 访客 5 秒内理解"一个 API key 接所有模型"
2. 用真实模型清单 / 可复制代码 / 诚实 SLA / 企业级合同与发票能力让工程决策者愿意点 `开始接入`、让采购愿意预约销售
3. 视觉跨入 Stripe / Vercel 级金融基础设施品牌区间，离开"国产 AI 中转站"廉价感

## What I already know

### 来自仓库已有文档

- **产品定位（`PRODUCT.md` v2）**：TokenFleet = 聚合海外 LLM（OpenAI / Anthropic / Google / DeepSeek / Qwen 等）+ 图像 / 视频 / 音频模型的单一 API + 单一计费账户。**新增第二读者层 = 企业采购 / 财务 / 法务**：关心人民币专票、对公账户、多人权限、合同 SLA。
- **品牌人格**：专业 / 理性 / 可靠；中文为主，技术名词保留英文。绝不用感叹号、emoji、营销疑问句、em dash。
- **设计系统（`DESIGN.md` Stripi-design-analysis）**：
  - North Star: Stripe-grade atmospheric editorial（gradient mesh + Sohne thin + indigo pill + tabular figures + cream interlude + dark featured tier）
  - 主色：indigo `#533afd`（CTA + wordmark voltage + code 高亮 + inline link，face ratio ≤10%）
  - signature 视觉：gradient mesh backdrop（cream → sherbet orange → lavender → indigo → ruby pink 横向 wash，装满 hero 上 ~55%）
  - 字体：Sohne (variable, weight 300) + 负 letter-spacing + ss01 stylistic set；Inter 作 fallback；tabular figures (`tnum`) 用于所有 money / 数字 cell
  - 默认 shadow 极轻（Level 1 = `rgba(0,55,112,0.08) 0 1px 3px`）；feature card 仅 hover 时 lift
  - section padding 80–128px；正文行宽 65–75ch；rounded pill = 9999px 是所有 button geometry
- **反样式（硬禁线，PRODUCT.md v2 已更新）**：logo wall + "已服务 10000+" 数字 / 客服弹窗 / 二维码加群入口 / "立即抢购"按钮 / "Powered by AI" 徽章 / 自动播放视频 / "Try for free" 闪烁 / stock photo / 三栏 outline icon / 深蓝政府门户感 / 紫粉星空 + Powered by GPT 横幅。**注意**：v1 PRODUCT.md 反对的"渐变 / glow / 渐变文字"已部分解禁——`background-clip: text` 仍禁（absolute ban），但 mesh / dark band / Sohne thin 编辑级 atmospheric 完全允许。

### 来自 fal.ai 结构调研（保留 v1 `research/fal-ai-landing-structure.md` 结论）

fal.ai 落地页 8 段结构（自上而下）：announcement bar / top nav / hero (双列) / featured models gallery (5-up) / build-deploy-train tri-card / why choose us 2×2 / enterprise scale / testimonials marquee + purple closing CTA + footer。

本项目保留：top nav / hero / featured models / tri-card / why-us / enterprise / footer。**禁** announcement bar / testimonials marquee / purple closing CTA。**新增** Built for Business 段（cream interlude，介于 tri-card 与 why-us 之间）。

### 来自竞品调研（保留 v1 `research/competitor-landing-patterns.md` 结论）

5 家同类站共性：announcement bar / 短 hero + 双 CTA / hero 下 stats trio / featured model grid / tabbed 多 SKU / enterprise SOC2 / 4-column footer with Status link。

本项目可借鉴：Replicate hero code tab + 模型输出 carousel；OpenRouter hero 巨数字 (考虑用于 Featured Models 段标题)；RunPod tokens-per-dollar 对比柱状图（如果未来有真实定价优势）。

**新增** Stripe-specific 借鉴（v2 加入，对应 anchor reference 变化）：

- stripe.com 主页 mesh hero + Sohne thin display + indigo pill CTA + 1200px container
- stripe.com/payments composited dashboard mockup (面板叠合)
- stripe.com/billing cream interlude band（v2 落地为 Built for Business 段背景）
- vercel.com docs landing 的代码块 chrome（mono tab + Copy + hairline border）

### 当前仓库状态

- 还没有任何前端代码（无 package.json / vite / next / astro）。这是绿地实现。
- `references/` 目录存在，内容待确认。
- `docs/design-brief.md` v2 已落地（本 PRD 同步参考）。
- `public/xy-logo.png` 存在（用途待确认，可能为公司既有 logo）。

## Assumptions (temporary, to validate)

1. **不做 testimonials 段**：DESIGN.md 接受 atmospheric mesh 但不接受 marquee；用户基数不足。改为 "Featured Models 5-up 厂商 brand 色块 + 真实模型 id" 作为社会证明。
2. **不做 announcement bar**（PRODUCT.md 反 SaaS 风格暗示），改为单一极简 nav。
3. **主 CTA = `开始接入` (注册)，辅 CTA = `查看文档` / `联系销售` / `预约销售对话`**（按段位分配）。
4. **中文为主语言**，技术名词、模型名、endpoint、SDK 标识、数字一律保留英文 + mono + tabular figures。
5. **Stack ADR 倾向 Astro**（design-brief §10 Open Q1）：静态 + 极佳 Lighthouse + 局部 island for hero tab + 邮件订阅。备选 Next.js 14 (app router) / Vite + React。craft 启动前正式记 ADR。

## Open Questions

> 全部已决或转入 design-brief §10 Open Questions（craft 阶段 resolve）。

1. ~~视觉路线~~ → **Decision 1 (v2)**
2. ~~算力出租~~ → **Decision 2** (保留)
3. ~~首屏定位~~ → **Decision 3** (保留)
4. ~~Hero 代码示例形态~~ → **Decision 4** (保留)
5. ~~企业段强度~~ → **Decision 5** (保留 + v2 边界澄清)
6. ~~数据盘点~~ → **Decision 6** (保留 + v2 增量)
7. ~~国内化 / Why-us D / 备案~~ → **Decision 7 (v2)**
8. ~~Brief 详细度~~ → **Decision 8** (保留)
9. ~~Hero 拓扑~~ → **Decision 9** (保留)
10. ~~Tri-card 主卡 2~~ → **Decision 10 (v2)**
11. ~~Color strategy~~ → **Decision 11 (v2 新增)**
12. ~~Built for Business 段形态~~ → **Decision 12 (v2 新增)**
13. ~~Featured Models 卡片形态~~ → **Decision 13 (v2 新增)**

## Requirements (evolving)

- 单页落地页，简体中文为主。
- **内容骨架沿用 fal.ai 9 段**（top nav / hero / featured models / tri-card / **Built for Business 新增** / why-us / enterprise dark / footer），**视觉系统全面遵循 DESIGN.md** Stripe atmospheric editorial（Decision 1 v2）。
- **算力出租以 "Coming soon" 形态在落地页存在**（Decision 2 保留）。
- **首屏定位 = LLM 集成开发者**（Decision 3 保留）：hero headline / 代码示例 / 5-up 模型 grid 主推 LLM；多模态作为 Featured Models 段的"还支持"出现。
- **Hero 代码块 = 多 tab：curl / Python / Node**（Decision 4 保留），共用同一段 LLM chat completions 调用，凸显 OpenAI SDK 一行 `base_url` 替换即可。
- **Hero 拓扑 = 双列 + mesh 背景**（Decision 9 保留 + v2 加入 mesh）：左 50% 文字 + 右 50% 代码块，浮于 mesh 之上的 white container。
- **Color strategy = Committed**（Decision 11 v2 新增）：mesh + cream interlude + dark band 三色区轮换，indigo CTA + tinted neutral 主体。
- **新增 Built for Business 段**（Decision 12 v2）：cream interlude 背景（`{colors.canvas-cream}` #f5e9d4），承接 finance / 采购读者层。5 项能力栅格 + outline pill `预约销售对话 →`。
- **Tri-card 主卡 2 = Unified Billing & Invoicing**（Decision 10 v2）：替换 v1 Fine-tuning Gateway（产品未上线）。mini 发票 mockup（HTML/CSS）+ `Use it for:` 3 项 + outline pill。
- **Featured Models 5-up 卡 = 厂商 brand 色块 + mono 模型 id 大字**（Decision 13 v2）：替换 v1 全 mono 文字网格。每卡 4:3 aspect，厂商色 desaturate 8-12% 以匹配 Stripe atmospheric 调性。
- **企业段 = 轻量 + 局部 dark band**（Decision 5 保留 + v2 边界）：整页唯一明度反转，文案诚实，禁用 `SOC 2`/`HIPAA`/`ISO` 等未拿到的合规缩写。**与 Built for Business 分工**：本段 = 工程侧 enterprise capability（SLA / VPC / 专属对接）；Built for Business = finance / 采购读者层。两段不重叠。
- **Why-us D 卡 = 国内直连 / 毫秒级延迟**（Decision 7b v2 替换）：finance 维度已升级到 Built for Business 段独立承担，D 卡替换为 latency 维度。
- **数据快照**（Decision 6 保留 + v2 增量见下）。
- **国内化定位**（Decision 7a 保留）：hero 不喊"国内"标签；"国内直连 / 毫秒级延迟" 出现在 Why-us D 卡；"人民币结算 / 增值税专票" 升级到 Built for Business 段。
- **Footer 备案**（Decision 7c 保留） = `粤ICP备2022003994号-6` + 公司主体 `深圳市新云计算科技有限公司 © 2026`。
- 落地页所有数字、版本号、价格、endpoint、SLA、延迟、发票金额一律 mono + tabular figures (`font-feature-settings: "tnum"`)。
- 主 CTA = 注册 / 接入；辅 CTA = 查看文档 / 联系销售 / 预约销售对话。CTA 在 hero / Built for Business / Enterprise 三处各出现一次。
- 视觉：mesh + cream + dark 三色区 + indigo CTA + Sohne thin + tabular figures + 1px hairline + Level 1 shadow on hover only。
- 不做：marquee testimonials / purple closing CTA / announcement bar / fal.ai 彩色装饰 SVG / Open source / Community 暗示 / SOC 2/ISO/HIPAA 等未拿到的合规缩写 / `background-clip: text` gradient text / 侧条 border-left。
- 响应式：mobile (<640px) / tablet / desktop / wide (≥1280px) 四档断点。
- 可访问性：WCAG 2.1 AA，键盘可达，焦点态 2px indigo ring + 2px offset。

## Acceptance Criteria (evolving)

- [ ] Hero 首屏 5 秒内传达"一个 API key 接所有主流模型"，不需要滚动。
- [ ] Hero 双列 + mesh 背景按 DESIGN.md 落地（mesh 装满上 ~55% viewport，文字与代码块浮于 mesh 之上的 white container）。
- [ ] Hero 代码块 3 tab（curl / Python / Node）可切换，Copy 按钮可用且反馈正确（已复制 ✓ / 800ms 回退）。
- [ ] Featured Models 5-up 厂商 brand 色块 + 模型 id 大字按 §5 落地，5 个色块视觉协调（desaturate 8-12% 实测）。
- [ ] Tri-card 包含 1 主卡（统一 API）+ 1 主卡（Unified Billing & Invoicing）+ 1 Coming-soon 卡（GPU），Unified Billing 卡内 mini 发票 mockup 用 tabular figures。
- [ ] **Built for Business 段以 cream interlude 背景独立成段**，5 项 finance 能力栅格 + `预约销售对话` outline CTA。
- [ ] Why-us 2×2 包含：34 模型 mono 网格 / VPC schematic / OpenAI SDK code diff / 国内直连 latency schematic。
- [ ] Enterprise dark band 整页唯一明度反转，3 条 mono label 横排，单 indigo pill CTA `联系销售`。
- [ ] Footer 5 列 + 备案 strip，含 `粤ICP备2022003994号-6` 链工信部 + `target="_blank" rel="noopener noreferrer"`。
- [ ] 至少一处真实模型清单（模型名 + 版本 + 厂商）以 mono 字体展示。
- [ ] 至少一段真实可复制的 code block（curl 或 SDK），`base_url=https://tokenfleet.cn/v1` 真实可解析。
- [ ] 页面通过 WCAG 2.1 AA 对比度检查（正文 ≥ 4.5:1，indigo + mesh + dark band 每段实测）。
- [ ] 不出现任何 marquee / 自动播放视频 / `background-clip: text` gradient text / 紫色巨块 / logo wall / 客服弹窗 / 二维码加群 / "立即咨询" 红色按钮。
- [ ] 不出现感叹号、emoji、"提升 X%" 营销数字、"立即抢购"式按钮、em dash、`--`。

## Definition of Done

- Lighthouse Performance / Accessibility / Best Practices / SEO 全部 ≥ 90（生产构建本地跑）。
- 单页在 mobile (≤640px) / tablet / desktop / wide (≥1280px) 四档断点视觉无破。
- Hero 与 footer 之间所有 section 都有明确的 `<section>` 语义标签 + 可锚定 id。
- 所有 CTA 链路打通到 placeholder 路由（注册 / 联系 / 文档 / 预约销售），不出现 dead link。
- README 或对应文档说明：色板 token / 字体来源（Sohne 商用须确认许可 / 否则 Inter fallback）/ 模型清单数据源 / 厂商 brand color desaturate 策略 / 真假数据标记。
- mesh 静态 SVG / 大图实现（非 CSS gradient，与 DESIGN.md "atmospheric SVG or large background image" 一致），mobile 重新 tile 不变形。
- Astro / Next.js 选型 ADR 文档落地。

## Out of Scope（明示不做）

- 多语言切换（i18n）。中文版优先；英文版后续。
- 文档站、控制台、playground、定价详情页本身的实现——落地页只链向占位路由。
- 博客 / 案例 / changelog 子站。
- 数据 dashboard、benchmark 实时拉取——MVP 用静态数据 + 标注 "数据更新于 YYYY-MM-DD"。
- testimonials 真实采集 + marquee carousel（违反 brief 决策）。
- 暗色全站模式（只允许 Enterprise band 局部 dark）。
- mesh 动画 / parallax / scroll-driven 大型动效（mesh 始终静止，brief §7 已定）。
- Fine-tuning Gateway 落地呈现（Decision 10 v2 已剔除，产品未上线）。

## Technical Notes

- 仓库根目前是空脚手架，需在 Phase 2 决定 stack。倾向 **Astro**（静态 + 极佳 Lighthouse + 局部 island for hero tab + 邮件订阅 form）；备选 Next.js 14 (app router) / Vite + React。选型决策记入 ADR。
- DESIGN.md indigo `#533afd` 在 mesh / cream / dark 三色区上的对比度需在浏览器实测，不能假设默认值满足 WCAG AA（特别是 indigo pill 上的 `on-primary` 白文 + indigo body on cream-band）。
- **Sohne 商用许可问题**：Sohne 是 Klim Type Foundry 商用字体。本项目须明确购买商用 license 或确认 fallback。DESIGN.md 已记 Inter (Google Fonts) 为 fallback；如未购买 license，全站直接用 Inter weight 300 + `letter-spacing` 调整模拟 Sohne 编辑感（DESIGN.md `## Note on Font Substitutes` 段已有指引）。
- **mesh 实现策略**：DESIGN.md 明示 mesh 是 SVG 或大背景图（非 CSS gradient，因 mesh 含有机 blob 形状）。本项目 craft 阶段优先尝试自绘 SVG（5-6 个高斯 blur radial gradient layer 叠加在 SVG `<filter>` 内），失败则改用 PNG @2x 大图（与厂商 brand 一致性需另解）。
- **装饰资源策略**：仍允许复用免版权资源（CC0 / MIT / 开源 brand assets），但 v2 资产清单已大幅变化（见下 Asset Manifest v2）。fal.ai 装饰 SVG 不可复用。
- 引用一切外部模型名（GPT-4o / Claude Opus / Gemini / Flux / Kling 等）只可作为 "支持的模型" 客观罗列，不可暗示 endorsement。
- 厂商 brand color 用于 Featured Models 5-up 卡背景的 license 风险：simpleicons.org (MIT) 含 brand SVG，但 brand color desaturate 后是否仍构成 trademark 使用须法务评估（craft 启动前 P1 question）。

## Asset Manifest v2（v2 更新清单，2026-05-20）

下表替换 v1 Asset Manifest（v1 全部 sienna + flat + 无图卡 + mono 网格的资产策略已废）。

| #   | 用途位置                                                           | 形态                                              | 推荐比例 / 尺寸                                   | 内容描述                                                                                                                                                                               | 推荐来源 / 备选路线                                                |
| --- | ------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | **Nav 品牌 wordmark**                                              | 矢量 SVG                                          | viewBox 高度 32–48px，宽自适应 120–160px          | `Token` ink + `Fleet` indigo voltage（候选 craft probe）；备选 全 ink + 句点 indigo / 全 indigo                                                                                        | 自绘 SVG（craft 阶段 wordmark probe）                              |
| 2   | **Hero gradient mesh backdrop**                                    | SVG（多 radial gradient + blur）或 PNG @2x 大图   | desktop 1920×720；mobile 750×500（aspect ~2.7:1） | DESIGN.md cream → sherbet orange → lavender → indigo → ruby pink 横向 wash，装满 hero 上 ~55%。**禁** CSS linear-gradient（无 blob 感）                                                | 自绘 SVG (`<filter>` + `<radialGradient>` 叠加) → 失败则导出 PNG   |
| 3   | **Hero 多 tab 代码块**                                             | 纯 HTML/CSS 实现                                  | —                                                 | curl / Python / Node 3 tab，indigo voltage 高亮 base_url + model id 行，1 行 `复制` mono                                                                                               | —                                                                  |
| 4   | **5-up Featured Models 卡**                                        | 厂商 brand color 背景 + mono 大字 + 厂商 logo SVG | desktop 4:3 单卡 ~280×210；mobile 2 列            | 每卡 = 厂商 desaturate 8-12% 背景 + mono display-md 模型 id + 顶部 sans 厂商名 + 底部 mono token cost。5 个模型候选：claude-opus-4-7 / gpt-5 / gemini-3-pro / flux-1.1-pro / kling-2.0 | simpleicons.org (MIT) 厂商 logo SVG + 自配 brand color desaturate  |
| 5   | **Tri-card 主卡 1 — 统一 API 网关**                                | mono code preview + 极简 schematic SVG            | 200×200 schematic                                 | endpoint / 网络节点图示，1.5px stroke 单色 ink + indigo voltage                                                                                                                        | 自绘 SVG                                                           |
| 6   | **Tri-card 主卡 2 — Unified Billing & Invoicing mini 发票 mockup** | HTML/CSS（不出图）                                | 卡内 ~320×220                                     | mini 增值税专票 mockup：mono tabular figures 金额、税号、公司全称 sample data + indigo voltage 高亮 "TokenFleet 增值税专票" 抬头                                                       | 纯 HTML/CSS 实现，sample data craft 阶段确认                       |
| 7   | **Tri-card Coming-soon GPU 卡**                                    | 灰度 + mono label                                 | 卡内 200×200                                      | 灰度芯片 / 方块 + `COMING SOON` mono label + 邮件 placeholder                                                                                                                          | 自绘 SVG (gray-50% saturation)                                     |
| 8   | **Built for Business 段右侧 5 项能力栅格**                         | mono micro-cap + body-md 文字栅格                 | 2×3 minus 1 或 1×5                                | 5 项：对公账户 / 人民币结算 + 专票 / 多人协作权限 / 用量看板 / 合同 SLA                                                                                                                | 纯 HTML/CSS 实现                                                   |
| 9   | **Built for Business — dashboard composite mockup (可选)**         | HTML/CSS（不出图）                                | desktop 480×360                                   | mini TokenFleet 控制台 mockup：invoice 列表 + billing dashboard mini 图表 + team panel 三块叠合（DESIGN.md `card-dashboard-mockup` 组件）                                              | 纯 HTML/CSS 实现，craft 阶段择优是否做（design-brief §10 Open Q4） |
| 10  | **Why-us A — 34 模型 mono 网格**                                   | 纯 HTML/CSS                                       | —                                                 | 4×9 或 6×6 mono 网格，34 格，每格 `claude-opus-4-7  /  Anthropic`                                                                                                                      | —                                                                  |
| 11  | **Why-us B — 私有部署 schematic**                                  | SVG schematic                                     | 240×160，1.5px stroke                             | `Public endpoint → Private VPC` box+arrow 单色（ink + indigo voltage）                                                                                                                 | 自绘 SVG                                                           |
| 12  | **Why-us C — OpenAI SDK code diff**                                | 纯 HTML/CSS mono code                             | —                                                 | 两行 diff：`api.openai.com/v1` → `tokenfleet.cn/v1`（indigo 高亮 diff 行）                                                                                                             | —                                                                  |
| 13  | **Why-us D — 国内直连 latency schematic**                          | SVG schematic                                     | 240×160                                           | 海外 endpoint → 国内 CDN 节点 → 客户端，配 mono caption `北京 / 上海 / 广州 / 深圳 / 杭州 平均 P50 latency [待填]`                                                                     | 自绘 SVG                                                           |
| 14  | **Enterprise dark band 装饰**                                      | 可选，默认无装饰                                  | —                                                 | 纯排版，display-xl 白色 sans + 3 条 mono label；若必须装饰，用 1 条极淡 hairline grid 背景                                                                                             | —                                                                  |
| 15  | **Footer 微信公众号 / 视频号 / 抖音号二维码**                      | PNG @2x 或 SVG                                    | 200×200 显示（@2x = 400×400 实际）                | 实际二维码                                                                                                                                                                             | **用户提供**（公众号已知；视频号 / 抖音号 `[待填]`）               |
| 16  | **Favicon**                                                        | ICO + SVG                                         | 16×16 / 32×32 / 48×48 ICO 多尺寸 + SVG 矢量       | 单字母 `T`（ink + indigo voltage）或品牌简化 mark                                                                                                                                      | 自绘 SVG → realfavicongenerator.net 转 ICO                         |
| 17  | **OG share image**                                                 | PNG                                               | 1200×630（1.91:1）                                | wordmark + Sohne thin 副标 + 简化 mesh 背景，用于微信 / Twitter / LinkedIn 分享卡                                                                                                      | 自绘（Figma 模板）                                                 |

**Asset Manifest v2 使用约定**（保留 v1 约定）：

- `/impeccable craft` 阶段产出真实素材或对应占位 placeholder
- Phase 2 实现时，所有真实图片放 `public/assets/landing/`，所有占位先用 placeholder rect（CSS `background: var(--canvas-soft)` + 中间一行 mono `[资产:#]`），便于 grep 排查未替换项
- 上线前 CI 校验 `public/assets/landing/` 目录下是否还有 placeholder 文件名残留
- **新增 v2**：mesh SVG 与厂商 brand color 卡片须在 craft 阶段做对比度 + 视觉协调实测（design-brief §10 Open Q3）。

## Research References

- [`research/fal-ai-landing-structure.md`](research/fal-ai-landing-structure.md) — fal.ai 落地页 8 段完整结构、verbatim 文案、装饰资源清单。
- [`research/competitor-landing-patterns.md`](research/competitor-landing-patterns.md) — Replicate / Together / Modal / RunPod / OpenRouter 共性 + 各家差异化打法。
- **v2 新增**：stripe.com / vercel.com 抽样调研待补（craft 阶段引用 DESIGN.md "Source pages: home (/), /payments, /pricing, dashboard.stripe.com/register/payments" 与 Vercel docs landing 即可）。

## Decision (ADR-lite)

### Decision 1 (v2) — 视觉路线：fal.ai 信息骨架 × Stripe atmospheric editorial

- **Context**：v1 选 fal.ai 骨架 + Calm Console (sienna + flat + 反渐变) 视觉。PRODUCT.md v2 重写后转向 Stripe-grade × engineer-first 方向，DESIGN.md 是 Stripi 风格 (indigo + mesh + Sohne thin + cream + dark band)。两份新文件已对齐，v1 视觉决策全部失效。
- **Decision**：信息骨架沿用 fal.ai 9 段（top nav / hero / featured / tri-card / **Built for Business 新增** / why-us / enterprise / footer，**不**含 announcement bar / testimonials marquee / purple closing CTA），视觉系统全面对齐 DESIGN.md Stripe atmospheric editorial。Anchor references = stripe.com + vercel.com（fal.ai 与 Anthropic 已退出 anchor 列表）。
- **Consequences**：
  - 与 PRODUCT.md "Stripe-grade atmospherics × Engineer-first content" 完全一致。
  - v1 Asset Manifest 全部需要重写（mesh SVG + 厂商 brand 色块 + cream interlude + dashboard composite mock 等新资产位）。
  - 任何与 DESIGN.md 冲突的灵感（仍 sienna / 仍 flat / 仍单 mono 网格）直接拒绝，不进入实现。

### Decision 2 — 算力出租：Coming soon 形态（保留 v1）

详见 v1。**无变化**。Coming-soon 卡仍是 tri-card 第 3 张。

### Decision 3 — 首屏定位：LLM 优先，多模态次之（保留 v1）

详见 v1。**无变化**。

### Decision 4 — Hero 代码块：多 tab (curl / Python / Node)（保留 v1）

详见 v1。**无变化**。Implementation notes：tab 切换可用 vanilla JS 或 Astro island。

### Decision 5 — Enterprise 段：轻量 + 局部 dark band + v2 边界澄清

- **保留 v1**：整页唯一明度反转，3 条 mono label，单 CTA `联系销售`，**绝对禁** SOC 2 / ISO / HIPAA 等未拿到的合规缩写。
- **v2 边界澄清**：本段聚焦**工程侧 enterprise capability**（SLA / VPC / 专属技术对接）。**finance / 采购读者层**已升级到独立 §5 Built for Business 段承担（Decision 12 v2）。两段不重叠。
  - Enterprise 段 3 条 mono label 候选：`企业级 SLA — 可定制承诺` · `私有部署 / VPC 直连 — 可商谈` · `专属技术对接 — 支持`
  - Built for Business 段 5 项能力：`对公账户` · `人民币结算 + 增值税专票` · `多人协作权限` · `用量看板 + 异常预警` · `合同 SLA / 法务条款`
- **Consequences**：双读者层分工清晰，避免 dark band 段背得太重又承接采购合同诉求又承接工程 SLA 诉求。

### Decision 6 — 数据盘点快照（保留 v1 + v2 增量）

v1 数据快照表完整保留（截至 2026-05-14，A-N 项）。**v2 新增数据点**：

| 数据点                                       | 用途                     | 实现时使用值                                                                                                                        |
| -------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **O. 5 个 Featured Models 候选**             | Featured Gallery 5-up 卡 | 候选：`claude-opus-4-7` / `gpt-5` / `gemini-3-pro` / `flux-1.1-pro` / `kling-2.0`（craft 启动前用户确认是否上架且 token cost 真实） |
| **P. 5 项 finance 能力具体措辞**             | Built for Business 段    | 候选见 Decision 5 上文，craft 阶段择优                                                                                              |
| **Q. mini 发票 mockup sample data**          | Tri-card 主卡 2          | 公司全称 / 税号 / 金额 sample data，craft 启动前用户提供或确认用 placeholder                                                        |
| **R. Featured Models 厂商 brand color list** | 5-up 卡背景              | OpenAI 近黑 / Anthropic 黄褐 / Google 浅蓝 / DeepSeek 深紫 / Qwen 橙，desaturate 8-12% 实测                                         |

### Decision 7 — 国内化定位 / Why-us D 卡 / 备案（v2 部分修订）

- **7a (保留)**：Hero 保持中立 / 国际化质感，不点"国内"标签。
- **7b (v2 修订)**：Why-us D 卡**从 v1 "统一计费、人民币发票" 改为 "国内直连、毫秒级延迟"**。原因：finance 维度已升级到 §5 Built for Business 独立承担（Decision 12 v2）；Why-us D 空位用 latency schematic 填补，回归 fal.ai 速度卡的工程侧节奏。Latency 数据 `[待填]`（与 v1 D 项"删 latency 数据"相反，v2 重新要求 craft 阶段补 P50 数据）。
- **7c (保留)**：Footer 备案 `粤ICP备2022003994号-6` + `深圳市新云计算科技有限公司 © 2026`。

### Decision 8 — 紧凑型直进 craft（保留 v1）

详见 v1。**无变化**。Lighthouse 4 项 ≥ 90 为出厂线。

### Decision 9 — Hero 视觉拓扑：双列 + v2 加入 mesh 背景

- **保留 v1**：左 ~50% 文字 + 右 ~50% 多 tab 代码块。Mobile 双列退化为上下叠。
- **v2 加入**：双列浮于 gradient mesh 之上的 white container。Mesh 装满 hero 上 ~55% viewport。**禁** macOS stoplight 红黄绿点。代码块 chrome = mono 终端风（顶 3 mono tab + 右上 `复制` mono），background `{colors.canvas}`，1px hairline border，Level 1 shadow（与 DESIGN.md `card-dashboard-mockup` 调一致但更轻）。
- **Consequences**：mesh 承担品牌"放心感"信号 + 代码块承担工程"可验证"信号，两个信号在同一首屏内并存。视觉重心略偏右（代码块），craft 阶段需注意左右垂直 baseline 对齐。

### Decision 10 (v2) — Tri-card 主卡 2：Unified Billing & Invoicing（替换 v1 Fine-tuning Gateway）

- **v1 决策**：主卡 2 = Fine-tuning Gateway（带 P0 caveat：产品边界未确认）。
- **v2 决策**：Fine-tuning 未上线 / 边界未确认，**剔除主卡 2 槽位**。新换入 **Unified Billing & Invoicing**：
  - 卡片标题：`统一计费与发票 (Unified Billing & Invoicing)`
  - 卡片视觉主体 = mini 增值税专票 mockup（HTML/CSS，mono tabular figures）+ indigo voltage 高亮 "TokenFleet 增值税专票" 抬头
  - `Use it for:` mono 项目列表 3 项（候选：单一对公账户对账 / 月度自动开票 / 多团队成本归属）
  - indigo outline pill CTA `查看计费机制 →`
- **Consequences**：
  - 落地页 product 分类 narrative 重塑：**通用 inference API（主卡 1）+ 统一计费 / 发票（主卡 2）+ 算力出租（Coming-soon 卡 3）**，从 "inference → training → infra" 改为 "inference → finance → infra"，更贴 PRODUCT.md 新增的 finance 读者层。
  - 这张卡承接 finance 读者层在 tri-card 段的**第一次锚定**，与 §5 Built for Business 段形成"卡内预告 → 段内展开"的节奏。
  - Fine-tuning Gateway 未来上线后，可作为 Why-us 卡或独立 section 增量补入，不改主卡结构。

### Decision 11 (v2 新增) — Color strategy 升级到 Committed

- **Context**：DESIGN.md 默认 Restrained（indigo ≤10% + mesh 装饰），但 brand register 鼓励 Committed / Drenched。落地页是 brand surface，Restrained 偏保守。
- **Decision**：升级到 **Committed**：mesh + cream interlude + dark band 三色区轮换，indigo CTA + tinted neutral 主体。
  - Mesh 装满 hero 上 ~55%（atmospheric backdrop）
  - Cream interlude `{colors.canvas-cream}` 落地 Built for Business 段
  - Dark band `{colors.brand-dark-900}` 落地 Enterprise 段（整页唯一明度反转）
  - 其余段 = `{colors.canvas}` / `{colors.canvas-soft}` 交替
  - Indigo `{colors.primary}` 仍 ≤10% face ratio，仅 CTA / wordmark voltage / code 高亮 / inline link 使用
- **Consequences**：
  - 整页视觉节奏 = mesh hero → soft → canvas → cream interlude → soft → dark band → canvas，章法清晰。
  - WCAG AA 对比度须在 mesh / cream / dark 三色区每段实测，特别是 indigo pill 上的白文 + indigo body on cream-band。
  - Cream interlude 默认仅 §5 Built for Business 段独占（design-brief §10 Open Q5）；如 craft 阶段觉得 cream 太单调，可考虑把 Tri-card 主卡 2 卡内背景换 cream 与 §5 形成视觉照应。

### Decision 12 (v2 新增) — 新增 Built for Business 段（cream interlude）

- **Context**：PRODUCT.md v2 新增第二读者层 = 企业采购 / 财务 / 法务决策者。原 8 段骨架（含 Enterprise dark band）只为工程侧 enterprise capability 服务，**不**直接承接采购合同 / 发票 / 多人权限诉求。
- **Decision**：在 Tri-card 与 Why-us 之间**新增 Built for Business 段**：
  - 整段背景 `{colors.canvas-cream}` cream interlude
  - 左 ~40% sans display-xl 标题（候选 design-brief §8 列出 3 个）+ body-lg 副段
  - 右 ~60% **5 项 finance 能力栅格**：对公账户 / 人民币结算 + 增值税专票 / 多人协作权限 / 用量看板 + 异常预警 / 合同 SLA + 法务条款
  - 段底单 CTA outline pill `预约销售对话 →`（mailto 或 placeholder 表单）
  - dashboard composite mockup（DESIGN.md signature component）可选放此段（craft 择优）
- **Consequences**：
  - 落地页从 8 段变 9 段。
  - 双读者层在落地页都获得独立锚定位置：工程读者 = hero 代码块 / Featured Models / Tri-card 主卡 1 / Why-us / Enterprise；finance / 采购读者 = Tri-card 主卡 2 + Built for Business 段。
  - cream interlude 在工程读者眼里也是合理的"节奏温暖区"，不会被认为是过分讨好财务。

### Decision 13 (v2 新增) — Featured Models 5-up 卡：厂商 brand 色块 + mono 模型 id 大字

- **Context**：v1 选全 mono 文字网格（Calm Console "终端美学"原则）。新方向是 Stripe atmospheric editorial + 带图卡片更符合 stripe / fal.ai 调性。但 LLM 模型没有产品 preview 图，不能套用纯图卡方案。
- **Decision**：每卡 = **厂商 brand 色块作背景**（OpenAI 近黑 / Anthropic 黄褐 / Google 浅蓝 / DeepSeek 深紫 / Qwen 橙）+ 居中大字 mono 模型 id（display-md, weight 300）+ 顶部小字 sans 厂商名 + 底部 mono token cost 1 行。卡片 aspect 4:3，`{rounded.lg}` 12px，Level 1 shadow on hover only。厂商色 desaturate 8-12% 以匹配 Stripe atmospheric 调性。
- **Consequences**：
  - 视觉密度 + 工程信任度同时拿到：色块 = 一眼识别厂商 / 大字 mono = 工程精度。
  - **Risk**（design-brief §10 Open Q3）：5 个厂商 brand color 互配可能崩塌（5 色相 jumble），craft 阶段需在浏览器实测，必要时统一 desaturate 12-18% 或加 mesh-tint overlay。
  - License 风险（厂商 brand color + logo SVG 使用），craft 启动前法务评估（Technical Notes 已记）。

---

> v2 brief 已落地于 [`design-brief.md`](./design-brief.md)。后续 craft 阶段以 design-brief.md 为 single source of truth；本 PRD 承担"决策记录 / 数据快照 / 资产清单 / 验收"职能。
