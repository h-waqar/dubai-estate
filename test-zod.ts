import { createPricingSchema } from "./src/modules/pricing/validators/createPricing.validator";

function testValidation() {
  const data = {
    name: "Grand Scheme Planning",
    slug: "grand-scheme-planning",
    description: "This is just a test plan to test out the new Grant Schema",
    type: "SUBSCRIPTION",
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

  try {
    const valid = createPricingSchema.parse(data);
    console.log("Validation Success:", valid);
  } catch(e) {
    console.log("Validation Error:", e);
  }
}

testValidation();
