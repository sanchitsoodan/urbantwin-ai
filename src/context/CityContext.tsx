import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  ViewTab, 
  LayerId, 
  LayerConfig, 
  CityScoreBreakdown, 
  IncidentData, 
  HospitalFacility, 
  TrafficCorridor, 
  AIInsight, 
  AIRecommendation, 
  SimulationParams, 
  SimulationResults,
  CityProfile,
  AIBypassRoute
} from '../types/city';
import { CITIES_DATABASE, PATIALA_PROFILE } from '../data/citiesData';
import { INITIAL_AI_INSIGHTS } from '../data/mockCityData';
import { runCitySimulation } from '../services/simulationEngine';
import { soundEngine } from '../services/audioService';
import { findNearestHospitalAndRoute, calculateUtilityDepotRoute } from '../services/emergencyTriageService';
import { detectCurrentLocationWithFallback } from '../services/locationService';
import { generateCityBypassRoutes } from '../services/bypassRouteService';

export const INITIAL_LAYERS: LayerConfig[] = [
  { id: 'traffic', label: 'Traffic Corridors', active: true, color: '#2563eb', count: 3 },
  { id: 'accidents', label: 'Incidents & Works', active: true, color: '#dc2626', count: 2 },
  { id: 'hospitals', label: 'Trauma Hospitals', active: true, color: '#059669', count: 3 }
];

export const DEFAULT_SIM_PARAMS: SimulationParams = {
  trafficIncreasePct: 0,
  populationIncreasePct: 0,
  roadClosure: 'none',
  weather: 'normal'
};

export interface ScenarioVisualDetour {
  blockedSegments: [number, number][][];
  detourRoute: [number, number][];
  detourName: string;
  isFlooded?: boolean;
  timeSavedMin?: number;
}

export type PlacementMode = 'none' | 'accident' | 'utility';

interface CityContextType {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedCity: CityProfile;
  changeCity: (cityId: string) => void;
  allCitiesList: CityProfile[];
  
  // Location Detection
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  detectUserLocation: () => Promise<{ cityName: string; matchedCity: CityProfile }>;

  layers: LayerConfig[];
  toggleLayer: (layerId: LayerId) => void;
  setLayerState: (layerId: LayerId, active: boolean) => void;
  
  // Incidents & Custom Placement
  activeIncidentsList: IncidentData[];
  placementMode: PlacementMode;
  setPlacementMode: (mode: PlacementMode) => void;
  addCustomIncidentAt: (coords: [number, number], category?: 'accident' | 'utility') => void;
  clearAllIncidents: () => void;
  resetDefaultIncidents: () => void;
  
  activeIncident: IncidentData | null;
  setActiveIncident: (inc: IncidentData | null) => void;
  activeHospital: HospitalFacility | null;
  setActiveHospital: (hosp: HospitalFacility | null) => void;
  activeCorridor: TrafficCorridor | null;
  setActiveCorridor: (corr: TrafficCorridor | null) => void;
  cityScore: CityScoreBreakdown;
  simParams: SimulationParams;
  updateSimParam: <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => void;
  resetSimParams: () => void;
  simResults: SimulationResults;
  isSimulating: boolean;
  runSimulationNow: () => void;
  optimizedRouteVisible: boolean;
  setOptimizedRouteVisible: (visible: boolean) => void;
  
  // Live Animated Emergency Dispatch
  isDispatching: boolean;
  dispatchProgress: number;
  currentAmbulanceCoords: [number, number] | null;
  currentVehicleIcon: string;
  startAnimatedDispatch: (incidentId?: string) => void;
  stopAnimatedDispatch: () => void;
  dispatchStageText: string;

  // AI Solutions & Low-Traffic Proposed Bypass Routes
  bypassRoutes: AIBypassRoute[];
  selectedBypassRoute: AIBypassRoute | null;
  setSelectedBypassRoute: (route: AIBypassRoute | null) => void;
  isAIBypassLayerActive: boolean;
  toggleAIBypassLayer: (active?: boolean) => void;
  focusOnBypassRoute: (routeId: string) => void;

  // What-If Scenario Visual Detour
  activeScenarioDetour: ScenarioVisualDetour | null;
  isScenarioDetourActive: boolean;

