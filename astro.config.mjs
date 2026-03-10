import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Montserrat',
      cssVariable: '--font-base',
      formats: ['woff2'],
      weights: [400, 500, 600, 700],
      subsets: ['cyrillic', 'latin'],
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

  vite: {
    plugins: [tailwindcss()],
  },
})
