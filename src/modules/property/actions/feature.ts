"use server";
import { FeatureService } from "@/modules/property/services/feature";

export async function listFeatures() {
  return FeatureService.list();
}

export async function getFeature(id: number) {
  return FeatureService.get(id);
}

export async function createFeature(data: unknown) {
  return FeatureService.create(data);
}

export async function updateFeature(id: number, data: unknown) {
  return FeatureService.update(id, data);
}

export async function deleteFeature(id: number) {
  return FeatureService.delete(id);
}
