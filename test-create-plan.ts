import { PricingService } from "./src/modules/pricing/services/service";

async function run() {
  try {
    const data = {
      name: "Grand Scheme Planning",
      slug: "grand-scheme-planning",
      description: "This is just a test plan to test out the new Grant Schema",
      type: "SUBSCRIPTION" as any,
      priceMonthly: 125,
      priceYearly: 100,
      priceOneTime: 0,
      isActive: true,
      paypalPlanId: "",
      paypalProductId: "",
      entitlements: [
        { definitionId: "cm6uik4s0000a6clik02nzh0y", amount: 1 },
        { definitionId: "cm6uik4s0000a6clik02nzh0z", amount: 1 },
        { definitionId: "cm6uik4s0000a6clik02nzh0x", amount: 1 }
      ]
    };
    
    // Attempt creation
    const plan = await PricingService.createPlan(data);
    console.log("Success:", plan);
  } catch (err: any) {
    console.error("FAIL:", err.message);
  }
}

run();
