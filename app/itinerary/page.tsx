import { Clock, MapPin, Utensils, Hotel, Calendar, Route, TrendingUp, Plane, Bike, Map, Home, PlaneTakeoff, PlaneLanding } from "lucide-react";
import tourData from "@/data/tour-data.json";
import Image from "next/image";

export default function ItineraryPage() {
  const { itinerary } = tourData;

  const getDayTypeInfo = (dayType: string) => {
    switch (dayType) {
      case "arrival":
        return { label: "Arrival Day", icon: Plane, color: "bg-green-500" };
      case "departure":
        return { label: "Departure Day", icon: Home, color: "bg-red-500" };
      case "free-and-easy":
        return { label: "Free & Easy", icon: Map, color: "bg-purple-500" };
      case "ride":
      default:
        return { label: "Ride Day", icon: Bike, color: "bg-blue-500" };
    }
  };

  const isRideDay = (dayType: string) => {
    return dayType === "ride";
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Daily Itinerary
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Detailed schedule for each day of your tour
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {itinerary.map((day) => {
            const dayTypeInfo = getDayTypeInfo(day.dayType || "ride");
            const DayTypeIcon = dayTypeInfo.icon;
            const showRideStats = isRideDay(day.dayType || "ride");

            return (
              <div
                key={day.day}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Day Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm opacity-90">
                          Day {day.day} • {day.date}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${dayTypeInfo.color} text-white`}>
                          <DayTypeIcon className="w-3 h-3" />
                          {dayTypeInfo.label}
                        </span>
                      </div>
                      <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold">
                        {day.title}
                      </h2>
                    </div>
                    {day.departureTime && (
                      <div className="flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-2 rounded-lg self-start sm:self-auto">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold text-sm sm:text-base">Departure: {day.departureTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Stats - Only show for ride days */}
                  {showRideStats && (day.distance > 0 || day.elevationGain > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      {day.distance > 0 && (
                        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <Route className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm text-gray-600">Distance</div>
                            <div className="font-semibold text-sm sm:text-base text-gray-900">{day.distance} km</div>
                          </div>
                        </div>
                      )}
                      {day.elevationGain > 0 && (
                        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm text-gray-600">Elevation Gain</div>
                            <div className="font-semibold text-sm sm:text-base text-gray-900">{day.elevationGain} m</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flight Information - Show for arrival/departure days */}
                  {(day.dayType === "arrival" || day.dayType === "departure") && day.flight && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex items-start gap-2 sm:gap-3">
                        {day.dayType === "arrival" ? (
                          <PlaneLanding className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <PlaneTakeoff className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm sm:text-base text-indigo-900 mb-2">
                            Flight Information
                          </div>
                          <div className="space-y-1.5 text-xs sm:text-sm text-indigo-800">
                            <div>
                              <strong>Flight Number:</strong> {day.flight.flightNumber}
                            </div>
                            <div>
                              <strong>Route:</strong> {day.flight.details}
                            </div>
                            {day.flight.departureTime && (
                              <div>
                                <strong>Departure Time:</strong> {day.flight.departureTime}
                              </div>
                            )}
                            {day.flight.arrivalTime && (
                              <div>
                                <strong>Arrival Time:</strong> {day.flight.arrivalTime}
                              </div>
                            )}
                            {/* Fallback for old time field */}
                            {!day.flight.departureTime && !day.flight.arrivalTime && (day.flight as any).time && (
                              <div>
                                <strong>Time:</strong> {(day.flight as any).time}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Route - Show for all days if route exists */}
                  {day.route && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm sm:text-base text-blue-900 mb-1">
                            {showRideStats ? "Route" : "Location"}
                          </div>
                          <div className="text-xs sm:text-sm text-blue-800 break-words">{day.route}</div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Day Description */}
                {day.description && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Day Description</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                      {day.description}
                    </p>
                  </div>
                )}

                {/* Highlights */}
                {day.highlights && day.highlights.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Highlights</h3>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {day.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-sm sm:text-base text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Meals */}
                {day.meals && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
                      Meals
                    </h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {day.meals.breakfast && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Breakfast</div>
                          <div className="text-sm sm:text-base text-gray-900">{day.meals.breakfast}</div>
                        </div>
                      )}
                      {day.meals.lunch && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Lunch</div>
                          <div className="text-sm sm:text-base text-gray-900">{day.meals.lunch}</div>
                        </div>
                      )}
                      {day.meals.dinner && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Dinner</div>
                          <div className="text-sm sm:text-base text-gray-900">{day.meals.dinner}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hotel */}
                {day.hotel && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                      <Hotel className="w-4 h-4 sm:w-5 sm:h-5" />
                      Accommodation
                    </h3>
                    <div className="space-y-1">
                      <div className="font-medium text-sm sm:text-base text-green-900">{day.hotel.name}</div>
                      <div className="text-xs sm:text-sm text-green-800 break-words">{day.hotel.address}</div>
                      {day.hotel.phone && (
                        <div className="text-xs sm:text-sm text-green-800">Phone: {day.hotel.phone}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {day.notes && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-xs sm:text-sm text-amber-800">{day.notes}</div>
                  </div>
                )}

                {/* Photos Placeholder */}
                {day.photos && day.photos.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Photos</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {day.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"
                        >
                          <div className="text-center px-2">
                            <div className="text-xs sm:text-sm">Photo {index + 1}</div>
                            <div className="text-[10px] sm:text-xs mt-1">(Add image at: {photo})</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

