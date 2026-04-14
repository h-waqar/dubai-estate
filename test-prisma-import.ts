import { Prisma } from "@prisma/client";
console.log("Prisma.Decimal:", Prisma.Decimal);
const d = new Prisma.Decimal(12.3);
console.log("d:", d.toString());
