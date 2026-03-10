import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'
const monuments = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/monuments' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    materials: z.string(),
    dimensions: z.string(),
    price: z.string().optional(),
    type: z.string(),
    category: z.string(),
  }),
})

export const collections = {
  monuments,
}
