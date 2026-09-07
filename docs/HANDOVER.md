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
- Telegram production regression (2026-09-03) is **manually confirmed**: test lead delivered; `Взять в работу` worked. Docs must not record chat/user IDs or contact values.
- `contacts.json` is public corporate content only; personal/internal/secrets are forbidden.

## Gate 3A Risks

- Decap CMS production authentication must be confirmed.
- GitHub Pages base path must match the final repository name.
- Bitrix24 field mapping needs real CRM pipeline details.
- Yandex Metrika goal names should be confirmed with marketing.
- Stationary service still needs owner-approved photos before any media is shown.
- Additional live form tests still create Telegram leads and need owner approval before execution.
- Preview/custom-domain CORS origins must be added before live testing from those origins.
- Vercel must define `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` and `TELEGRAM_INTERNAL_ID` or the API fails closed with 503.
- Gate 3C adds `TELEGRAM_WEBHOOK_SECRET`. Incoming Telegram webhook updates require header `X-Telegram-Bot-Api-Secret-Token`. Ordinary frontend lead POSTs do not send this header.

## Gate 3C Status

- Local branch: `gate3c-telegram-webhook-security-2026-09-07`.
- Unified endpoint remains `api/lead.js`. Legacy `api/callback-v3.js` POST now also requires the webhook secret; GET stays legacy-disabled.
- CRM UX, statuses, reports, frontend copy, `TELEGRAM_BOT_TOKEN`, and Telegram chat/internal IDs are unchanged.
- Production `setWebhook` with `secret_token` is documented in `docs/DEPLOYMENT.md` and is **not** executed in this gate.
- Offline webhook-secret tests: `npm run test:webhook-security`.

## Gate 3C Risks

- Deploying Gate 3C before Telegram `setWebhook` with `secret_token` rejects CRM button updates until that migration runs.
- Routine `install()` on lead submit includes `secret_token` only when `TELEGRAM_WEBHOOK_SECRET` is set; do not treat that as the approved production migration.
- Secret values must never appear in logs, frontend, build, git, or docs.

## Separate Confirmation Required

- Push to remote.
- Merge into main.
- Production deployment.
- Real Bitrix24 lead sending.
- Replacing or deleting legacy files.
