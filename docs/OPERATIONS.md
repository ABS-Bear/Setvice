# ABService Operations

Status: Gate 1 draft, 2026-09-03.

## What Is Live

- Static frontend on GitHub Pages.
- Lead and CRM backend on Vercel.
- Telegram group as operational CRM.
- One public phone number across pages and form status messages.
- Two site sections: Service and Parts.

## Routine Checks

Daily or after each change:

- Open main page and parts page.
- Check phone links.
- Check no obvious layout break on mobile.
- Confirm forms still point to `/api/lead`.
- Confirm Telegram CRM pult remains pinned and readable.

Before testing live forms:

- Warn the team that a test lead may appear in Telegram.
- Mark the test lead clearly as test.
- Close the test lead so reporting is not distorted.

## Content Inventory

Phone:

- One public phone number appears across both pages and fallback status messages.

Prices:

- Service call within MKAD.
- Service call plus primary diagnostics.
- Outside MKAD per-km surcharge.

Services:

- Diagnostics and repair.
- Field repair.
- Technical maintenance.
- Parts selection and supply.
- Parts plus installation.

Geography:

- Moscow and Moscow region are named repeatedly.
- MKAD pricing logic is visible in the price block.

Team / trust:

- "Service team ABService" section.
- Claims are general: multibrand service, on-site work, photo before visit, fleet service.
- No named employees or credentials are currently listed.

Images:

- Current repository media folder contains five small JPG files.
- Current HTML/CSS also uses external Unsplash image URLs.
- Logo is PNG in active HTML; SVG logo is retained and copied by deploy workflow.

SEO:

- Main page has title and meta description.
- Parts page has title and meta description.
- No committed static `robots.txt` or `sitemap.xml` exists in the production root.
- No visible canonical or Open Graph tags in current HTML.

Legal:

- Footer contains a legal requisites placeholder.
- Form consent text exists but does not link to a personal data policy.

## Risks

- `api/lead.js` combines intake, callback handling, dashboard reporting, and webhook installation in one file. This is simple, but fragile as CRM logic grows.
- `api/callback-v3.js` duplicates CRM logic and may confuse future maintainers.
- CRM state is stored in Telegram pinned message text, not in a database.
- GitHub Pages workflow publishes only files listed in the copy command.
- External image URLs create a dependency on third-party media availability.
- Legal requisites and privacy/personal-data policy are placeholders.
- The older local worktree is dirty and diverged from `origin/main`; use the Gate 1 worktree or a fresh clone for further work.

## Gate 2 Readiness

Ready for Gate 2:

- baseline and backup are fixed;
- production architecture is documented;
- active endpoint is identified;
- legacy candidates are identified;
- content inventory is documented;
- owner TBDs are separated from technical facts.

TBD - owner decision: final legal text and company requisites.

TBD - owner decision: exact service list, pricing policy, photos, proof/cases, and whether the design is accepted as baseline.
