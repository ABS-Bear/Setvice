# Changelog

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
