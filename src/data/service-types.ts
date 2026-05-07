import type { ServiceCategorySlug } from '@/data/service-categories'
import monumentTypes from '@/data/monuments/types.json'
import accessoryTypes from '@/data/accessories/types.json'
import fenceTypes from '@/data/fences/types.json'
import crossTypes from '@/data/crosses/types.json'
import benchAndTableTypes from '@/data/benches-and-tables/types.json'
import monumentDesignTypes from '@/data/monument-design/types.json'
import landscapingTypes from '@/data/landscaping/types.json'

export type ServiceTypeItem = {
  slug: string
  title: string
}

const SERVICE_TYPES_BY_CATEGORY: Partial<Record<ServiceCategorySlug, ServiceTypeItem[]>> = {
  monuments: monumentTypes,
  fences: fenceTypes,
  accessories: accessoryTypes,
  crosses: crossTypes,
  'benches-and-tables': benchAndTableTypes,
  'monument-design': monumentDesignTypes,
  landscaping: landscapingTypes,
}

export function getServiceTypesByCategory(categorySlug: ServiceCategorySlug): ServiceTypeItem[] {
  return SERVICE_TYPES_BY_CATEGORY[categorySlug] ?? []
}
