# Admin Guide

Decap CMS is prepared under the site base path (`/Setvice/admin/`). Company-owned GitHub OAuth proxy code is ready locally (`/api/cms-auth`, `/api/cms-callback`). **Production OAuth App / env is not configured.** Do not treat `/admin/` as a finished production CMS until Stage 2. Admin is noindex and disallowed in robots with the same base-prefixed paths.

## Contacts (`settings/contacts.json`)

Allowed: intentionally public corporate fields only — brand, region, public phone display/href, public legal line, public site URL.

Forbidden: personal data, internal-only hosts/notes, tokens, secrets, chat/user IDs, private phones, or any non-public value. If unsure, leave the field unchanged and ask the owner.

## What Marketing Can Change

- Contacts, phone text and public site URL (public corporate data only; see above).
- Legacy home price strip in `settings/prices.json` (kept for the existing homepage strip).
- Optional `price` / `priceNote` on individual service cards (CMS-level model; do not invent stationary prices).
- Main page text blocks.
- Parts page text blocks.
- Stationary service approved scope copy.
- Articles landing copy (`settings/articles-page.json`).
- Form text.
- Service cards (add/delete).
- Business directions (three directions stay separated).
- Team block (simple).
- Gallery photos and captions (reorder/add/remove).
- SEO page metadata.
- Materials/articles: published status, title, slug, date, description, optional cover, body, SEO title/description.

## What Marketing Must Not Manage In CMS

- Telegram bot token.
- Telegram CRM chat ID, internal ID or bot webhook.
- Bitrix24 webhook or OAuth credentials.
- Hosting credentials.
- GitHub permissions.
- Domain DNS.
- Vercel environment variables.

## Articles

Materials live in `src/content/articles/`.

Only entries with `status: published` are listed, generated and added to the sitemap. Drafts stay in the repository for CMS/template work, but are not published as article pages.

Cover is optional for unpublished placeholders. Published articles use SEO title/description fallbacks and cover as Open Graph image when present.

The included `gate2b-structure-placeholder.md` file is a draft structure placeholder. Replace it with owner-approved facts before switching any article to `published`.

## Stationary Service

The `/stationary-service/` page uses the approved Gate 3A scope:

- Moscow;
- launch in progress;
- commercial wheeled transport;
- diagnosis, maintenance, repair, complex/aggregate repair;
- prices forming; mixed pricing model;
- soft link to `/parts/`;
- primary CTA `Записаться на диагностику`.

Do not publish logistics, route, timelines, guarantee wording, address or SLA claims, and do not attach stock photos to this page.

## Prices Model

- `settings/prices.json` is the **legacy** source for the existing home price strip. Gate 3A keeps it unchanged.
- New CMS pricing edits should use optional service-level `price` / `priceNote`.
- Do not invent or display fabricated stationary prices.

## Production CMS Auth — open handover / release task

CMS OAuth implementation is ready locally; production OAuth App/env is not configured.

`local_backend: true` remains for local file edits. Production login uses GitHub backend `ABS-Bear/Setvice` / `main` / `publish_mode: simple` through:

```text
base_url: https://abservice-leads-v2.vercel.app
auth_endpoint: api/cms-auth
```

Callback URL for the future GitHub OAuth App:

```text
https://abservice-leads-v2.vercel.app/api/cms-callback
```

Media files are stored in `public/media`. CMS `public_folder` is `/Setvice/media` so newly uploaded images get a production URL under the Astro base path. Existing content that still uses `/media/...` is prefixed by `withBase` in the frontend.

Before Stage 2 / marketer handover, close:

- ABS-Bear GitHub OAuth App (org-owned, not a contractor personal app);
- Vercel env names `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` (values never in git);
- Vercel deploy of the CMS proxy;
- editor GitHub account with Write only on `ABS-Bear/Setvice`;
- confirm `/Setvice/admin/` stays noindex and robots-disallowed.
