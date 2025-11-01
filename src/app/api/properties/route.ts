import { NextResponse } from "next/server";
import * as propertyService from "@/modules/property/services/service";

export async function GET() {
  const properties = await propertyService.listProperties();
  return NextResponse.json(properties);
}
