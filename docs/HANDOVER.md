# Handover

ABService v1.0.1 is **production-ready** and **handover-ready**. A new contractor should be able to start from this repository and the access registry below within **1–3 days**.

CMS production auth is **operational**. It is not a blocker.

Do not record tokens, webhook secrets, chat/user IDs, client secrets, or passwords in this file.

## What a new contractor receives

- Astro static frontend (Service, Parts, Stationary Service, SEO articles).
- Structured editable content in `src/content/`.
- Decap CMS at `https://abs-bear.github.io/Setvice/admin/` with company-owned GitHub OAuth and a Vercel OAuth proxy (`/api/cms-auth`, `/api/cms-callback`).
- Vercel Functions backend in `api/` with Telegram webhook secret verification.
- Bitrix24 adapter stub and env **names** (post-launch / future, disabled).
- Documentation for development, admin, deployment, operations, Telegram CRM and rollback.
- Legacy static files retained for comparison; the old GitHub Pages zip is under `archive/legacy/`.
- Tags: `v1.0.0` (historical, do not move) and `v1.0.1` (this handover).

## Production state

| Area | Status |
|------|--------|
| GitHub repo owner | Customer organization **ABS-Bear** (`ABS-Bear/Setvice`) |
| Production frontend | `https://abs-bear.github.io/Setvice/` |
| Production Vercel project | `abservice-leads-v2` |
| Current Vercel production | `dpl_9QJvwSs9GsiU2tAyxFTf6tLgvhfw` |
| Vercel rollback | `dpl_F4Umk6QvmjUqhjTXZP7awRuNrTdq` |
| OAuth App | Company-owned GitHub OAuth App on **ABS-Bear** |
| CMS production auth | **Operational** |
| Telegram CRM | **Operational** |
| Bitrix24 | Post-launch / future (disabled) |
| Yandex Metrika | Post-launch / future (disabled) |

Do **not** `GET /api/lead` in production.

## Access registry (no credentials)

| System | Resource | Intended access |
|--------|----------|-----------------|
| GitHub organization | `ABS-Bear` | Customer **Owner** |
| GitHub repository | `ABS-Bear/Setvice` | Customer Owner; contractor **Admin** or **Write** as needed; marketer **Write** only (outside collaborator is enough) |
| GitHub Pages | `https://abs-bear.github.io/Setvice/` | Follows `main` via `.github/workflows/deploy-pages.yml` |
| GitHub OAuth App | Org-owned app on ABS-Bear (CMS login) | Customer/company org admin. Callback: `https://abservice-leads-v2.vercel.app/api/cms-callback` |
| Vercel project | `abservice-leads-v2` | See ownership follow-up below |
| Telegram bot | Company bot used by `/api/lead` | Company Owner; contractor only when rotating token/webhook |
| Telegram CRM group | Company operations chat | Company CRM operators; contractor only for incidents |
| CMS | `https://abs-bear.github.io/Setvice/admin/` | Marketer via GitHub **Write** on `Setvice` |
| Production API | `https://abservice-leads-v2.vercel.app` | Contractor/company ops (Vercel project access) |
| Lead endpoint | `https://abservice-leads-v2.vercel.app/api/lead` | Public POST from customer Pages origin only |

No tokens, client secrets or passwords belong in this table or anywhere in git.

## Vercel ownership follow-up (not a production blocker)

The live project `abservice-leads-v2` is currently in Vercel scope **`alecmonopoly84-2297s-projects`**. That is **not** a customer-owned team.

Production works. Transferring the project (or recreating it) into a customer Vercel team is an **organizational handover follow-up**, not a reason to treat the site as incomplete. Do not invent a completed transfer.

Until that transfer, the contractor can still roll back Vercel (`docs/ROLLBACK.md`) and the company still owns GitHub, Pages, OAuth App and Telegram.

## First setup

```bash
npm install
npm run build
npm run verify
npm run test:webhook-security
npm run test:cors
npm run test:cms-auth
```

For local frontend work: `npm run dev`.

Backend env **names** are in `docs/DEPLOYMENT.md`. Values stay only in Vercel.

## Product status

- Service and parts pages preserve production copy, contacts, forms and visual direction.
- Legacy `prices.json` home strip is unchanged; service-level optional price fields exist in CMS.
- `/stationary-service/` uses approved scope copy, without stock media or invented prices.
- `/articles/` is a materials feed; drafts are not generated, linked from the index or added to sitemap.
- Telegram CRM is the **only active** lead channel. Production smoke-test (lead + CRM button) is confirmed with webhook security enabled.
- CMS acceptance test (GitHub login + harmless publish) **PASS**. The temporary `cms-test` article is **not** in the content layer.
- Bitrix24 and Yandex Metrika remain **post-launch / future**.
- `api/callback-v3.js` is a legacy fallback: GET read-only/disabled for webhook mutation; POST requires the webhook secret. Do not point the live webhook at this file.
- `contacts.json` is public corporate content only; personal/internal/secrets are forbidden.

## Risks / TBD

- Vercel project scope is still contractor-owned (`alecmonopoly84-2297s-projects`) — follow-up transfer.
- Bitrix24 field mapping needs real CRM pipeline details.
- Yandex Metrika goal names should be confirmed with marketing.
- Stationary service still needs owner-approved photos before any media is shown.
- Additional live form tests still create Telegram leads and need owner approval.
- Preview/custom-domain CORS origins must be added before live testing from those origins.
- Vercel must keep `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_INTERNAL_ID`, `TELEGRAM_WEBHOOK_SECRET`, `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` or CRM / CMS login fail closed.
- Do not `GET /api/lead` in production.

## Separate confirmation still required

- Vercel project transfer to a customer-owned team.
- Vercel env or Telegram webhook changes / secret rotation.
- Real Bitrix24 lead sending.
- Enabling Yandex Metrika.
- Replacing or deleting legacy files (`api/callback-v3.js`, root legacy HTML).
- Force-push or moving tag `v1.0.0` (never do this).
