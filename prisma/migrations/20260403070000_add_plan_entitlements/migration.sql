-- CreateTable
CREATE TABLE "PlanEntitlement" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "definitionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "PlanEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanEntitlement_planId_definitionId_key" ON "PlanEntitlement"("planId", "definitionId");

-- AddForeignKey
ALTER TABLE "PlanEntitlement" ADD CONSTRAINT "PlanEntitlement_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanEntitlement" ADD CONSTRAINT "PlanEntitlement_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "EntitlementDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
