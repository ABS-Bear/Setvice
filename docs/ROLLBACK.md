# Rollback

## Local branch / commit rollback (non-destructive)

Use only local, reversible git actions. Do **not** run `git reset --hard`, `git clean -fd`, force-push, or rewrite shared history unless the owner separately requests destructive recovery.

Safe options:

1. **Undo an unpushed local commit while keeping changes staged**
   ```bash
   git reset --soft HEAD~1
   ```
2. **Create a revert commit** (preferred after the Gate 3A commit exists and must be undone without rewriting history)
   ```bash
   git revert <commit-sha>
   ```
3. **Leave the feature branch unused** and continue work on another branch. Do not merge Gate 3A into `main` until acceptance.

Gate 3A work lives on `gate3a-telegram-production-readiness-2026-09-03`. Do not touch `main` during rollback of this gate.

## Legacy archive

The older GitHub Pages package remains at:

```text
archive/legacy/github-pages-field-service.zip
```

It is not deleted by Gate 3A. Keep it for audit and comparison.

## Backend fallback

- Active endpoint: `api/lead.js` (`/api/lead`).
- Legacy fallback: `api/callback-v3.js` remains in the repo.
- Gate 3A neutralizes side-effecting GET on `callback-v3` (no webhook install/mutation from GET). POST stays available until an external webhook check confirms `/api/lead`.

## Production rollback

Production rollback requires a **separate deploy** decision and is **not performed** in Gate 3A.

To roll back a future production release later:

1. Confirm the last known-good production commit/tag.
2. Deploy that known-good frontend build to GitHub Pages through the normal deploy path.
3. Confirm Vercel still serves the intended `/api/lead` function and environment variable names.
4. Do not delete `api/callback-v3.js` until webhook ownership is confirmed.

Gate 3A itself does not push, merge, or deploy.
