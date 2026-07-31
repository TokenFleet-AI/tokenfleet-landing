/**
 * featured.ts — hand-curated model ID selections used by marketing surfaces.
 *
 * These are **editorial picks**, not derived data: adding a model to
 * `pricing-api.json` deliberately does not change any list below. Only the
 * counts move automatically (`totalModelCount()`, `usedVendors()`, and the
 * "+N more" link in WhyUs card A), so a catalog refresh never silently
 * rewrites the homepage copy.
 *
 * Removing a model from the snapshot, however, does break these lists —
 * `featuredModelIds` / `marqueeIds` are filtered against the catalog and would
 * silently drop a card, and `SAMPLE_MODEL_ID` would advertise a model that
 * 400s. `npm run check:catalog` fails hard on orphan IDs here.
 *
 * Split out of the `.astro` components (which Node cannot import) so the
 * checker reads the same source of truth. Keep this file import-free.
 *
 * All values are exact `model_name` values from `pricing-api.json`.
 */

/** Homepage Featured Models gallery — 7 cards, order is the display order. */
export const featuredModelIds: string[] = [
  'deepseek-v4-pro',
  'deepseek-v3.2',
  'kimi-k2.6',
  'kimi-k2.7-code',
  'MiniMax-M2.7',
  'glm-5.2',
  'doubao-seedance-2-0-fast-260128',
];

/** WhyUs card A — mono model-name grid; the rest fold into the "+N more" link. */
export const marqueeIds: string[] = [
  'MiniMax-M2.7',
  'glm-5.1',
  'glm-5v-turbo',
  'kimi-k2.6',
  'deepseek-v3.1',
  'doubao-seedance-2-0-mini-260615',
  'deepseek-v4-pro',
  'glm-5.2',
  'deepseek-v3.2',
  'deepseek-v4-flash',
  'doubao-seedance-2-0-260128',
  'doubao-seedance-2-0-fast-260128',
  'kimi-k2.5',
  'kimi-k2.7-code',
  'MiniMax-M2.5',
];

/** Model ID shown in the hero code samples (curl / Python / Node). */
export const SAMPLE_MODEL_ID = 'deepseek-v4-pro';

/**
 * WhyUs card C endpoint demo — the `model:` value rotates through these IDs to
 * show one endpoint serving every vendor, so the pick is editorial: it spans
 * vendors rather than mirroring the catalog. Order is the rotation order; the
 * first entry renders active.
 *
 * Only IDs live here. The `data-vendor` caption ("via doubao") is derived from
 * the catalog brand icon slug in `WhyUs.astro`, so it can never drift from the
 * model it labels.
 *
 * Failure mode is `SAMPLE_MODEL_ID`'s: an ID that left the catalog would keep
 * demoing a call that 400s — hence a hard `check:catalog` error, not a warning.
 */
export const endpointDemoIds: string[] = [
  'deepseek-v4-pro',
  'kimi-k2.6',
  'doubao-seedance-2-0-fast-260128',
  'MiniMax-M2.7',
  'glm-5.2',
  'deepseek-v3.2',
];
