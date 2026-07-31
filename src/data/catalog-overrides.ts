/**
 * catalog-overrides.ts — hand-curated overrides applied on top of the raw
 * `pricing-api.json` snapshot.
 *
 * Split out of `pricing.ts` on purpose: this module has **no imports**, so
 * `scripts/check-catalog.mjs` can load it directly under Node's TypeScript
 * type stripping to validate the tables against the snapshot. `pricing.ts`
 * imports the JSON snapshot and therefore cannot be loaded that way.
 *
 * Keep this file import-free. Anything needing `pricing-api.json`, i18n, or
 * `withBase()` belongs in `pricing.ts`.
 *
 * All keys are exact `model_name` values from `pricing-api.json`.
 */

// ──────────────────────────────────────────────────────────────────────────
// Display names
// ──────────────────────────────────────────────────────────────────────────

/**
 * Friendly display names shown in the UI. `model_name` is the API model ID
 * (used in code samples, request bodies, and the catalog ID column) and must
 * never be reformatted; this map only supplies a human-readable label. Keys
 * are exact `model_name` values. Missing entries fall back to `model_name`.
 */
export const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
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

// ──────────────────────────────────────────────────────────────────────────
// Model type axis (catalog list filter): language / multimodal / video
// ──────────────────────────────────────────────────────────────────────────

/**
 * Coarse model-type axis for the /models catalog list filter. Distinct from
 * `modalityOf` (kept for llms.txt): this is a single mutually-exclusive axis
 * with no empty buckets across the current snapshot, and uses explicit
 * overrides so `glm-5v-turbo` (text+image input) is not misfiled as language.
 *
 * Default `language` covers the text LLMs; `multimodal` covers vision-input
 * models; `video` covers the Doubao Seedance generation models.
 */
export type ModelType = 'language' | 'multimodal' | 'video';

export const TYPE_OVERRIDES: Record<string, ModelType> = {
  'glm-5v-turbo': 'multimodal',
  'doubao-seedance-2-0-260128': 'video',
  'doubao-seedance-2-0-fast-260128': 'video',
  'doubao-seedance-2-0-mini-260615': 'video',
};

// ──────────────────────────────────────────────────────────────────────────
// Icon slug derivation (local LobeHub Icons snapshots in public/ai-brand-logo)
// ──────────────────────────────────────────────────────────────────────────

/**
 * Some LobeHub brand icons ship mono-only — there is no `-color` variant on
 * the CDN. If the upstream `icon` field points at a `.Color` slug for one of
 * these, requesting it returns 404. We force-strip the suffix so the chip
 * shows the mono mark instead of falling through to a broken-image fallback.
 *
 * Update this set when LobeHub adds new color variants.
 */
export const NO_COLOR_VARIANT = new Set(['openai', 'moonshot', 'anthropic']);

export function iconSlugFromField(field: string | undefined): string {
  if (!field) return 'openai';
  // 'OpenAI.Color' → 'openai-color', 'Gemini' → 'gemini'
  let slug = field.toLowerCase().replace(/\./g, '-');
  const base = slug.replace(/-color$/, '');
  if (NO_COLOR_VARIANT.has(base)) slug = base;
  return slug;
}
