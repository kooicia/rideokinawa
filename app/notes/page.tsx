import { AlertTriangle, Heart, Bike, Cloud, Users } from "lucide-react";
import tourData from "@/data/tour-data.json";

export default function NotesPage() {
  const { importantNotes, additionalInfo } = tourData;

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
            Important Notes
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Essential information for a safe and enjoyable tour
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
                    {noteCategory.category}
                  </h2>
                </div>

                <ul className="space-y-2 sm:space-y-3">
                  {noteCategory.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-sm sm:text-base text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="space-y-6 sm:space-y-8">
          {/* Emergency Contacts */}
          {additionalInfo.emergencyContacts && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-red-900 mb-3 sm:mb-4">
                Emergency Contacts
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {additionalInfo.emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 sm:p-4 border border-red-100"
                  >
                    <div className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                      {contact.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      {contact.role}
                    </div>
                    <div className="text-sm sm:text-base text-gray-900 break-all">{contact.phone}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tour Details */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Tour Details</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fitness Level:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {additionalInfo.fitnessLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {additionalInfo.groupSize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Support Vehicle:</span>
                  <span className="font-medium text-gray-900 text-right">
                    {additionalInfo.supportVehicle}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-2 sm:mb-3">Tips for Success</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                {additionalInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

