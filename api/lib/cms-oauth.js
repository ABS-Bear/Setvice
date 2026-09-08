import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const CMS_PAGES_ORIGIN = 'https://abs-bear.github.io';
export const CMS_OAUTH_PROXY_ORIGIN = 'https://abservice-leads-v2.vercel.app';
export const CMS_AUTH_PATH = '/api/cms-auth';
export const CMS_CALLBACK_PATH = '/api/cms-callback';
export const CMS_OAUTH_STATE_COOKIE = 'ab_cms_oauth_state';
export const CMS_OAUTH_SCOPE = 'public_repo';

const STATE_TTL_SEC = 600;

export function cmsOauthConfigured(env = process.env) {
  return Boolean(String(env.GITHUB_OAUTH_CLIENT_ID || '').trim() && String(env.GITHUB_OAUTH_CLIENT_SECRET || '').trim());
}

export function isCmsFrontendOrigin(origin) {
  return String(origin || '') === CMS_PAGES_ORIGIN;
}

export function cmsCorsHeaders(req) {
  const origin = req?.headers?.get?.('origin') || '';
  return {
    'Access-Control-Allow-Origin': isCmsFrontendOrigin(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

export function cmsOptions(req) {
  return new Response(null, { status: 204, headers: cmsCorsHeaders(req) });
}

export function rejectIfDisallowedOrigin(req) {
  const origin = req?.headers?.get?.('origin') || '';
  if (origin && !isCmsFrontendOrigin(origin)) {
    return new Response(JSON.stringify({ ok: false, error: 'Origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  }
  return null;
}

export function createOauthState(env = process.env) {
  const nonce = randomBytes(32).toString('hex');
  const sig = createHmac('sha256', String(env.GITHUB_OAUTH_CLIENT_SECRET || '')).update(nonce).digest('hex');
  return `${nonce}.${sig}`;
}

export function verifyOauthState(state, env = process.env) {
  const raw = String(state || '');
  const dot = raw.lastIndexOf('.');
  if (dot < 1) return false;
  const nonce = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!nonce || !sig) return false;
  const expected = createHmac('sha256', String(env.GITHUB_OAUTH_CLIENT_SECRET || '')).update(nonce).digest('hex');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || a.length === 0) {
    if (a.length > 0) timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function stateCookie(value) {
  return `${CMS_OAUTH_STATE_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${STATE_TTL_SEC}`;
}

export function readCookie(req, name) {
  const raw = String(req?.headers?.get?.('cookie') || '');
  const parts = raw.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return '';
}

export function authorizeUrl(state, env = process.env) {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', String(env.GITHUB_OAUTH_CLIENT_ID || ''));
  url.searchParams.set('scope', CMS_OAUTH_SCOPE);
  url.searchParams.set('state', state);
  url.searchParams.set('redirect_uri', `${CMS_OAUTH_PROXY_ORIGIN}${CMS_CALLBACK_PATH}`);
  return url.toString();
}

function html(body) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>ABService CMS</title></head><body>${body}</body></html>`;
}

export function safeFailHtml(message) {
  const safe = JSON.stringify(String(message || 'authorization failed'));
  return html(`<p>CMS authorization failed.</p><script>
(function(){
  var origin = ${JSON.stringify(CMS_PAGES_ORIGIN)};
  var msg = 'authorization:github:error:' + ${safe};
  if (window.opener) window.opener.postMessage(msg, origin);
})();
</script>`);
}

export function successHtml(token) {
  const payload = JSON.stringify({ token: String(token || ''), provider: 'github' });
  return html(`<p>CMS authorization complete. You can close this window.</p><script>
(function(){
  var origin = ${JSON.stringify(CMS_PAGES_ORIGIN)};
  var payload = ${JSON.stringify(`authorization:github:success:${payload}`)};
  function send(){ if (window.opener) window.opener.postMessage(payload, origin); }
  window.addEventListener('message', function(e){ if (e.origin !== origin) return; send(); window.close(); });
  send();
  if (window.opener) window.opener.postMessage('authorizing:github', origin);
})();
</script>`);
}

export function startCmsOauth(req, env = process.env) {
  const blocked = rejectIfDisallowedOrigin(req);
  if (blocked) return blocked;
  if (!cmsOauthConfigured(env)) {
    return new Response(JSON.stringify({ ok: false, error: 'cms oauth not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  }
  const state = createOauthState(env);
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl(state, env),
      'Set-Cookie': stateCookie(state),
      ...cmsCorsHeaders(req)
    }
  });
}

export async function finishCmsOauth(req, env = process.env, fetchImpl = globalThis.fetch) {
  const blocked = rejectIfDisallowedOrigin(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const ghError = url.searchParams.get('error');
  if (ghError) {
    return new Response(safeFailHtml('github authorization error'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  }
  if (!cmsOauthConfigured(env)) {
    return new Response(safeFailHtml('cms oauth not configured'), {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  }
  const queryState = url.searchParams.get('state') || '';
  const cookieState = readCookie(req, CMS_OAUTH_STATE_COOKIE);
  if (!queryState || !cookieState || queryState !== cookieState || !verifyOauthState(queryState, env)) {
    return new Response(safeFailHtml('invalid oauth state'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  }
  const code = url.searchParams.get('code') || '';
  if (!code) {
    return new Response(safeFailHtml('missing authorization code'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  }
  try {
    const tokenRes = await fetchImpl('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: `${CMS_OAUTH_PROXY_ORIGIN}${CMS_CALLBACK_PATH}`
      })
    });
    const data = await tokenRes.json();
    const token = String(data?.access_token || '');
    if (!token) {
      return new Response(safeFailHtml('github token exchange failed'), {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8', ...cmsCorsHeaders(req) }
      });
    }
    return new Response(successHtml(token), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  } catch {
    return new Response(safeFailHtml('github token exchange failed'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8', ...cmsCorsHeaders(req) }
    });
  }
}
