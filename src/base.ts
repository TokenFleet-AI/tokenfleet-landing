/**
 * base 路径辅助层 — 让站点同时适配「域名根部署」与「子路径部署」。
 *
 * 生产站点（tokenfleet.cn）部署在域名根，`base` 为空；GitHub Pages 项目站点
 * 部署在 `/tokenfleet-landing` 子路径下，`base` 非空。Astro 只会自动为 import
 * 进来的模块资源加 base 前缀，`<a href="/models">`、`<img src="/xy-logo.png">`
 * 这类手写的站内绝对路径不会被处理，子路径部署下会 404。
 *
 * 因此：**所有站内绝对路径都必须过 `withBase()`**，所有绝对 URL 都必须过
 * `absUrl()`（而非直接 `new URL(path, site)` —— 后者会把 base 段丢掉）。
 *
 * `import.meta.env.BASE_URL` 由 `astro.config.mjs` 的 `base` 决定，无 base 时为 `/`。
 */

/** 归一化后的 base 段：根部署为 `''`，子路径部署为 `/tokenfleet-landing`（无尾斜杠）。 */
const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** 站点是否部署在子路径下（GitHub Pages 项目站点等）。 */
export const hasBasePath = BASE !== '';

/**
 * 给站内绝对路径加上 base 前缀。
 *
 * 非 `/` 开头的输入（外链、锚点、相对路径）原样返回。首页 `/` 在子路径部署下
 * 返回 `/tokenfleet-landing/`（保留尾斜杠，避免多一次重定向）。
 */
export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  if (!BASE) return path;
  if (path === '/') return `${BASE}/`;
  return `${BASE}${path}`;
}

/**
 * 把站内绝对路径换算成完整 URL。`site` 不含 base 段，故必须先 `withBase()`
 * 再交给 `new URL()`，否则 `new URL('/models', 'https://host/base')` 会解析成
 * `https://host/models`，丢掉 base。
 */
export function absUrl(path: string, site: URL | string | undefined): string {
  if (!site) {
    throw new Error('astro.config.mjs 缺少 `site`，无法生成绝对 URL');
  }
  return new URL(withBase(path), site).toString();
}
