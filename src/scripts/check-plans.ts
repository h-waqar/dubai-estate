import { prisma } from '../lib/prisma'

async function main() {
  const plans = await prisma.pricingPlan.findMany({
    include: {
      entitlements: {
        include: {
          definition: true
        }
      }
    }
  })
  console.log(JSON.stringify(plans, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
