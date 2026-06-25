/**
 * 模型详情页的程序化文案：定义块（40–60 字一句话）与 per-model FAQ。
 *
 * 两者既渲染为可见 HTML（`ModelDetail.astro`），FAQ 又经 `faqPageSchema()` 注入 FAQPage
 * JSON-LD——同一份生成结果保证可见文本与结构化数据逐字一致（Google 要求）。所有事实
 * 取自已验证数据源：价格走 `priceBreakdown()`，上下文窗口仅在 `metaOf()` 有数据时输出，
 * 绝不编造。措辞与站内 hero / footer / enterprise 表述同口径。
 */
import type { ModelWithSlug } from '../data/model-slug.ts';
import {
  priceBreakdown,
  fmtUsd,
  vendorDisplayName,
  modalityLabel,
} from '../data/pricing.ts';
import { metaOf } from '../data/model-meta.ts';
import type { FaqItem } from './faq-schema.ts';

type Locale = 'zh' | 'en';

/** 上下文窗口标签：64 → '64K'，1000 → '1M'；无 meta 返回 null。 */
function contextLabel(name: string): string | null {
  const k = metaOf(name)?.contextK;
  if (!k) return null;
  return k >= 1000 ? `${k / 1000}M` : `${k}K`;
}

/** 价格从句（定义块用）。 */
function priceClause(model: ModelWithSlug, locale: Locale): string {
  const p = priceBreakdown(model);
  if (p.kind === 'call') {
    return locale === 'en'
      ? `${fmtUsd(p.inputUsd)} per call (snapshot pricing)`
      : `调用价 ${fmtUsd(p.inputUsd)} / 次（快照价）`;
  }
  return locale === 'en'
    ? `input ${fmtUsd(p.inputUsd)} / 1M tokens, output ${fmtUsd(p.outputUsd!)} / 1M tokens (snapshot pricing)`
    : `输入价 ${fmtUsd(p.inputUsd)} / 1M tokens、输出价 ${fmtUsd(p.outputUsd!)} / 1M tokens（快照价）`;
}

/** 40–60 字可见定义块。作为模型页正文首段，恒定输出。 */
export function modelDefinition(model: ModelWithSlug, locale: Locale): string {
  const vendor = vendorDisplayName(model.vendor, locale);
  const modality = modalityLabel(model.modality, locale);
  const ctx = contextLabel(model.model_name);
  const price = priceClause(model, locale);

  if (locale === 'en') {
    const ctxClause = ctx ? ` with a ${ctx} context window` : '';
    // "a production <modality> model" reads correctly for every modality
    // (LLM / Image / Video / Audio), avoiding the a/an article problem.
    return `${model.model_name} by ${vendor} is a production ${modality} model${ctxClause}, callable through the TokenFleet unified API (OpenAI SDK compatible, direct mainland routing): ${price}.`;
  }
  const ctxClause = ctx ? `，上下文窗口 ${ctx}` : '';
  return `${model.model_name} 是 ${vendor} 的 ${modality} 模型${ctxClause}，可通过 TokenFleet 统一 API（OpenAI SDK 兼容、国内直连）调用，${price}。`;
}

/** per-model FAQ：收费 / 上下文窗口（有 meta 才出）/ 如何调用。 */
export function modelFaq(model: ModelWithSlug, locale: Locale): FaqItem[] {
  const p = priceBreakdown(model);
  const ctx = contextLabel(model.model_name);
  const maxOut = metaOf(model.model_name)?.maxOutputK;
  const endpoints = model.supported_endpoint_types.join(' / ');
  const items: FaqItem[] = [];

  // Q1 — 收费
  if (locale === 'en') {
    const priceAns =
      p.kind === 'call'
        ? `${model.model_name} is billed per call at ${fmtUsd(p.inputUsd)} per call`
        : `${model.model_name} is billed per token: input ${fmtUsd(p.inputUsd)} / 1M tokens, output ${fmtUsd(p.outputUsd!)} / 1M tokens`;
    items.push({
      q: `How much does ${model.model_name} cost on TokenFleet?`,
      a: `${priceAns} (build-time snapshot; the console shows live pricing). Usage is settled through a single RMB business account.`,
    });
  } else {
    const priceAns =
      p.kind === 'call'
        ? `${model.model_name} 按调用次数计费：${fmtUsd(p.inputUsd)} / 次`
        : `${model.model_name} 按 token 计费：输入 ${fmtUsd(p.inputUsd)} / 1M tokens，输出 ${fmtUsd(p.outputUsd!)} / 1M tokens`;
    items.push({
      q: `通过 TokenFleet 调用 ${model.model_name} 怎么收费？`,
      a: `${priceAns}（构建期快照价，以控制台实时价格为准）。用量计入单一对公账户、人民币结算。`,
    });
  }

  // Q2 — 上下文窗口（仅当有 meta）
  if (ctx) {
    if (locale === 'en') {
      const maxClause = maxOut
        ? `, with up to ${maxOut}K tokens of output`
        : '';
      items.push({
        q: `What is the context window of ${model.model_name}?`,
        a: `${model.model_name} supports a ${ctx}-token context window${maxClause}.`,
      });
    } else {
      const maxClause = maxOut ? `，最大输出 ${maxOut}K tokens` : '';
      items.push({
        q: `${model.model_name} 的上下文窗口多大？`,
        a: `${model.model_name} 的上下文窗口为 ${ctx} tokens${maxClause}。`,
      });
    }
  }

  // Q3 — 如何调用
  if (locale === 'en') {
    items.push({
      q: `How do I call ${model.model_name} through TokenFleet?`,
      a: `TokenFleet is OpenAI SDK compatible: keep your existing request body, switch base_url to the TokenFleet unified endpoint, and use one API key with model id ${model.model_name}. Supported endpoint types: ${endpoints}.`,
    });
  } else {
    items.push({
      q: `怎么通过 TokenFleet 调用 ${model.model_name}？`,
      a: `TokenFleet 接口与 OpenAI SDK 兼容：保持原有请求体，把 base_url 换成 TokenFleet 统一 endpoint，用同一个 API key 指定 model id ${model.model_name} 即可。支持的 endpoint 类型：${endpoints}。`,
    });
  }

  return items;
}
