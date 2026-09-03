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
```

`npm run build` runs Astro checks before creating the static frontend in `dist/`.
`npm run verify` is a dependency-free post-build check for internal links/assets/base paths and Gate 3A readiness assertions.

## Local Preview

The Astro dev server serves the frontend. In Gate 3A, `src/content/settings/integrations.json` points forms to the deployed Telegram CRM endpoint, so local form tests can create real Telegram leads if the owner approves them.

Do not submit real Telegram leads during visual QA unless the owner explicitly approves a live test.

## Project Structure

- `src/pages/` — routes.
- `src/components/` — Header, Footer, forms and page sections.
- `src/content/` — editable content and collections.
- `src/lib/` — path helpers and analytics.
- `public/` — media, CSS, browser scripts and Decap CMS.
- `api/` — Vercel Functions backend.

## Branch Policy

Gate 3A work happens on `gate3a-telegram-production-readiness-2026-09-03`. Do not push, merge to main, or deploy production without separate confirmation.
