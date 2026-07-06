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
  <strong>Astro 6</strong> · <strong>Static model pages</strong> · <strong>AI SEO endpoints</strong> · <strong>OpenAI-compatible API narrative</strong>
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
| Main routes             | `/`, `/models`, `/models/[slug]`, `/en`, `/en/models`, `/en/models/[slug]`                |
| Machine-readable routes | `/sitemap.xml`, `/llms.txt`, `/pricing.md`, `/robots.txt`                                 |
| Catalog source          | Root `pricing-api.json` snapshot                                                          |
| Current catalog         | 15 AI models across 5 active vendors; 13 vendors registered in the source snapshot        |
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
- [Updating Model Pricing](#updating-model-pricing)
- [Deployment Notes](#deployment-notes)
- [Continuous Integration](#continuous-integration)

## Highlights

- **Bilingual marketing site** with shared Astro components and a single `src/i18n.ts` dictionary for Chinese and English copy.
- **Static, crawlable model catalog** generated from `pricing-api.json`, with vendor filters, modality filters, search, price sorting, and URL-synced state.
- **Programmatic model detail pages** for every model at `/models/[slug]` and `/en/models/[slug]`, including pricing tables, specs, endpoints, breadcrumbs, and FAQ content.
- **AI search surfaces** generated at build time: `llms.txt` for assistant context and `pricing.md` for machine-readable model pricing.
- **Structured data pipeline** with site-level Organization / WebSite schema, homepage FAQPage schema, model SoftwareApplication / Offer schema, BreadcrumbList, and per-model FAQPage schema.
- **OpenAI-compatible integration examples** in `curl`, Python, and Node, with copy buttons and keyboard-accessible tabs.
- **Enterprise positioning** around unified billing, RMB business settlement, VAT invoices, VPC/private deployment, SLA discussions, and dedicated technical contact.
- **Accessibility-minded UI** with skip links, semantic cards and pages, visible focus states, no-JS crawlable content, reduced-motion handling, and responsive layouts.

## Tech Stack

| Layer            | Technology                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| Site framework   | [Astro](https://astro.build/) 6                                                                         |
| Styling          | Plain CSS, design tokens, button primitives, Tailwind CSS 4 Vite plugin                                 |
| Language         | TypeScript 6 with Astro components                                                                      |
| Data             | Build-time imports from `pricing-api.json` plus curated metadata in `src/data/model-meta.ts`            |
| Browser behavior | Vanilla JavaScript for small interactions; no React island dependency                                   |
| Images           | Static `public/` assets plus `astro:assets` for QR code images                                          |
| SEO              | Custom sitemap, canonical / hreflang links, Open Graph image, JSON-LD helpers, `llms.txt`, `pricing.md` |
| Quality          | ESLint, Prettier with `prettier-plugin-astro`, `@astrojs/check`, GitHub Actions                         |

## Getting Started

### Requirements

- Node.js 22.12 or newer
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

| Command                | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Start the Astro development server.                         |
| `npm run build`        | Build the static site into `dist/`.                         |
| `npm run preview`      | Preview the production build locally with host binding.     |
| `npm run check`        | Run `astro check` for type and content diagnostics.         |
| `npm run lint`         | Run ESLint across Astro, JS, MJS, TS, TSX, and JSX sources. |
| `npm run format:check` | Verify formatting with Prettier without writing files.      |
| `npm run astro`        | Run Astro CLI commands directly.                            |

## Routes

| Route               | Purpose                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `/`                 | Chinese landing page with hero, model highlights, business, enterprise, and FAQ sections. |
| `/en`               | English landing page sharing the same `HomePage.astro` composition.                       |
| `/models`           | Chinese static model catalog with filters, search, sorting, and detail links.             |
| `/en/models`        | English model catalog mirroring `/models`.                                                |
| `/models/[slug]`    | Chinese model detail page for each model in the pricing snapshot.                         |
| `/en/models/[slug]` | English model detail page for each model in the pricing snapshot.                         |
| `/404`              | Custom noindex not-found page with recovery links.                                        |
| `/sitemap.xml`      | Build-time XML sitemap with zh-CN / en / x-default alternates.                            |
| `/llms.txt`         | Build-time assistant-readable site summary and full model list.                           |
| `/pricing.md`       | Build-time Markdown pricing snapshot for agents and comparison engines.                   |

## Project Structure

```text
docs/                  Product and design planning notes
public/                Static images, favicons, OG image, robots.txt, brand marks
public/ai-brand-logo/  Local LobeHub vendor SVG snapshots used by catalog cards
public/images/         Marketing imagery used across sections
src/assets/            Imported QR code assets
src/components/        Page sections and reusable Astro components
src/data/              Pricing loader, model metadata, and stable model slugs
src/i18n.ts            Locale type, path helper, and zh / en UI dictionary
src/layouts/           Shared HTML shell, metadata, JSON-LD, and global imports
src/pages/             Astro routes, including generated SEO endpoints
src/seo/               JSON-LD helpers, FAQ generation, and sitemap page registry
src/styles/            Global CSS, design tokens, Tailwind entry, and button styles
```

## Key Files

| File                                   | Purpose                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `src/components/HomePage.astro`        | Shared Chinese / English landing page composition.                                                      |
| `src/components/ModelsPage.astro`      | Shared Chinese / English model catalog page shell.                                                      |
| `src/components/ModelsExplorer.astro`  | Crawlable model grid plus vanilla JS filters, search, sorting, and URL state.                           |
| `src/components/ModelCard.astro`       | Linked model card used by the catalog.                                                                  |
| `src/components/ModelDetailPage.astro` | Shared detail-page layout with metadata and JSON-LD injection.                                          |
| `src/components/ModelDetail.astro`     | Semantic model detail body: breadcrumbs, pricing, specs, endpoints, FAQ, CTA.                           |
| `src/data/pricing.ts`                  | Imports `pricing-api.json`, maps vendors, formats prices, derives modalities, and exposes catalog data. |
| `src/data/model-slug.ts`               | Generates stable unique slugs and model detail paths.                                                   |
| `src/data/model-meta.ts`               | Curated context window, max output, and vendor docs links.                                              |
| `src/i18n.ts`                          | Full bilingual UI copy, SEO titles, FAQ text, and route labels.                                         |
| `src/seo/*.ts`                         | Schema generators and sitemap page registry.                                                            |
| `src/pages/llms.txt.ts`                | Build-time `llms.txt` endpoint.                                                                         |
| `src/pages/pricing.md.ts`              | Build-time machine-readable pricing endpoint.                                                           |
| `src/pages/sitemap.xml.ts`             | Custom sitemap endpoint with hreflang alternates.                                                       |
| `src/site-links.ts`                    | Shared external console, sign-in, and docs URLs.                                                        |
| `src/layouts/Base.astro`               | Document shell, canonical / alternate links, Open Graph, JSON-LD, skip link, and reveal behavior.       |

## Updating Model Pricing

The catalog is generated at build time from the root `pricing-api.json` snapshot, which should mirror `https://tokenfleet.cn/api/pricing`.

1. Refresh `pricing-api.json` from the API.
2. Update `src/data/model-meta.ts` for new or removed models when context, max output, or docs links are known.
3. Check `src/components/FeaturedModels.astro`, `src/components/WhyUs.astro`, `src/components/CodeBlock.astro`, and `src/i18n.ts` for stale model IDs or vendor copy.
4. Verify icons under `public/ai-brand-logo/` still match the `icon` fields consumed by `src/data/pricing.ts`.
5. Run `npm run build` to verify static routes, generated model detail pages, `sitemap.xml`, `llms.txt`, and `pricing.md`.

> [!TIP]
> Model detail pages and sitemap entries are generated from `modelsWithSlug()`, so new models are routable automatically once the pricing snapshot and metadata are valid.

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

> [!TIP]
> Before pushing, run `npm run format:check && npm run lint && npm run build && npm run check` to reproduce CI locally.
