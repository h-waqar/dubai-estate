import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
  console.log("⏳ Seeding Users...");

  // Agent
  const agentEmail = "agent@test.com";
  const agentUsername = "john_agent";
  const hashedAgentPassword = await bcrypt.hash("1122", 10);

  // Remove any user with the same username but different email to avoid unique constraint errors
  await prisma.user.deleteMany({
    where: {
      username: agentUsername,
      NOT: { email: agentEmail },
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: agentEmail },
    update: {
      password: hashedAgentPassword,
      username: agentUsername,
      emailVerified: new Date(),
    },
    create: {
      email: agentEmail,
      name: "John Agent",
      username: agentUsername,
      roles: [Role.USER],
      password: hashedAgentPassword,
      emailVerified: new Date(),
      pricingPlan: {
        connect: { slug: "gold" },
      },
    },
  });
  console.log(`   ✅ Agent User: ${agent.email}`);

  // Shadow Agent
  const shadowEmail = "shadow_agent_01@example.com";
  const shadowUsername = "shadow_agent_01";
  const hashedShadowPassword = await bcrypt.hash("shadow123", 10);

  const shadowAgent = await prisma.user.upsert({
    where: { email: shadowEmail },
    update: {
      password: hashedShadowPassword,
      username: shadowUsername,
      emailVerified: new Date(),
    },
    create: {
      email: shadowEmail,
      name: "Shadow Agent One",
      username: shadowUsername,
      roles: [Role.USER],
      password: hashedShadowPassword,
      emailVerified: new Date(),
      pricingPlan: {
        connect: { slug: "silver" },
      },
    },
  });
  console.log(`   ✅ Shadow Agent: ${shadowAgent.email}`);

  return { agent, shadowAgent };
}
