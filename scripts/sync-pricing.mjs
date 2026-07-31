#!/usr/bin/env node
/**
 * sync-pricing.mjs — refresh the `pricing-api.json` catalog snapshot from
 * https://tokenfleet.cn/api/pricing and report what changed.
 *
 * The site is fully static: `src/data/pricing.ts` imports the snapshot at build
 * time. This script is the only writer of that snapshot. It never touches
 * `src/` and never fabricates values — fields the API doesn't expose (TPM/RPM,
 * context window, display names, curated selections) stay hand-maintained.
 *
 * Usage:
 *   node scripts/sync-pricing.mjs [--dry-run] [--allow-shrink]
 *                                 [--summary-file <path>]
 *
 *   --dry-run        report only, never write the snapshot
 *   --allow-shrink   accept a >50% drop in model count (use only for a
 *                    human-confirmed bulk delisting)
 *   --summary-file   also write the markdown summary to <path>
 *
 * Environment:
 *   TF_USERNAME         required. Console account used to read the catalog.
 *   TF_PASSWORD         required. Its password.
 *   TF_PRICING_FIXTURE  optional. Path to a local JSON payload, used INSTEAD of
 *                       login + network request. Testing / offline debugging
 *                       only — never set this in CI.
 *
 * Auth: `/api/pricing` is guarded by newAPI's `TryUserAuth`, which reads the
 * browser **session cookie** only. An access token (and an `sk-` channel key
 * even more so) does NOT work there — measured 2026-07-31: a valid admin access
 * token plus `New-API-User` still returned an empty catalog. So the script logs
 * in via `POST /api/user/login`, keeps the `session` cookie, and replays it.
 *
 * `TryUserAuth` degrades to anonymous instead of erroring, so every failure mode
 * (wrong password, expired session, revoked account) looks like HTTP 200 +
 * `success: true` + `data: []`. The `data.length === 0` safety valve is
 * therefore the ONLY thing standing between a credential problem and a wiped
 * model catalog — see `assertSafe`.
 *
 * Output: markdown summary on stdout (and `$GITHUB_STEP_SUMMARY` when present);
 * progress/errors on stderr. Credentials and the session cookie are never
 * logged.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import { requireTypeStripping } from './lib/require-type-stripping.mjs';

requireTypeStripping('sync-pricing');

// Loaded dynamically, after the guard: a static `.ts` import would fail during
// module linking and the guard would never run. See require-type-stripping.mjs.
const { iconSlugFromField } = await import('../src/data/catalog-overrides.ts');

const PRICING_URL = 'https://tokenfleet.cn/api/pricing';
const LOGIN_URL = 'https://tokenfleet.cn/api/user/login';
const FETCH_TIMEOUT_MS = 30_000;

/**
 * Mirrors `BASE_USD_PER_MTOK` in `src/data/pricing.ts`. That module can't be
 * imported here — it does a bare `import raw from '../../pricing-api.json'`,
 * which Node rejects without an import attribute. Keep the two in sync; the
 * value is a newAPI/oneAPI protocol constant, not a tunable.
 */
const BASE_USD_PER_MTOK = 2;

/** Reject a refresh that drops below this fraction of the current model count. */
const SHRINK_FLOOR = 0.5;

const SNAPSHOT_PATH = fileURLToPath(
  new URL('../pricing-api.json', import.meta.url)
);
const ICON_DIR = fileURLToPath(
  new URL('../public/ai-brand-logo/', import.meta.url)
);

// ──────────────────────────────────────────────────────────────────────────
// CLI
// ──────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = { dryRun: false, allowShrink: false, summaryFile: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--allow-shrink') opts.allowShrink = true;
    else if (arg === '--summary-file') {
      opts.summaryFile = argv[++i];
      if (!opts.summaryFile) fail('--summary-file requires a path argument.');
    } else if (arg === '--help' || arg === '-h') {
      process.stderr.write(
        'Usage: node scripts/sync-pricing.mjs [--dry-run] [--allow-shrink] [--summary-file <path>]\n'
      );
      process.exit(0);
    } else {
      fail(`Unknown argument: ${arg}`);
    }
  }
  return opts;
}

function log(msg) {
  process.stderr.write(`${msg}\n`);
}

