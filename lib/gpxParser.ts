/**
 * Parse GPX file and extract coordinates with elevation
 * @param file - GPX file (File object or text content)
 * @returns Array of {lat, lng, elevation?} coordinates
 */
export async function parseGPXToCoordinates(file: File | string): Promise<Array<{ lat: number; lng: number; elevation?: number }>> {
  let gpxText: string;

  if (typeof file === 'string') {
    // If it's already a string, use it directly
    gpxText = file;
  } else {
    // If it's a File object, read it as text
    gpxText = await file.text();
  }

  // Parse GPX XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxText, "text/xml");

  // Check for parsing errors
  const parseError = xmlDoc.querySelector("parsererror");
  if (parseError) {
    throw new Error(`GPX parsing error: ${parseError.textContent}`);
  }

  const coordinates: Array<{ lat: number; lng: number; elevation?: number }> = [];

  // Extract track points (trkpt)
  const trkpts = xmlDoc.getElementsByTagName("trkpt");
  for (let i = 0; i < trkpts.length; i++) {
    const trkpt = trkpts[i];
    const lat = parseFloat(trkpt.getAttribute("lat") || "");
    const lng = parseFloat(trkpt.getAttribute("lon") || "");
    
    // Extract elevation from <ele> tag
    const eleTag = trkpt.getElementsByTagName("ele")[0];
    const elevation = eleTag ? parseFloat(eleTag.textContent || "") : undefined;
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const coord: { lat: number; lng: number; elevation?: number } = { lat, lng };
      if (elevation !== undefined && !isNaN(elevation)) {
        coord.elevation = elevation;
      }
      coordinates.push(coord);
    }
  }

  // If no track points, try route points (rtept)
  if (coordinates.length === 0) {
    const rtepts = xmlDoc.getElementsByTagName("rtept");
    for (let i = 0; i < rtepts.length; i++) {
      const rtept = rtepts[i];
      const lat = parseFloat(rtept.getAttribute("lat") || "");
      const lng = parseFloat(rtept.getAttribute("lon") || "");
      
      // Extract elevation from <ele> tag
      const eleTag = rtept.getElementsByTagName("ele")[0];
      const elevation = eleTag ? parseFloat(eleTag.textContent || "") : undefined;
      
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const coord: { lat: number; lng: number; elevation?: number } = { lat, lng };
        if (elevation !== undefined && !isNaN(elevation)) {
          coord.elevation = elevation;
        }
        coordinates.push(coord);
      }
    }
  }

  // If still no points, try waypoints (wpt)
  if (coordinates.length === 0) {
    const wpts = xmlDoc.getElementsByTagName("wpt");
    for (let i = 0; i < wpts.length; i++) {
      const wpt = wpts[i];
      const lat = parseFloat(wpt.getAttribute("lat") || "");
      const lng = parseFloat(wpt.getAttribute("lon") || "");
      
      // Extract elevation from <ele> tag
      const eleTag = wpt.getElementsByTagName("ele")[0];
      const elevation = eleTag ? parseFloat(eleTag.textContent || "") : undefined;
      
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const coord: { lat: number; lng: number; elevation?: number } = { lat, lng };
        if (elevation !== undefined && !isNaN(elevation)) {
          coord.elevation = elevation;
        }
        coordinates.push(coord);
      }
    }
  }

  if (coordinates.length === 0) {
    throw new Error("No valid coordinates found in GPX file");
  }

  return coordinates;
}

/**
 * Simplify coordinates by removing points that are too close together
 * @param coordinates - Array of coordinates (with optional elevation)
 * @param minDistance - Minimum distance in degrees between points (default: 0.001, ~100m)
 * @returns Simplified array of coordinates
 */
export function simplifyCoordinates(
  coordinates: Array<{ lat: number; lng: number; elevation?: number }>,
  minDistance: number = 0.001
): Array<{ lat: number; lng: number; elevation?: number }> {
  if (coordinates.length < 2) return coordinates;

  const simplified: Array<{ lat: number; lng: number; elevation?: number }> = [coordinates[0]];

  for (let i = 1; i < coordinates.length; i++) {
    const prev = simplified[simplified.length - 1];
    const curr = coordinates[i];
    
    // Calculate distance (simple Euclidean distance in degrees)
    const distance = Math.sqrt(
      Math.pow(curr.lat - prev.lat, 2) + Math.pow(curr.lng - prev.lng, 2)
    );

    if (distance >= minDistance) {
      simplified.push(curr);
    }
  }

  // Always include the last point
  if (simplified[simplified.length - 1] !== coordinates[coordinates.length - 1]) {
    simplified.push(coordinates[coordinates.length - 1]);
  }

  return simplified;
}

