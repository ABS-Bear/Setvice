# Changelog

## v1.0.0 — ABService production release (2026-09-07)

- Astro migration: static frontend from the previous GitHub Pages field-service site, with structured content under `src/content/`.
- Public routes: Service (`/`), Parts (`/parts/`), Stationary Service (`/stationary-service/`).
- SEO articles: `/articles/` materials feed; only `status: published` entries are built or added to the sitemap.
- Decap CMS: local schema and admin config are in place. **Production CMS authentication is not closed** and remains a handover / release task.
- Telegram CRM is the **active production** lead channel at `https://abservice-leads-v2.vercel.app/api/lead`.
- Webhook security is **enabled** in production: Telegram updates require `X-Telegram-Bot-Api-Secret-Token` matching `TELEGRAM_WEBHOOK_SECRET`. Ordinary frontend lead POSTs do not send this header.
- Current Vercel production deployment: `dpl_84tMye42AgtbdKoDhwm2fT8EdSEs`. Known-good Vercel rollback: `dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz`.
- Handover docs: `README.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT.md`, `docs/DEPLOYMENT.md`, `docs/ADMIN_GUIDE.md`, `docs/HANDOVER.md`, `docs/ROLLBACK.md`, `docs/TELEGRAM_CRM.md`, `docs/OPERATIONS.md`.
- Bitrix24 and Yandex Metrika remain **post-launch / future** (disabled).
- This changelog entry is documentation-only relative to Gate 3C code. No site copy, prices, forms, or CRM logic changes.

## v1.0.0 — CORS migration allowlist (2026-09-08)

- Dual frontend CORS allowlist during customer repo cutover; removed after confirmed Setvice Pages smoke-test.

## Post-cutover — single Pages origin (2026-09-08)

- CORS allowlist is only `https://abs-bear.github.io`.
- Previous GitHub Pages origin, `localhost`, and arbitrary origins are rejected. No `*`.

## Gate 3C — Telegram webhook secret (2026-09-07)

- Incoming Telegram webhook updates on `api/lead.js` and legacy `api/callback-v3.js` now require header `X-Telegram-Bot-Api-Secret-Token` matching server env `TELEGRAM_WEBHOOK_SECRET` (timing-safe compare).
- Valid secret accepts the update. Missing or wrong secret returns generic 401. Ordinary frontend lead POSTs continue without this header.
- `TELEGRAM_BOT_TOKEN`, chat/internal IDs, CRM UX, statuses, reports, and frontend content are unchanged.
- `install()` payload builder can include `secret_token` when env is set so a later routine lead submit does not strip it. This gate does **not** call Telegram `setWebhook` and does not change production env or webhook URL.
- Offline tests: valid / missing / wrong secret, ordinary lead POST, callback/update flow. Command: `npm run test:webhook-security`.
- Docs: `docs/DEPLOYMENT.md` (env name + future migration sequence), `docs/HANDOVER.md`, `docs/ROLLBACK.md`.
- No push, fetch, pull, deploy, remote change, or production webhook reinstall.

## Gate 3B — Controlled regression (2026-09-04)

- Offline harness (`/tmp`, fetch fully mocked): 13/13 PASS, zero real network.
- Live form matrix PASS for service, parts, stationary; parts attachment PASS. Browser provider was unavailable, so live payloads used direct POST against the frontend/API contract with the production GitHub Pages Origin.
- One localhost-Origin live POST returned 403 before lead creation (deployed CORS, not a branch defect); three subsequent production-Origin POSTs returned 200.
- Owner manually confirmed Telegram CRM delivery and operator flows (take / contacted / no-answer / success / fail+reason / open / mine / today / week / month / full report).
- Bugfix in this gate: `public/scripts/site.js` submit `finally` no longer overwrites stationary CTA — original button label is saved and restored.
- Webhook target unchanged; no push/merge/deploy; production site and `main` untouched.
- Known residual: Telegram webhook updates on the unified endpoint are not verified via `X-Telegram-Bot-Api-Secret-Token` (separate hardening / env / webhook migration).

## Gate 3A — Telegram production readiness (2026-09-03)

- Stationary service copy moved from holding to approved scope: Moscow launch-in-progress for commercial wheeled transport; diagnosis / maintenance / repair / complex repair; prices forming with mixed pricing; soft `/parts/` link; primary CTA `Записаться на диагностику`; no stock hero/gallery on the stationary page; stationary form without field-location input.
- Articles CMS/schema simplified: published status, title, editable slug, date, description, optional cover, body, SEO title/description; author removed; drafts stay out of build/sitemap; empty articles index may be noindex.
- Services CMS gains optional `price` / `priceNote`; legacy `settings/prices.json` remains the home price-strip source and is unchanged byte-for-byte in this gate.
- SEO/base-path: Header CTA uses `withBase` without double-prefix; robots deny `/admin`; sitemap excludes drafts; canonical/og URLs follow GitHub Pages site URL.
- Telegram: `api/lead.js` remains the unified active endpoint; `api/callback-v3.js` GET is legacy-disabled/read-only (no webhook mutation); POST kept as fallback; chat/internal identifiers read from `TELEGRAM_CHAT_ID` / `TELEGRAM_INTERNAL_ID` with fail-closed 503 when missing.
- Bitrix24 and Yandex Metrika stay future/off.
- Added `CHANGELOG.md`, `docs/ROLLBACK.md`, dependency-free `npm run verify`, and `.gitignore` coverage for `.env.*` (allowing `.env.example`).
- Telegram production regression (2026-09-03) manually confirmed: test lead delivered; `Взять в работу` worked. No chat/user IDs recorded in docs.
- `contacts.json` may contain only intentionally public corporate fields; personal, internal, and secret values are forbidden.

Production push/merge/deploy is intentionally not part of this gate.
