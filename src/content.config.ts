import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const dimensionsAndPriceItemSchema = z.object({
  dimensions: z.string().optional(),
  price: z.string().optional(),
})

const serviceSchema = ({ image }: { image: () => any }) =>
  z.object({
    title: z.string(),
    image: image(),
    materials: z.string(),
    dimensionsAndPrice: z.array(dimensionsAndPriceItemSchema).optional(),
    dimensions: z.string().optional(),
    price: z.string().optional(),
    type: z.string().optional(),
  })
  .transform((data) => {
    const normalizedFromList = (data.dimensionsAndPrice ?? [])
      .map((item) => ({
        dimensions: item.dimensions?.trim() ?? '',
        price: item.price?.trim() ?? '',
      }))
      .filter((item) => item.dimensions || item.price)

    const legacyDimensions = data.dimensions?.trim() ?? ''
    const legacyPrice = data.price?.trim() ?? ''

    const normalizedDimensionsAndPrice =
      normalizedFromList.length > 0
        ? normalizedFromList
        : legacyDimensions || legacyPrice
          ? [{ dimensions: legacyDimensions, price: legacyPrice }]
          : undefined

    return {
      ...data,
      dimensionsAndPrice: normalizedDimensionsAndPrice,
    }
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
  loader: file('./src/data/gallery.json', {
    parser: (text) =>
      JSON.parse(text).items.map((item: { image: string; alt: string }, index: number) => ({
        id: `gallery-${index + 1}`,
        ...item,
        title: item.alt,
      })),
  }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string(),
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
