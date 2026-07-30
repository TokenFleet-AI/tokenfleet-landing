# Design Brief — TokenFleet Landing Page (v2, Stripe-grade Editorial)

> Produced by `/impeccable shape` on 2026-05-20. Anchors all subsequent `/impeccable craft` work.
> Replaces v1 (Calm Console / sienna direction, 2026-05-14) following PRODUCT.md rewrite that opens the brand to Stripe-grade atmospheric editorial × engineer-first content. Source decisions: PRODUCT.md (Users / Purpose / Personality / Anti-references / Design Principles) + DESIGN.md (indigo / mesh / Sohne thin / tabular figures / cream interlude / dark band).

---

## 1. Feature Summary

TokenFleet 简体中文落地页（单页 / production-ready / 9 段）。fal.ai 信息骨架 × Stripe atmospheric editorial visual system。同时为两个读者层服务：

- **工程负责人 / CTO**：5 秒内理解"一个 API key 接所有主流大模型"，验证 OpenAI SDK 兼容性，决定点 `开始接入` 注册。
- **企业采购 / 财务 / 法务**：在专属 "Built for Business" 段确认"对公账户 / 增值税专票 / 多人权限 / 用量看板 / 合同 SLA"五项能力，决定预约销售。

视觉态度：Stripe / Vercel 级金融基础设施编辑感（mesh / Sohne thin / indigo pill / tabular figures / cream interlude / 1 处 dark band），离开"国产 AI 中转站"廉价感。

## 2. Primary User Action

**首屏 5 秒内**：工程师抓住 hero 多 tab 代码块（curl / Python / Node），感知 `base_url=https://tokenfleet.cn/v1` 一行替换即可复用 OpenAI 官方 SDK。
**次级动作**：

- 工程读者 → indigo pill `开始接入` 注册 API key，或滚动至 Why-us 卡 C 验证 SDK 兼容差异。
- 财务 / 采购读者 → 直接跳至 Built for Business 段，或在 Enterprise band 点 `联系销售`。

## 3. Design Direction

