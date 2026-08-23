import { PandemicFacility, PandemicAffectedZone, PandemicRoadRestriction } from '../types/pandemic';

export const PANDEMIC_FACILITIES_DATABASE: Record<string, PandemicFacility[]> = {
  // 1. PATIALA SMART CITY DIGITAL TWIN
  'patiala': [
    {
      id: 'PTA-HOSP-01',
      name: 'GMC & Rajindra Hospital (Apex Pandemic Centre)',
      type: 'hospital',
      coordinates: [30.3345, 76.3860],
      address: 'Sangrur Road, New Lal Bagh, Patiala',
      isOpen: true,
      statusText: 'Open 24/7 • High Triage Load',
      contactNumber: '+91 175 2212018',
      totalBeds: 1200,
      availableBeds: 210,
      icuBeds: 42,
      oxygenStockCylinders: 450
    },
    {
      id: 'PTA-HOSP-02',
      name: 'Mata Kaushalya Government Civil Hospital',
      type: 'hospital',
      coordinates: [30.3270, 76.3980],
      address: 'Near Lahori Gate, Patiala',
      isOpen: true,
      statusText: 'Open 24/7 • Dedicated Isolation Ward',
      contactNumber: '+91 175 2304545',
      totalBeds: 350,
      availableBeds: 84,
      icuBeds: 16,
      oxygenStockCylinders: 180
    },
    {
      id: 'PTA-HOSP-03',
      name: 'Manipal / Columbia Asia Hospital',
      type: 'hospital',
      coordinates: [30.3420, 76.3750],
      address: 'Bhupindra Road, Patiala',
      isOpen: true,
      statusText: 'Open 24/7 • Advanced Critical Care',
      contactNumber: '+91 175 6662000',
      totalBeds: 180,
      availableBeds: 38,
      icuBeds: 24,
      oxygenStockCylinders: 120
    },
    {
      id: 'PTA-DISP-01',
      name: 'Civil Dispensary Model Town',
      type: 'dispensary',
      coordinates: [30.3480, 76.3820],
      address: 'Model Town Main Market, Patiala',
      isOpen: true,
      statusText: 'Open 08:00 - 20:00 • Essential Medicines In Stock',
      contactNumber: '+91 175 2200112',
      dailyTestingCapacity: 300,
      currentWaitTimeMin: 10
    },
    {
      id: 'PTA-DISP-02',
      name: 'Urban Primary Health Centre (UPHC) Tripuri',
      type: 'dispensary',
      coordinates: [30.3620, 76.3910],
      address: 'Main Bazaar, Tripuri Town, Patiala',
      isOpen: true,
      statusText: 'Open 08:00 - 20:00 • Free Fever Kits Distributed',
      contactNumber: '+91 175 2371900',
      dailyTestingCapacity: 250,
      currentWaitTimeMin: 15
    },
    {
      id: 'PTA-DISP-03',
      name: 'UPHC Sanauri Gate Community Clinic',
      type: 'dispensary',
      coordinates: [30.3200, 76.4050],
      address: 'Sanauri Gate Circular Road, Patiala',
      isOpen: true,
      statusText: 'Open 08:00 - 18:00 • Maternal & Fever Triage',
      contactNumber: '+91 175 2210884',
      dailyTestingCapacity: 150,
      currentWaitTimeMin: 8
    },
    {
      id: 'PTA-TEST-01',
      name: 'Drive-Through RT-PCR & Rapid Testing Kiosk',
      type: 'testing_booth',
      coordinates: [30.3390, 76.3950],
      address: 'Polo Ground Outer Complex, Patiala',
      isOpen: true,
      statusText: 'Open 07:00 - 22:00 • Results in 4 Hours',
      dailyTestingCapacity: 800,
      currentWaitTimeMin: 5
    },
    {
      id: 'PTA-TEST-02',
      name: 'YPS Chowk Rapid Antigen Testing Booth',
      type: 'testing_booth',
      coordinates: [30.3450, 76.3880],
      address: 'Yadvindra Public School Circle, Patiala',
      isOpen: true,
      statusText: 'Open 24/7 • Instant 15-min Report',
      dailyTestingCapacity: 500,
      currentWaitTimeMin: 12
    },
    {
      id: 'PTA-OXY-01',
      name: 'Patiala District Medical Oxygen & Critical Supply Reserve',
      type: 'oxygen_depot',
      coordinates: [30.3540, 76.3680],
      address: 'Municipal Substation & Industrial Area, Patiala',
      isOpen: true,
      statusText: 'Operational 24/7 • 12,000L Liquid Oxygen Tank',
      contactNumber: '+91 175 2991000',
      oxygenStockCylinders: 950
    }
  ],

  // 2. CHANDIGARH DIGITAL TWIN
  'chandigarh': [
    {
      id: 'CHD-HOSP-01',
      name: 'PGIMER Apex Pandemic & Critical Care Centre',
      type: 'hospital',
      coordinates: [30.7650, 76.7760],
      address: 'Sector 12, Chandigarh',
      isOpen: true,
      statusText: 'Open 24/7 • 850 Dedicated Pandemic Beds',
      contactNumber: '+91 172 2747585',
      totalBeds: 2100,
      availableBeds: 340,
      icuBeds: 92,
      oxygenStockCylinders: 1200
    },
    {
      id: 'CHD-HOSP-02',
      name: 'GMCH Sector 32 Medical College & Hospital',
      type: 'hospital',
      coordinates: [30.7080, 76.7860],
      address: 'Sector 32, Chandigarh',
      isOpen: true,
      statusText: 'Open 24/7 • High Oxygen Surge Bed Capacity',
      contactNumber: '+91 172 2601023',
      totalBeds: 950,
      availableBeds: 180,
      icuBeds: 48,
      oxygenStockCylinders: 650
    },
    {
      id: 'CHD-HOSP-03',
      name: 'Government Multi-Specialty Hospital (GMSH 16)',
      type: 'hospital',
      coordinates: [30.7490, 76.7840],
      address: 'Sector 16, Chandigarh',
      isOpen: true,
      statusText: 'Open 24/7 • Rapid Triage & Emergency Trauma',
      contactNumber: '+91 172 2768201',
      totalBeds: 500,
      availableBeds: 95,
      icuBeds: 28,
      oxygenStockCylinders: 400
    },
    {
      id: 'CHD-DISP-01',
      name: 'Civil Dispensary Sector 22',
      type: 'dispensary',
      coordinates: [30.7320, 76.7720],
      address: 'Sector 22-B, Chandigarh',
      isOpen: true,
      statusText: 'Open 08:00 - 20:00 • Fever Medicine Depot',
      contactNumber: '+91 172 2701192',
      dailyTestingCapacity: 400,
      currentWaitTimeMin: 8
    },
    {
      id: 'CHD-DISP-02',
      name: 'Civil Dispensary Sector 35',
      type: 'dispensary',
      coordinates: [30.7220, 76.7640],
      address: 'Sector 35-C, Chandigarh',
      isOpen: true,
      statusText: 'Open 08:00 - 20:00 • Isolation Care Kits',
      contactNumber: '+91 172 2604432',
      dailyTestingCapacity: 350,
      currentWaitTimeMin: 12
    },
    {
      id: 'CHD-TEST-01',
      name: 'Sector 17 Plaza Mega Diagnostic & RT-PCR Hub',
      type: 'testing_booth',
      coordinates: [30.7398, 76.7827],
      address: 'Sector 17 Central Plaza, Chandigarh',
      isOpen: true,
      statusText: 'Open 24/7 • High-Throughput Robotic Testing',
      dailyTestingCapacity: 1500,
      currentWaitTimeMin: 6
    },
    {
      id: 'CHD-OXY-01',
      name: 'Chandigarh UT Central Liquid Oxygen Depot',
      type: 'oxygen_depot',
      coordinates: [30.7080, 76.7980],
      address: 'Industrial Area Phase 1, Chandigarh',
      isOpen: true,
      statusText: 'Operational 24/7 • 25,000L Cryogenic Reserve',
      contactNumber: '+91 172 2650099',
      oxygenStockCylinders: 2200
    }
  ]
};

