import { PandemicFacility } from '../types/pandemic';

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
    },
    {
      id: 'PTA-ZONE-01',
      name: 'Tripuri High-Transmission Red Zone',
      type: 'containment_zone',
      coordinates: [30.3600, 76.3950],
      address: 'Tripuri Ward 14-18, Patiala',
      isOpen: false,
      statusText: 'Active Containment • Strict Ingress/Egress Checks',
      quarantineRadiusMeters: 450
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
      id: 'CHD-DISP-03',
      name: 'Health & Wellness Centre Sector 44',
      type: 'dispensary',
      coordinates: [30.7060, 76.7550],
      address: 'Sector 44-D, Chandigarh',
      isOpen: true,
      statusText: 'Open 08:00 - 18:00 • Rapid Screening Clinic',
      dailyTestingCapacity: 200,
      currentWaitTimeMin: 5
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
      id: 'CHD-TEST-02',
      name: 'Sukhna Lake Drive-Through Testing Station',
      type: 'testing_booth',
      coordinates: [30.7420, 76.8180],
      address: 'Sukhna Lake Parking Lot, Chandigarh',
      isOpen: true,
      statusText: 'Open 07:00 - 21:00 • No-Contact Swab Collection',
      dailyTestingCapacity: 900,
      currentWaitTimeMin: 10
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
    },
    {
      id: 'CHD-ZONE-01',
      name: 'Bapu Dham Micro-Containment Perimeter',
      type: 'containment_zone',
      coordinates: [30.7200, 76.8040],
      address: 'Sector 26 Extension, Chandigarh',
      isOpen: false,
      statusText: 'Active Containment • Surveillance Drones Deployed',
      quarantineRadiusMeters: 500
    }
  ]
};

// Fallback generator for other cities
export function getPandemicFacilitiesForCity(cityId: string, cityLat: number, cityLng: number, cityName: string): PandemicFacility[] {
  if (PANDEMIC_FACILITIES_DATABASE[cityId]) {
    return PANDEMIC_FACILITIES_DATABASE[cityId];
  }

  // Generate tailored facilities around center coordinates
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
    },
    {
      id: `${cityId}-ZONE-01`,
      name: `${cityName} High-Transmission Quarantine Sector`,
      type: 'containment_zone',
      coordinates: [cityLat + 0.018, cityLng - 0.025],
      address: `Sector 9 Perimeter, ${cityName}`,
      isOpen: false,
      statusText: 'Active Containment • Rapid Antigen Surveillance',
      quarantineRadiusMeters: 400
    }
  ];
}
