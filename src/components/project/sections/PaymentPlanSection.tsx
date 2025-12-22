"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

interface PaymentStage {
    id: number;
    percentage: number;
    description: string;
    order: number;
    triggerEvent?: string | null;
}

interface PaymentPlanSectionProps {
    paymentPlan: PaymentStage[];
    locationDescription?: string | null;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function PaymentPlanSection({ paymentPlan, locationDescription }: PaymentPlanSectionProps) {
    if (paymentPlan.length === 0) return null;

    // Group by trigger event (property type)
    const groupedPlan = paymentPlan.reduce((acc, stage) => {
        const key = stage.triggerEvent || "Standard";
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(stage);
        return acc;
    }, {} as Record<string, PaymentStage[]>);

    return (
        <section id="payment-plan" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Payment Plan
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Book 10% and own your home with flexible payment options made for you.
                    </p>
                </div>

                {/* Payment Stages by Property Type */}
                <div className="space-y-24">
                    {Object.entries(groupedPlan).map(([propertyType, stages]) => (
                        <div key={propertyType} className="max-w-7xl mx-auto">
                            {/* Plan Title */}
                            <div className="flex items-center gap-4 mb-12 justify-center">
                                <div className="h-px bg-gray-200 dark:bg-gray-800 w-16 md:w-32" />
                                <span className="text-lg font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                    {propertyType} Plan
                                </span>
                                <div className="h-px bg-gray-200 dark:bg-gray-800 w-16 md:w-32" />
                            </div>

                            {/* Timeline Visual */}
                            <motion.div
                                variants={container}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative"
                            >
                                {/* Connecting Line (Desktop) */}
                                <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 hidden lg:block -z-10" />

                                {stages.map((stage, index) => (
                                    <motion.div
                                        key={stage.id}
                                        variants={item}
                                        className="relative group"
                                    >
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            {/* Percentage Circle */}
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-50 dark:border-blue-900/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                        {stage.percentage}%
                                                    </span>
                                                </div>
                                                {/* Connector for Mobile */}
                                                {index < stages.length - 1 && (
                                                    <div className="absolute top-16 left-1/2 -ml-px w-0.5 h-12 bg-gray-200 dark:bg-gray-800 lg:hidden" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-2 px-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {stage.description}
                                                </h4>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Milestone {index + 1}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Location Context */}
                {locationDescription && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-24 max-w-5xl mx-auto"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                            <div className="relative z-10 grid md:grid-cols-[1fr_2fr] gap-8 items-start">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Strategic Location
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                        Investment Potential
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                                        {locationDescription}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