- **Color strategy**: **Committed**（升级自 DESIGN.md 默认 Restrained）。三色区轮换：
  - **Mesh** = hero 上 ~55% 高度的 atmospheric backdrop（DESIGN.md 已定 cream → sherbet → lavender → indigo → ruby 横向 wash），承担品牌"放心感"信号。
  - **Cream interlude** = Built for Business 段背景 `{colors.canvas-cream}` (#f5e9d4)，承担 finance 段的"温暖、放心、合规" emotional tone。
  - **Dark band** = Enterprise 段 `{colors.brand-dark-900}` (#1c1e54)，承担工程侧 enterprise 能力（SLA / VPC / SSO）的权威感。
  - 其余段 = `{colors.canvas}` (白) / `{colors.canvas-soft}` (#f6f9fc) 交替。
  - **Indigo** `{colors.primary}` (#533afd) 仅用于 CTA pill、wordmark voltage、code 高亮、inline link，face ratio 仍 ≤10%，但 mesh + cream + dark band 让整体不再是 "Restrained"。
- **Theme scene sentence**: _"一位 32 岁 CTO，周二上午 10 点在杭州办公室双屏环境（左 14 寸 MacBook、右 27 寸外接），刚被 CFO 推了一封 'AI 调用账单不规范' 的邮件，要求 1 周内换一家能开人民币专票、能签合同的供应商，桌灯关、自然光，正打开第 3 个评估页准备按 F12 验证延迟同时把 link 转发给采购同事。"_ → **light-by-default**（白天 / 决策审视 / 双读者并行）。唯一 dark band 留给 Enterprise 段制造 mood-room 反差节奏。
- **Anchor references (2)**:
  - **stripe.com** (主页 / payments / billing) — atmospheric mesh hero、Sohne thin 编辑级排版、indigo pill CTA、tabular figures、composited dashboard mockup、cream interlude band、pill button geometry。
  - **vercel.com** (主页 / docs) — 代码块作为 first-class hero element、mono tab + Copy 微交互、冷峻黑白 + accent color 的工程师向密度感。
  - **拒**：Stripe 的"金融保险即视感"（如 invoice 卡 / pricing tier 模板）直接套到 AI API 网关上；Vercel 的"冷黑底"过分喧哗。两个 anchor 是采样不是模仿。

## 4. Scope

- **Fidelity**: production-ready（紧凑 brief 直进 `/impeccable craft`，一路推到 ship）。
- **Breadth**: 单整页（9 段：top nav / mesh hero / Featured Models / Tri-card / **Built for Business**(新增) / Why-us 2×2 / Enterprise dark / Footer）。**无** announcement bar、**无** testimonials marquee、**无** purple closing CTA。
- **Interactivity**: shipped-quality —— 代码 tab 切换 / Copy 微反馈 / CTA hover / 邮件订阅 / 键盘全可达 / `prefers-reduced-motion` 尊重 / mesh 不做动画。
- **Time intent**: polish until it ships；Lighthouse Performance / Accessibility / Best Practices / SEO 4 项 ≥ 90（生产构建本地跑）。

## 5. Layout Strategy

editorial-calm 主体 + 三色区轮换（mesh / cream / dark）制造节奏。Section padding 80–128px，行宽 65–75ch（DESIGN.md 已定）。Card 仅在 tri-card / featured models / why-us 出现，**禁** nested cards。

**段落骨架**（自上而下，9 段）：

1. **Top Nav**（极简，浮于 mesh 之上）：左 wordmark `TokenFleet`（`Token` ink + `Fleet` indigo voltage）/ 右 = Models · Docs · Pricing · Blog 4 sans link + `登录` outline pill + `开始接入` indigo pill。无 announcement bar。`nav-bar-on-mesh` 组件参考 DESIGN.md。

2. **Hero（双列 + mesh 背景）**：
   - **Mesh** 装满上 ~55% viewport，文字与代码块浮于 mesh 之上的 white container（不是直接落到 mesh，是浮于 mesh 之上的"editorial canvas"）。
   - **左 ~50%**：mono micro-cap eyebrow `MODEL API · UNIFIED` → Sohne thin display headline (56px / weight 300 / -1.4px letter-spacing) → 副 ≤2 行 body-lg → 双 CTA（indigo pill `开始接入` + outline pill `查看文档`）→ 信任行 mono `34 个生产级模型 · OpenAI SDK 兼容 · 国内直连`。
   - **右 ~50%**：多 tab 代码块。chrome = mono 终端风（顶 3 mono tab + 右上 `复制` mono），background = `{colors.canvas}`，1px hairline border，Level 1 shadow（DESIGN.md 已允许 `card-dashboard-mockup` 用 Level 2 shadow，此处取 Level 1 以保 hero 浮感）。3 tab 共同点 = `base_url=https://tokenfleet.cn/v1`（indigo voltage 高亮该行 + model id 行），model=`claude-opus-4-7`。**禁** macOS stoplight 红黄绿点。
   - **Mobile (<640px)**：双列退化为上下叠（标题 → 代码块），代码块允许横向滚动。

3. **Featured Models Gallery**：背景 `{colors.canvas-soft}`。左 ~30% sans display-lg 标题 `34 个生产级模型，一份计费` + mono caption 分类索引（LLM · 图像 · 视频 · 音频）+ inline link `查看全部 →` (indigo)。右 ~70% **5-up 模型卡**（mobile 2 列 / tablet 3 列 / desktop 5 列）：
   - 每卡 = 厂商 brand 色块作背景（OpenAI 近黑 / Anthropic 黄褐 / Google 浅蓝 / DeepSeek 深紫 / Qwen 橙）+ 居中大字 mono 模型 id（display-md, weight 300）+ 顶部小字 sans 厂商名 + 底部 mono token cost 1 行
   - 卡片 aspect ratio 4:3, `{rounded.lg}` 12px, Level 1 shadow on hover only
   - 厂商色块取自 simpleicons.org 的 brand color，但 desaturate 8-12% 以匹配 Stripe atmospheric 调性
   - **Risk**：厂商 brand color 不全互配，需 craft 阶段实测视觉一致性（详见 §10 Open Q)

4. **Tri-card 产品分类**（背景 `{colors.canvas}`）：
   - **主卡 1 — `统一 API 网关`**（已上线）：sans display-lg 标题 + body 描述 + mono 单行 code preview + `Use it for:` 3 项 + indigo outline pill CTA `查看支持的模型 →`。卡背景 `{colors.canvas}`，padding 32px，`{rounded.lg}`，hairline border。
   - **主卡 2 — `统一计费与发票 (Unified Billing & Invoicing)`**（已上线 / 新换入）：替换原 Fine-tuning Gateway（产品未上线）。聚焦"对公账户、人民币结算、增值税专票、多人权限、用量看板"finance 维度。卡内视觉主体 = mini 发票截图 mockup（HTML/CSS 实现，mono tabular figures），下方 `Use it for:` 3 项 + indigo outline pill CTA `查看计费机制 →`。**这张卡承接 finance 读者层在 tri-card 段的第一次锚定**，与 §5 Built for Business 段呼应。
   - **Coming-soon 卡 — `GPU 算力出租`**：降饱和 + 灰度 mono `COMING SOON` label + 邮件订阅 `提前申请试用` + disabled outline CTA。**不**链向死页。
   - 3 卡使用 stripe-style 对齐 grid（**不**采用 fal.ai 同款 `ml-offset` 错位 — 与 Stripe atmospheric editorial 调性不符）。

5. **Built for Business**（新增段 / cream interlude / 亮背 `{colors.canvas-cream}`）：
   - 整段背景 `{colors.canvas-cream}` (#f5e9d4)，DESIGN.md cream-band token 落地。
   - 左 ~40% sans display-xl 标题 `让财务也安心地把 AI 调用放进对公账单`（具体措辞 craft 阶段择优，候选见 §8）+ body-lg 副段 1-2 行。
   - 右 ~60% **5 项 finance 能力栅格**（2×3 minus 1 / 或 1×5 横排，craft 择优），每项 = mono micro-cap 标签 + body-md 一行解释：
     1. `对公账户` — 中国大陆主体 / 合同主体 = 深圳市新云计算科技有限公司
     2. `人民币结算 + 增值税专票` — 月度自动开票或按需补开
     3. `多人协作权限` — owner / admin / developer / viewer 四档
     4. `用量看板 + 异常预警` — 按 model / 按 team / 按时段
     5. `合同 SLA / 法务条款` — 可签 MSA / DPA / 中文合同
   - 段底单 CTA outline pill `预约销售对话 →`（mailto 或 placeholder 表单）。
   - **dashboard composite mockup**（DESIGN.md signature component）可选放此段：mini TokenFleet 控制台预览，展示 invoice / billing dashboard / team panel 三块叠合（craft 阶段择优是否做，详见 §10）。

6. **Why-us 2×2 Grid**（替换 fal.ai 速度卡，背景 `{colors.canvas-soft}`）：
   - **A: `34 个生产级模型，一个 endpoint`** — 4×9 或 6×6 mono 网格（共 34 格，每格 `claude-opus-4-7  /  Anthropic`），副 `覆盖 LLM / 图像 / 视频 / 音频`。
   - **B: `私有部署 / VPC 直连`** — schematic：`Public endpoint → Private VPC` 240×160 box+arrow 单色 1.5px stroke（ink / indigo voltage）。
   - **C: `OpenAI SDK 即插即用`** — mono code diff 两行：原 `api.openai.com/v1` → 改 `tokenfleet.cn/v1`（indigo 高亮 diff 行）。副 `一行替换，零代码改动`。
   - **D: `国内直连，毫秒级延迟`** — 替换原 PRD D 卡（finance 维度已在 §5 Built for Business 单独承担）。schematic：海外 endpoint → 国内 CDN/中转节点 → 客户端，配 mono caption `北京 / 上海 / 广州 / 深圳 / 杭州 平均 P50 latency [待填]`。

7. **Enterprise Dark Band**（整页唯一明度反转 / focus 工程侧 enterprise）：背景 `{colors.brand-dark-900}` (#1c1e54)。display-xl 白色 sans `服务大规模生产用量`（**不**写"为企业打造"）。3 条 mono label 横排：`企业级 SLA — 可定制承诺` · `私有部署 / VPC 直连 — 可商谈` · `专属技术对接 — 支持`。单 CTA indigo pill `联系销售 →`。**绝对禁** SOC 2 / ISO / HIPAA / 99.95% 等未拿到资质（PRODUCT.md 硬约束）。
   - **本段与 §5 Built for Business 的分工**：§5 = finance / 采购读者；§7 = 工程侧 enterprise capability（SLA / VPC / 专属对接）。两段在内容上不重叠。

8. **Footer**（5 列 + 备案 strip / 背景 `{colors.canvas}`）：列 1 = wordmark + tagline + 微信公众号 / 视频号 / 抖音 3 二维码（200×200）；列 2 = Product（Models / Pricing / Status / Changelog）；列 3 = Developers（Docs / SDK / API Reference / Cookbook）；列 4 = Company（About / Blog / Careers / Contact）；列 5 = Legal & Compliance（Terms / Privacy / DPA / Security）。底部 strip：左 `深圳市新云计算科技有限公司 © 2026` / 右 `粤ICP备2022003994号-6`（链工信部 `https://beian.miit.gov.cn/`，`target="_blank" rel="noopener noreferrer"`）。

**Mobile (<640px)**：hero 双列 → 上下叠；Featured 5-up → 2 列；Tri-card → 纵向叠加；Built for Business 左右 → 上下；Why-us 2×2 → 1×4；footer 5 列 → 2 列折叠 + 备案独立 strip。

## 6. Key States

| Surface                   | Default                          | Loading                                         | Error                      | Edge / a11y                                                  |
| ------------------------- | -------------------------------- | ----------------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| Hero code tab             | curl 默认激活                    | n/a (静态)                                      | n/a                        | 长内容 mono 横向滚动；键盘 ←/→ 切 tab；focus ring indigo 2px |
| Code copy 按钮            | mono `复制`                      | 按下 → 100ms 内 `已复制 ✓` (indigo)，800ms 回退 | `无法复制，请手动选中`     | clipboard API 不可用 → execCommand fallback                  |
| Featured 5-up             | 全展示                           | n/a                                             | n/a                        | mobile 2 / tablet 3 / desktop 5；keyboard tabbable           |
| Tri-card 主卡 2 mini 发票 | 静态 mockup                      | n/a                                             | n/a                        | 全 mono tabular figures；contrast AA                         |
| Built for Business CTA    | outline pill                     | mailto / placeholder                            | n/a                        | n/a                                                          |
| Coming-soon 邮件          | placeholder `your@email.com`     | `submitting...` 灰                              | inline indigo text invalid | 重复订阅：`您已在候补名单`                                   |
| Enterprise CTA            | indigo pill                      | mailto / 表单 placeholder                       | n/a                        | n/a                                                          |
| ICP 链接                  | underline-on-hover               | n/a                                             | n/a                        | `target="_blank" rel="noopener noreferrer"`                  |
| Reduced motion            | 关闭所有 reveal 动画 + mesh 静止 | —                                               | —                          | `prefers-reduced-motion: reduce`                             |
| 焦点态                    | 2px indigo ring + 2px offset     | —                                               | —                          | 键盘 Tab 覆盖全部 interactive                                |

## 7. Interaction Model

- **Scroll**：无 marquee、无 parallax、无 auto-reveal。Section 间 150–250ms 渐入（IntersectionObserver），尊重 `prefers-reduced-motion`。Mesh 始终静止（即使在允许 motion 的情况下，mesh 不做漂移动画——避免廉价感）。
- **Hero code tab**：click / Tab+Enter 切换；active tab 下方 1px indigo underline 位移 200ms `ease-out-quart`。
- **Code copy**：`navigator.clipboard.writeText` → 按钮文字翻转 → 800ms 回退。
- **CTA hover**：indigo pill = `{colors.primary-press}` (#2e2b8c) 100ms `ease-out-quart`（**无** shadow / scale / translate）；outline = indigo border + 5% indigo wash。
- **Tri-card / Featured card hover**：仅 border hairline → ink-50% + Level 1 shadow rise（subtle，<8px translate-y）。
- **键盘**：focus ring 2px indigo + 2px offset，Tab 顺序 = 视觉顺序。

## 8. Content Requirements

- 文案语气：第二人称中文 + 简短陈述句；**禁** 感叹号 / 问号营销标题 / emoji / `提升 X%` 营销数字 / em dash / `--`。
- 数字 / 版本 / 价格 / endpoint / SLA / 延迟 / 发票金额一律 mono + tabular figures (`font-feature-settings: "tnum"`)。
- 真实数据：模型总数 = **34**（hard）。公司主体 = 深圳市新云计算科技有限公司。ICP = 粤ICP备2022003994号-6。
- 占位 `[待填]`（craft 前必填或上线前替换）：厂商家数、免费额度具体数值、SLA 数字、起售价、联系邮箱、视频号 / 抖音号二维码、5 个 Featured Models 的真实 model id + token cost、Why-us D 段 latency 数据。
- **Hero headline 候选**（craft 阶段择优 + A/B）：
  - (i) `一个 endpoint，接入全部主流大模型`
  - (ii) `34 个模型，一份计费`
  - (iii) `用 OpenAI SDK，调用 Claude、Gemini、DeepSeek。`（最工程师向）
- **Hero 副标**：`聚合 OpenAI、Anthropic、Google、DeepSeek、Qwen 等 34 个生产级 LLM / 图像 / 视频模型。一个 API key，一份发票，国内直连。`
- **Built for Business 标题候选**（craft 择优）：
  - (i) `让财务也安心地把 AI 调用放进对公账单`
  - (ii) `从工程师的代码到财务的发票，一条路径`
  - (iii) `供工程使用，按企业财务流程交付`
- **Enterprise 标题**：`服务大规模生产用量`。

## 9. Recommended References (craft 阶段优先加载)

- `reference/spatial-design.md` — 80–128px section padding + 9 段长页节奏 + mobile 单列重排
- `reference/typography.md` — Sohne thin (weight 300) + 负 letter-spacing + tabular figures + ss01 stylistic set
- `reference/color-and-contrast.md` — OKLCH + Committed strategy + mesh + cream + dark band + WCAG AA on indigo
- `reference/interaction-design.md` — hero tab + copy 按钮 state + 邮件订阅 form + focus ring
- `reference/responsive-design.md` — 4 档断点 + 双列变上下叠 + mesh mobile 重排
- `reference/motion-design.md` — 150–250ms 渐入 + reduced-motion 尊重 + mesh 静止 + ease-out-quart underline
- `reference/ux-writing.md` — 第二人称中文 + 禁感叹号 + 诚实化措辞 + finance 段语言
- `reference/cognitive-load.md` — hero 5-second readability check + 双读者层注意力分配

## 10. Open Questions (craft 阶段 resolve，不阻塞 brief confirm)

1. **Stack ADR**：倾向 **Astro**（静态 + 极佳 Lighthouse + 局部 island for hero tab + 邮件订阅），craft 阶段正式记 ADR；备选 Next.js 14 (app router) / Vite + React。Astro 在 mesh SVG / 静态 hero / multi-island 场景下默认胜出，但 finance 段如果未来要加交互（如 invoice 预览切换 dataset）需评估。
2. **Wordmark 形态**：`Token` ink + `Fleet` indigo voltage 走法 vs 全 ink + indigo 句点 vs 全 indigo —— craft 阶段做 2-3 个 probe。
3. **Featured Models 厂商 brand color collision**：5 张卡用厂商 brand 背景色块，5 个色相之间的视觉协调可能崩塌（OpenAI 近黑 + Anthropic 黄褐 + Google 浅蓝 + DeepSeek 深紫 + Qwen 橙 一起放）。craft 阶段需在浏览器实测，必要时统一 desaturate 12-18% 或加 mesh-tint overlay。
4. **dashboard composite mockup 是否做 + 放哪**：DESIGN.md signature component。候选位置 = (a) Built for Business 段右半，承担 mini invoice + billing + team UI 三块；(b) Hero 段右半替代代码块（与 Decision Hero 双列冲突，drop）；(c) 单独一段在 Tri-card 与 Built for Business 之间。craft 阶段择优。
5. **Cream interlude 是否仅 Built for Business 段独占**：当前 brief 答案是"是"。如果 craft 阶段觉得 cream 太单调 / 太抢戏，可考虑把 Tri-card 主卡 2 (Unified Billing & Invoicing) 卡内背景换成 cream，与 §5 形成视觉照应（呼应 fal.ai "warm card in cool sea" 节奏感）。
6. **免费额度具体数值**：craft 前由用户提供；否则 hero 信任行该项删除。
7. **5-up Featured Models 选哪 5 个**：从 34 个中选最具代表性（覆盖 LLM/图像/视频/音频 + 至少 3 厂商）。候选：claude-opus-4-7 / gpt-5 / gemini-3-pro / flux-1.1-pro / kling-2.0。
8. **Tri-card 主卡 2 "Unified Billing & Invoicing" 真实边界**：mini 发票 mockup 需要符合中国大陆增值税专票格式真实感。craft 阶段确认是否套用真实模板 (税号 / 公司全称 / 开票金额示例)；若涉及合规审核，先用 sample data。
9. **Image probes deferred**：本 harness（Claude Code）无 native image gen，craft 阶段用 HTML/CSS 直接迭代视觉。
10. **`docs/prd.md` 同步**：本 brief 通过后，`docs/prd.md` 内 Decision 1-10 大部分作废，需手动重写 PRD 的 Goal / What I already know / Requirements / Acceptance / Asset Manifest / Decision 段。建议在 craft 启动前先做。

---

**Image gate**: skipped — Claude Code (this harness) lacks native image generation. Visual probes replaced by text wireframe descriptions in §5.

**Replaces**: v1 brief (Calm Console + sienna ≤10% + flat + no shadow) — fundamentally incompatible with new PRODUCT.md (Stripe-grade atmospherics + indigo + mesh + cream interlude + Sohne thin).
