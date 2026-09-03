# Handover

## What A New Contractor Receives

- Astro static frontend.
- Structured editable content in `src/content/`.
- Decap CMS configuration in `public/admin/`.
- Preserved Vercel Functions backend in `api/`.
- Bitrix24 adapter stub and env names (future/off).
- Documentation for development, admin, deployment, operations, Telegram CRM and rollback.
- Legacy static files retained for comparison and rollback; the old GitHub Pages zip is archived under `archive/legacy/`.

## First Setup

```bash
npm install
npm run build
npm run verify
```

For local frontend work:

```bash
npm run dev
```

For backend work, use the existing Vercel project and configure environment variable **names** documented in `docs/DEPLOYMENT.md` and `docs/TELEGRAM_CRM.md`. Do not commit secret values.

## Required Accesses

The company should own and provide:

- GitHub repository access;
- GitHub Pages settings;
- Vercel project access;
- Telegram bot token;
- Telegram CRM chat/admin access;
- Bitrix24 webhook or OAuth credentials only when that future integration is approved;
- Yandex Metrika counter ID only when analytics is approved;
- domain/DNS access;
- Decap CMS authentication setup.

## Gate 3A Status

- Service and parts pages preserve the current production copy, contacts, forms and visual direction.
- Legacy `prices.json` home strip is unchanged; service-level optional price fields exist in CMS only.
- `/stationary-service/` uses approved scope copy (not holding), without stock media or invented prices.
- `/articles/` is a materials feed; drafts are not generated, linked from the index or added to sitemap.
- Telegram CRM remains the **only active** lead channel.
- Bitrix24 and Yandex Metrika remain **future/off**.
- `api/callback-v3.js` is a legacy fallback: GET read-only/disabled for webhook mutation; POST retained until external webhook confirmation.
- Live Telegram regression is a **blocker** until an approved test lead is run.

## Gate 3A Risks

- Decap CMS production authentication must be confirmed.
- GitHub Pages base path must match the final repository name.
- Bitrix24 field mapping needs real CRM pipeline details.
- Yandex Metrika goal names should be confirmed with marketing.
- Stationary service still needs owner-approved photos before any media is shown.
- Live form testing would create Telegram leads and should be approved before execution.
- Preview/custom-domain CORS origins must be added before live testing from those origins.
- Vercel must define `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` and `TELEGRAM_INTERNAL_ID` or the API fails closed with 503.

## Separate Confirmation Required

- Push to remote.
- Merge into main.
- Production deployment.
- Real Bitrix24 lead sending.
- Live Telegram form submission / regression.
- Replacing or deleting legacy files.
