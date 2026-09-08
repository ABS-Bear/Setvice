# Admin Guide

Production CMS:

```text
https://abs-bear.github.io/Setvice/admin/
```

Login: **Login with GitHub**. The editor needs a GitHub user with **Write only** on `ABS-Bear/Setvice`. Org admin, Vercel, Telegram, Cursor and Terminal are **not** required for daily CMS work.

Admin is noindex and disallowed in `robots.txt` under `/Setvice/admin`.

## Daily workflow

1. Open `https://abs-bear.github.io/Setvice/admin/`.
2. Sign in with GitHub (company OAuth App + Vercel proxy). The popup must complete; allow popups for this site if the browser blocks them.
3. Edit the collection you need (see below).
4. Click **Publish** / **Save**. Decap commits to `ABS-Bear/Setvice` `main`.
5. GitHub Actions rebuilds GitHub Pages. Wait 1–2 minutes.
6. Confirm the change on the public site (`https://abs-bear.github.io/Setvice/…`), not only in CMS preview. Hard-refresh if the old page is cached.

Unpublish an article by setting **Статус** to draft (`status: draft`) and publishing that change. Drafts stay in the repo but are not built, listed or added to the sitemap.

## What marketing can change

| Collection | What to edit |
|------------|----------------|
| Направления бизнеса | Three business directions (labels, summaries, order). Keep them separated. |
| Услуги | Service cards: title, text, photo, optional `price` / `priceNote`, order. Add/remove cards as needed. |
| Цены | Legacy home price strip only (`settings/prices.json`). Do not invent stationary prices. Prefer optional service-level `price` / `priceNote` for new pricing. |
| Контакты | Public corporate fields only: brand, region, public phone display/href, public legal line, public site URL. |
| Команда | Team block text and photo. |
| Материалы | Articles: status, title, slug, date, description, optional cover, body, SEO fields. |
| Галерея | Photos, alt text, captions (add / reorder / remove). |
| Главная / Запчасти / Стационарный сервис / Формы / SEO | Page copy and metadata. |

Media uploads go to `public/media` and are stored in content as `/Setvice/media/…`.

## Contacts (`settings/contacts.json`)

Allowed: intentionally public corporate fields only — brand, region, public phone display/href, public legal line, public site URL.

Forbidden: personal data, internal-only hosts/notes, tokens, secrets, chat/user IDs, private phones, or any non-public value. If unsure, leave the field unchanged and ask the owner.

## What marketing must not manage in CMS

- Telegram bot token, chat/internal IDs, or webhook.
- Bitrix24 webhook or OAuth credentials.
- Hosting / Vercel environment variables.
- GitHub organization permissions (ask the owner / contractor).
- Domain DNS.

## Do not edit technical files on github.com

Marketers should not change these without the contractor:

- `api/**`, `package.json`, workflows, `astro.config.*`
- `.github/`, Vercel / env files
- `public/admin/config.yml` (except through an agreed CMS/schema change)
- `robots.txt` / SEO plumbing in `src/pages/`

Use the CMS for content. A raw GitHub.com edit of technical files can break Pages, leads or login.

## Articles

Materials live in `src/content/articles/`.

Only entries with `status: published` are listed, generated and added to the sitemap. Drafts stay in the repository but are not published as article pages.

The included `gate2b-structure-placeholder.md` file is a draft structure placeholder. Replace it with owner-approved facts before switching any article to `published`.

A one-off acceptance-test article (`cms-test`) is **not** in the production content layer.

## Stationary Service

The `/stationary-service/` page uses the approved scope:

- Moscow;
- launch in progress;
- commercial wheeled transport;
- diagnosis, maintenance, repair, complex/aggregate repair;
- prices forming; mixed pricing model;
- soft link to `/parts/`;
- primary CTA `Записаться на диагностику`.

Do not publish logistics, route, timelines, guarantee wording, address or SLA claims, and do not attach stock photos to this page.

## Prices model

- `settings/prices.json` is the **legacy** source for the existing home price strip.
- New CMS pricing edits should use optional service-level `price` / `priceNote`.
- Do not invent or display fabricated stationary prices.

## How publication reaches the site

```text
CMS Publish → commit on ABS-Bear/Setvice main → GitHub Actions → GitHub Pages
```

Typical wait: about one to two minutes after the green **Deploy website to GitHub Pages** workflow. If the workflow fails, the old site stays live; contact the contractor.

## Production auth (operational)

```text
CMS:           https://abs-bear.github.io/Setvice/admin/
backend:       github / ABS-Bear/Setvice / main / publish_mode: simple
base_url:      https://abservice-leads-v2.vercel.app
auth_endpoint: api/cms-auth
```

OAuth callback (already configured on the company GitHub OAuth App):

```text
https://abservice-leads-v2.vercel.app/api/cms-callback
```

`local_backend: true` remains only for local file edits on a developer machine. Production login always uses GitHub.
