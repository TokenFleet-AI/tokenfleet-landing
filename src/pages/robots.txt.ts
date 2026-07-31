/**
 * /robots.txt — 构建期生成（原为 `public/robots.txt` 静态文件）。
 *
 * 改成 endpoint 的原因：`Sitemap:` 必须是绝对 URL，写死 `https://tokenfleet.cn`
 * 在其他部署目标（GitHub Pages 预览站点）下会把爬虫指回生产站。现在跟随 `site`
 * + base 自动生成。
 *
 * 子路径部署（`base` 非空 ＝ GitHub Pages 项目站点）视为预览环境，整站 disallow，
 * 避免与 tokenfleet.cn 构成重复内容抢排名。注意：GitHub Pages 项目站点的
 * robots.txt 位于 `/<repo>/robots.txt`，爬虫只读域名根的 robots.txt，故此文件在
 * 该场景下形同虚设 —— 真正生效的是 `Base.astro` 里同样由 base 驱动的
 * `<meta name="robots" content="noindex">`。两处都留，是为了任何一方失效时仍有兜底。
 */
import type { APIRoute } from 'astro';
import { absUrl, hasBasePath } from '../base.ts';

export const GET: APIRoute = ({ site }) => {
  const body = hasBasePath
    ? ['User-agent: *', 'Disallow: /', ''].join('\n')
    : [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${absUrl('/sitemap.xml', site)}`,
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
