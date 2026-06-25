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

const ORG_NAME = 'TokenFleet';

/** 把站内绝对路径换算成基于 `site` 的完整 https URL。 */
function abs(site: URL | string, path: string): string {
  return new URL(path, site).toString();
}

/** schema.org Organization — 站点背后的实体。 */
export function organizationSchema(site: URL | string) {
  const home = new URL(site).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: home,
    logo: abs(site, '/xy-logo.png'),
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
  const home = new URL(site).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NAME,
    url: home,
  };
}
