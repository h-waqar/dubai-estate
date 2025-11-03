import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/modules/property/components/PropertyForm";

export default async function NewPropertyPage() {
  const propertyTypes = await prisma.propertyType.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create New Property</h1>
        <p className="text-muted-foreground mb-8">Fill out the details below to add a new listing.</p>
        <PropertyForm propertyTypes={propertyTypes} />
      </div>
    </div>
  );
}
