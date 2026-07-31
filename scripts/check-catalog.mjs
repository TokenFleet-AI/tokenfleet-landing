#!/usr/bin/env node
/**
 * check-catalog.mjs — cross-check the hand-maintained catalog data against the
 * `pricing-api.json` snapshot.
 *
 * The snapshot is refreshed automatically (`npm run sync:models`), but roughly
 * half of what the catalog renders is hand-maintained: display names, type
 * buckets, TPM/RPM, context windows, homepage blurbs, and four editorial model
 * ID selections. Those two halves drift in exactly one direction each:
 *
 *   - A model **leaving** the snapshot orphans hand-written keys, and every one
 *     of those failures is *silent*: the homepage gallery and the WhyUs grid
 *     `.filter(Boolean)` the dropped ID away (one fewer card, no error), while
 *     the hero code sample and the endpoint demo keep telling visitors to call a
 *     model that now 400s. Those are hard errors here.
 *
 *   - A model **entering** the snapshot leaves hand-written fields blank. That
 *     is intentional: "—" is a truthful placeholder and the truth principle
 *     forbids inventing TPM/RPM or context numbers. Those are warnings.
 *
 * Counts are never checked, because counts are never hand-written: every model
 * total, vendor total, and the "+N more" link derive from the snapshot at build
 * time. See `src/data/featured.ts` for the editorial-vs-derived split.
 *
 * Usage:
 *   node scripts/check-catalog.mjs [--markdown]
 *
 *   --markdown   render the report as markdown (for a PR body) instead of the
 *                plain-text console format
 *
 * Exit codes: 1 when any hard error is found, 0 otherwise (warnings never fail
 * the build). Warnings are also appended to `$GITHUB_STEP_SUMMARY` when set.
 */

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { requireTypeStripping } from './lib/require-type-stripping.mjs';

requireTypeStripping('check-catalog');

// The curated data below is loaded dynamically, after the guard: a static `.ts`
// import is resolved while the module graph is linked, i.e. before any module
// body runs, so the guard would never get to explain what went wrong on a Node
// without type stripping. See require-type-stripping.mjs.
const { endpointDemoIds, featuredModelIds, marqueeIds, SAMPLE_MODEL_ID } =
  await import('../src/data/featured.ts');
const { DISPLAY_NAME_OVERRIDES, TYPE_OVERRIDES, iconSlugFromField } =
  await import('../src/data/catalog-overrides.ts');
const { modelLimits } = await import('../src/data/model-limits.ts');
const { modelMeta } = await import('../src/data/model-meta.ts');
const { i18n, locales } = await import('../src/i18n.ts');

const SNAPSHOT_PATH = fileURLToPath(
  new URL('../pricing-api.json', import.meta.url)
);
const ICON_DIR = fileURLToPath(
  new URL('../public/ai-brand-logo/', import.meta.url)
);

/** Repo-relative labels so error messages point at an editable file. */
const FILES = {
  snapshot: 'pricing-api.json',
  featured: 'src/data/featured.ts',
  overrides: 'src/data/catalog-overrides.ts',
  limits: 'src/data/model-limits.ts',
  meta: 'src/data/model-meta.ts',
  i18n: 'src/i18n.ts',
  icons: 'public/ai-brand-logo/',
};

// ──────────────────────────────────────────────────────────────────────────
// Report
// ──────────────────────────────────────────────────────────────────────────

/**
 * Findings are collected rather than printed as they are discovered, so one run
 * reports every problem instead of stopping at the first.
 */
const errors = [];
const warnings = [];

/** @param {string} file @param {string} message */
function fail(file, message) {
  errors.push({ file, message });
}

/** @param {string} file @param {string} message */
function warn(file, message) {
  warnings.push({ file, message });
}

/**
 * Orphan check shared by every keyed override table: any key that no longer
 * matches a `model_name` in the snapshot.
 *
 * @param {string} label     what the table is, for the message
 * @param {string} file      repo-relative file the keys live in
 * @param {Iterable<string>} keys
 * @param {Set<string>} known model names present in the snapshot
 */
