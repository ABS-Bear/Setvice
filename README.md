# ABService

Public website and lead backend for ABService. This repository is the **v1.0.1 production / handover** snapshot.

- **Customer-owned repo:** [`ABS-Bear/Setvice`](https://github.com/ABS-Bear/Setvice)
- **Frontend:** static Astro site on GitHub Pages — [https://abs-bear.github.io/Setvice/](https://abs-bear.github.io/Setvice/)
- **Backend:** Vercel Functions — [https://abservice-leads-v2.vercel.app](https://abservice-leads-v2.vercel.app)
- **CMS:** Decap at [https://abs-bear.github.io/Setvice/admin/](https://abs-bear.github.io/Setvice/admin/) (GitHub login, company-owned OAuth)
- **Leads:** Telegram CRM at `/api/lead` (active production)
- **Bitrix24 adapter:** future / disabled
- **Yandex Metrika:** post-launch / disabled

Do not commit tokens, webhook secrets, `.env` values, chat/user IDs, or other credentials.

## v1.0.1 production state

| Area | Status |
|------|--------|
| Customer GitHub | **ABS-Bear/Setvice** (`main`) |
| GitHub Pages | **Live** — `https://abs-bear.github.io/Setvice/` |
| Telegram CRM | **Active production** |
| Webhook security | **Enabled** (`X-Telegram-Bot-Api-Secret-Token` vs `TELEGRAM_WEBHOOK_SECRET`) |
| Lead endpoint | `https://abservice-leads-v2.vercel.app/api/lead` |
| Current Vercel production | `dpl_9QJvwSs9GsiU2tAyxFTf6tLgvhfw` |
| Vercel rollback | `dpl_F4Umk6QvmjUqhjTXZP7awRuNrTdq` |
| Decap CMS production auth | **Operational** |
| Bitrix24 | Post-launch / future (disabled) |
| Yandex Metrika | Post-launch / future (disabled) |

Ordinary frontend lead POSTs do not send the Telegram webhook secret header and must keep working without it.

Do **not** open `GET /api/lead` in a browser against production: that path can mutate the Telegram webhook.

## Local commands

```bash
npm install
npm run lint
npm run build
npm run verify
npm run test:webhook-security
npm run test:cors
npm run test:cms-auth
npm run dev
```

`npm run build` writes the static frontend to `dist/`. `npm run verify` is a post-build readiness check.

## Documentation

- `docs/ARCHITECTURE.md` — system shape
- `docs/DEVELOPMENT.md` — local development
- `docs/DEPLOYMENT.md` — GitHub Pages frontend + Vercel backend
- `docs/ADMIN_GUIDE.md` — marketer CMS workflow
- `docs/HANDOVER.md` — contractor handover and access registry
- `docs/ROLLBACK.md` — frontend and Vercel rollback
- `docs/TELEGRAM_CRM.md` — lead / CRM operations
- `docs/OPERATIONS.md` — incidents and day-to-day notes
- `CHANGELOG.md` — release history

## Production URLs

| Surface | URL |
|---------|-----|
| Site | `https://abs-bear.github.io/Setvice/` |
| CMS | `https://abs-bear.github.io/Setvice/admin/` |
| API | `https://abservice-leads-v2.vercel.app` |
| Lead | `https://abservice-leads-v2.vercel.app/api/lead` |
| Repo | `https://github.com/ABS-Bear/Setvice` |

Do not use `alecmonopoly84-hue/ArcticBear` as production or canonical remote.

## Follow-ups (not current production blockers)

- Move the Vercel project out of contractor scope `alecmonopoly84-2297s-projects` into a customer-owned Vercel team (see `docs/HANDOVER.md`).
- Keep Bitrix24 and Yandex Metrika off until separately approved.
- Do not change Telegram webhook/env without a separate operations decision.
