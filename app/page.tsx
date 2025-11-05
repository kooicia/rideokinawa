"use client";

import { Bike, Calendar, MapPin, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import tourData from "@/data/tour-data.json";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { overview } = tourData;
  const { t, language } = useLanguage();

  const stats = [
    {
      icon: Calendar,
      label: t.home.days,
      value: overview.days,
    },
    {
      icon: Bike,
      label: t.home.distance,
      value: `${overview.totalDistance} km`,
    },
    {
      icon: TrendingUp,
      label: t.home.elevationGain,
      value: `${overview.elevationGain} m`,
    },
    {
      icon: TrendingDown,
      label: t.home.elevationDrop,
      value: `${overview.elevationDrop} m`,
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-green-200">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-40"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {overview.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-2">
            {overview.destination}
          </p>
          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            {language === 'zh-TW' 
              ? (overview.descriptionZh || overview.description)
              : (overview.description || overview.descriptionZh)}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4">
            <Link
              href="/itinerary"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              {t.home.viewItinerary}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/packing"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              {t.home.packingList}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-4 sm:py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-4 sm:p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-2 sm:mb-3 text-gray-600" />
                  <div className="font-playfair text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
