export type ViewTab = 
  | 'command-center'
  | 'simulator'
  | 'emergency-response'
  | 'architecture';

export type LayerId = 
  | 'traffic'
  | 'accidents'
  | 'hospitals'
  | 'detours';

export interface LayerConfig {
  id: LayerId;
  label: string;
  active: boolean;
  color: string;
  count: number;
}

export interface CityScoreBreakdown {
  overall: number;
  traffic: number;
  emergency: number;
  infrastructure: number;
}

export type IncidentCategory = 'accident' | 'utility' | 'weather' | 'transit';
export type IncidentResponseType = 'ambulance' | 'utility_crew' | 'transit_feeder' | 'traffic_diverter';

export interface IncidentData {
  id: string;
  title: string;
  category: IncidentCategory;
  responseType: IncidentResponseType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  locationName: string;
  coordinates: [number, number];
  timestamp: string;
  vehiclesInvolved?: number;
  affectedRoads: number;
  targetDestinationName: string;
  standardETA: number;
  optimizedETA: number;
  status: 'active' | 'optimizing' | 'optimized' | 'resolved';
  description: string;
  standardRoute: [number, number][];
  optimizedRoute: [number, number][];
  dispatchButtonText: string;
  vehicleIcon: string;
  isCustom?: boolean;
}

export interface HospitalFacility {
  id: string;
  name: string;
  coordinates: [number, number];
  emergencyCapacityPct: number;
  availableBeds: number;
  totalBeds: number;
  activeAmbulances: number;
  avgResponseTimeMin: number;
  zone: string;
}

export interface TrafficCorridor {
  id: string;
  name: string;
  coordinates: [number, number][];
  currentDensityPct: number;
  avgSpeedKmh: number;
  congestionLevel: 'Low' | 'Moderate' | 'High';
  zone: string;
}

export interface AIInsight {
  id: string;
  type: 'traffic' | 'emergency' | 'civic';
  severity: 'info' | 'warning' | 'urgent' | 'success';
  title: string;
  description: string;
  metricLabel?: string;
  metricValue?: string;
  zone?: string;
  timestamp: string;
}

export interface AIActionItem {
  id: string;
  title: string;
  description: string;
  category: 'signal' | 'transit' | 'reroute' | 'lane' | 'water' | 'energy' | 'waste';
  estimatedTimeSec: number;
  benefit: string;
  active: boolean;
}

export interface AIBypassRoute {
  id: string;
  name: string;
  congestedRoadName: string;
  congestedCoordinates: [number, number][];
  congestedSpeedKmh: number;
  congestedDensityPct: number;
  congestedTravelTimeMin: number;
  
  proposedBypassCoordinates: [number, number][];
  proposedSpeedKmh: number;
  proposedDensityPct: number;
  proposedTravelTimeMin: number;
  timeSavedMin: number;
  fuelSavedPct: number;
  co2SavedKg: number;
  active: boolean;
  strategyDescription: string;
}

export interface AIRecommendation {
  id: string;
  issue: string;
  recommendedAction: string;
  targetLocation: string;
  confidencePct: number;
  impactMetrics: {
    travelTimeReductionPct: number;
    congestionReductionPct: number;
    emergencyTimeReductionPct: number;
    resourceSavingsPct?: number;
  };
  actionItems: AIActionItem[];
  proposedBypassRoutes?: AIBypassRoute[];
}

export interface RoadClosureOption {
  value: string;
  label: string;
  blockedSegment: [number, number][];
  detourRoute: [number, number][];
  detourRoadName: string;
  normalTravelMin: number;
  blockedTravelMin: number;
  detourTravelMin: number;
}

export interface SimulationParams {
  trafficIncreasePct: number;
  populationIncreasePct: number; // Standalone slider 2
  roadClosure: string;
  weather: 'normal' | 'heavy-rain' | 'bus-strike';
}

// 5-Sector Urban Resource Impact State (For Population Surge Sandbox)
export interface ResourceSectorMetrics {
  economyLossKUsd: number;      // Daily loss in $k/day
  trafficLoadPct: number;       // Congestion %
  waterDemandMld: number;       // Million Liters per Day
  energyLoadMwh: number;        // Megawatt Hours per Day
  wasteGeneratedTons: number;   // Tons per Day
}

export interface SimulationResults {
  // 1. Traffic Sandbox Results
  trafficSandbox: {
    before: { travelTimeMin: number; congestionPct: number; emergencyEtaMin: number };
    after: { travelTimeMin: number; congestionPct: number; emergencyEtaMin: number };
    aiOptimized: { travelTimeMin: number; congestionPct: number; emergencyEtaMin: number };
  };

  // 2. Population & Multi-Resource Sandbox Results
  populationSandbox: {
    baseline: ResourceSectorMetrics;
    surged: ResourceSectorMetrics;
    aiOptimized: ResourceSectorMetrics;
  };

  // Legacy format for backward compatibility
  before: {
    travelTimeMin: number;
    congestionPct: number;
    emergencyEtaMin: number;
    economicLossKUsd: number;
    fuelWastedLiters: number;
  };
  after: {
    travelTimeMin: number;
    congestionPct: number;
    emergencyEtaMin: number;
    economicLossKUsd: number;
    fuelWastedLiters: number;
  };
  aiOptimized: {
    travelTimeMin: number;
    congestionPct: number;
    emergencyEtaMin: number;
    economicLossKUsd: number;
    fuelWastedLiters: number;
  };

  cityScoreImpact: {
    before: number;
    after: number;
    optimized: number;
  };
  economicSavingsUsd: number;
  dailyCo2SavedKg: number;
  tailoredSolutions: AIActionItem[];
}

export interface UtilityDepot {
  id: string;
  name: string;
  coordinates: [number, number];
  activeCrews: number;
  contactChannel: string;
}

export interface CityProfile {
  id: string;
  name: string;
  country: string;
  flag: string;
  coordinates: [number, number];
  zoom: number;
  tagline: string;
  
  baselineScore: CityScoreBreakdown;
  baselineSpeedKmh: number;
  baselineCongestionPct: number;
  baselineAmbulanceEtaMin: number;
  activeEventsCount: number;

  // City Resource Baselines
  baselineWaterMld: number;     // e.g. 450 MLD
  baselineEnergyMwh: number;    // e.g. 1800 MWh
  baselineWasteTons: number;    // e.g. 620 Tons

  incidents: IncidentData[];
  hospitals: HospitalFacility[];
  utilityDepot?: UtilityDepot;
  corridors: TrafficCorridor[];
  roadClosureOptions: RoadClosureOption[];
  rainFloodSegments: [number, number][];
  rainDetourRoute: [number, number][];
  recommendation: AIRecommendation;
}
