# ABService Architecture

Gate 2B migrates the site from hand-authored static HTML into an Astro static frontend with a content layer, Decap CMS, and a preserved Vercel Functions backend.

## Ownership Decisions

- Company owns domain, GitHub, hosting, Telegram bot, CRM and analytics accounts.
- Руководитель направления принимает финальные решения по сайту.
- Маркетолог регулярно меняет контент через простую CMS.
- Публикация изменений не требует отдельного approval workflow.
- Production/main, push, merge and deployment are outside Gate 2B and require separate confirmation.

## Frontend

- Framework: Astro, static output.
- Canonical repository: GitHub.
- Frontend target: GitHub Pages.
- Visual baseline: existing Gate 2A design, texts and assets are preserved.
- Main routes:
  - `/` — выездной сервис;
  - `/parts/` — запчасти;
  - `/stationary-service/` — prepared page for the future stationary service direction;
  - `/articles/` — SEO article index;
  - `/articles/[slug]/` — article detail page.

## Content Layer

Content lives under `src/content/`:

- `settings/contacts.json` — phone, region, legal placeholder and site URL;
- `settings/prices.json` — service price strip;
- `settings/seo.json` — page titles, descriptions and canonical paths;
- `settings/integrations.json` — public lead endpoint, analytics config and Bitrix24 status;
- `settings/home-page.json` — homepage text blocks;
- `settings/parts-page.json` — parts page text blocks;
- `settings/stationary-page.json` — stationary service placeholders and TBD fields;
- `settings/forms.json` — form copy;
- `settings/advantages.json` — advantages;
- `settings/gallery.json` — gallery images and captions;
- `services/*.json` — service cards;
- `business-directions/*.json` — expandable direction model;
- `team/*.json` — team block;
- `articles/*.md` — SEO articles.

## CMS

Decap CMS is mounted at `/admin/`.

The CMS can edit content and media only. It does not expose Telegram token, Bitrix24 webhook, Vercel env vars, or backend source credentials.

## Leads

The public lead contract is `/api/lead`.

Frontend forms submit normalized lead payloads and do not know Telegram internals. The Vercel Function owns delivery:

1. Telegram CRM delivery remains active and keeps the existing UX.
2. Bitrix24 delivery is prepared through `api/lib/bitrix24-adapter.js`.
3. Bitrix24 is disabled by default until credentials and a separate approval are provided.

The site does not keep a separate full lead history.

## Analytics

`src/lib/analytics.ts` exposes a small client-side goal layer. With `yandexMetrikaId: "TBD"`, it performs no external analytics calls. Lead forms dispatch `abservice:leadSubmitted`; once the real counter ID is provided, the same event can send Yandex Metrika goals.

## Legacy Files

Gate 2B intentionally keeps legacy root files and `_site/` for audit and rollback context. Candidates for cleanup after migration acceptance:

- root `index.html`;
- root `parts/`;
- root CSS/JS copies;
- `_site/`;
- `github-pages-field-service.zip`.
