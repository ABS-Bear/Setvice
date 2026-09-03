# ABService Architecture

Gate 3A continues the Astro static frontend with a content layer, Decap CMS configuration, and a preserved Vercel Functions Telegram CRM backend.

## Ownership Decisions

- Company owns domain, GitHub, hosting, Telegram bot, CRM and analytics accounts.
- Руководитель направления принимает финальные решения по сайту.
- Маркетолог регулярно меняет контент через простую CMS.
- Публикация изменений не требует отдельного approval workflow.
- Production/main, push, merge and deployment are outside Gate 3A and require separate confirmation.

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

- `settings/contacts.json` — phone, region, legal placeholder and site URL;
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

Decap CMS is mounted under the Astro base path (for example `/ArcticBear/admin/`; noindex / robots deny with the same base-prefixed Disallow).

The CMS can edit content and media only. It does not expose Telegram token, Bitrix24 webhook, Vercel env vars, or backend source credentials.

## Leads

The public lead contract is `/api/lead`.

Frontend forms submit normalized lead payloads and do not know Telegram internals. The browser must not auto-activate the Telegram webhook via GET on page load; webhook install stays server-side in the lead API. The Vercel Function owns delivery:

1. Telegram CRM delivery remains **active** and keeps the existing UX.
2. Bitrix24 delivery is prepared through `api/lib/bitrix24-adapter.js`.
3. Bitrix24 is **future/off** by default until credentials and a separate approval are provided.

`api/callback-v3.js` remains as a **legacy fallback**. GET is neutralized (legacy-disabled / read-only, no webhook mutation). POST stays until an external webhook check confirms `/api/lead`.

The site does not keep a separate full lead history.

## Analytics

`src/lib/analytics.ts` exposes a small client-side goal layer. Analytics is disabled in `src/content/settings/integrations.json`; with `enabled: false` and `yandexMetrikaId: "TBD"`, it performs no external analytics calls. Yandex Metrika is **future/off**.

## SEO

Canonical URLs, Open Graph URLs, robots and sitemap are generated from `src/content/settings/contacts.json` and `src/content/settings/seo.json` for `https://alecmonopoly84-hue.github.io/ArcticBear/`. `robots.txt` Disallow for admin uses the Astro base helper (so `/ArcticBear/admin` and `/ArcticBear/admin/` are blocked). Draft articles are excluded from article pages and sitemap output. Empty articles index must be noindex.

## Legacy Files

Legacy root files and `_site/` remain for audit and rollback context. Candidates for cleanup after migration acceptance:

- root `index.html`;
- root `parts/`;
- root CSS/JS copies;
- `_site/`;
- `api/callback-v3.js`, after confirming no active Telegram webhook uses `/api/callback-v3`.

The older `github-pages-field-service.zip` archive is build-independent and has been moved to `archive/legacy/github-pages-field-service.zip`.

See also `docs/ROLLBACK.md` and `CHANGELOG.md`.
