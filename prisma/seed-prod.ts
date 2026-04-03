import "dotenv/config";
import { PrismaClient, Role, PlanType } from "@prisma/client";
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

    // --- 2. Pricing Plans ---
    console.log("⏳ Seeding Pricing Plans...");
    const plans = [
        {
            name: "Silver Package",
            slug: "silver",
            description: "Standard visibility for agents.",
            type: PlanType.SUBSCRIPTION,
            priceMonthly: "10",
            priceYearly: "100",
            priceOneTime: "0",
            isActive: true,
            entitlements: [
                { code: "PROPERTY_SLOT", amount: 10 },
                { code: "PROPERTY_FEATURE_SLOT", amount: 1 },
            ],
        },
        {
            name: "Gold Package",
            slug: "gold",
            description: "Premium visibility and more listings.",
            type: PlanType.SUBSCRIPTION,
            priceMonthly: "25",
            priceYearly: "250",
            priceOneTime: "0",
            isActive: true,
            entitlements: [
                { code: "PROPERTY_SLOT", amount: 50 },
                { code: "PROPERTY_FEATURE_SLOT", amount: 5 },
            ],
        },
        {
            name: "Project Listing",
            slug: "project-listing",
            description: "One-time fee for listing a project.",
            type: PlanType.ONE_TIME,
            priceMonthly: "0",
            priceYearly: "0",
            priceOneTime: "100",
            isActive: true,
            entitlements: [
                { code: "PROJECT_SLOT", amount: 1 },
                { code: "PROJECT_FEATURE_SLOT", amount: 1 },
            ],
        },
    ];

    for (const planData of plans) {
        const { entitlements, ...rest } = planData;
        const plan = await prisma.pricingPlan.upsert({
            where: { slug: rest.slug },
            update: rest,
            create: rest,
        });
        console.log(`✅ Plan: ${plan.name}`);

        for (const ent of entitlements) {
            const definition = await prisma.entitlementDefinition.findUnique({
                where: { code: ent.code },
            });

            if (definition) {
                await prisma.planEntitlement.upsert({
                    where: {
                        planId_definitionId: {
                            planId: plan.id,
                            definitionId: definition.id,
                        },
                    },
                    update: { amount: ent.amount },
                    create: {
                        planId: plan.id,
                        definitionId: definition.id,
                        amount: ent.amount,
                    },
                });
                console.log(`   └─ ✅ Entitlement: ${ent.code} (${ent.amount})`);
            }
        }
    }

    // --- 3. Admin User ---
    const adminEmail = "admin@dubaiestateguide.com";
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
    console.log(`✅ Admin User Encrypted & Created: ${admin.email}`);

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
