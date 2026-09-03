# ABService Deployment Notes

Status: Gate 1 draft, 2026-09-03.

## Production Baseline

Repository:
`alecmonopoly84-hue/ArcticBear`

Production branch:
`main`

Production baseline commit:
`3e12ea43fba2ce48b8a572973e296f394367bb2f`

Production frontend:
`https://alecmonopoly84-hue.github.io/ArcticBear/`

Production backend:
`https://abservice-leads-v2.vercel.app/api/lead`

## Backup / Control Point

Created during Gate 1:

- Local tag: `gate1-production-baseline-2026-09-03`
- Local bundle backup: `outputs/ArcticBear-gate1-production-baseline-2026-09-03.bundle`

The control point references the production baseline commit and does not change production logic.

## GitHub Pages

Deployment is handled by `.github/workflows/deploy-pages.yml`.

Trigger:

- push to `main`;
- manual workflow dispatch.

Build behavior:

- creates `_site/parts` and `_site/media`;
- copies selected HTML, CSS, JS, logo files, and `media/*.jpg`;
- deploys `_site` to GitHub Pages.

Important operational note: the workflow uses an explicit copy list. New file types or new public assets will not publish unless the workflow is updated.

## Vercel Backend

The frontend calls the Vercel endpoint directly from browser JavaScript.

Required environment variable:

- `TELEGRAM_BOT_TOKEN`

Gate 1 repository scan did not find the token value in source control.

TBD - owner decision: who controls Vercel project access, environment variables, domain ownership, and incident response.

TBD - owner decision: whether backend logs should be monitored manually or connected to a formal alerting flow.

## Rollback

Frontend rollback options:

- revert or reset `main` to a known good commit;
- redeploy GitHub Pages from the selected commit;
- restore from the Gate 1 bundle if local repository state is lost.

Backend rollback options:

- redeploy previous Vercel deployment;
- if intentionally retained, inspect `api/callback-v3.js` as possible legacy callback fallback before use.

Do not switch Telegram webhook targets without explicit confirmation, because webhook changes can affect live CRM processing.
