# Development

## Requirements

- Node.js 20+ is recommended.
- Install dependencies with `npm install`.

## Local Commands

```bash
npm run dev
npm run lint
npm run build
npm run verify
npm run test:webhook-security
npm run test:cors
npm run test:cms-auth
```

`npm run build` runs Astro checks before creating the static frontend in `dist/`.
`npm run verify` is a dependency-free post-build check for internal links/assets/base paths and production readiness assertions.
`npm run test:webhook-security` is an offline, mocked check of Telegram webhook secret verification (19 cases). It does not call Telegram or Vercel.
`npm run test:cors` checks the production CORS allowlist: customer Pages origin allowed; previous Pages origin, localhost, and arbitrary origins rejected.
`npm run test:cms-auth` is an offline, mocked check of the company-owned CMS OAuth proxy. It does not call GitHub, Vercel, or Telegram.

## Local Preview

The Astro dev server serves the frontend. `src/content/settings/integrations.json` points forms to the deployed Telegram CRM endpoint, so local form tests can create real Telegram leads if the owner approves them. A browser `Origin` of `localhost` / `127.0.0.1` is **rejected** by the lead API (403). Live form tests must use `https://abs-bear.github.io`.

Do not submit real Telegram leads during visual QA unless the owner explicitly approves a live test.

Do not call `GET /api/lead` from the browser against production. That path can mutate the Telegram webhook.

## Project Structure

- `src/pages/` — routes.
- `src/components/` — Header, Footer, forms and page sections.
- `src/content/` — editable content and collections.
- `src/lib/` — path helpers and analytics.
- `public/` — media, CSS, browser scripts and Decap CMS.
- `api/` — Vercel Functions backend.

## Branch Policy

v1.0.0 release prep lives on `gate3c-telegram-webhook-security-2026-09-07`. Do not push, fetch, pull, merge to main, upload to a customer GitHub, or deploy production without separate confirmation.
