/**
 * /pricing.md — 机器可读定价表（构建期生成，非 public 静态文件）。
 *
 * 给 AI 代理 / 比价引擎一份无需渲染 JS、无登录墙的纯 Markdown 价格快照。按厂商分组，
 * 每个模型一行：输入价 / 输出价（/1M tokens 或 /次）、计费方式、上下文窗口、详情页链接。
 * 全部数据走 `priceBreakdown()` / `modelsWithSlug()` / `metaOf()` 单一真值源，与模型详情页
 * 表格同源，模型增删 / 调价自动同步。语言为英文（AI 系统惯例），model id / 价格语言中立。
 *
 * `trailingSlash: never`；URL = /pricing.md。从页脚链接可达。
 */
import type { APIRoute } from 'astro';
import { modelsWithSlug } from '../data/model-slug.ts';
import { usedVendors, priceBreakdown, fmtUsd } from '../data/pricing.ts';
import { metaOf } from '../data/model-meta.ts';

function contextLabel(name: string): string {
  const k = metaOf(name)?.contextK;
  if (!k) return '—';
  return k >= 1000 ? `${k / 1000}M` : `${k}K`;
}

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('astro.config.mjs 缺少 `site`，无法生成绝对链接');
  }
  const abs = (path: string) => new URL(path, site).toString();
  const models = modelsWithSlug();
  const vendors = usedVendors();
  const updated = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    '# TokenFleet Pricing',
    '',
    '> Machine-readable price snapshot for AI agents and comparison engines.',
    '> All models share one OpenAI-compatible endpoint and one RMB business account.',
    '> Prices are in USD. Token prices are per 1M tokens unless billed per call.',
    '',
    `Last updated: ${updated}`,
    `Total models: ${models.length} across ${vendors.length} vendors`,
    `Full catalog: ${abs('/models')}`,
    '',
  ];

  for (const vendor of vendors) {
    const group = models.filter((m) => m.vendor_id === vendor.id);
    if (group.length === 0) continue;

    lines.push(`## ${vendor.name}`, '');
    lines.push(
      '| Model | Input /1M | Output /1M | Billing | Context | Detail |'
    );
    lines.push(
      '|-------|-----------|------------|---------|---------|--------|'
    );

    const notes: string[] = [];
    for (const m of group) {
      const p = priceBreakdown(m);
      const detail = abs(`/models/${m.slug}`);
      const ctx = contextLabel(m.model_name);

      if (p.kind === 'call') {
        lines.push(
          `| \`${m.model_name}\` | ${fmtUsd(p.inputUsd)} / call | — | per call | ${ctx} | ${detail} |`
        );
      } else if (p.tiers && p.tiers.length > 0) {
        const first = p.tiers[0];
        lines.push(
          `| \`${m.model_name}\` | ${fmtUsd(first.inputUsd)} | ${fmtUsd(first.outputUsd)} | token (graduated) | ${ctx} | ${detail} |`
        );
        notes.push(
          `- \`${m.model_name}\`: graduated pricing, first tier shown — see ${detail}`
        );
      } else {
        lines.push(
          `| \`${m.model_name}\` | ${fmtUsd(p.inputUsd)} | ${fmtUsd(p.outputUsd!)} | token | ${ctx} | ${detail} |`
        );
      }
    }
    lines.push('');
    if (notes.length > 0) lines.push(...notes, '');
  }

  const body = lines.join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
