# Operations

## Current production-safe state

- Frontend: GitHub Pages `https://abs-bear.github.io/Setvice/` from customer `main`.
- Active lead channel: Telegram CRM through `https://abservice-leads-v2.vercel.app/api/lead`.
- Webhook security: **enabled**.
- CMS: production admin at `https://abs-bear.github.io/Setvice/admin/` — GitHub login, **operational**.
- Current Vercel production: `dpl_9QJvwSs9GsiU2tAyxFTf6tLgvhfw`.
- Vercel rollback: `dpl_F4Umk6QvmjUqhjTXZP7awRuNrTdq`.
- CORS allows only `https://abs-bear.github.io`. Previous Pages origin and localhost are rejected. No `*`.
- Bitrix24: post-launch / future, disabled.
- Yandex Metrika: post-launch / future, disabled.
- Do **not** `GET /api/lead` in production.

## Critical incidents

Treat as critical: site down, forms not submitting, Telegram CRM buttons / reports failing.

1. Notify the head of the direction **and** the contractor.
2. Check GitHub Pages workflow on `ABS-Bear/Setvice` `main`.
3. Check Vercel deployment `abservice-leads-v2` is Ready and aliased to `https://abservice-leads-v2.vercel.app`.
4. Do not rotate Telegram or OAuth secrets during the first response unless that is the confirmed cause.
5. Rollback is available to the company and the contractor — see `docs/ROLLBACK.md` (frontend via revert + Pages; backend via Vercel promotion).

## CMS marketer workflow

Daily content: `https://abs-bear.github.io/Setvice/admin/` → Login with GitHub → edit → Publish. That creates a commit on `main` and a Pages rebuild. Details: `docs/ADMIN_GUIDE.md`.

Do not use Vercel, Telegram, Cursor or Terminal for ordinary copy/photo updates.

## Change history

Git on `ABS-Bear/Setvice` and `CHANGELOG.md` are the change history. Tag `v1.0.1` marks this handover. Do not move `v1.0.0`.

## Quarterly checks

- **Dependency review:** `npm audit` / Astro and Vercel CLI currency; apply patches on a branch, not directly on production env.
- **Health check:** Pages 200; admin 200 + noindex; one owner-approved lead + CRM button (creates a real Telegram lead); CMS login still works; CORS still only customer Pages.

## Lead handling

All public forms submit to the Telegram CRM endpoint. Telegram buttons keep the existing flow:

1. `Взять в работу`
2. `Связались` or `Не дозвонились`
3. `Успех` or `Неуспех`

The `/report` command is handled by the same Telegram CRM backend.

## Release safeguards

These still need a separate decision:

- Vercel env or Telegram webhook changes;
- enable Bitrix24;
- enable Yandex Metrika;
- transfer Vercel project to a customer-owned team;
- delete or replace legacy backend files;
- force-push or retag `v1.0.0`.

## Legacy state

- `api/callback-v3.js` stays as legacy fallback. Do not point the live webhook at it.
- `archive/legacy/github-pages-field-service.zip` keeps the old GitHub Pages package.

See `docs/ROLLBACK.md` and `docs/HANDOVER.md`.
