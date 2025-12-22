"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Cone, Hammer, HardHat, Calendar } from "lucide-react";

interface ProjectProgressSectionProps {
    percentage: number;
    status: string;
    image?: string;
    constructionDate?: Date;
    handoverDate?: Date;
}

export function ProjectProgressSection({
    percentage,
    status,
    image,
    constructionDate,
    handoverDate
}: ProjectProgressSectionProps) {
    // If no progress data, don't render (or maybe render default?)
    // User requested this section specifically, so likely data exists or we show placeholder if enabled
    if (!percentage && !status) return null;

    // Radius for circle
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((percentage || 0) / 100) * circumference;

    return (
        <section className="py-20 md:py-28 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left: Progress Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Construction Update
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                Track the development milestones and construction status.
                            </p>
                        </div>

                        {/* Status Card */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-lg relative overflow-hidden">
                            <div className="flex items-center gap-8">
                                {/* Circular Progress */}
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r={radius}
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            className="text-gray-200 dark:text-gray-800"
                                        />
                                        <motion.circle
                                            cx="64"
                                            cy="64"
                                            r={radius}
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeDasharray={circumference}
                                            initial={{ strokeDashoffset: circumference }}
                                            whileInView={{ strokeDashoffset }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="text-blue-600 dark:text-blue-500"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {percentage || 0}%
                                        </span>
                                        <span className="text-xs text-gray-500 uppercase font-medium">Complete</span>
                                    </div>
                                </div>

                                {/* Status Text */}
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {status || "In Progress"}
                                    </h3>
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-medium uppercase tracking-wide">
                                            Current Status
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dates Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {(constructionDate || handoverDate) && (
                                <>
                                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
                                        <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
                                            <Calendar className="w-5 h-5" />
                                            <span className="text-sm font-medium uppercase">Expected Handover</span>
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white pl-8">
                                            {handoverDate ? new Date(handoverDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "TBA"}
                                        </div>
                                    </div>
                                    {/* Additional stats could go here */}
                                </>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Feature Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
                    >
                        {image ? (
                            <>
                                <Image
                                    src={image}
                                    alt="Construction Progress"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white p-4 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <HardHat className="w-5 h-5 text-yellow-400" />
                                        <span className="font-medium">On-site Verification</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-400">No Image Available</span>
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
