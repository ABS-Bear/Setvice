export const CUSTOMER_PAGES_ORIGIN = 'https://abs-bear.github.io';

/**
 * Production frontend origin after Setvice Pages cutover.
 * Do not use a wildcard origin.
 */
export const ALLOWED_FRONTEND_ORIGINS = Object.freeze([
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
