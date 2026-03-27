import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const serviceSchema = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    image: image(),
    materials: z.string(),
    dimensionsAndPrice: z
      .array(
        z.object({
          dimensions: z.string(),
          price: z.string(),
        }),
      )
      .nonempty(),
    type: z.string().optional(),
  })

const monuments = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/monuments' }),
  schema: serviceSchema,
})

const curbs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/curbs' }),
  schema: serviceSchema,
})

const complexes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/complexes' }),
  schema: serviceSchema,
})

const socles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/socles' }),
  schema: serviceSchema,
})

const fences = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/fences' }),
  schema: serviceSchema,
})

const benchesAndTables = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/benches-and-tables' }),
  schema: serviceSchema,
})

const crosses = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/crosses' }),
  schema: serviceSchema,
})

const accessories = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/accessories' }),
  schema: serviceSchema,
})

const gallery = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/gallery' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      alt: z.string(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().optional(),
      order: z.number().default(0),
    }),
})

export const collections = {
  monuments,
  curbs,
  complexes,
  socles,
  fences,
  'benches-and-tables': benchesAndTables,
  crosses,
  accessories,
  gallery,
}
