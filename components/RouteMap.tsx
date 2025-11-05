"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { TrendingUp, Route as RouteIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface RouteMapProps {
  route: string;
  distance?: number;
  elevationGain?: number;
  dayType?: string;
  coordinates?: Array<{ lat: number; lng: number }>; // Direct coordinates
  gpxUrl?: string; // GPX file URL
  showMap?: boolean;
  showElevationProfileOnly?: boolean;
}

interface RoutePoint {
  lat: number;
  lng: number;
  elevation?: number;
}

export default function RouteMap({ route, distance, elevationGain, dayType, coordinates: providedCoordinates, gpxUrl, showMap = true, showElevationProfileOnly = false }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [elevationData, setElevationData] = useState<RoutePoint[]>([]);
  const [fullRouteCoordinates, setFullRouteCoordinates] = useState<RoutePoint[]>([]); // Store full route for distance calculation
  const [loading, setLoading] = useState(true);

  // Only show map for ride days (default to "ride" if undefined)
  const effectiveDayType = dayType || "ride";
  if (effectiveDayType !== "ride" && effectiveDayType !== "free-and-easy") {
    return null;
  }

  // Create a stable reference for coordinates to avoid dependency array size changes
  const coordinatesKey = useMemo(() => {
    if (!providedCoordinates || providedCoordinates.length === 0) return null;
    // Use first, last, and length to create a stable key
    const first = providedCoordinates[0];
    const last = providedCoordinates[providedCoordinates.length - 1];
    return `${providedCoordinates.length}-${first?.lat}-${first?.lng}-${last?.lat}-${last?.lng}`;
  }, [providedCoordinates]);

  useEffect(() => {
    // If only showing elevation profile, load route data without map
    if (showElevationProfileOnly) {
      const loadRouteDataOnly = async () => {
        try {
          setLoading(true);
          if (providedCoordinates && providedCoordinates.length >= 2) {
            setFullRouteCoordinates(providedCoordinates);
            await fetchElevationData(providedCoordinates);
            setMapLoaded(true);
            setLoading(false);
          } else if (gpxUrl) {
            const response = await fetch(gpxUrl);
            if (!response.ok) {
              throw new Error(`Failed to load GPX file: ${response.statusText}`);
            }
            const gpxText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(gpxText, "text/xml");
            const trackPoints: Array<{ lat: number; lng: number; elevation?: number }> = [];
            const trkpts = xmlDoc.getElementsByTagName("trkpt");
            for (let i = 0; i < trkpts.length; i++) {
              const trkpt = trkpts[i];
              const lat = parseFloat(trkpt.getAttribute("lat") || "0");
              const lng = parseFloat(trkpt.getAttribute("lon") || "0");
              const eleTag = trkpt.getElementsByTagName("ele")[0];
              const elevation = eleTag ? parseFloat(eleTag.textContent || "") : undefined;
              if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                const point: { lat: number; lng: number; elevation?: number } = { lat, lng };
                if (elevation !== undefined && !isNaN(elevation)) {
                  point.elevation = elevation;
                }
                trackPoints.push(point);
              }
            }
            if (trackPoints.length >= 2) {
              setFullRouteCoordinates(trackPoints);
              const hasGPXElevation = trackPoints.some(p => p.elevation !== undefined);
              if (hasGPXElevation) {
                setElevationData(trackPoints.map(p => ({
                  lat: p.lat,
                  lng: p.lng,
                  elevation: p.elevation || 0,
                })));
              } else {
                await fetchElevationData(trackPoints);
              }
              setMapLoaded(true);
              setLoading(false);
            }
          }
        } catch (error) {
          console.error("Error loading route data:", error);
          setLoading(false);
        }
      };
      loadRouteDataOnly();
      return;
    }

    if (!mapRef.current) return;

    // Check if map is already initialized
    if (mapInstanceRef.current) {
      // Map already exists, just update the route
      // Reset elevation data and loading state
      setElevationData([]);
      setMapLoaded(false);
      
      import("leaflet").then(async (L) => {
        // Clear existing layers (except tile layer)
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (!(layer instanceof L.TileLayer)) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        // Check what data source to use
        if (providedCoordinates && providedCoordinates.length >= 2) {
          await drawRouteFromCoordinates(mapInstanceRef.current, providedCoordinates, L);
        } else if (gpxUrl) {
          await loadGPXFile(mapInstanceRef.current, gpxUrl, L);
        } else {
          const waypoints = parseRouteString(route);
          if (waypoints.length >= 2) {
            await getRouteAndElevation(mapInstanceRef.current, waypoints, L);
          } else {
            setMapLoaded(true);
          }
        }
      });
      return;
    }

    // Dynamically import Leaflet
    const loadLeaflet = async () => {
      try {
        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const cssLink = document.createElement("link");
          cssLink.rel = "stylesheet";
          cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          cssLink.crossOrigin = "";
          document.head.appendChild(cssLink);
        }

        // Load Leaflet JS
        const L = await import("leaflet");
        
        // Fix default marker icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Check if container is already initialized (safety check)
        if (mapRef.current && (mapRef.current as any)._leaflet_id) {
          console.warn("Map container already initialized, skipping");
          return;
        }

        // Initialize map
        const map = L.map(mapRef.current!, {
          zoomControl: true,
        });

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Check if we have coordinates or GPX file
        if (providedCoordinates && providedCoordinates.length >= 2) {
          // Use provided coordinates directly
          await drawRouteFromCoordinates(map, providedCoordinates, L);
        } else if (gpxUrl) {
          // Load GPX file
          await loadGPXFile(map, gpxUrl, L);
        } else {
          // Fallback to geocoding route string
          const waypoints = parseRouteString(route);
          if (waypoints.length >= 2) {
            await getRouteAndElevation(map, waypoints, L);
          } else {
            // Just center on Okinawa if no waypoints
            map.setView([26.2124, 127.6809], 10);
            setLoading(false);
            setMapLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error loading Leaflet:", error);
        setLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          // Ignore errors during cleanup
        }
        mapInstanceRef.current = null;
      }
    };
  }, [route, gpxUrl, dayType, showElevationProfileOnly, coordinatesKey]);

  const parseRouteString = (routeString: string): string[] => {
    return routeString
      .split(/→|->|-&gt;/)
      .map((wp) => wp.trim())
      .filter((wp) => wp.length > 0);
  };

  const geocodeLocation = async (location: string, retries = 2): Promise<{ lat: number; lng: number } | null> => {
    // Add delay to respect rate limits (max 1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Use Nominatim (OpenStreetMap geocoding service) - free, no API key needed
        // Create timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ", Okinawa, Japan")}&limit=1&addressdetails=1`,
          {
            headers: {
              "User-Agent": "RideOkinawa/1.0 (https://rideokinawa.com)", // Required by Nominatim
              "Accept-Language": "en",
            },
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (attempt < retries) {
            // Wait longer before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          console.warn(`Geocoding failed for "${location}": ${response.status} ${response.statusText}`);
          return null;
        }

        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          
          // Validate coordinates are valid numbers
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return { lat, lng };
          }
        }
        
        // If we got here but no valid data, return null
        return null;
      } catch (error: any) {
        // Handle timeout or network errors
        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
          console.warn(`Geocoding timeout for "${location}"`);
        } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          console.warn(`Network error geocoding "${location}":`, error.message);
        } else {
          console.error(`Error geocoding ${location}:`, error);
        }
        
        // Retry if we have attempts left
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        return null;
      }
    }
    
    return null;
  };

  const getRouteAndElevation = async (map: any, waypoints: string[], L: any) => {
    try {
      setLoading(true);

      // Geocode all waypoints with delay between requests to respect rate limits
      const coordinates: { lat: number; lng: number }[] = [];
      for (let i = 0; i < waypoints.length; i++) {
        const waypoint = waypoints[i];
        try {
          const coord = await geocodeLocation(waypoint);
          if (coord && coord.lat && coord.lng && !isNaN(coord.lat) && !isNaN(coord.lng)) {
            coordinates.push(coord);
          } else {
            console.warn(`Failed to geocode waypoint "${waypoint}"`);
          }
        } catch (error) {
          console.error(`Error geocoding waypoint "${waypoint}":`, error);
          // Continue with other waypoints
        }
      }

      // Ensure we have valid coordinates array
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        // Fallback: center on Okinawa
        map.setView([26.2124, 127.6809], 10);
        setLoading(false);
        setMapLoaded(true);
        return;
      }

      // Use OpenRouteService for routing (free, no API key needed for basic usage)
      // Format coordinates as "lng,lat" for OpenRouteService
      // Ensure all coordinates are valid before mapping
      const validCoordinates = coordinates.filter((c) => c && typeof c.lat === 'number' && typeof c.lng === 'number' && !isNaN(c.lat) && !isNaN(c.lng));
      
      if (validCoordinates.length < 2) {
        // Not enough valid coordinates, use simple polyline
        const polyline = L.polyline(validCoordinates, {
          color: "#3b82f6",
          weight: 4,
          opacity: 0.8,
        }).addTo(map);

        // Add markers
        validCoordinates.forEach((coord, index) => {
          L.marker(coord)
            .addTo(map)
            .bindPopup(waypoints[index] || `Point ${index + 1}`);
        });

        map.fitBounds(polyline.getBounds());
        
        // Store full route coordinates for distance calculation
        setFullRouteCoordinates(validCoordinates);
        
        await fetchElevationData(validCoordinates);
        setLoading(false);
        setMapLoaded(true);
        return;
      }

      // Create a simple polyline connecting waypoints (no routing API needed)
      // This provides a direct route visualization between waypoints
      const polyline = L.polyline(validCoordinates.map(c => [c.lat, c.lng]), {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.8,
      }).addTo(map);

      // Add markers
      validCoordinates.forEach((coord, index) => {
        L.marker(coord)
          .addTo(map)
          .bindPopup(waypoints[index] || `Point ${index + 1}`);
      });

      map.fitBounds(polyline.getBounds());
      
      // Store full route coordinates for distance calculation
      setFullRouteCoordinates(validCoordinates);
      
      await fetchElevationData(validCoordinates);
      setLoading(false);
      setMapLoaded(true);
      return;

    } catch (error) {
      console.error("Error getting route:", error);
      setLoading(false);
      setMapLoaded(true);
    }
  };

  const drawRouteFromCoordinates = async (map: any, coordinates: Array<{ lat: number; lng: number }>, L: any) => {
    try {
      setLoading(true);
      
      // Validate coordinates
      const validCoordinates = coordinates.filter(
        (c) => c && typeof c.lat === 'number' && typeof c.lng === 'number' && !isNaN(c.lat) && !isNaN(c.lng)
      );

      if (validCoordinates.length < 2) {
        map.setView([26.2124, 127.6809], 10);
        setLoading(false);
        setMapLoaded(true);
        return;
      }

      // Draw route polyline
      const polyline = L.polyline(validCoordinates.map(c => [c.lat, c.lng]), {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.8,
      }).addTo(map);

      // Add start and end markers
      L.marker(validCoordinates[0])
        .addTo(map)
        .bindPopup("Start");
      
      if (validCoordinates.length > 1) {
        L.marker(validCoordinates[validCoordinates.length - 1])
          .addTo(map)
          .bindPopup("End");
      }

      // Fit map to route bounds
      map.fitBounds(polyline.getBounds());

      // Store full route coordinates for distance calculation
      setFullRouteCoordinates(validCoordinates);

      // Get elevation data
      await fetchElevationData(validCoordinates);

      setLoading(false);
      setMapLoaded(true);
    } catch (error) {
      console.error("Error drawing route from coordinates:", error);
      setLoading(false);
      setMapLoaded(true);
    }
  };

  const loadGPXFile = async (map: any, gpxUrl: string, L: any) => {
    try {
      setLoading(true);

      // Fetch GPX file
      const response = await fetch(gpxUrl);
      if (!response.ok) {
        throw new Error(`Failed to load GPX file: ${response.statusText}`);
      }

      const gpxText = await response.text();
      
      // Parse GPX XML (simple parser)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxText, "text/xml");
      
      // Extract track points from all tracks and segments (with elevation if available)
      const trackPoints: Array<{ lat: number; lng: number; elevation?: number }> = [];
      
      // Get all track points (trkpt) - this gets points from all tracks and segments
      const trkpts = xmlDoc.getElementsByTagName("trkpt");
      
      for (let i = 0; i < trkpts.length; i++) {
        const trkpt = trkpts[i];
        const lat = parseFloat(trkpt.getAttribute("lat") || "0");
        const lng = parseFloat(trkpt.getAttribute("lon") || "0");
        
        // Extract elevation from <ele> tag
        const eleTag = trkpt.getElementsByTagName("ele")[0];
        const elevation = eleTag ? parseFloat(eleTag.textContent || "") : undefined;
        
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          const point: { lat: number; lng: number; elevation?: number } = { lat, lng };
          if (elevation !== undefined && !isNaN(elevation)) {
            point.elevation = elevation;
          }
          trackPoints.push(point);
        }
      }

      const pointsWithElevation = trackPoints.filter(p => p.elevation !== undefined).length;
      console.log(`GPX file loaded: ${trackPoints.length} track points extracted, ${pointsWithElevation} with elevation data`);

      if (trackPoints.length < 2) {
        throw new Error("GPX file doesn't contain enough track points");
      }

      // Draw route
      const polyline = L.polyline(trackPoints.map(p => [p.lat, p.lng]), {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.8,
      }).addTo(map);

      // Add markers
      L.marker(trackPoints[0])
        .addTo(map)
        .bindPopup("Start");
      
      L.marker(trackPoints[trackPoints.length - 1])
        .addTo(map)
        .bindPopup("End");

      // Fit map to route
      map.fitBounds(polyline.getBounds());

      // Store full route coordinates for distance calculation
      setFullRouteCoordinates(trackPoints);
      
      // Check if GPX file has elevation data
      const hasGPXElevation = trackPoints.some(p => p.elevation !== undefined);
      
      if (hasGPXElevation) {
        // Use elevation from GPX file
        console.log("Using elevation data from GPX file");
        setElevationData(trackPoints.map(p => ({
          lat: p.lat,
          lng: p.lng,
          elevation: p.elevation || 0,
        })));
      } else {
        // Fall back to fetching elevation from API
        console.log("No elevation in GPX file, fetching from API");
        await fetchElevationData(trackPoints);
      }

      setLoading(false);
      setMapLoaded(true);
    } catch (error) {
      console.error("Error loading GPX file:", error);
      setLoading(false);
      setMapLoaded(true);
    }
  };

  const fetchElevationData = async (coordinates: { lat: number; lng: number }[], retries = 2) => {
    try {
      // Validate coordinates
      if (!coordinates || coordinates.length === 0) {
        console.warn("No coordinates provided for elevation data");
        setElevationData([]);
        return;
      }

      // Filter out invalid coordinates
      const validCoords = coordinates.filter(
        (c) => c && typeof c.lat === 'number' && typeof c.lng === 'number' && !isNaN(c.lat) && !isNaN(c.lng)
      );

      if (validCoords.length === 0) {
        console.warn("No valid coordinates found for elevation data");
        setElevationData([]);
        return;
      }

      console.log(`Fetching elevation for ${validCoords.length} coordinates`);

      // Use Open-Elevation API (free, no API key needed)
      // Sample points if too many (limit to ~100 points)
      const sampleSize = Math.min(100, validCoords.length);
      const step = Math.max(1, Math.floor(validCoords.length / sampleSize));
      const sampledCoords: Array<{ lat: number; lng: number }> = [];
      
      // Sample coordinates evenly
      for (let i = 0; i < validCoords.length; i += step) {
        sampledCoords.push(validCoords[i]);
        if (sampledCoords.length >= sampleSize - 1) break; // Reserve space for last point
      }
      
      // Always include the first and last coordinates
      if (sampledCoords.length === 0 || sampledCoords[0] !== validCoords[0]) {
        sampledCoords.unshift(validCoords[0]);
      }
      if (sampledCoords[sampledCoords.length - 1] !== validCoords[validCoords.length - 1]) {
        sampledCoords.push(validCoords[validCoords.length - 1]);
      }
      
      console.log(`Sampled to ${sampledCoords.length} points for elevation (from ${validCoords.length} total)`);

      if (sampledCoords.length === 0) {
        console.warn("No sampled coordinates for elevation data");
        setElevationData([]);
        return;
      }

      // Open-Elevation API expects locations in format: {latitude, longitude}
      const locations = sampledCoords.map((coord) => ({
        latitude: coord.lat,
        longitude: coord.lng,
      }));

      // Try fetching with retries
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          if (attempt > 0) {
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }

          // Create timeout controller
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch("https://api.open-elevation.com/api/v1/lookup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ locations }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data.results && Array.isArray(data.results) && data.results.length > 0) {
              const elevationPoints = data.results.map((result: any, index: number) => ({
                lat: sampledCoords[index].lat,
                lng: sampledCoords[index].lng,
                elevation: result.elevation || 0,
              }));
              console.log(`✓ Successfully fetched elevation data: ${elevationPoints.length} points`);
              setElevationData(elevationPoints);
              return; // Success, exit retry loop
            } else {
              console.warn("No elevation results in API response");
            }
          } else {
            console.error(`Elevation API error: ${response.status} ${response.statusText}`);
          }
        } catch (fetchError: any) {
          if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
            console.warn(`Elevation API timeout (attempt ${attempt + 1}/${retries + 1})`);
          } else if (fetchError.message?.includes('Failed to fetch') || fetchError.message?.includes('NetworkError')) {
            console.warn(`Elevation API network error (attempt ${attempt + 1}/${retries + 1}):`, fetchError.message);
          } else {
            console.error(`Elevation API error (attempt ${attempt + 1}/${retries + 1}):`, fetchError);
          }
          
          // If this was the last attempt, give up
          if (attempt === retries) {
            setElevationData([]);
            return;
          }
          // Otherwise, continue to retry
        }
      }
      
      // If we get here, all retries failed
      console.error("Failed to fetch elevation data after all retries");
      setElevationData([]);
    } catch (error) {
      console.error("Error fetching elevation data:", error);
      setElevationData([]);
    }
  };

  // Helper function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const drawElevationProfile = () => {
    if (elevationData.length === 0) return null;

    // Use full route coordinates if available for accurate distance calculation
    const routeForDistance = fullRouteCoordinates.length > 0 ? fullRouteCoordinates : elevationData;
    
    console.log(`Elevation profile calculation: ${elevationData.length} elevation points, ${routeForDistance.length} route points`);
    
    // Calculate cumulative distance along the full route
    let cumulativeDistance = 0;
    const fullRouteDistances: number[] = [0];
    for (let i = 1; i < routeForDistance.length; i++) {
      const prevPoint = routeForDistance[i - 1];
      const currPoint = routeForDistance[i];
      cumulativeDistance += calculateDistance(
        prevPoint.lat,
        prevPoint.lng,
        currPoint.lat,
        currPoint.lng
      );
      fullRouteDistances.push(cumulativeDistance);
    }
    
    const totalRouteDistance = fullRouteDistances[fullRouteDistances.length - 1];
    console.log(`Total route distance calculated: ${totalRouteDistance.toFixed(2)}km`);
    
    // Map elevation points to their positions along the full route
    let lastMatchedIndex = 0;
    const chartData = elevationData.map((elevPoint) => {
      // Find the closest point in the full route
      // Start search from the last matched index for efficiency (points are usually sequential)
      let minDistance = Infinity;
      let closestIndex = lastMatchedIndex;
      
      // Search forward from last match (most common case)
      for (let i = lastMatchedIndex; i < routeForDistance.length; i++) {
        const routePoint = routeForDistance[i];
        const dist = calculateDistance(
          elevPoint.lat,
          elevPoint.lng,
          routePoint.lat,
          routePoint.lng
        );
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = i;
        } else if (dist > minDistance * 2) {
          // If distance is increasing significantly, we've passed the closest point
          break;
        }
      }
      
      // Also check backward if we're at the start
      if (lastMatchedIndex > 0) {
        for (let i = lastMatchedIndex - 1; i >= 0; i--) {
          const routePoint = routeForDistance[i];
          const dist = calculateDistance(
            elevPoint.lat,
            elevPoint.lng,
            routePoint.lat,
            routePoint.lng
          );
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = i;
          } else {
            break;
          }
        }
      }
      
      // Update last matched index for next iteration
      lastMatchedIndex = closestIndex;
      
      // Use the distance from the full route at this position
      const distanceAlongRoute = fullRouteDistances[closestIndex];
      
      return {
        distance: Number(distanceAlongRoute.toFixed(1)),
        elevation: Math.round(elevPoint.elevation || 0),
      };
    });
    
    // Sort by distance to ensure correct order (in case matching wasn't perfect)
    chartData.sort((a, b) => a.distance - b.distance);
    
    const finalMaxDistance = chartData.length > 0 ? chartData[chartData.length - 1]?.distance || 0 : 0;
    console.log(`Chart data: ${chartData.length} points, distance range: 0 - ${finalMaxDistance.toFixed(2)}km (route total: ${totalRouteDistance.toFixed(2)}km)`);

    const elevations = elevationData.map((point) => point.elevation || 0);
    const maxElevation = Math.max(...elevations);
    const minElevation = Math.min(...elevations);
    const maxDistance = chartData.length > 0 ? chartData[chartData.length - 1]?.distance || 0 : 0;
    
    console.log(`Elevation profile: ${chartData.length} points, max distance: ${maxDistance}km`);

    // Calculate X-axis interval (use even numbers: 2, 4, 5, 10, 20, 50, 100)
    const getRoundInterval = (max: number): number => {
      if (max <= 10) return 2;
      if (max <= 20) return 4;
      if (max <= 50) return 5;
      if (max <= 100) return 10;
      if (max <= 200) return 20;
      if (max <= 500) return 50;
      return 100;
    };
    const xAxisInterval = getRoundInterval(maxDistance);
    const xAxisTicks: number[] = [];
    // Generate ticks up to maxDistance (not rounded up)
    for (let i = 0; i <= maxDistance; i += xAxisInterval) {
      xAxisTicks.push(i);
    }
    // Always include the last point (maxDistance) if it's not already in the ticks
    if (xAxisTicks.length === 0 || xAxisTicks[xAxisTicks.length - 1] < maxDistance) {
      xAxisTicks.push(maxDistance);
    }

    // Calculate Y-axis interval (use 10 or 20 based on range)
    const elevationRange = maxElevation - minElevation;
    const yAxisInterval = elevationRange <= 100 ? 10 : 20;
    const yAxisMin = Math.floor(minElevation / yAxisInterval) * yAxisInterval;
    const yAxisMax = Math.ceil(maxElevation / yAxisInterval) * yAxisInterval;
    const yAxisTicks: number[] = [];
    for (let i = yAxisMin; i <= yAxisMax; i += yAxisInterval) {
      yAxisTicks.push(i);
    }

    return (
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        {!showElevationProfileOnly && (
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Elevation Profile</span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 20, bottom: 20 }}>
            <Line
              type="monotone"
              dataKey="elevation"
              stroke="#3b82f6"
              strokeWidth={1}
              dot={false}
              activeDot={{ r: 3 }}
            />
            <XAxis
              dataKey="distance"
              domain={[0, maxDistance]}
              type="number"
              ticks={xAxisTicks}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}km`}
              allowDecimals={false}
              allowDataOverflow={false}
              label={{ value: 'Distance', position: 'insideBottom', offset: -5, style: { fontSize: '10px', fill: '#6b7280' } }}
            />
            <YAxis
              domain={[yAxisMin, yAxisMax]}
              type="number"
              ticks={yAxisTicks}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}m`}
              allowDecimals={false}
              width={50}
              label={{ value: 'Elevation', angle: -90, position: 'left', offset: -5, style: { fontSize: '10px', fill: '#6b7280', textAnchor: 'middle' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                padding: '4px 8px',
              }}
              formatter={(value: any) => [`${value}m`, 'Elevation']}
              labelFormatter={(label: any) => `Distance: ${label}km`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // If only showing elevation profile, return just the profile
  if (showElevationProfileOnly) {
    return (
      <div suppressHydrationWarning>
        {mapLoaded && elevationData.length > 0 && drawElevationProfile()}
      </div>
    );
  }

  // If not showing map, return nothing (or just elevation profile if available)
  if (!showMap) {
    return (
      <div suppressHydrationWarning>
        {mapLoaded && elevationData.length > 0 && drawElevationProfile()}
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-6" suppressHydrationWarning>
      <div className="flex items-center gap-2 mb-3" suppressHydrationWarning>
        <RouteIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        <h3 className="font-semibold text-sm sm:text-base text-gray-900">Route Map</h3>
      </div>
      
      <div className="rounded-lg overflow-hidden border border-gray-200 relative" suppressHydrationWarning>
        {loading && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10" suppressHydrationWarning>
            <div className="text-sm text-gray-600" suppressHydrationWarning>Loading map...</div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-64 sm:h-80" suppressHydrationWarning />
      </div>

      <div className="mt-4 sm:mt-6" suppressHydrationWarning>
        {mapLoaded && elevationData.length > 0 && drawElevationProfile()}
      </div>
    </div>
  );
}
