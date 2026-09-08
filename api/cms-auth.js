import { cmsOptions, startCmsOauth } from './lib/cms-oauth.js';

export function OPTIONS(req) {
  return cmsOptions(req);
}

export function GET(req) {
  return startCmsOauth(req);
}
