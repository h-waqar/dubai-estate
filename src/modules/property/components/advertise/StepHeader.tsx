// // src/modules/property/advertise/components/StepHeader.tsx
// "use client";

// import { useStepStore } from "../../stores/useStepStore";
// import { cn } from "@/lib/utils";

// export default function StepHeader() {
//   const { steps, step } = useStepStore();

//   return (
//     <div className="flex justify-between items-center mb-8">
//       {steps.map((s, i) => (
//         <div key={i} className="flex-1 flex flex-col items-center relative">
//           <div
//             className={cn(
//               "w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold transition-colors",
//               i === step
//                 ? "bg-accent-foreground text-white  border-black"
//                 : i < step
//                 ? "bg-accent-foreground text-white border-black"
//                 : "border-gray-400 dark:border-gray-600 text-gray-400"
//             )}
//           >
//             {i + 1}
//           </div>
//           <p
//             className={cn(
//               "text-xs mt-2 text-center font-medium",
//               i === step
//                 ? "text-brand-600 dark:text-brand-400"
//                 : "text-muted-foreground"
//             )}
//           >
//             {s.title}
//           </p>

//           {i < steps.length - 1 && (
//             <div
//               className={cn(
//                 "absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 z-[-1]",
//                 i < step ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"
//               )}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// src/modules/property/advertise/components/StepHeader.tsx
"use client";

import { useStepStore } from "../../stores/useStepStore";
import { cn } from "@/lib/utils";

export default function StepHeader() {
  const { steps, step } = useStepStore();

  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((s, i) => {
        const isActive = i === step;
        const isCompleted = i < step;

        return (
          <div key={i} className="flex-1 flex flex-col items-center relative">
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200",
                // Active step
                isActive &&
                  "bg-accent-foreground text-white dark:bg-white dark:text-black border-black",
                // Completed step
                isCompleted &&
                  "bg-accent-foreground text-white dark:bg-gray-200 dark:text-black border-black",
                // Upcoming step
                !isActive &&
                  !isCompleted &&
                  "border-gray-400 dark:border-gray-600 text-gray-400 dark:text-gray-500"
              )}
            >
              {i + 1}
            </div>

            <p
              className={cn(
                "text-xs mt-2 text-center font-medium transition-colors duration-200",
                isActive
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-muted-foreground"
              )}
            >
              {s.title}
            </p>

            {i < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 z-[-1] transition-colors duration-200",
                  isCompleted
                    ? "bg-brand-500 dark:bg-brand-400"
                    : "bg-gray-300 dark:bg-gray-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
