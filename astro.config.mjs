// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * 部署目标由 `DEPLOY_TARGET` 环境变量切换，默认（未设置）＝生产站点 tokenfleet.cn。
 *
 * - 默认：`site = https://tokenfleet.cn`，无 base，`build.format: 'directory'`，
 *   与改造前完全一致 —— 本文件的改动不得影响现有生产部署。
 * - `DEPLOY_TARGET=github-pages`：部署到 GitHub Pages 项目站点，站点挂在
 *   `/<repo>` 子路径下，故需要 `base`；同时切 `build.format: 'file'`，让
 *   `/models` 直接命中 `models.html`，避免 GitHub Pages 对目录形式 URL 强制
 *   301 到带尾斜杠版本（与 `trailingSlash: 'never'` 及 canonical 冲突）。
 *
 * `SITE_URL` / `BASE_PATH` 可单独覆盖，便于换仓库名或之后切自定义域名
 * （切自定义域名时设 `BASE_PATH=` 空值即可回到根部署）。
 *
 * 站内绝对路径必须过 `src/base.ts` 的 `withBase()` / `absUrl()`，否则子路径
 * 部署下会 404。
 */
/**
 * 构建期环境变量。项目未装 `@types/node`（装了会给全部前端代码注入 node 全局
 * 类型），故经 `globalThis` 取值，避免为一个配置文件放宽整个项目的类型边界。
 *
 * @type {Record<string, string | undefined>}
 */
const env = /** @type {any} */ (globalThis).process?.env ?? {};

const isGithubPages = env.DEPLOY_TARGET === 'github-pages';

const site =
  env.SITE_URL ||
  (isGithubPages ? 'https://tokenfleet-ai.github.io' : 'https://tokenfleet.cn');

const basePath = env.BASE_PATH ?? (isGithubPages ? '/tokenfleet-landing' : '');

export default defineConfig({
  site,
  ...(basePath ? { base: basePath } : {}),
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
    format: isGithubPages ? 'file' : 'directory',
  },
  compressHTML: true,
});
