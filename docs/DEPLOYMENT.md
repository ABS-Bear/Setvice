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

The configured public URL is read from `src/content/settings/contacts.json` (`siteUrl`). For the current GitHub Pages domain it resolves to `/ArcticBear`.

## Backend

The backend remains Vercel Functions under `api/`. The active public lead endpoint is:

```text
https://abservice-leads-v2.vercel.app/api/lead
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

## Future Telegram webhook secret migration (NOT executed in Gate 3C)

Do not run this until the owner separately approves a production webhook change. This gate does not call Telegram `setWebhook`, does not change the webhook URL, and does not write production env.

Safest order (old function still deployed for steps 1–3):

1. Generate a secret locally. Store it only in a password manager and Vercel. Never commit, log, chat, or document the value.
2. Set Vercel `TELEGRAM_WEBHOOK_SECRET` on the existing production project. Do **not** change `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, or `TELEGRAM_INTERNAL_ID`.
3. After explicit approval, call Telegram `setWebhook` once with the **same** current URL `https://abservice-leads-v2.vercel.app/api/lead`, the same `allowed_updates` (`callback_query`, `message`), and `secret_token` equal to `TELEGRAM_WEBHOOK_SECRET`. Pre-Gate 3C code ignores the header, so CRM buttons keep working.
4. Deploy the Gate 3C `/api/lead` function (separate deploy approval).
5. Confirm one CRM button update is accepted. Frontend lead POST must still work without the header.
6. Do not retarget the webhook to `/api/callback-v3`. Do not use a browser `GET /api/lead` as the migration tool.

If Gate 3C is deployed before step 3, Telegram will not send the header and webhook updates will be rejected until `setWebhook` with `secret_token` is completed. Lead forms still work in that window.

After env is set, the existing server-side `install()` path includes `secret_token` so a later routine lead submit does not strip the secret. That is defensive, not the approved migration trigger.

Prepared Bitrix24 variables (future/off):

```text
BITRIX24_ENABLED=false
BITRIX24_WEBHOOK_URL=
BITRIX24_ASSIGNED_BY_ID=
BITRIX24_CATEGORY_ID=
```

Bitrix24 must remain disabled until credentials and a separate integration approval are provided.

CORS currently allows the GitHub Pages origin and local development origins (`localhost` / `127.0.0.1`). Telegram webhook requests without `Origin` are accepted by the lead POST path. Do not use `*`. Add preview or custom-domain origins deliberately before using them for live form tests.

`api/callback-v3.js` is legacy fallback: GET returns legacy-disabled/read-only status and does not mutate webhooks; POST remains until external webhook confirmation. Do not rely on browser page-load GET against `/api/lead` for webhook activation; keep that server-side.

Local `.env.example` may list empty placeholders for `TELEGRAM_CHAT_ID` and `TELEGRAM_INTERNAL_ID` (names only). Real values stay in Vercel only.

## CMS

Decap CMS uses GitHub as backend and is configured in `public/admin/config.yml`. Gate 3A validates the local schema only; production CMS auth is not enabled.

Before production use, confirm:

- final GitHub repository name;
- production branch;
- GitHub OAuth provider or compatible auth gateway;
- editor access for the marketer;
- whether simple publishing is acceptable or editorial workflow is required.

## Analytics

Yandex Metrika is disabled in `src/content/settings/integrations.json`. Keep the ID as `TBD` until the owner provides the real counter and confirms goal names.

## Production Safeguard

Gate 3A does not push, merge or deploy. Production changes require separate confirmation. See `docs/ROLLBACK.md`.
