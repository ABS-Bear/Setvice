# Rollback

## Local branch / commit rollback (non-destructive)

Use only local, reversible git actions. Do **not** run `git reset --hard`, `git clean -fd`, force-push, or rewrite shared history unless the owner separately requests destructive recovery.

Safe options:

1. **Undo an unpushed local commit while keeping changes staged**
   ```bash
   git reset --soft HEAD~1
   ```
2. **Create a revert commit** (preferred after a release commit exists and must be undone without rewriting history)
   ```bash
   git revert <commit-sha>
   ```
3. **Leave the feature branch unused** and continue work on another branch. Do not merge into `main` until acceptance.

v1.0.0 / Gate 3C work lives on `gate3c-telegram-webhook-security-2026-09-07`. Earlier gates: Gate 3A `gate3a-telegram-production-readiness-2026-09-03`, Gate 3B `gate3b-controlled-rollout-2026-09-04`. Do not touch `main` during rollback of this release.

## Legacy archive

The older GitHub Pages package remains at:

```text
archive/legacy/github-pages-field-service.zip
```

It is not deleted by this release. Keep it for audit and comparison.

## Backend fallback

- Active endpoint: `api/lead.js` (`/api/lead`).
- Legacy fallback: `api/callback-v3.js` remains in the repo.
- GET on `callback-v3` is legacy-disabled (no webhook install/mutation). POST requires the webhook secret and must not become the live webhook target.

## Production Vercel rollback

Current production deployment (Gate 3C / webhook security enabled):

```text
dpl_84tMye42AgtbdKoDhwm2fT8EdSEs
```

Known-good rollback deployment (pre-Gate 3C production):

```text
dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz
```

Production rollback requires a **separate deploy** decision. This v1.0.0 documentation commit does not promote, roll back, or change Vercel.

To roll back the live function later:

1. Redeploy / promote `dpl_A6yDU8GxhpLNSnFvAmWG6nmpHoDz` (or another owner-approved known-good deployment).
2. That older function ignores `X-Telegram-Bot-Api-Secret-Token`, so CRM updates work whether or not Telegram still sends the header.
3. Do **not** remove Telegram `secret_token` while Gate 3C code (`dpl_84tMye42AgtbdKoDhwm2fT8EdSEs` or later) is still live: missing header would reject updates.
4. Do **not** delete Vercel `TELEGRAM_WEBHOOK_SECRET` while Gate 3C is live.
5. After the old function is live, optionally leave the Telegram secret in place (harmless) or, with separate approval, call `setWebhook` on the same `/api/lead` URL without `secret_token`.
6. Frontend lead POST does not depend on this header; do not change form code during rollback.
7. Do not `GET /api/lead` as a rollback tool.

To roll back a future frontend release:

1. Confirm the last known-good production commit/tag (for this snapshot: `v1.0.0`).
2. Deploy that known-good frontend build to GitHub Pages through the normal deploy path after the customer repository exists.
3. Confirm Vercel still serves the intended `/api/lead` function and environment variable names.
4. Do not delete `api/callback-v3.js` until webhook ownership is confirmed.

## Local code rollback for webhook-secret changes

1. Prefer `git revert <commit-sha>` or leave `gate3c-telegram-webhook-security-2026-09-07` unused.
2. Do not `git reset --hard` or force-push.
3. Remember: reverting local docs/code does not change the live Vercel deployment.
