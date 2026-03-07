// // prisma.config.ts
// import "dotenv/config";
// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//     seed: "tsx prisma/seed.ts",
//   },
//   datasource: {
//     url: env("DIRECT_URL") ?? env("DATABASE_URL"),
//     // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"), // optional if you use one
//   },
// });


// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});