"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Home, Wind, Sparkles, Utensils } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: (
        <Utensils className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />
      ),
      title: "Thoughtful amenities",
      description:
        "Our furnished apartments come with free and fast WiFi, great coffee and tea, fully-equipped kitchens and cookware, in-unit laundry, and premium linen and furnishing.",
    },
    {
      icon: (
        <Sparkles className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />
      ),
      title: "Live like a local",
      description:
        "Our curated network of furnished apartments bridge the best of hotels and upscale residential living for a seamless travel or rental experience.",
    },
    {
      icon: <Home className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />,
      title: "Feel at home, wherever life takes you",
      description:
        "Manzil is here to make your travel experience not only more comfortable, but truly homely.",
    },
    {
      icon: <Wind className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />,
      title: "Rest at first sight",
      description:
        "When you enter a Manzil home, expect an upgrade from your everyday living while still feeling familiar with your surroundings. It's refreshing, and predictable.",
    },
  ];

  const principles = [
    {
      img: "/about-us/aim.png",
      title: "Assertive",
      description:
        "Manzil says it like it is. No surprises, only expectations met.",
    },
    {
      img: "/about-us/reimagine.png",
      title: "Upbeat",
      description:
        "The optimistic brand fulfills experiences in a positive and confident manner.",
    },
    {
      img: "/about-us/stays.png",
      title: "Youthful",
      description:
        "Be it a new restaurant, club or local attraction, Manzil stays on top of the game by offering the latest trends in the city.",
    },
    {
      img: "/about-us/aboutBanner.jpeg",
      title: "Honest",
      description:
        "With hospitality comes great responsibility. Manzil is transparent about their services, limitations and capabilities.",
    },
    {
      img: "/about-us/quote.png",
      title: "Empathetic",
      description:
        "There's no one-size-fits-all when it comes to guests. Manzil understands and aims to solve grievances in a meaningful manner.",
    },
    {
      img: "/assets/dubai-hero.jpg",
      title: "Guest-First Mentality",
      description:
        "We prioritise your experience and satisfaction in your modern oasis.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] text-white">
          <Image
            src="/about-us/aboutBanner.jpeg"
            alt="Modern apartment interior with sea view"
            fill
            className="object-cover"
          />
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h1
              className="text-4xl md:text-6xl font-bold tracking-tight"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              Get to know Manzil
            </h1>
            <p
              className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-200"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
            >
              Serviced apartments that feel like home - find yours today
            </p>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <blockquote className="text-xl md:text-2xl font-light text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              &ldquo;Inspired by the delicate arabic term Manzil apartments
              responds to the need for a hassle-free experience, seamless
              hospitality and appreciation of time; these are intrinsic parts of
              the manzil lifestyle. Manzil in arabic basically means home for
              travellers. In a world saturated with adulterated holiday packages
              and substandard services, we aim to bridge the gap between the
              initial excitement of visiting a new city and returning home
              rejuvenated, fulfilled even.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Reimagine Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Reimagine Your Experience with Manzil
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:bg-white dark:hover:bg-gray-800"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-yellow-100 dark:bg-gray-800 p-4 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stays Sections */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
                  Inspired Stays
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base md:text-lg leading-relaxed">
                  Prepare yourself for a hassle-free experience! We provide
                  elevated accommodations that are accessible to discerning
                  travelers who can comfortably unwind in a new city. With
                  accommodations that are validated with professional services,
                  luxury amenities and standardized features, the signature
                  essence of our concept is reflected in each home.
                </p>
              </div>
              <div className="relative order-1 md:order-2 h-80 md:h-[450px]">
                <Image
                  src="/about-us/stays.png"
                  alt="Balcony view from a Manzil apartment"
                  fill
                  className="rounded-xl shadow-lg object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 md:h-[450px]">
                <Image
                  src="/assets/property-1.jpg"
                  alt="Modern bathroom in a Manzil apartment"
                  fill
                  className="rounded-xl shadow-lg object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
                  Trip Designers
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-base md:text-lg leading-relaxed">
                  Our Trip Designers know exactly what it takes to make your
                  vacation one-of-a-kind. We organize restaurant reservations,
                  car rentals, grocery deliveries, private chef services,
                  daycare services and an array of hospitality services that
                  ensures your stay is effortless and enjoyable. To tailor your
                  stay even further, describe your dream vacation to our Trip
                  Designers and browse through the many exclusive activities of
                  the city from helicopter trips to exotic yacht rides.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Aim Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                We Aim To Please
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row md:flex-col lg:flex-row items-center transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative w-full sm:w-1/3 md:w-full lg:w-1/3 h-32 sm:h-full md:h-40 lg:h-full flex-shrink-0">
                    <Image
                      src={principle.img}
                      alt={principle.title}
                      fill
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="bg-yellow-500 dark:bg-yellow-600 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-2 mb-6 max-w-xl mx-auto">
              Let our experts guide you through the Dubai real estate market.
              Contact us today for a personalized consultation.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white text-yellow-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