/** Abort without writing. Never include credential material in `msg`. */
function fail(msg) {
  process.stderr.write(`sync-pricing: ${msg}\n`);
  process.stderr.write(
    'sync-pricing: aborted, pricing-api.json left untouched.\n'
  );
  process.exit(1);
}

// ──────────────────────────────────────────────────────────────────────────
// Fetch
// ──────────────────────────────────────────────────────────────────────────

async function request(url, init, what) {
  try {
    return await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    // `err.message` comes from undici (DNS/TLS/socket) — never carries our
    // credentials, which only ever live in the request body/headers.
    fail(
      `${what} failed: ${err.name === 'TimeoutError' ? 'timed out' : err.message}`
    );
  }
}

/**
 * Log in and return the `session` cookie plus the account id.
 *
 * The console has no captcha on this endpoint (`turnstile_check: false`), so a
 * plain JSON POST is enough. Nothing about the credentials — not even their
 * length — is logged, and the cookie value itself is never printed.
 */
async function login() {
  const username = process.env.TF_USERNAME?.trim();
  // Not trimmed: leading/trailing whitespace can be part of a password.
  const password = process.env.TF_PASSWORD;
  if (!username || !password) {
    fail(
      'TF_USERNAME / TF_PASSWORD are unset or empty. /api/pricing answers ' +
        'anonymous callers with an empty catalog, which would wipe the snapshot.'
    );
  }

  log(`POST ${LOGIN_URL} as ${username}`);
  const res = await request(
    LOGIN_URL,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    },
    'login request'
  );
  if (!res.ok) fail(`login: HTTP ${res.status} ${res.statusText}`);

  const body = parseJson(await res.text(), 'login response');
  if (body.success !== true) {
    fail(`login rejected: ${body.message ?? '(no message)'}`);
  }

  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(';', 1)[0].trim())
    .find((c) => c.startsWith('session='));
  if (!cookie) {
    fail(
      'login succeeded but no `session` cookie was returned; cannot authenticate ' +
        'the catalog request.'
    );
  }
  return { cookie, userId: body.data?.id };
}

async function fetchPayload() {
  const fixture = process.env.TF_PRICING_FIXTURE?.trim();
  if (fixture) {
    // Offline/test path only — bypasses login and the network so the safety
    // valves, normalisation and summary stay exercisable without credentials.
    log(`reading fixture payload from ${fixture} (TF_PRICING_FIXTURE set)`);
    if (!existsSync(fixture)) fail(`fixture not found: ${fixture}`);
    return parseJson(readFileSync(fixture, 'utf8'), `fixture ${fixture}`);
  }

  const { cookie, userId } = await login();
  const headers = { Accept: 'application/json', Cookie: cookie };
  // The console UI sends this alongside the session cookie; mirroring the real
  // browser request costs nothing and avoids surprises on newAPI upgrades.
  if (userId !== undefined) headers['New-API-User'] = String(userId);

  log(`GET ${PRICING_URL} (session cookie)`);
  const res = await request(PRICING_URL, { headers }, 'pricing request');
  if (!res.ok) fail(`HTTP ${res.status} ${res.statusText}`);
  return parseJson(await res.text(), 'API response');
}

