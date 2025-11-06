"use client";

import { AlertTriangle, Heart, Bike, Cloud, Users } from "lucide-react";
import tourData from "@/data/tour-data.json";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotesPage() {
  const { importantNotes } = tourData;
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

  // Helper function to translate category names
  const getCategoryName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Safety': t.notes.safety,
      'Health': t.notes.health,
      'Bike & Equipment': t.notes.bikeEquipment,
      'Weather': t.notes.weather,
      'Cultural': t.notes.cultural,
    };
    return categoryMap[category] || category;
  };

  const categoryIcons: { [key: string]: any } = {
    Safety: AlertTriangle,
    Health: Heart,
    "Bike & Equipment": Bike,
    Weather: Cloud,
    Cultural: Users,
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t.notes.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {t.notes.subtitle}
          </p>
        </div>

        {/* Important Notes by Category */}
        <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
          {importantNotes.map((noteCategory, index) => {
            const Icon = categoryIcons[noteCategory.category] || AlertTriangle;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-gray-900">
                    {getCategoryName(noteCategory.category)}
                  </h2>
                </div>

                <ul className="space-y-2 sm:space-y-3">
                  {noteCategory.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-blue-600 mt-1">•</span>
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

