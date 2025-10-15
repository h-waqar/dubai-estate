// export default function Newsletter() {
//   return (
//     <section className="py-20 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="rounded-lg bg-card text-card-foreground max-w-4xl mx-auto border-0 shadow-2xl section-bg-light">
//           <div className="p-12 text-center">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6">
//               Stay Updated with Dubai Real Estate
//             </h2>
//             <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
//               Get weekly insights, market updates, and exclusive property deals
//               delivered to your inbox
//             </p>

//             {/* Newsletter Form */}
//             <div className="max-w-md mx-auto mb-12">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <input
//                   type="email"
//                   className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1 h-12 search-focus"
//                   placeholder="Enter your email address"
//                 />
//                 <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-12 px-8">
//                   Subscribe
//                 </button>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
//               <Stat number="15K+" label="Subscribers" />
//               <Stat number="Weekly" label="Updates" />
//               <Stat number="Expert" label="Insights" />
//             </div>

//             <p className="text-sm text-muted-foreground">
//               No spam, unsubscribe at any time. We respect your privacy.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Stat({ number, label }) {
//   return (
//     <div className="text-center">
//       <div className="text-4xl font-bold text-primary mb-2">{number}</div>
//       <div className="text-muted-foreground">{label}</div>
//     </div>
//   );
// }

// src/components/sections/Newsletter.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface StatProps {
  number: string;
  label: string;
}

const Stat = ({ number, label }: StatProps) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">
        {number}
      </div>
      <div className="text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
};

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement newsletter subscription API
    setTimeout(() => {
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-white dark:bg-gray-800">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Stay Updated with Dubai Real Estate
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Get weekly insights, market updates, and exclusive property deals
              delivered to your inbox
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-yellow-500"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Stat number="15K+" label="Subscribers" />
              <Stat number="Weekly" label="Updates" />
              <Stat number="Expert" label="Insights" />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
