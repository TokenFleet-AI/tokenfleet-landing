/**
 * 站点级 JSON-LD 结构化数据 — Organization + WebSite。
 *
 * 由 `Base.astro` 在每个页面 `<head>` 注入，给搜索引擎与 AI 引擎一个
 * 可被引用的实体定义。`sameAs` 收录站点官方分发面（文档 / 博客 / 母公司 /
 * 登录 / 控制台），全部复用 `site-links.ts` 单一真值源。
 *
 * 函数返回纯对象（不含 `@context` 之外的副作用），调用方负责 `JSON.stringify`
 * 后以 `set:html` 注入 `<script type="application/ld+json">`。
 */
import { DASHBOARD_URL, DOCS_URL, SIGN_IN_URL } from '../site-links.ts';
import { absUrl } from '../base.ts';

const ORG_NAME = 'TokenFleet';

/** 把站内绝对路径换算成基于 `site` + base 的完整 https URL。 */
function abs(site: URL | string, path: string): string {
  return absUrl(path, site);
}

/** 母公司法人主体（与 footer `companyName` 一致），用于 schema `legalName`。 */
const LEGAL_NAME = '深圳市新云计算科技有限公司';

/** 企业 / 销售联系邮箱（与 enterprise 文案 note 一致）。 */
const SALES_EMAIL = 'zhangyue@nyuncloud.com';

/**
 * 一句话实体定义，给 AI 引擎可引用的 Organization 描述。措辞与 `/llms.txt` 摘要、
 * 站内 hero / footer 表述同源，全部为可核对事实，不含营销形容词。
 */
const ORG_DESCRIPTION =
  'TokenFleet 是一站式 AI 模型 API 网关，把 DeepSeek、Moonshot、MiniMax、智谱 等厂商的生产级 LLM、图像、视频、音频模型聚合到同一个 OpenAI 兼容 endpoint，一个 API key、一份人民币对公发票，国内直连。';

/** schema.org Organization — 站点背后的实体。 */
export function organizationSchema(site: URL | string) {
  const home = abs(site, '/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    legalName: LEGAL_NAME,
    description: ORG_DESCRIPTION,
    url: home,
    logo: abs(site, '/xy-logo.png'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SALES_EMAIL,
    },
    sameAs: [
      DOCS_URL,
      'https://blog.tokenfleet.cn',
      'https://nyuncloud.com',
      SIGN_IN_URL,
      DASHBOARD_URL,
    ],
  };
}

/** schema.org WebSite — 站点本身。 */
export function websiteSchema(site: URL | string) {
  const home = abs(site, '/');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NAME,
    url: home,
  };
}
