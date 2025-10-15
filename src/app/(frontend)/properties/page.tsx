// // src\app\(frontend)\properties\page.tsx
// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Home } from "lucide-react";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import PropertyCard from "@/components/properties/PropertyCard"; // Import the new component
// import property1 from "&/assets/property-1.jpg";
// import property2 from "&/assets/property-2.jpg";
// import property3 from "&/assets/property-3.jpg";

// const allProperties = [
//   {
//     id: 1,
//     image: property1.src,
//     title: "Luxury Apartment in Downtown Dubai",
//     location: "Downtown Dubai",
//     price: "AED 2,500,000",
//     beds: 3,
//     baths: 2,
//     size: "1,850 sq ft",
//     type: "Apartment",
//     featured: true,
//     ref: "LP46485",
//     status: "Ready",
//   },
//   {
//     id: 2,
//     image: property2.src,
//     title: "Marina View Villa",
//     location: "Dubai Marina",
//     price: "AED 8,900,000",
//     beds: 5,
//     baths: 4,
//     size: "4,200 sq ft",
//     type: "Villa",
//     featured: true,
//     ref: "LP46486",
//     status: "Offplan",
//   },
//   {
//     id: 3,
//     image: property3.src,
//     title: "Penthouse with City View",
//     location: "Business Bay",
//     price: "AED 5,750,000",
//     beds: 4,
//     baths: 3,
//     size: "2,800 sq ft",
//     type: "Penthouse",
//     featured: false,
//     ref: "LP46487",
//     status: "Ready",
//   },
//   {
//     id: 4,
//     image: property1.src,
//     title: "Modern Apartment in JBR",
//     location: "Jumeirah Beach Residence",
//     price: "AED 3,200,000",
//     beds: 2,
//     baths: 2,
//     size: "1,400 sq ft",
//     type: "Apartment",
//     featured: false,
//     ref: "LP46488",
//     status: "Ready",
//   },
//   {
//     id: 5,
//     image: property2.src,
//     title: "Waterfront Villa in Palm Jumeirah",
//     location: "Palm Jumeirah",
//     price: "AED 12,500,000",
//     beds: 6,
//     baths: 5,
//     size: "5,200 sq ft",
//     type: "Villa",
//     featured: true,
//     ref: "LP46489",
//     status: "Offplan",
//   },
//   {
//     id: 6,
//     image: property3.src,
//     title: "Studio Apartment in Dubai Marina",
//     location: "Dubai Marina",
//     price: "AED 850,000",
//     beds: 1,
//     baths: 1,
//     size: "650 sq ft",
//     type: "Studio",
//     featured: false,
//     ref: "LP46490",
//     status: "Ready",
//   },
// ];

// const Properties = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [propertyType, setPropertyType] = useState("");
//   const [bedrooms, setBedrooms] = useState("");
//   const [priceRange, setPriceRange] = useState("");
//   const [sortBy, setSortBy] = useState("relevance");

//   const filteredProperties = allProperties.filter((property) => {
//     return (
//       property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       property.location.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   return (
//     <div className="min-h-screen">
//       <Header />

//       {/* Search Header */}
//       <section className="section-bg-light py-8 border-b">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-wrap gap-4 items-center">
//             <Select defaultValue="buy">
//               <SelectTrigger className="w-32">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="buy">Buy</SelectItem>
//                 <SelectItem value="rent">Rent</SelectItem>
//               </SelectContent>
//             </Select>

//             <div className="flex-1 min-w-64">
//               <Input
//                 placeholder="Search Neighborhood, City Or Building"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full"
//               />
//             </div>

//             <Select value={propertyType} onValueChange={setPropertyType}>
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="Property Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="apartment">Apartment</SelectItem>
//                 <SelectItem value="villa">Villa</SelectItem>
//                 <SelectItem value="penthouse">Penthouse</SelectItem>
//                 <SelectItem value="studio">Studio</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={bedrooms} onValueChange={setBedrooms}>
//               <SelectTrigger className="w-32">
//                 <SelectValue placeholder="Beds" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="1">1 Bed</SelectItem>
//                 <SelectItem value="2">2 Beds</SelectItem>
//                 <SelectItem value="3">3 Beds</SelectItem>
//                 <SelectItem value="4+">4+ Beds</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={priceRange} onValueChange={setPriceRange}>
//               <SelectTrigger className="w-32">
//                 <SelectValue placeholder="Price" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="under-1m">Under 1M</SelectItem>
//                 <SelectItem value="1m-5m">1M - 5M</SelectItem>
//                 <SelectItem value="5m-10m">5M - 10M</SelectItem>
//                 <SelectItem value="over-10m">Over 10M</SelectItem>
//               </SelectContent>
//             </Select>

