import type { ServiceCategorySlug } from '@/data/service-categories'
import monumentTypes from '@/data/monuments/types.json'
import accessoryTypes from '@/data/accessories/types.json'
import fenceTypes from '@/data/fences/types.json'

export type ServiceTypeItem = {
  slug: string
  title: string
}

const SERVICE_TYPES_BY_CATEGORY: Partial<Record<ServiceCategorySlug, ServiceTypeItem[]>> = {
  monuments: monumentTypes,
  fences: fenceTypes,
  accessories: accessoryTypes,
}

export function getServiceTypesByCategory(categorySlug: ServiceCategorySlug): ServiceTypeItem[] {
  return SERVICE_TYPES_BY_CATEGORY[categorySlug] ?? []
}
