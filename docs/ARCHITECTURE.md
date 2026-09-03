# ABService Architecture AS-IS

Status: Gate 1 draft, 2026-09-03.
Baseline source: `origin/main` at commit `3e12ea43fba2ce48b8a572973e296f394367bb2f` (`3e12ea4`, `Include PNG logo in Pages deploy`, 2026-09-02 12:24:51 +0500).

## Current Production Chain

```text
GitHub repository ArcticBear
  -> GitHub Actions builds a static _site folder
  -> GitHub Pages serves the frontend
  -> frontend forms POST to Vercel /api/lead
  -> /api/lead sends lead cards to Telegram Bot
  -> Telegram group acts as CRM with inline buttons and pinned dashboard
```

Production frontend URL:
`https://alecmonopoly84-hue.github.io/ArcticBear/`

Production backend URL:
`https://abservice-leads-v2.vercel.app/api/lead`

## Frontend

The production site is static HTML/CSS/JS:

- `index.html`: main service page.
- `parts/index.html`: parts page.
- `site.css`: base site styles and responsive layout.
- `parts.css`: parts page styles.
- `parts-promo.css`: parts promo block on the main page.
- `refinement.css`: later visual overrides for navigation, palette, and service hierarchy.
- `site.js`: service form behavior, attachment compression, API submit.
- `parts.js`: parts form behavior, mode switching, attachment compression, API submit.

The Pages workflow copies only selected files into `_site`. New production assets must be added to `.github/workflows/deploy-pages.yml`, or they will exist in the repository but not be published.

## Backend

The active backend entry point is `api/lead.js` on Vercel.

Responsibilities:

- receive service and parts form submissions;
- compress/accept up to two frontend-provided attachments;
- send lead cards into Telegram;
- handle Telegram callback updates;
- update the pinned CRM dashboard;
- set the Telegram webhook to `/api/lead` when called via GET.

`api/callback-v3.js` is still present. It points webhook installation to `/api/callback-v3` and contains older CRM v3 logic. It should be treated as `needs-check` / legacy candidate until the current webhook and rollback requirements are confirmed.

## Telegram CRM

Telegram is used as the operational CRM layer:

- New lead card arrives in the group.
- Manager clicks "take in work".
- Manager marks contacted / no answer.
- Manager closes as success or failure with reason.
- Pinned dashboard stores compact CRM state in message text with the `CRMSTATE:` marker.

No external database is visible in the current repository. CRM state appears to be stored in Telegram message state.

## Data Locations

- Text, services, prices, phone numbers, SEO titles/descriptions: hardcoded in `index.html`, `parts/index.html`, `site.js`, and `parts.js`.
- Visual palette and layout: hardcoded CSS variables and overrides in `site.css`, `parts.css`, `parts-promo.css`, `refinement.css`.
- Public frontend assets: `abservice-logo.png`, `abservice-logo.svg`, `media/*.jpg`, external Unsplash URLs in HTML/CSS.
- Backend constants: public origin, backend URL, Telegram chat identifiers in API files.
- Secrets: `TELEGRAM_BOT_TOKEN` is read from Vercel environment variables and is not present in repository files based on Gate 1 scan.

## Open Architecture Questions

TBD - owner decision: whether ABService should stay as static GitHub Pages + Vercel functions or move to a CMS/admin-backed site.

TBD - owner decision: who owns content edits, prices, photos, legal text, and CRM configuration.

TBD - owner decision: whether Telegram CRM remains the source of truth or becomes only a notification layer behind a database/CRM.
