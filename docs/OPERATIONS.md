# Operations

## Current Production-Safe State

- Frontend: static Astro build for GitHub Pages.
- Active lead channel: Telegram CRM through `https://abservice-leads-v2.vercel.app/api/lead`.
- Webhook security: **enabled** (`X-Telegram-Bot-Api-Secret-Token` vs `TELEGRAM_WEBHOOK_SECRET`).
- Current Vercel production deployment: `dpl_84tMye42AgtbdKoDhwm2fT8EdSEs`.
- Vercel rollback deployment: `dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz`.
- Frontend forms POST leads only; do not use browser page-load GET to activate or install the Telegram webhook. Do **not** `GET /api/lead` in production.
- Backend: Vercel Function at `api/lead.js`.
- Legacy fallback: `api/callback-v3.js` (GET legacy-disabled/read-only; POST requires webhook secret).
- Bitrix24: post-launch / future, disabled by default.
- Yandex Metrika: post-launch / future, disabled until a real counter ID is provided.
- CMS: Decap CMS config exists for local validation. **Production CMS authentication is not enabled.**
- v1.0.0 / Gate 3C production smoke-test (2026-09-07): **manually confirmed** — lead arrives; CRM button works. No chat/user IDs in docs.

## Daily Content Work

Use Decap CMS **locally** or edit files under `src/content/`. Do not treat production `/admin/` as authenticated until the CMS handover task is closed.

The content layer is the source of truth for phone, contacts, legacy home prices, optional service-level price fields, service text, parts text, stationary-service scope copy, articles landing copy, business directions, SEO metadata and article status.

`src/content/settings/contacts.json` must hold only intentionally public corporate data (brand, region, public phone display/href, public legal line, public `siteUrl`). Personal, internal, and secret values are forbidden.

Do not edit generated `dist/` files by hand.

## Lead Handling

All public forms submit to the Telegram CRM endpoint. Telegram buttons keep the existing flow:

1. `Взять в работу`
2. `Связались` or `Не дозвонились`
3. `Успех` or `Неуспех`

The `/report` command is handled by the same Telegram CRM backend.

## Release Safeguards

v1.0.0 is a local release snapshot. These actions require separate confirmation:

- push to remote / upload to customer GitHub;
- merge into `main`;
- further production deploy;
- change Vercel env or Telegram webhook;
- enable Bitrix24;
- enable Yandex Metrika;
- enable production Decap CMS auth;
- delete or replace legacy backend files.

## Legacy State

- `api/callback-v3.js` stays in place as legacy fallback. Do not point the live webhook at it.
- `archive/legacy/github-pages-field-service.zip` keeps the old GitHub Pages package out of the project root without deleting it.

See `docs/ROLLBACK.md` for local and Vercel rollback guidance.