function parseJson(text, what) {
  try {
    return JSON.parse(text);
  } catch (err) {
    fail(`could not parse ${what} as JSON: ${err.message}`);
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Safety valves — any hit exits 1 without writing
// ──────────────────────────────────────────────────────────────────────────

/**
 * Runs BEFORE normalisation and before any write. Order matters: the payload
 * must never reach `formatSnapshot`/`writeFileSync` unvalidated.
 *
 * Do not "simplify" the empty-`data` check away. `/api/pricing` uses newAPI's
 * `TryUserAuth`, which silently falls back to anonymous instead of returning
 * 401 — every credential failure therefore arrives as HTTP 200 + `success:
 * true` + `data: []`, indistinguishable from a legitimate response except for
 * the empty array. That single check is the whole defence against an expired
 * password quietly emptying the model catalog on the live site.
 */
function assertSafe(payload, previous, allowShrink) {
  if (
    payload === null ||
    typeof payload !== 'object' ||
    Array.isArray(payload)
  ) {
    fail('payload is not a JSON object.');
  }
  if (payload.success !== true) {
    fail(
      `upstream reported failure (success !== true): ${payload.message ?? '(no message)'}`
    );
  }
  if (!Array.isArray(payload.data) || payload.data.length === 0) {
    fail(
      'payload contains no models (data is empty). This is exactly what an ' +
        'expired/invalid session looks like — /api/pricing answers anonymous ' +
        'callers with HTTP 200 and an empty catalog. The snapshot is NOT ' +
        'overwritten; re-check TF_USERNAME / TF_PASSWORD.'
    );
  }
  if (!Array.isArray(payload.vendors) || payload.vendors.length === 0) {
    fail('payload contains no vendors. Refusing to overwrite the snapshot.');
  }
  const missingName = payload.data.findIndex(
    (m) => typeof m?.model_name !== 'string'
  );
  if (missingName !== -1) {
    fail(
      `data[${missingName}] has no string model_name; refusing an unusable snapshot.`
    );
  }

  const before = previous?.data?.length ?? 0;
  const after = payload.data.length;
  if (before > 0 && after < before * SHRINK_FLOOR) {
    if (!allowShrink) {
      fail(
        `model count dropped ${before} → ${after} (more than ${Math.round(
          (1 - SHRINK_FLOOR) * 100
        )}%). Likely a group/permission incident. Re-run with --allow-shrink if ` +
          'this delisting is confirmed.'
      );
    }
    log(
      `WARNING: model count dropped ${before} → ${after}, accepted via --allow-shrink.`
    );
  }
}

// ──────────────────────────────────────────────────────────────────────────
// Normalisation — deterministic ordering so re-syncs produce no noise diff
// ──────────────────────────────────────────────────────────────────────────

const cmpStr = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Also applied to the previous snapshot before diffing, so a re-ordered
 * `enable_groups` never shows up as a change.
 */
function normalize(payload) {
  const out = {};
  // Top-level keys alphabetical; every top-level field the API returns is
  // preserved — the snapshot stays a faithful mirror, not a curated subset.
  for (const key of Object.keys(payload).sort(cmpStr)) out[key] = payload[key];

  out.data = (payload.data ?? [])
    .map((m) => {
      const model = { ...m };
      // The ONLY field this snapshot deliberately does not mirror. Every other
      // field — top-level, per-model, per-vendor, known or unknown — is written
      // through verbatim; the snapshot's job is still to be an API mirror.
      //
      // If you are here because "the snapshot is missing a field the API
      // returns": that is intentional, and re-adding it will reintroduce a
      // daily noise PR. Evidence, measured 2026-07-31 on one account:
      //
      //   - Upstream attaches a `pricing_version` hash to at most ONE model per
      //     response, and which model it lands on drifts. Five consecutive
      //     requests put it on `deepseek-v4-pro`; minutes later it had moved to
      //     `kimi-k2.7-code` while EVERY other field of EVERY model — including
      //     all pricing fields — was byte-identical. So it does not track
      //     pricing content.
      //   - It is not even per-model data: the same hash `5a90f2b8…f1f1f` has
      //     appeared on `MiniMax-M2.7`, `doubao-seedance-2-0-fast-260128`,
      //     `deepseek-v4-pro` and `kimi-k2.6` at different times. Keeping it
      //     would make the snapshot assert something false about whichever
      //     model happened to receive it.
      //   - Its very presence flickers: over 12 back-to-back requests, 6
      //     responses carried no model-level `pricing_version` at all.
      //
      // Keeping it would therefore flip roughly every other sync into a PR
      // whose only change is this hash moving house — exactly the "no material
      // change, no PR" rule (R1) it would defeat. Nothing reads it either:
      // `RawModel` in pricing.ts doesn't declare it. The STABLE top-level
      // `pricing_version` is preserved.
      //
      // Re-verify before restoring: if upstream ever ships a real per-model
      // version (distinct hashes, present on every model, moving only when that
      // model's price moves), delete this line.
      delete model.pricing_version;
      if (Array.isArray(model.enable_groups)) {
        model.enable_groups = [...model.enable_groups].sort(cmpStr);
      }
      if (Array.isArray(model.supported_endpoint_types)) {
        model.supported_endpoint_types = [
          ...model.supported_endpoint_types,
        ].sort(cmpStr);
      }
      return model;
    })
    .sort((a, b) => cmpStr(a.model_name, b.model_name));

  out.vendors = [...(payload.vendors ?? [])].sort((a, b) => a.id - b.id);
  return out;
}

/**
 * `pricing-api.json` is not in `.prettierignore`, so `npm run format:check`
 * lints it. Formatting through the Prettier API (repo `.prettierrc`) keeps the
 * committed snapshot green.
 *
 * The 2-space pre-indent matters: Prettier keeps an object expanded when the
 * source has a line break after `{`. Feeding indented JSON therefore pins every
 * object to one-field-per-line regardless of how long its values grow, so a
 * verbose new description can never reflow unrelated entries.
 */
async function formatSnapshot(snapshot) {
  const config = await prettier.resolveConfig(SNAPSHOT_PATH);
  return prettier.format(JSON.stringify(snapshot, null, 2), {
    ...config,
    filepath: SNAPSHOT_PATH,
  });
}

// ──────────────────────────────────────────────────────────────────────────
// Price helpers
// ──────────────────────────────────────────────────────────────────────────

/**
 * Unit prices in USD, keyed by a human label. Same formula as `priceBreakdown`
 * in `src/data/pricing.ts` (see BASE_USD_PER_MTOK above for why it isn't
 * imported). Graduated tiers are deliberately not unfolded here — the summary
 * reports base rates; the tier table itself shows up under "其他字段变更".
 */
function priceRows(m) {
  if (m.quota_type === 1)
    return { 单次调用: m.model_price * BASE_USD_PER_MTOK };
  const base = m.model_ratio * BASE_USD_PER_MTOK;
  const rows = {
    '输入 / 1M': base,
    '输出 / 1M': base * m.completion_ratio,
  };
  if (m.cache_ratio !== undefined) rows['缓存命中 / 1M'] = base * m.cache_ratio;
  if (m.create_cache_ratio !== undefined)
    rows['建缓存 / 1M'] = base * m.create_cache_ratio;
  return rows;
}

function fmtUsd(n) {
  if (n === undefined) return '—';
  return `$${Math.round(n * 1e6) / 1e6}`;
}

function billingLabel(m) {
  return m.quota_type === 1 ? '按次' : '按 token';
}

function priceSummaryLabel(m) {
  const rows = priceRows(m);
  return Object.entries(rows)
    .map(([label, value]) => `${label} ${fmtUsd(value)}`)
    .join('，');
}

// ──────────────────────────────────────────────────────────────────────────
// Manual data files (for annotating delisted models)
// ──────────────────────────────────────────────────────────────────────────

/**
 * Key sets of the hand-maintained per-model tables, so a delisted model can be
 * reported together with the files that still carry its key. Loaded lazily via
 * Node's native type stripping (Node >= 22.18) — a load failure degrades to a
 * note rather than aborting the sync.
 *
 * Scope note: this is only the leftover annotation for the PR body. The
 * authoritative, exit-code-bearing consistency check (including the curated
 * selections and override tables) is `npm run check:catalog`.
 */
async function loadManualKeySets() {
  const sets = [];
  const notes = [];

  const add = async (label, spec, pick) => {
    try {
      const mod = await import(spec);
      sets.push({ label, keys: new Set(Object.keys(pick(mod))) });
    } catch (err) {
      notes.push(`无法读取 ${label}：${err.message}`);
    }
  };

  await add(
    'src/data/model-limits.ts',
    '../src/data/model-limits.ts',
    (m) => m.modelLimits
  );
  await add(
    'src/data/model-meta.ts',
    '../src/data/model-meta.ts',
    (m) => m.modelMeta
  );
  await add(
    'src/i18n.ts (zh featured.blurbs)',
    '../src/i18n.ts',
    (m) => m.i18n.zh.featured.blurbs
  );
  await add(
    'src/i18n.ts (en featured.blurbs)',
    '../src/i18n.ts',
    (m) => m.i18n.en.featured.blurbs
  );

  return { sets, notes };
}

// ──────────────────────────────────────────────────────────────────────────
// Icon availability (vendor changes)
// ──────────────────────────────────────────────────────────────────────────

/**
 * Mono variant derivation mirrors `iconMonoUrlOf` in `src/data/pricing.ts`;
 * the colour slug itself comes from the shared `iconSlugFromField`.
 *
 * A missing `icon` is reported as such rather than run through the helper:
 * `iconSlugFromField(undefined)` returns the OpenAI fallback, which exists
 * locally and would otherwise be reported as "icon present" for a vendor that
 * will actually render someone else's logo.
 */
function iconStatus(iconField) {
  if (!iconField) {
    return (
      '上游未给 `icon` 字段 —— 该厂商的模型若也缺 `icon`，会回退成 OpenAI 图标，' +
      '需人工补 SVG 并登记'
    );
  }
  const slug = iconSlugFromField(iconField);
  const mono = slug.replace(/-color$/, '').replace(/-brand-color$/, '-brand');
  const files = slug === mono ? [slug] : [slug, mono];
  const missing = files.filter((f) => !existsSync(`${ICON_DIR}${f}.svg`));
  return missing.length
    ? `图标 **缺失**：${missing.map((f) => `\`public/ai-brand-logo/${f}.svg\``).join('、')}`
    : `图标已就位（\`${slug}.svg\`）`;
}