// 3-4 RED & YELLOW AFFECTED PANDEMIC ZONES PER CITY
export const PANDEMIC_ZONES_DATABASE: Record<string, PandemicAffectedZone[]> = {
  'patiala': [
    {
      id: 'PTA-ZONE-RED-1',
      name: 'Tripuri High-Transmission Red Zone',
      severity: 'red',
      coordinates: [30.3610, 76.3940],
      radiusMeters: 450,
      positivityRatePct: 22.4,
      activeCases: 142,
      statusText: '🔴 Severe Outbreak • Complete Containment',
      restrictionsDescription: 'All non-essential movement prohibited. Drone surveillance and doorstep essential supply distribution active.'
    },
    {
      id: 'PTA-ZONE-RED-2',
      name: 'Anardana Chowk Old City Cluster',
      severity: 'red',
      coordinates: [30.3240, 76.4020],
      radiusMeters: 380,
      positivityRatePct: 19.8,
      activeCases: 118,
      statusText: '🔴 Severe Outbreak • Micro-Containment',
      restrictionsDescription: 'Narrow market alleys barricaded. Intensive contact tracing & door-to-door temperature screening in effect.'
    },
    {
      id: 'PTA-ZONE-AMBER-1',
      name: 'Leela Bhawan Commercial Buffer Zone',
      severity: 'amber',
      coordinates: [30.3420, 76.3880],
      radiusMeters: 420,
      positivityRatePct: 9.6,
      activeCases: 54,
      statusText: '🟡 Moderate Risk • Enhanced Surveillance',
      restrictionsDescription: 'Commercial shops restricted to 50% capacity with mandatory thermal scanning. Night curfew enforced from 20:00.'
    },
    {
      id: 'PTA-ZONE-AMBER-2',
      name: 'Model Town South Surveillance Sector',
      severity: 'amber',
      coordinates: [30.3510, 76.3780],
      radiusMeters: 360,
      positivityRatePct: 7.8,
      activeCases: 41,
      statusText: '🟡 Moderate Risk • Active Monitoring',
      restrictionsDescription: 'Public parks and gathering areas closed. Random mobile RT-PCR sampling deployed.'
    }
  ],

  'chandigarh': [
    {
      id: 'CHD-ZONE-RED-1',
      name: 'Bapu Dham Colony Red Containment Cluster',
      severity: 'red',
      coordinates: [30.7200, 76.8040],
      radiusMeters: 480,
      positivityRatePct: 24.2,
      activeCases: 186,
      statusText: '🔴 Severe Outbreak • Hard Quarantine',
      restrictionsDescription: 'Perimeter sealed with barricades. Police checkpoints at all egress points.'
    },
    {
      id: 'CHD-ZONE-RED-2',
      name: 'Sector 26 Grain & Timber Market Red Hub',
      severity: 'red',
      coordinates: [30.7290, 76.7990],
      radiusMeters: 400,
      positivityRatePct: 20.5,
      activeCases: 124,
      statusText: '🔴 Severe Outbreak • Market Closure',
      restrictionsDescription: 'Wholesale mandi operations suspended. Sanitization trucks operating continuously.'
    },
    {
      id: 'CHD-ZONE-AMBER-1',
      name: 'Sector 22-C Commercial Buffer Perimeter',
      severity: 'amber',
      coordinates: [30.7340, 76.7740],
      radiusMeters: 420,
      positivityRatePct: 10.2,
      activeCases: 62,
      statusText: '🟡 Moderate Risk • Active Surveillance',
      restrictionsDescription: 'Shops open on odd-even basis. Mandatory double-masking enforced in shopping corridors.'
    },
    {
      id: 'CHD-ZONE-AMBER-2',
      name: 'Hallomajra South Surveillance Zone',
      severity: 'amber',
      coordinates: [30.6960, 76.7920],
      radiusMeters: 380,
      positivityRatePct: 8.4,
      activeCases: 48,
      statusText: '🟡 Moderate Risk • Contact Tracing',
      restrictionsDescription: 'Community health workers conducting fever survey across all residential blocks.'
    }
  ]
};

