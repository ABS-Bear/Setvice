# Handover

## What A New Contractor Receives

- Astro static frontend (Service, Parts, Stationary Service, SEO articles).
- Structured editable content in `src/content/`.
- Decap CMS configuration in `public/admin/` — local schema only; **production auth is not closed**.
- Preserved Vercel Functions backend in `api/` with Telegram webhook secret verification.
- Bitrix24 adapter stub and env names (post-launch / future, disabled).
- Documentation for development, admin, deployment, operations, Telegram CRM and rollback.
- Legacy static files retained for comparison and rollback; the old GitHub Pages zip is archived under `archive/legacy/`.
- Local annotated tag `v1.0.0` on this release commit.

This snapshot is prepared **locally** for `ABS-Bear/Setvice`. It is not pushed, does not change live Vercel or Telegram, and does not retag `v1.0.0`.

## v1.0.0 production state

- Telegram CRM: **active production**.
- Webhook security: **enabled**.
- Production endpoint: `https://abservice-leads-v2.vercel.app/api/lead`.
- Current Vercel production deployment: `dpl_84tMye42AgtbdKoDhwm2fT8EdSEs`.
- Vercel rollback deployment: `dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz`.
- Bitrix24: **post-launch / future**.
- Yandex Metrika: **post-launch / future**.
- CMS production auth: **open handover / release task**.

Do not record tokens, webhook secrets, chat/user IDs, or other credentials in this file.

## First Setup

```bash
npm install
npm run build
npm run verify
npm run test:webhook-security
```

For local frontend work:

```bash
npm run dev
```

For backend work, use the existing Vercel project and configure environment variable **names** documented in `docs/DEPLOYMENT.md` and `docs/TELEGRAM_CRM.md`. Do not commit secret values.

## Required Accesses

The company should own and provide:

- customer GitHub repository `ABS-Bear/Setvice` (source remapped; push not done);
- GitHub Pages settings;
- Vercel project access;
- Telegram bot token;
- Telegram CRM chat/admin access;
- Bitrix24 webhook or OAuth credentials only when that future integration is approved;
- Yandex Metrika counter ID only when analytics is approved;
- domain/DNS access;
- Decap CMS authentication setup (still required — see below).

## Product Status

- Service and parts pages preserve the current production copy, contacts, forms and visual direction.
- Legacy `prices.json` home strip is unchanged; service-level optional price fields exist in CMS only.
- `/stationary-service/` uses approved scope copy (not holding), without stock media or invented prices.
- `/articles/` is a materials feed; drafts are not generated, linked from the index or added to sitemap.
- Telegram CRM is the **only active** lead channel. Production smoke-test (lead + CRM button) is confirmed with webhook security enabled.
- Bitrix24 and Yandex Metrika remain **post-launch / future**.
- `api/callback-v3.js` is a legacy fallback: GET read-only/disabled for webhook mutation; POST requires the webhook secret. Do not point the live webhook at this file.
- `contacts.json` is public corporate content only; personal/internal/secrets are forbidden.

## Risks / TBD

- **CMS production authentication is not closed.** Marketers must not treat `/Setvice/admin/` as a live production CMS.
- Source is remapped to `ABS-Bear/Setvice` and Pages URL `https://abs-bear.github.io/Setvice/`. Push / Pages enablement is still pending.
- Live Vercel CORS still allows the previous Pages origin until a separately approved API deploy of this source.
- Bitrix24 field mapping needs real CRM pipeline details.
- Yandex Metrika goal names should be confirmed with marketing.
- Stationary service still needs owner-approved photos before any media is shown.
- Additional live form tests still create Telegram leads and need owner approval before execution.
- Preview/custom-domain CORS origins must be added before live testing from those origins.
- Vercel must keep `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_INTERNAL_ID` and `TELEGRAM_WEBHOOK_SECRET` or CRM / webhook updates fail closed.
- Do not `GET /api/lead` in production.

## CMS production auth — what to close before handover

Leave this as an explicit open task. Required before the marketer edits production content through Decap:

1. This release is uploaded to `ABS-Bear/Setvice` (separate approval; not done).
2. `public/admin/config.yml` already uses `backend.repo: ABS-Bear/Setvice` and `branch: main`.
3. GitHub OAuth app or Decap-compatible auth gateway is configured for `https://abs-bear.github.io/Setvice/admin/`.
4. Editor accounts have the minimum repository permission to commit content.
5. Decide `publish_mode: simple` vs editorial workflow.
6. Confirm admin remains noindex / robots-disallowed at `/Setvice/admin/`.
7. Do a logged-in CMS publish test on a harmless draft, not on prices or contacts, after auth works.

Until those steps are done, local file edits under `src/content/` remain the safe content path.

## Gate 3C (now in production)

- Local branch: `gate3c-telegram-webhook-security-2026-09-07`.
- Unified endpoint remains `api/lead.js`. Legacy `api/callback-v3.js` POST also requires the webhook secret; GET stays legacy-disabled.
- CRM UX, statuses, reports, frontend copy, `TELEGRAM_BOT_TOKEN`, and Telegram chat/internal IDs are unchanged by this documentation release.
- Offline webhook-secret tests: `npm run test:webhook-security`.

## Separate Confirmation Required

- Push to remote / upload to customer GitHub.
- Merge into main.
- Further production deployment.
- Vercel env or Telegram webhook changes.
- Real Bitrix24 lead sending.
- Enabling Yandex Metrika.
- Enabling production Decap CMS auth.
- Replacing or deleting legacy files.
