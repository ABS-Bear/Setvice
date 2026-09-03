# ABService Development Notes

Status: Gate 1 draft, 2026-09-03.

## Baseline

Current production baseline is `origin/main` commit:

`3e12ea43fba2ce48b8a572973e296f394367bb2f`

A local audit worktree was created from `origin/main` to avoid mixing Gate 1 documentation with the older dirty local `main` worktree.

## Repository Inventory

Production files:

- `index.html`
- `parts/index.html`
- `site.css`
- `parts.css`
- `parts-promo.css`
- `refinement.css`
- `site.js`
- `parts.js`
- `abservice-logo.png`
- `abservice-logo.svg`
- `media/hero-abservice.jpg`
- `media/diag-repair-abservice.jpg`
- `media/closeup-service-abservice.jpg`
- `media/field-service-abservice.jpg`
- `media/team-abservice.jpg`
- `.github/workflows/deploy-pages.yml`

Production backend files:

- `api/lead.js`: active unified lead intake and Telegram CRM handler.

Needs-check / legacy candidates:

- `api/callback-v3.js`: older callback handler with duplicated CRM logic and webhook target `/api/callback-v3`.
- `github-pages-field-service.zip`: archive of an older Next.js/static export source; not used by the current Pages workflow.
- `abservice-logo.svg`: still copied by the Pages workflow, but current HTML uses `abservice-logo.png`.

Duplicate / overlap candidates:

- `site.js` and `parts.js` both contain attachment compression and API submit logic.
- `api/lead.js` and `api/callback-v3.js` share most CRM callback/reporting logic.
- Some external Unsplash URLs are reused between service cards, gallery, and CSS backgrounds.

Temporary files:

- None in the production worktree at Gate 1 baseline.
- The older local worktree from 2026-09-02 has uncommitted files from previous work and should not be used as production truth without manual reconciliation.

## Local Validation

This repository currently has no `package.json` at the production root. Local checks are therefore simple static checks, not a full app build.

Recommended checks before any production change:

```bash
git status --short --branch
node --check site.js
node --check parts.js
node --check api/lead.js
node --check api/callback-v3.js
```

For visual checks, serve the directory locally and inspect:

- `/`
- `/parts/`
- desktop width;
- mobile width around 390 px;
- no horizontal scroll;
- visible phone CTA;
- forms still submit to `/api/lead`.

## Development Rules Until Gate 2

- Do not delete files until owner confirms cleanup.
- Do not change prices, phone numbers, forms, Telegram CRM logic, or Vercel env variables without explicit confirmation.
- Treat `api/lead.js` as the active backend source.
- Treat `api/callback-v3.js` as retained rollback/legacy code until verified otherwise.
- Add future public assets to the Pages workflow copy list.

TBD - owner decision: desired CMS/admin workflow.

TBD - owner decision: design scope after feedback questions are answered.