// RESTRICTED ROADS / ROADBLOCK POLYLINES
export const PANDEMIC_RESTRICTED_ROADS_DATABASE: Record<string, PandemicRoadRestriction[]> = {
  'patiala': [
    {
      id: 'PTA-ROAD-1',
      name: 'Tripuri Main Commercial Corridor (Barricaded)',
      severity: 'closed',
      coordinates: [
        [30.3580, 76.3880],
        [30.3610, 76.3940],
        [30.3640, 76.3990]
      ],
      statusText: '⛔ Completely Closed to Vehicular Traffic',
      reason: 'Crosses Tripuri Red Containment Zone. Emergency and medical supply vehicles only.'
    },
    {
      id: 'PTA-ROAD-2',
      name: 'Lahori Gate to Anardana Chowk Inner Ring',
      severity: 'closed',
      coordinates: [
        [30.3270, 76.3980],
        [30.3240, 76.4020],
        [30.3210, 76.4060]
      ],
      statusText: '⛔ Sealed Checkpoint Corridor',
      reason: 'High density transmission buffer. Non-residents redirected via Sanauri Bypass.'
    },
    {
      id: 'PTA-ROAD-3',
      name: 'Leela Bhawan to YPS Screening Arterial',
      severity: 'screened_entry',
      coordinates: [
        [30.3420, 76.3880],
        [30.3440, 76.3920],
        [30.3460, 76.3960]
      ],
      statusText: '⚠️ Mandatory Health & Pass Checkpoint',
      reason: 'Amber Zone buffer. Thermal screening checkpoint causing traffic slowdowns.'
    }
  ],

  'chandigarh': [
    {
      id: 'CHD-ROAD-1',
      name: 'Madhya Marg Sector 26 Cordon (Barricaded)',
      severity: 'closed',
      coordinates: [
        [30.7270, 76.7920],
        [30.7290, 76.7990],
        [30.7310, 76.8080]
      ],
      statusText: '⛔ Sealed Containment Arterial',
      reason: 'Perimeter of Bapu Dham & Sector 26 Red Zones. Diverted via Purv Marg.'
    },
    {
      id: 'CHD-ROAD-2',
      name: 'Himalaya Marg Sector 22 Crossing (Screened)',
      severity: 'screened_entry',
      coordinates: [
        [30.7310, 76.7700],
        [30.7340, 76.7740],
        [30.7380, 76.7790]
      ],
      statusText: '⚠️ Police & Health Checkpoint',
      reason: 'Amber buffer zone entry screening. Only essential worker vehicles allowed.'
    }
  ]
};

