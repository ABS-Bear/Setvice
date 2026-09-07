#!/usr/bin/env node
/**
 * Offline Gate 3C webhook secret tests.
 * Uses fixture env names only. Does not print secrets, tokens, chat IDs, or PII.
 * Fetch is fully mocked; no network.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  buildSetWebhookPayload,
  isTelegramWebhookUpdate,
  verifyTelegramWebhookSecret,
  TELEGRAM_WEBHOOK_SECRET_HEADER
} from '../api/lib/telegram-webhook-secret.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE_SECRET = 'test-gate3c-webhook-secret';
const WRONG_SECRET = 'wrong-gate3c-webhook-secret';
const CHAT = '-100123';
const errors = [];
let passed = 0;

process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
process.env.TELEGRAM_CHAT_ID = CHAT;
process.env.TELEGRAM_INTERNAL_ID = '456';
process.env.TELEGRAM_WEBHOOK_SECRET = FIXTURE_SECRET;
process.env.BITRIX24_ENABLED = 'false';

const fetchCalls = [];
const originalFetch = globalThis.fetch;
const originalLog = console.log;
const originalError = console.error;
const consoleLines = [];

function leak(text) {
  const s = String(text ?? '');
  return s.includes(FIXTURE_SECRET) || s.includes(WRONG_SECRET) || s.includes('test-bot-token');
}

function recordConsole(...args) {
  consoleLines.push(args.map(String).join(' '));
}

globalThis.fetch = async (url, init = {}) => {
  const href = String(url);
  if (!href.startsWith('https://api.telegram.org/bot')) {
    throw new Error('blocked unexpected fetch');
  }
  let body = {};
  try { body = init.body ? JSON.parse(init.body) : {}; } catch { body = { raw: true }; }
  fetchCalls.push({ href, method: init.method || 'GET', body });
  const json = (result = {}) => new Response(JSON.stringify({ ok: true, result }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  if (href.includes('/setWebhook')) return json({});
  if (href.includes('/sendMessage')) return json({ message_id: 42 });
  if (href.includes('/getChat')) return json({});
  if (href.includes('/editMessageText')) return json({ message_id: 10 });
  if (href.includes('/answerCallbackQuery')) return json({});
  throw new Error('blocked unmocked telegram method');
};

function fail(name, detail) {
  errors.push(leak(detail) ? `${name}: failed` : `${name}: ${detail}`);
}

function ok(name) {
  passed += 1;
  originalLog(`PASS ${name}`);
}

function request(path, body, extraHeaders = {}) {
  return new Request(`https://abservice-leads-v2.vercel.app${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body)
  });
}

function callbackUpdate(data = 'lead:take') {
  return {
    update_id: 1,
    callback_query: {
      id: 'cb1',
      data,
      from: { id: 1, first_name: 'Test' },
      message: {
        message_id: 10,
        chat: { id: CHAT },
        text: '🛠 НОВАЯ ЗАЯВКА · СЕРВИС\nABService · 07.09.2026 · 12:00 МСК\n\n────────\n🔵 Статус: НОВАЯ'
      }
    }
  };
}

function messageUpdate() {
  return {
    update_id: 2,
    message: {
      message_id: 11,
      chat: { id: CHAT },
      text: '/start'
    }
  };
}

function leadBody() {
  return { kind: 'service', name: 'Gate3C Test', phone: '+79990000000', machine: 'offline' };
}

const fakeReq = (headerValue) => ({
  headers: { get: (name) => String(name).toLowerCase() === TELEGRAM_WEBHOOK_SECRET_HEADER.toLowerCase() ? headerValue : '' }
});

if (!isTelegramWebhookUpdate(callbackUpdate())) fail('classify callback', 'callback_query not detected');
else ok('classify callback_query as webhook update');
if (!isTelegramWebhookUpdate(messageUpdate())) fail('classify message', 'message not detected');
else ok('classify message as webhook update');
if (isTelegramWebhookUpdate(leadBody())) fail('classify lead', 'lead POST treated as webhook');
else ok('classify ordinary lead POST as non-webhook');

const valid = verifyTelegramWebhookSecret(fakeReq(FIXTURE_SECRET), { TELEGRAM_WEBHOOK_SECRET: FIXTURE_SECRET });
if (!valid.ok) fail('unit valid', 'valid secret rejected');
else ok('unit valid webhook secret');

const missing = verifyTelegramWebhookSecret(fakeReq(''), { TELEGRAM_WEBHOOK_SECRET: FIXTURE_SECRET });
if (missing.ok || missing.status !== 401) fail('unit missing', 'missing secret not rejected');
else ok('unit missing webhook secret');

const wrong = verifyTelegramWebhookSecret(fakeReq(WRONG_SECRET), { TELEGRAM_WEBHOOK_SECRET: FIXTURE_SECRET });
if (wrong.ok || wrong.status !== 401) fail('unit wrong', 'wrong secret not rejected');
else ok('unit wrong webhook secret');

const noEnv = verifyTelegramWebhookSecret(fakeReq(FIXTURE_SECRET), {});
if (noEnv.ok || noEnv.status !== 401) fail('unit no env', 'empty env secret not rejected');
else ok('unit missing env secret');

const prepared = buildSetWebhookPayload('https://abservice-leads-v2.vercel.app/api/lead', { TELEGRAM_WEBHOOK_SECRET: FIXTURE_SECRET });
if (prepared.url !== 'https://abservice-leads-v2.vercel.app/api/lead') fail('payload url', 'url changed');
else if (JSON.stringify(prepared.allowed_updates) !== JSON.stringify(['callback_query', 'message'])) fail('payload updates', 'allowed_updates changed');
else if (prepared.secret_token !== FIXTURE_SECRET) fail('payload secret', 'secret_token missing when env set');
else ok('planned setWebhook payload includes secret_token when env set');

const bare = buildSetWebhookPayload('https://abservice-leads-v2.vercel.app/api/lead', {});
if (Object.prototype.hasOwnProperty.call(bare, 'secret_token')) fail('payload bare', 'secret_token present without env');
else ok('planned setWebhook payload omits secret_token when env unset');

console.log = recordConsole;
console.error = recordConsole;

const { POST: leadPost } = await import(pathToFileURL(join(root, 'api/lead.js')).href);
const { POST: callbackPost, GET: callbackGet } = await import(pathToFileURL(join(root, 'api/callback-v3.js')).href);

async function jsonStatus(res) {
  const text = await res.text();
  if (leak(text)) fail('response leak', 'secret or token appeared in response');
  let body = {};
  try { body = JSON.parse(text); } catch { body = { parse: false }; }
  return { status: res.status, body, text };
}

{
  fetchCalls.length = 0;
  const res = await leadPost(request('/api/lead', callbackUpdate(), { [TELEGRAM_WEBHOOK_SECRET_HEADER]: FIXTURE_SECRET }));
  const { status, body } = await jsonStatus(res);
  const answered = fetchCalls.some((c) => c.href.includes('/answerCallbackQuery'));
  const edited = fetchCalls.some((c) => c.href.includes('/editMessageText'));
  if (status === 401 || body.error === 'unauthorized') fail('lead valid webhook', 'valid secret rejected');
  else if (!answered || !edited) fail('lead valid webhook', 'callback/update flow did not run');
  else ok('lead POST valid webhook secret accepts update');
}

{
  fetchCalls.length = 0;
  const res = await leadPost(request('/api/lead', callbackUpdate()));
  const { status, body } = await jsonStatus(res);
  if (status !== 401 || body.error !== 'unauthorized' || fetchCalls.length) fail('lead missing', 'missing secret not rejected before handler');
  else ok('lead POST missing webhook secret rejected');
}

{
  fetchCalls.length = 0;
  const res = await leadPost(request('/api/lead', callbackUpdate(), { [TELEGRAM_WEBHOOK_SECRET_HEADER]: WRONG_SECRET }));
  const { status, body } = await jsonStatus(res);
  if (status !== 401 || body.error !== 'unauthorized' || fetchCalls.length) fail('lead wrong', 'wrong secret not rejected before handler');
  else ok('lead POST wrong webhook secret rejected');
}

{
  fetchCalls.length = 0;
  const res = await leadPost(request('/api/lead', messageUpdate(), { [TELEGRAM_WEBHOOK_SECRET_HEADER]: FIXTURE_SECRET }));
  const { status, body } = await jsonStatus(res);
  if (status === 401 || body.error === 'unauthorized') fail('lead message', 'valid message update rejected');
  else ok('lead POST valid secret accepts message update');
}

{
  fetchCalls.length = 0;
  const origin = 'https://alecmonopoly84-hue.github.io';
  const res = await leadPost(request('/api/lead', leadBody(), { Origin: origin }));
  const { status, body } = await jsonStatus(res);
  const setWebhook = fetchCalls.find((c) => c.href.includes('/setWebhook'));
  const sent = fetchCalls.some((c) => c.href.includes('/sendMessage'));
  if (status !== 200 || !body.ok) fail('lead form', `ordinary lead POST failed status=${status}`);
  else if (!sent) fail('lead form', 'submitLead did not send Telegram message');
  else if (!setWebhook) fail('lead form', 'routine install was not invoked');
  else if (setWebhook.body.secret_token !== FIXTURE_SECRET) fail('lead form', 'install omitted secret_token while env set');
  else ok('ordinary lead POST works without webhook secret header');
}

{
  fetchCalls.length = 0;
  const res = await callbackPost(request('/api/callback-v3', callbackUpdate(), { [TELEGRAM_WEBHOOK_SECRET_HEADER]: FIXTURE_SECRET }));
  const { status, body } = await jsonStatus(res);
  const answered = fetchCalls.some((c) => c.href.includes('/answerCallbackQuery'));
  const edited = fetchCalls.some((c) => c.href.includes('/editMessageText'));
  if (status === 401 || body.error === 'unauthorized') fail('cb valid', 'valid secret rejected');
  else if (!answered || !edited) fail('cb valid', 'callback/update flow did not run');
  else ok('callback-v3 POST valid webhook secret accepts update');
}

{
  fetchCalls.length = 0;
  const res = await callbackPost(request('/api/callback-v3', callbackUpdate()));
  const { status, body } = await jsonStatus(res);
  if (status !== 401 || body.error !== 'unauthorized' || fetchCalls.length) fail('cb missing', 'missing secret not rejected');
  else ok('callback-v3 POST missing webhook secret rejected');
}

{
  fetchCalls.length = 0;
  const res = await callbackPost(request('/api/callback-v3', callbackUpdate(), { [TELEGRAM_WEBHOOK_SECRET_HEADER]: WRONG_SECRET }));
  const { status, body } = await jsonStatus(res);
  if (status !== 401 || body.error !== 'unauthorized' || fetchCalls.length) fail('cb wrong', 'wrong secret not rejected');
  else ok('callback-v3 POST wrong webhook secret rejected');
}

{
  const res = await callbackGet(new Request('https://abservice-leads-v2.vercel.app/api/callback-v3'));
  const { status, body } = await jsonStatus(res);
  if (status !== 410 || body.status !== 'legacy-disabled') fail('cb get', 'GET is not legacy-disabled');
  else ok('callback-v3 GET remains legacy-disabled');
}

if (consoleLines.some(leak)) fail('console leak', 'secret or token appeared in logs');
else ok('secrets stay out of logs and responses');

console.log = originalLog;
console.error = originalError;
globalThis.fetch = originalFetch;

if (errors.length) {
  console.error('telegram webhook secret tests failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log(`telegram webhook secret tests ok (${passed})`);
