# Rollback

## Local branch / commit rollback (non-destructive)

Use only local, reversible git actions. Do **not** run `git reset --hard`, `git clean -fd`, force-push, or rewrite shared history unless the owner separately requests destructive recovery.

Safe options:

1. **Undo an unpushed local commit while keeping changes staged**
   ```bash
   git reset --soft HEAD~1
   ```
2. **Create a revert commit** (preferred after a release is on `main`)
   ```bash
   git revert <commit-sha>
   ```
3. **Leave a feature branch unused** and continue on another branch.

Do not move or rewrite tag `v1.0.0`.

## Frontend rollback (Git history / tag, no force push)

GitHub Pages follows `ABS-Bear/Setvice` `main`.

1. Identify the last known-good commit or tag (`v1.0.1` for this handover; `v1.0.0` is the earlier snapshot on `c7997a6` and must stay there).
2. Restore that tree with a **new** commit on `main`, for example:
   ```bash
   git revert <bad-sha>
   ```
   or a reverse-apply that does not rewrite history. Then push with a normal fast-forward.
3. Wait for **Deploy website to GitHub Pages** to succeed.
4. Confirm `https://abs-bear.github.io/Setvice/` shows the restored content.
5. Do **not** force-push `main` and do **not** move tags.

CMS publish is also a commit on `main`. To undo a bad CMS edit, revert that commit or republish the previous content through CMS.

## Legacy archive

The older GitHub Pages package remains at:

```text
archive/legacy/github-pages-field-service.zip
```

It is not deleted. Keep it for audit and comparison.

## Backend fallback

- Active endpoint: `api/lead.js` (`/api/lead`).
- Legacy fallback: `api/callback-v3.js` remains in the repo.
- GET on `callback-v3` is legacy-disabled (no webhook install/mutation). POST requires the webhook secret and must not become the live webhook target.

## Production Vercel rollback

Current production deployment:

```text
dpl_9QJvwSs9GsiU2tAyxFTf6tLgvhfw
```

Rollback deployment:

```text
dpl_F4Umk6QvmjUqhjTXZP7awRuNrTdq
```

Company and contractor can promote the rollback deployment in the Vercel project `abservice-leads-v2` (current scope: `alecmonopoly84-2297s-projects`). Production rollback is a **separate deploy** decision.

To roll back the live function:

1. Promote / redeploy `dpl_F4Umk6QvmjUqhjTXZP7awRuNrTdq` (or another owner-approved known-good deployment).
2. `dpl_F4Umk6QvmjUqhjTXZP7awRuNrTdq` already includes Gate 3C webhook security and post-cutover CORS (`https://abs-bear.github.io` only). It does **not** include the CMS OAuth proxy. After this rollback, `/Setvice/admin/` GitHub login will fail until the current deployment is restored.
3. Do **not** remove Telegram `secret_token` or delete Vercel `TELEGRAM_WEBHOOK_SECRET` while Gate 3C code is live.
4. Frontend lead POST does not depend on the webhook header; do not change form code during rollback.
5. Do not `GET /api/lead` as a rollback tool.
6. Do not change GitHub OAuth App settings as part of a Vercel rollback.

Older historical deployments (pre-cutover / pre-Gate 3C) must not be promoted without a separate security review: they may lack webhook secret checks or may allow a legacy Pages origin.

## Local code rollback

1. Prefer `git revert <commit-sha>`.
2. Do not `git reset --hard` or force-push.
3. Reverting docs/content does not change the live Vercel deployment. Reverting `api/**` still needs a new Vercel deploy to take effect.
