# Operations

## Current Production-Safe State

- Frontend: static Astro build for GitHub Pages.
- Active lead channel: Telegram CRM through `https://abservice-leads-v2.vercel.app/api/lead`.
- Frontend forms POST leads only; do not use browser page-load GET to activate or install the Telegram webhook.
- Backend: Vercel Function at `api/lead.js`.
- Legacy fallback: `api/callback-v3.js` (GET legacy-disabled/read-only; POST retained until webhook check).
- Bitrix24: future/off, disabled by default.
- Yandex Metrika: future/off, disabled until a real counter ID is provided.
- CMS: Decap CMS config exists for local validation and future production use.
- Live Telegram regression: **blocker** until owner-approved test lead.

## Daily Content Work

Use Decap CMS locally or edit files under `src/content/`. The content layer is the source of truth for phone, contacts, legacy home prices, optional service-level price fields, service text, parts text, stationary-service scope copy, articles landing copy, business directions, SEO metadata and article status.

Do not edit generated `dist/` files by hand.

## Lead Handling

All public forms submit to the Telegram CRM endpoint. Telegram buttons keep the existing flow:

1. `Взять в работу`
2. `Связались` or `Не дозвонились`
3. `Успех` or `Неуспех`

The `/report` command is handled by the same Telegram CRM backend.

## Release Safeguards

Production/main is not changed by Gate 3A. These actions require separate confirmation:

- push to remote;
- merge into `main`;
- deploy production;
- enable Bitrix24;
- enable Yandex Metrika;
- enable production Decap CMS auth;
- delete or replace legacy backend files.

## Legacy State

- `api/callback-v3.js` stays in place as legacy fallback until the active Telegram webhook is checked externally.
- `archive/legacy/github-pages-field-service.zip` keeps the old GitHub Pages package out of the project root without deleting it.

See `docs/ROLLBACK.md` for local rollback guidance. Production rollback requires a separate deploy and is not performed in Gate 3A.
