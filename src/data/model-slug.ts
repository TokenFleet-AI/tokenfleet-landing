/**
 * model-slug.ts — 稳定的 URL slug 派生，供模型详情页路由与列表内链共用。
 *
 * slug 从 `model_name` 派生：小写 → 非 `[a-z0-9]` 折叠为 `-` → 去首尾 `-`。
 * 例：`deepseek-v3.2` → `deepseek-v3-2`。
 *
 * 唯一性：若两个不同 model_name 归一后撞 slug，对冲突组统一加 vendor 前缀
 * 消歧；仍冲突则构建期抛错（强制显式处理，避免静默覆盖路由）。
 */
import { loadModels, vendorSlug, type Model } from './pricing.ts';

export interface ModelWithSlug extends Model {
  /** URL-safe 唯一 slug，用于 `/models/<slug>`。 */
  slug: string;
}

/** model_name → 基础 slug（未消歧）。 */
export function modelSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildModelsWithSlug(): ModelWithSlug[] {
  const base = loadModels();

  // 先算基础 slug，统计每个 slug 落了几个模型，撞的整组加 vendor 前缀。
  const baseSlugs = base.map((m) => modelSlug(m.model_name));
  const counts = new Map<string, number>();
  baseSlugs.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1));

  const seen = new Map<string, string>(); // slug → model_name（用于冲突报错）
  const result = base.map((m, i): ModelWithSlug => {
    const bs = baseSlugs[i];
    const slug = counts.get(bs)! > 1 ? `${vendorSlug(m.vendor)}-${bs}` : bs;
    const prior = seen.get(slug);
    if (prior !== undefined) {
      throw new Error(
        `模型 slug 冲突："${m.model_name}" 与 "${prior}" 均归一为 "${slug}"，请在 model-slug.ts 增加消歧规则`
      );
    }
    seen.set(slug, m.model_name);
    return { ...m, slug };
  });

  return result;
}

const modelsWithSlugCache: ModelWithSlug[] = buildModelsWithSlug();
const bySlug = new Map(modelsWithSlugCache.map((m) => [m.slug, m]));

/** 全部模型，带唯一 slug。 */
export function modelsWithSlug(): ModelWithSlug[] {
  return modelsWithSlugCache;
}

/** 按 slug 反查模型。 */
export function modelBySlug(slug: string): ModelWithSlug | undefined {
  return bySlug.get(slug);
}

/** 单个模型的详情页相对路径（locale 感知）。 */
export function modelDetailPath(slug: string, locale: 'zh' | 'en'): string {
  return locale === 'en' ? `/en/models/${slug}` : `/models/${slug}`;
}

export type { Model };
