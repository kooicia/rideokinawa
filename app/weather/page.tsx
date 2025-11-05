"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";
import tourData from "@/data/tour-data.json";

interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
  };
}

interface DayWeather {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
}

const weatherCodes: { [key: number]: { icon: any; label: string } } = {
  0: { icon: Sun, label: "Clear sky" },
  1: { icon: Cloud, label: "Mainly clear" },
  2: { icon: Cloud, label: "Partly cloudy" },
  3: { icon: Cloud, label: "Overcast" },
  45: { icon: Cloud, label: "Foggy" },
  48: { icon: Cloud, label: "Depositing rime fog" },
  51: { icon: CloudRain, label: "Light drizzle" },
  53: { icon: CloudRain, label: "Moderate drizzle" },
  55: { icon: CloudRain, label: "Dense drizzle" },
  56: { icon: CloudRain, label: "Light freezing drizzle" },
  57: { icon: CloudRain, label: "Dense freezing drizzle" },
  61: { icon: CloudRain, label: "Slight rain" },
  63: { icon: CloudRain, label: "Moderate rain" },
  65: { icon: CloudRain, label: "Heavy rain" },
  71: { icon: CloudRain, label: "Slight snow" },
  73: { icon: CloudRain, label: "Moderate snow" },
  75: { icon: CloudRain, label: "Heavy snow" },
  80: { icon: CloudRain, label: "Slight rain showers" },
  81: { icon: CloudRain, label: "Moderate rain showers" },
  82: { icon: CloudRain, label: "Violent rain showers" },
  85: { icon: CloudRain, label: "Slight snow showers" },
  86: { icon: CloudRain, label: "Heavy snow showers" },
  95: { icon: CloudRain, label: "Thunderstorm" },
  96: { icon: CloudRain, label: "Thunderstorm with hail" },
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<DayWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { weather: weatherConfig, itinerary } = tourData;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const startDate = itinerary[0].date;
        const endDate = itinerary[itinerary.length - 1].date;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${weatherConfig.latitude}&longitude=${weatherConfig.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&timezone=Asia%2FTokyo&start_date=${startDate}&end_date=${endDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data: WeatherData = await response.json();
        
        const dayWeather: DayWeather[] = data.daily.time.map((date, index) => ({
          date,
          maxTemp: data.daily.temperature_2m_max[index],
          minTemp: data.daily.temperature_2m_min[index],
          weatherCode: data.daily.weathercode[index],
          precipitation: data.daily.precipitation_sum[index],
          windSpeed: data.daily.windspeed_10m_max[index],
        }));

        setWeather(dayWeather);
        setError(null);
      } catch (err) {
        setError("Failed to load weather forecast. Please try again later.");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getWeatherInfo = (code: number) => {
    return weatherCodes[code] || { icon: Cloud, label: "Unknown" };
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Weather Forecast
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Daily weather forecast for {tourData.overview.destination}
          </p>
        </div>

        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Loading weather forecast...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && weather.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {weather.map((day, index) => {
              const weatherInfo = getWeatherInfo(day.weatherCode);
              const Icon = weatherInfo.icon;
              const dayInfo = itinerary[index];

              return (
                <div
                  key={day.date}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  <div className="mb-3 sm:mb-4">
                    {dayInfo && (
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">Day {dayInfo.day}</div>
                    )}
                    <div className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2">
                      {formatDate(day.date)}
                    </div>
                    {dayInfo && (
                      <div className="text-xs sm:text-sm text-gray-600">{dayInfo.title}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                  </div>

                  <div className="text-center mb-3 sm:mb-4">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {Math.round(day.maxTemp)}°C
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {Math.round(day.minTemp)}°C
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-2">
                      {weatherInfo.label}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Precipitation</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {day.precipitation.toFixed(1)} mm
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Wind className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Wind Speed</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {Math.round(day.windSpeed)} km/h
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 sm:mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>Note:</strong> Weather forecasts are updated daily from Open-Meteo. 
            Conditions may change, so please check the forecast closer to your departure date.
          </p>
        </div>
      </div>
    </div>
  );
}

