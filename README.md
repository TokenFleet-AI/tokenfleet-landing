<p align="center">
  <img src="public/xy-logo-transparent.png" alt="TokenFleet" width="160" />
</p>

<h1 align="center">TokenFleet Landing</h1>

<p align="center">
  Public Astro site for TokenFleet, a one-stop AI model API gateway for engineering teams and enterprise buyers.
</p>

<p align="center">
  <a href="README.zh-CN.md">简体中文</a> · English
</p>

<p align="center">
  <strong>Astro 6</strong> · <strong>Static model catalog</strong> · <strong>AI SEO endpoints</strong> · <strong>OpenAI-compatible API narrative</strong>
</p>

> [!NOTE]
> This repository contains the static marketing site, model catalog, and SEO-facing generated pages. It does not contain the TokenFleet API service or console application.

## Overview

TokenFleet Landing is the public site for **TokenFleet**. It explains the product promise — one API key, OpenAI-compatible integration, unified RMB billing, VAT invoices, and a searchable production model catalog — in Chinese by default with a parallel English locale under `/en`.

| Area                    | Details                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Framework               | Astro 6 static site                                                                       |
| Interactivity           | Vanilla browser scripts for tabs, copy, filters, sorting, QR popovers, and reveal effects |
| Languages               | Chinese at `/`, English at `/en`                                                          |
| Main routes             | `/`, `/models`, `/en`, `/en/models`                                                       |
| Machine-readable routes | `/sitemap.xml`, `/llms.txt`, `/pricing.md`, `/robots.txt`                                 |
| Catalog source          | Root `pricing-api.json` snapshot, refreshed daily by the `sync-models` workflow           |
| Current catalog         | 16 AI models across 5 active vendors; 14 vendors registered in the source snapshot        |
| Quality gates           | ESLint, Prettier, `astro check`, production build, GitHub Actions CI                      |
| Build output            | Static files in `dist/`                                                                   |

## Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Key Files](#key-files)
- [Updating the Model Catalog](#updating-the-model-catalog)
- [Deployment Notes](#deployment-notes)
- [Continuous Integration](#continuous-integration)

## Highlights

- **Bilingual marketing site** with shared Astro components and a single `src/i18n.ts` dictionary for Chinese and English copy.
- **Static, crawlable model catalog** generated from `pricing-api.json`, rendered as a single column of hairline-separated rows (`ModelRow.astro`) with vendor filters, model-type filters, search, name sorting, and URL-synced state.
- **Automated catalog refresh**: a daily GitHub Actions workflow pulls the upstream pricing API, normalises the snapshot, and opens a pull request only when something actually changed; `npm run check:catalog` then cross-checks the hand-curated data against it.
- **AI search surfaces** generated at build time: `llms.txt` for assistant context and `pricing.md` for machine-readable model pricing (input/output prices, billing mode, context window).
- **Structured data pipeline** with site-level Organization / WebSite schema and homepage FAQPage schema.
- **OpenAI-compatible integration examples** in `curl`, Python, and Node, with copy buttons and keyboard-accessible tabs.
- **Enterprise positioning** around unified billing, RMB business settlement, VAT invoices, VPC/private deployment, SLA discussions, and dedicated technical contact.
- **Accessibility-minded UI** with skip links, semantic cards and pages, visible focus states, no-JS crawlable content, reduced-motion handling, and responsive layouts.

## Tech Stack

| Layer            | Technology                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Site framework   | [Astro](https://astro.build/) 6                                                                                             |
| Styling          | Plain CSS, design tokens, button primitives, Tailwind CSS 4 Vite plugin                                                     |
| Language         | TypeScript 6 with Astro components                                                                                          |
| Data             | Build-time imports from `pricing-api.json` plus curated metadata in `src/data/model-meta.ts` and `src/data/model-limits.ts` |
| Browser behavior | Vanilla JavaScript for small interactions; no React island dependency                                                       |
| Images           | Static `public/` assets plus `astro:assets` for QR code images                                                              |
| SEO              | Custom sitemap, canonical / hreflang links, Open Graph image, JSON-LD helpers, `llms.txt`, `pricing.md`                     |
| Quality          | ESLint, Prettier with `prettier-plugin-astro`, `@astrojs/check`, GitHub Actions                                             |

## Getting Started

### Requirements

- Node.js 22.12 or newer for the site itself
- Node.js 22.18 or newer to run `npm run check:catalog` / `npm run sync:models` — both scripts import `src/data/*.ts` directly and rely on native TypeScript type stripping
- `engines.node` in `package.json` declares the stricter of the two (22.18), because `check:catalog` is a CI gate and reproducing CI locally therefore needs it
- npm

### Install

```sh
npm install
```

### Development

```sh
npm run dev
```

Astro will print the local development URL, usually `http://localhost:4321`.

### Production Build

```sh
npm run build
```

### Preview Build

```sh
npm run preview
```

## Available Scripts

| Command                 | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`           | Start the Astro development server.                                               |
| `npm run build`         | Build the static site into `dist/`.                                               |
| `npm run preview`       | Preview the production build locally with host binding.                           |
| `npm run check`         | Run `astro check` for type and content diagnostics.                               |
| `npm run check:catalog` | Cross-check the hand-curated catalog data against `pricing-api.json`.             |
| `npm run lint`          | Run ESLint across Astro, JS, MJS, TS, TSX, and JSX sources.                       |
| `npm run format:check`  | Verify formatting with Prettier without writing files.                            |
| `npm run sync:models`   | Refresh the `pricing-api.json` snapshot from the pricing API (needs credentials). |
| `npm run astro`         | Run Astro CLI commands directly.                                                  |

## Routes

| Route          | Purpose                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `/`            | Chinese landing page with hero, model highlights, business, enterprise, and FAQ sections.                                            |
| `/en`          | English landing page sharing the same `HomePage.astro` composition.                                                                  |
| `/models`      | Chinese static model catalog: a hairline-separated row list with vendor / type filters, search, name sorting, and TPM / RPM columns. |
| `/en/models`   | English model catalog mirroring `/models`.                                                                                           |
| `/404`         | Custom noindex not-found page with recovery links.                                                                                   |
| `/sitemap.xml` | Build-time XML sitemap with zh-CN / en / x-default alternates (home + models only).                                                  |
| `/llms.txt`    | Build-time assistant-readable site summary and full model list.                                                                      |
| `/pricing.md`  | Build-time Markdown pricing snapshot for agents and comparison engines.                                                              |

## Project Structure

```text
docs/                  Product, design, and maintenance notes
public/                Static images, favicons, OG image, robots.txt, brand marks
public/ai-brand-logo/  Local LobeHub vendor SVG snapshots used by catalog rows
public/images/         Marketing imagery used across sections
scripts/               Catalog sync and consistency-check CLIs (Node, no build step)
src/assets/            Imported QR code assets
src/components/        Page sections and reusable Astro components
src/data/              Pricing loader, model metadata, and manually curated rate limits
src/i18n.ts            Locale type, path helper, and zh / en UI dictionary
src/layouts/           Shared HTML shell, metadata, JSON-LD, and global imports
src/pages/             Astro routes, including generated SEO endpoints
src/seo/               JSON-LD helpers, FAQ generation, and sitemap page registry
src/styles/            Global CSS, design tokens, Tailwind entry, and button styles
```

## Key Files

| File                                  | Purpose                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/components/HomePage.astro`       | Shared Chinese / English landing page composition.                                                         |
| `src/components/ModelsPage.astro`     | Shared Chinese / English model catalog page shell (hero + explorer).                                       |
| `src/components/ModelsExplorer.astro` | Crawlable catalog list toolbar plus vanilla JS vendor / type filters, search, name sorting, and URL state. |
| `src/components/ModelRow.astro`       | One model row in the catalog list (name, ID, type, TPM, RPM).                                              |
| `src/components/FeaturedModels.astro` | Homepage featured-models gallery driven by `featuredModelIds` from `src/data/featured.ts`.                 |
| `src/data/pricing.ts`                 | Imports `pricing-api.json`, maps vendors, formats prices, derives modalities, and exposes catalog data.    |
| `src/data/featured.ts`                | The four editorial model-ID selections used by the homepage and the WhyUs section.                         |
| `src/data/catalog-overrides.ts`       | Display names, model-type buckets, mono-only brand set, and icon slug derivation (import-free by design).  |
| `src/data/model-meta.ts`              | Curated context window, max output, and vendor docs links (consumed by `pricing.md`).                      |
| `src/data/model-limits.ts`            | Manually curated TPM / RPM rate limits per model (consumed by `ModelRow.astro`).                           |
| `scripts/sync-pricing.mjs`            | Refreshes `pricing-api.json` from the pricing API with safety valves and a change summary.                 |
| `scripts/check-catalog.mjs`           | Hard errors on orphaned model IDs, warnings on blank curated fields.                                       |
| `src/i18n.ts`                         | Full bilingual UI copy, SEO titles, FAQ text, featured-model blurbs, and route labels.                     |
| `src/seo/pages.ts`                    | Indexable page registry (home + models only; detail pages removed).                                        |
| `src/seo/schema.ts`                   | Site-level Organization / WebSite / FAQPage JSON-LD.                                                       |
| `src/pages/llms.txt.ts`               | Build-time `llms.txt` endpoint.                                                                            |
| `src/pages/pricing.md.ts`             | Build-time machine-readable pricing endpoint.                                                              |
| `src/pages/sitemap.xml.ts`            | Custom sitemap endpoint with hreflang alternates.                                                          |
| `src/site-links.ts`                   | Shared external console, sign-in, and docs URLs.                                                           |
| `src/layouts/Base.astro`              | Document shell, canonical / alternate links, Open Graph, JSON-LD, skip link, and reveal behavior.          |

> [!NOTE]
> Model detail pages (`/models/[slug]`, `/en/models/[slug]`) and their components (`ModelCard.astro`, `ModelDetailPage.astro`, `ModelDetail.astro`) plus `src/data/model-slug.ts` were removed in favor of a single static catalog list. The sitemap no longer indexes per-model URLs. For the full maintenance workflow, see [`docs/model-catalog-maintenance.md`](docs/model-catalog-maintenance.md).

## Updating the Model Catalog

The model catalog is generated at build time from the root `pricing-api.json` snapshot, which mirrors `https://tokenfleet.cn/api/pricing`. The snapshot itself is refreshed automatically: `.github/workflows/sync-models.yml` runs `npm run sync:models` daily, and opens a pull request against `main` only when the upstream catalog actually changed. Everything the API does not expose stays hand-curated across eight further maintenance points. **The full step-by-step workflow — the sync automation, credential rotation, and adding / removing / renaming models or editing TPM / RPM — is documented in [`docs/model-catalog-maintenance.md`](docs/model-catalog-maintenance.md).**

Quick reference of the nine maintenance points:

| File                              | Manual / automatic | What you edit there                                                                            |
| --------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `pricing-api.json`                | **automatic**      | Never by hand — the sync script owns this file; prices are read-only here.                     |
| `src/data/featured.ts`            | manual             | The four editorial ID selections: featured cards, WhyUs grid, hero code sample, endpoint demo. |
| `src/data/catalog-overrides.ts`   | manual             | Display names, model-type buckets, mono-only brand set, icon slug derivation.                  |
| `src/data/pricing.ts`             | manual             | Vendor slugs, English vendor names, modality heuristics, price formulas.                       |
| `src/data/model-meta.ts`          | manual             | Context window, max output, vendor docs link (consumed by `pricing.md`).                       |
| `src/data/model-limits.ts`        | manual             | **TPM / RPM rate limits** shown in the `/models` list (the API does not expose them).          |
| `src/i18n.ts`                     | manual             | `featured.blurbs` (zh + en) and the vendor names named in marketing copy.                      |
| `src/components/BrandStrip.astro` | manual             | The homepage vendor logo strip.                                                                |
| `public/ai-brand-logo/`           | manual             | Local LobeHub brand-icon SVG snapshots.                                                        |

Counts are never hand-written: model totals, active vendor totals, and the WhyUs "+N more" link all derive from the snapshot, so a refresh updates them on its own. The editorial selections above deliberately do **not** grow with the catalog — `npm run check:catalog` treats an orphaned ID as a hard error and a blank curated field as a warning.

After any change, reproduce CI locally:

```sh
npm run format:check && npm run lint && npm run build && npm run check && npm run check:catalog
```

> [!IMPORTANT]
> Never fabricate values. Fields you cannot verify from the upstream API or vendor docs must be left empty — the catalog renders `—` for missing TPM / RPM and missing context windows by design.

> [!TIP]
> The sitemap covers only `/`, `/en`, `/models`, `/en/models`. There are no per-model detail routes anymore, so new models need no manual sitemap entry.

## Deployment Notes

The site is configured in `astro.config.mjs` with:

- `site: 'https://tokenfleet.cn'`
- `trailingSlash: 'never'`
- compressed HTML output
- build assets emitted under `_assets`
- Tailwind CSS 4 through the Vite plugin

The production build output is written to `dist/` and can be deployed to any static hosting platform.

## Continuous Integration

`.github/workflows/ci.yml` runs on every push and pull request targeting `main`:

1. `actionlint` for workflow files
2. `npm ci` on Node.js 22
3. `npm run format:check`
4. `npm run lint`
5. `npm run build`
6. `npm run check`
7. `npm run check:catalog`

`.github/workflows/sync-models.yml` runs on a daily schedule (and on demand) to refresh the catalog snapshot and open a pull request when it changed. It runs the same check sequence itself, because pull requests created with the default `GITHUB_TOKEN` do not trigger `ci.yml`.

> [!TIP]
> Before pushing, run `npm run format:check && npm run lint && npm run build && npm run check && npm run check:catalog` to reproduce CI locally.
