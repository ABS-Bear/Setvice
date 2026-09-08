#!/usr/bin/env node
/**
 * Offline CORS allowlist tests for the customer Pages migration.
 * Fetch is fully mocked; no network. Does not print secrets or PII.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  ALLOWED_FRONTEND_ORIGINS,
  CUSTOMER_PAGES_ORIGIN,
  TEMPORARY_LEGACY_PAGES_ORIGIN,
  isAllowedFrontendOrigin
} from '../api/lib/cors-origins.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
let passed = 0;

process.env.TELEGRAM_BOT_TOKEN = 'test-bot-token';
process.env.TELEGRAM_CHAT_ID = '-100123';
process.env.TELEGRAM_INTERNAL_ID = '456';
process.env.TELEGRAM_WEBHOOK_SECRET = 'test-gate3c-webhook-secret';
process.env.BITRIX24_ENABLED = 'false';

const originalFetch = globalThis.fetch;
const originalLog = console.log;
const originalError = console.error;

globalThis.fetch = async (url) => {
  const href = String(url);
  if (!href.startsWith('https://api.telegram.org/bot')) {
    throw new Error('blocked unexpected fetch');
  }
  const json = (result = {}) => new Response(JSON.stringify({ ok: true, result }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
  if (href.includes('/setWebhook')) return json({});
  if (href.includes('/sendMessage')) return json({ message_id: 42 });
  if (href.includes('/getChat')) return json({});
  if (href.includes('/editMessageText')) return json({ message_id: 10 });
  if (href.includes('/answerCallbackQuery')) return json({});
  throw new Error('blocked unmocked telegram method');
};

function fail(name, detail) {
  errors.push(`${name}: ${detail}`);
}

function ok(name) {
  passed += 1;
  originalLog(`PASS ${name}`);
}

function acao(res) {
  return res.headers.get('Access-Control-Allow-Origin');
}

function request(path, { method = 'POST', origin, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (origin !== undefined) headers.Origin = origin;
  return new Request(`https://abservice-leads-v2.vercel.app${path}`, {
    method,
    headers,
    body: method === 'OPTIONS' ? undefined : JSON.stringify(body ?? {
      kind: 'service',
      name: 'CORS Test',
      phone: '+79990000000',
      machine: 'offline'
    })
  });
}

if (ALLOWED_FRONTEND_ORIGINS.includes('*')) fail('allowlist', 'wildcard origin is present');
else if (ALLOWED_FRONTEND_ORIGINS.length !== 2) fail('allowlist', `expected 2 origins, got ${ALLOWED_FRONTEND_ORIGINS.length}`);
else if (!isAllowedFrontendOrigin(TEMPORARY_LEGACY_PAGES_ORIGIN)) fail('allowlist', 'old production origin missing');
else if (!isAllowedFrontendOrigin(CUSTOMER_PAGES_ORIGIN)) fail('allowlist', 'new customer origin missing');
else if (isAllowedFrontendOrigin('http://localhost:4321') || isAllowedFrontendOrigin('http://127.0.0.1')) fail('allowlist', 'localhost is allowed');
else if (isAllowedFrontendOrigin('https://evil.example')) fail('allowlist', 'arbitrary origin is allowed');
else ok('allowlist is exactly old + new Pages origins');

const { POST: leadPost, OPTIONS: leadOptions } = await import(pathToFileURL(join(root, 'api/lead.js')).href);
const { POST: callbackPost, OPTIONS: callbackOptions } = await import(pathToFileURL(join(root, 'api/callback-v3.js')).href);

{
  const origin = TEMPORARY_LEGACY_PAGES_ORIGIN;
  const pre = await leadOptions(request('/api/lead', { method: 'OPTIONS', origin }));
  const res = await leadPost(request('/api/lead', { origin }));
  const body = await res.json();
  if (pre.status !== 204 || acao(pre) !== origin) fail('old origin OPTIONS', `status=${pre.status} acao=${acao(pre)}`);
  else if (res.status !== 200 || !body.ok || acao(res) !== origin) fail('old origin POST', `status=${res.status} acao=${acao(res)}`);
  else ok('old production origin → allowed');
}

{
  const origin = CUSTOMER_PAGES_ORIGIN;
  const pre = await leadOptions(request('/api/lead', { method: 'OPTIONS', origin }));
  const res = await leadPost(request('/api/lead', { origin }));
  const body = await res.json();
  if (pre.status !== 204 || acao(pre) !== origin) fail('new origin OPTIONS', `status=${pre.status} acao=${acao(pre)}`);
  else if (res.status !== 200 || !body.ok || acao(res) !== origin) fail('new origin POST', `status=${res.status} acao=${acao(res)}`);
  else ok('new customer origin → allowed');
}

{
  const origin = 'http://localhost:4321';
  const pre = await leadOptions(request('/api/lead', { method: 'OPTIONS', origin }));
  const res = await leadPost(request('/api/lead', { origin }));
  const body = await res.json();
  if (acao(pre) === origin || acao(pre) === '*') fail('localhost OPTIONS', `acao=${acao(pre)}`);
  else if (res.status !== 403 || body.error !== 'Origin not allowed' || acao(res) === origin || acao(res) === '*') {
    fail('localhost POST', `status=${res.status} acao=${acao(res)}`);
  } else ok('localhost → rejected');
}

{
  const origin = 'https://evil.example';
  const pre = await leadOptions(request('/api/lead', { method: 'OPTIONS', origin }));
  const res = await leadPost(request('/api/lead', { origin }));
  const body = await res.json();
  if (acao(pre) === origin || acao(pre) === '*') fail('arbitrary OPTIONS', `acao=${acao(pre)}`);
  else if (res.status !== 403 || body.error !== 'Origin not allowed' || acao(res) === origin || acao(res) === '*') {
    fail('arbitrary POST', `status=${res.status} acao=${acao(res)}`);
  } else ok('arbitrary origin → rejected');
}

{
  const origin = TEMPORARY_LEGACY_PAGES_ORIGIN;
  const pre = await callbackOptions(request('/api/callback-v3', { method: 'OPTIONS', origin }));
  if (pre.status !== 204 || acao(pre) !== origin) fail('callback-v3 old OPTIONS', `status=${pre.status} acao=${acao(pre)}`);
  else ok('callback-v3 old production origin → allowed');
}

{
  const origin = CUSTOMER_PAGES_ORIGIN;
  const pre = await callbackOptions(request('/api/callback-v3', { method: 'OPTIONS', origin }));
  if (pre.status !== 204 || acao(pre) !== origin) fail('callback-v3 new OPTIONS', `status=${pre.status} acao=${acao(pre)}`);
  else ok('callback-v3 new customer origin → allowed');
}

{
  const origin = 'http://localhost:4321';
  const res = await callbackPost(request('/api/callback-v3', { origin, body: { update_id: 1 } }));
  const body = await res.json();
  if (res.status !== 403 || body.error !== 'Origin not allowed' || acao(res) === '*' || acao(res) === origin) {
    fail('callback-v3 localhost', `status=${res.status} acao=${acao(res)}`);
  } else ok('callback-v3 localhost → rejected');
}

{
  const origin = 'https://evil.example';
  const res = await callbackPost(request('/api/callback-v3', { origin, body: { update_id: 1 } }));
  const body = await res.json();
  if (res.status !== 403 || body.error !== 'Origin not allowed' || acao(res) === '*' || acao(res) === origin) {
    fail('callback-v3 arbitrary', `status=${res.status} acao=${acao(res)}`);
  } else ok('callback-v3 arbitrary origin → rejected');
}

globalThis.fetch = originalFetch;
console.log = originalLog;
console.error = originalError;

if (errors.length) {
  console.error('cors origin tests failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log(`cors origin tests ok (${passed})`);
