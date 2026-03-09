import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import sveltia from 'astro-sveltia-cms'
// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'Montserrat',
        cssVariable: '--font-base',
        formats: ['woff2'],
        weights: [400, 500, 600, 700],
        subsets: ['cyrillic'],
      },
      {
        provider: fontProviders.local(),
        name: 'Custom',
        cssVariable: '--font-heading',
        options: {
          variants: [
            {
              weight: 400,
              style: 'normal',
              src: ['./src/assets/fonts/faberge-regular.otf'],
            },
          ],
        },
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

})
