import { Buffer } from 'node:buffer';
import { timingSafeEqual } from 'node:crypto';

export const TELEGRAM_WEBHOOK_SECRET_HEADER = 'X-Telegram-Bot-Api-Secret-Token';

function asBuffer(value) {
  return Buffer.from(String(value ?? ''), 'utf8');
}

function safeEqual(left, right) {
  const a = asBuffer(left);
  const b = asBuffer(right);
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    if (a.length > 0) timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function readWebhookSecretHeader(req) {
  return String(req?.headers?.get?.(TELEGRAM_WEBHOOK_SECRET_HEADER) || '');
}

export function isTelegramWebhookUpdate(body) {
  if (!body || typeof body !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(body, 'callback_query')
    || Object.prototype.hasOwnProperty.call(body, 'message')
    || Object.prototype.hasOwnProperty.call(body, 'update_id');
}

/**
 * Future setWebhook payload. Does not call Telegram.
 * secret_token is included only when TELEGRAM_WEBHOOK_SECRET is set.
 */
export function buildSetWebhookPayload(url, env = process.env) {
  const payload = {
    url,
    allowed_updates: ['callback_query', 'message']
  };
  const secret = String(env.TELEGRAM_WEBHOOK_SECRET || '');
  if (secret) payload.secret_token = secret;
  return payload;
}

export function verifyTelegramWebhookSecret(req, env = process.env) {
  const expected = String(env.TELEGRAM_WEBHOOK_SECRET || '');
  const provided = readWebhookSecretHeader(req);
  if (!safeEqual(provided, expected)) {
    return { ok: false, status: 401 };
  }
  return { ok: true };
}