  // Actionable AI Solutions
  isSolutionModalOpen: boolean;
  setIsSolutionModalOpen: (open: boolean) => void;
  implementedSolutions: boolean;
  implementSolutionPlan: () => void;

  // Map Style & API Provider
  mapTileStyle: 'positron' | 'voyager' | 'satellite';
  setMapTileStyle: (style: 'positron' | 'voyager' | 'satellite') => void;

  // UrbanTwin AI Chatbot Copilot
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;

  alerts: AIInsight[];
  activeRecommendation: AIRecommendation;
  simulatedTime: string;
  soundMuted: boolean;
  toggleSound: () => void;
  mapFocusTarget: [number, number] | null;
  setMapFocusTarget: (coords: [number, number] | null) => void;
  dismissIncidentModal: () => void;
}

const CityContext = createContext<CityContextType | null>(null);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ViewTab>('command-center');
  
  // Only 6 preset global cities are in the browser list
  const allCitiesList: CityProfile[] = Object.values(CITIES_DATABASE);

  const [selectedCity, setSelectedCity] = useState<CityProfile>(CITIES_DATABASE['chandigarh']);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const [layers, setLayers] = useState<LayerConfig[]>(INITIAL_LAYERS);
  
  // Custom Incident Placement State
  const [customIncidents, setCustomIncidents] = useState<IncidentData[]>([]);
  const [incidentsCleared, setIncidentsCleared] = useState(false);
  const [placementMode, setPlacementMode] = useState<PlacementMode>('none');

  const activeIncidentsList: IncidentData[] = incidentsCleared
    ? customIncidents
    : [...selectedCity.incidents, ...customIncidents];

  const [activeIncident, setActiveIncident] = useState<IncidentData | null>(null);
  const [activeHospital, setActiveHospital] = useState<HospitalFacility | null>(null);
  const [activeCorridor, setActiveCorridor] = useState<TrafficCorridor | null>(null);
  
  const [cityScore, setCityScore] = useState<CityScoreBreakdown>(selectedCity.baselineScore);
  const [simParams, setSimParams] = useState<SimulationParams>(DEFAULT_SIM_PARAMS);
  const [simResults, setSimResults] = useState<SimulationResults>(() => runCitySimulation(DEFAULT_SIM_PARAMS, selectedCity));
  const [isSimulating, setIsSimulating] = useState(false);
  const [optimizedRouteVisible, setOptimizedRouteVisible] = useState(false);
  
  // Animated Emergency Dispatch State
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [currentAmbulanceCoords, setCurrentAmbulanceCoords] = useState<[number, number] | null>(null);
  const [currentVehicleIcon, setCurrentVehicleIcon] = useState('🚑');
  const [dispatchStageText, setDispatchStageText] = useState('Standby');
  const animationFrameRef = useRef<number | null>(null);

  // 🛣️ PROPOSED AI LOW-TRAFFIC BYPASS ROUTES
  const [bypassRoutes, setBypassRoutes] = useState<AIBypassRoute[]>(() => generateCityBypassRoutes(CITIES_DATABASE['chandigarh']));
  const [selectedBypassRoute, setSelectedBypassRoute] = useState<AIBypassRoute | null>(null);
  const [isAIBypassLayerActive, setIsAIBypassLayerActive] = useState(false);

  // Scenario Visual Detours
  const [activeScenarioDetour, setActiveScenarioDetour] = useState<ScenarioVisualDetour | null>(null);

  // AI Solutions Plan
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [implementedSolutions, setImplementedSolutions] = useState(false);

  // Map Style State
  const [mapTileStyle, setMapTileStyle] = useState<'positron' | 'voyager' | 'satellite'>('positron');

  // UrbanTwin AI Copilot Chatbot State
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const [alerts, setAlerts] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [activeRecommendation, setActiveRecommendation] = useState<AIRecommendation>(selectedCity.recommendation);
  const [mapFocusTarget, setMapFocusTarget] = useState<[number, number] | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(() => soundEngine.getMuted());

  // Clock
  const [simulatedTime, setSimulatedTime] = useState<string>('14:30:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setSimulatedTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const changeCity = useCallback((cityId: string) => {
    const target = cityId === 'patiala' ? PATIALA_PROFILE : CITIES_DATABASE[cityId];
    if (target) {
      soundEngine.playClick();
      setSelectedCity(target);
      
      const cityBypass = generateCityBypassRoutes(target);
      setBypassRoutes(cityBypass);
      setSelectedBypassRoute(null);
      setIsAIBypassLayerActive(false);

      setCityScore(target.baselineScore);
      setActiveRecommendation(target.recommendation);
      setMapFocusTarget(target.coordinates);
      setActiveIncident(null);
      setActiveHospital(null);
      setActiveCorridor(null);
      setOptimizedRouteVisible(false);
      setIsDispatching(false);
      setImplementedSolutions(false);
      setActiveScenarioDetour(null);
      setCustomIncidents([]);
      setIncidentsCleared(false);
      setPlacementMode('none');
      
      const newParams = DEFAULT_SIM_PARAMS;
      setSimParams(newParams);
      setSimResults(runCitySimulation(newParams, target));
    }
  }, []);

  // 📍 DETECT USER LOCATION (Loads Patiala Smart City Digital Twin)
  const detectUserLocation = useCallback(async () => {
    soundEngine.playClick();
    const result = await detectCurrentLocationWithFallback();
    
    // Switch to Patiala Smart City Digital Twin
    setSelectedCity(PATIALA_PROFILE);
    const patialaBypass = generateCityBypassRoutes(PATIALA_PROFILE);
    setBypassRoutes(patialaBypass);
    setSelectedBypassRoute(null);
    setIsAIBypassLayerActive(false);

    setCityScore(PATIALA_PROFILE.baselineScore);
    setActiveRecommendation(PATIALA_PROFILE.recommendation);
    setMapFocusTarget(PATIALA_PROFILE.coordinates);
    setActiveIncident(null);
    setActiveHospital(null);
    setActiveCorridor(null);
    setOptimizedRouteVisible(false);
    setIsDispatching(false);
    setImplementedSolutions(false);
    setActiveScenarioDetour(null);
    setCustomIncidents([]);
    setIncidentsCleared(false);
    setPlacementMode('none');

    const newParams = DEFAULT_SIM_PARAMS;
    setSimParams(newParams);
    setSimResults(runCitySimulation(newParams, PATIALA_PROFILE));
    soundEngine.playSuccess();

    return {
      cityName: 'Patiala, Punjab',
      matchedCity: PATIALA_PROFILE
    };
  }, []);

  const toggleAIBypassLayer = useCallback((active?: boolean) => {
    setIsAIBypassLayerActive(prev => active !== undefined ? active : !prev);
    soundEngine.playClick();
  }, []);

  const focusOnBypassRoute = useCallback((routeId: string) => {
    const matched = bypassRoutes.find(r => r.id === routeId);
    if (matched) {
      soundEngine.playClick();
      setSelectedBypassRoute(matched);
      setIsAIBypassLayerActive(true);
      if (matched.proposedBypassCoordinates.length > 0) {
        setMapFocusTarget(matched.proposedBypassCoordinates[1] || matched.proposedBypassCoordinates[0]);
      }
    }
  }, [bypassRoutes]);

  // Custom Incident Placement with DYNAMIC NEAREST HOSPITAL TRIAGE
  const addCustomIncidentAt = useCallback((coords: [number, number], category: 'accident' | 'utility' = 'accident') => {
    soundEngine.playEmergencyPing();
    
    const isAccident = category === 'accident';
    const newId = `CUST-${Date.now().toString().slice(-4)}`;

    let targetDestinationName = '';
    let standardETA = 12.0;
    let optimizedETA = 6.5;
    let standardRoute: [number, number][] = [];
    let optimizedRoute: [number, number][] = [];
    let description = '';

    if (isAccident) {
      // 🚨 DYNAMIC NEAREST HOSPITAL TRIAGE ENGINE
      const triage = findNearestHospitalAndRoute(coords, selectedCity.hospitals);
      targetDestinationName = triage.hospital.name;
      standardETA = triage.standardETA;
      optimizedETA = triage.optimizedETA;
      standardRoute = triage.standardRoute;
      optimizedRoute = triage.optimizedRoute;
      description = `Nearest matched emergency facility: ${triage.hospital.name} (${triage.distanceKm} km away, ${triage.hospital.availableBeds} ICU beds available). AI Green-Wave corridor calculated.`;
    } else {
      // 🚰 UTILITY PIPE RUPTURE & LEAK: Originates from Fixed Municipal Utility Depot -> Ends at Clicked Leak Coords!
      const depot = selectedCity.utilityDepot || {
        id: `DEPOT-${selectedCity.id.toUpperCase()}`,
        name: `${selectedCity.name} Municipal Water Works Depot`,
        coordinates: [selectedCity.coordinates[0] - 0.015, selectedCity.coordinates[1] + 0.012] as [number, number],
        activeCrews: 4,
        contactChannel: 'Ch 4 (Water Works)'
      };
      
      const utilityRoute = calculateUtilityDepotRoute(coords, depot.coordinates);
      targetDestinationName = `Water Leak Site (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`;
      standardETA = utilityRoute.standardETA;
      optimizedETA = utilityRoute.optimizedETA;
      standardRoute = utilityRoute.standardRoute;
      optimizedRoute = utilityRoute.optimizedRoute;
      description = `Water main rupture placed at (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}). Utility repair van dispatched from ${depot.name} (${utilityRoute.distanceKm} km away) to seal valve.`;
    }

    const newIncident: IncidentData = {
      id: newId,
      title: isAccident ? `Traffic Crash at (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})` : `Water Shortage Leak at (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`,
      category: isAccident ? 'accident' : 'utility',
      responseType: isAccident ? 'ambulance' : 'utility_crew',
      severity: 'high',
      locationName: `Custom Position (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`,
      coordinates: coords,
      timestamp: 'Just now',
      affectedRoads: 1,
      targetDestinationName,
      standardETA,
      optimizedETA,
      status: 'active',
      description,
      standardRoute,
      optimizedRoute,
      dispatchButtonText: isAccident ? `▶ Dispatch Ambulance to ${targetDestinationName}` : '▶ Dispatch Water Repair Van',
      vehicleIcon: isAccident ? '🚑' : '🚰',
      isCustom: true
    };

    setCustomIncidents(prev => [newIncident, ...prev]);
    setActiveIncident(newIncident);
    setMapFocusTarget(coords);
    setPlacementMode('none');
  }, [selectedCity]);

  const clearAllIncidents = useCallback(() => {
    soundEngine.playClick();
    setCustomIncidents([]);
    setIncidentsCleared(true);
    setActiveIncident(null);
    setOptimizedRouteVisible(false);
    setIsDispatching(false);
  }, []);

  const resetDefaultIncidents = useCallback(() => {
    soundEngine.playClick();
    setCustomIncidents([]);
    setIncidentsCleared(false);
    setActiveIncident(null);
  }, []);

  const setActiveTab = useCallback((tab: ViewTab) => {
    soundEngine.playClick();
    setActiveTabState(tab);
  }, []);

  const toggleLayer = useCallback((layerId: LayerId) => {
    soundEngine.playClick();
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, active: !l.active } : l));
  }, []);

  const setLayerState = useCallback((layerId: LayerId, active: boolean) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, active: !l.active } : l));
  }, []);

  const toggleSound = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setSoundMuted(muted);
    if (!muted) soundEngine.playClick();
  }, []);

  const updateSimParam = useCallback(<K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setSimParams(prev => {
      const updated = { ...prev, [key]: value };
      const res = runCitySimulation(updated, selectedCity);
      setSimResults(res);
      setCityScore(prevScore => ({
        ...prevScore,
        overall: res.cityScoreImpact.optimized,
        traffic: Math.max(30, Math.min(98, Math.round(100 - res.trafficSandbox.aiOptimized.congestionPct * 0.55))),
        emergency: Math.max(40, Math.min(99, Math.round(100 - (res.trafficSandbox.aiOptimized.emergencyEtaMin - 5) * 4)))
      }));

      // Calculate Visual Detour
      const blockedOption = selectedCity.roadClosureOptions.find(o => o.value === updated.roadClosure);
      const isRain = updated.weather === 'heavy-rain';

      if (blockedOption && blockedOption.value !== 'none') {
        setActiveScenarioDetour({
          blockedSegments: [blockedOption.blockedSegment],
          detourRoute: blockedOption.detourRoute,
          detourName: blockedOption.detourRoadName,
          timeSavedMin: blockedOption.blockedTravelMin - blockedOption.detourTravelMin
        });
        setOptimizedRouteVisible(true);
      } else if (isRain) {
        setActiveScenarioDetour({
          blockedSegments: [selectedCity.rainFloodSegments],
          detourRoute: selectedCity.rainDetourRoute,
          detourName: 'Monsoon Flood Bypass & Elevated Corridor',
          isFlooded: true,
          timeSavedMin: 12
        });
        setOptimizedRouteVisible(true);
      } else {
        setActiveScenarioDetour(null);
      }

      return updated;
    });
  }, [selectedCity]);

  const resetSimParams = useCallback(() => {
    soundEngine.playClick();
    setSimParams(DEFAULT_SIM_PARAMS);
    const res = runCitySimulation(DEFAULT_SIM_PARAMS, selectedCity);
    setSimResults(res);
    setCityScore(selectedCity.baselineScore);
    setOptimizedRouteVisible(false);
    setImplementedSolutions(false);
    setIsDispatching(false);
    setIsAIBypassLayerActive(false);
    setSelectedBypassRoute(null);
    setActiveScenarioDetour(null);
  }, [selectedCity]);

  const runSimulationNow = useCallback(() => {
    soundEngine.playSimulationRun();
    setIsSimulating(true);
    setTimeout(() => {
      const res = runCitySimulation(simParams, selectedCity);
      setSimResults(res);
      setIsSimulating(false);
      soundEngine.playSuccess();
      setIsSolutionModalOpen(true);
    }, 400);
  }, [simParams, selectedCity]);

  // LIVE ANIMATED EMERGENCY DISPATCH (For Emergency Ambulance / Repair Van only)
  const startAnimatedDispatch = useCallback((incidentId?: string) => {
    soundEngine.playEmergencyPing();
    setIsDispatching(true);
    setOptimizedRouteVisible(true);
    setDispatchProgress(0);

    const incidentList = incidentsCleared ? customIncidents : [...selectedCity.incidents, ...customIncidents];
    
    const targetIncident = incidentId 
      ? incidentList.find(i => i.id === incidentId) || activeIncident || incidentList[0]
      : activeIncident || incidentList[0];

    if (!targetIncident) {
      setIsDispatching(false);
      return;
    }

    const route = targetIncident.optimizedRoute;
    if (!route || route.length < 2) return;

    setCurrentVehicleIcon(targetIncident.vehicleIcon);
    setCurrentAmbulanceCoords(route[0]);
    setMapFocusTarget(route[0]);

    const segmentLengths: number[] = [];
    let totalPolylineDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
      const latDiff = route[i + 1][0] - route[i][0];
      const lngDiff = route[i + 1][1] - route[i][1];
      const len = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      segmentLengths.push(len);
      totalPolylineDistance += len;
    }

    const isUtility = targetIncident.category === 'utility';
    const durationMs = 6000;
    const startTime = Date.now();

    const interpolateCoords = (t: number): [number, number] => {
      if (t <= 0) return route[0];
      if (t >= 1) return route[route.length - 1];

      const targetDist = t * totalPolylineDistance;
      let accumulated = 0;

      for (let i = 0; i < segmentLengths.length; i++) {
        const nextAccumulated = accumulated + segmentLengths[i];
        if (targetDist <= nextAccumulated && segmentLengths[i] > 0) {
          const segProgress = (targetDist - accumulated) / segmentLengths[i];
          const lat = route[i][0] + (route[i + 1][0] - route[i][0]) * segProgress;
          const lng = route[i][1] + (route[i + 1][1] - route[i][1]) * segProgress;
          return [lat, lng];
        }
        accumulated = nextAccumulated;
      }

      return route[route.length - 1];
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const pct = Math.round(t * 100);
      setDispatchProgress(pct);

      const currentPos = interpolateCoords(t);
      setCurrentAmbulanceCoords(currentPos);

      if (t < 0.25) {
        setDispatchStageText(isUtility ? `🔧 Repair Van Deployed from ${selectedCity.utilityDepot?.name.split(' ')[0] || 'Municipal'} Utility Depot` : `🚨 Dispatched to ${targetIncident.targetDestinationName}`);
      } else if (t < 0.65) {
        setDispatchStageText(isUtility ? '🟡 Traversing City Road Network to Leak Site' : `🟢 Green-Wave Corridor Active • Signals Cleared`);
      } else if (t < 0.95) {
        setDispatchStageText(isUtility ? `🔧 Approaching Ruptured Pipe Junction` : `🏥 Approaching ${targetIncident.targetDestinationName}`);
      } else {
        setDispatchStageText(isUtility ? `✅ Arrived at Leak Site! High-Pressure Valve Sealed & Repaired` : `✅ Arrived at ${targetIncident.targetDestinationName}! ${targetIncident.optimizedETA} min ETA`);
      }

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        soundEngine.playSuccess();
        setTimeout(() => {
          setIsDispatching(false);
        }, 3000);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [selectedCity, customIncidents, incidentsCleared, activeIncident]);

  const stopAnimatedDispatch = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsDispatching(false);
    setDispatchProgress(0);
    setCurrentAmbulanceCoords(null);
  }, []);

  // 🧠 IMPLEMENT AI SOLUTIONS PLAN (Activates Macro Low-Traffic Bypass Routes on Map)
  const implementSolutionPlan = useCallback(() => {
    soundEngine.playSuccess();
    setImplementedSolutions(true);
    setIsAIBypassLayerActive(true);
    setIsSolutionModalOpen(false);

    // Pick first bypass route to highlight on map
    if (bypassRoutes.length > 0) {
      setSelectedBypassRoute(bypassRoutes[0]);
      if (bypassRoutes[0].proposedBypassCoordinates.length > 0) {
        setMapFocusTarget(bypassRoutes[0].proposedBypassCoordinates[1] || bypassRoutes[0].proposedBypassCoordinates[0]);
      }
    }

    setCityScore({
      overall: Math.min(96, selectedCity.baselineScore.overall + 8),
      traffic: Math.min(95, selectedCity.baselineScore.traffic + 14),
      emergency: Math.min(98, selectedCity.baselineScore.emergency + 6),
      infrastructure: Math.min(94, selectedCity.baselineScore.infrastructure + 8)
    });

    setAlerts(prev => [
      {
        id: `SOL-${Date.now()}`,
        type: 'traffic',
        severity: 'success',
        title: `AI Low-Traffic Alternate Routes Activated for ${selectedCity.name}`,
        description: 'VMS detours active. Commuter volume shifted onto low-traffic bypass corridors (-16 min avg delay).',
        timestamp: 'Just now'
      },
      ...prev
    ]);
  }, [selectedCity, bypassRoutes]);

  const dismissIncidentModal = useCallback(() => {
    setActiveIncident(null);
    setActiveHospital(null);
    setActiveCorridor(null);
  }, []);

  return (
    <CityContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCity,
        changeCity,
        allCitiesList,
        isLocationModalOpen,
        setIsLocationModalOpen,
        detectUserLocation,
        layers,
        toggleLayer,
        setLayerState,
        activeIncidentsList,
        placementMode,
        setPlacementMode,
        addCustomIncidentAt,
        clearAllIncidents,
        resetDefaultIncidents,
        activeIncident,
        setActiveIncident,
        activeHospital,
        setActiveHospital,
        activeCorridor,
        setActiveCorridor,
        cityScore,
        simParams,
        updateSimParam,
        resetSimParams,
        simResults,
        isSimulating,
        runSimulationNow,
        optimizedRouteVisible,
        setOptimizedRouteVisible,
        isDispatching,
        dispatchProgress,
        currentAmbulanceCoords,
        currentVehicleIcon,
        startAnimatedDispatch,
        stopAnimatedDispatch,
        dispatchStageText,
        bypassRoutes,
        selectedBypassRoute,
        setSelectedBypassRoute,
        isAIBypassLayerActive,
        toggleAIBypassLayer,
        focusOnBypassRoute,
        activeScenarioDetour,
        isScenarioDetourActive: !!activeScenarioDetour,
        isSolutionModalOpen,
        setIsSolutionModalOpen,
        implementedSolutions,
        implementSolutionPlan,
        mapTileStyle,
        setMapTileStyle,
        isChatbotOpen,
        setIsChatbotOpen,
        alerts,
        activeRecommendation,
        simulatedTime,
        soundMuted,
        toggleSound,
        mapFocusTarget,
        setMapFocusTarget,
        dismissIncidentModal
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
};
