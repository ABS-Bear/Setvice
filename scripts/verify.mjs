#!/usr/bin/env node
/**
 * Dependency-free post-build verification for Gate 3A.
 * Checks internal links/assets/base paths and a few content/API readiness assertions.
 * Does not print secrets, contacts, chat IDs, or prices.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const basePrefix = '/ArcticBear';
const errors = [];
const notes = [];

function fail(msg) {
  errors.push(msg);
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function read(path) {
  return readFileSync(path, 'utf8');
}

if (!existsSync(dist)) {
  fail('dist/ missing — run npm run build first');
  console.error(errors.join('\n'));
  process.exit(1);
}

const htmlFiles = walk(dist).filter((p) => extname(p) === '.html');
const assetExt = new Set(['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.woff', '.woff2']);

for (const file of htmlFiles) {
  const html = read(file);
  const hrefs = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (!href || href.startsWith('data:') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('#')) {
      continue;
    }
    if (href.startsWith('/ArcticBear/ArcticBear/')) {
      fail(`double base prefix in ${file}: ${href}`);
      continue;
    }
    if (href.startsWith('/') && !href.startsWith(`${basePrefix}/`) && href !== basePrefix) {
      // allow root-relative only if they are already base-prefixed for this project
      fail(`missing base prefix in ${file}: ${href}`);
      continue;
    }
    if (href.startsWith(basePrefix)) {
      const rel = href.slice(basePrefix.length).split('?')[0].split('#')[0];
      const candidate = join(dist, rel.replace(/^\//, ''));
      const asIndex = join(candidate, 'index.html');
      const exists = existsSync(candidate) || existsSync(asIndex) || existsSync(`${candidate}.html`);
      if (!exists && assetExt.has(extname(rel))) {
        fail(`missing asset for ${href}`);
      }
    }
  }
}

// Stationary required / forbidden copy
const stationaryHtmlPath = join(dist, 'stationary-service', 'index.html');
if (!existsSync(stationaryHtmlPath)) {
  fail('stationary-service page missing from dist');
} else {
  const s = read(stationaryHtmlPath);
  const required = [
    'Москва',
    'запуск в процессе',
    'коммерческий колёсный транспорт',
    'диагностик',
    'Записаться на диагностику',
    'цены формируются',
    'смешанная модель'
  ];
  for (const needle of required) {
    if (!s.toLowerCase().includes(needle.toLowerCase())) fail(`stationary missing required copy: ${needle}`);
  }
  const forbidden = ['holding', 'уточняется', 'будущие материалы', 'SLA', 'гарантия', 'маршрут доставки'];
  for (const needle of forbidden) {
    if (s.toLowerCase().includes(needle.toLowerCase())) fail(`stationary contains forbidden copy: ${needle}`);
  }
  if (/class=["'][^"']*hero-photo/i.test(s) || /style=["'][^"']*hero-abservice\.jpg/i.test(s)) {
    fail('stationary still renders stock hero image');
  }
  if (!s.includes(`${basePrefix}/parts/`)) fail('stationary missing base-path parts link');
  if (/name="location"/i.test(s)) fail('stationary form still shows location field');
}

// Articles landing
const articlesHtmlPath = join(dist, 'articles', 'index.html');
if (!existsSync(articlesHtmlPath)) {
  fail('articles index missing from dist');
} else {
  const a = read(articlesHtmlPath);
  if (/будущие материалы/i.test(a) || /уточняется/i.test(a)) fail('articles landing still uses placeholder future copy');
  if (!/noindex/i.test(a)) fail('articles empty feed missing noindex');
}

// robots / sitemap
const robotsPath = join(dist, 'robots.txt');
const sitemapPath = join(dist, 'sitemap.xml');
if (!existsSync(robotsPath)) fail('robots.txt missing');
else {
  const robots = read(robotsPath);
  if (!/^Disallow:\s*\/ArcticBear\/admin\s*$/im.test(robots)) {
    fail('robots.txt missing base-prefixed /ArcticBear/admin disallow');
  }
  if (!/^Disallow:\s*\/ArcticBear\/admin\/\s*$/im.test(robots)) {
    fail('robots.txt missing base-prefixed /ArcticBear/admin/ disallow');
  }
  if (!/Sitemap:\s*https:\/\/alecmonopoly84-hue\.github\.io\/ArcticBear\/sitemap\.xml/i.test(robots)) {
    fail('robots.txt sitemap URL incorrect');
  }
}
if (!existsSync(sitemapPath)) fail('sitemap.xml missing');
else {
  const sm = read(sitemapPath);
  if (!sm.includes('https://alecmonopoly84-hue.github.io/ArcticBear/')) fail('sitemap missing GitHub Pages base URL');
  if (/gate2b-structure-placeholder/i.test(sm)) fail('draft article leaked into sitemap');
}

// Admin noindex
const adminPath = join(dist, 'admin', 'index.html');
if (existsSync(adminPath)) {
  const admin = read(adminPath);
  if (!/noindex/i.test(admin)) fail('admin index missing noindex');
}

// Schema / API source assertions (repo, not dist)
const configTs = read(join(root, 'src/content/config.ts'));
if (/author/.test(configTs)) fail('articles schema still has author');
if (!/seoTitle/.test(configTs) || !/cover/.test(configTs)) fail('articles schema missing seoTitle/cover');
if (/^\s*slug:/m.test(configTs) && /articles = defineCollection/.test(configTs)) {
  // Astro reserves slug in schema; Decap still edits filename via fields.slug
}
if (!/priceNote/.test(configTs)) fail('services schema missing priceNote');

const adminYml = read(join(root, 'public/admin/config.yml'));
if (/name: author/.test(adminYml)) fail('Decap articles still has author');
if (!/name: priceNote/.test(adminYml)) fail('Decap services missing priceNote');
if (!/name: slug/.test(adminYml)) fail('Decap articles missing slug field');

const lead = read(join(root, 'api/lead.js'));
const cb = read(join(root, 'api/callback-v3.js'));
if (!/TELEGRAM_CHAT_ID/.test(lead) || !/TELEGRAM_INTERNAL_ID/.test(lead)) fail('lead.js missing env identifier vars');
if (!/TELEGRAM_CHAT_ID/.test(cb) || !/TELEGRAM_INTERNAL_ID/.test(cb)) fail('callback-v3.js missing env identifier vars');
if (/const CHAT='-?\d+'/.test(lead) || /const INTERNAL='\d+'/.test(lead)) fail('lead.js still has literal chat/internal ids');
if (/const CHAT='-?\d+'/.test(cb) || /const INTERNAL='\d+'/.test(cb)) fail('callback-v3.js still has literal chat/internal ids');

const getLine = cb.split(/\n/).find((l) => l.startsWith('export async function GET'));
if (!getLine || !/legacy-disabled/.test(getLine)) fail('callback-v3 GET not legacy-disabled');
if (getLine && /await install\(/.test(getLine)) fail('callback-v3 GET still calls install');
if (getLine && /setWebhook/.test(getLine)) fail('callback-v3 GET still references setWebhook');

const secretLib = read(join(root, 'api/lib/telegram-webhook-secret.js'));
if (!/TELEGRAM_WEBHOOK_SECRET/.test(secretLib)) fail('webhook secret lib missing TELEGRAM_WEBHOOK_SECRET');
if (!/X-Telegram-Bot-Api-Secret-Token/.test(secretLib)) fail('webhook secret lib missing X-Telegram-Bot-Api-Secret-Token');
if (!/timingSafeEqual/.test(secretLib)) fail('webhook secret compare is not timing-safe');
if (!/verifyTelegramWebhookSecret/.test(lead) || !/isTelegramWebhookUpdate/.test(lead)) fail('lead.js missing webhook secret verification');
if (!/verifyTelegramWebhookSecret/.test(cb)) fail('callback-v3.js missing webhook secret verification');
if (!existsSync(join(root, 'scripts/telegram-webhook-secret.test.mjs'))) fail('webhook secret tests missing');
const envExample = read(join(root, '.env.example'));
if (!/^TELEGRAM_WEBHOOK_SECRET=\s*$/m.test(envExample)) fail('.env.example must list empty TELEGRAM_WEBHOOK_SECRET=');

// prices.json must be unchanged vs intentional non-touch; presence only here
if (!existsSync(join(root, 'src/content/settings/prices.json'))) fail('prices.json missing');

// Tracked secret-like filenames should stay out of git tracking intent
const gitignore = read(join(root, '.gitignore'));
if (!/\.env\.\*/.test(gitignore) || !/!\.env\.example/.test(gitignore)) fail('.gitignore missing .env.* allowlist pattern');

if (errors.length) {
  console.error('verify failed:');
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log('verify ok');
for (const n of notes) console.log(`note: ${n}`);
console.log(`checked html files: ${htmlFiles.length}`);
