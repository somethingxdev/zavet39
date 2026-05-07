export type ServiceCategorySlug =
  | 'monuments'
  | 'landscaping'
  | 'complexes'
  | 'socles'
  | 'fences'
  | 'benches-and-tables'
  | 'crosses'
  | 'monument-design'
  | 'accessories'

export type ServiceCollectionName = ServiceCategorySlug

export type ServiceCategory = {
  slug: ServiceCategorySlug
  title: string
  collection: ServiceCollectionName
  hasTypeFilters: boolean
}

export const SERVICE_CATEGORIES = [
  {
    slug: 'monuments',
    title: 'Памятники',
    collection: 'monuments',
    hasTypeFilters: true,
  },
  {
    slug: 'landscaping',
    title: 'Благоустройство',
    collection: 'landscaping',
    hasTypeFilters: false,
  },
  {
    slug: 'complexes',
    title: 'Комплексы',
    collection: 'complexes',
    hasTypeFilters: false,
  },
  {
    slug: 'socles',
    title: 'Цоколи',
    collection: 'socles',
    hasTypeFilters: false,
  },
  {
    slug: 'fences',
    title: 'Ограды',
    collection: 'fences',
    hasTypeFilters: true,
  },
  {
    slug: 'benches-and-tables',
    title: 'Лавочки и столики',
    collection: 'benches-and-tables',
    hasTypeFilters: false,
  },
  {
    slug: 'crosses',
    title: 'Кресты',
    collection: 'crosses',
    hasTypeFilters: false,
  },
  {
    slug: 'monument-design',
    title: 'Оформление памятника',
    collection: 'monument-design',
    hasTypeFilters: false,
  },
  {
    slug: 'accessories',
    title: 'Аксессуары',
    collection: 'accessories',
    hasTypeFilters: true,
  },
] as const satisfies readonly ServiceCategory[]

export const SERVICE_CATEGORY_MAP: Record<ServiceCategorySlug, ServiceCategory> = SERVICE_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.slug] = category
    return acc
  },
  {} as Record<ServiceCategorySlug, ServiceCategory>,
)

export function isServiceCategorySlug(value: string): value is ServiceCategorySlug {
  return value in SERVICE_CATEGORY_MAP
}

export function getServiceCategoryBySlug(slug: string): ServiceCategory | undefined {
  if (!isServiceCategorySlug(slug)) return undefined
  return SERVICE_CATEGORY_MAP[slug]
}
