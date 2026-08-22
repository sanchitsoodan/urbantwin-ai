import { CityProfile, HospitalFacility, TrafficCorridor, IncidentData } from '../types/city';
import { CITIES_DATABASE } from '../data/citiesData';

const CUSTOM_CITIES_STORAGE_KEY = 'urbantwin_custom_cities_v1';

// Calculate distance in kilometers between two GPS coordinates
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert 2-letter ISO Country Code to Emoji Flag
export function countryCodeToFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Detect user's current GPS position via Browser Geolocation API
export function getCurrentGPSLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(error.message || 'Failed to detect location. Please check location permissions.'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

// Reverse Geocode: Lat/Lng -> City & Country Name
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<{
  cityName: string;
  countryName: string;
  countryCode: string;
  flag: string;
}> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { 'User-Agent': 'UrbanTwinAI-SmartCityApp' } }
    );
    if (!response.ok) throw new Error('Geocoding service unavailable');
    const data = await response.json();

    const address = data.address || {};
    const cityName = address.city || address.town || address.village || address.municipality || address.state || 'Local Region';
    const countryName = address.country || 'Global';
    const countryCode = (address.country_code || 'US').toUpperCase();
    const flag = countryCodeToFlag(countryCode);

    return { cityName, countryName, countryCode, flag };
  } catch (err) {
    return {
      cityName: `Station [${lat.toFixed(2)}, ${lng.toFixed(2)}]`,
      countryName: 'Earth',
      countryCode: 'UN',
      flag: '📍'
    };
  }
}

// Forward Geocode: Search query -> Coordinates
export async function forwardGeocodeCity(query: string): Promise<{
  cityName: string;
  countryName: string;
  countryCode: string;
  lat: number;
  lng: number;
  flag: string;
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { 'User-Agent': 'UrbanTwinAI-SmartCityApp' } }
    );
    if (!response.ok) return null;
    const results = await response.json();
    if (!results || results.length === 0) return null;

    const first = results[0];
    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);
    const displayName = first.display_name || '';
    const parts = displayName.split(',').map((s: string) => s.trim());
    const cityName = parts[0] || query;
    const countryName = parts[parts.length - 1] || 'Global';

    return {
      cityName,
      countryName,
      countryCode: 'UN',
      lat,
      lng,
      flag: '🏙️'
    };
  } catch {
    return null;
  }
}

