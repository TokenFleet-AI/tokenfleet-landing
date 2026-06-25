/**
 * 模型详情页结构化数据 — SoftwareApplication + Offer。
 *
 * 给搜索引擎与 AI 引擎一个可引用的「模型 = 可调用 AI 服务」实体：名称、
 * 厂商、用途描述、调用价格。价格取自构建期 `pricing-api.json` 快照
 * （输入价 / 1M tokens，或按次调用价），`offers.description` 注明计价口径。
 * 经 `Base.astro` 的 `jsonLd` prop 注入；站点级 Organization/WebSite 由 Base 另行输出。
 */
import type { Model } from '../data/pricing.ts';
import {
  priceBreakdown,
  vendorDisplayName,
  modalityLabel,
  fmtUsd,
} from '../data/pricing.ts';

/** 构造单个模型的 SoftwareApplication JSON-LD。`url` 为该页 canonical。 */
export function modelSchema(model: Model, locale: 'zh' | 'en', url: string) {
  const p = priceBreakdown(model);
  const vendor = vendorDisplayName(model.vendor, locale);
  const modality = modalityLabel(model.modality, locale);

  const priceUnit =
    p.kind === 'call'
      ? locale === 'en'
        ? `${fmtUsd(p.inputUsd)} per call (snapshot)`
        : `${fmtUsd(p.inputUsd)} / 次（快照价）`
      : locale === 'en'
        ? `${fmtUsd(p.inputUsd)} per 1M input tokens (snapshot)`
        : `${fmtUsd(p.inputUsd)} / 1M 输入 tokens（快照价）`;

  const description =
    model.description && !/[㐀-鿿]/.test(model.description)
      ? model.description
      : locale === 'en'
        ? `${model.model_name} by ${vendor} — a ${modality} model callable through the TokenFleet unified API (OpenAI SDK compatible).`
        : `${vendor} 的 ${model.model_name}，可通过 TokenFleet 统一 API（OpenAI SDK 兼容）调用的 ${modality} 模型。`;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: model.model_name,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url,
    description,
    brand: { '@type': 'Brand', name: vendor },
    author: { '@type': 'Organization', name: vendor },
    offers: {
      '@type': 'Offer',
      price: Number(p.inputUsd.toFixed(4)),
      priceCurrency: 'USD',
      description: priceUnit,
      availability: 'https://schema.org/InStock',
    },
  };
}
