"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface QuotasPreviewProps {
  entitlements: Record<string, { total: number; used: number; sources: Record<string, number> }>;
  promotions: any[];
}

export function QuotasPreview({ entitlements, promotions }: QuotasPreviewProps) {
  const propertyQuota = entitlements["PROPERTY_SLOT"] || { total: 0, used: 0, sources: {} };
  const projectQuota = entitlements["PROJECT_SLOT"] || { total: 0, used: 0, sources: {} };

  const creditEntries = Object.entries(entitlements).filter(
    ([code]) => code !== "PROPERTY_SLOT" && code !== "PROJECT_SLOT"
  );

  const formatCode = (code: string) => {
    return code
      .replace("_CREDIT", "")
      .replace("_", " ")
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + " Credits";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Listing Quotas */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Listing Quotas</CardTitle>
          <CardDescription>Available slots for your properties and projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Property Slots</span>
              <span className="text-muted-foreground">
                {propertyQuota.used} / {propertyQuota.total}
              </span>
            </div>
            <Progress value={propertyQuota.total > 0 ? (propertyQuota.used / propertyQuota.total) * 100 : 0} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Project Slots</span>
              <span className="text-muted-foreground">
                {projectQuota.used} / {projectQuota.total}
              </span>
            </div>
            <Progress value={projectQuota.total > 0 ? (projectQuota.used / projectQuota.total) * 100 : 0} />
          </div>
        </CardContent>
      </Card>

      {/* Entitlement Credits */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Promotion Credits</CardTitle>
          <CardDescription>Credits for boosting your listings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {creditEntries.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No credits available</p>
             </div>
          ) : creditEntries.map(([code, data], idx) => {
            const available = data.total - data.used;
            
            return (
              <div key={code} className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{formatCode(code)}</span>
                  <Badge variant={available > 0 ? "default" : "secondary"}>
                    {available} Available
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {Object.entries(data.sources).map(([source, count], sIdx) => (
                    <span key={source}>
                      {count} from {source.toLowerCase()}
                      {sIdx < Object.entries(data.sources).length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {Object.keys(data.sources).length === 0 && "0 Credits available"}
                </div>
                {idx < creditEntries.length - 1 && <Separator className="mt-2" />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Active Promotions */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Active Promotions</CardTitle>
          <CardDescription>Currently promoted listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promotions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No active promotions</p>
              </div>
            ) : (
              promotions.map((promo) => (
                <div key={promo.id} className="flex items-start space-x-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">
                      {promo.property?.title || promo.project?.title || "Unknown Listing"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-2 px-1 py-0 h-4 text-[10px]">
                        {promo.type}
                      </Badge>
                      {promo.expiresAt && (
                        <>
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>Expires {format(new Date(promo.expiresAt), "MMM d, yyyy")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
