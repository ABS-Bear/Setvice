# ABService Telegram CRM

Status: Gate 1 draft, 2026-09-03.

## Current Flow

1. User submits a form on the service page or parts page.
2. Browser JavaScript sends JSON to `https://abservice-leads-v2.vercel.app/api/lead`.
3. Vercel function reads `TELEGRAM_BOT_TOKEN` from environment variables.
4. Function sends a lead card to the Telegram group.
5. Manager works the lead through inline buttons.
6. CRM dashboard is updated in a pinned Telegram message.

## Lead Types

Service lead fields:

- name;
- phone;
- machine;
- location;
- issue;
- up to 2 attachments.

Parts lead fields:

- mode: only parts or parts plus installation;
- name;
- phone;
- machine;
- article;
- part request;
- up to 2 image attachments.

## CRM Statuses

Current lead status path:

```text
new
  -> in_work
  -> contacted
      -> success
      -> fail_reason -> failed
  -> no_answer -> contacted / in_work
```

Failure reasons currently encoded:

- price;
- stock;
- term;
- changed;
- other.

## Dashboard

The Telegram dashboard tracks:

- active leads;
- service vs parts counts;
- daily / weekly / monthly periods;
- contacted / no-answer / success / failure counts;
- average time to contact;
- failure reasons.

The state is embedded in the pinned message text as a compact encoded `CRMSTATE:` block.

## Security Notes

No bot token value was found in repository files during Gate 1 scan.

The Telegram bot token must remain only in Vercel environment variables or another secret manager. Do not paste it into docs, source code, screenshots, or chat messages.

The repository does contain public operational identifiers such as backend URL and Telegram chat identifiers. These are not the bot token, but they should still be treated carefully in public documentation.

## Needs Check

- Confirm the active Telegram webhook currently points to `/api/lead`.
- Confirm whether `api/callback-v3.js` is still needed for rollback.
- Confirm who is allowed to press CRM buttons and whether role checks are required.
- Confirm whether Telegram-only reporting is enough for management.

TBD - owner decision: manager roles and final CRM rules.

TBD - owner decision: whether leads must be exported to a spreadsheet, database, or formal CRM.
