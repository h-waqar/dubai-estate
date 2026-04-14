import { Prisma } from "@prisma/client";
console.log("Prisma.Decimal:", Prisma.Decimal);
const d = new Prisma.Decimal(10.5);
console.log("Decimal value:", d.toString());
