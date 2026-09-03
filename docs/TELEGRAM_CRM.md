# Telegram CRM

## Active Channel

Telegram CRM is the only active lead channel in Gate 3A. Bitrix24 is future/off. Yandex Metrika is future/off.

Frontend forms send leads to:

```text
https://abservice-leads-v2.vercel.app/api/lead
```

The backend source for that endpoint is `api/lead.js`.

Webhook install / CRM readiness is handled **server-side** by the lead API (for example during lead submit). The browser must **not** call `GET /api/lead` (or any side-effecting webhook activation endpoint) on page load, script boot, or form success. Do not wire frontend auto-activation helpers such as `activateCrmWebhook`.

## Required Runtime Env Names

The Vercel backend requires these environment variable **names** (never commit values):

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_INTERNAL_ID
```

They must stay in Vercel environment variables. They must not be placed in frontend config, Decap CMS, `src/content/`, build output or documentation values.

Missing required config returns a safe 503 / error response without leaking secrets.

## Legacy Fallback

`api/callback-v3.js` remains in the repository as a legacy fallback until an external webhook check confirms `/api/lead`.

- GET: legacy-disabled / read-only — no webhook install or mutation.
- POST: retained as fallback webhook handling.

Do not delete the file in Gate 3A.

## Lead Payloads

Supported lead kinds:

- `service`;
- `parts`;
- `stationary-service`.

The frontend may send name, phone, machine, location (service only), issue, parts details and up to two compressed attachments. Phone is required by the backend.

## CRM Flow

New Telegram leads are created with an inline keyboard. The active flow is:

1. `Взять в работу`
2. `Связались` or `Не дозвонились`
3. `Успех` or `Неуспех`

Reports are requested in the CRM chat with:

```text
/report
/report today
/report week
/report month
```

## Live Regression Test — Blocker

Use one clearly marked test lead:

```text
ABService TEST Gate 3A
```

Check:

- lead appears in Telegram;
- attachment delivery works if a test image is available;
- buttons progress from `Взять в работу` to `Связались` to `Успех`;
- `/report` reflects the test action.

Do not run this test against production Telegram without owner approval, because it creates a real CRM message and changes CRM counters. Gate 3A treats live regression as an open blocker until that approved run happens.
