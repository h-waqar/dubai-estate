import PropertyListings from "@/components/properties/PropertyListings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Properties For Sale in Dubai | Dubai Estate",
    description: "Browse the best luxury properties for sale in Dubai. Find your dream home today.",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function ForSalePage({ searchParams }: PageProps) {
    return <PropertyListings searchParams={searchParams} forcedListingType="buy" />;
}
