import { 
  IncidentData, 
  HospitalFacility, 
  TrafficCorridor, 
  AIInsight, 
  AIRecommendation,
  CityScoreBreakdown
} from '../types/city';

export const INITIAL_CITY_SCORE: CityScoreBreakdown = {
  overall: 87,
  traffic: 82,
  emergency: 91,
  infrastructure: 84
};

export const CHANDIGARH_CENTER: [number, number] = [30.7333, 76.7794];

export const MOCK_INCIDENTS: IncidentData[] = [
  {
    id: 'CHD-1042',
    title: '3-Car Crash on Jan Marg',
    category: 'accident',
    responseType: 'ambulance',
    severity: 'high',
    locationName: 'Sector 17 & Jan Marg Junction',
    coordinates: [30.7410, 76.7820],
    timestamp: '2 min ago',
    vehiclesInvolved: 3,
    affectedRoads: 2,
    targetDestinationName: 'GMSH Hospital Sector 16',
    standardETA: 11.4,
    optimizedETA: 7.2,
    status: 'active',
    description: '3-car collision blocking 2 eastbound lanes. Normal route has 4.8 min signal delay.',
    dispatchButtonText: '▶ Dispatch Ambulance to Hospital',
    vehicleIcon: '🚑',
    standardRoute: [
      [30.7410, 76.7820],
      [30.7460, 76.7880],
      [30.7550, 76.7900],
      [30.7510, 76.7860]
    ],
    optimizedRoute: [
      [30.7410, 76.7820],
      [30.7380, 76.7760],
      [30.7440, 76.7710],
      [30.7510, 76.7860]
    ]
  },
  {
    id: 'CHD-1088',
    title: 'Water Pipe Burst & Repair',
    category: 'utility',
    responseType: 'utility_crew',
    severity: 'medium',
    locationName: 'Sector 34 Commercial Zone',
    coordinates: [30.7225, 76.7680],
    timestamp: '14 min ago',
    affectedRoads: 1,
    targetDestinationName: 'Sector 34 Water Valve Site',
    standardETA: 8.5,
    optimizedETA: 5.8,
    status: 'active',
    description: 'Utility maintenance repair team dispatched to valve substation.',
    dispatchButtonText: '▶ Dispatch Utility Repair Van',
    vehicleIcon: '🔧',
    standardRoute: [
      [30.7410, 76.7820],
      [30.7300, 76.7750],
      [30.7225, 76.7680]
    ],
    optimizedRoute: [
      [30.7410, 76.7820],
      [30.7350, 76.7650],
      [30.7225, 76.7680]
    ]
  }
];

export const MOCK_HOSPITALS: HospitalFacility[] = [
  {
    id: 'HOSP-01',
    name: 'PGIMER Trauma Center',
    coordinates: [30.7650, 76.7760],
    emergencyCapacityPct: 88,
    availableBeds: 42,
    totalBeds: 1800,
    activeAmbulances: 14,
    avgResponseTimeMin: 6.2,
    zone: 'North Sector'
  },
  {
    id: 'HOSP-02',
    name: 'GMSH Hospital Sector 16',
    coordinates: [30.7510, 76.7860],
    emergencyCapacityPct: 72,
    availableBeds: 28,
    totalBeds: 500,
    activeAmbulances: 8,
    avgResponseTimeMin: 6.8,
    zone: 'Central Sector'
  },
  {
    id: 'HOSP-03',
    name: 'GMCH Hospital Sector 32',
    coordinates: [30.7090, 76.7710],
    emergencyCapacityPct: 65,
    availableBeds: 54,
    totalBeds: 800,
    activeAmbulances: 10,
    avgResponseTimeMin: 7.1,
    zone: 'South Sector'
  }
];

export const MOCK_TRAFFIC_CORRIDORS: TrafficCorridor[] = [
  {
    id: 'CORR-01',
    name: 'Madhya Marg (PGI to Transport Chowk)',
    coordinates: [
      [30.7680, 76.7720],
      [30.7580, 76.7850],
      [30.7480, 76.8000],
      [30.7320, 76.8220]
    ],
    currentDensityPct: 84,
    avgSpeedKmh: 24,
    congestionLevel: 'High',
    zone: 'North Axis'
  },
  {
    id: 'CORR-02',
    name: 'Jan Marg (Secretariat to Sector 17)',
    coordinates: [
      [30.7600, 76.8020],
      [30.7460, 76.7910],
      [30.7340, 76.7780],
      [30.7210, 76.7660]
    ],
    currentDensityPct: 76,
    avgSpeedKmh: 26,
    congestionLevel: 'High',
    zone: 'Central Axis'
  },
  {
    id: 'CORR-03',
    name: 'Dakshin Marg (Ring Road)',
    coordinates: [
      [30.7050, 76.7980],
      [30.7190, 76.7750],
      [30.7320, 76.7550],
      [30.7450, 76.7350]
    ],
    currentDensityPct: 52,
    avgSpeedKmh: 42,
    congestionLevel: 'Low',
    zone: 'South Axis'
  }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'INS-01',
    type: 'emergency',
    severity: 'urgent',
    title: 'Crash on Jan Marg Blocking Ambulance Route',
    description: 'Ambulance heading to Sector 16 hospital faces 11.4 min ETA. Green-wave reroute via Udyan Path saves 4.2 min.',
    metricLabel: 'Time Saved',
    metricValue: '4.2 min',
    zone: 'Sector 17',
    timestamp: '2 min ago'
  },
  {
    id: 'INS-02',
    type: 'traffic',
    severity: 'warning',
    title: 'Madhya Marg Congestion Rising',
    description: 'Evening rush hour traffic increasing congestion by +23%. Recommend syncing smart signals.',
    metricLabel: 'Average Speed',
    metricValue: '24 km/h',
    zone: 'Madhya Marg',
    timestamp: '8 min ago'
  }
];

export const INITIAL_RECOMMENDATION: AIRecommendation = {
  id: 'REC-01',
  issue: 'Heavy traffic on Jan Marg causing 4.8 min emergency delay.',
  recommendedAction: 'Divert arterial traffic through Udyan Path & switch 4 lights to Green.',
  targetLocation: 'Sector 17 Corridor',
  confidencePct: 94,
  impactMetrics: {
    travelTimeReductionPct: 23,
    congestionReductionPct: 31,
    emergencyTimeReductionPct: 37
  },
  actionItems: [
    {
      id: 'ACT-1',
      title: 'Activate Green-Wave on Udyan Path',
      description: 'Synchronize 4 traffic controllers to grant permanent green signal for approaching ambulance.',
      category: 'signal',
      estimatedTimeSec: 8,
      benefit: 'Saves 3.2 minutes',
      active: true
    },
    {
      id: 'ACT-2',
      title: 'Divert Private Vehicles to Himalaya Marg',
      description: 'Update dynamic electronic message signs (VMS) to route commuter cars away from Sector 17.',
      category: 'reroute',
      estimatedTimeSec: 15,
      benefit: 'Reduces Jan Marg load by 28%',
      active: true
    }
  ]
};