// ──────────────────────────────────────────────────────────────────────────
// Change summary
// ──────────────────────────────────────────────────────────────────────────

/**
 * Fields whose changes are already covered by the price section, so the
 * "other fields" list doesn't just echo the price table.
 */
const PRICE_FIELDS = new Set([
  'model_ratio',
  'completion_ratio',
  'cache_ratio',
  'create_cache_ratio',
  'model_price',
]);

async function buildSummary(previous, next, snapshotChanged) {
  const prevModels = new Map(
    (previous?.data ?? []).map((m) => [m.model_name, m])
  );
  const nextModels = new Map(next.data.map((m) => [m.model_name, m]));
  const prevVendors = new Map((previous?.vendors ?? []).map((v) => [v.id, v]));
  const nextVendors = new Map(next.vendors.map((v) => [v.id, v]));
  const vendorName = (id) =>
    nextVendors.get(id)?.name ?? prevVendors.get(id)?.name ?? `#${id}`;

  const added = [...nextModels.values()].filter(
    (m) => !prevModels.has(m.model_name)
  );
  const removed = [...prevModels.values()].filter(
    (m) => !nextModels.has(m.model_name)
  );

  const repriced = [];
  const otherChanges = [];
  for (const [name, model] of nextModels) {
    const before = prevModels.get(name);
    if (!before) continue;

    const rows = { ...priceRows(before) };
    const after = priceRows(model);
    const labels = [...new Set([...Object.keys(rows), ...Object.keys(after)])];
    const diffs = labels
      .map((label) => ({ label, old: rows[label], next: after[label] }))
      .filter(
        (d) =>
          d.old === undefined ||
          d.next === undefined ||
          Math.abs(d.old - d.next) > 1e-9
      );
    if (diffs.length) repriced.push({ model, diffs });

    const fields = [...new Set([...Object.keys(before), ...Object.keys(model)])]
      .filter((k) => !PRICE_FIELDS.has(k))
      .filter((k) => JSON.stringify(before[k]) !== JSON.stringify(model[k]));
    if (fields.length) otherChanges.push({ name, fields });
  }

  const vendorAdded = [...nextVendors.values()].filter(
    (v) => !prevVendors.has(v.id)
  );
  const vendorRemoved = [...prevVendors.values()].filter(
    (v) => !nextVendors.has(v.id)
  );
  const vendorRenamed = [...nextVendors.values()].filter(
    (v) => prevVendors.has(v.id) && prevVendors.get(v.id).name !== v.name
  );

  const changed =
    added.length +
      removed.length +
      repriced.length +
      otherChanges.length +
      vendorAdded.length +
      vendorRemoved.length +
      vendorRenamed.length >
    0;

  const out = [];
  out.push('## 模型目录同步摘要', '');
  out.push(`- 数据源：\`${PRICING_URL}\``);
  out.push(`- 模型数：${prevModels.size} → ${nextModels.size}`);
  out.push(`- 厂商数：${prevVendors.size} → ${nextVendors.size}`);
  out.push('');

  if (added.length) {
    out.push(`### 新增模型（${added.length}）`, '');
    out.push('| 模型 | 厂商 | 计费 | 价格 |', '| --- | --- | --- | --- |');
    for (const m of added) {
      out.push(
        `| \`${m.model_name}\` | ${vendorName(m.vendor_id)} | ${billingLabel(m)} | ${priceSummaryLabel(m)} |`
      );
    }
    out.push('');
  }

  if (removed.length) {
    const { sets, notes } = await loadManualKeySets();
    out.push(`### 下线模型（${removed.length}）`, '');
    for (const m of removed) {
      const leftovers = sets
        .filter((s) => s.keys.has(m.model_name))
        .map((s) => `\`${s.label}\``);
      out.push(
        `- \`${m.model_name}\`（${vendorName(m.vendor_id)}）—— ` +
          (leftovers.length
            ? `人工数据残留：${leftovers.join('、')}`
            : '上述人工数据表中无残留键')
      );
    }
    for (const note of notes) out.push(`- ⚠️ ${note}`);
    out.push('');
    out.push(
      '> 选集（`src/data/featured.ts`）与覆盖表（`src/data/catalog-overrides.ts`）的残留检查由 `npm run check:catalog` 给出，会以非零退出码阻断。'
    );
    out.push('');
  }

  if (repriced.length) {
    out.push(`### 调价（${repriced.length}）`, '');
    out.push('| 模型 | 档位 | 旧 | 新 |', '| --- | --- | --- | --- |');
    for (const { model, diffs } of repriced) {
      for (const d of diffs) {
        out.push(
          `| \`${model.model_name}\` | ${d.label} | ${fmtUsd(d.old)} | ${fmtUsd(d.next)} |`
        );
      }
    }
    out.push('');
  }

  if (otherChanges.length) {
    out.push(`### 其他字段变更（${otherChanges.length}）`, '');
    for (const { name, fields } of otherChanges) {
      out.push(`- \`${name}\`：${fields.map((f) => `\`${f}\``).join('、')}`);
    }
    out.push('');
  }

  if (vendorAdded.length || vendorRemoved.length || vendorRenamed.length) {
    out.push('### 厂商变动', '');
    for (const v of vendorAdded) {
      out.push(`- 新增 \`${v.id}\` ${v.name} —— ${iconStatus(v.icon)}`);
    }
    for (const v of vendorRemoved) out.push(`- 移除 \`${v.id}\` ${v.name}`);
    for (const v of vendorRenamed) {
      out.push(`- 改名 \`${v.id}\`：${prevVendors.get(v.id).name} → ${v.name}`);
    }
    out.push('');
  }

  if (!changed) {
    out.push(
      snapshotChanged
        ? '模型与厂商数据无语义变更，快照仅因归一化排序 / 格式化而变动。'
        : '线上数据与仓库快照一致，无需变更。',
      ''
    );
  }

  out.push(
    '新增模型的人工字段缺口（类型归类 / TPM·RPM / 上下文 / blurb / 选集收录）由 `npm run check:catalog` 以软警告列出 —— 空值是合法设计意图，不阻断上线。'
  );

  return { markdown: out.join('\n') + '\n', changed };
}

