# Deployment

## Frontend

The frontend is static Astro output intended for GitHub Pages.

Build command:

```bash
npm run build
npm run verify
```

Output directory:

```text
dist/
```

The configured public URL is read from `src/content/settings/contacts.json` (`siteUrl`). Target GitHub Pages:

```text
https://abs-bear.github.io/Setvice/
```

Repository: `ABS-Bear/Setvice`. Astro `base` is `/Setvice`. Workflow: `.github/workflows/deploy-pages.yml` (push to `main` or `workflow_dispatch`). Local source is remapped; the customer remote is **not connected or pushed yet**.

## Backend — current production (v1.0.0)

The backend remains Vercel Functions under `api/`. Telegram CRM is **active production**. Webhook security is **enabled**.

Active public lead endpoint:

```text
https://abservice-leads-v2.vercel.app/api/lead
```

Current Vercel production deployment:

```text
dpl_84tMye42AgtbdKoDhwm2fT8EdSEs
```

Known-good Vercel rollback deployment (pre-Gate 3C production):

```text
dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz
```

Required environment variable **names** (values stay only in Vercel; never in docs or git):

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_INTERNAL_ID
TELEGRAM_WEBHOOK_SECRET
```

Missing `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` or `TELEGRAM_INTERNAL_ID` fails closed with a safe 503 and must not leak secrets.

`TELEGRAM_WEBHOOK_SECRET` is required for incoming Telegram webhook updates (`callback_query` / `message` / `update_id`). The handler checks `X-Telegram-Bot-Api-Secret-Token` with a timing-safe compare. Valid secret accepts the update. Missing or wrong secret returns a generic 401. Ordinary frontend lead POSTs do **not** send this header and must keep working without it.

Do not put `TELEGRAM_WEBHOOK_SECRET` in frontend config, Decap CMS, git, build output, logs, or documentation values. Telegram accepts `secret_token` of 1–256 characters in `[A-Za-z0-9_-]`.

Do **not** open `GET /api/lead` in a browser against production: `install()` can call Telegram `setWebhook` and change the live webhook. Do not retarget the webhook to `/api/callback-v3`.

This v1.0.0 documentation commit does **not** change Vercel, Telegram env, or the webhook.

## Gate 3C webhook migration (completed)

The production webhook secret is already synchronized between Vercel and Telegram. Gate 3C code is live on `dpl_84tMye42AgtbdKoDhwm2fT8EdSEs`. Manual production smoke-test (lead + CRM button) is confirmed.

Historical safest order (do not repeat unless a future secret rotation is separately approved):

1. Generate a secret locally. Store it only in a password manager and Vercel. Never commit, log, chat, or document the value.
2. Set Vercel `TELEGRAM_WEBHOOK_SECRET` on the existing production project. Do **not** change `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, or `TELEGRAM_INTERNAL_ID`.
3. Call Telegram `setWebhook` once with the **same** URL `https://abservice-leads-v2.vercel.app/api/lead`, the same `allowed_updates` (`callback_query`, `message`), and `secret_token` equal to `TELEGRAM_WEBHOOK_SECRET`.
4. Deploy the Gate 3C `/api/lead` function.
5. Confirm one CRM button update is accepted. Frontend lead POST must still work without the header.

If Gate 3C code is live while Telegram is not sending the header, webhook updates are rejected until `setWebhook` with `secret_token` is completed. Lead forms still work in that window.

After env is set, the existing server-side `install()` path includes `secret_token` so a later routine lead submit does not strip the secret.

## Bitrix24 (post-launch / future)

Prepared Bitrix24 variables (must stay disabled):

```text
BITRIX24_ENABLED=false
BITRIX24_WEBHOOK_URL=
BITRIX24_ASSIGNED_BY_ID=
BITRIX24_CATEGORY_ID=
```

Bitrix24 must remain disabled until credentials and a separate integration approval are provided.

## CORS

Source CORS allows only the customer Pages origin (`api/lib/cors-origins.js`). No `*`.

```text
https://abs-bear.github.io
```

`localhost` / `127.0.0.1`, the previous GitHub Pages origin, and any other origin are rejected (lead POST returns 403). Telegram webhook requests without `Origin` are still accepted. Do not add preview or custom-domain origins without a deliberate change.

`api/callback-v3.js` is legacy fallback: GET returns legacy-disabled/read-only status and does not mutate webhooks; POST requires the webhook secret. Do not rely on browser page-load GET against `/api/lead` for webhook activation; keep that server-side.

Local `.env.example` may list empty placeholders for `TELEGRAM_CHAT_ID`, `TELEGRAM_INTERNAL_ID` and `TELEGRAM_WEBHOOK_SECRET` (names only). Real values stay in Vercel only.

## CMS

Decap CMS uses the GitHub backend in `public/admin/config.yml` (`ABS-Bear/Setvice`, `main`, `publish_mode: simple`).

CMS OAuth implementation is ready locally; production OAuth App/env is not configured. The isolated proxy endpoints are:

```text
https://abservice-leads-v2.vercel.app/api/cms-auth
https://abservice-leads-v2.vercel.app/api/cms-callback
```

Prepared Vercel env **names** (empty in `.env.example`; values only in Vercel later):

```text
GITHUB_OAUTH_CLIENT_ID
GITHUB_OAUTH_CLIENT_SECRET
```

Do not put those values in git, frontend, or Decap config. The proxy is separate from `/api/lead` and must not use `TELEGRAM_*`. CMS browser Origin is only `https://abs-bear.github.io` (no `*`).

Stage 2 still needs: org-owned GitHub OAuth App, Vercel env, proxy deploy, editor Write access. Do not describe `/admin/` as production-ready until those are done.

## Analytics

Yandex Metrika is **post-launch / future**. It is disabled in `src/content/settings/integrations.json`. Keep the ID as `TBD` until the owner provides the real counter and confirms goal names.

## Production Safeguard

v1.0.0 does not push, fetch, pull, upload to customer GitHub, or change Vercel / Telegram. Further production changes require separate confirmation. See `docs/ROLLBACK.md`.
