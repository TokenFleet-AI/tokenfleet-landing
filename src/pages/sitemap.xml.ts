/**
 * XML sitemap — 自建 endpoint（非 @astrojs/sitemap）。
 *
 * 项目用自定义 i18n（`/en` 前缀，非 Astro 内建 i18n 路由），需要精确控制
 * 每个页面的 hreflang 簇，故手写。遍历 `seoPages()`：每个逻辑页面输出
 * 中 / 英两个 `<url>`，每个 `<url>` 内带 zh-CN / en / x-default 三条
 * `<xhtml:link>`（x-default 指向中文 URL）。所有 URL 用 `new URL(path, site)`
 * 绝对化，遵守 `trailingSlash: 'never'`，与各页面 canonical 完全一致。
 */
import type { APIRoute } from 'astro';
import { seoPages } from '../seo/pages.ts';
import { absUrl } from '../base.ts';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('astro.config.mjs 缺少 `site`，无法生成绝对 sitemap URL');
  }

  const abs = (path: string) => absUrl(path, site);

  const urlBlock = (loc: string, zhHref: string, enHref: string) =>
    [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${zhHref}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${enHref}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${zhHref}" />`,
      '  </url>',
    ].join('\n');

  const blocks = seoPages().flatMap((page) => {
    const zhHref = abs(page.zh);
    const enHref = abs(page.en);
    return [urlBlock(zhHref, zhHref, enHref), urlBlock(enHref, zhHref, enHref)];
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
