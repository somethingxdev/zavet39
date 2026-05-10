import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
// https://astro.build/config
export default defineConfig({
  site: 'https://zavet39.ru',

  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
})
