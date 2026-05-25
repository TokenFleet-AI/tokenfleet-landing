export type Locale = 'zh' | 'en';

export const locales: Locale[] = ['zh', 'en'];
export const defaultLocale: Locale = 'zh';

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'zh') return normalized;
  if (normalized === '/') return '/en';
  return `/en${normalized}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}

export function ogLocale(locale: Locale): string {
  return locale === 'zh' ? 'zh_CN' : 'en_US';
}

export const i18n = {
  zh: {
    htmlLang: 'zh-CN',
    localeName: '中文',
    switchLabel: 'EN',
    skipToMain: '跳到主要内容',
    homeAria: 'TokenFleet 首页',
    seo: {
      homeTitle: 'TokenFleet · 一个 API key，接入全部主流大模型',
      homeDescription:
        '通过统一 API 网关聚合 DeepSeek、Moonshot、MiniMax、智谱 等生产级 LLM 模型。一个 API key，一份发票，国内直连。',
      modelsTitle: (total: number) => `全部 ${total} 个模型 · TokenFleet`,
      modelsDescription: (total: number, vendorCount: number) =>
        `覆盖 ${vendorCount} 家厂商的 ${total} 个生产级 AI 模型。一个 endpoint 调用所有，按厂商筛选、按价格排序、查看官方简介与完整价格分解。`,
    },
    nav: {
      aria: '主导航',
      links: {
        models: '模型',
        billing: '账单',
        docs: '文档',
        enterprise: '企业服务',
      },
      signIn: '登录',
      start: '开始接入',
      openMenu: '打开菜单',
      closeMenu: '关闭菜单',
    },
    hero: {
      eyebrow: '统一模型 API',
      titlePrefix: '一个平台',
      titleRest: '调用多家主流模型。',
      bodyBefore: '通过 TokenFleet 聚合 DeepSeek、Moonshot、MiniMax、智谱 等',
      bodyAfter: '个生产级 LLM 模型。一个 API key，一份发票，国内直连。',
      docs: '查看文档',
      trustAria: '平台特性',
      trustModels: (total: number) => `${total} 个生产级模型`,
      trustGateway: '统一 API 网关',
      trustDirect: '国内直连',
    },
    code: {
      aria: '代码示例语言',
      copy: '复制',
      copied: '已复制',
      copyFailed: '复制失败',
      prompt: '用一句话解释 RAG。',
      comment: '同样的请求体，换 base_url 即接入',
    },
    brandStrip: {
      title: '已接入的主流模型',
      aria: '平台已接入的 AI 厂商与模型',
    },
    featured: {
      eyebrow: '模型目录',
      title: (total: number) => `${total} 个生产级模型，\n一份计费。`,
      body: '全部走同一个 OpenAI 兼容 endpoint 与同一个对公账户。',
      viewAll: '查看全部模型',
      fallbackBlurb: '生产级模型接入',
      blurbs: {
        'deepseek-v4-pro': 'DeepSeek 新一代旗舰推理模型',
        'DeepSeek-V3.2': '高性价比推理与工具调用',
        'kimi-k2.5': '原生视觉智能体引擎',
        'kimi-k2.6': '国产长文本与办公场景',
        'MiniMax-M2.7': '高效编程与自我迭代',
        'glm-5.1': '智谱新一代语言模型',
      },
    },
    product: {
      eyebrow: 'TokenFleet 产品线',
      title: '三条产品线，一条 endpoint，一份对公账单。',
      cards: [
        {
          eyebrow: '产品 01',
          title: '统一 API 网关',
          body: '生产级模型聚合在同一个 API 网关下。一个 API key，今天接入多家模型。',
          bullets: [
            '统一 endpoint 与 API key',
            '同账户、同对账、同发票',
            '国内直连，低延迟',
          ],
          cta: '查看支持的模型',
        },
        {
          eyebrow: '产品 02',
          title: '统一计费与发票',
          body: '一个对公账户，自动汇总跨厂商用量。月底一张人民币增值税专票。',
          bullets: [
            '跨厂商用量统一对账',
            '月度自动开票或按需补开',
            '团队 / 项目维度的成本归属',
          ],
          cta: '查看计费机制',
        },
        {
          eyebrow: '产品 03 · 即将推出',
          title: 'GPU 算力出租',
          body: '按小时计费的 H100 / H200 集群，跑你自己的训练与微调任务。准备中。',
          cta: '联系销售咨询',
        },
      ],
      invoice: {
        aria: '增值税专用发票示意',
        chop: ['对', '公', '专', '票'],
        title: 'TokenFleet · 增值税专用发票',
        total: '合计（含税 6%）',
        buyer: '购方：示例企业有限公司',
        date: '开票日期 2026-04-30',
      },
    },
    business: {
      eyebrow: '为企业流程而建',
      title: '让财务也安心地把 AI 调用\n放进对公账单。',
      body: 'TokenFleet 不只服务工程师。从合同主体到月底发票，从权限分级到对账数据，按中国大陆企业财务流程交付。',
      sales: '预约销售对话',
      dpa: '索取 DPA 模板',
      rolesAria: '账户角色示例',
      rolesTitle: '账户角色',
      capabilities: [
        [
          '对公账户',
          '中国大陆主体 · 合同主体 = 深圳市新云计算科技有限公司。',
          'mainland-cn entity',
        ],
        [
          '人民币结算 / 增值税专票',
          '月度自动开票或按需补开 · 支持专票 6% 与普票切换。',
          'cny · vat invoice',
        ],
        [
          '多人协作权限',
          '四档角色：Owner · Admin · Developer · Viewer，按团队 / 项目隔离。',
          'rbac · scoped keys',
        ],
        [
          '用量看板与异常预警',
          '按 model / 按 team / 按时段的实时用量，超阈值自动告警。',
          'usage · anomaly',
        ],
        [
          '合同 SLA 与法务条款',
          '可签 MSA / DPA / 中文合同 · 季度对账支持。',
          'msa · dpa · sla',
        ],
      ],
    },
    why: {
      eyebrow: '为什么选择 TokenFleet',
      title: '为什么选 TokenFleet。',
      body: '四件可被验证的事，不是四条形容词。',
      cards: {
        modelsTitle: (total: number) => `${total} 个生产级模型，一个 endpoint`,
        modelsBody:
          '覆盖 LLM、图像、视频、音频，通过统一 API 网关完成调用、计量与对账。',
        moreModels: '更多生产级模型',
        vpcTitle: '私有部署 / VPC 直连',
        vpcBody:
          '用量到达一定规模可申请 VPC 直连 endpoint，请求不离开你的私网边界。',
        privateEgress: '不出私网',
        endpointTitle: '统一 endpoint 接入',
        endpointBody:
          '同一个 API key 调用多家模型，接入路径与用量记录保持一致。',
        endpointCaption: '每月 token 用量、错误率、模型分布 → 控制台一站可见。',
        latencyTitle: '国内直连，毫秒级延迟',
        latencyBody: '五大城市平均首字延迟（P50），按真实生产请求样本。',
        city: '城市',
        overseas: '海外直连',
        statusPrefix: '数据样本 2026-04 ·',
        statusLink: '查看 status',
      },
      cities: ['北京', '上海', '广州', '深圳', '杭州'],
    },
    enterprise: {
      eyebrow: '面向生产规模',
      title: '服务大规模生产用量。',
      body: '当 token 用量越过自服务的边界，我们与你的工程团队直接对接：单点接入、容量规划、独立路由、定制条款。',
      labels: [
        ['SLA', '企业级 SLA', '按用量等级与团队规模定制承诺，月度可对账。'],
        [
          'VPC',
          '私有部署 / VPC 直连',
          '请求不出私网边界。具体形态按规模商谈。',
        ],
        ['SUPPORT', '专属技术对接', '7×24 中文工程支持渠道，故障一线响应。'],
      ],
      cta: '联系销售',
      note: '通常 24 小时内回复 · sales@tokenfleet.cn',
    },
    models: {
      eyebrow: '模型目录',
      title: (total: number) => `${total} 个生产级模型，\n一份 endpoint。`,
      body: (vendorCount: number) =>
        `覆盖 ${vendorCount} 家厂商的生产级 LLM 模型。按厂商筛选、按价格排序、点开查看官方简介与完整价格分解。`,
      statsModels: (total: number) => `${total}个模型`,
      statsVendors: (vendorCount: number) => `${vendorCount}家厂商`,
      statsEndpoints: 'OpenAI 兼容 endpoint',
      filterAria: '模型筛选',
      vendorAria: '按厂商筛选',
      modalityAria: '按形态筛选',
      all: '全部',
      modalities: { chat: 'LLM', image: '图像', video: '视频', audio: '音频' },
      searchLabel: '搜索模型名',
      searchPlaceholder: '搜索模型名',
      sortLabel: '排序',
      sortDefault: '默认顺序',
      sortInputAsc: '输入价 ↑',
      sortInputDesc: '输入价 ↓',
      sortOutputAsc: '输出价 ↑',
      sortOutputDesc: '输出价 ↓',
      counter: (shown: string | number, total: number) =>
        `${shown} / ${total} 个模型`,
      empty: '未找到匹配的模型。',
      reset: '清除筛选',
      cardAria: (model: string) => `查看 ${model} 详情`,
      pricePerCall: '次',
      noDescription: '该模型暂无官方简介。',
      docs: '查看厂商文档 ↗',
      close: '关闭',
      detailIntro: '官方简介',
      price: '价格',
      specs: '规格',
      endpoints: '支持的 Endpoint',
      context: '上下文窗口',
      maxOutput: '最大输出',
      billing: '计费方式',
      billingToken: '按 token',
      billingCall: '按调用次数',
      groups: '可用分组',
      range: '区间',
      inputPerM: '输入 / 1M',
      outputPerM: '输出 / 1M',
      cachedInput: '缓存命中输入',
      cacheWrite: '缓存写入',
      input: '输入',
      output: '输出',
      perCall: '按次调用',
      copyId: '复制 model id',
      copied: '已复制',
      console: '去控制台调用',
    },
    footer: {
      tagline:
        '一站式 AI 模型 API 网关。一个 API key 接所有模型，一份对公账单结全部账。',
      follow: '关注我们',
      cols: {
        product: '产品',
        developers: '开发者',
        company: '公司',
        compliance: '合规',
      },
      links: {
        models: '模型目录',
        billing: '账单与发票',
        enterprise: '企业服务',
        status: '状态页',
        docs: '文档',
        apiReference: 'API 参考',
        apiExamples: 'API 示例',
        blog: '博客',
        contactSales: '联系销售',
        console: '控制台',
        entityInvoice: '主体与发票',
        sla: 'SLA 咨询',
        icp: 'ICP 备案',
      },
      followItems: [
        ['微信社群', 'TokenFleet 微信社群 QR 码'],
        ['微信公众号', 'TokenFleet 微信公众号 QR 码'],
        ['抖音', 'TokenFleet 抖音 QR 码'],
      ],
      qrAria: (label: string) => `${label} QR 码`,
      company: '深圳市新云计算科技有限公司 © 2026',
      icp: '粤ICP备2022003994号-6',
    },
  },
  en: {
    htmlLang: 'en',
    localeName: 'English',
    switchLabel: '中文',
    skipToMain: 'Skip to main content',
    homeAria: 'TokenFleet home',
    seo: {
      homeTitle: 'TokenFleet · One API key for leading AI models',
      homeDescription:
        'TokenFleet unifies production LLM models from DeepSeek, Moonshot, MiniMax, Zhipu, and more behind one API gateway, one key, and one invoice.',
      modelsTitle: (total: number) => `All ${total} models · TokenFleet`,
      modelsDescription: (total: number, vendorCount: number) =>
        `Browse ${total} production AI models across ${vendorCount} vendors. Filter by vendor, sort by price, and inspect official descriptions and pricing details.`,
    },
    nav: {
      aria: 'Primary navigation',
      links: {
        models: 'Models',
        billing: 'Billing',
        docs: 'Docs',
        enterprise: 'Enterprise',
      },
      signIn: 'Sign in',
      start: 'Start building',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      eyebrow: 'MODEL API · UNIFIED',
      titlePrefix: 'One platform',
      titleRest: 'for leading models.',
      bodyBefore:
        'TokenFleet aggregates production LLM models from DeepSeek, Moonshot, MiniMax, Zhipu, and more:',
      bodyAfter:
        ' models through one API key, one invoice, and direct mainland connectivity.',
      docs: 'View docs',
      trustAria: 'Platform features',
      trustModels: (total: number) => `${total} production models`,
      trustGateway: 'Unified API gateway',
      trustDirect: 'Direct mainland routing',
    },
    code: {
      aria: 'Code sample language',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      prompt: 'Explain RAG in one sentence.',
      comment: 'Same request body, switch base_url to connect',
    },
    brandStrip: {
      title: 'POWERED BY THESE MODELS',
      aria: 'AI vendors and models connected to the platform',
    },
    featured: {
      eyebrow: 'MODELS GALLERY',
      title: (total: number) =>
        `${total} production models,\none billing layer.`,
      body: 'All models share one OpenAI-compatible endpoint and one business account.',
      viewAll: 'View all models',
      fallbackBlurb: 'Production model access',
      blurbs: {
        'deepseek-v4-pro': 'Next-gen DeepSeek flagship reasoning model',
        'DeepSeek-V3.2': 'Efficient reasoning and tool use',
        'kimi-k2.5': 'Native visual agent engine',
        'kimi-k2.6': 'Long-form Chinese documents and office tasks',
        'MiniMax-M2.7': 'Efficient coding with self-iteration',
        'glm-5.1': 'Next-gen Zhipu language model',
      },
    },
    product: {
      eyebrow: 'WHAT TOKENFLEET SHIPS',
      title: 'Three product lines, one endpoint, one business invoice.',
      cards: [
        {
          eyebrow: 'PRODUCT 01',
          title: 'Unified API gateway',
          body: 'Production models are aggregated behind one API gateway. One API key connects your app to multiple vendors today.',
          bullets: [
            'Unified endpoint and API key',
            'One account, reconciliation, and invoice',
            'Direct mainland routing with lower latency',
          ],
          cta: 'View supported models',
        },
        {
          eyebrow: 'PRODUCT 02',
          title: 'Unified billing and invoicing',
          body: 'One business account consolidates cross-vendor usage into a monthly CNY VAT invoice.',
          bullets: [
            'Cross-vendor usage reconciliation',
            'Monthly automatic or on-demand invoices',
            'Team and project cost attribution',
          ],
          cta: 'View billing workflow',
        },
        {
          eyebrow: 'PRODUCT 03 · COMING SOON',
          title: 'GPU compute rental',
          body: 'Hourly H100 / H200 clusters for your own training and fine-tuning jobs. In preparation.',
          cta: 'Contact sales',
        },
      ],
      invoice: {
        aria: 'VAT invoice example',
        chop: ['V', 'A', 'T', ''],
        title: 'TokenFleet · VAT Invoice',
        total: 'Total (incl. 6% tax)',
        buyer: 'Buyer: Example Co., Ltd.',
        date: 'Issue date 2026-04-30',
      },
    },
    business: {
      eyebrow: 'BUILT FOR BUSINESS',
      title: 'Put AI usage into finance-approved billing.',
      body: 'TokenFleet serves more than engineers: mainland China contracting, monthly invoices, permission controls, and reconciliation data for enterprise finance workflows.',
      sales: 'Book a sales call',
      dpa: 'Request DPA template',
      rolesAria: 'Account role example',
      rolesTitle: 'ACCOUNT ROLES',
      capabilities: [
        [
          'Business account',
          'Mainland China entity · Contracting entity = Shenzhen Xinyun Computing Technology Co., Ltd.',
          'mainland-cn entity',
        ],
        [
          'CNY settlement / VAT invoice',
          'Monthly auto-invoicing or on-demand reissue · special and general VAT invoice support.',
          'cny · vat invoice',
        ],
        [
          'Multi-user permissions',
          'Four roles: Owner · Admin · Developer · Viewer, scoped by team and project.',
          'rbac · scoped keys',
        ],
        [
          'Usage dashboards and alerts',
          'Real-time usage by model, team, and time window, with threshold-based alerts.',
          'usage · anomaly',
        ],
        [
          'Contract SLA and legal terms',
          'MSA / DPA / Chinese contracts available, with quarterly reconciliation support.',
          'msa · dpa · sla',
        ],
      ],
    },
    why: {
      eyebrow: 'WHY TOKENFLEET',
      title: 'Why TokenFleet.',
      body: 'Four verifiable capabilities, not four adjectives.',
      cards: {
        modelsTitle: (total: number) =>
          `${total} production models, one endpoint`,
        modelsBody:
          'LLM, image, video, and audio calls run through one API gateway for execution, metering, and reconciliation.',
        moreModels: 'more production models',
        vpcTitle: 'Private deployment / VPC direct connect',
        vpcBody:
          'At scale, teams can request a VPC endpoint so traffic stays inside their private network boundary.',
        privateEgress: 'private egress only',
        endpointTitle: 'Unified endpoint integration',
        endpointBody:
          'One API key can call multiple model providers while keeping integration paths and usage records consistent.',
        endpointCaption:
          'Monthly token usage, error rates, and model mix are visible in one console.',
        latencyTitle: 'Direct mainland routing, millisecond latency',
        latencyBody:
          'Average time to first token (P50) across five cities from production samples.',
        city: 'City',
        overseas: 'Overseas direct',
        statusPrefix: 'Sample window 2026-04 ·',
        statusLink: 'View status',
      },
      cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou'],
    },
    enterprise: {
      eyebrow: 'FOR PRODUCTION SCALE',
      title: 'Built for large-scale production usage.',
      body: 'When token usage outgrows self-serve limits, we work directly with your engineering team on single-entry integration, capacity planning, dedicated routing, and custom terms.',
      labels: [
        [
          'SLA',
          'Enterprise SLA',
          'Commitments are tailored by usage tier and team size, with monthly reconciliation.',
        ],
        [
          'VPC',
          'Private deployment / VPC direct connect',
          'Requests can stay inside your private network boundary. Final shape depends on scale.',
        ],
        [
          'SUPPORT',
          'Dedicated technical contact',
          '7x24 Chinese engineering support channel with front-line incident response.',
        ],
      ],
      cta: 'Contact sales',
      note: 'Usually replies within 24 hours · sales@tokenfleet.cn',
    },
    models: {
      eyebrow: 'MODELS CATALOG',
      title: (total: number) => `${total} production models,\none endpoint.`,
      body: (vendorCount: number) =>
        `Covering production LLM models across ${vendorCount} vendors. Filter by vendor, sort by price, and open each model for official descriptions and full pricing details.`,
      statsModels: (total: number) => `${total} models`,
      statsVendors: (vendorCount: number) => `${vendorCount} vendors`,
      statsEndpoints: 'OpenAI-compatible endpoint',
      filterAria: 'Model filters',
      vendorAria: 'Filter by vendor',
      modalityAria: 'Filter by modality',
      all: 'All',
      modalities: {
        chat: 'LLM',
        image: 'Image',
        video: 'Video',
        audio: 'Audio',
      },
      searchLabel: 'Search model name',
      searchPlaceholder: 'Search model name',
      sortLabel: 'Sort',
      sortDefault: 'Default order',
      sortInputAsc: 'Input price ↑',
      sortInputDesc: 'Input price ↓',
      sortOutputAsc: 'Output price ↑',
      sortOutputDesc: 'Output price ↓',
      counter: (shown: string | number, total: number) =>
        `${shown} / ${total} models`,
      empty: 'No matching models.',
      reset: 'Clear filters',
      cardAria: (model: string) => `View ${model} details`,
      pricePerCall: 'call',
      noDescription: 'No official description is available for this model yet.',
      docs: 'View vendor docs ↗',
      close: 'Close',
      detailIntro: 'Official description',
      price: 'Pricing',
      specs: 'Specs',
      endpoints: 'Supported endpoints',
      context: 'Context window',
      maxOutput: 'Max output',
      billing: 'Billing',
      billingToken: 'Token-based',
      billingCall: 'Per call',
      groups: 'Available groups',
      range: 'Range',
      inputPerM: 'Input / 1M',
      outputPerM: 'Output / 1M',
      cachedInput: 'Cached input',
      cacheWrite: 'Cache write',
      input: 'Input',
      output: 'Output',
      perCall: 'Per call',
      copyId: 'Copy model id',
      copied: 'Copied',
      console: 'Open console',
    },
    footer: {
      tagline:
        'A one-stop AI model API gateway. One API key connects every model, and one business invoice settles usage.',
      follow: 'Follow',
      cols: {
        product: 'Product',
        developers: 'Developers',
        company: 'Company',
        compliance: 'Compliance',
      },
      links: {
        models: 'Models',
        billing: 'Billing',
        enterprise: 'Enterprise',
        status: 'Status',
        docs: 'Docs',
        apiReference: 'API Reference',
        apiExamples: 'API Examples',
        blog: 'Blog',
        contactSales: 'Contact Sales',
        console: 'Console',
        entityInvoice: 'Entity and invoices',
        sla: 'SLA inquiry',
        icp: 'ICP filing',
      },
      followItems: [
        ['WeChat group', 'TokenFleet WeChat group QR code'],
        [
          'WeChat official account',
          'TokenFleet WeChat official account QR code',
        ],
        ['Douyin', 'TokenFleet Douyin QR code'],
      ],
      qrAria: (label: string) => `${label} QR code`,
      company: 'Shenzhen Xinyun Computing Technology Co., Ltd. © 2026',
      icp: '粤ICP备2022003994号-6',
    },
  },
} as const;

export type Messages = (typeof i18n)[Locale];
