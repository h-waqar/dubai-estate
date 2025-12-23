import PropertyListings from "@/components/properties/PropertyListings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Off-Plan Projects in Dubai | Dubai Estate",
    description: "Discover the latest off-plan projects and investment opportunities in Dubai.",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function OffPlanPage({ searchParams }: PageProps) {
    return <PropertyListings searchParams={searchParams} forcedListingType="off_plan" />;
}
