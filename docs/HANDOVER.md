# ABService Handover Draft

Status: Gate 1 draft, 2026-09-03.

## Baseline

Production source of truth:

- repository: `alecmonopoly84-hue/ArcticBear`;
- branch: `main`;
- commit: `3e12ea43fba2ce48b8a572973e296f394367bb2f`;
- frontend: `https://alecmonopoly84-hue.github.io/ArcticBear/`;
- backend: `https://abservice-leads-v2.vercel.app/api/lead`.

Gate 1 control point:

- local tag: `gate1-production-baseline-2026-09-03`;
- local bundle: `outputs/ArcticBear-gate1-production-baseline-2026-09-03.bundle`.

## What A New Contractor Must Know

- Do not treat the older local `main` worktree as clean production state without reconciliation.
- Use `origin/main` baseline above or a fresh clone for new work.
- The live site is static GitHub Pages, not a running frontend server.
- The live backend is Vercel function `/api/lead`.
- Telegram CRM is production-critical.
- Do not rotate, expose, or paste the bot token.
- Do not delete `api/callback-v3.js` or `github-pages-field-service.zip` until owner confirms cleanup and rollback needs.

## File Classification

Production:

- `index.html`
- `parts/index.html`
- `site.css`
- `parts.css`
- `parts-promo.css`
- `refinement.css`
- `site.js`
- `parts.js`
- `abservice-logo.png`
- `media/*.jpg`
- `.github/workflows/deploy-pages.yml`

Production backend:

- `api/lead.js`

Needs-check:

- `api/callback-v3.js`
- `abservice-logo.svg`

Archive:

- `github-pages-field-service.zip`

Duplicate candidates:

- frontend attachment submit logic in `site.js` and `parts.js`;
- CRM state and reporting logic in `api/lead.js` and `api/callback-v3.js`;
- reused external Unsplash images.

Temporary:

- none in the clean Gate 1 worktree.

## Owner Decisions Still Needed

- Who is responsible for approving site changes?
- Who will update content after launch: contractor, employee, or both?
- Is an admin panel needed?
- Which content must be editable without a programmer?
- Should changes require approval before publishing?
- Is the current design accepted as baseline?
- Which photos are real ABService assets and which should be replaced?
- Are current prices final?
- What legal requisites and personal data policy should be published?
- Should Telegram CRM remain enough, or should leads also be stored elsewhere?

## Suggested Gate 2 Scope

1. Reconcile local dirty worktree vs `origin/main`.
2. Confirm active Vercel project and environment ownership.
3. Verify live Telegram webhook target without exposing token.
4. Decide whether to archive or remove `callback-v3` and the old zip.
5. Add missing SEO/legal basics after owner approval.
6. Prepare content layer or CMS decision based on owner answers.
