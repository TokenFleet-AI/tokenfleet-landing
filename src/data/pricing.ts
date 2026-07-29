/**
 * pricing.ts — model catalog + price formatting utilities.
 *
 * Source of truth is the upstream `pricing-api.json` snapshot at repo root,
 * generated from https://tokenfleet.cn/api/pricing. Re-run that fetch and
 * commit the JSON to refresh the catalog. We import at build time so the
 * /models page ships fully static (no runtime fetch, no CORS, SEO friendly).
 *
 * Price formula (newAPI / oneAPI convention):
 *   - 1 ratio unit corresponds to USD 2 per 1M tokens.
 *   - Token-billed (quota_type === 0):
 *       input  = model_ratio × $2 / 1M tokens
 *       output = model_ratio × completion_ratio × $2 / 1M tokens
 *       cached = model_ratio × cache_ratio × $2 / 1M tokens
 *   - Call-billed (quota_type === 1, mostly image/video):
 *       per call = model_price × $2
 *   - Graduated pricing (has_graduated_pricing === true) multiplies the base
 *     ratios by tier.{input,output}_ratio_multiplier inside each segment.
 */

import raw from '../../pricing-api.json';
import { type Locale } from '../i18n.ts';

/** USD per 1M tokens when ratio = 1. */
export const BASE_USD_PER_MTOK = 2;

export type EndpointType = 'openai' | 'anthropic' | 'gemini' | 'open';

export interface PricingTier {
  tier_order: number;
  threshold_tokens: number;
  input_ratio_multiplier: number;
  output_ratio_multiplier: number;
  description: string;
}

export interface RawModel {
  model_name: string;
  description?: string;
  icon?: string;
  vendor_id: number;
  quota_type: 0 | 1;
  model_ratio: number;
  model_price: number;
  completion_ratio: number;
  cache_ratio?: number;
  create_cache_ratio?: number;
  enable_groups: string[];
  supported_endpoint_types: EndpointType[];
  has_graduated_pricing: boolean;
  pricing_tiers?: PricingTier[];
  tags?: string;
  owner_by?: string;
}

export interface Vendor {
  id: number;
  name: string;
  icon?: string;
}

export type Modality = 'chat' | 'image' | 'video' | 'audio';

export interface Model extends RawModel {
  vendor: Vendor;
  modality: Modality;
  /** friendly display name shown to users; `model_name` stays the API ID. */
  displayName: string;
  /** catalog list filter axis: language / multimodal / video. */
  modelType: ModelType;
  /** kebab-case slug for the brand icon, e.g. 'openai-color'. */
  iconSlug: string;
  /** absolute icon URL (LobeHub CDN). */
  iconUrl: string;
  /** mono variant (no -color suffix) for watermark/fallback. */
  iconMonoUrl: string;
  /** numeric sort key: cheapest input price ($/1M or per-call). */
  inputPriceUsd: number;
  /** numeric sort key: output price. For per-call models, mirrors input. */
  outputPriceUsd: number;
}

// ──────────────────────────────────────────────────────────────────────────
// Vendor map
// ──────────────────────────────────────────────────────────────────────────

const vendors: Vendor[] = raw.vendors as Vendor[];
const vendorById = new Map(vendors.map((v) => [v.id, v]));

const FALLBACK_VENDOR: Vendor = { id: 0, name: 'Unknown' };

export function vendorOf(id: number): Vendor {
  return vendorById.get(id) ?? FALLBACK_VENDOR;
}

/**
 * vendor slug used for filter chips & URL query — lowercased ASCII name.
 * 智谱 → 'zhipu', 快手 → 'kuaishou' (special-cased so query stays readable).
 */
const vendorSlugOverrides: Record<number, string> = {
  8: 'zhipu',
  9: 'kuaishou',
};
export function vendorSlug(v: Vendor): string {
  if (vendorSlugOverrides[v.id]) return vendorSlugOverrides[v.id];
  return v.name.toLowerCase().replace(/\s+/g, '-');
}

export function vendorDisplayName(
  v: Vendor,
  locale: 'zh' | 'en' = 'zh'
): string {
  if (locale === 'en') {
    if (v.id === 8) return 'Zhipu';
    if (v.id === 9) return 'Kuaishou';
  }
  return v.name;
}

// ──────────────────────────────────────────────────────────────────────────
// Display names
// ──────────────────────────────────────────────────────────────────────────

