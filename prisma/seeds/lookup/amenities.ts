import { PrismaClient } from "@prisma/client";

export async function seedAmenities(prisma: PrismaClient) {
  console.log("⏳ Seeding Project Amenities...");
  const projectAmenities = [
    { name: "Infinity Pool", icon: "waves", category: "Leisure" },
    { name: "State-of-the-art Gym", icon: "dumbbell", category: "Wellness" },
    { name: "Private Beach Access", icon: "umbrella", category: "Leisure" },
    { name: "Kids Club", icon: "baby", category: "Family" },
    { name: "Concierge", icon: "user", category: "Service" },
    { name: "Valet Parking", icon: "car", category: "Service" },
  ];

  for (const amenity of projectAmenities) {
    await prisma.projectAmenity.upsert({
      where: { name: amenity.name },
      update: amenity,
      create: amenity,
    });
    console.log(`   ✅ Project Amenity: ${amenity.name}`);
  }
}
