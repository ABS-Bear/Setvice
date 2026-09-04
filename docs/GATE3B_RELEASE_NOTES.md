# Gate 3B — Controlled regression release notes

**Date:** 2026-09-04  
**Branch:** `gate3b-controlled-rollout-2026-09-04`  
**Baseline HEAD:** `33f568d` (Gate 3A readiness closeout)  
**Scope:** controlled offline + live regression; documentation and one frontend bugfix. No push, merge, deploy, fetch, or production/`main` changes. Production site, webhook target, Bitrix, and Metrika were not called or modified in this gate closeout.

Preview QA by the owner was previously PASS (before this closeout).

---

## Offline matrix

| Item | Result |
|------|--------|
| Harness location | `/tmp` |
| Cases | 13/13 PASS |
| Network | `fetch` fully mocked; 0 real network calls |

---

## Live form matrix

| Case | Result |
|------|--------|
| service form | PASS |
| parts form | PASS |
| stationary form | PASS |
| parts attachment | PASS |

**Live interaction constraint:** the browser provider was unavailable for live form interaction. Live payloads were therefore sent by direct POST against the actual frontend/API contract, using the release (production GitHub Pages) Origin. This is an honest limitation of the live evidence path, not a substitute for full browser E2E.

**CORS note:** the first live POST with a localhost Origin received **403** and did **not** create a lead. That matches the **currently deployed** CORS configuration and is **not** a defect of this branch. After that, exactly **three** POSTs with the production GitHub Pages Origin returned **200**.

Webhook target was not changed. The routine idempotent `setWebhook` on submit remained as previously allowed operational behaviour; no new webhook migration was performed.

---

## Manual owner confirmation (Telegram CRM)

Owner manually confirmed PASS for:

- delivery  
- Взять в работу  
- Связались  
- Не дозвонились  
- Успех  
- Неуспех + причина  
- Открытые  
- Мои  
- Сегодня  
- Неделя  
- Месяц  
- Полный отчёт  

Documentation intentionally omits payloads, phones, contacts, Telegram IDs, tokens, message numbers, and real CRM counts.

---

## Code change in this gate

**Single bugfix:** `public/scripts/site.js`

- Submit handler `finally` previously forced the button label to a fixed «Отправить заявку» string, which overwrote the stationary CTA.
- Fix: capture the original button label before submit and restore it in `finally`.

No API / webhook / Bitrix / Metrika code changes in this gate.

---

## Known security limitation (unchanged in this scope)

**Finding:** Telegram webhook updates on the unified `api/lead` endpoint are **not** verified via the `X-Telegram-Bot-Api-Secret-Token` header. There is no secret-token check in the current POST path; updates without `Origin` proceed past the CORS allowlist (by design for Telegram → webhook delivery).

**Why not fixed here:** hardening needs a separate env/config value, `setWebhook` with `secret_token`, and an explicit production webhook migration permission. API changes and webhook target changes are out of Gate 3B scope.

**Classification:**

| Lens | Status |
|------|--------|
| Gate 3B controlled regression closeout | **Not a regression blocker** — out of scope; intentional no-API-change |
| Security-complete production cutover / merge-to-main claim | **Release blocker (hardening)** — do not claim webhook authenticity is enforced until secret-token verification is implemented and migrated under separate approval |

**Residual risk (factual):** a caller who can POST to the public unified endpoint without a disallowed `Origin` can present `callback_query` / `message` bodies that the handler treats as Telegram updates. Form POSTs from browsers still require an allowlisted Origin. Softening factors (URL knowledge, HTTPS, existing operator process) do **not** replace secret-token verification.

---

## Explicit non-actions

- No push  
- No merge  
- No deploy  
- No fetch  
- `main` untouched  
- Production site unchanged  
- Webhook target unchanged  
- Bitrix / Metrika not invoked or modified  

---

## Readiness summary

Gate 3B **controlled regression is complete** on this branch: offline PASS, live form matrix PASS (with direct-POST limitation recorded), owner Telegram confirmation PASS, one frontend CTA restore fix included.

**Blockers before production merge/deploy:**

1. **Security hardening (release blocker for hardened cutover):** implement and migrate Telegram `X-Telegram-Bot-Api-Secret-Token` verification under separate production webhook approval.  
2. **Process:** separate explicit approval for push / merge / deploy; production site and `main` remain unchanged until then.
