#!/usr/bin/env node
/**
 * Offline CMS OAuth proxy tests. Fetch is mocked; no GitHub/Vercel network.
 * Does not print secrets, tokens, or PII.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import {
  CMS_CALLBACK_PATH,
  CMS_OAUTH_PROXY_ORIGIN,
  CMS_PAGES_ORIGIN,
  createOauthState,
  verifyOauthState
} from '../api/lib/cms-oauth.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
let passed = 0;
const FIXTURE_ID = 'test-oauth-client-id';
const FIXTURE_SECRET = 'test-oauth-client-secret';
const FIXTURE_TOKEN = 'test-oauth-access-token';

const originalLog = console.log;
const originalError = console.error;
const consoleLines = [];

function leak(text) {
  const s = String(text ?? '');
  return s.includes(FIXTURE_SECRET) || s.includes(FIXTURE_TOKEN);
}

function recordConsole(...args) {
  consoleLines.push(args.map(String).join(' '));
}

function fail(name, detail) {
  errors.push(leak(detail) ? `${name}: failed` : `${name}: ${detail}`);
}

function ok(name) {
  passed += 1;
  originalLog(`PASS ${name}`);
}

function acao(res) {
  return res.headers.get('Access-Control-Allow-Origin');
}

const configuredEnv = {
  GITHUB_OAUTH_CLIENT_ID: FIXTURE_ID,
  GITHUB_OAUTH_CLIENT_SECRET: FIXTURE_SECRET
};

const { OPTIONS: authOptions, GET: authGet } = await import(pathToFileURL(join(root, 'api/cms-auth.js')).href);
const { GET: callbackGet } = await import(pathToFileURL(join(root, 'api/cms-callback.js')).href);
const { finishCmsOauth } = await import(pathToFileURL(join(root, 'api/lib/cms-oauth.js')).href);

console.log = recordConsole;
console.error = recordConsole;

{
  const prevId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const prevSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  delete process.env.GITHUB_OAUTH_CLIENT_ID;
  delete process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const res = await authGet(new Request(`${CMS_OAUTH_PROXY_ORIGIN}/api/cms-auth`));
  const text = await res.text();
  if (res.status !== 503 || !/not configured/i.test(text)) fail('auth unconfigured', `status=${res.status}`);
  else if (leak(text)) fail('auth unconfigured leak', 'secret in response');
  else ok('OAuth auth without config → safe reject');
  if (prevId !== undefined) process.env.GITHUB_OAUTH_CLIENT_ID = prevId;
  if (prevSecret !== undefined) process.env.GITHUB_OAUTH_CLIENT_SECRET = prevSecret;
}

{
  const state = createOauthState(configuredEnv);
  if (!verifyOauthState(state, configuredEnv)) fail('state', 'valid state rejected');
  else if (verifyOauthState('nope', configuredEnv) || verifyOauthState('', configuredEnv)) fail('state', 'invalid state accepted');
  else ok('OAuth state HMAC verifies only matching values');
}

{
  process.env.GITHUB_OAUTH_CLIENT_ID = FIXTURE_ID;
  process.env.GITHUB_OAUTH_CLIENT_SECRET = FIXTURE_SECRET;
  const res = await authGet(new Request(`${CMS_OAUTH_PROXY_ORIGIN}/api/cms-auth`, {
    headers: { Origin: 'https://evil.example' }
  }));
  const text = await res.text();
  if (res.status !== 403 || acao(res) === '*' || acao(res) === 'https://evil.example') fail('auth evil origin', `status=${res.status} acao=${acao(res)}`);
  else if (leak(text)) fail('auth evil leak', 'secret in response');
  else ok('arbitrary origin does not get CMS auth access');
}

{
  const res = await authOptions(new Request(`${CMS_OAUTH_PROXY_ORIGIN}/api/cms-auth`, {
    method: 'OPTIONS',
    headers: { Origin: CMS_PAGES_ORIGIN }
  }));
  if (res.status !== 204 || acao(res) !== CMS_PAGES_ORIGIN) fail('auth options allowed', `status=${res.status} acao=${acao(res)}`);
  else ok('CMS frontend origin is the only CORS allow');
}

{
  const res = await authOptions(new Request(`${CMS_OAUTH_PROXY_ORIGIN}/api/cms-auth`, {
    method: 'OPTIONS',
    headers: { Origin: 'https://evil.example' }
  }));
  if (acao(res) === '*' || acao(res) === 'https://evil.example') fail('auth options evil', `acao=${acao(res)}`);
  else ok('arbitrary origin does not receive CMS CORS allow');
}

{
  const res = await authGet(new Request(`${CMS_OAUTH_PROXY_ORIGIN}/api/cms-auth`));
  const location = res.headers.get('Location') || '';
  const cookie = res.headers.get('Set-Cookie') || '';
  if (res.status !== 302 || !location.startsWith('https://github.com/login/oauth/authorize')) fail('auth start', `status=${res.status}`);
  else if (!cookie.includes('HttpOnly') || !cookie.includes('ab_cms_oauth_state=')) fail('auth cookie', 'state cookie missing flags');
  else if (location.includes(FIXTURE_SECRET) || cookie.includes(FIXTURE_SECRET)) fail('auth start leak', 'secret in redirect');
  else ok('configured auth redirects to GitHub with state cookie');
}

{
  const res = await callbackGet(new Request(`${CMS_OAUTH_PROXY_ORIGIN}${CMS_CALLBACK_PATH}?code=abc`));
  const text = await res.text();
  if (res.status !== 400 || !/invalid oauth state/i.test(text)) fail('callback missing state', `status=${res.status}`);
  else if (leak(text)) fail('callback missing state leak', 'secret in response');
  else ok('missing OAuth state → reject');
}

{
  const state = createOauthState(configuredEnv);
  const res = await finishCmsOauth(new Request(`${CMS_OAUTH_PROXY_ORIGIN}${CMS_CALLBACK_PATH}?code=abc&state=${state}`, {
    headers: { Cookie: `ab_cms_oauth_state=wrong.${'0'.repeat(64)}` }
  }), configuredEnv, async () => { throw new Error('should not exchange'); });
  const text = await res.text();
  if (res.status !== 400 || !/invalid oauth state/i.test(text)) fail('callback bad state', `status=${res.status}`);
  else if (leak(text)) fail('callback bad state leak', 'secret in response');
  else ok('invalid OAuth state → reject');
}

{
  const res = await callbackGet(new Request(`${CMS_OAUTH_PROXY_ORIGIN}${CMS_CALLBACK_PATH}?error=access_denied`));
  const text = await res.text();
  if (res.status !== 400 || !/github authorization error/i.test(text)) fail('callback gh error', `status=${res.status}`);
  else if (text.includes(FIXTURE_SECRET) || text.includes(FIXTURE_TOKEN)) fail('callback gh error leak', 'secret in response');
  else ok('GitHub callback error → safe reject');
}

{
  const state = createOauthState(configuredEnv);
  const res = await finishCmsOauth(new Request(`${CMS_OAUTH_PROXY_ORIGIN}${CMS_CALLBACK_PATH}?code=ok-code&state=${encodeURIComponent(state)}`, {
    headers: { Cookie: `ab_cms_oauth_state=${state}`, Origin: CMS_PAGES_ORIGIN }
  }), configuredEnv, async () => new Response(JSON.stringify({ access_token: FIXTURE_TOKEN }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  }));
  const text = await res.text();
  if (res.status !== 200 || !text.includes('authorization:github:success:')) fail('callback success', `status=${res.status}`);
  else if (!text.includes(JSON.stringify(CMS_PAGES_ORIGIN))) fail('callback success origin', 'postMessage origin is not CMS Pages');
  else if (text.includes(FIXTURE_SECRET) || text.includes(FIXTURE_ID)) fail('callback success leak', 'oauth client values in response');
  else if (acao(res) !== CMS_PAGES_ORIGIN) fail('callback success cors', `acao=${acao(res)}`);
  else ok('valid mocked callback returns Decap success to CMS origin');
}

{
  const yml = readFileSync(join(root, 'public/admin/config.yml'), 'utf8');
  const media = yml.match(/media_folder:\s*(\S+)/)?.[1];
  const pub = yml.match(/public_folder:\s*(\S+)/)?.[1];
  const generated = `${String(pub || '').replace(/\/$/, '')}/cms-new-upload.jpg`;
  if (media !== 'public/media' || pub !== '/Setvice/media') fail('media path config', 'unexpected media_folder/public_folder');
  else if (generated !== '/Setvice/media/cms-new-upload.jpg' || !generated.startsWith('/Setvice/')) fail('media path', 'CMS URL missing /Setvice/');
  else ok('CMS-generated media path is /Setvice/media/...');
}

{
  const lead = readFileSync(join(root, 'api/lead.js'), 'utf8');
  const crm = readFileSync(join(root, 'api/callback-v3.js'), 'utf8');
  if (lead.includes('cms-oauth') || lead.includes('GITHUB_OAUTH_')) fail('lead isolation', 'lead.js references CMS OAuth');
  else if (crm.includes('cms-oauth') || crm.includes('GITHUB_OAUTH_')) fail('crm isolation', 'callback-v3.js references CMS OAuth');
  else if (!lead.includes('verifyTelegramWebhookSecret') || !crm.includes('verifyTelegramWebhookSecret')) fail('crm isolation', 'webhook verification missing');
  else ok('lead API / Telegram logic is unchanged');
}

if (consoleLines.some(leak)) fail('console leak', 'secret or token appeared in logs');
else ok('secrets stay out of logs and responses');

console.log = originalLog;
console.error = originalError;

if (errors.length) {
  console.error('cms oauth tests failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log(`cms oauth tests ok (${passed})`);
