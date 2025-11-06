"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, MapPin, Utensils, Hotel, Calendar, Route, TrendingUp, Plane, Bike, Map, Home, PlaneTakeoff, PlaneLanding, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import tourDataStatic from "@/data/tour-data.json";
import { useLanguage } from "@/contexts/LanguageContext";
import RouteMap from "@/components/RouteMap";

export default function ItineraryPage() {
  const { t, language } = useLanguage();
  const [tourData, setTourData] = useState(tourDataStatic);
  
  // Load data from API (always get latest) on mount
  useEffect(() => {
    fetch("/api/tour-data")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setTourData(data);
          console.log('Loaded latest data from server');
        } else {
          console.warn('Server data error, using static data');
        }
      })
      .catch(err => {
        console.error('Error loading from server, using static data:', err);
        // Keep using static data as fallback
      });
  }, []);
  
  const { itinerary } = tourData;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize refs array
  useEffect(() => {
    dayRefs.current = new Array(itinerary.length);
  }, [itinerary.length]);

  const openLightbox = (photos: string[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxPhotos.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setLightboxIndex((prev) => (prev < lightboxPhotos.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxPhotos.length]);

  // Reset body overflow on mount and when lightbox closes or component unmounts
  useEffect(() => {
    // Ensure body overflow is reset on mount (in case it was stuck)
    document.body.style.overflow = 'unset';
    
    if (!lightboxOpen) {
      document.body.style.overflow = 'unset';
    }
    return () => {
      // Reset body overflow on unmount
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  // Intersection Observer to track which day is currently in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    let activeIndex = 0;

    const updateActiveDay = () => {
      const headerHeight = 64; // Navigation header height
      const stickyHeight = 56; // Sticky day indicator height
      const topOffset = headerHeight + stickyHeight;

      // Find the day card that has passed the threshold (top is above the sticky bar)
      // We want the last day whose top has passed the threshold
      let bestIndex = 0;
      
      for (let i = 0; i < dayRefs.current.length; i++) {
        const ref = dayRefs.current[i];
        if (!ref) continue;
        
        const rect = ref.getBoundingClientRect();
        
        // Check if this card's top has passed the threshold
        // We want the last card that has passed
        if (rect.top <= topOffset) {
          bestIndex = i;
        } else {
          // Once we hit a card that hasn't passed, we've found our range
          break;
        }
      }

      // Update if different
      if (bestIndex !== activeIndex) {
        activeIndex = bestIndex;
        setActiveDayIndex(bestIndex);
      }
    };

    // Throttled scroll handler
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        updateActiveDay();
      }, 50);
    };

    // Set up Intersection Observers for each day card
    const setupObservers = () => {
      // Clean up existing observers
      observers.forEach((observer) => observer.disconnect());
      observers.length = 0;

      dayRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const observer = new IntersectionObserver(
          () => {
            updateActiveDay();
          },
          {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            rootMargin: '-80px 0px -50% 0px',
          }
        );

        observer.observe(ref);
        observers.push(observer);
      });
    };

    // Wait a bit for refs to be set, then set up observers
    const timeoutId = setTimeout(() => {
      // Check if refs are actually set
      const refsSet = dayRefs.current.some(ref => ref !== null);
      if (refsSet) {
        setupObservers();
        updateActiveDay();
      }
    }, 200);

    // Also set up observers on next frame in case timeout isn't enough
    const rafId = requestAnimationFrame(() => {
      const rafId2 = requestAnimationFrame(() => {
        const refsSet = dayRefs.current.some(ref => ref !== null);
        if (refsSet && observers.length === 0) {
          setupObservers();
          updateActiveDay();
        }
      });
      return () => cancelAnimationFrame(rafId2);
    });

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check after a short delay
    const initialTimeout = setTimeout(() => {
      updateActiveDay();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, [itinerary]);

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxPhotos.length - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev < lightboxPhotos.length - 1 ? prev + 1 : 0));
  };

  const getDayTypeInfo = (dayType: string) => {
    switch (dayType) {
      case "arrival":
        return { label: t.itinerary.arrivalDay, icon: Plane, color: "bg-green-500" };
      case "departure":
        return { label: t.itinerary.departureDay, icon: Home, color: "bg-red-500" };
      case "free-and-easy":
        return { label: t.itinerary.freeAndEasy, icon: Map, color: "bg-purple-500" };
      case "ride":
      default:
        return { label: t.itinerary.rideDay, icon: Bike, color: "bg-blue-500" };
    }
  };

  const isRideDay = (dayType: string) => {
    return dayType === "ride";
  };

      const activeDay = itinerary[activeDayIndex] || itinerary[0];
      const activeDayTypeInfo = getDayTypeInfo(activeDay?.dayType || "ride");
      const ActiveDayTypeIcon = activeDayTypeInfo.icon;

      return (
        <div className="min-h-screen pt-16 pb-16 md:pb-0 bg-gray-50" suppressHydrationWarning>
          {/* Sticky Day Indicator */}
          <div className="sticky top-16 z-[9998] bg-white border-b border-gray-200 shadow-sm" suppressHydrationWarning>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex items-center gap-3 sm:gap-4" suppressHydrationWarning>
                <div className="flex items-center gap-2 sm:gap-3" suppressHydrationWarning>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {language === 'zh-TW' 
                      ? `${t.itinerary.day}${activeDay?.day}${t.itinerary.daySuffix || '天'} • ${activeDay?.date}`
                      : `${t.itinerary.day} ${activeDay?.day} • ${activeDay?.date}`}
                    {(() => {
                      if (!activeDay?.date) return '';
                      try {
                        const dateObj = new Date(activeDay.date);
                        if (isNaN(dateObj.getTime())) return '';
                        const dayOfWeek = dateObj.getDay();
                        const dayNames = [
                          t.itinerary.sunday,
                          t.itinerary.monday,
                          t.itinerary.tuesday,
                          t.itinerary.wednesday,
                          t.itinerary.thursday,
                          t.itinerary.friday,
                          t.itinerary.saturday,
                        ];
                        return ` • ${dayNames[dayOfWeek]}`;
                      } catch {
                        return '';
                      }
                    })()}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${activeDayTypeInfo.color} text-white`} suppressHydrationWarning>
                  <ActiveDayTypeIcon className="w-3 h-3" />
                  {activeDayTypeInfo.label}
                </span>
                <div className="flex-1" suppressHydrationWarning />
                <h2 className="font-playfair text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate" suppressHydrationWarning>
                  {language === 'zh-TW' 
                    ? ((activeDay as any)?.titleZh || activeDay?.title)
                    : (activeDay?.title || (activeDay as any)?.titleZh)}
                </h2>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" suppressHydrationWarning>
            <div className="text-center mb-8 sm:mb-12" suppressHydrationWarning>
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4" suppressHydrationWarning>
            {t.itinerary.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600" suppressHydrationWarning>
            {t.itinerary.subtitle}
          </p>
        </div>

            <div className="space-y-8 sm:space-y-12" suppressHydrationWarning>
              {itinerary.map((day, dayIndex) => {
                const dayTypeInfo = getDayTypeInfo(day.dayType || "ride");
                const DayTypeIcon = dayTypeInfo.icon;
                const showRideStats = isRideDay(day.dayType || "ride");

                // Component to handle departure width measurement
                const HeaderStats = () => {
                  const departureRef = useRef<HTMLDivElement>(null);
                  const [departureWidth, setDepartureWidth] = useState<number | null>(null);

                  useEffect(() => {
                    const updateWidth = () => {
                      if (departureRef.current && window.innerWidth >= 640) {
                        setDepartureWidth(departureRef.current.offsetWidth);
                      } else {
                        setDepartureWidth(null);
                      }
                    };
                    // Use setTimeout to ensure the element is rendered
                    const timeoutId = setTimeout(updateWidth, 100);
                    window.addEventListener('resize', updateWidth);
                    return () => {
                      clearTimeout(timeoutId);
                      window.removeEventListener('resize', updateWidth);
                    };
                  }, [day.departureTime, day.day]);

                  return (
                    <div className="flex flex-col items-end gap-2 sm:gap-3" suppressHydrationWarning>
                      {day.departureTime && (
                        <div ref={departureRef} className="flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-2 rounded-lg w-full sm:w-auto justify-center sm:justify-start" suppressHydrationWarning>
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-semibold text-sm sm:text-base">{t.itinerary.departure}: {day.departureTime}</span>
                        </div>
                      )}
                      {/* Stats for ride days - stacked vertically */}
                      {showRideStats && day.distance > 0 && (
                        <div 
                          className="flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-2 rounded-lg w-full sm:w-auto justify-center sm:justify-start" 
                          style={departureWidth ? { width: `${departureWidth}px` } : undefined}
                          suppressHydrationWarning
                        >
                          <Route className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 flex-shrink-0" />
                          <span className="font-semibold text-sm sm:text-base text-white/90">
                            {t.itinerary.distance}: <span className="font-semibold">{day.distance}</span> km
                          </span>
                        </div>
                      )}
                      {showRideStats && day.elevationGain > 0 && (
                        <div 
                          className="flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-2 rounded-lg w-full sm:w-auto justify-center sm:justify-start" 
                          style={departureWidth ? { width: `${departureWidth}px` } : undefined}
                          suppressHydrationWarning
                        >
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 flex-shrink-0" />
                          <span className="font-semibold text-sm sm:text-base text-white/90">
                            {t.itinerary.elevationGain}: <span className="font-semibold">{day.elevationGain}</span> m
                          </span>
                        </div>
                      )}
                    </div>
                  );
                };

                return (
                  <div
                    key={day.day}
                    ref={(el) => {
                      dayRefs.current[dayIndex] = el;
                    }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden scroll-mt-20"
                    suppressHydrationWarning
                  >
                {/* Day Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 sm:p-6" suppressHydrationWarning>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4" suppressHydrationWarning>
                    <div className="flex-1" suppressHydrationWarning>
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap" suppressHydrationWarning>
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm opacity-90">
                          {language === 'zh-TW' 
                            ? `${t.itinerary.day}${day.day}${t.itinerary.daySuffix || '天'} • ${day.date}`
                            : `${t.itinerary.day} ${day.day} • ${day.date}`}
                          {(() => {
                            if (!day.date) return '';
                            try {
                              const dateObj = new Date(day.date);
                              if (isNaN(dateObj.getTime())) return '';
                              const dayOfWeek = dateObj.getDay();
                              const dayNames = [
                                t.itinerary.sunday,
                                t.itinerary.monday,
                                t.itinerary.tuesday,
                                t.itinerary.wednesday,
                                t.itinerary.thursday,
                                t.itinerary.friday,
                                t.itinerary.saturday,
                              ];
                              return ` • ${dayNames[dayOfWeek]}`;
                            } catch {
                              return '';
                            }
                          })()}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${dayTypeInfo.color} text-white`}>
                          <DayTypeIcon className="w-3 h-3" />
                          {dayTypeInfo.label}
                        </span>
                      </div>
                      <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                        {language === 'zh-TW' 
                          ? ((day as any).titleZh || day.title)
                          : (day.title || (day as any).titleZh)}
                      </h2>
                      {((day.route && day.route.trim()) || ((day as any).routeZh && (day as any).routeZh.trim())) && (
                        <p className="text-sm sm:text-base text-white/80 font-normal">
                          {(() => {
                            const routeZh = (day as any).routeZh;
                            const route = day.route;
                            
                            if (language === 'zh-TW') {
                              return (routeZh && routeZh.trim()) || (route && route.trim()) || '';
                            } else {
                              return (route && route.trim()) || (routeZh && routeZh.trim()) || '';
                            }
                          })()}
                        </p>
                      )}
                    </div>
                    <HeaderStats />
                  </div>
                </div>

                <div className="p-4 sm:p-6" suppressHydrationWarning>
                  {/* Route Map - Only show when GPX URL or coordinates are configured */}
                  {((!day.dayType || day.dayType === "ride" || day.dayType === "free-and-easy") && 
                    ((day as any).gpxUrl || ((day as any).routeCoordinates && Array.isArray((day as any).routeCoordinates) && (day as any).routeCoordinates.length > 0))) && (
                    <div className="mb-4 sm:mb-6" suppressHydrationWarning>
                      {/* Map with Elevation Profile below */}
                      <RouteMap
                        key={`route-map-full-${day.day}-${(day as any).gpxUrl || 'coords'}`}
                        route={language === 'zh-TW' 
                          ? ((day as any).routeZh && (day as any).routeZh.trim() ? (day as any).routeZh : day.route)
                          : (day.route && day.route.trim() ? day.route : (day as any).routeZh)}
                        distance={day.distance}
                        elevationGain={day.elevationGain}
                        dayType={day.dayType || "ride"}
                        coordinates={(day as any).routeCoordinates}
                        gpxUrl={(day as any).gpxUrl}
                        showMap={true}
                        showElevationProfileOnly={false}
                      />
                    </div>
                  )}

                  {/* Stats - Only show for ride days without route map */}
                  {showRideStats && (day.distance > 0 || day.elevationGain > 0) && 
                    !((!day.dayType || day.dayType === "ride" || day.dayType === "free-and-easy") && 
                    ((day as any).gpxUrl || ((day as any).routeCoordinates && Array.isArray((day as any).routeCoordinates) && (day as any).routeCoordinates.length > 0))) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6" suppressHydrationWarning>
                      {day.distance > 0 && (
                        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg" suppressHydrationWarning>
                          <Route className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                          <div className="min-w-0" suppressHydrationWarning>
                            <div className="text-xs sm:text-sm text-gray-600" suppressHydrationWarning>{t.itinerary.distance}</div>
                            <div className="font-semibold text-sm sm:text-base text-gray-900" suppressHydrationWarning>{day.distance} km</div>
                          </div>
                        </div>
                      )}
                      {day.elevationGain > 0 && (
                        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg" suppressHydrationWarning>
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                          <div className="min-w-0" suppressHydrationWarning>
                            <div className="text-xs sm:text-sm text-gray-600" suppressHydrationWarning>{t.itinerary.elevationGain}</div>
                            <div className="font-semibold text-sm sm:text-base text-gray-900" suppressHydrationWarning>{day.elevationGain} m</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flight Information - Show for arrival/departure days */}
                  {(day.dayType === "arrival" || day.dayType === "departure") && day.flight && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100" suppressHydrationWarning>
                      <div className="flex items-start gap-2 sm:gap-3" suppressHydrationWarning>
                        {day.dayType === "arrival" ? (
                          <PlaneLanding className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <PlaneTakeoff className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1" suppressHydrationWarning>
                          <div className="font-semibold text-sm sm:text-base text-indigo-900 mb-2">
                            {t.itinerary.flightInformation}
                          </div>
                          <div className="space-y-1.5 text-xs sm:text-sm text-indigo-800" suppressHydrationWarning>
                            <div suppressHydrationWarning>
                              <strong>{t.itinerary.flightNumber}:</strong> {day.flight.flightNumber}
                              {day.flight.details && (
                                <span className="ml-2">• {day.flight.details}</span>
                              )}
                            </div>
                            {(day.flight.departureTime || day.flight.arrivalTime) && (
                              <div suppressHydrationWarning>
                                {day.flight.departureTime && (
                                  <span><strong>{t.itinerary.departureTime}:</strong> {day.flight.departureTime}</span>
                                )}
                                {day.flight.departureTime && day.flight.arrivalTime && (
                                  <span className="mx-2">→</span>
                                )}
                                {day.flight.arrivalTime && (
                                  <span><strong>{t.itinerary.arrivalTime}:</strong> {day.flight.arrivalTime}</span>
                                )}
                              </div>
                            )}
                            {/* Fallback for old time field */}
                            {!day.flight.departureTime && !day.flight.arrivalTime && (day.flight as any).time && (
                              <div suppressHydrationWarning>
                                <strong>Time:</strong> {(day.flight as any).time}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Day Description */}
                {(day.description || (day as any).descriptionZh) && (
                  <div className="mb-4 sm:mb-6" suppressHydrationWarning>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">{t.itinerary.dayDescription}</h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                      {language === 'zh-TW' 
                        ? ((day as any).descriptionZh || day.description)
                        : (day.description || (day as any).descriptionZh)}
                    </p>
                  </div>
                )}

                {/* Highlights */}
                {((day.highlights && day.highlights.length > 0) || ((day as any).highlightsZh && (day as any).highlightsZh.length > 0)) && (
                  <div className="mb-4 sm:mb-6" suppressHydrationWarning>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">{t.itinerary.highlights}</h3>
                    <ul className="space-y-1.5 sm:space-y-2" suppressHydrationWarning>
                      {(language === 'zh-TW' 
                        ? ((day as any).highlightsZh || day.highlights)
                        : (day.highlights || (day as any).highlightsZh)
                      )?.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-sm sm:text-base text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Daily Highlight Photos */}
                {day.photos && day.photos.length > 0 && (
                  <div className="mb-4 sm:mb-6" suppressHydrationWarning>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">{t.itinerary.photos}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" suppressHydrationWarning>
                      {day.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-video bg-gray-200 rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openLightbox(day.photos, index)}
                          suppressHydrationWarning
                        >
                          <img
                            src={photo}
                            alt={`Daily highlight ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              
                              // Only log error for base64 images (corruption) or if it's a URL that should exist
                              if (photo && photo.startsWith('data:image/')) {
                                console.error('Base64 image failed to load in itinerary (possible corruption):', photo.substring(0, 50) + '...');
                              } else if (photo && photo.startsWith('/')) {
                                // File path that doesn't exist - this is expected if file wasn't uploaded
                                console.warn('Image file not found:', photo);
                              } else if (photo && photo.startsWith('http')) {
                                // External URL that failed to load
                                console.error('External image failed to load:', photo);
                              }
                              
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center text-gray-400 text-xs px-1 text-center border-2 border-gray-200 bg-gray-50 rounded">
                                    <div>
                                      <div class="text-gray-600 font-medium mb-1">Image Not Available</div>
                                      <div class="text-gray-500">Photo ${index + 1}</div>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meals and Hotel */}
                {(day.meals || day.hotel) && (
                  <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-4 sm:gap-6" suppressHydrationWarning>
                    {/* Meals - 1/3 width, vertical column */}
                    {day.meals && (
                      <div className="w-full sm:w-1/3" suppressHydrationWarning>
                        <h3 className="font-medium text-sm sm:text-base text-gray-700 mb-3 flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-gray-500" />
                          {t.itinerary.meals}
                        </h3>
                        <div className="p-4 sm:p-5 bg-gray-100 rounded-xl" suppressHydrationWarning>
                          <div className="space-y-3 sm:space-y-4" suppressHydrationWarning>
                            {(() => {
                              const renderMealOptions = (mealType: 'breakfast' | 'lunch' | 'dinner', mealLabel: string) => {
                                const meal = day.meals?.[mealType];
                                if (!meal) return null;
                                
                                // Support both old format (string) and new format (array of objects)
                                let options: Array<{ en: string; zh: string; mapsLink: string } | string> = [];
                                if (typeof meal === 'string') {
                                  // Old format: single string
                                  options = [meal];
                                } else if (Array.isArray(meal)) {
                                  // New format: array of objects or strings
                                  options = meal;
                                } else {
                                  return null;
                                }
                                
                                if (options.length === 0) return null;
                                
                                return (
                                  <div suppressHydrationWarning>
                                    <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide" suppressHydrationWarning>{mealLabel}</div>
                                    <div className="space-y-2" suppressHydrationWarning>
                                      {options.map((option, idx) => {
                                        // Handle both string (old format) and object (new format)
                                        const isString = typeof option === 'string';
                                        const text = isString 
                                          ? option 
                                          : (language === 'zh-TW' && option.zh ? option.zh : option.en);
                                        const mapsLink = !isString && option.mapsLink ? option.mapsLink : null;
                                        
                                        return (
                                          <div key={idx} className="flex items-start gap-2" suppressHydrationWarning>
                                            <div className="flex-1">
                                              {mapsLink ? (
                                                <a
                                                  href={mapsLink}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-sm sm:text-base text-gray-900 font-medium hover:text-blue-600 transition-colors flex items-center gap-1"
                                                  suppressHydrationWarning
                                                >
                                                  {text}
                                                  <ExternalLink className="w-3 h-3" />
                                                </a>
                                              ) : (
                                                <div className="text-sm sm:text-base text-gray-900 font-medium" suppressHydrationWarning>{text}</div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              };
                              
                              return (
                                <>
                                  {renderMealOptions('breakfast', t.itinerary.breakfast)}
                                  {renderMealOptions('lunch', t.itinerary.lunch)}
                                  {renderMealOptions('dinner', t.itinerary.dinner)}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hotel - 2/3 width */}
                    {day.hotel && (
                      <div className="w-full sm:w-2/3" suppressHydrationWarning>
                        <h3 className="font-medium text-sm sm:text-base text-gray-700 mb-3 flex items-center gap-2">
                          <Hotel className="w-4 h-4 text-gray-500" />
                          {t.itinerary.accommodation}
                        </h3>
                        <div className="p-4 sm:p-5 bg-gray-100 rounded-xl" suppressHydrationWarning>
                          <div className="space-y-3 sm:space-y-4" suppressHydrationWarning>
                            <div suppressHydrationWarning>
                              {day.hotel.url ? (
                                <a
                                  href={day.hotel.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-base sm:text-lg text-gray-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
                                >
                                  {day.hotel.name}
                                  <span className="text-xs text-blue-600">↗</span>
                                </a>
                              ) : (
                                <div className="font-semibold text-base sm:text-lg text-gray-900">{day.hotel.name}</div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 break-words" suppressHydrationWarning>{day.hotel.address}</div>
                            {day.hotel.phone && (
                              <div className="text-sm text-gray-600" suppressHydrationWarning>Phone: {day.hotel.phone}</div>
                            )}
                            {/* Hotel Photos - smaller */}
                            {(day.hotel as any).photos && (day.hotel as any).photos.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100" suppressHydrationWarning>
                                <div className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wide">Hotel Photos</div>
                                <div className="grid grid-cols-6 gap-1.5" suppressHydrationWarning>
                                  {(day.hotel as any).photos.map((photo: string, photoIndex: number) => (
                                    <div
                                      key={photoIndex}
                                      className="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => openLightbox((day.hotel as any).photos, photoIndex)}
                                      suppressHydrationWarning
                                    >
                                      <img
                                        src={photo}
                                        alt={`${day.hotel.name} - Photo ${photoIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          // Fallback if image fails to load
                                          const target = e.target as HTMLImageElement;
                                          
                                          // Only log error for base64 images (corruption) or if it's a URL that should exist
                                          if (photo && photo.startsWith('data:image/')) {
                                            console.error('Base64 hotel image failed to load (possible corruption):', photo.substring(0, 50) + '...');
                                          } else if (photo && photo.startsWith('/')) {
                                            // File path that doesn't exist - this is expected if file wasn't uploaded
                                            console.warn('Hotel image file not found:', photo);
                                          } else if (photo && photo.startsWith('http')) {
                                            // External URL that failed to load
                                            console.error('External hotel image failed to load:', photo);
                                          }
                                          
                                          const parent = target.parentElement;
                                          if (parent) {
                                            parent.innerHTML = `
                                              <div class="w-full h-full flex items-center justify-center text-gray-400 text-xs px-1 text-center border-2 border-gray-200 bg-gray-50 rounded">
                                                <div>
                                                  <div class="text-gray-600 font-medium mb-1">Image Not Available</div>
                                                  <div class="text-gray-500">Photo ${photoIndex + 1}</div>
                                                </div>
                                              </div>
                                            `;
                                          }
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {(day.notes || (day as any).notesZh) && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="text-xs sm:text-sm text-amber-800">
                      {language === 'zh-TW' 
                        ? ((day as any).notesZh || day.notes)
                        : (day.notes || (day as any).notesZh)}
                    </div>
                  </div>
                )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeLightbox}
          suppressHydrationWarning
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-2"
            aria-label="Close lightbox"
            suppressHydrationWarning
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Previous Button */}
          {lightboxPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 p-2 bg-black bg-opacity-50 rounded-full"
              aria-label="Previous image"
              suppressHydrationWarning
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Next Button */}
          {lightboxPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 bg-black bg-opacity-50 rounded-full"
              aria-label="Next image"
              suppressHydrationWarning
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            suppressHydrationWarning
          >
            <img
              src={lightboxPhotos[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1} of ${lightboxPhotos.length}`}
              className="max-w-full max-h-[90vh] object-contain"
              suppressHydrationWarning
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const failedPhoto = lightboxPhotos[lightboxIndex];
                
                // Only log error for base64 images (corruption) or external URLs
                if (failedPhoto && failedPhoto.startsWith('data:image/')) {
                  console.error('Lightbox base64 image failed to load (possible corruption):', failedPhoto.substring(0, 50) + '...');
                } else if (failedPhoto && failedPhoto.startsWith('/')) {
                  console.warn('Lightbox image file not found:', failedPhoto);
                } else if (failedPhoto && failedPhoto.startsWith('http')) {
                  console.error('Lightbox external image failed to load:', failedPhoto);
                }
                
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Image Counter */}
          {lightboxPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-base bg-black bg-opacity-50 px-4 py-2 rounded-full" suppressHydrationWarning>
              {lightboxIndex + 1} / {lightboxPhotos.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

