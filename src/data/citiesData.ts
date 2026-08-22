import { CityProfile } from '../types/city';

export const CITIES_DATABASE: Record<string, CityProfile> = {
  chandigarh: {
    id: 'chandigarh',
    name: 'Chandigarh',
    country: 'India',
    flag: '🇮🇳',
    coordinates: [30.7333, 76.7794],
    zoom: 13,
    tagline: 'Planned City of Corridors & Grid Sectors',
    
    baselineScore: { overall: 87, traffic: 82, emergency: 91, infrastructure: 84 },
    baselineSpeedKmh: 38,
    baselineCongestionPct: 42,
    baselineAmbulanceEtaMin: 7.4,
    activeEventsCount: 2,

    baselineWaterMld: 380,
    baselineEnergyMwh: 1200,
    baselineWasteTons: 450,

    hospitals: [
      {
        id: 'HOSP-CHD-01',
        name: 'PGIMER Trauma Center',
        coordinates: [30.7665, 76.7735],
        emergencyCapacityPct: 88,
        availableBeds: 42,
        totalBeds: 1800,
        activeAmbulances: 14,
        avgResponseTimeMin: 6.2,
        zone: 'North Sector 12'
      },
      {
        id: 'HOSP-CHD-02',
        name: 'GMSH Hospital Sector 16',
        coordinates: [30.7525, 76.7865],
        emergencyCapacityPct: 72,
        availableBeds: 28,
        totalBeds: 500,
        activeAmbulances: 8,
        avgResponseTimeMin: 6.8,
        zone: 'Central Sector 16'
      },
      {
        id: 'HOSP-CHD-03',
        name: 'GMCH Hospital Sector 32',
        coordinates: [30.7115, 76.7725],
        emergencyCapacityPct: 65,
        availableBeds: 54,
        totalBeds: 800,
        activeAmbulances: 10,
        avgResponseTimeMin: 7.1,
        zone: 'South Sector 32'
      }
    ],

    incidents: [
      {
        id: 'CHD-1042',
        title: '3-Car Crash on Jan Marg',
        category: 'accident',
        responseType: 'ambulance',
        severity: 'high',
        locationName: 'Sector 17 & Jan Marg Junction',
        coordinates: [30.7415, 76.7825],
        timestamp: '2 min ago',
        vehiclesInvolved: 3,
        affectedRoads: 2,
        targetDestinationName: 'GMSH Hospital Sector 16',
        standardETA: 11.4,
        optimizedETA: 7.2,
        status: 'active',
        description: '3-car collision on Jan Marg. Routed to nearest hospital: GMSH Hospital Sector 16 (1.4 km away).',
        dispatchButtonText: '▶ Dispatch Ambulance to GMSH-16',
        vehicleIcon: '🚑',
        standardRoute: [
          [30.7415, 76.7825],
          [30.7450, 76.7870],
          [30.7490, 76.7915],
          [30.7512, 76.7942],
          [30.7518, 76.7905],
          [30.7525, 76.7865]
        ],
        optimizedRoute: [
          [30.7415, 76.7825],
          [30.7435, 76.7770],
          [30.7470, 76.7775],
          [30.7505, 76.7815],
          [30.7525, 76.7865]
        ]
      },
      {
        id: 'CHD-1088',
        title: 'Main Water Pipe Burst & Shortage',
        category: 'utility',
        responseType: 'utility_crew',
        severity: 'medium',
        locationName: 'Sector 34 Commercial Zone',
        coordinates: [30.7230, 76.7685],
        timestamp: '14 min ago',
        affectedRoads: 1,
        targetDestinationName: 'Sector 34 Water Maintenance Substation',
        standardETA: 8.5,
        optimizedETA: 4.8,
        status: 'active',
        description: 'Main water feeder cracked. Utility repair van dispatched to Sector 34 Substation.',
        dispatchButtonText: '▶ Dispatch Water Utility Repair Van',
        vehicleIcon: '🔧',
        standardRoute: [
          [30.7415, 76.7825],
          [30.7350, 76.7745],
          [30.7290, 76.7670],
          [30.7230, 76.7685]
        ],
        optimizedRoute: [
          [30.7415, 76.7825],
          [30.7380, 76.7710],
          [30.7300, 76.7610],
          [30.7230, 76.7685]
        ]
      }
    ],

    corridors: [
      {
        id: 'CORR-CHD-01',
        name: 'Madhya Marg (PGI to Transport Chowk)',
        coordinates: [
          [30.7683, 76.7725],
          [30.7588, 76.7845],
          [30.7512, 76.7942],
          [30.7420, 76.8060],
          [30.7315, 76.8210]
        ],
        currentDensityPct: 84,
        avgSpeedKmh: 24,
        congestionLevel: 'High',
        zone: 'North Axis'
      },
      {
        id: 'CORR-CHD-02',
        name: 'Jan Marg (Secretariat to Sector 17)',
        coordinates: [
          [30.7592, 76.8035],
          [30.7512, 76.7942],
          [30.7415, 76.7825],
          [30.7312, 76.7702],
          [30.7208, 76.7575]
        ],
        currentDensityPct: 76,
        avgSpeedKmh: 26,
        congestionLevel: 'High',
        zone: 'Central Axis'
      }
    ],

    roadClosureOptions: [
      {
        value: 'none',
        label: 'None (All Corridors Open)',
        blockedSegment: [],
        detourRoute: [],
        detourRoadName: '',
        normalTravelMin: 18,
        blockedTravelMin: 18,
        detourTravelMin: 18
      },
      {
        value: 'madhya-marg',
        label: 'Madhya Marg (PGI to Sector 26)',
        blockedSegment: [
          [30.7683, 76.7725],
          [30.7588, 76.7845],
          [30.7512, 76.7942]
        ],
        detourRoute: [
          [30.7683, 76.7725],
          [30.7620, 76.7610],
          [30.7480, 76.7690],
          [30.7420, 76.7830],
          [30.7512, 76.7942]
        ],
        detourRoadName: 'Himalaya Marg & Sarovar Path Bypass',
        normalTravelMin: 14,
        blockedTravelMin: 32,
        detourTravelMin: 19
      }
    ],

    rainFloodSegments: [
      [30.7415, 76.7825],
      [30.7360, 76.7760],
      [30.7312, 76.7702]
    ],
    rainDetourRoute: [
      [30.7490, 76.7915],
      [30.7550, 76.7780],
      [30.7450, 76.7650]
    ],

    recommendation: {
      id: 'REC-CHD-01',
      issue: 'Jan Marg blockage causing ambulance delay to nearest GMSH-16.',
      recommendedAction: 'Divert traffic through Udyan Path & activate 4 synchronized green lights.',
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
          title: 'Activate Green-Wave on Udyan Path to GMSH-16',
          description: 'Synchronize 4 traffic controllers to grant permanent green signal for approaching ambulance.',
          category: 'signal',
          estimatedTimeSec: 8,
          benefit: 'Saves 3.2 minutes',
          active: true
        }
      ]
    }
  },

  delhi: {
    id: 'delhi',
    name: 'New Delhi',
    country: 'India',
    flag: '🇮🇳',
    coordinates: [28.6139, 77.2090],
    zoom: 12,
    tagline: 'National Capital Region & High-Density Corridors',

    baselineScore: { overall: 71, traffic: 62, emergency: 78, infrastructure: 74 },
    baselineSpeedKmh: 18,
    baselineCongestionPct: 78,
    baselineAmbulanceEtaMin: 14.8,
    activeEventsCount: 3,

    baselineWaterMld: 990,
    baselineEnergyMwh: 6400,
    baselineWasteTons: 11200,

    hospitals: [
      {
        id: 'HOSP-DEL-01',
        name: 'AIIMS Apex Trauma Center',
        coordinates: [28.5670, 77.2000],
        emergencyCapacityPct: 92,
        availableBeds: 18,
        totalBeds: 2400,
        activeAmbulances: 22,
        avgResponseTimeMin: 7.8,
        zone: 'South Delhi'
      },
      {
        id: 'HOSP-DEL-02',
        name: 'LNJP Hospital Trauma Hub',
        coordinates: [28.6360, 77.2405],
        emergencyCapacityPct: 74,
        availableBeds: 45,
        totalBeds: 2000,
        activeAmbulances: 15,
        avgResponseTimeMin: 6.9,
        zone: 'Central Delhi'
      },
      {
        id: 'HOSP-DEL-03',
        name: 'Max Super Speciality Saket',
        coordinates: [28.5280, 77.2110],
        emergencyCapacityPct: 68,
        availableBeds: 34,
        totalBeds: 600,
        activeAmbulances: 12,
        avgResponseTimeMin: 7.2,
        zone: 'South Outer'
      }
    ],

    incidents: [
      {
        id: 'DEL-2091',
        title: 'Multi-Vehicle Collision on Ring Road',
        category: 'accident',
        responseType: 'ambulance',
        severity: 'critical',
        locationName: 'AIIMS Flyover & Ring Road',
        coordinates: [28.5675, 77.2085],
        timestamp: '3 min ago',
        vehiclesInvolved: 4,
        affectedRoads: 2,
        targetDestinationName: 'AIIMS Apex Trauma Center',
        standardETA: 16.4,
        optimizedETA: 8.2,
        status: 'active',
        description: 'Multi-vehicle pileup under AIIMS flyover. Nearest hospital matched: AIIMS Apex Trauma Center (0.9 km away).',
        dispatchButtonText: '▶ Dispatch Trauma Ambulance to AIIMS',
        vehicleIcon: '🚑',
        standardRoute: [
          [28.5675, 77.2085],
          [28.5685, 77.2140],
          [28.5705, 77.2200],
          [28.5670, 77.2000]
        ],
        optimizedRoute: [
          [28.5675, 77.2085],
          [28.5645, 77.2045],
          [28.5660, 77.2015],
          [28.5670, 77.2000]
        ]
      }
    ],

    corridors: [
      {
        id: 'CORR-DEL-01',
        name: 'Inner Ring Road (AIIMS to Dhaula Kuan)',
        coordinates: [
          [28.5705, 77.2200],
          [28.5675, 77.2085],
          [28.5710, 77.1950],
          [28.5715, 77.1840],
          [28.5780, 77.1700]
        ],
        currentDensityPct: 91,
        avgSpeedKmh: 16,
        congestionLevel: 'High',
        zone: 'South-West Loop'
      }
    ],

    roadClosureOptions: [
      {
        value: 'none',
        label: 'None (All Arterials Open)',
        blockedSegment: [],
        detourRoute: [],
        detourRoadName: '',
        normalTravelMin: 22,
        blockedTravelMin: 22,
        detourTravelMin: 22
      },
      {
        value: 'ring-road',
        label: 'Inner Ring Road (AIIMS Flyover Stretch)',
        blockedSegment: [
          [28.5675, 77.2085],
          [28.5710, 77.1950]
        ],
        detourRoute: [
          [28.5675, 77.2085],
          [28.5580, 77.2020],
          [28.5700, 77.1850],
          [28.5710, 77.1950]
        ],
        detourRoadName: 'Africa Avenue & August Kranti Marg Bypass',
        normalTravelMin: 18,
        blockedTravelMin: 45,
        detourTravelMin: 23
      }
    ],

    rainFloodSegments: [
      [28.5675, 77.2085],
      [28.5710, 77.1950]
    ],
    rainDetourRoute: [
      [28.5780, 77.2250],
      [28.5850, 77.2150],
      [28.5800, 77.2000]
    ],

    recommendation: {
      id: 'REC-DEL-01',
      issue: 'Ring Road bottleneck near AIIMS creating 6.4 min trauma delay.',
      recommendedAction: 'Activate Africa Avenue green corridor to nearest trauma hospital.',
      targetLocation: 'South Delhi Arterial Loop',
      confidencePct: 96,
      impactMetrics: {
        travelTimeReductionPct: 35,
        congestionReductionPct: 42,
        emergencyTimeReductionPct: 43
      },
      actionItems: [
        {
          id: 'ACT-DEL-1',
          title: 'Sync Africa Avenue Traffic Signals',
          description: 'Override 5 intersection signals for emergency vehicle express corridor.',
          category: 'signal',
          estimatedTimeSec: 10,
          benefit: 'Saves 4.5 minutes',
          active: true
        }
      ]
    }
  },

  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    coordinates: [19.0760, 72.8777],
    zoom: 12,
    tagline: 'Financial Capital & High-Capacity Coastal Transit',

    baselineScore: { overall: 68, traffic: 58, emergency: 74, infrastructure: 72 },
    baselineSpeedKmh: 16,
    baselineCongestionPct: 84,
    baselineAmbulanceEtaMin: 16.2,
    activeEventsCount: 3,

    baselineWaterMld: 3850,
    baselineEnergyMwh: 4200,
    baselineWasteTons: 7500,

    hospitals: [
      {
        id: 'HOSP-MUM-01',
        name: 'KEM Hospital & Medical College',
        coordinates: [19.0030, 72.8430],
        emergencyCapacityPct: 86,
        availableBeds: 30,
        totalBeds: 1800,
        activeAmbulances: 18,
        avgResponseTimeMin: 7.4,
        zone: 'Parel Central'
      },
      {
        id: 'HOSP-MUM-02',
        name: 'Lilavati Hospital Trauma Wing',
        coordinates: [19.0515, 72.8295],
        emergencyCapacityPct: 75,
        availableBeds: 22,
        totalBeds: 450,
        activeAmbulances: 10,
        avgResponseTimeMin: 6.8,
        zone: 'Bandra West'
      },
      {
        id: 'HOSP-MUM-03',
        name: 'Nanavati Max Super Speciality',
        coordinates: [19.0965, 72.8415],
        emergencyCapacityPct: 70,
        availableBeds: 38,
        totalBeds: 500,
        activeAmbulances: 12,
        avgResponseTimeMin: 7.1,
        zone: 'Vile Parle North'
      }
    ],

    incidents: [
      {
        id: 'MUM-3011',
        title: 'Severe High-Tide Waterlogging at Hindmata',
        category: 'weather',
        responseType: 'ambulance',
        severity: 'critical',
        locationName: 'Dr. Ambedkar Road / Hindmata Junction',
        coordinates: [19.0120, 72.8420],
        timestamp: '5 min ago',
        vehiclesInvolved: 3,
        affectedRoads: 2,
        targetDestinationName: 'KEM Hospital & Medical College',
        standardETA: 18.5,
        optimizedETA: 9.1,
        status: 'active',
        description: 'Waterlogging on Ambedkar Road. Nearest trauma center matched: KEM Hospital (1.1 km away).',
        dispatchButtonText: '▶ Dispatch Trauma Unit to KEM',
        vehicleIcon: '🚑',
        standardRoute: [
          [19.0120, 72.8420],
          [19.0080, 72.8440],
          [19.0030, 72.8430]
        ],
        optimizedRoute: [
          [19.0120, 72.8420],
          [19.0150, 72.8350],
          [19.0050, 72.8380],
          [19.0030, 72.8430]
        ]
      }
    ],

    corridors: [
      {
        id: 'CORR-MUM-01',
        name: 'Western Express Highway (WEH)',
        coordinates: [
          [19.0595, 72.8475],
          [19.0780, 72.8525],
          [19.0910, 72.8550],
          [19.1025, 72.8575]
        ],
        currentDensityPct: 89,
        avgSpeedKmh: 19,
        congestionLevel: 'High',
        zone: 'Suburban North-South'
      }
    ],

    roadClosureOptions: [
      {
        value: 'none',
        label: 'None (All Arterials Open)',
        blockedSegment: [],
        detourRoute: [],
        detourRoadName: '',
        normalTravelMin: 25,
        blockedTravelMin: 25,
        detourTravelMin: 25
      }
    ],

    rainFloodSegments: [
      [19.0120, 72.8420],
      [19.0080, 72.8440]
    ],
    rainDetourRoute: [
      [19.0120, 72.8420],
      [19.0150, 72.8350],
      [19.0050, 72.8380]
    ],

    recommendation: {
      id: 'REC-MUM-01',
      issue: 'Hindmata waterlogging blocking main artery to nearest hospital KEM.',
      recommendedAction: 'Divert traffic via Senapati Bapat Marg elevated bypass with smart signal clearance.',
      targetLocation: 'Parel Trauma Corridor',
      confidencePct: 95,
      impactMetrics: {
        travelTimeReductionPct: 38,
        congestionReductionPct: 29,
        emergencyTimeReductionPct: 44
      },
      actionItems: [
        {
          id: 'ACT-MUM-1',
          title: 'Activate Coastal Flyover Green Wave',
          description: 'Clear Senapati Bapat Marg signals for trauma transport.',
          category: 'signal',
          estimatedTimeSec: 10,
          benefit: 'Saves 7.1 minutes',
          active: true
        }
      ]
    }
  },

  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    flag: '🇮🇳',
    coordinates: [12.9716, 77.5946],
    zoom: 12,
    tagline: 'Silicon Valley Tech Corridors & Ring Networks',

    baselineScore: { overall: 64, traffic: 52, emergency: 71, infrastructure: 69 },
    baselineSpeedKmh: 12,
    baselineCongestionPct: 89,
    baselineAmbulanceEtaMin: 18.5,
    activeEventsCount: 3,

    baselineWaterMld: 1450,
    baselineEnergyMwh: 3600,
    baselineWasteTons: 5000,

    hospitals: [
      {
        id: 'HOSP-BLR-01',
        name: 'St. John’s Medical College Hospital',
        coordinates: [12.9320, 77.6200],
        emergencyCapacityPct: 82,
        availableBeds: 26,
        totalBeds: 1200,
        activeAmbulances: 15,
        avgResponseTimeMin: 7.1,
        zone: 'Koramangala South'
      },
      {
        id: 'HOSP-BLR-02',
        name: 'Manipal Hospital HAL Old Airport',
        coordinates: [12.9585, 77.6535],
        emergencyCapacityPct: 78,
        availableBeds: 32,
        totalBeds: 650,
        activeAmbulances: 14,
        avgResponseTimeMin: 6.8,
        zone: 'East HAL Hub'
      },
      {
        id: 'HOSP-BLR-03',
        name: 'Victoria Hospital Trauma Care',
        coordinates: [12.9635, 77.5740],
        emergencyCapacityPct: 85,
        availableBeds: 40,
        totalBeds: 1000,
        activeAmbulances: 16,
        avgResponseTimeMin: 7.4,
        zone: 'City Market West'
      }
    ],

    incidents: [
      {
        id: 'BLR-4012',
        title: 'Silk Board Junction Bottleneck Gridlock',
        category: 'accident',
        responseType: 'ambulance',
        severity: 'critical',
        locationName: 'Central Silk Board Flyover Junction',
        coordinates: [12.9175, 77.6235],
        timestamp: '4 min ago',
        vehiclesInvolved: 3,
        affectedRoads: 2,
        targetDestinationName: 'St. John’s Medical College Hospital',
        standardETA: 21.4,
        optimizedETA: 9.8,
        status: 'active',
        description: 'Multi-vehicle crash at Silk Board. Nearest matched trauma center: St. John’s Hospital (1.7 km away).',
        dispatchButtonText: '▶ Dispatch Ambulance to St. John’s',
        vehicleIcon: '🚑',
        standardRoute: [
          [12.9175, 77.6235],
          [12.9240, 77.6220],
          [12.9320, 77.6200]
        ],
        optimizedRoute: [
          [12.9175, 77.6235],
          [12.9200, 77.6150],
          [12.9280, 77.6160],
          [12.9320, 77.6200]
        ]
      }
    ],

    corridors: [
      {
        id: 'CORR-BLR-01',
        name: 'Outer Ring Road (ORR Bellandur to Silk Board)',
        coordinates: [
          [12.9355, 77.6890],
          [12.9285, 77.6745],
          [12.9260, 77.6650],
          [12.9245, 77.6530],
          [12.9215, 77.6395],
          [12.9175, 77.6235]
        ],
        currentDensityPct: 94,
        avgSpeedKmh: 11,
        congestionLevel: 'High',
        zone: 'IT Corridor'
      }
    ],

    roadClosureOptions: [
      {
        value: 'none',
        label: 'None (All Corridors Open)',
        blockedSegment: [],
        detourRoute: [],
        detourRoadName: '',
        normalTravelMin: 28,
        blockedTravelMin: 28,
        detourTravelMin: 28
      }
    ],

    rainFloodSegments: [
      [12.9285, 77.6745],
      [12.9245, 77.6530]
    ],
    rainDetourRoute: [
      [12.9380, 77.6650],
      [12.9320, 77.6450]
    ],

    recommendation: {
      id: 'REC-BLR-01',
      issue: 'Silk Board bottleneck causing 8.7 min ambulance delay to St. John’s.',
      recommendedAction: 'Divert traffic via BTM Layout 2nd Stage feeder road with smart signal priority.',
      targetLocation: 'Koramangala Health Hub',
      confidencePct: 93,
      impactMetrics: {
        travelTimeReductionPct: 42,
        congestionReductionPct: 36,
        emergencyTimeReductionPct: 47
      },
      actionItems: [
        {
          id: 'ACT-BLR-1',
          title: 'Clear BTM Layout 2nd Stage Signal Corridor',
          description: 'Synchronize 3 local traffic lights for ambulance bypass.',
          category: 'signal',
          estimatedTimeSec: 8,
          benefit: 'Saves 8.7 minutes',
          active: true
        }
      ]
    }
  },

  london: {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    coordinates: [51.5074, -0.1278],
    zoom: 13,
    tagline: 'Greater London Smart Mobility & Thames Bridges',

    baselineScore: { overall: 82, traffic: 76, emergency: 88, infrastructure: 82 },
    baselineSpeedKmh: 24,
    baselineCongestionPct: 58,
    baselineAmbulanceEtaMin: 8.2,
    activeEventsCount: 2,

    baselineWaterMld: 2600,
    baselineEnergyMwh: 3800,
    baselineWasteTons: 3700,

    hospitals: [
      {
        id: 'HOSP-LDN-01',
        name: 'St Thomas’ Hospital Trauma',
        coordinates: [51.4990, -0.1190],
        emergencyCapacityPct: 76,
        availableBeds: 22,
        totalBeds: 900,
        activeAmbulances: 14,
        avgResponseTimeMin: 5.9,
        zone: 'Lambeth South'
      },
      {
        id: 'HOSP-LDN-02',
        name: 'University College Hospital (UCH)',
        coordinates: [51.5240, -0.1360],
        emergencyCapacityPct: 80,
        availableBeds: 28,
        totalBeds: 700,
        activeAmbulances: 12,
        avgResponseTimeMin: 6.2,
        zone: 'Bloomsbury North'
      },
      {
        id: 'HOSP-LDN-03',
        name: 'Royal London Hospital Trauma',
        coordinates: [51.5190, -0.0590],
        emergencyCapacityPct: 84,
        availableBeds: 35,
        totalBeds: 850,
        activeAmbulances: 18,
        avgResponseTimeMin: 6.5,
        zone: 'Whitechapel East'
      }
    ],

    incidents: [
      {
        id: 'LDN-5018',
        title: 'Collision on Westminster Bridge',
        category: 'accident',
        responseType: 'ambulance',
        severity: 'high',
        locationName: 'Westminster Bridge / Parliament Square',
        coordinates: [51.5008, -0.1245],
        timestamp: '3 min ago',
        vehiclesInvolved: 2,
        affectedRoads: 2,
        targetDestinationName: 'St Thomas’ Hospital Trauma',
        standardETA: 12.4,
        optimizedETA: 6.8,
        status: 'active',
        description: 'Collision on Westminster Bridge. Nearest hospital matched: St Thomas’ Hospital (0.4 km away).',
        dispatchButtonText: '▶ Dispatch NHS Trauma Ambulance to St Thomas’',
        vehicleIcon: '🚑',
        standardRoute: [
          [51.5008, -0.1245],
          [51.5012, -0.1215],
          [51.5016, -0.1180]
        ],
        optimizedRoute: [
          [51.5008, -0.1245],
          [51.4938, -0.1248],
          [51.4985, -0.1190],
          [51.5016, -0.1180]
        ]
      }
    ],

    corridors: [
      {
        id: 'CORR-LDN-01',
        name: 'A3212 Millbank & Victoria Embankment',
        coordinates: [
          [51.4938, -0.1248],
          [51.4985, -0.1255],
          [51.5008, -0.1245],
          [51.5045, -0.1220]
        ],
        currentDensityPct: 82,
        avgSpeedKmh: 20,
        congestionLevel: 'High',
        zone: 'Thames Riverside'
      }
    ],

    roadClosureOptions: [
      {
        value: 'none',
        label: 'None (All Bridges Open)',
        blockedSegment: [],
        detourRoute: [],
        detourRoadName: '',
        normalTravelMin: 16,
        blockedTravelMin: 16,
        detourTravelMin: 16
      }
    ],

    rainFloodSegments: [
      [51.4938, -0.1248],
      [51.4985, -0.1255]
    ],
    rainDetourRoute: [
      [51.4980, -0.1320],
      [51.4900, -0.1300]
    ],

    recommendation: {
      id: 'REC-LDN-01',
      issue: 'Westminster Bridge blocked causing delay to nearest St Thomas’ Emergency.',
      recommendedAction: 'Divert ambulance via Lambeth Bridge with intelligent signal preemption.',
      targetLocation: 'Thames South Bank',
      confidencePct: 95,
      impactMetrics: {
        travelTimeReductionPct: 45,
        congestionReductionPct: 32,
        emergencyTimeReductionPct: 45
      },
      actionItems: [
        {
          id: 'ACT-LDN-1',
          title: 'Preempt Lambeth Roundabout Traffic Signals',
          description: 'Hold northbound queue to allow trauma vehicle unobstructed entry to St Thomas’.',
          category: 'signal',
          estimatedTimeSec: 6,
          benefit: 'Saves 5.6 minutes',
          active: true
        }
      ]
    }
  },

  newyork: {
    id: 'newyork',
    name: 'New York City',
    country: 'United States',
    flag: '🇺🇸',
    coordinates: [40.7128, -74.0060],
    zoom: 13,
    tagline: 'Manhattan Grid & Multi-Avenue Expressways',

    baselineScore: { overall: 76, traffic: 68, emergency: 84, infrastructure: 76 },
    baselineSpeedKmh: 21,
    baselineCongestionPct: 69,
    baselineAmbulanceEtaMin: 9.4,
    activeEventsCount: 2,

    baselineWaterMld: 3780,
    baselineEnergyMwh: 11000,
    baselineWasteTons: 12000,

    hospitals: [
      {
        id: 'HOSP-NYC-01',
        name: 'NYC Health + Hospitals / Bellevue',
        coordinates: [40.7390, -73.9760],
        emergencyCapacityPct: 85,
        availableBeds: 32,
        totalBeds: 850,
        activeAmbulances: 16,
        avgResponseTimeMin: 5.8,
        zone: 'Midtown East'
      },
      {
        id: 'HOSP-NYC-02',
        name: 'Mount Sinai Hospital Trauma',
        coordinates: [40.7900, -73.9530],
        emergencyCapacityPct: 78,
        availableBeds: 25,
        totalBeds: 1100,
        activeAmbulances: 14,
        avgResponseTimeMin: 6.4,
        zone: 'Upper East Side'
      },
      {
        id: 'HOSP-NYC-03',
        name: 'NewYork-Presbyterian Lower Manhattan',
        coordinates: [40.7105, -74.0050],
        emergencyCapacityPct: 72,
        availableBeds: 38,
        totalBeds: 500,
        activeAmbulances: 10,
        avgResponseTimeMin: 6.1,
        zone: 'Downtown Financial'
      }
    ],

    incidents: [
      {
        id: 'NYC-6022',
        title: 'FDR Drive Lane Obstruction',
        category: 'accident',
        responseType: 'ambulance',
        severity: 'high',
        locationName: 'FDR Drive at E 23rd St Exit',
        coordinates: [40.7358, -73.9738],
        timestamp: '2 min ago',
        vehiclesInvolved: 2,
        affectedRoads: 2,
        targetDestinationName: 'NYC Health + Hospitals / Bellevue',
        standardETA: 13.5,
        optimizedETA: 6.9,
        status: 'active',
        description: 'Stalled delivery truck on FDR Drive. Nearest trauma hospital matched: Bellevue Hospital (0.5 km away).',
        dispatchButtonText: '▶ Dispatch EMS Unit to Bellevue',
        vehicleIcon: '🚑',
        standardRoute: [
          [40.7358, -73.9738],
          [40.7392, -73.9720],
          [40.7390, -73.9760]
        ],
        optimizedRoute: [
          [40.7358, -73.9738],
          [40.7370, -73.9785],
          [40.7402, -73.9760],
          [40.7390, -73.9760]
        ]
      }
    ],

    corridors: [
      {
        id: 'CORR-NYC-01',
        name: 'FDR Drive (E 14th St to E 42nd St)',
        coordinates: [
          [40.7282, -73.9722],
          [40.7328, -73.9730],
          [40.7358, -73.9738],
          [40.7392, -73.9720],
          [40.7442, -73.9710]
        ],
        currentDensityPct: 88,
        avgSpeedKmh: 22,
        congestionLevel: 'High',
        zone: 'East River Corridor'
      }
    ],

    roadClosureOptions: [
      {
        value: 'none',
        label: 'None (All Avenues Open)',
        blockedSegment: [],
        detourRoute: [],
        detourRoadName: '',
        normalTravelMin: 15,
        blockedTravelMin: 15,
        detourTravelMin: 15
      }
    ],

    rainFloodSegments: [
      [40.7282, -73.9722],
      [40.7358, -73.9738]
    ],
    rainDetourRoute: [
      [40.7315, -73.9825],
      [40.7370, -73.9785]
    ],

    recommendation: {
      id: 'REC-NYC-01',
      issue: 'FDR Drive lane blockage delaying trauma transport to Bellevue.',
      recommendedAction: 'Divert EMS via 1st Avenue dedicated bus & emergency corridor.',
      targetLocation: 'Bellevue Health Center',
      confidencePct: 96,
      impactMetrics: {
        travelTimeReductionPct: 48,
        congestionReductionPct: 35,
        emergencyTimeReductionPct: 49
      },
      actionItems: [
        {
          id: 'ACT-NYC-1',
          title: 'Activate 1st Avenue EMS Transit Signal Priority',
          description: 'Hold crosstown red lights for rapid EMS transit on 1st Avenue.',
          category: 'signal',
          estimatedTimeSec: 5,
          benefit: 'Saves 6.6 minutes',
          active: true
        }
      ]
    }
  }
};

