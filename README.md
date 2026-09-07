# ABService

Public website and lead backend for ABService. This repository is the **v1.0.0 production release** snapshot.

- Frontend: static Astro site (Service, Parts, Stationary Service, SEO articles).
- Content: `src/content/` plus Decap CMS config (local / future production editing).
- Leads: Vercel Function Telegram CRM at `/api/lead`.

Do not commit tokens, webhook secrets, `.env` values, chat/user IDs, or other credentials.

## v1.0.0 production state

| Area | Status |
|------|--------|
| Telegram CRM | **Active production** |
| Webhook security | **Enabled** (`X-Telegram-Bot-Api-Secret-Token` vs `TELEGRAM_WEBHOOK_SECRET`) |
| Lead endpoint | `https://abservice-leads-v2.vercel.app/api/lead` |
| Current Vercel production deployment | `dpl_84tMye42AgtbdKoDhwm2fT8EdSEs` |
| Vercel rollback deployment | `dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz` |
| Bitrix24 | Post-launch / future (disabled) |
| Yandex Metrika | Post-launch / future (disabled) |
| Decap CMS production auth | **Not closed** — handover / release task |

Ordinary frontend lead POSTs do not send the Telegram webhook secret header and must keep working without it.

Do **not** open `GET /api/lead` in a browser against production: that path can mutate the Telegram webhook.

## Local commands

```bash
npm install
npm run lint
npm run build
npm run verify
npm run test:webhook-security
npm run dev
```

`npm run build` writes the static frontend to `dist/`. `npm run verify` is a post-build readiness check.

## Documentation

- `docs/ARCHITECTURE.md` — system shape
- `docs/DEVELOPMENT.md` — local development
- `docs/DEPLOYMENT.md` — GitHub Pages frontend + Vercel backend
- `docs/ADMIN_GUIDE.md` — CMS editing rules
- `docs/HANDOVER.md` — contractor handover
- `docs/ROLLBACK.md` — local and production rollback
- `docs/TELEGRAM_CRM.md` — lead / CRM operations
- `docs/OPERATIONS.md` — day-to-day production-safe notes
- `CHANGELOG.md` — release history

## Open before customer GitHub / CMS handover

1. Create the customer-owned GitHub repository (this release is local-only; it is not uploaded yet).
2. Remap `siteUrl`, Astro `base`, Decap `backend.repo`, and GitHub Pages settings to that repository.
3. Close **CMS production auth** (OAuth or compatible gateway, editor accounts, production branch). Until then, marketers should not treat `/admin/` as a production CMS.
4. Keep Bitrix24 and Yandex Metrika off until separately approved.
