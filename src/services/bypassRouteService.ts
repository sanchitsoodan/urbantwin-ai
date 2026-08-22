import { AIBypassRoute, CityProfile } from '../types/city';

export function generateCityBypassRoutes(city: CityProfile): AIBypassRoute[] {
  const [lat, lng] = city.coordinates;
  const off = 0.012;

  if (city.id === 'patiala') {
    return [
      {
        id: 'BYP-PTA-01',
        name: 'Rajpura Road Highway AI Bypass via Northern Ring',
        congestedRoadName: 'Rajpura-Patiala Inbound Highway (NH-7)',
        congestedCoordinates: [
          [30.3580, 76.4180],
          [30.3500, 76.4020],
          [30.3420, 76.3920]
        ],
        congestedSpeedKmh: 14,
        congestedDensityPct: 86,
        congestedTravelTimeMin: 25,
        proposedBypassCoordinates: [
          [30.3580, 76.4180],
          [30.3650, 76.3980],
          [30.3550, 76.3800],
          [30.3420, 76.3920]
        ],
        proposedSpeedKmh: 48,
        proposedDensityPct: 18,
        proposedTravelTimeMin: 10,
        timeSavedMin: 15,
        fuelSavedPct: 42,
        co2SavedKg: 140,
        active: true,
        strategyDescription: 'Diverts 60% of inbound highway freight traffic onto the wide Northern Ring road, bypassing the bottleneck.'
      },
      {
        id: 'BYP-PTA-02',
        name: 'Leela Bhawan Commercial Bypass via Bhupindra Corridor',
        congestedRoadName: 'Leela Bhawan & Mall Road Junction',
        congestedCoordinates: [
          [30.3420, 76.3780],
          [30.3365, 76.3840],
          [30.3310, 76.3950]
        ],
        congestedSpeedKmh: 16,
        congestedDensityPct: 82,
        congestedTravelTimeMin: 20,
        proposedBypassCoordinates: [
          [30.3420, 76.3780],
          [30.3460, 76.3860],
          [30.3380, 76.3960],
          [30.3310, 76.3950]
        ],
        proposedSpeedKmh: 44,
        proposedDensityPct: 22,
        proposedTravelTimeMin: 8,
        timeSavedMin: 12,
        fuelSavedPct: 36,
        co2SavedKg: 95,
        active: true,
        strategyDescription: 'Synchronizes green lights on Bhupindra Road to channel downtown commuters around market congestion.'
      }
    ];
  }

  if (city.id === 'chandigarh') {
    return [
      {
        id: 'BYP-CHD-01',
        name: 'Madhya Marg AI Low-Traffic Bypass via Dakshin Marg',
        congestedRoadName: 'Madhya Marg Central Arterial (Sector 26-28)',
        congestedCoordinates: [
          [30.7480, 76.7820],
          [30.7410, 76.7920],
          [30.7320, 76.8050]
        ],
        congestedSpeedKmh: 18,
        congestedDensityPct: 84,
        congestedTravelTimeMin: 28,
        proposedBypassCoordinates: [
          [30.7480, 76.7820],
          [30.7350, 76.7650],
          [30.7180, 76.7750],
          [30.7320, 76.8050]
        ],
        proposedSpeedKmh: 48,
        proposedDensityPct: 22,
        proposedTravelTimeMin: 12,
        timeSavedMin: 16,
        fuelSavedPct: 44,
        co2SavedKg: 180,
        active: true,
        strategyDescription: 'Reroutes through-traffic via synchronized Dakshin Marg green-wave signals, cutting bottleneck volume by 45%.'
      },
      {
        id: 'BYP-CHD-02',
        name: 'Himalaya Marg Alternate via Jan Marg Open Arterial',
        congestedRoadName: 'Himalaya Marg Sector 22 Market Choke Point',
        congestedCoordinates: [
          [30.7510, 76.7720],
          [30.7380, 76.7760],
          [30.7250, 76.7800]
        ],
        congestedSpeedKmh: 15,
        congestedDensityPct: 88,
        congestedTravelTimeMin: 22,
        proposedBypassCoordinates: [
          [30.7510, 76.7720],
          [30.7450, 76.7850],
          [30.7350, 76.7920],
          [30.7250, 76.7800]
        ],
        proposedSpeedKmh: 44,
        proposedDensityPct: 20,
        proposedTravelTimeMin: 9,
        timeSavedMin: 13,
        fuelSavedPct: 38,
        co2SavedKg: 110,
        active: true,
        strategyDescription: 'Activates Variable Message Signs (VMS) 1.5 km before Sector 22 to redirect vehicles onto wide Jan Marg.'
      }
    ];
  }

  // Default generic realistic bypass routes for other cities (Delhi, Mumbai, London, NYC, Bengaluru)
  return [
    {
      id: `BYP-${city.id.toUpperCase()}-01`,
      name: `${city.name} Central Expressway AI Bypass Route`,
      congestedRoadName: `${city.name} Main Commercial Corridor`,
      congestedCoordinates: [
        [lat - off * 0.8, lng - off * 0.8],
        [lat, lng],
        [lat + off * 0.8, lng + off * 0.8]
      ],
      congestedSpeedKmh: 16,
      congestedDensityPct: 85,
      congestedTravelTimeMin: 29,
      proposedBypassCoordinates: [
        [lat - off * 0.8, lng - off * 0.8],
        [lat - off * 0.4, lng + off * 0.9],
        [lat + off * 0.4, lng + off * 0.9],
        [lat + off * 0.8, lng + off * 0.8]
      ],
      proposedSpeedKmh: 46,
      proposedDensityPct: 24,
      proposedTravelTimeMin: 13,
      timeSavedMin: 16,
      fuelSavedPct: 40,
      co2SavedKg: 160,
      active: true,
      strategyDescription: `Diverts transit volume onto the free-flowing outer ring corridor with synchronized smart signal cycle splits.`
    },
    {
      id: `BYP-${city.id.toUpperCase()}-02`,
      name: `${city.name} Secondary Arterial Detour`,
      congestedRoadName: `${city.name} Downtown Avenue`,
      congestedCoordinates: [
        [lat + off * 0.6, lng - off * 0.5],
        [lat - off * 0.2, lng - off * 0.2]
      ],
      congestedSpeedKmh: 19,
      congestedDensityPct: 79,
      congestedTravelTimeMin: 21,
      proposedBypassCoordinates: [
        [lat + off * 0.6, lng - off * 0.5],
        [lat + off * 0.2, lng - off * 0.8],
        [lat - off * 0.2, lng - off * 0.2]
      ],
      proposedSpeedKmh: 45,
      proposedDensityPct: 21,
      proposedTravelTimeMin: 10,
      timeSavedMin: 11,
      fuelSavedPct: 32,
      co2SavedKg: 90,
      active: true,
      strategyDescription: 'Reallocates counter-flow lane capacity to alleviate peak-hour directional commuter bottlenecks.'
    }
  ];
}
