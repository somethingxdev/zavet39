import { defineCollection, z } from 'astro:content'

const monuments = defineCollection({
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