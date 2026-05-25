/**
 * model-meta.ts — manually curated context window / max output / docs link.
 *
 * pricing-api.json doesn't expose context window. Sourced from vendor docs.
 * Keys are exact model_name from pricing-api.json. Missing entries simply
 * hide the spec row in the dialog — never fabricate values.
 */

export interface ModelMeta {
  contextK?: number;
  maxOutputK?: number;
  docs?: string;
}

export const modelMeta: Record<string, ModelMeta> = {
  // DeepSeek
  'deepseek-v3': {
    contextK: 64,
    maxOutputK: 8,
    docs: 'https://api-docs.deepseek.com/',
  },
  'deepseek-v3.1': {
    contextK: 128,
    maxOutputK: 8,
    docs: 'https://api-docs.deepseek.com/',
  },
  'deepseek-v3.2-exp': {
    contextK: 128,
    maxOutputK: 64,
    docs: 'https://api-docs.deepseek.com/',
  },
  'DeepSeek-V3.2': {
    contextK: 128,
    maxOutputK: 64,
    docs: 'https://api-docs.deepseek.com/',
  },
  'DeepSeek-V3.2-A': {
    contextK: 128,
    maxOutputK: 64,
    docs: 'https://api-docs.deepseek.com/',
  },
  'deepseek-v4-flash': {
    contextK: 128,
    maxOutputK: 64,
    docs: 'https://api-docs.deepseek.com/',
  },
  'deepseek-v4-pro': {
    contextK: 128,
    maxOutputK: 64,
    docs: 'https://api-docs.deepseek.com/',
  },

  // Moonshot
  'kimi-k2.5': { contextK: 256, docs: 'https://platform.moonshot.cn/docs' },
  'kimi-k2.6': { contextK: 256, docs: 'https://platform.moonshot.cn/docs' },

  // MiniMax
  'MiniMax-M2.5': {
    contextK: 200,
    docs: 'https://platform.minimaxi.com/document/',
  },
  'MiniMax-M2.7': {
    contextK: 200,
    docs: 'https://platform.minimaxi.com/document/',
  },

  // Zhipu
  'glm-5.1': { contextK: 128, docs: 'https://open.bigmodel.cn/dev/api' },
};

export function metaOf(name: string): ModelMeta | undefined {
  return modelMeta[name];
}
