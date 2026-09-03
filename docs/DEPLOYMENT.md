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
```

Missing required Telegram config fails closed with a safe 503 and must not leak secrets.

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
