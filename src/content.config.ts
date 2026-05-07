import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection, type SchemaContext } from 'astro:content'

const stringish = z.union([z.string(), z.number()]).transform(String)

const dimensionsAndPriceItem = z.object({
  dimensions: stringish,
  price: stringish,
})

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
})

const serviceSchema = <T extends readonly [string, ...string[]]>(types: T) =>
  ({ image }: SchemaContext) =>
    z.object({
      seo: seoSchema.optional(),
      title: z.string(),
      image: image(),
      materials: z.string(),
      dimensionsAndPrice: z.array(dimensionsAndPriceItem).min(1),
      type: z.enum(types),
    })

const monumentTypes = ['vertical', 'horizontal', 'granite-cross', 'combined', 'carved', 'marble-chips', 'faceted'] as const
const complexTypes = ['vertical', 'horizontal', 'granite-cross', 'combined', 'carved', 'marble-chips'] as const
const landscapingTypes = ['socles', 'curbs'] as const
const fenceTypes = ['metal', 'forged', 'granite'] as const
const benchAndTableTypes = ['benches', 'tables', 'sets'] as const
const crossTypes = ['granite', 'metal'] as const
const monumentDesignTypes = ['portrait-engraving', 'letter-engraving', 'fonts', 'metal-letters', 'religious-engraving', 'engraving-complex'] as const
const accessoryTypes = ['vases', 'lamps', 'small-crosses', 'flowers'] as const

const monuments = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/monuments' }),
  schema: serviceSchema(monumentTypes),
})

const landscaping = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/landscaping' }),
  schema: serviceSchema(landscapingTypes),
})

const complexes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/complexes' }),
  schema: serviceSchema(complexTypes),
})

const fences = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/fences' }),
  schema: serviceSchema(fenceTypes),
})

const benchesAndTables = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/benches-and-tables' }),
  schema: serviceSchema(benchAndTableTypes),
})

const crosses = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/crosses' }),
  schema: serviceSchema(crossTypes),
})

const monumentDesign = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/monument-design' }),
  schema: serviceSchema(monumentDesignTypes),
})

const accessories = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/accessories' }),
  schema: serviceSchema(accessoryTypes),
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
      title: z.string(),
    }),
})

export const collections = {
  monuments,
  landscaping,
  complexes,
  fences,
  'benches-and-tables': benchesAndTables,
  crosses,
  'monument-design': monumentDesign,
  accessories,
  gallery,
}
