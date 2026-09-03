import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const contacts = JSON.parse(readFileSync(new URL('./src/content/settings/contacts.json', import.meta.url), 'utf8'));
const publicUrl = new URL(contacts.siteUrl);
const base = publicUrl.pathname.replace(/\/$/, '');

export default defineConfig({
  site: publicUrl.origin,
  base,
  output: 'static',
  build: {
    assets: '_astro'
  }
});
