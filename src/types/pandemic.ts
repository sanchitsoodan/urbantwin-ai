export type SectorId = 
  | 'healthcare' 
  | 'economy' 
  | 'transportation' 
  | 'workforce' 
  | 'supply_chain' 
  | 'society' 
  | 'environment';

export type ImpactStatusLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface SectorImpact {
  id: SectorId;
  name: string;
  score: number; // 0 - 100
  status: ImpactStatusLevel;
  explanation: string;
  baselineScore: number;
  peakScore: number;
}

export interface PandemicWhatIfParams {
  gatheringRestrictions: number; // 0 (Low) to 100 (Maximum)
  remoteWorkAdoptionPct: number; // 0% to 100%
  travelRestrictions: number;    // 0 (Low) to 100 (High)
  healthcareCapacity: number;    // 0 (Normal) to 100 (Expanded)
  publicCompliance: number;      // 0 (Low) to 100 (High)
}

export interface SectorComparisonItem {
  sectorId: SectorId;
  name: string;
  previous: number;
  scenario: number;
  delta: number;
}

export interface WhatIfSimulationResult {
  beforeAvg: number;
  afterAvg: number;
  delta: number;
  sectors: SectorComparisonItem[];
}

export interface PandemicTimelinePoint {
  day: number;
  phase: 'Pandemic Period' | 'Peak Crisis' | 'Recovery Stage';
  averageImpact: number;
  healthcare: number;
  economy: number;
  transportation: number;
  workforce: number;
  supply_chain: number;
  society: number;
  environment: number;
}

export type PandemicFacilityType = 'hospital' | 'dispensary' | 'testing_booth' | 'oxygen_depot' | 'containment_zone';

export interface PandemicFacility {
  id: string;
  name: string;
  type: PandemicFacilityType;
  coordinates: [number, number];
  address: string;
  isOpen: boolean;
  statusText: string;
  contactNumber?: string;
  
  // Specific metrics
  availableBeds?: number;
  totalBeds?: number;
  icuBeds?: number;
  dailyTestingCapacity?: number;
  currentWaitTimeMin?: number;
  oxygenStockCylinders?: number;
  quarantineRadiusMeters?: number;
}

export interface PandemicAffectedZone {
  id: string;
  name: string;
  severity: 'red' | 'amber';
  coordinates: [number, number];
  radiusMeters: number;
  positivityRatePct: number;
  activeCases: number;
  statusText: string;
  restrictionsDescription: string;
}

export interface PandemicRoadRestriction {
  id: string;
  name: string;
  coordinates: [number, number][];
  severity: 'closed' | 'screened_entry';
  statusText: string;
  reason: string;
}

export interface EnterpriseQuoteRequest {
  id: string;
  name: string;
  organisation: string;
  workEmail: string;
  organisationType: 'Enterprise' | 'Government' | 'Municipality' | 'Other';
  requirement: string;
  optionalMessage?: string;
  timestamp: string;
}
