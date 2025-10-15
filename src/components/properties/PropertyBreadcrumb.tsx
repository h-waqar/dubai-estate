// import { Home } from "lucide-react";
// import React from "react";

// const PropertyBreadcrumb = () => {
//   return (
//     <section className="py-4 border-b">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center text-sm text-muted-foreground">
//           <Home className="w-4 h-4 mr-2" />
//           <a href="/" className="hover:text-foreground">
//             Home
//           </a>
//           <span className="mx-2">/</span>
//           <span className="text-foreground font-medium">Dubai</span>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PropertyBreadcrumb;

import { Home } from "lucide-react";
import React from "react";
import Link from "next/link";

const PropertyBreadcrumb = () => {
  return (
    <section className="py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Home className="w-4 h-4 mr-2" />
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Dubai</span>
        </div>
      </div>
    </section>
  );
};

export default PropertyBreadcrumb;
