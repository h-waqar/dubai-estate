"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function StatsFeatureSection() {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Top Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-light mb-6"
                    >
                        Global Reach. <span className="font-semibold">Expert Brokers.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-lg"
                    >
                        Our powerful capability generates interest in exclusive projects
                        through an extensive broker network, adding tremendous value for our
                        partners.
                    </motion.p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-border/50 py-12">
                    <StatItem value="AED 6.5bn" label="Sales in 2024" delay={0.2} />
                    <StatItem value="150+" label="Expert Agents" delay={0.3} border />
                    <StatItem value="10,000+" label="Partner Network" delay={0.4} border />
                    <StatItem value="3,000+" label="Registered Buyers" delay={0.5} border />
                </div>

                {/* Feature Block */}
                <div className="relative">
                    {/* Black Content Box (Right Aligned) */}
                    <div className="md:ml-auto md:w-3/4 bg-[#111] text-white p-8 md:p-16 relative z-0 md:min-h-[600px] flex flex-col justify-center rounded-sm overflow-hidden">
                        {/* Abstract Background Curve (CSS/SVG) */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                                <path d="M0 100 Q 50 0 100 100" stroke="white" strokeWidth="0.5" fill="none" />
                                <path d="M0 100 Q 50 20 100 100" stroke="white" strokeWidth="0.5" fill="none" />
                            </svg>
                        </div>

                        <div className="relative z-10 md:pl-32 max-w-2xl md:-right-24">
                            <span className="text-xs tracking-[0.2em] font-medium uppercase text-gray-400 mb-6 block">
                                Brand
                            </span>
                            <h3 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                                Extraordinary property,
                                <br />
                                <span className="font-normal italic">exceptional lifestyles</span>
                            </h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                We've helped bring luxury and elegance to the skyline for over a
                                decade. With an esteemed reputation for Dubai real estate,
                                we're trusted to represent magnificent off-plan developments in
                                the Emirates.
                            </p>
                            <p className="text-gray-400 mb-10 leading-relaxed">
                                We showcase visionary architecture that promises exceptional
                                returns, from the iconic towers to the tranquil haven of Wadi
                                Villas.
                            </p>

                            <Link
                                href="/about"
                                className="inline-flex items-center text-sm tracking-widest uppercase border border-white/30 px-8 py-4 hover:bg-white hover:text-black transition-colors duration-300 group"
                            >
                                Explore Our Brand
                                <ChevronRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* Overlapping Image (Left Aligned) */}
                    <div className="md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 md:w-2/5 z-10 hidden md:block pl-4">
                        <div className="relative aspect-[4/3] w-full shadow-2xl">
                            <Image
                                src="/assets/images/office_interior_branding.png" // Generated image
                                alt="Dubai Estate Office"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    {/* Mobile Image */}
                    <div className="block md:hidden mt-[-2rem] relative z-20 px-4">
                        <div className="relative aspect-[4/3] w-full shadow-xl">
                            <Image
                                src="/assets/images/office_interior_branding.png"
                                alt="Dubai Estate Office"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatItem({ value, label, delay, border }: { value: string; label: string; delay: number; border?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`text-center relative ${border ? "md:border-l border-border/50" : ""}`}
        >
            <div className="text-3xl md:text-4xl font-light mb-2">{value}</div>
            <div className="text-muted-foreground text-sm uppercase tracking-wide font-medium">
                {label}
            </div>
        </motion.div>
    );
}
