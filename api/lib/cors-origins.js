export const TEMPORARY_LEGACY_PAGES_ORIGIN = 'https://alecmonopoly84-hue.github.io';
export const CUSTOMER_PAGES_ORIGIN = 'https://abs-bear.github.io';

/**
 * TEMPORARY MIGRATION ALLOWLIST.
 * Keep the old GitHub Pages origin only until ABS-Bear/Setvice Pages is live
 * and confirmed. Remove TEMPORARY_LEGACY_PAGES_ORIGIN in a post-cutover commit.
 * Do not use a wildcard origin.
 */
export const ALLOWED_FRONTEND_ORIGINS = Object.freeze([
  TEMPORARY_LEGACY_PAGES_ORIGIN,
  CUSTOMER_PAGES_ORIGIN
]);

export function isAllowedFrontendOrigin(origin) {
  return ALLOWED_FRONTEND_ORIGINS.includes(String(origin || ''));
}

export function corsOrigin(req) {
  const origin = req?.headers?.get?.('origin') || '';
  return isAllowedFrontendOrigin(origin) ? origin : '';
}

export function corsHeaders(req) {
  return {
    'Access-Control-Allow-Origin': corsOrigin(req),
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}