//             <Button className="px-8">Search</Button>
//           </div>
//         </div>
//       </section>

//       {/* Breadcrumb */}
//       <section className="py-4 border-b">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Home className="w-4 h-4 mr-2" />
//             <a href="/" className="hover:text-foreground">
//               Home
//             </a>
//             <span className="mx-2">/</span>
//             <span className="text-foreground font-medium">Dubai</span>
//           </div>
//         </div>
//       </section>

//       {/* Results Header */}
//       <section className="py-6">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold mb-2">
//                 Property for Sale in Dubai
//               </h1>
//               <p className="text-muted-foreground">
//                 {filteredProperties.length} results
//               </p>
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-muted-foreground">Sort by:</span>
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="w-40">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="relevance">Relevance</SelectItem>
//                   <SelectItem value="price-low">Price: Low to High</SelectItem>
//                   <SelectItem value="price-high">Price: High to Low</SelectItem>
//                   <SelectItem value="newest">Newest First</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Properties Grid */}
//       <section className="pb-16">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredProperties.map((property) => (
//               <PropertyCard key={property.id} property={property} />
//             ))}
//           </div>

//           {/* Load More */}
//           <div className="text-center mt-12">
//             <Button size="lg" variant="outline" className="px-8">
//               Load More Properties
//             </Button>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Properties;

// src\app\(frontend)\properties\page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import property1 from "&/assets/property-1.jpg";
import property2 from "&/assets/property-2.jpg";
import property3 from "&/assets/property-3.jpg";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyBreadcrumb from "@/components/properties/PropertyBreadcrumb";
import PropertyHeader from "@/components/properties/PropertyHeader";

const allProperties = [
  {
    id: 1,
    image: property1.src,
    title: "Luxury Apartment in Downtown Dubai",
    location: "Downtown Dubai",
    price: "AED 2,500,000",
    beds: 3,
    baths: 2,
    size: "1,850 sq ft",
    type: "Apartment",
    featured: true,
    ref: "LP46485",
    status: "Ready",
  },
  {
    id: 2,
    image: property2.src,
    title: "Marina View Villa",
    location: "Dubai Marina",
    price: "AED 8,900,000",
    beds: 5,
    baths: 4,
    size: "4,200 sq ft",
    type: "Villa",
    featured: true,
    ref: "LP46486",
    status: "Offplan",
  },
  {
    id: 3,
    image: property3.src,
    title: "Penthouse with City View",
    location: "Business Bay",
    price: "AED 5,750,000",
    beds: 4,
    baths: 3,
    size: "2,800 sq ft",
    type: "Penthouse",
    featured: false,
    ref: "LP46487",
    status: "Ready",
  },
  {
    id: 4,
    image: property1.src,
    title: "Modern Apartment in JBR",
    location: "Jumeirah Beach Residence",
    price: "AED 3,200,000",
    beds: 2,
    baths: 2,
    size: "1,400 sq ft",
    type: "Apartment",
    featured: false,
    ref: "LP46488",
    status: "Ready",
  },
  {
    id: 5,
    image: property2.src,
    title: "Waterfront Villa in Palm Jumeirah",
    location: "Palm Jumeirah",
    price: "AED 12,500,000",
    beds: 6,
    baths: 5,
    size: "5,200 sq ft",
    type: "Villa",
    featured: true,
    ref: "LP46489",
    status: "Offplan",
  },
  {
    id: 6,
    image: property3.src,
    title: "Studio Apartment in Dubai Marina",
    location: "Dubai Marina",
    price: "AED 850,000",
    beds: 1,
    baths: 1,
    size: "650 sq ft",
    type: "Studio",
    featured: false,
    ref: "LP46490",
    status: "Ready",
  },
];

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const filteredProperties = allProperties.filter((property) => {
    return (
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen">
      <Header />

      <PropertyFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <PropertyBreadcrumb />

      <PropertyHeader
        propertyCount={filteredProperties.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Properties Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Properties
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
