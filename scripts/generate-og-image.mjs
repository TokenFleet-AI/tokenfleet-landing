/**
 * 一次性脚本：把 public/og-image-source.svg 光栅成 1200×630 的
 * public/og-image.png（社媒分享卡片用）。
 *
 * 不接入构建管线（避免给 CI 加原生依赖）；改了 SVG 后本地重跑：
 *   node scripts/generate-og-image.mjs
 * 然后只提交生成的 PNG。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(resolve(root, 'public/og-image-source.svg'), 'utf-8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
  background: '#ffffff',
});

const png = resvg.render().asPng();
writeFileSync(resolve(root, 'public/og-image.png'), png);
console.log(`og-image.png written (${png.length} bytes)`);
