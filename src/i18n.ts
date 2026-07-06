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
        'deepseek-v3.2': '高性价比推理与工具调用',
        'kimi-k2.6': '国产长文本与办公场景',
        'kimi-k2.7-code': '代码与智能体工作流',
        'MiniMax-M2.7': '高效编程与自我迭代',
        'glm-5.2': '智谱新一代语言模型',
        'doubao-seedance-2-0-fast-260128': '字节 Seedance 视频模型',
      },
      facts: {
        models: '生产级模型',
        vendors: '模型厂商',
        modalities: '覆盖模态',
        modalitiesValue: 'LLM · 图像 · 视频 · 音频',
        access: '统一接入',
        accessValue: 'OpenAI 兼容 endpoint',
        billing: '统一计费',
        billingValue: '单一对公账户 · 人民币',
      },
    },
    product: {
      eyebrow: 'TokenFleet 产品线',
      title: '一条 endpoint，接入所有模型。',
      cards: [
        {
          eyebrow: '产品',
          title: '统一 API 网关',
          body: '生产级模型聚合在同一个 API 网关下。一个 API key，今天接入多家模型。',
          bullets: [
            '统一 endpoint 与 API key',
            '同账户、同对账、同发票',
            '国内直连，低延迟',
          ],
          cta: '查看支持的模型',
        },
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
      note: '通常 24 小时内回复 · zhangyue@nyuncloud.com',
    },
    salesQr: {
      title: '联系 TokenFleet 销售',
      caption: '扫码加入微信社群，获取企业用量与接入支持。',
      alt: 'TokenFleet 微信社群 QR 码',
      close: '关闭销售二维码',
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
      detailTitle: (model: string, vendor: string) =>
        `${model} 价格与 API 接入 · ${vendor} · TokenFleet`,
      detailDescription: (model: string, vendor: string, price: string) =>
        `通过 TokenFleet 统一 API 调用 ${vendor} 的 ${model}：${price}。一个 API key，OpenAI SDK 兼容，国内直连，查看上下文窗口、计费方式与完整价格分解。`,
      breadcrumbHome: '首页',
      backToModels: '返回模型目录',
      faqTitle: '常见问题',
    },
    faq: {
      eyebrow: '常见问题',
      title: '关于 TokenFleet。',
      items: [
        {
          q: 'TokenFleet 是什么？',
          a: 'TokenFleet 是一站式 AI 模型 API 网关，把 DeepSeek、Moonshot、MiniMax、智谱 等厂商的生产级 LLM、图像、视频、音频模型聚合到同一个 OpenAI 兼容 endpoint：一个 API key、一份人民币对公发票，国内直连。',
        },
        {
          q: '怎么接入？支持 OpenAI SDK 吗？',
          a: '支持。TokenFleet 与 OpenAI SDK 兼容：保持原有请求体，把 base_url 换成 TokenFleet 的统一 endpoint，用同一个 API key 指定 model id 即可。同时支持 anthropic、gemini endpoint。',
        },
        {
          q: 'TokenFleet 接入了哪些模型？',
          a: '覆盖 DeepSeek、Moonshot、MiniMax、智谱 等厂商的生产级 LLM、图像、视频、音频模型，全部走同一个 endpoint 与同一个对公账户完成调用、计量与对账。完整清单见模型目录。',
        },
        {
          q: '怎么计费？',
          a: '按 token 或按调用次数计费，取决于具体模型。所有用量计入单一对公账户、人民币结算，统一对账与发票。',
        },
        {
          q: '国内能直连吗，延迟如何？',
          a: '支持国内直连，低延迟。北京、上海、广州、深圳、杭州等地按真实生产请求样本测得毫秒级首字延迟，实时数据见状态页。',
        },
        {
          q: '能开发票、走对公付款吗？',
          a: '可以。TokenFleet 支持人民币对公结算与增值税发票，合同主体为深圳市新云计算科技有限公司，多人协作账户与用量对账在控制台可见。',
        },
        {
          q: '有企业级 SLA 和私有部署 / VPC 吗？',
          a: '有。当用量越过自服务边界，可申请企业级 SLA（按用量等级与团队规模定制、月度可对账）、私有部署 / VPC 直连（请求不出私网边界）与 7×24 中文工程支持。联系销售：zhangyue@nyuncloud.com。',
        },
      ],
    },
    footer: {
      tagline:
        '一站式 AI 模型 API 网关。一个 API key 接所有模型，一份对公账单结全部账。',
      follow: '关注我们',
      cols: {
        product: '产品',
        company: '公司',
        compliance: '合规',
      },
      links: {
        models: '模型目录',
        enterprise: '企业服务',
        status: '状态页',
        docs: '文档',
        blog: '博客',
        contactSales: '联系销售',
        console: '控制台',
        sla: 'SLA 咨询',
        icp: 'ICP 备案',
        pricingMd: '定价数据 (Markdown)',
        llms: 'llms.txt',
      },
      followItems: [
        ['微信社群', 'TokenFleet 微信社群 QR 码'],
        ['微信公众号', 'TokenFleet 微信公众号 QR 码'],
        ['抖音', 'TokenFleet 抖音 QR 码'],
      ],
      qrAria: (label: string) => `${label} QR 码`,
      companyName: '深圳市新云计算科技有限公司',
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
        'deepseek-v3.2': 'Efficient reasoning and tool use',
        'kimi-k2.6': 'Long-form Chinese documents and office tasks',
        'kimi-k2.7-code': 'Coding and agent workflows',
        'MiniMax-M2.7': 'Efficient coding with self-iteration',
        'glm-5.2': 'Next-gen Zhipu language model',
        'doubao-seedance-2-0-fast-260128': 'ByteDance Seedance video model',
      },
      facts: {
        models: 'Production models',
        vendors: 'Model vendors',
        modalities: 'Modalities',
        modalitiesValue: 'LLM · Image · Video · Audio',
        access: 'Unified access',
        accessValue: 'OpenAI-compatible endpoint',
        billing: 'One billing layer',
        billingValue: 'Single business account',
      },
    },
    product: {
      eyebrow: 'WHAT TOKENFLEET SHIPS',
      title: 'One endpoint. Every model.',
      cards: [
        {
          eyebrow: 'PRODUCT',
          title: 'Unified API gateway',
          body: 'Production models are aggregated behind one API gateway. One API key connects your app to multiple vendors today.',
          bullets: [
            'Unified endpoint and API key',
            'One account, reconciliation, and invoice',
            'Direct mainland routing with lower latency',
          ],
          cta: 'View supported models',
        },
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
      note: 'Usually replies within 24 hours · zhangyue@nyuncloud.com',
    },
    salesQr: {
      title: 'Contact TokenFleet sales',
      caption:
        'Scan to join the WeChat group for enterprise usage and integration support.',
      alt: 'TokenFleet WeChat group QR code',
      close: 'Close sales QR code',
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
      detailTitle: (model: string, vendor: string) =>
        `${model} pricing & API access · ${vendor} · TokenFleet`,
      detailDescription: (model: string, vendor: string, price: string) =>
        `Call ${vendor}'s ${model} through the TokenFleet unified API: ${price}. One API key, OpenAI SDK compatible — see context window, billing and full price breakdown.`,
      breadcrumbHome: 'Home',
      backToModels: 'Back to models',
      faqTitle: 'FAQ',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'About TokenFleet.',
      items: [
        {
          q: 'What is TokenFleet?',
          a: 'TokenFleet is a one-stop AI model API gateway. It aggregates production LLM, image, video and audio models from vendors like DeepSeek, Moonshot, MiniMax and Zhipu behind one OpenAI-compatible endpoint: one API key, one RMB business invoice, and direct mainland-China routing.',
        },
        {
          q: 'How do I integrate? Is it OpenAI SDK compatible?',
          a: 'Yes. TokenFleet is OpenAI SDK compatible: keep your existing request body, switch base_url to the TokenFleet unified endpoint, and use one API key to set the model id. Anthropic and Gemini endpoint types are also supported.',
        },
        {
          q: 'Which models does TokenFleet support?',
          a: 'Production LLM, image, video and audio models from vendors like DeepSeek, Moonshot, MiniMax and Zhipu, all called, metered and reconciled through one endpoint and one business account. See the models catalog for the full list.',
        },
        {
          q: 'How does billing work?',
          a: 'Models are billed per token or per call, depending on the model. All usage settles through a single RMB business account with unified reconciliation and invoicing.',
        },
        {
          q: 'Is there direct mainland-China connectivity, and what about latency?',
          a: 'Yes, direct mainland routing with low latency. Time to first token is measured in milliseconds across Beijing, Shanghai, Guangzhou, Shenzhen and Hangzhou from real production samples; see the status page for live data.',
        },
        {
          q: 'Can you issue invoices and accept business payments?',
          a: 'Yes. TokenFleet supports RMB business settlement and VAT invoices. The contracting entity is Shenzhen Xinyun Computing Technology Co., Ltd., and multi-user accounts with usage reconciliation are visible in the console.',
        },
        {
          q: 'Do you offer an enterprise SLA and private deployment / VPC?',
          a: 'Yes. When usage outgrows self-serve limits, you can request an enterprise SLA (tailored by usage tier and team size, with monthly reconciliation), private deployment / VPC direct connect (traffic stays inside your private network boundary), and 7x24 Chinese engineering support. Contact sales: zhangyue@nyuncloud.com.',
        },
      ],
    },
    footer: {
      tagline:
        'A one-stop AI model API gateway. One API key connects every model, and one business invoice settles usage.',
      follow: 'Follow',
      cols: {
        product: 'Product',
        company: 'Company',
        compliance: 'Compliance',
      },
      links: {
        models: 'Models',
        enterprise: 'Enterprise',
        status: 'Status',
        docs: 'Docs',
        blog: 'Blog',
        contactSales: 'Contact Sales',
        console: 'Console',
        sla: 'SLA inquiry',
        icp: 'ICP filing',
        pricingMd: 'Pricing (Markdown)',
        llms: 'llms.txt',
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
      companyName: 'Shenzhen Xinyun Computing Technology Co., Ltd.',
      icp: '粤ICP备2022003994号-6',
    },
  },
} as const;

export type Messages = (typeof i18n)[Locale];
