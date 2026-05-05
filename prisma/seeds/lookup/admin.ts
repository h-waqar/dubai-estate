import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedAdmin(prisma: PrismaClient) {
  console.log("⏳ Seeding Admin...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@test.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "1122";
  const adminUsername = "super_admin";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Remove any user with the same username but different email to avoid unique constraint errors
  await prisma.user.deleteMany({
    where: {
      username: adminUsername,
      NOT: { email: adminEmail },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      username: adminUsername,
      emailVerified: new Date(),
      roles: {
        set: [Role.SUPER_ADMIN],
      },
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      username: adminUsername,
      roles: [Role.SUPER_ADMIN],
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });
  
  console.log(`   ✅ Admin User: ${admin.email}`);
  return admin;
}