/**
 * Friendly display names shown in the UI. `model_name` is the API model ID
 * (used in code samples, request bodies, and the catalog ID column) and must
 * never be reformatted; this map only supplies a human-readable label. Keys
 * are exact `model_name` values. Missing entries fall back to `model_name`.
 */
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  // ByteDance / Doubao
  'doubao-seedance-2-0-260128': '豆包2.0',
  'doubao-seedance-2-0-fast-260128': '豆包2.0 fast',
  'doubao-seedance-2-0-mini-260615': '豆包2.0 mini',

  // MiniMax
  'MiniMax-M2.5': 'Minimax M2.5',
  'MiniMax-M2.7': 'Minimax M2.7',

  // Zhipu
  'glm-5.1': 'GLM 5.1',
  'glm-5.2': 'GLM 5.2',
  'glm-5v-turbo': 'GLM 5V Turbo',

  // Moonshot
  'kimi-k2.5': 'Kimi K2.5',
  'kimi-k2.6': 'Kimi K2.6',
  'kimi-k2.7-code': 'Kimi K2.7 Code',

  // DeepSeek
  'deepseek-v3.1': 'DeepSeek V3.1',
  'deepseek-v3.2': 'DeepSeek V3.2',
  'deepseek-v4-flash': 'DeepSeek V4 Flash',
  'deepseek-v4-pro': 'DeepSeek V4 Pro',
};

export function displayNameOf(name: string): string {
  return DISPLAY_NAME_OVERRIDES[name] ?? name;
}

// ──────────────────────────────────────────────────────────────────────────
// Modality detection
// ──────────────────────────────────────────────────────────────────────────

/**
 * Heuristic mapping. The API doesn't expose a modality field, so we lean on
 * name patterns + quota_type. Image/video models are call-billed and named
 * after their modality; everything else is chat/LLM.
 */
const VIDEO_HINTS = [
  'sora',
  'kling',
  'runway',
  'veo',
  'wan-',
  'minimax-i2v',
  'luma',
  'vidu',
  'seedance',
];
const IMAGE_HINTS = [
  'nano-banana',
  'flux',
  'midjourney',
  'recraft',
  'ideogram',
  'sd-',
  'seedream',
  'wanxiang',
  'cogview',
  'dall-e',
];
const AUDIO_HINTS = ['whisper', 'cosyvoice', 'eleven', 'tts-', '-asr'];

export function modalityOf(m: RawModel): Modality {
  const n = m.model_name.toLowerCase();
  if (VIDEO_HINTS.some((h) => n.includes(h))) return 'video';
  if (IMAGE_HINTS.some((h) => n.includes(h))) return 'image';
  if (AUDIO_HINTS.some((h) => n.includes(h))) return 'audio';
  return 'chat';
}