// 📍 PATIALA DIGITAL TWIN (Dedicated Location Detection Profile - Hidden from Preset Browser)
export const PATIALA_PROFILE: CityProfile = {
  id: 'patiala',
  name: 'Patiala',
  country: 'India',
  flag: '🇮🇳',
  coordinates: [30.3398, 76.3869],
  zoom: 14,
  tagline: 'Historical Royal Heritage & Modern Smart Municipal Operations Cockpit',
  
  baselineScore: { overall: 85, traffic: 81, emergency: 89, infrastructure: 83 },
  baselineSpeedKmh: 34,
  baselineCongestionPct: 46,
  baselineAmbulanceEtaMin: 6.8,
  activeEventsCount: 2,

  baselineWaterMld: 240,
  baselineEnergyMwh: 850,
  baselineWasteTons: 310,

  hospitals: [
    {
      id: 'HOSP-PTA-01',
      name: 'GMC & Rajindra Hospital Patiala',
      coordinates: [30.3445, 76.3980],
      emergencyCapacityPct: 78,
      availableBeds: 38,
      totalBeds: 1100,
      activeAmbulances: 12,
      avgResponseTimeMin: 5.8,
      zone: 'Rajindra Hospital Complex'
    },
    {
      id: 'HOSP-PTA-02',
      name: 'Vardhman Trauma & Multi-Speciality Hospital',
      coordinates: [30.3320, 76.3810],
      emergencyCapacityPct: 62,
      availableBeds: 24,
      totalBeds: 180,
      activeAmbulances: 6,
      avgResponseTimeMin: 6.4,
      zone: 'Leela Bhawan / Civil Lines'
    },
    {
      id: 'HOSP-PTA-03',
      name: 'Amar Hospital & Trauma Centre',
      coordinates: [30.3510, 76.3750],
      emergencyCapacityPct: 55,
      availableBeds: 18,
      totalBeds: 120,
      activeAmbulances: 4,
      avgResponseTimeMin: 7.2,
      zone: 'Sirhind Road / North Patiala'
    }
  ],

  incidents: [
    {
      id: 'PTA-101',
      title: 'Major Multi-Vehicle Crash at Rajpura Road & Urban Estate 2',
      category: 'accident',
      responseType: 'ambulance',
      severity: 'critical',
      locationName: 'Rajpura Road & Urban Estate Phase 2 Junction',
      coordinates: [30.3520, 76.4080],
      timestamp: '4m ago',
      vehiclesInvolved: 2,
      affectedRoads: 2,
      targetDestinationName: 'GMC & Rajindra Hospital Patiala',
      standardETA: 13.5,
      optimizedETA: 5.8,
      status: 'active',
      description: 'Head-on collision at Rajpura Road junction blocking 2 inbound lanes. Urgent triage to Rajindra Hospital.',
      standardRoute: [
        [30.3520, 76.4080],
        [30.3490, 76.4040],
        [30.3470, 76.4000],
        [30.3445, 76.3980]
      ],
      optimizedRoute: [
        [30.3520, 76.4080],
        [30.3480, 76.4020],
        [30.3460, 76.3990],
        [30.3445, 76.3980]
      ],
      dispatchButtonText: '▶ Dispatch Green-Wave Ambulance to Rajindra Hospital',
      vehicleIcon: '🚑'
    },
    {
      id: 'PTA-102',
      title: 'Main Feeder Pipeline Rupture at Leela Bhawan',
      category: 'utility',
      responseType: 'utility_crew',
      severity: 'high',
      locationName: 'Leela Bhawan Market Feeder Main',
      coordinates: [30.3365, 76.3840],
      timestamp: '15m ago',
      affectedRoads: 1,
      targetDestinationName: 'Patiala Municipal Water Substation 2',
      standardETA: 11.2,
      optimizedETA: 5.1,
      status: 'active',
      description: 'Water distribution main pipe rupture causing water shortage across Leela Bhawan & Mall Road.',
      standardRoute: [
        [30.3365, 76.3840],
        [30.3340, 76.3880],
        [30.3320, 76.3920]
      ],
      optimizedRoute: [
        [30.3365, 76.3840],
        [30.3350, 76.3860],
        [30.3320, 76.3920]
      ],
      dispatchButtonText: '▶ Deploy Rapid Water Valve Repair Crew',
      vehicleIcon: '🔧'
    }
  ],

  corridors: [
    {
      id: 'CORR-PTA-01',
      name: 'Rajpura-Patiala Highway Arterial (NH-7)',
      coordinates: [
        [30.3580, 76.4180],
        [30.3500, 76.4020],
        [30.3420, 76.3920]
      ],
      currentDensityPct: 72,
      avgSpeedKmh: 36,
      congestionLevel: 'High',
      zone: 'East Highway Sector'
    },
    {
      id: 'CORR-PTA-02',
      name: 'Mall Road & Leela Bhawan Commercial Corridor',
      coordinates: [
        [30.3380, 76.3820],
        [30.3350, 76.3890],
        [30.3310, 76.3950]
      ],
      currentDensityPct: 58,
      avgSpeedKmh: 28,
      congestionLevel: 'Moderate',
      zone: 'Central Civil Lines'
    },
    {
      id: 'CORR-PTA-03',
      name: 'Sirhind Road & Urban Estate Bypass',
      coordinates: [
        [30.3620, 76.3680],
        [30.3540, 76.3620],
        [30.3480, 76.3550]
      ],
      currentDensityPct: 44,
      avgSpeedKmh: 42,
      congestionLevel: 'Low',
      zone: 'North Bypass'
    }
  ],

  roadClosureOptions: [
    {
      value: 'pta-rajpura-road',
      label: 'Rajpura Road Highway Bottleneck (Major Congestion)',
      blockedSegment: [
        [30.3540, 76.4100],
        [30.3480, 76.4000]
      ],
      detourRoute: [
        [30.3540, 76.4100],
        [30.3590, 76.3950],
        [30.3480, 76.4000]
      ],
      detourRoadName: 'Patiala Northern Bypass Diversion',
      normalTravelMin: 8,
      blockedTravelMin: 22,
      detourTravelMin: 11
    }
  ],

  rainFloodSegments: [
    [30.3370, 76.3830],
    [30.3340, 76.3890]
  ],
  rainDetourRoute: [
    [30.3370, 76.3830],
    [30.3410, 76.3850],
    [30.3340, 76.3890]
  ],

  recommendation: {
    id: 'REC-PTA-01',
    issue: 'Rajpura Road inbound bottleneck causing delay to Rajindra Hospital trauma center.',
    recommendedAction: 'Coordinate dynamic signal green wave along Rajpura Road and divert traffic to Northern Bypass.',
    targetLocation: 'Rajpura Road & Bahadurgarh Junction',
    confidencePct: 95,
    impactMetrics: {
      travelTimeReductionPct: 42,
      congestionReductionPct: 28,
      emergencyTimeReductionPct: 57,
      resourceSavingsPct: 16
    },
    actionItems: [
      {
        id: 'ACT-PTA-1',
        title: 'Rajpura Road Smart Green-Wave Coordination',
        description: 'Synchronize signal cycle splits between Urban Estate 2 and Rajindra Hospital.',
        category: 'signal',
        estimatedTimeSec: 20,
        benefit: 'Saves 7.7 minutes',
        active: true
      },
      {
        id: 'ACT-PTA-2',
        title: 'Leela Bhawan Pressure Bypass Valve Activation',
        description: 'Reroute water distribution via Sector 2 secondary feeder to restore water pressure.',
        category: 'water',
        estimatedTimeSec: 40,
        benefit: '+85% pressure restored',
        active: true
      }
    ]
  }
};
