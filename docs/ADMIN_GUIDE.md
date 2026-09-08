# Admin Guide

Decap CMS is prepared under the site base path (`/Setvice/admin/`) for local editing and future production editing. **Production authentication is not enabled.** This is an open handover / release task, not a finished production CMS. Admin is noindex and disallowed in robots with the same base-prefixed paths.

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

Do not treat Decap CMS as production-ready. `local_backend: true` is for local work. GitHub backend is set to `ABS-Bear/Setvice` and has no production OAuth / auth gateway yet.

Before enabling Decap CMS for the marketer in production, close all of the following:

- push this repository to `ABS-Bear/Setvice` (not done yet);
- GitHub OAuth provider or Decap-compatible auth gateway for `https://abs-bear.github.io/Setvice/admin/`;
- final production branch;
- editor GitHub accounts and repository permissions;
- whether editorial workflow is required or `publish_mode: simple` remains acceptable;
- confirm `/Setvice/admin/` stays noindex and robots-disallowed after Pages is enabled.