export function modalityLabel(
  mod: Modality,
  locale: 'zh' | 'en' = 'zh'
): string {
  switch (mod) {
    case 'chat':
      return 'LLM';
    case 'image':
      return locale === 'en' ? 'Image' : '图像';
    case 'video':
      return locale === 'en' ? 'Video' : '视频';
    case 'audio':
      return locale === 'en' ? 'Audio' : '音频';
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Model type axis (catalog list filter): language / multimodal / video
// ──────────────────────────────────────────────────────────────────────────

/**
 * Coarse model-type axis for the /models catalog list filter. Distinct from
 * `modalityOf` (kept for llms.txt): this is a single mutually-exclusive axis
 * with no empty buckets across the 15-model snapshot, and uses explicit
 * overrides so `glm-5v-turbo` (text+image input) is not misfiled as language.
 *
 * Default `language` covers the 11 text LLMs; `multimodal` covers vision-input
 * models; `video` covers the 3 Doubao Seedance generation models.
 */
export type ModelType = 'language' | 'multimodal' | 'video';

const TYPE_OVERRIDES: Record<string, ModelType> = {
  'glm-5v-turbo': 'multimodal',
  'doubao-seedance-2-0-260128': 'video',
  'doubao-seedance-2-0-fast-260128': 'video',
  'doubao-seedance-2-0-mini-260615': 'video',
};

export function modelTypeOf(m: RawModel): ModelType {
  return TYPE_OVERRIDES[m.model_name] ?? 'language';
}

/** URL/data slug for a model type — identical to the literal value. */
export function modelTypeSlug(t: ModelType): string {
  return t;
}

/** Data-layer label (parity with `modalityLabel`). UI prefers `t.models.types`. */
export function modelTypeLabel(t: ModelType, locale: Locale = 'zh'): string {
  switch (t) {
    case 'language':
      return locale === 'en' ? 'Language' : '语言';
    case 'multimodal':
      return locale === 'en' ? 'Multimodal' : '多模态';
    case 'video':
      return locale === 'en' ? 'Video' : '视频';
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Icon URL helpers (local LobeHub Icons snapshots in public/ai-brand-logo)
// ──────────────────────────────────────────────────────────────────────────

const ICON_PATH = '/ai-brand-logo';

/**
 * Some LobeHub brand icons ship mono-only — there is no `-color` variant on
 * the CDN. If the upstream `icon` field points at a `.Color` slug for one of
 * these, requesting it returns 404. We force-strip the suffix so the chip
 * shows the mono mark instead of falling through to a broken-image fallback.
 *
 * Update this set when LobeHub adds new color variants.
 */
const NO_COLOR_VARIANT = new Set(['openai', 'moonshot', 'anthropic']);

export function iconSlugFromField(field: string | undefined): string {
  if (!field) return 'openai';
  // 'OpenAI.Color' → 'openai-color', 'Gemini' → 'gemini'
  let slug = field.toLowerCase().replace(/\./g, '-');
  const base = slug.replace(/-color$/, '');
  if (NO_COLOR_VARIANT.has(base)) slug = base;
  return slug;
}

export function iconUrlOf(slug: string): string {
  return `${ICON_PATH}/${slug}.svg`;
}

export function iconMonoUrlOf(slug: string): string {
  // strip -color / -brand-color suffix for mono variant
  const mono = slug.replace(/-color$/, '').replace(/-brand-color$/, '-brand');
  return `${ICON_PATH}/${mono}.svg`;
}

// ──────────────────────────────────────────────────────────────────────────
// Price helpers
// ──────────────────────────────────────────────────────────────────────────

export interface PriceBreakdown {
  /** 'token' = $/1M tokens table; 'call' = per-call price. */
  kind: 'token' | 'call';
  /** base input USD per 1M tokens (kind=token) or per call (kind=call). */
  inputUsd: number;
  /** base output USD per 1M tokens (kind=token only). */
  outputUsd?: number;
  /** cache hit input USD per 1M tokens (kind=token only). */
  cachedInputUsd?: number;
  /** cache create surcharge (rare). */
  createCacheUsd?: number;
  /** unfolded tier rows when has_graduated_pricing. */
  tiers?: Array<{
    label: string;
    inputUsd: number;
    outputUsd: number;
  }>;
}

export function priceBreakdown(m: RawModel): PriceBreakdown {
  if (m.quota_type === 1) {
    return { kind: 'call', inputUsd: m.model_price * BASE_USD_PER_MTOK };
  }
  const baseInput = m.model_ratio * BASE_USD_PER_MTOK;
  const baseOutput = m.model_ratio * m.completion_ratio * BASE_USD_PER_MTOK;
  const cached =
    m.cache_ratio !== undefined
      ? m.model_ratio * m.cache_ratio * BASE_USD_PER_MTOK
      : undefined;
  const createCache =
    m.create_cache_ratio !== undefined
      ? m.model_ratio * m.create_cache_ratio * BASE_USD_PER_MTOK
      : undefined;
  const tiers =
    m.has_graduated_pricing && m.pricing_tiers
      ? m.pricing_tiers
          .slice()
          .sort((a, b) => a.tier_order - b.tier_order)
          .map((t) => ({
            label: t.description,
            inputUsd: baseInput * t.input_ratio_multiplier,
            outputUsd: baseOutput * t.output_ratio_multiplier,
          }))
      : undefined;
  return {
    kind: 'token',
    inputUsd: baseInput,
    outputUsd: baseOutput,
    cachedInputUsd: cached,
    createCacheUsd: createCache,
    tiers,
  };
}

/** Compact mono label for cards: e.g. '$5 / $25 per 1M' or '$0.5 / image'. */
export function priceLabel(m: RawModel, locale: 'zh' | 'en' = 'zh'): string {
  const p = priceBreakdown(m);
  if (p.kind === 'call') {
    return `${fmtUsd(p.inputUsd)} / ${locale === 'en' ? 'call' : '次'}`;
  }
  return `${fmtUsd(p.inputUsd)} / ${fmtUsd(p.outputUsd!)} per 1M`;
}

/** Sort key: lower-is-cheaper price used for sort comparators. */
export function inputPriceOf(m: RawModel): number {
  return priceBreakdown(m).inputUsd;
}
export function outputPriceOf(m: RawModel): number {
  const p = priceBreakdown(m);
  return p.outputUsd ?? p.inputUsd;
}

export function fmtUsd(n: number): string {
  if (n === 0) return '$0';
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;
  if (n < 10) return `$${n.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}`;
  return `$${Math.round(n * 100) / 100}`;
}

// ──────────────────────────────────────────────────────────────────────────
// Catalog loader
// ──────────────────────────────────────────────────────────────────────────

const models: Model[] = (raw.data as RawModel[]).map((m) => {
  const vendor = vendorOf(m.vendor_id);
  // model.icon (e.g. "OpenAI.Color") wins, otherwise fall back to vendor.icon.
  // iconSlugFromField handles brands that ship mono-only (forces strip of
  // a non-existent -color suffix).
  const iconField = m.icon || vendor.icon;
  const slug = iconSlugFromField(iconField);
  return {
    ...m,
    vendor,
    displayName: displayNameOf(m.model_name),
    modality: modalityOf(m),
    modelType: modelTypeOf(m),
    iconSlug: slug,
    iconUrl: iconUrlOf(slug),
    iconMonoUrl: iconMonoUrlOf(slug),
    inputPriceUsd: inputPriceOf(m),
    outputPriceUsd: outputPriceOf(m),
  };
});

export function loadModels(): Model[] {
  return models;
}

export function totalModelCount(): number {
  return models.length;
}

/** Distinct vendors actually used by at least one model. */
export function usedVendors(): Vendor[] {
  const ids = new Set(models.map((m) => m.vendor_id));
  return vendors.filter((v) => ids.has(v.id));
}

/** Endpoint definitions (for dialog metadata strip). */
export const endpointDefs = raw.supported_endpoint as Partial<
  Record<EndpointType, { path: string; method: string }>
>;
