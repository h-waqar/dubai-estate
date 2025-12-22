import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import Image from "next/image";

interface Feature {
    name: string;
    icon?: string;
    imageUrl?: string;
}

interface Media {
    id: number;
    url: string;
    title: string | null;
}

interface AboutSectionProps {
    tagline?: string | null;
    aboutContent?: string | null;
    features: Feature[];
    randomGalleryImage?: Media | null;
}

export function AboutSection({ tagline, aboutContent, features, randomGalleryImage }: AboutSectionProps) {
    const getIcon = (iconName?: string): LucideIcon | null => {
        if (!iconName) return null;
        const Icon = (Icons as any)[iconName];
        return Icon || null;
    };

    return (
        <section id="about" className="py-16 md:py-24 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Tagline */}
                {tagline && (
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                        {tagline}
                    </h2>
                )}

                {/* About Content */}
                {aboutContent && (
                    <div className="max-w-4xl mx-auto mb-12">
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                            {aboutContent}
                        </p>
                    </div>
                )}

                {/* Features Grid */}
                {features.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-16">
                        {features.map((feature, index) => {
                            const Icon = getIcon(feature.icon);
                            return (
                                <div key={index} className="flex flex-col items-center text-center">
                                    {feature.imageUrl ? (
                                        <div className="mb-4 relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <Image
                                                src={feature.imageUrl}
                                                alt={feature.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : Icon ? (
                                        <div className="mb-4 p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    ) : null}
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {feature.name}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Random Gallery Image */}
                {randomGalleryImage && (
                    <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]" style={{ height: '80vh' }}>
                        <div className="relative w-full h-full">
                            <Image
                                src={randomGalleryImage.url}
                                alt={randomGalleryImage.title || "Project showcase"}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
