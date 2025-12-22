import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Phone } from "lucide-react";

interface Media {
    id: number;
    url: string;
    title: string | null;
}

interface ProjectHeroOverlayProps {
    logo?: Media | null;
    projectName: string;
    description: string | null;
    priceFrom: number | string | null;
    paymentPlanSummary: string | null;
    handoverDate: string | Date | null;
}

export function ProjectHeroOverlay({
    logo,
    projectName,
    description,
    priceFrom,
    paymentPlanSummary,
    handoverDate,
}: ProjectHeroOverlayProps) {
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-3 md:space-y-4">
                    {/* Logo */}
                    {logo && (
                        <div className="flex justify-center mb-2">
                            <div className="relative w-full max-w-xs">
                                <Image
                                    src={logo.url}
                                    alt={logo.title || "Project Logo"}
                                    width={300}
                                    height={96}
                                    className="object-contain max-h-20 md:max-h-24 w-auto mx-auto"
                                />
                            </div>
                        </div>
                    )}

                    {/* Project Name */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl">
                        {projectName}
                    </h1>

                    {/* Description */}
                    {description && (
                        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg line-clamp-3">
                            {description}
                        </p>
                    )}

                    {/* Button Group */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 text-base shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            Contact Sales For Availability
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/50 backdrop-blur-sm px-6 py-5 text-base shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download FloorPlan
                        </Button>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-3 max-w-2xl mx-auto">
                        {/* Price From */}
                        {priceFrom && (
                            <div className="text-center">
                                <p className="text-white/80 text-xs md:text-sm mb-1 font-medium uppercase tracking-wide">
                                    Prices From
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                                    AED {Number(priceFrom).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {/* Payment Plan */}
                        {paymentPlanSummary && (
                            <div className="text-center">
                                <p className="text-white/80 text-xs md:text-sm mb-1 font-medium uppercase tracking-wide">
                                    Payment Plan
                                </p>
                                <p className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                                    {paymentPlanSummary}
                                </p>
                            </div>
                        )}

                        {/* Handover Date */}
                        {handoverDate && (
                            <div className="text-center">
                                <p className="text-white/80 text-xs md:text-sm mb-1 font-medium uppercase tracking-wide">
                                    Handover Date
                                </p>
                                <p className="text-lg md:text-xl font-bold text-white drop-shadow-lg">
                                    {new Date(handoverDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