function assertNoOrphans(label, file, keys, known) {
  for (const key of keys) {
    if (!known.has(key)) {
      fail(file, `${label}: "${key}" is not in ${FILES.snapshot}`);
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Snapshot
// ──────────────────────────────────────────────────────────────────────────

function loadSnapshot() {
  if (!existsSync(SNAPSHOT_PATH)) {
    throw new Error(`snapshot not found: ${FILES.snapshot}`);
  }
  const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8'));
  if (!Array.isArray(snapshot?.data) || snapshot.data.length === 0) {
    throw new Error(
      `${FILES.snapshot} has no models — refusing to validate against an empty catalog`
    );
  }
  return snapshot;
}

// ──────────────────────────────────────────────────────────────────────────
// Checks
// ──────────────────────────────────────────────────────────────────────────

/**
 * Hard errors — an orphan key here either breaks a user-visible surface or
 * accumulates dictionary garbage that nothing else will ever surface.
 */
function checkOrphans(models) {
  const known = new Set(models.map((m) => m.model_name));

  // Silently drops a card via `.filter(Boolean)` in FeaturedModels.astro.
  assertNoOrphans('featuredModelIds', FILES.featured, featuredModelIds, known);
  // Silently drops a cell in the WhyUs card A grid.
  assertNoOrphans('marqueeIds', FILES.featured, marqueeIds, known);
  // Demos an endpoint call that 400s, same failure mode as SAMPLE_MODEL_ID.
  assertNoOrphans('endpointDemoIds', FILES.featured, endpointDemoIds, known);
  // Ships a hero code sample that 400s when copy-pasted.
  if (!known.has(SAMPLE_MODEL_ID)) {
    fail(
      FILES.featured,
      `SAMPLE_MODEL_ID: "${SAMPLE_MODEL_ID}" is not in ${FILES.snapshot}`
    );
  }

  assertNoOrphans(
    'DISPLAY_NAME_OVERRIDES',
    FILES.overrides,
    Object.keys(DISPLAY_NAME_OVERRIDES),
    known
  );
  assertNoOrphans(
    'TYPE_OVERRIDES',
    FILES.overrides,
    Object.keys(TYPE_OVERRIDES),
    known
  );
  assertNoOrphans('modelLimits', FILES.limits, Object.keys(modelLimits), known);
  assertNoOrphans('modelMeta', FILES.meta, Object.keys(modelMeta), known);

  for (const locale of locales) {
    assertNoOrphans(
      `i18n.${locale}.featured.blurbs`,
      FILES.i18n,
      Object.keys(i18n[locale].featured.blurbs),
      known
    );
  }
}

/** Hard error: a blurb present in one locale but missing in the other. */
function checkBlurbParity() {
  const [first, ...rest] = locales;
  const reference = Object.keys(i18n[first].featured.blurbs);
  for (const locale of rest) {
    const other = new Set(Object.keys(i18n[locale].featured.blurbs));
    for (const key of reference) {
      if (!other.has(key)) {
        fail(
          FILES.i18n,
          `featured.blurbs: "${key}" exists in ${first} but not in ${locale}`
        );
      }
    }
    for (const key of other) {
      if (!reference.includes(key)) {
        fail(
          FILES.i18n,
          `featured.blurbs: "${key}" exists in ${locale} but not in ${first}`
        );
      }
    }
  }
}

/**
 * Hard errors about brand icons. Two distinct failures, both user-visible:
 *
 *   1. The resolved SVG is missing → broken image.
 *   2. Nothing resolved at all → `iconSlugFromField` falls back to `'openai'`
 *      and the page confidently shows an OpenAI logo next to, say, a Tencent
 *      model. The file exists, so check 1 sails right past it.
 *
 * The second one is why this is a hard error and the missing TPM/RPM warnings
 * are not. The dividing line is **empty vs. wrong**, not completeness: a blank
 * rate limit renders "—", which is a truthful "we don't know"; a fallback icon
 * renders a *false claim about who built the model*. The truth principle
 * tolerates the first and forbids the second. (Same reason the missing mono
 * variant below stays a warning — nothing renders it, so it asserts nothing.)
 *
 * Slug derivation is imported from `catalog-overrides.ts` — the same function
 * `pricing.ts` uses — so a change to the mono-only brand set can never make the
 * checker and the site disagree.
 */
function checkIcons(models, vendors) {
  const vendorById = new Map(vendors.map((v) => [v.id, v]));
  for (const m of models) {
    // Mirrors `toModel()` in pricing.ts: model icon wins, vendor icon is the
    // fallback, and an unknown vendor has no icon at all.
    const vendor = vendorById.get(m.vendor_id);
    const iconField = m.icon || vendor?.icon;
    const slug = iconSlugFromField(iconField);

    // Detect the fallback by its *input*, never by comparing the result to
    // 'openai' — a genuine OpenAI model resolves to 'openai' too, and that is
    // correct. Only an absent field means nobody chose this brand.
    //
    // Vendors carrying no icon are harmless until a model points at them, so
    // this is keyed off models rather than the vendor list: an unreferenced
    // placeholder vendor upstream must not block every PR.
    if (!iconField) {
      const who = vendor
        ? `vendor ${vendor.id} (${vendor.name})`
        : `unknown vendor id ${m.vendor_id}`;
      fail(
        FILES.icons,
        `${m.model_name}: neither the model nor ${who} declares an icon — it would fall back to ${slug}.svg and display the OpenAI logo`
      );
    } else if (!existsSync(`${ICON_DIR}${slug}.svg`)) {
      fail(
        FILES.icons,
        `${m.model_name}: icon "${iconField}" resolves to missing ${slug}.svg`
      );
    }

    // Mirrors `iconMonoUrlOf()`. Nothing renders the mono variant today, so a
    // gap here is a latent problem rather than a broken page — warn only.
    const mono = slug.replace(/-color$/, '').replace(/-brand-color$/, '-brand');
    if (mono !== slug && !existsSync(`${ICON_DIR}${mono}.svg`)) {
      warn(
        FILES.icons,
        `${m.model_name}: mono icon variant ${mono}.svg is missing`
      );
    }
  }
}

/**
 * Soft warnings — every one of these is a *blank* hand-written field, and blank
 * is a legitimate shipping state.
 *
 * Crucially, "this new model is not in an editorial selection" is NOT an error.
 * `featuredModelIds` / `marqueeIds` / `SAMPLE_MODEL_ID` are hand-curated picks;
 * a catalog refresh is supposed to leave them alone and let only the derived
 * counts move. Promoting any of these to a hard error would force the selection
 * lists to grow with the catalog and defeat that design.
 */
function checkGaps(models) {
  const featured = new Set(featuredModelIds);
  const marquee = new Set(marqueeIds);

  for (const m of models) {
    const name = m.model_name;

    if (!(name in TYPE_OVERRIDES)) {
      // `language` is the correct default for text LLMs, so this stays a
      // warning: it asks for confirmation, not for an entry.
      warn(
        FILES.overrides,
        `${name}: not in TYPE_OVERRIDES — filed under "language" by default; add an entry only if it is multimodal or video`
      );
    }

    const limits = modelLimits[name];
    const missingLimits = ['tpm', 'rpm'].filter((k) => limits?.[k] == null);
    if (missingLimits.length > 0) {
      warn(
        FILES.limits,
        `${name}: no ${missingLimits.join('/').toUpperCase()} — the /models column renders "—"`
      );
    }

    if (!(name in modelMeta)) {
      warn(
        FILES.meta,
        `${name}: no modelMeta entry — the pricing.md Context column renders "—"`
      );
    }

    if (featured.has(name)) {
      for (const locale of locales) {
        if (!(name in i18n[locale].featured.blurbs)) {
          warn(
            FILES.i18n,
            `${name}: featured on the homepage but has no ${locale} blurb — falls back to the API description`
          );
        }
      }
    }

    if (!marquee.has(name)) {
      warn(
        FILES.featured,
        `${name}: not in marqueeIds — counted in the WhyUs "+N more" link instead (curated list, fine to leave)`
      );
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Rendering
// ──────────────────────────────────────────────────────────────────────────

function renderText() {
  const lines = [];
  if (errors.length > 0) {
    lines.push(`catalog check: ${errors.length} error(s)`);
    for (const e of errors) lines.push(`  ERROR  ${e.file}  ${e.message}`);
  }
  if (warnings.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push(`catalog check: ${warnings.length} warning(s) — not blocking`);
    for (const w of warnings) lines.push(`  warn   ${w.file}  ${w.message}`);
  }
  if (lines.length === 0) lines.push('catalog check: no findings');
  return lines.join('\n');
}

function renderMarkdown() {
  const lines = ['## Catalog check'];
  if (errors.length > 0) {
    lines.push('', `### Errors (${errors.length})`, '');
    for (const e of errors) lines.push(`- \`${e.file}\` — ${e.message}`);
  }
  if (warnings.length > 0) {
    lines.push(
      '',
      `### Pending manual fields (${warnings.length})`,
      '',
      'Blank values ship as "—" on purpose — fill these in only with real,',
      'verifiable numbers.',
      ''
    );
    for (const w of warnings) lines.push(`- [ ] \`${w.file}\` — ${w.message}`);
  }
  if (errors.length === 0 && warnings.length === 0) {
    lines.push('', 'No findings.');
  }
  return lines.join('\n');
}

/** Warnings double as the "what still needs a human" checklist in CI. */
function writeStepSummary() {
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (!path || warnings.length === 0) return;
  appendFileSync(path, `${renderMarkdown()}\n`, 'utf8');
}

// ──────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────

function main() {
  const markdown = process.argv.slice(2).includes('--markdown');
  const snapshot = loadSnapshot();
  const models = snapshot.data;
  const vendors = Array.isArray(snapshot.vendors) ? snapshot.vendors : [];

  checkOrphans(models);
  checkBlurbParity();
  checkIcons(models, vendors);
  checkGaps(models);

  console.log(markdown ? renderMarkdown() : renderText());
  writeStepSummary();

  process.exitCode = errors.length > 0 ? 1 : 0;
}

try {
  main();
} catch (err) {
  console.error(`catalog check failed: ${err.message}`);
  process.exitCode = 1;
}
