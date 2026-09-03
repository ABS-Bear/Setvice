# Development

## Requirements

- Node.js 20+ is recommended.
- Install dependencies with `npm install`.

## Local Commands

```bash
npm run dev
npm run lint
npm run build
```

`npm run build` runs Astro checks before creating the static frontend in `dist/`.

## Local Preview

The Astro dev server serves the frontend. In local development, `/api/lead` may not exist unless the Vercel backend is run separately or `src/content/settings/integrations.json` points to the deployed Vercel Function.

Do not submit real Telegram leads during visual QA unless the owner explicitly approves a live test.

## Project Structure

- `src/pages/` — routes.
- `src/components/` — Header, Footer, forms and page sections.
- `src/content/` — editable content and collections.
- `src/lib/` — path helpers and analytics.
- `public/` — media, CSS, browser scripts and Decap CMS.
- `api/` — Vercel Functions backend.

## Branch Policy

Gate 2B work happens on `gate2b-target-architecture-migration-2026-09-03`. Do not push, merge to main, or deploy production without separate confirmation.
