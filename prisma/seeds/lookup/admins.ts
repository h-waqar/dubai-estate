import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedAdmins(prisma: PrismaClient) {
  const isProduction = process.env.NODE_ENV === "production";
  const adminEmail = isProduction ? "admin@dubaiestateguide.com" : "admin@test.com";
  
  console.log(`⏳ Seeding Admin User (${adminEmail})...`);
  
  const hashedPassword = await bcrypt.hash("1122", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      roles: [Role.SUPER_ADMIN],
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      username: "super_admin",
      roles: [Role.SUPER_ADMIN],
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });
  console.log(`   ✅ Admin User: ${admin.email}`);
  return admin;
}
