import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alecmonopoly84-hue.github.io',
  base: '/ArcticBear',
  output: 'static',
  build: {
    assets: '_astro'
  }
});
