# ABService Architecture

ABService v1.0.0 is an Astro static frontend with a content layer, Decap CMS configuration, and a Vercel Functions Telegram CRM backend.

**Production snapshot (2026-09-07):** Telegram CRM is active; webhook secret verification is enabled; Bitrix24 and Yandex Metrika are post-launch / future; Decap CMS production authentication is not closed.

## Ownership Decisions

- Company owns domain, GitHub, hosting, Telegram bot, CRM and analytics accounts.
- Руководитель направления принимает финальные решения по сайту.
- Маркетолог регулярно меняет контент через простую CMS.
- Публикация изменений не требует отдельного approval workflow.
- Production/main, push, merge, GitHub upload and further deployment require separate confirmation. v1.0.0 is prepared locally and is not uploaded to a customer GitHub repository yet.

## Frontend

- Framework: Astro, static output.
- Canonical repository: GitHub.
- Frontend target: GitHub Pages.
- Visual baseline: existing Gate 2A design, texts and assets are preserved.
- Main routes:
  - `/` — выездной сервис;
  - `/parts/` — запчасти;
  - `/stationary-service/` — stationary service (Moscow, launch in progress);
  - `/articles/` — materials index;
  - `/articles/[slug]/` — generated only for published article entries.

## Content Layer

Content lives under `src/content/`:

- `settings/contacts.json` — public corporate brand, region, phone, legal line and site URL only (no personal/internal/secrets);
- `settings/prices.json` — **legacy** home price strip source (unchanged in Gate 3A);
- `settings/seo.json` — page titles, descriptions and canonical paths;
- `settings/integrations.json` — public lead endpoint, analytics config and Bitrix24 status;
- `settings/home-page.json` — homepage text blocks;
- `settings/parts-page.json` — parts page text blocks;
- `settings/stationary-page.json` — approved stationary service scope copy;
- `settings/articles-page.json` — articles landing copy;
- `settings/forms.json` — form copy;
- `settings/advantages.json` — advantages;
- `settings/gallery.json` — gallery images and captions;
- `services/*.json` — service cards with optional `price` / `priceNote`;
- `business-directions/*.json` — expandable direction model;
- `team/*.json` — team block;
- `articles/*.md` — materials/articles.

## CMS

Decap CMS is mounted under the Astro base path (`/Setvice/admin/`; noindex / robots deny with the same base-prefixed Disallow).

The CMS can edit content and media only. It does not expose Telegram token, Bitrix24 webhook, Vercel env vars, or backend source credentials.

CMS OAuth implementation is ready locally (`api/cms-auth.js`, `api/cms-callback.js` on the existing Vercel project `abservice-leads-v2`). Production OAuth App/env is not configured. The proxy is isolated from `/api/lead` and Telegram CRM: it uses only `GITHUB_OAUTH_CLIENT_ID` / `GITHUB_OAUTH_CLIENT_SECRET`, checks OAuth state, and allows browser Origin `https://abs-bear.github.io` (no `*`). New CMS uploads use `public_folder: /Setvice/media`. Treat `/admin/` as not handover-ready until Stage 2. See `docs/ADMIN_GUIDE.md` and `docs/HANDOVER.md`.

## Leads

The public lead contract is `/api/lead`. Production URL:

```text
https://abservice-leads-v2.vercel.app/api/lead
```

Current Vercel production deployment: `dpl_84tMye42AgtbdKoDhwm2fT8EdSEs`. Vercel rollback target: `dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz`.

Frontend forms submit normalized lead payloads and do not know Telegram internals. The browser must not auto-activate the Telegram webhook via GET on page load; webhook install stays server-side in the lead API. Do **not** use a browser `GET /api/lead` in production. The Vercel Function owns delivery:

1. Telegram CRM delivery is **active production** and keeps the existing UX.
2. Incoming Telegram webhook updates require `X-Telegram-Bot-Api-Secret-Token` matching `TELEGRAM_WEBHOOK_SECRET`. Ordinary frontend lead POSTs do not send this header.
3. Bitrix24 delivery is prepared through `api/lib/bitrix24-adapter.js`.
4. Bitrix24 is **post-launch / future** and stays off until credentials and a separate approval are provided.

`api/callback-v3.js` remains as a **legacy fallback**. GET is neutralized (legacy-disabled / read-only, no webhook mutation). POST also requires the webhook secret and must not become the live webhook target.

The site does not keep a separate full lead history.

## Analytics

`src/lib/analytics.ts` exposes a small client-side goal layer. Analytics is disabled in `src/content/settings/integrations.json`; with `enabled: false` and `yandexMetrikaId: "TBD"`, it performs no external analytics calls. Yandex Metrika is **post-launch / future**.

## SEO

Canonical URLs, Open Graph URLs, robots and sitemap are generated from `src/content/settings/contacts.json` and `src/content/settings/seo.json` for `https://abs-bear.github.io/Setvice/`. `robots.txt` Disallow for admin uses the Astro base helper (so `/Setvice/admin` and `/Setvice/admin/` are blocked). Draft articles are excluded from article pages and sitemap output. Empty articles index must be noindex.

## Legacy Files

Legacy root files and `_site/` remain for audit and rollback context. Candidates for cleanup after migration acceptance:

- root `index.html`;
- root `parts/`;
- root CSS/JS copies;
- `_site/`;
- `api/callback-v3.js`, after confirming no active Telegram webhook uses `/api/callback-v3`.

The older `github-pages-field-service.zip` archive is build-independent and has been moved to `archive/legacy/github-pages-field-service.zip`.

See also `docs/ROLLBACK.md` and `CHANGELOG.md`.
