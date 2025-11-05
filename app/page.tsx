import { Bike, Calendar, MapPin, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import tourData from "@/data/tour-data.json";

export default function Home() {
  const { overview } = tourData;

  const stats = [
    {
      icon: Calendar,
      label: "Days",
      value: overview.days,
    },
    {
      icon: Bike,
      label: "Distance",
      value: `${overview.totalDistance} km`,
    },
    {
      icon: TrendingUp,
      label: "Elevation Gain",
      value: `${overview.elevationGain} m`,
    },
    {
      icon: TrendingDown,
      label: "Elevation Drop",
      value: `${overview.elevationDrop} m`,
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] sm:min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
            {overview.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-3 sm:mb-4">
            {overview.destination}
          </p>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            {overview.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/itinerary"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              View Itinerary
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/packing"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Packing List
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-4 sm:p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4 text-gray-600" />
                  <div className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Tour Overview
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
              Join us for an unforgettable cycling adventure through Okinawa, 
              Japan's tropical paradise. This 7-day tour takes you through diverse 
              landscapes, from coastal roads to mountain passes, historic sites to 
              pristine beaches.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
              Each day is carefully planned to balance cycling challenges with 
              opportunities to explore local culture, enjoy delicious Okinawan cuisine, 
              and relax in comfortable accommodations. Whether you're an experienced 
              cyclist or looking for an active adventure, this tour offers something 
              for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Essential Information
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Link
              href="/itinerary"
              className="group p-5 sm:p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-gray-600 group-hover:text-gray-900" />
              <h3 className="font-playfair text-lg sm:text-xl font-semibold mb-2">Daily Itinerary</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Detailed day-by-day schedule with routes, meals, and accommodations
              </p>
            </Link>
            <Link
              href="/weather"
              className="group p-5 sm:p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-gray-600 group-hover:text-gray-900" />
              <h3 className="font-playfair text-lg sm:text-xl font-semibold mb-2">Weather Forecast</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Real-time weather updates for your tour dates
              </p>
            </Link>
            <Link
              href="/notes"
              className="group p-5 sm:p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-lg transition-all sm:col-span-2 md:col-span-1"
            >
              <Bike className="w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-4 text-gray-600 group-hover:text-gray-900" />
              <h3 className="font-playfair text-lg sm:text-xl font-semibold mb-2">Important Notes</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Safety tips, health considerations, and cultural guidelines
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
