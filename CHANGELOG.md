# Changelog

## Gate 3A — Telegram production readiness (2026-09-03)

- Stationary service copy moved from holding to approved scope: Moscow launch-in-progress for commercial wheeled transport; diagnosis / maintenance / repair / complex repair; prices forming with mixed pricing; soft `/parts/` link; primary CTA `Записаться на диагностику`; no stock hero/gallery on the stationary page; stationary form without field-location input.
- Articles CMS/schema simplified: published status, title, editable slug, date, description, optional cover, body, SEO title/description; author removed; drafts stay out of build/sitemap; empty articles index may be noindex.
- Services CMS gains optional `price` / `priceNote`; legacy `settings/prices.json` remains the home price-strip source and is unchanged byte-for-byte in this gate.
- SEO/base-path: Header CTA uses `withBase` without double-prefix; robots deny `/admin`; sitemap excludes drafts; canonical/og URLs follow GitHub Pages site URL.
- Telegram: `api/lead.js` remains the unified active endpoint; `api/callback-v3.js` GET is legacy-disabled/read-only (no webhook mutation); POST kept as fallback; chat/internal identifiers read from `TELEGRAM_CHAT_ID` / `TELEGRAM_INTERNAL_ID` with fail-closed 503 when missing.
- Bitrix24 and Yandex Metrika stay future/off.
- Added `CHANGELOG.md`, `docs/ROLLBACK.md`, dependency-free `npm run verify`, and `.gitignore` coverage for `.env.*` (allowing `.env.example`).
- Live Telegram regression remains a blocker until an approved test lead is run.

Production push/merge/deploy is intentionally not part of this gate.
