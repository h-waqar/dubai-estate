// app/(frontend)/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import FeaturedArticles from "@/components/sections/FeaturedArticles";
import Newsletter from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="relative">
        <Hero />
        <Categories />
        <FeaturedProperties />
        <FeaturedArticles />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
