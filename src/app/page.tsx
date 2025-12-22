// app/(frontend)/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import FeaturedArticles from "@/components/sections/FeaturedArticles";
import Newsletter from "@/components/sections/Newsletter";
import { StatsFeatureSection } from "@/components/sections/StatsFeatureSection";
import { DevelopersCarousel } from "@/components/sections/DevelopersCarousel";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const propertyTypes = await prisma.propertyType.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="relative">
        <Hero propertyTypes={propertyTypes} />
        {/* <Categories /> */}
        <FeaturedProperties />
        <DevelopersCarousel />
        <FeaturedProjectsSection />
        <StatsFeatureSection />
        <FeaturedArticles />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
