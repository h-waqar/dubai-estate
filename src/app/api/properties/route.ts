import { NextResponse } from "next/server";
import * as propertyService from "@/modules/property/services/listProperties";

export async function GET() {
  const { data: properties } = await propertyService.listProperties();
  return NextResponse.json(properties);
}
