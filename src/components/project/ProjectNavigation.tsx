"use client";

import { useState, useEffect } from "react";

interface Section {
    id: string;
    label: string;
}

const sections: Section[] = [
    { id: "about", label: "About" },
    { id: "units-floorplans", label: "Units & Floorplans" },
    { id: "features-amenities", label: "Features & Amenities" },
    { id: "payment-plan", label: "Payment Plan" },
    { id: "location", label: "Location" },
];

export function ProjectNavigation() {
    const [activeSection, setActiveSection] = useState("about");

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["about", "units-floorplans", "features-amenities", "payment-plan", "location"];

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-1 md:gap-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`
                                relative px-3 md:px-6 py-4 text-sm md:text-base font-medium
                                transition-colors duration-200
                                ${activeSection === section.id
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                }
                            `}
                        >
                            {section.label}
                            {activeSection === section.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
