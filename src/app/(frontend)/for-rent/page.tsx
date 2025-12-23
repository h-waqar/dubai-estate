import PropertyListings from "@/components/properties/PropertyListings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Properties For Rent in Dubai | Dubai Estate",
    description: "Find the best luxury properties for rent in Dubai.",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function ForRentPage({ searchParams }: PageProps) {
    return <PropertyListings searchParams={searchParams} forcedListingType="rent" />;
}
