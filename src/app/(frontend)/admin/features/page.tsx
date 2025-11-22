import { listFeatures } from "@/modules/property/actions/feature";
import FeatureClient from "./FeatureClient";
import { Card } from "@/components/ui/card";

export default async function FeaturesPage() {
  const features = await listFeatures();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Property Features</h1>
      </div>
      <Card className="p-4">
        <FeatureClient initialFeatures={features} />
      </Card>
    </div>
  );
}
