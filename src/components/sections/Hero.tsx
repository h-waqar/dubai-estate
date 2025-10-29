// import Image from "next/image";

// export default function Hero() {
//   return (
//     <section className="relative min-h-[70vh] flex items-center justify-center">
//       {/* Background Image */}
//       <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
//         <Image
//           src="/assets/dubai-hero.jpg"
//           alt="Dubai Estate"
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-black/60"></div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 container mx-auto px-4 text-center text-white">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
//             Your Guide to
//             <br />
//             <span className="golden-accent">Dubai Real Estate</span>
//           </h1>
//           <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto">
//             Expert insights, market trends, and comprehensive guides for
//             Dubai&apos;s luxury property market
//           </p>

//           {/* Search Bar */}
//           <div className="max-w-2xl mx-auto mb-16">
//             <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-lg">
//               <input
//                 className="flex w-full rounded-md border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1 search-focus bg-white/90 text-black border-0 h-12"
//                 placeholder="Search properties, neighborhoods..."
//               />
//               <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-12 px-8">
//                 <SearchIcon className="w-5 h-5 mr-2" />
//                 Search
//               </button>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
//             <Stat number="500+" label="Articles" />
//             <Stat number="50K+" label="Readers" />
//             <Stat number="25+" label="Years Experience" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Stat({ number, label }) {
//   return (
//     <div className="text-center">
//       <div className="text-4xl md:text-5xl font-bold golden-accent mb-2">
//         {number}
//       </div>
//       <div className="text-lg text-gray-300">{label}</div>
//     </div>
//   );
// }

// function SearchIcon({ className }) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className={className}
//     >
//       <circle cx="11" cy="11" r="8"></circle>
//       <path d="m21 21-4.3-4.3"></path>
//     </svg>
//   );
// }

// src/components/sections/Hero.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StatProps {
  number: string;
  label: string;
}

const Stat = ({ number, label }: StatProps) => {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">
        {number}
      </div>
      <div className="text-lg text-gray-200 dark:text-gray-300">{label}</div>
    </div>
  );
};

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/dubai-hero.jpg"
          alt="Dubai Estate"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Guide to
            <br />
            <span className="text-yellow-500 dark:text-yellow-400">
              Dubai Real Estate
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 dark:text-gray-300 max-w-3xl mx-auto">
            Expert insights, market trends, and comprehensive guides for
            Dubai&apos;s luxury property market
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-lg">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, neighborhoods..."
                className="flex-1 bg-white/90 dark:bg-gray-800 text-gray-900 dark:text-white border-0 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-yellow-500"
              />
              <Button
                type="submit"
                className="h-12 px-8 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Stat number="500+" label="Articles" />
            <Stat number="50K+" label="Readers" />
            <Stat number="25+" label="Years Experience" />
          </div>
        </div>
      </div>
    </section>
  );
}