// ──────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  const currentText = existsSync(SNAPSHOT_PATH)
    ? readFileSync(SNAPSHOT_PATH, 'utf8')
    : null;
  const previous = currentText
    ? parseJson(currentText, 'pricing-api.json')
    : null;
  if (!previous)
    log('WARNING: no existing pricing-api.json — shrink guard is inactive.');

  const payload = await fetchPayload();
  assertSafe(payload, previous, opts.allowShrink);

  const formatted = await formatSnapshot(normalize(payload));
  const snapshotChanged = formatted !== currentText;

  // Both sides normalised: the summary reports semantic changes only, never
  // the one-off re-ordering of an existing snapshot.
  const { markdown } = await buildSummary(
    previous ? normalize(previous) : null,
    JSON.parse(formatted),
    snapshotChanged
  );

  if (!snapshotChanged) {
    log(
      'pricing-api.json is already up to date (byte-identical after normalisation).'
    );
  } else if (opts.dryRun) {
    log('--dry-run: snapshot would change, nothing written.');
  } else {
    writeFileSync(SNAPSHOT_PATH, formatted, 'utf8');
    log('pricing-api.json updated.');
  }

  process.stdout.write(markdown);
  if (opts.summaryFile) writeFileSync(opts.summaryFile, markdown, 'utf8');
  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, { flag: 'a' });
  }
}

await main();
