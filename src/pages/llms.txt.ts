/**
 * /llms.txt — AI 系统上下文文件（llmstxt.org 格式，构建期生成）。
 *
 * 给 ChatGPT / Claude / Perplexity 等一份站点速览：产品一句话定义 + 摘要 + 关键页面链接
 * + 全量模型清单。语言为英文（AI 系统惯例）；站点双语，链接同时给出 zh canonical 与
 * /en 版本。模型清单走 `loadModels()`，增删自动同步。
 *
 * 输出必须全篇 ASCII：线上该文件的响应头是 `text/html` 且不带 `charset`，浏览器会用
 * 本地默认编码解 UTF-8 字节，中文名与 em dash 都会显示成乱码。厂商名一律走
 * `vendorDisplayName(v, 'en')`。
 *
 * `trailingSlash: never`；URL = /llms.txt。
 */
import type { APIRoute } from 'astro';
import {
  loadModels,
  usedVendors,
  vendorDisplayName,
  modalityLabel,
} from '../data/pricing.ts';
import { DASHBOARD_URL, DOCS_URL, SIGN_IN_URL } from '../site-links.ts';
import { absUrl } from '../base.ts';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('astro.config.mjs 缺少 `site`，无法生成绝对链接');
  }
  const abs = (path: string) => absUrl(path, site);
  const models = loadModels();
  const vendors = usedVendors();
  const vendorList = vendors.map((v) => vendorDisplayName(v, 'en')).join(', ');

  const lines: string[] = [
    '# TokenFleet',
    '',
    '> TokenFleet is a one-stop AI model API gateway. It aggregates production',
    `> LLM, image, video and audio models from ${vendors.length} vendors`,
    `> (${vendorList}) behind a single OpenAI-compatible endpoint: one API key,`,
    '> one RMB business invoice, with direct mainland-China routing and',
    '> millisecond latency. Built for engineering teams who need multi-vendor',
    '> model access without juggling separate accounts, SDKs and cross-border',
    '> billing, and for procurement teams who need a single contracting entity,',
    '> RMB settlement and VAT invoices.',
    '',
    '## Key pages',
    `- [Models catalog](${abs('/models')}): all ${models.length} production models across ${vendors.length} vendors (English: ${abs('/en/models')})`,
    `- [Pricing (machine-readable)](${abs('/pricing.md')}): per-model input/output prices in Markdown`,
    `- [Docs](${DOCS_URL}): integration guide, OpenAI SDK compatible (switch base_url)`,
    `- [Console](${DASHBOARD_URL}) / [Sign in](${SIGN_IN_URL})`,
    `- [Blog](https://blog.tokenfleet.cn)`,
    `- [Home](${abs('/')}) (English: ${abs('/en')})`,
    '',
    '## Integration',
    '- OpenAI SDK compatible: keep your request body, switch `base_url`.',
    '- Supported endpoint types: openai, anthropic, gemini.',
    '- Billing: per-token or per-call; single RMB business account, unified invoice.',
    '',
    '## Models',
  ];

  for (const m of models) {
    const vendor = vendorDisplayName(m.vendor, 'en');
    const modality = modalityLabel(m.modality, 'en');
    lines.push(`- ${m.model_name} (${vendor}, ${modality}): ${abs('/models')}`);
  }

  lines.push('');

  const body = lines.join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