// Generic Fallback Zone Generator for any city
export function getPandemicZonesForCity(cityId: string, lat: number, lng: number, cityName: string): PandemicAffectedZone[] {
  if (PANDEMIC_ZONES_DATABASE[cityId]) {
    return PANDEMIC_ZONES_DATABASE[cityId];
  }

  return [
    {
      id: `${cityId}-ZONE-RED-1`,
      name: `${cityName} North High-Transmission Red Zone`,
      severity: 'red',
      coordinates: [lat + 0.015, lng - 0.012],
      radiusMeters: 450,
      positivityRatePct: 23.5,
      activeCases: 165,
      statusText: '🔴 Severe Outbreak • Complete Containment',
      restrictionsDescription: 'Perimeter sealed with barricades. Doorstep essential delivery only.'
    },
    {
      id: `${cityId}-ZONE-RED-2`,
      name: `${cityName} Old Town Commercial Red Cluster`,
      severity: 'red',
      coordinates: [lat - 0.012, lng + 0.015],
      radiusMeters: 400,
      positivityRatePct: 19.2,
      activeCases: 130,
      statusText: '🔴 Severe Outbreak • Micro-Containment',
      restrictionsDescription: 'High density neighborhood under strict movement prohibition.'
    },
    {
      id: `${cityId}-ZONE-AMBER-1`,
      name: `${cityName} Central Business Buffer Zone`,
      severity: 'amber',
      coordinates: [lat + 0.008, lng + 0.010],
      radiusMeters: 420,
      positivityRatePct: 10.4,
      activeCases: 68,
      statusText: '🟡 Moderate Risk • Enhanced Surveillance',
      restrictionsDescription: 'Offices restricted to 50% capacity. Mandatory screening checkpoints.'
    },
    {
      id: `${cityId}-ZONE-AMBER-2`,
      name: `${cityName} Transit Corridor Surveillance Area`,
      severity: 'amber',
      coordinates: [lat - 0.018, lng - 0.010],
      radiusMeters: 380,
      positivityRatePct: 8.1,
      activeCases: 44,
      statusText: '🟡 Moderate Risk • Active Monitoring',
      restrictionsDescription: 'Random rapid testing teams deployed at major intersections.'
    }
  ];
}

