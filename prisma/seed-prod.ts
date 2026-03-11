import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding PRODUCTION database...");

    // --- 1. Entitlement Definitions ---
    const entitlementDefs = [
        { code: "PROPERTY_SLOT", description: "Allows creating one property listing" },
        { code: "PROJECT_SLOT", description: "Allows creating one project listing" },
        { code: "PROPERTY_FEATURE_SLOT", description: "Allows featuring a property listing" },
        { code: "PROJECT_FEATURE_SLOT", description: "Allows featuring a project listing" }
    ];

    for (const def of entitlementDefs) {
        await prisma.entitlementDefinition.upsert({
            where: { code: def.code },
            update: def,
            create: def,
        });
        console.log(`✅ Entitlement Definition: ${def.code}`);
    }

    // --- 2. Admin User ---
    const adminEmail = "admin@dubaiestateguide.com";
    // The user requested the password be encrypted. We use bcrypt to hash '1122'
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
        },
    });
    console.log(`✅ Admin User Encrypted & Created: ${admin.email}`);

    // Note: We skip Properties, Projects, Plans, and Agent accounts deliberately for Production.

    console.log("✨ Production seeding completed!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
