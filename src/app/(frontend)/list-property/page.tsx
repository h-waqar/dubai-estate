import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/modules/property/components/PropertyForm";

export default async function ListNewProperty() {
  const propertyTypes = await prisma.propertyType.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PropertyForm propertyTypes={propertyTypes} />
    </>
  );
}
