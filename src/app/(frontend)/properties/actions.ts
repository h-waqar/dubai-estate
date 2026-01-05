"use server";

import { listProperties, PropertyFilters } from "@/modules/property/services/listProperties";
import { mapPropertyToCard } from "@/modules/property/utils/mapPropertyToCard";

export async function fetchProperties(filters: PropertyFilters) {
  const { data, total } = await listProperties(filters);
  
  return {
    data: data.map(mapPropertyToCard),
    total,
  };
}
