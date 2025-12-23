import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyBreadcrumb from "@/components/properties/PropertyBreadcrumb";
import PropertyHeader from "@/components/properties/PropertyHeader";
import { listProperties } from "@/modules/property/services/listProperties";
import { prisma } from "@/lib/prisma";

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import PropertyListings from "@/components/properties/PropertyListings";

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Properties = async ({ searchParams }: PropertiesPageProps) => {
  return <PropertyListings searchParams={searchParams} />;
};

export default Properties;
