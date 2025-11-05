"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Edit, Plus, Trash2, X, Lock, LogOut, Upload } from "lucide-react";
import tourData from "@/data/tour-data.json";
import { useLanguage } from "@/contexts/LanguageContext";
import { parseGPXToCoordinates, simplifyCoordinates } from "@/lib/gpxParser";

export default function AdminPage() {
  const { t, language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(tourData);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingOverview, setEditingOverview] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem("adminAuth");
    if (authToken === "authenticated") {
      setIsAuthenticated(true);
    }

    // Load data from localStorage if available
    const savedData = localStorage.getItem("tourData");
    if (savedData) {
      try {
        const loadedData = JSON.parse(savedData);
        setData(loadedData);
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    }
  }, []);

  // Sync itinerary length with overview.days
  const prevDaysRef = useRef<number | null>(null);
  useEffect(() => {
    const currentDays = data.overview.days;
    const currentItineraryLength = data.itinerary.length;
    
    // Skip if days haven't changed and we're already in sync
    if (prevDaysRef.current === currentDays && currentItineraryLength === currentDays) {
      const needsUpdate = data.itinerary.some((day, index) => day.day !== index + 1);
      if (!needsUpdate) {
        return; // No changes needed
      }
    }
    
    prevDaysRef.current = currentDays;

    setData((prevData) => {
      const days = prevData.overview.days;
      const itineraryLength = prevData.itinerary.length;

      if (itineraryLength < days) {
        // Add missing days
        const newItinerary = [...prevData.itinerary];
        const lastDay = newItinerary.length > 0 ? newItinerary[newItinerary.length - 1] : null;
        const lastDate = lastDay && lastDay.date ? new Date(lastDay.date) : new Date();
        
        for (let i = itineraryLength; i < days; i++) {
          const nextDate = new Date(lastDate);
          nextDate.setDate(nextDate.getDate() + (i - itineraryLength + 1));
          
          const defaultDay: any = {
            day: i + 1,
            date: nextDate.toISOString().split('T')[0],
            title: `Day ${i + 1}`,
            departureTime: "",
            distance: 0,
            elevationGain: 0,
            route: "",
            meals: {
              breakfast: "",
              lunch: "",
              dinner: "",
            },
            hotel: {
              name: "",
              address: "",
              phone: "",
            },
            highlights: [],
            photos: [],
            notes: "",
            dayType: "ride",
            description: "",
          };
          newItinerary.push(defaultDay);
        }
        return { ...prevData, itinerary: newItinerary };
      } else if (itineraryLength > days) {
        // Remove extra days
        const newItinerary = prevData.itinerary.slice(0, days).map((day, index) => ({
          ...day,
          day: index + 1,
        }));
        return { ...prevData, itinerary: newItinerary };
      } else {
        // Ensure day numbers are correct
        const needsUpdate = prevData.itinerary.some((day, index) => day.day !== index + 1);
        if (needsUpdate) {
          const newItinerary = prevData.itinerary.map((day, index) => ({
            ...day,
            day: index + 1,
          }));
          return { ...prevData, itinerary: newItinerary };
        }
      }
      return prevData;
    });
  }, [data.overview.days, data.itinerary.length]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "penny") {
      localStorage.setItem("adminAuth", "authenticated");
      setIsAuthenticated(true);
      setError("");
      setPassword("");
    } else {
      setError(t.admin.incorrectPassword);
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  // Compress image before storing to reduce localStorage size
  const compressImage = (file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t.admin.loginTitle}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t.admin.loginSubtitle}
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t.admin.password}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                placeholder={t.admin.passwordPlaceholder}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base font-medium"
            >
              {t.admin.login}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const dataString = JSON.stringify(data);
      const dataSize = new Blob([dataString]).size;
      const maxSize = 4 * 1024 * 1024; // 4MB (localStorage limit is typically 5-10MB, but we'll be conservative)

      // Check size before saving
      if (dataSize > maxSize) {
        alert(`Data is too large (${(dataSize / 1024 / 1024).toFixed(2)}MB). Please compress images or remove some photos. The data will still be saved to the server.`);
        // Don't save to localStorage, but still try server
      } else {
        // Save to localStorage for client-side persistence
        try {
          localStorage.setItem("tourData", dataString);
        } catch (e: any) {
          if (e.name === 'QuotaExceededError') {
            alert('Storage quota exceeded. Data will be saved to server only. Please remove some images or use smaller image files.');
          } else {
            throw e;
          }
        }
      }
      
      // Also save to server via API (if available)
      try {
        const response = await fetch("/api/tour-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        } else {
          console.error("Failed to save to server");
          // Still mark as saved if localStorage worked
          if (dataSize <= maxSize) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }
        }
      } catch (error) {
        console.error("Error saving to server:", error);
        // Still mark as saved if localStorage worked
        if (dataSize <= maxSize) {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving data. Please try again.");
    }
  };

  const updateOverview = (field: string, value: any) => {
    setData({
      ...data,
      overview: { ...data.overview, [field]: value },
    });
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const newItinerary = [...data.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setData({ ...data, itinerary: newItinerary });
  };

  const updateItineraryDayNested = (
    index: number,
    parent: string,
    field: string,
    value: any
  ) => {
    const newItinerary = [...data.itinerary];
    const currentDay = newItinerary[index] as any;
    newItinerary[index] = {
      ...currentDay,
      [parent]: {
        ...(currentDay[parent] || {}),
        [field]: value,
      },
    };
    setData({ ...data, itinerary: newItinerary });
  };

  const tabs = [
    { id: "overview", label: t.admin.overview },
    { id: "itinerary", label: t.admin.itinerary },
    { id: "notes", label: t.admin.notes },
    { id: "packing", label: t.admin.packing },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {t.admin.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t.admin.subtitle}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            {t.admin.logout}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-2 sm:space-x-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            <Save className="w-4 h-4" />
            {t.admin.saveChanges}
          </button>
          {saved && (
            <span className="text-sm sm:text-base text-green-600 flex items-center justify-center sm:justify-start sm:ml-4">
              {t.admin.saved}
            </span>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-gray-900">
                {t.admin.tourOverview}
              </h2>
              <button
                onClick={() => setEditingOverview(!editingOverview)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
                {editingOverview ? t.admin.cancel : t.admin.edit}
              </button>
            </div>
            {editingOverview ? (
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.titleLabel}
                </label>
                <input
                  type="text"
                  value={data.overview.title}
                  onChange={(e) => updateOverview("title", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.destination}
                </label>
                <input
                  type="text"
                  value={data.overview.destination}
                  onChange={(e) => updateOverview("destination", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.home.days}
                </label>
                <input
                  type="number"
                  min="1"
                  value={data.overview.days}
                  onChange={(e) => {
                    const newDays = parseInt(e.target.value) || 1;
                    updateOverview("days", newDays);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Itinerary will automatically adjust to this number of days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.totalDistance}
                </label>
                <input
                  type="number"
                  value={data.overview.totalDistance != null && !isNaN(data.overview.totalDistance) ? data.overview.totalDistance : ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                    updateOverview("totalDistance", value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.elevationGain}
                </label>
                <input
                  type="number"
                  value={data.overview.elevationGain != null && !isNaN(data.overview.elevationGain) ? data.overview.elevationGain : ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                    updateOverview("elevationGain", value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.elevationDrop}
                </label>
                <input
                  type="number"
                  value={data.overview.elevationDrop != null && !isNaN(data.overview.elevationDrop) ? data.overview.elevationDrop : ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                    updateOverview("elevationDrop", value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.descriptionLabel} (English)
                </label>
                <textarea
                  value={data.overview.description || ""}
                  onChange={(e) => updateOverview("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                  placeholder="Description displayed in the hero section (English)..."
                />
                <p className="mt-1 text-xs text-gray-500">This description appears in the hero section on the homepage when English is selected.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.admin.descriptionLabel} (繁體中文)
                </label>
                <textarea
                  value={data.overview.descriptionZh || ""}
                  onChange={(e) => updateOverview("descriptionZh", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                  placeholder="首頁英雄區塊顯示的描述（繁體中文）..."
                />
                <p className="mt-1 text-xs text-gray-500">此描述會在選擇繁體中文時顯示於首頁的英雄區塊。</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Overview Text (English)
                </label>
                <textarea
                  value={data.overview.tourOverviewText || ""}
                  onChange={(e) => updateOverview("tourOverviewText", e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                  placeholder="Tour overview text displayed on the homepage in English..."
                />
                <p className="mt-1 text-xs text-gray-500">This text appears in the "Tour Overview" section on the homepage when English is selected.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Overview Text (繁體中文)
                </label>
                <textarea
                  value={data.overview.tourOverviewTextZh || ""}
                  onChange={(e) => updateOverview("tourOverviewTextZh", e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                  placeholder="首頁「行程總覽」區塊顯示的繁體中文文字..."
                />
                <p className="mt-1 text-xs text-gray-500">此文字會在選擇繁體中文時顯示於首頁的「行程總覽」區塊。</p>
              </div>
            </div>
            ) : (
              <div className="space-y-4 text-sm sm:text-base">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-gray-700">{t.admin.titleLabel}:</span>
                    <p className="text-gray-900 mt-1">{data.overview.title}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t.admin.destination}:</span>
                    <p className="text-gray-900 mt-1">{data.overview.destination}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t.home.days}:</span>
                    <p className="text-gray-900 mt-1">{data.overview.days}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t.admin.totalDistance}:</span>
                    <p className="text-gray-900 mt-1">{data.overview.totalDistance} km</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t.admin.elevationGain}:</span>
                    <p className="text-gray-900 mt-1">{data.overview.elevationGain} m</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{t.admin.elevationDrop}:</span>
                    <p className="text-gray-900 mt-1">{data.overview.elevationDrop} m</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-700 block mb-2">{t.admin.descriptionLabel} (English):</span>
                  <p className="text-gray-900 whitespace-pre-line">{data.overview.description || "N/A"}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-700 block mb-2">{t.admin.descriptionLabel} (繁體中文):</span>
                  <p className="text-gray-900 whitespace-pre-line">{data.overview.descriptionZh || "N/A"}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-700 block mb-2">Tour Overview Text (English):</span>
                  <p className="text-gray-900 whitespace-pre-line">{data.overview.tourOverviewText || "N/A"}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-700 block mb-2">Tour Overview Text (繁體中文):</span>
                  <p className="text-gray-900 whitespace-pre-line">{data.overview.tourOverviewTextZh || "N/A"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-sm sm:text-base text-blue-900">
                <strong>Current Tour:</strong> {data.overview.days} days • {data.itinerary.length} itinerary {data.itinerary.length === 1 ? 'day' : 'days'} configured
                {data.itinerary.length !== data.overview.days && (
                  <span className="text-blue-700 ml-2">
                    (Itinerary will automatically adjust to {data.overview.days} days)
                  </span>
                )}
              </p>
            </div>
            {data.itinerary.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-playfair text-xl font-semibold text-gray-900">
                    {t.admin.day} {day.day}
                  </h3>
                  <button
                    onClick={() =>
                      setEditingIndex(editingIndex === index ? null : index)
                    }
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                    {editingIndex === index ? t.admin.cancel : t.admin.edit}
                  </button>
                </div>

                {editingIndex === index ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.admin.titleLabel} (English)
                        </label>
                        <input
                          type="text"
                          value={day.title || ""}
                          onChange={(e) =>
                            updateItineraryDay(index, "title", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.admin.titleLabel} (繁體中文)
                        </label>
                        <input
                          type="text"
                          value={(day as any).titleZh || ""}
                          onChange={(e) =>
                            updateItineraryDay(index, "titleZh", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.admin.dateLabel}
                          {index === 0 && (
                            <span className="ml-2 text-xs text-gray-500">(Changing Day 1 will auto-populate subsequent days)</span>
                          )}
                        </label>
                        <input
                          type="date"
                          value={day.date || ""}
                          onChange={(e) => {
                            const newDate = e.target.value;
                            
                            // If it's Day 1 and has a date, update Day 1 and auto-populate subsequent days
                            if (index === 0) {
                              if (newDate) {
                                const startDate = new Date(newDate);
                                const newItinerary = [...data.itinerary];
                                
                                // Update Day 1 first
                                newItinerary[0] = {
                                  ...newItinerary[0],
                                  date: newDate,
                                };
                                
                                // Auto-populate subsequent days
                                for (let i = 1; i < newItinerary.length; i++) {
                                  const nextDate = new Date(startDate);
                                  nextDate.setDate(startDate.getDate() + i);
                                  newItinerary[i] = {
                                    ...newItinerary[i],
                                    date: nextDate.toISOString().split('T')[0],
                                  };
                                }
                                setData({ ...data, itinerary: newItinerary });
                              } else {
                                // If Day 1 date is cleared, just update Day 1
                                updateItineraryDay(index, "date", newDate);
                              }
                            } else {
                              // For other days, just update that day's date
                              updateItineraryDay(index, "date", newDate);
                            }
                          }}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.admin.dayType}
                        </label>
                        <select
                          value={day.dayType || "ride"}
                          onChange={(e) =>
                            updateItineraryDay(index, "dayType", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        >
                          <option value="arrival">{t.admin.arrival}</option>
                          <option value="ride">{t.admin.ride}</option>
                          <option value="free-and-easy">{t.admin.freeAndEasy}</option>
                          <option value="departure">{t.admin.departure}</option>
                        </select>
                      </div>
                      {(day.dayType === "arrival" || day.dayType === "departure") ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.departure} {t.itinerary.departureTime}
                            </label>
                            <input
                              type="time"
                              value={day.departureTime || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "departureTime", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              placeholder="e.g., 09:00"
                            />
                            <p className="mt-1 text-xs text-gray-500">Day departure time (for activities/meeting time)</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.flightNumber}
                            </label>
                            <input
                              type="text"
                              value={day.flight?.flightNumber || ""}
                              onChange={(e) =>
                                updateItineraryDayNested(index, "flight", "flightNumber", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              placeholder="e.g., JL961"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.flightDetails}
                            </label>
                            <input
                              type="text"
                              value={day.flight?.details || ""}
                              onChange={(e) =>
                                updateItineraryDayNested(index, "flight", "details", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              placeholder="e.g., Tokyo (NRT) → Naha (OKA)"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Flight {t.itinerary.departureTime}
                            </label>
                            <input
                              type="time"
                              value={day.flight?.departureTime || ""}
                              onChange={(e) =>
                                updateItineraryDayNested(index, "flight", "departureTime", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Flight {t.itinerary.arrivalTime}
                            </label>
                            <input
                              type="time"
                              value={day.flight?.arrivalTime || ""}
                              onChange={(e) =>
                                updateItineraryDayNested(index, "flight", "arrivalTime", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.route} (English)
                            </label>
                            <input
                              type="text"
                              value={day.route || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "route", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.route} (繁體中文)
                            </label>
                            <input
                              type="text"
                              value={(day as any).routeZh || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "routeZh", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Route fields for ride/free-and-easy days */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.route} (English)
                            </label>
                            <input
                              type="text"
                              value={day.route || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "route", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.route} (繁體中文)
                            </label>
                            <input
                              type="text"
                              value={(day as any).routeZh || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "routeZh", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                        </>
                      )}
                      {/* Route Map Options - Only show for ride/free-and-easy days */}
                      {(!day.dayType || day.dayType === "ride" || day.dayType === "free-and-easy") && (
                        <div className="sm:col-span-2 border-t border-gray-200 pt-4 mt-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Route Map Options</h4>
                          <p className="text-xs text-gray-600 mb-4">Configure route map by uploading a GPX file or providing a GPX URL. The map will only display when at least one option is configured.</p>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Option 1: GPX File URL
                              </label>
                              <input
                                type="url"
                                value={(day as any).gpxUrl || ""}
                                onChange={(e) =>
                                  updateItineraryDay(index, "gpxUrl", e.target.value)
                                }
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                                placeholder="https://example.com/route.gpx"
                              />
                              <p className="mt-1 text-xs text-gray-500">Enter a URL to a GPX file hosted online. This will be used to display the route map and elevation profile.</p>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Option 2: Upload GPX File (Recommended)
                              </label>
                              <div className="space-y-3">
                                <div>
                                  <label className="flex flex-col items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                    <Upload className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Choose GPX File</span>
                                    <span className="text-xs text-gray-500">Click to upload or drag and drop</span>
                                    <input
                                      type="file"
                                      accept=".gpx,application/gpx+xml,application/xml,text/xml"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          try {
                                            // Extract coordinates from GPX file
                                            const coordinates = await parseGPXToCoordinates(file);
                                            
                                            // Store ALL coordinates (no simplification)
                                            // The elevation profile will use all points for accurate distance calculation
                                            updateItineraryDay(index, "routeCoordinates", coordinates);
                                            
                                            // Also convert GPX file to base64 for storage (optional - can be used as fallback)
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              const base64String = event.target?.result as string;
                                              // Store as gpxData if needed (optional)
                                              // updateItineraryDay(index, "gpxData", base64String);
                                            };
                                            reader.readAsDataURL(file);
                                            
                                            const pointsWithElevation = coordinates.filter(c => c.elevation !== undefined).length;
                                            alert(`Successfully uploaded GPX file!\n\nExtracted ${coordinates.length} coordinates${pointsWithElevation > 0 ? ` (${pointsWithElevation} with elevation data)` : ''}.\n\nThe route map will now display for this day.`);
                                          } catch (error) {
                                            alert(`Error parsing GPX file: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease make sure the file is a valid GPX file.`);
                                          }
                                        }
                                        // Reset input so same file can be selected again
                                        e.target.value = '';
                                      }}
                                    />
                                  </label>
                                </div>
                                {(day as any).routeCoordinates && Array.isArray((day as any).routeCoordinates) && (day as any).routeCoordinates.length > 0 && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-xs text-green-800">
                                      <strong>✓ GPX file loaded:</strong> {((day as any).routeCoordinates as any[]).length} coordinates extracted. Route map will be displayed.
                                    </p>
                                  </div>
                                )}
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                Upload a GPX file to automatically extract route coordinates. The coordinates will be used to display the route map and elevation profile. 
                                All coordinates from the GPX file will be saved for accurate distance calculation and elevation profile.
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Route Coordinates (Optional - JSON array)
                              </label>
                              <textarea
                                value={JSON.stringify((day as any).routeCoordinates || [], null, 2)}
                                onChange={(e) => {
                                  try {
                                    const coords = JSON.parse(e.target.value);
                                    if (Array.isArray(coords)) {
                                      updateItineraryDay(index, "routeCoordinates", coords);
                                    }
                                  } catch (error) {
                                    // Invalid JSON, don't update
                                  }
                                }}
                                rows={6}
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                                placeholder='[{"lat": 26.2124, "lng": 127.6809}, {"lat": 26.3000, "lng": 127.8000}]'
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Array of coordinates in format: [&#123;"lat": 26.2124, "lng": 127.6809&#125;, ...]. 
                                If provided, this will be used instead of geocoding the route string. Priority: GPX URL &gt; Coordinates &gt; Route string geocoding.
                                {(day as any).routeCoordinates && (day as any).routeCoordinates.length > 0 && (
                                  <span className="ml-2 text-green-600">
                                    ({((day as any).routeCoordinates as any[]).length} coordinates loaded)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {day.dayType !== "arrival" && day.dayType !== "departure" ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.departureTime}
                            </label>
                            <input
                              type="time"
                              value={day.departureTime || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "departureTime", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.distance} (km)
                            </label>
                            <input
                              type="number"
                              value={day.distance != null && !isNaN(day.distance) ? day.distance : ""}
                              onChange={(e) => {
                                const value = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                                updateItineraryDay(index, "distance", value);
                              }}
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.route} (English)
                            </label>
                            <input
                              type="text"
                              value={day.route || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "route", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.route} (繁體中文)
                            </label>
                            <input
                              type="text"
                              value={(day as any).routeZh || ""}
                              onChange={(e) =>
                                updateItineraryDay(index, "routeZh", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.itinerary.elevationGain} (m)
                            </label>
                            <input
                              type="number"
                              value={day.elevationGain != null && !isNaN(day.elevationGain) ? day.elevationGain : ""}
                              onChange={(e) => {
                                const value = e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                                updateItineraryDay(index, "elevationGain", value);
                              }}
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.itinerary.dayDescription} (English)
                      </label>
                      <textarea
                        value={day.description || ""}
                        onChange={(e) =>
                          updateItineraryDay(index, "description", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        placeholder="Describe how the day looks like, what participants can expect..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.itinerary.dayDescription} (繁體中文)
                      </label>
                      <textarea
                        value={(day as any).descriptionZh || ""}
                        onChange={(e) =>
                          updateItineraryDay(index, "descriptionZh", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        placeholder="描述這一天的行程，參與者可以期待什麼..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.itinerary.highlights} (English)
                      </label>
                      <div className="space-y-2">
                        {(day.highlights || []).map((highlight, highlightIndex) => (
                          <div key={highlightIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const newItinerary = [...data.itinerary];
                                const newHighlights = [...(newItinerary[index].highlights || [])];
                                newHighlights[highlightIndex] = e.target.value;
                                newItinerary[index] = {
                                  ...newItinerary[index],
                                  highlights: newHighlights,
                                };
                                setData({ ...data, itinerary: newItinerary });
                              }}
                              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                            <button
                              onClick={() => {
                                const newItinerary = [...data.itinerary];
                                const newHighlights = [...(newItinerary[index].highlights || [])];
                                newHighlights.splice(highlightIndex, 1);
                                newItinerary[index] = {
                                  ...newItinerary[index],
                                  highlights: newHighlights,
                                };
                                setData({ ...data, itinerary: newItinerary });
                              }}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newItinerary = [...data.itinerary];
                            const newHighlights = [...(newItinerary[index].highlights || [])];
                            newHighlights.push("");
                            newItinerary[index] = {
                              ...newItinerary[index],
                              highlights: newHighlights,
                            };
                            setData({ ...data, itinerary: newItinerary });
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                          {t.admin.addHighlight}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.itinerary.highlights} (繁體中文)
                      </label>
                      <div className="space-y-2">
                        {((day as any).highlightsZh || []).map((highlight: string, highlightIndex: number) => (
                          <div key={highlightIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const newItinerary = [...data.itinerary];
                                const currentDay = newItinerary[index] as any;
                                const newHighlightsZh = [...(currentDay.highlightsZh || [])];
                                newHighlightsZh[highlightIndex] = e.target.value;
                                newItinerary[index] = {
                                  ...currentDay,
                                  highlightsZh: newHighlightsZh,
                                };
                                setData({ ...data, itinerary: newItinerary });
                              }}
                              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                            <button
                              onClick={() => {
                                const newItinerary = [...data.itinerary];
                                const currentDay = newItinerary[index] as any;
                                const newHighlightsZh = [...(currentDay.highlightsZh || [])];
                                newHighlightsZh.splice(highlightIndex, 1);
                                newItinerary[index] = {
                                  ...currentDay,
                                  highlightsZh: newHighlightsZh,
                                };
                                setData({ ...data, itinerary: newItinerary });
                              }}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newItinerary = [...data.itinerary];
                            const currentDay = newItinerary[index] as any;
                            const newHighlightsZh = [...(currentDay.highlightsZh || [])];
                            newHighlightsZh.push("");
                            newItinerary[index] = {
                              ...currentDay,
                              highlightsZh: newHighlightsZh,
                            };
                            setData({ ...data, itinerary: newItinerary });
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                        >
                          <Plus className="w-4 h-4" />
                          {t.admin.addHighlight}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.dailyHighlightPhotos}
                      </label>
                      {/* Bulk Upload */}
                      <div className="mb-4">
                        <label className="block text-xs text-gray-600 mb-2">
                          {t.admin.uploadMultiplePhotos}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;

                            // Check file sizes
                            const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
                            if (oversizedFiles.length > 0) {
                              alert(`${oversizedFiles.length} image(s) exceed 5MB limit. Please compress them first.`);
                              return;
                            }

                            // Limit to 5 photos total
                            const currentPhotos = (day.photos || []).filter((p: string) => p && p.trim()).length;
                            const maxPhotos = 5;
                            const remainingSlots = maxPhotos - currentPhotos;
                            
                            if (remainingSlots <= 0) {
                              alert("Maximum 5 photos allowed. Please delete some photos first.");
                              e.target.value = ''; // Clear input
                              return;
                            }

                            const filesToProcess = files.slice(0, remainingSlots);
                            if (files.length > remainingSlots) {
                              alert(`Only ${remainingSlots} photo slot(s) available. Uploaded ${remainingSlots} photo(s).`);
                            }

                            try {
                              const newItinerary = [...data.itinerary];
                              const newPhotos: string[] = [...((newItinerary[index].photos || []) as string[])];
                              
                              // Process all files
                              for (const file of filesToProcess) {
                                const base64String = await compressImage(file, 1200, 1200, 0.7);
                                newPhotos.push(base64String);
                              }
                              
                              (newItinerary[index] as any).photos = newPhotos;
                              setData({ ...data, itinerary: newItinerary });
                              
                              // Clear input
                              e.target.value = '';
                            } catch (error) {
                              console.error("Error compressing images:", error);
                              alert("Error processing images. Please try again.");
                            }
                          }}
                          className="w-full text-xs sm:text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                        />
                        <p className="mt-1 text-xs text-gray-500">{t.admin.uploadMultiplePhotosHint}</p>
                      </div>
                      <div className="space-y-3">
                        {(day.photos || []).map((photo: string, photoIndex: number) => (
                          <div key={photoIndex} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                            <div className="flex items-start gap-3">
                              {/* Photo Preview */}
                              {photo && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={photo}
                                    alt={`Daily highlight photo ${photoIndex + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex-1 space-y-2">
                                {/* File Upload */}
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    {t.admin.uploadImage}
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        // Check file size (max 5MB)
                                        if (file.size > 5 * 1024 * 1024) {
                                          alert("Image size must be less than 5MB");
                                          return;
                                        }
                                        try {
                                          // Compress and convert to base64
                                          const base64String = await compressImage(file, 1200, 1200, 0.7);
                                          const newItinerary = [...data.itinerary];
                                          const newPhotos: string[] = [...((newItinerary[index].photos || []) as string[])];
                                          newPhotos[photoIndex] = base64String;
                                          (newItinerary[index] as any).photos = newPhotos;
                                          setData({ ...data, itinerary: newItinerary });
                                        } catch (error) {
                                          console.error("Error compressing image:", error);
                                          alert("Error processing image. Please try again.");
                                        }
                                      }
                                    }}
                                    className="w-full text-xs sm:text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                                  />
                                </div>
                                {/* URL Input (alternative) */}
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">
                                    {t.admin.orEnterImageUrl}
                                  </label>
                                  <input
                                    type="url"
                                    value={photo?.startsWith('data:') ? '' : photo || ''}
                                    onChange={(e) => {
                                      const newItinerary = [...data.itinerary];
                                      const newPhotos: string[] = [...((newItinerary[index].photos || []) as string[])];
                                      newPhotos[photoIndex] = e.target.value;
                                      (newItinerary[index] as any).photos = newPhotos;
                                      setData({ ...data, itinerary: newItinerary });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                                    placeholder="https://example.com/photo.jpg"
                                  />
                                </div>
                                {/* Delete Button */}
                                <button
                                  onClick={() => {
                                    const newItinerary = [...data.itinerary];
                                    const newPhotos: string[] = [...((newItinerary[index].photos || []) as string[])];
                                    newPhotos.splice(photoIndex, 1);
                                    (newItinerary[index] as any).photos = newPhotos;
                                    setData({ ...data, itinerary: newItinerary });
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  {t.admin.delete}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(day.photos || []).length < 5 && (
                          <button
                            onClick={() => {
                              const newItinerary = [...data.itinerary];
                              const newPhotos = [...(newItinerary[index].photos || [])];
                              newPhotos.push("");
                              (newItinerary[index] as any).photos = newPhotos;
                              setData({ ...data, itinerary: newItinerary });
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                            Add Photo
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Upload images (max 5MB each, automatically compressed) or paste image URLs. Add 3-5 photos for daily highlights.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.notesLabel} (English)
                      </label>
                      <textarea
                        value={day.notes || ""}
                        onChange={(e) =>
                          updateItineraryDay(index, "notes", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.notesLabel} (繁體中文)
                      </label>
                      <textarea
                        value={(day as any).notesZh || ""}
                        onChange={(e) =>
                          updateItineraryDay(index, "notesZh", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.itinerary.breakfast}
                        </label>
                        <input
                          type="text"
                          value={day.meals.breakfast || ""}
                          onChange={(e) =>
                            updateItineraryDayNested(index, "meals", "breakfast", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.itinerary.lunch}
                        </label>
                        <input
                          type="text"
                          value={day.meals.lunch || ""}
                          onChange={(e) =>
                            updateItineraryDayNested(index, "meals", "lunch", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.itinerary.dinner}
                        </label>
                        <input
                          type="text"
                          value={day.meals.dinner || ""}
                          onChange={(e) =>
                            updateItineraryDayNested(index, "meals", "dinner", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900">{t.itinerary.accommodation}</h3>
                        {!day.hotel && (
                          <button
                            onClick={() => {
                              const newItinerary = [...data.itinerary];
                              (newItinerary[index] as any).hotel = {
                                name: "",
                                address: "",
                                phone: "",
                                photos: [] as string[],
                                url: "",
                              };
                              setData({ ...data, itinerary: newItinerary });
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                            {t.admin.addHotel}
                          </button>
                        )}
                        {day.hotel && (
                          <button
                            onClick={() => {
                              const newItinerary = [...data.itinerary];
                              (newItinerary[index] as any).hotel = null;
                              setData({ ...data, itinerary: newItinerary });
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t.admin.removeHotel}
                          </button>
                        )}
                      </div>
                      {day.hotel ? (
                        <>
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.admin.hotelName}
                              </label>
                              <input
                                type="text"
                                value={day.hotel.name || ""}
                                onChange={(e) =>
                                  updateItineraryDayNested(index, "hotel", "name", e.target.value)
                                }
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.admin.address}
                              </label>
                              <input
                                type="text"
                                value={day.hotel.address || ""}
                                onChange={(e) =>
                                  updateItineraryDayNested(index, "hotel", "address", e.target.value)
                                }
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.admin.phone}
                              </label>
                              <input
                                type="text"
                                value={day.hotel.phone || ""}
                                onChange={(e) =>
                                  updateItineraryDayNested(index, "hotel", "phone", e.target.value)
                                }
                                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.admin.hotelWebsiteUrl}
                            </label>
                            <input
                              type="url"
                              value={(day.hotel as any).url || ""}
                              onChange={(e) =>
                                updateItineraryDayNested(index, "hotel", "url", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                              placeholder="https://example.com"
                            />
                            <p className="mt-1 text-xs text-gray-500">Link to hotel website (opens in new tab)</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.admin.hotelPhotos}
                            </label>
                            {/* Bulk Upload */}
                            <div className="mb-4">
                              <label className="block text-xs text-gray-600 mb-2">
                                {t.admin.uploadMultiplePhotos}
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;

                                  // Check file sizes
                                  const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
                                  if (oversizedFiles.length > 0) {
                                    alert(`${oversizedFiles.length} image(s) exceed 5MB limit. Please compress them first.`);
                                    return;
                                  }

                                  // Limit to 3 photos total
                                  const currentDay = data.itinerary[index] as any;
                                  const currentPhotos = (currentDay.hotel?.photos || []).filter((p: string) => p && p.trim()).length;
                                  const maxPhotos = 3;
                                  const remainingSlots = maxPhotos - currentPhotos;
                                  
                                  if (remainingSlots <= 0) {
                                    alert("Maximum 3 photos allowed. Please delete some photos first.");
                                    e.target.value = ''; // Clear input
                                    return;
                                  }

                                  const filesToProcess = files.slice(0, remainingSlots);
                                  if (files.length > remainingSlots) {
                                    alert(`Only ${remainingSlots} photo slot(s) available. Uploaded ${remainingSlots} photo(s).`);
                                  }

                                  try {
                                    const newItinerary = [...data.itinerary];
                                    const currentDay = newItinerary[index] as any;
                                    const newPhotos: string[] = [...((currentDay.hotel?.photos || []) as string[])];
                                    
                                    // Process all files
                                    for (const file of filesToProcess) {
                                      const base64String = await compressImage(file, 1200, 1200, 0.7);
                                      newPhotos.push(base64String);
                                    }
                                    
                                    newItinerary[index] = {
                                      ...currentDay,
                                      hotel: {
                                        ...currentDay.hotel,
                                        photos: newPhotos,
                                      },
                                    };
                                    setData({ ...data, itinerary: newItinerary });
                                    
                                    // Clear input
                                    e.target.value = '';
                                  } catch (error) {
                                    console.error("Error compressing images:", error);
                                    alert("Error processing images. Please try again.");
                                  }
                                }}
                                className="w-full text-xs sm:text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                              />
                              <p className="mt-1 text-xs text-gray-500">{t.admin.uploadMultiplePhotosHint}</p>
                            </div>
                            <div className="space-y-3">
                              {((day.hotel as any).photos || []).map((photo: string, photoIndex: number) => (
                                <div key={photoIndex} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                                  <div className="flex items-start gap-3">
                                    {/* Photo Preview */}
                                    {photo && (
                                      <div className="flex-shrink-0">
                                        <img
                                          src={photo}
                                          alt={`Hotel photo ${photoIndex + 1}`}
                                          className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                          }}
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 space-y-2">
                                      {/* File Upload */}
                                      <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                          {t.admin.uploadImage}
                                        </label>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              // Check file size (max 5MB)
                                              if (file.size > 5 * 1024 * 1024) {
                                                alert("Image size must be less than 5MB");
                                                return;
                                              }
                                              try {
                                                // Compress and convert to base64
                                                const base64String = await compressImage(file, 1200, 1200, 0.7);
                                                const newItinerary = [...data.itinerary];
                                                const currentDay = newItinerary[index] as any;
                                                const newPhotos = [...(currentDay.hotel?.photos || [])];
                                                newPhotos[photoIndex] = base64String;
                                                newItinerary[index] = {
                                                  ...currentDay,
                                                  hotel: {
                                                    ...currentDay.hotel,
                                                    photos: newPhotos,
                                                  },
                                                };
                                                setData({ ...data, itinerary: newItinerary });
                                              } catch (error) {
                                                console.error("Error compressing image:", error);
                                                alert("Error processing image. Please try again.");
                                              }
                                            }
                                          }}
                                          className="w-full text-xs sm:text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                                        />
                                      </div>
                                      {/* URL Input (alternative) */}
                                      <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                          {t.admin.orEnterImageUrl}
                                        </label>
                                        <input
                                          type="url"
                                          value={photo?.startsWith('data:') ? '' : photo || ''}
                                          onChange={(e) => {
                                            const newItinerary = [...data.itinerary];
                                            const currentDay = newItinerary[index] as any;
                                            const newPhotos = [...(currentDay.hotel?.photos || [])];
                                            newPhotos[photoIndex] = e.target.value;
                                            newItinerary[index] = {
                                              ...currentDay,
                                              hotel: {
                                                ...currentDay.hotel,
                                                photos: newPhotos,
                                              },
                                            };
                                            setData({ ...data, itinerary: newItinerary });
                                          }}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                                          placeholder="https://example.com/photo.jpg"
                                        />
                                      </div>
                                      {/* Delete Button */}
                                      <button
                                        onClick={() => {
                                          const newItinerary = [...data.itinerary];
                                          const currentDay = newItinerary[index] as any;
                                          const newPhotos = [...(currentDay.hotel?.photos || [])];
                                          newPhotos.splice(photoIndex, 1);
                                          newItinerary[index] = {
                                            ...currentDay,
                                            hotel: {
                                              ...currentDay.hotel,
                                              photos: newPhotos,
                                            },
                                          };
                                          setData({ ...data, itinerary: newItinerary });
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        {t.admin.delete}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {((day.hotel as any).photos || []).length < 3 && (
                                <button
                                  onClick={() => {
                                    const newItinerary = [...data.itinerary];
                                    const currentDay = newItinerary[index] as any;
                                    const newPhotos = [...(currentDay.hotel?.photos || [])];
                                    newPhotos.push("");
                                    newItinerary[index] = {
                                      ...currentDay,
                                      hotel: {
                                        ...currentDay.hotel,
                                        photos: newPhotos,
                                      },
                                    };
                                    setData({ ...data, itinerary: newItinerary });
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Photo
                                </button>
                              )}
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                              Upload images (max 5MB each, automatically compressed) or paste image URLs. Up to 3 photos per hotel.
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">{t.admin.noHotelInfo}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm sm:text-base text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>
                        <strong>{t.admin.dayType}:</strong>{" "}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 capitalize">
                          {day.dayType === "arrival" ? t.admin.arrival :
                           day.dayType === "departure" ? t.admin.departure :
                           day.dayType === "free-and-easy" ? t.admin.freeAndEasy :
                           t.admin.ride}
                        </span>
                      </span>
                    </div>
                    <p>
                      <strong>{language === 'en' ? 'Date:' : '日期：'}</strong> {day.date}
                    </p>
                    {(day.dayType === "arrival" || day.dayType === "departure") && day.flight ? (
                      <>
                        <p>
                          <strong>{t.itinerary.flightNumber}:</strong> {day.flight.flightNumber || "N/A"}
                        </p>
                        <p>
                          <strong>{t.itinerary.flightDetails}:</strong> {day.flight.details || "N/A"}
                        </p>
                        {day.flight.departureTime && (
                          <p>
                            <strong>{t.itinerary.departureTime}:</strong> {day.flight.departureTime}
                          </p>
                        )}
                        {day.flight.arrivalTime && (
                          <p>
                            <strong>{t.itinerary.arrivalTime}:</strong> {day.flight.arrivalTime}
                          </p>
                        )}
                        {day.route && (
                          <p>
                            <strong>{t.itinerary.route}:</strong> {day.route}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>{t.itinerary.departure}:</strong> {day.departureTime || "N/A"}
                        </p>
                        {(day.dayType === "ride" || day.dayType === "free-and-easy" || !day.dayType) && (
                          <>
                            <p>
                              <strong>{t.itinerary.distance}:</strong> {day.distance} km
                            </p>
                            <p>
                              <strong>{t.itinerary.route}:</strong> {day.route}
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            {data.importantNotes.map((category, catIndex) => (
              <div
                key={catIndex}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newNotes = [...data.importantNotes];
                          newNotes[catIndex].items[itemIndex] = e.target.value;
                          setData({ ...data, importantNotes: newNotes });
                        }}
                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                      />
                      <button
                        onClick={() => {
                          const newNotes = [...data.importantNotes];
                          newNotes[catIndex].items.splice(itemIndex, 1);
                          setData({ ...data, importantNotes: newNotes });
                        }}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newNotes = [...data.importantNotes];
                      newNotes[catIndex].items.push("");
                      setData({ ...data, importantNotes: newNotes });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    {t.admin.addItem}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Packing Tab */}
        {activeTab === "packing" && (
          <div className="space-y-6">
            {Object.entries(data.packingList).map(([category, items]) => (
              <div
                key={category}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 capitalize">
                  {category}
                </h3>
                <div className="space-y-2">
                  {(items as string[]).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newPackingList = { ...data.packingList };
                          (newPackingList as any)[category][itemIndex] = e.target.value;
                          setData({ ...data, packingList: newPackingList });
                        }}
                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                      />
                      <button
                        onClick={() => {
                          const newPackingList = { ...data.packingList };
                          (newPackingList as any)[category].splice(itemIndex, 1);
                          setData({ ...data, packingList: newPackingList });
                        }}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newPackingList = { ...data.packingList };
                      (newPackingList as any)[category].push("");
                      setData({ ...data, packingList: newPackingList });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    {t.admin.addItem}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

