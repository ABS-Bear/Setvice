# Deployment

## Frontend

The frontend is static Astro output intended for GitHub Pages.

Build command:

```bash
npm run build
```

Output directory:

```text
dist/
```

The configured public base is `/ArcticBear`, matching the existing GitHub Pages URL.

## Backend

The backend remains Vercel Functions under `api/`.

Required environment variable:

```text
TELEGRAM_BOT_TOKEN
```

Prepared Bitrix24 variables:

```text
BITRIX24_ENABLED=false
BITRIX24_WEBHOOK_URL=
BITRIX24_ASSIGNED_BY_ID=
BITRIX24_CATEGORY_ID=
```

Bitrix24 must remain disabled until credentials and a separate integration approval are provided.

## CMS

Decap CMS uses GitHub as backend and is configured in `public/admin/config.yml`.

Before production use, confirm:

- final GitHub repository name;
- production branch;
- authentication/provider setup for Decap CMS;
- editor access for the marketer.

## Analytics

Yandex Metrika ID is currently `TBD` in `src/content/settings/integrations.json`. No external analytics call is made until a numeric ID is configured.

## Production Safeguard

Gate 2B does not push, merge or deploy. Production changes require separate confirmation.
