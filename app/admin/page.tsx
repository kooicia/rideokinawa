"use client";

import { useState, useEffect } from "react";
import { Save, Edit, Plus, Trash2, X } from "lucide-react";
import tourData from "@/data/tour-data.json";

export default function AdminPage() {
  const [data, setData] = useState(tourData);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem("tourData");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    }
  }, []);

  const handleSave = async () => {
    // Save to localStorage for client-side persistence
    localStorage.setItem("tourData", JSON.stringify(data));
    
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
        // Still mark as saved since localStorage worked
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving to server:", error);
      // Still mark as saved since localStorage worked
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "notes", label: "Notes" },
    { id: "packing", label: "Packing" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Admin Panel
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Edit tour content and information
          </p>
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
            Save Changes
          </button>
          {saved && (
            <span className="text-sm sm:text-base text-green-600 flex items-center justify-center sm:justify-start sm:ml-4">
              Saved successfully!
            </span>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-gray-900">
              Tour Overview
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
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
                  Destination
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
                  Days
                </label>
                <input
                  type="number"
                  value={data.overview.days}
                  onChange={(e) => updateOverview("days", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Distance (km)
                </label>
                <input
                  type="number"
                  value={data.overview.totalDistance}
                  onChange={(e) => updateOverview("totalDistance", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elevation Gain (m)
                </label>
                <input
                  type="number"
                  value={data.overview.elevationGain}
                  onChange={(e) => updateOverview("elevationGain", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elevation Drop (m)
                </label>
                <input
                  type="number"
                  value={data.overview.elevationDrop}
                  onChange={(e) => updateOverview("elevationDrop", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={data.overview.description}
                  onChange={(e) => updateOverview("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            {data.itinerary.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-playfair text-xl font-semibold text-gray-900">
                    Day {day.day}
                  </h3>
                  <button
                    onClick={() =>
                      setEditingIndex(editingIndex === index ? null : index)
                    }
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                    {editingIndex === index ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editingIndex === index ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) =>
                            updateItineraryDay(index, "title", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={day.date}
                          onChange={(e) =>
                            updateItineraryDay(index, "date", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Day Type
                        </label>
                        <select
                          value={day.dayType || "ride"}
                          onChange={(e) =>
                            updateItineraryDay(index, "dayType", e.target.value)
                          }
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                        >
                          <option value="arrival">Arrival Day</option>
                          <option value="ride">Ride Day</option>
                          <option value="free-and-easy">Free & Easy (City Tour)</option>
                          <option value="departure">Departure Day</option>
                        </select>
                      </div>
                      {(day.dayType === "arrival" || day.dayType === "departure") ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Flight Number
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
                              Flight Details
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
                              Departure Time
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
                              Arrival Time
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
                              Route
                            </label>
                            <input
                              type="text"
                              value={day.route}
                              onChange={(e) =>
                                updateItineraryDay(index, "route", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Departure Time
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
                              Distance (km)
                            </label>
                            <input
                              type="number"
                              value={day.distance}
                              onChange={(e) =>
                                updateItineraryDay(index, "distance", parseInt(e.target.value))
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Route
                            </label>
                            <input
                              type="text"
                              value={day.route}
                              onChange={(e) =>
                                updateItineraryDay(index, "route", e.target.value)
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Elevation Gain (m)
                            </label>
                            <input
                              type="number"
                              value={day.elevationGain}
                              onChange={(e) =>
                                updateItineraryDay(index, "elevationGain", parseInt(e.target.value))
                              }
                              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day Description
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
                        Highlights
                      </label>
                      <div className="space-y-2">
                        {day.highlights?.map((highlight, highlightIndex) => (
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
                          Add Highlight
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
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
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Breakfast
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
                          Lunch
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
                          Dinner
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
                    {day.hotel && (
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hotel Name
                          </label>
                          <input
                            type="text"
                            value={day.hotel.name}
                            onChange={(e) =>
                              updateItineraryDayNested(index, "hotel", "name", e.target.value)
                            }
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            value={day.hotel.address}
                            onChange={(e) =>
                              updateItineraryDayNested(index, "hotel", "address", e.target.value)
                            }
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
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
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm sm:text-base text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>
                        <strong>Type:</strong>{" "}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 capitalize">
                          {(day.dayType || "ride").replace("-", " ")}
                        </span>
                      </span>
                    </div>
                    <p>
                      <strong>Date:</strong> {day.date}
                    </p>
                    {(day.dayType === "arrival" || day.dayType === "departure") && day.flight ? (
                      <>
                        <p>
                          <strong>Flight Number:</strong> {day.flight.flightNumber || "N/A"}
                        </p>
                        <p>
                          <strong>Flight Details:</strong> {day.flight.details || "N/A"}
                        </p>
                        {day.flight.departureTime && (
                          <p>
                            <strong>Departure Time:</strong> {day.flight.departureTime}
                          </p>
                        )}
                        {day.flight.arrivalTime && (
                          <p>
                            <strong>Arrival Time:</strong> {day.flight.arrivalTime}
                          </p>
                        )}
                        {day.route && (
                          <p>
                            <strong>Route:</strong> {day.route}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Departure:</strong> {day.departureTime || "N/A"}
                        </p>
                        {(day.dayType === "ride" || day.dayType === "free-and-easy" || !day.dayType) && (
                          <>
                            <p>
                              <strong>Distance:</strong> {day.distance} km
                            </p>
                            <p>
                              <strong>Route:</strong> {day.route}
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
                    Add Item
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
                    Add Item
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

