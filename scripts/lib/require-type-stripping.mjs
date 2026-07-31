/**
 * require-type-stripping.mjs — guard for scripts that read `src/**` TypeScript
 * sources directly.
 *
 * `sync-pricing.mjs` and `check-catalog.mjs` deliberately import the curated
 * data modules (`featured.ts`, `catalog-overrides.ts`, `model-limits.ts`,
 * `model-meta.ts`, `i18n.ts`) instead of re-parsing them, so there is exactly
 * one source of truth per table. That relies on Node's built-in type stripping,
 * which is on by default from Node 22.18 and needs `--experimental-strip-types`
 * on 22.12–22.17. Without it the scripts die on `ERR_UNKNOWN_FILE_EXTENSION`,
 * which says nothing about what to do next.
 *
 * IMPORTANT — call this BEFORE the first dynamic `.ts` import, and never let
 * the calling script `import` a `.ts` module statically. ESM parses and links
 * the whole graph before evaluating any module body, so a static `.ts` import
 * throws during linking and this guard never gets to run. Verified 2026-07-31:
 * with `node --no-experimental-strip-types`, a static `.ts` import skips the
 * guard entirely, while a dynamic one lets it print first.
 */

/** Node release where type stripping became the default. */
const MIN_NODE = '22.18.0';

/**
 * Exit with an actionable message when this Node can't load `.ts` sources.
 * Silent (and cheap) when support is available.
 *
 * @param {string} scriptName label used in the error, e.g. 'check-catalog'
 */
export function requireTypeStripping(scriptName) {
  // 'strip' | 'transform' from Node 22.10; false when explicitly disabled;
  // undefined on older releases that predate the feature flag entirely.
  if (process.features.typescript) return;
  // Belt and braces: 22.12–22.17 run it behind a flag, which may arrive either
  // on the command line or through NODE_OPTIONS (both land in execArgv).
  if (
    process.execArgv.some((a) => a.startsWith('--experimental-strip-types'))
  ) {
    return;
  }

  process.stderr.write(
    `${scriptName}: this script loads TypeScript sources from src/ directly, ` +
      `which needs Node's built-in type stripping.\n` +
      `  running:  Node ${process.versions.node}\n` +
      `  required: Node >= ${MIN_NODE} (type stripping on by default)\n` +
      `  or run:   node --experimental-strip-types scripts/${scriptName}.mjs\n` +
      `See "engines" in package.json.\n`
  );
  process.exit(1);
}
