# Deployment

## Frontend chain

```text
customer main (ABS-Bear/Setvice)
  → GitHub Actions (.github/workflows/deploy-pages.yml)
  → GitHub Pages
  → https://abs-bear.github.io/Setvice/
```

Build command:

```bash
npm run build
npm run verify
```

Output directory:

```text
dist/
```

Public URL comes from `src/content/settings/contacts.json` (`siteUrl`):

```text
https://abs-bear.github.io/Setvice/
```

Astro `base` is `/Setvice`. Workflow triggers: push to `main` or `workflow_dispatch`.

Do not use `alecmonopoly84-hue/ArcticBear` as a production remote.

## Backend chain

```text
local / customer source
  → Vercel production project abservice-leads-v2
  → https://abservice-leads-v2.vercel.app
```

Telegram CRM is **active production**. Webhook security is **enabled**.

Active public lead endpoint:

```text
https://abservice-leads-v2.vercel.app/api/lead
```

Current Vercel production deployment:

```text
dpl_9QJvwSs9GsiU2tAyxFTf6tLgvhfw
```

Vercel rollback deployment:

```text
dpl_F4Umk6QvmjUqhjTXZP7awRuNrTdq
```

A docs-only or content-only frontend commit does **not** require a new Vercel deploy.

## Backend env names

Values stay only in Vercel; never in docs or git:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_INTERNAL_ID
TELEGRAM_WEBHOOK_SECRET
GITHUB_OAUTH_CLIENT_ID
GITHUB_OAUTH_CLIENT_SECRET
```

Missing Telegram token / chat / internal ID fails closed with a safe 503 and must not leak secrets.

`TELEGRAM_WEBHOOK_SECRET` is required for incoming Telegram webhook updates (`callback_query` / `message` / `update_id`). The handler checks `X-Telegram-Bot-Api-Secret-Token` with a timing-safe compare. Valid secret accepts the update. Missing or wrong secret returns a generic 401. Ordinary frontend lead POSTs do **not** send this header and must keep working without it.

Do not put secrets in frontend config, Decap CMS, git, build output, logs, or documentation values.

Do **not** open `GET /api/lead` in a browser against production: `install()` can call Telegram `setWebhook` and change the live webhook. Do not retarget the webhook to `/api/callback-v3`.

## CMS OAuth endpoints

```text
https://abservice-leads-v2.vercel.app/api/cms-auth
https://abservice-leads-v2.vercel.app/api/cms-callback
```

Decap `public/admin/config.yml`:

```text
backend.name: github
backend.repo: ABS-Bear/Setvice
branch: main
base_url: https://abservice-leads-v2.vercel.app
auth_endpoint: api/cms-auth
publish_mode: simple
public_folder: /Setvice/media
```

The proxy uses only `GITHUB_OAUTH_*`. It must not use `TELEGRAM_*`. CMS browser Origin is only `https://abs-bear.github.io` (no `*`).

## Gate 3C webhook (already live)

The production webhook secret is synchronized between Vercel and Telegram. Do not repeat `setWebhook` unless a future secret rotation is separately approved.

Historical order (rotation only):

1. Generate a secret locally. Store it only in a password manager and Vercel.
2. Set Vercel `TELEGRAM_WEBHOOK_SECRET`. Do **not** change `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, or `TELEGRAM_INTERNAL_ID`.
3. Call Telegram `setWebhook` once with URL `https://abservice-leads-v2.vercel.app/api/lead`, `allowed_updates` `callback_query` + `message`, and `secret_token` equal to the env value.
4. Confirm one CRM button update is accepted. Frontend lead POST must still work without the header.

## Bitrix24 (post-launch / future)

Prepared variables (must stay disabled):

```text
BITRIX24_ENABLED=false
BITRIX24_WEBHOOK_URL=
BITRIX24_ASSIGNED_BY_ID=
BITRIX24_CATEGORY_ID=
```

## CORS

Source CORS allows only the customer Pages origin (`api/lib/cors-origins.js`). No `*`.

```text
https://abs-bear.github.io
```

`localhost` / `127.0.0.1`, the previous GitHub Pages origin, and any other origin are rejected (lead POST returns 403). Telegram webhook requests without `Origin` are still accepted.

`api/callback-v3.js` is legacy fallback: GET returns legacy-disabled/read-only status and does not mutate webhooks; POST requires the webhook secret.

Local `.env.example` lists empty placeholders (names only). Real values stay in Vercel only.

## Analytics

Yandex Metrika is **post-launch / future**. It is disabled in `src/content/settings/integrations.json`. Keep the ID as `TBD` until the owner provides the real counter and confirms goal names.

## Production safeguard

Do not force-push `main`. Do not move tag `v1.0.0`. Further Vercel env or Telegram webhook changes require a separate operations decision. See `docs/ROLLBACK.md`.
