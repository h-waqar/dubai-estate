// src\modules\property\components\advertise\steps\StepSevenSuccess.tsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StepController from "./StepController";
import { useStepStore } from "@/modules/property/stores/useStepStore";

// Confetti particle component
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = ["#f5c842", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const startX = Math.random() * 100;
  const endX = startX + (Math.random() - 0.5) * 50;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full"
      style={{
        backgroundColor: color,
        left: `${startX}%`,
        top: "-20px",
      }}
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, 600],
        x: [0, endX - startX],
        opacity: [1, 1, 0],
        rotate: [0, rotation],
      }}
      transition={{
        duration: 2 + Math.random(),
        delay: delay,
        ease: "easeIn",
      }}
    />
  );
};

function StepSixPayment() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const { data, updateData, next, prev } = useStepStore();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="min-h-[600px] flex items-center justify-center relative overflow-hidden">
        {/* Success Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center space-y-6 bg-card rounded-xl shadow-sm p-12 border border-border relative"
        >
          {/* Confetti Effect - Inside card, behind text */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              {Array.from({ length: 50 }).map((_, i) => (
                <ConfettiParticle key={i} delay={i * 0.05} />
              ))}
            </div>
          )}
          {/* Success Icon */}
          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center relative"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 20px rgba(34, 197, 94, 0)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: 2,
                ease: "easeOut",
              }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-foreground">
              Listing Created!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your listing has been successfully created.
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            className="max-w-xl mx-auto space-y-4 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p>
              Your property is now live on our platform. You can manage it from
              your dashboard.
            </p>
            <p>
              While you've skipped payment for now, you can always subscribe to
              a plan later to unlock premium features and increase visibility.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                GO TO DASHBOARD
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <StepController onNext={next} onPrev={prev} showPrev={true} />
    </>
  );
}

export default StepSixPayment;
