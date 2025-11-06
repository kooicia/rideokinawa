"use client";

import { CheckCircle, Package, Shirt, Wrench, FileText } from "lucide-react";
import tourData from "@/data/tour-data.json";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PackingPage() {
  const { packingList } = tourData;
  const { t, language } = useLanguage();

  // Helper function to get the correct language version of an item
  const getItemText = (item: any): string => {
    if (typeof item === 'string') {
      return item; // Legacy format - use string as-is
    }
    if (language === 'zh-TW') {
      return item.zh || item.en || '';
    }
    return item.en || item.zh || '';
  };

  const categories = [
    {
      icon: Package,
      title: t.packing.essentials,
      items: packingList.essentials,
    },
    {
      icon: Shirt,
      title: t.packing.clothing,
      items: packingList.clothing,
    },
    {
      icon: Wrench,
      title: t.packing.accessories,
      items: packingList.accessories,
    },
    {
      icon: FileText,
      title: t.packing.documents,
      items: packingList.documents,
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t.packing.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {t.packing.subtitle}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {categories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={categoryIndex}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-gray-900">
                    {category.title}
                  </h2>
                </div>

                <ul className="space-y-2 sm:space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{getItemText(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