// Generate a fully populated Digital Twin profile for any custom coordinate
export function generateCustomCityProfile(
  id: string,
  name: string,
  country: string,
  flag: string,
  coordinates: [number, number],
  tagline?: string
): CityProfile {
  const [lat, lng] = coordinates;
  const offset = 0.015;

  const hospitals: HospitalFacility[] = [
    {
      id: `${id}-hosp-1`,
      name: `${name} Central Trauma & Medical Center`,
      coordinates: [lat + offset * 0.8, lng + offset * 0.6],
      emergencyCapacityPct: 68,
      availableBeds: 24,
      totalBeds: 120,
      activeAmbulances: 8,
      avgResponseTimeMin: 6.8,
      zone: 'Sector 1 / Central'
    },
    {
      id: `${id}-hosp-2`,
      name: `${name} Memorial Emergency Hospital`,
      coordinates: [lat - offset * 0.9, lng - offset * 0.7],
      emergencyCapacityPct: 54,
      availableBeds: 36,
      totalBeds: 140,
      activeAmbulances: 10,
      avgResponseTimeMin: 7.4,
      zone: 'Sector 2 / South'
    },
    {
      id: `${id}-hosp-3`,
      name: `${name} Northfield Apex Healthcare`,
      coordinates: [lat + offset * 1.1, lng - offset * 0.8],
      emergencyCapacityPct: 82,
      availableBeds: 12,
      totalBeds: 95,
      activeAmbulances: 5,
      avgResponseTimeMin: 8.5,
      zone: 'Sector 3 / North'
    }
  ];

  const corridors: TrafficCorridor[] = [
    {
      id: `CORR-${id.toUpperCase()}-01`,
      name: `${name} Grand Central Expressway`,
      coordinates: [
        [lat - offset * 1.2, lng - offset * 1.2],
        [lat - offset * 0.4, lng - offset * 0.4],
        [lat + offset * 0.4, lng + offset * 0.4],
        [lat + offset * 1.2, lng + offset * 1.2]
      ],
      currentDensityPct: 62,
      avgSpeedKmh: 42,
      congestionLevel: 'Moderate',
      zone: 'Central Arterial'
    },
    {
      id: `CORR-${id.toUpperCase()}-02`,
      name: `${name} Outer Ring Boulevard`,
      coordinates: [
        [lat + offset * 1.2, lng - offset * 1.0],
        [lat + offset * 0.2, lng],
        [lat - offset * 0.8, lng + offset * 0.9]
      ],
      currentDensityPct: 78,
      avgSpeedKmh: 28,
      congestionLevel: 'High',
      zone: 'East-West Ring'
    }
  ];

  const incidents: IncidentData[] = [
    {
      id: `${id.toUpperCase()}-101`,
      title: 'Major Multi-Vehicle Collision',
      category: 'accident',
      responseType: 'ambulance',
      severity: 'critical',
      locationName: `${name} Central Avenue & 4th Cross`,
      coordinates: [lat + offset * 0.2, lng - offset * 0.2],
      timestamp: 'Just now',
      vehiclesInvolved: 2,
      affectedRoads: 2,
      targetDestinationName: hospitals[0].name,
      standardETA: 14.8,
      optimizedETA: 7.1,
      status: 'active',
      description: 'Severe multi-vehicle collision blocking two central lanes.',
      standardRoute: [
        [lat + offset * 0.2, lng - offset * 0.2],
        [lat + offset * 0.3, lng - offset * 0.1],
        [lat + offset * 0.5, lng + offset * 0.2],
        [lat + offset * 0.8, lng + offset * 0.6]
      ],
      optimizedRoute: [
        [lat + offset * 0.2, lng - offset * 0.2],
        [lat + offset * 0.4, lng + offset * 0.1],
        [lat + offset * 0.6, lng + offset * 0.4],
        [lat + offset * 0.8, lng + offset * 0.6]
      ],
      dispatchButtonText: 'Dispatch AI Green-Wave Ambulance',
      vehicleIcon: '🚑'
    },
    {
      id: `${id.toUpperCase()}-102`,
      title: 'Main Water Feeder Pipeline Rupture',
      category: 'utility',
      responseType: 'utility_crew',
      severity: 'high',
      locationName: `${name} Municipal Water Substation 4`,
      coordinates: [lat - offset * 0.5, lng + offset * 0.4],
      timestamp: '12m ago',
      affectedRoads: 1,
      targetDestinationName: 'Municipal Utility Depot',
      standardETA: 18.5,
      optimizedETA: 9.2,
      status: 'active',
      description: 'High-pressure distribution main ruptured, causing localized street flooding.',
      standardRoute: [
        [lat - offset * 0.5, lng + offset * 0.4],
        [lat - offset * 0.2, lng + offset * 0.2],
        [lat + offset * 0.1, lng - offset * 0.1]
      ],
      optimizedRoute: [
        [lat - offset * 0.5, lng + offset * 0.4],
        [lat - offset * 0.3, lng],
        [lat + offset * 0.1, lng - offset * 0.1]
      ],
      dispatchButtonText: 'Deploy Rapid Pressure Bypass Crew',
      vehicleIcon: '🔧'
    }
  ];

  return {
    id,
    name,
    country,
    flag: flag || '🏙️',
    coordinates,
    zoom: 14,
    tagline: tagline || `Predictive AI Digital Twin & Multi-Agent Operations for ${name}`,
    baselineScore: {
      overall: 78,
      traffic: 74,
      emergency: 84,
      infrastructure: 76
    },
    baselineSpeedKmh: 36,
    baselineCongestionPct: 58,
    baselineAmbulanceEtaMin: 8.2,
    activeEventsCount: 2,
    baselineWaterMld: 380,
    baselineEnergyMwh: 1600,
    baselineWasteTons: 540,
    incidents,
    hospitals,
    corridors,
    roadClosureOptions: [
      {
        value: `${id}-road-1`,
        label: `${name} Central Expressway (Closed for Maintenance)`,
        blockedSegment: [
          [lat - offset * 0.4, lng - offset * 0.4],
          [lat + offset * 0.4, lng + offset * 0.4]
        ],
        detourRoute: [
          [lat - offset * 0.4, lng - offset * 0.4],
          [lat - offset * 0.1, lng + offset * 0.3],
          [lat + offset * 0.4, lng + offset * 0.4]
        ],
        detourRoadName: `${name} Outer Ring Detour Corridor`,
        normalTravelMin: 12,
        blockedTravelMin: 29,
        detourTravelMin: 15
      }
    ],
    rainFloodSegments: [
      [lat + offset * 0.1, lng - offset * 0.3],
      [lat + offset * 0.3, lng - offset * 0.1]
    ],
    rainDetourRoute: [
      [lat + offset * 0.1, lng - offset * 0.3],
      [lat - offset * 0.2, lng],
      [lat + offset * 0.3, lng - offset * 0.1]
    ],
    recommendation: {
      id: `REC-${id.toUpperCase()}-01`,
      issue: `Peak arterial congestion detected along ${name} Central Corridor`,
      recommendedAction: 'Synchronize smart traffic signal cycle offsets and dispatch AI green-wave clearance.',
      targetLocation: `${name} Central Crossing`,
      confidencePct: 94,
      impactMetrics: {
        travelTimeReductionPct: 32,
        congestionReductionPct: 24,
        emergencyTimeReductionPct: 48,
        resourceSavingsPct: 18
      },
      actionItems: [
        {
          id: 'act-1',
          title: 'Dynamic Traffic Light Offsetting',
          description: 'Recalibrate signal phase splits to favor continuous green platoon flow.',
          category: 'signal',
          estimatedTimeSec: 25,
          benefit: '+35% throughput',
          active: true
        },
        {
          id: 'act-2',
          title: 'Automated VMS Variable Message Detours',
          description: 'Broadcast dynamic bypass recommendations across highway message boards.',
          category: 'reroute',
          estimatedTimeSec: 45,
          benefit: '-22% bottleneck volume',
          active: true
        }
      ]
    }
  };
}

// Load custom cities from local storage
export function getSavedCustomCities(): Record<string, CityProfile> {
  try {
    const raw = localStorage.getItem(CUSTOM_CITIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save a custom city profile to local storage
export function saveCustomCityProfile(city: CityProfile): void {
  try {
    const current = getSavedCustomCities();
    current[city.id] = city;
    localStorage.setItem(CUSTOM_CITIES_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save custom city:', e);
  }
}
