# Gate 2A Legacy Check And Archive Plan

Date: 2026-09-03
Branch: gate2a-safe-technical-prep-2026-09-03
Baseline: origin/main at 3e12ea43fba2ce48b8a572973e296f394367bb2f

## Findings

- Active frontend submissions use `https://abservice-leads-v2.vercel.app/api/lead`.
- Active backend endpoint is `api/lead.js`.
- `api/callback-v3.js` is not referenced by the current static frontend or GitHub Pages workflow.
- `api/callback-v3.js` can still set a Telegram webhook to `/api/callback-v3` if its GET endpoint is called directly.
- `github-pages-field-service.zip` is not referenced by the current static frontend or GitHub Pages workflow.
- The zip contains an older Next.js implementation, including its own sitemap/robots files and app source.

## Safe Plan

1. Keep `api/callback-v3.js` and `github-pages-field-service.zip` in place during Gate 2A.
2. Before removal, confirm in Vercel that no route, webhook, cron, or external bookmark depends on `/api/callback-v3`.
3. Confirm the Telegram bot webhook currently points to `/api/lead`.
4. If confirmed, archive `api/callback-v3.js` into a clearly named legacy folder or remove it in a dedicated commit.
5. Move or remove `github-pages-field-service.zip` in the same dedicated cleanup step.
6. Push and merge only after explicit owner approval.

## Requires Separate Confirmation

- Deleting or moving `api/callback-v3.js`.
- Deleting, moving, or replacing `github-pages-field-service.zip`.
- Pushing the Gate 2A branch or merging it into `main`.