// Generic Fallback Road Restrictions Generator for any city
export function getPandemicRoadRestrictionsForCity(cityId: string, lat: number, lng: number, cityName: string): PandemicRoadRestriction[] {
  if (PANDEMIC_RESTRICTED_ROADS_DATABASE[cityId]) {
    return PANDEMIC_RESTRICTED_ROADS_DATABASE[cityId];
  }

  return [
    {
      id: `${cityId}-ROAD-1`,
      name: `${cityName} North Ring Arterial (Barricaded)`,
      severity: 'closed',
      coordinates: [
        [lat + 0.012, lng - 0.016],
        [lat + 0.015, lng - 0.012],
        [lat + 0.018, lng - 0.008]
      ],
      statusText: '⛔ Completely Closed to General Traffic',
      reason: `Traverses ${cityName} Red Zone. Emergency medical corridor only.`
    },
    {
      id: `${cityId}-ROAD-2`,
      name: `${cityName} Central Express Connector (Screened)`,
      severity: 'screened_entry',
      coordinates: [
        [lat + 0.004, lng + 0.006],
        [lat + 0.008, lng + 0.010],
        [lat + 0.012, lng + 0.014]
      ],
      statusText: '⚠️ Health & ID Screening Checkpoint',
      reason: 'Border of Amber Buffer Zone. Slow traffic due to vehicle sanitization.'
    }
  ];
}

// Fallback generator for facilities
export function getPandemicFacilitiesForCity(cityId: string, cityLat: number, cityLng: number, cityName: string): PandemicFacility[] {
  if (PANDEMIC_FACILITIES_DATABASE[cityId]) {
    return PANDEMIC_FACILITIES_DATABASE[cityId];
  }

  return [
    {
      id: `${cityId}-HOSP-01`,
      name: `${cityName} Apex Trauma & Pandemic Medical Center`,
      type: 'hospital',
      coordinates: [cityLat + 0.012, cityLng - 0.015],
      address: `Main Boulevard, Central District, ${cityName}`,
      isOpen: true,
      statusText: 'Open 24/7 • Dedicated Isolation & ICU Wing',
      totalBeds: 1100,
      availableBeds: 195,
      icuBeds: 45,
      oxygenStockCylinders: 850
    },
    {
      id: `${cityId}-HOSP-02`,
      name: `${cityName} Municipal General Hospital`,
      type: 'hospital',
      coordinates: [cityLat - 0.014, cityLng + 0.018],
      address: `Civic Center Road, ${cityName}`,
      isOpen: true,
      statusText: 'Open 24/7 • Rapid Triage Ward',
      totalBeds: 600,
      availableBeds: 110,
      icuBeds: 25,
      oxygenStockCylinders: 420
    },
    {
      id: `${cityId}-DISP-01`,
      name: `${cityName} Community Health Center & Dispensary North`,
      type: 'dispensary',
      coordinates: [cityLat + 0.022, cityLng + 0.008],
      address: `North Sector Market, ${cityName}`,
      isOpen: true,
      statusText: 'Open 08:00 - 20:00 • Free Fever Kits & Antibiotics',
      dailyTestingCapacity: 350,
      currentWaitTimeMin: 10
    },
    {
      id: `${cityId}-DISP-02`,
      name: `${cityName} Urban Primary Health Center South`,
      type: 'dispensary',
      coordinates: [cityLat - 0.020, cityLng - 0.012],
      address: `South Civic Lane, ${cityName}`,
      isOpen: true,
      statusText: 'Open 08:00 - 20:00 • Essential Medicine Supply',
      dailyTestingCapacity: 280,
      currentWaitTimeMin: 15
    },
    {
      id: `${cityId}-TEST-01`,
      name: `${cityName} Central Drive-Through RT-PCR Testing Kiosk`,
      type: 'testing_booth',
      coordinates: [cityLat + 0.005, cityLng + 0.006],
      address: `Central City Plaza, ${cityName}`,
      isOpen: true,
      statusText: 'Open 24/7 • Results within 6 Hours',
      dailyTestingCapacity: 1200,
      currentWaitTimeMin: 8
    },
    {
      id: `${cityId}-OXY-01`,
      name: `${cityName} Regional Emergency Medical Oxygen Terminal`,
      type: 'oxygen_depot',
      coordinates: [cityLat - 0.008, cityLng - 0.022],
      address: `Logistics Substation Sector 4, ${cityName}`,
      isOpen: true,
      statusText: 'Operational 24/7 • Cryogenic Liquid Reserve',
      oxygenStockCylinders: 1500
    }
  ];
}
