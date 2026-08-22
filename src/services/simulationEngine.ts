import { 
  SimulationParams, 
  SimulationResults, 
  CityProfile, 
  AIActionItem, 
  ResourceSectorMetrics 
} from '../types/city';

export function runCitySimulation(
  params: SimulationParams, 
  city: CityProfile
): SimulationResults {
  // -------------------------------------------------------------
  // MODULE 1: TRAFFIC & ROAD DISRUPTION SIMULATOR
  // -------------------------------------------------------------
  const baseTravelTime = Math.round(35 - (city.baselineSpeedKmh * 0.4));
  const baseCongestion = city.baselineCongestionPct;
  const baseEmergencyEta = city.baselineAmbulanceEtaMin;
  const baseScore = city.baselineScore.overall;

  let travelDelayMinutes = 0;
  let congestionIncrease = 0;
  let emergencyDelayMinutes = 0;

  // A. Road Closure
  const closedOption = city.roadClosureOptions.find(o => o.value === params.roadClosure);
  if (closedOption && closedOption.value !== 'none') {
    travelDelayMinutes += (closedOption.blockedTravelMin - closedOption.normalTravelMin);
    congestionIncrease += 26;
    emergencyDelayMinutes += 5.8;
  }

  // B. Traffic Volume Surge Slider (Slider 1)
  const trafficFactor = params.trafficIncreasePct / 100;
  travelDelayMinutes += Math.round(trafficFactor * 16);
  congestionIncrease += Math.round(trafficFactor * 32);
  emergencyDelayMinutes += Number((trafficFactor * 4.2).toFixed(1));

  // C. Weather / Transit Disruption
  if (params.weather === 'heavy-rain') {
    travelDelayMinutes += 15;
    congestionIncrease += 24;
    emergencyDelayMinutes += 6.2;
  } else if (params.weather === 'bus-strike') {
    travelDelayMinutes += 11;
    congestionIncrease += 19;
    emergencyDelayMinutes += 3.5;
  }

  // Disrupted & AI Fixed for Module 1
  const afterTravelTime = Math.round(baseTravelTime + travelDelayMinutes);
  const afterCongestion = Math.min(98, Math.round(baseCongestion + congestionIncrease));
  const afterEmergencyEta = Number((baseEmergencyEta + emergencyDelayMinutes).toFixed(1));

  const aiMitigationFactor = 0.68;
  const aiTravelTime = Math.round(baseTravelTime + (travelDelayMinutes * (1 - aiMitigationFactor)));
  const aiCongestion = Math.max(25, Math.round(baseCongestion + (congestionIncrease * 0.32)));
  const aiEmergencyEta = Number((baseEmergencyEta + (emergencyDelayMinutes * 0.25)).toFixed(1));

  // -------------------------------------------------------------
  // MODULE 2: POPULATION SURGE & 5-SECTOR URBAN RESOURCE TWIN
  // -------------------------------------------------------------
  const popFactor = (params.populationIncreasePct || 0) / 100;

  // Sector 1: Economy Loss ($k/day)
  const baseEconLoss = Number((baseTravelTime * baseCongestion * 0.016).toFixed(1));
  const surgeEconLoss = Number((baseEconLoss * (1 + popFactor * 2.2) + (popFactor * 45)).toFixed(1));
  const aiEconLoss = Number((baseEconLoss * (1 + popFactor * 0.6) + (popFactor * 12)).toFixed(1));

  // Sector 2: Traffic Road Load (%)
  const baseTrafficLoad = city.baselineCongestionPct;
  const surgeTrafficLoad = Math.min(100, Math.round(baseTrafficLoad + (popFactor * 42)));
  const aiTrafficLoad = Math.max(25, Math.round(baseTrafficLoad + (popFactor * 12)));

  // Sector 3: Water Demand (Million Liters per Day - MLD)
  const baseWater = city.baselineWaterMld || 450;
  const surgeWater = Math.round(baseWater * (1 + popFactor * 0.85));
  const aiWater = Math.round(baseWater * (1 + popFactor * 0.28)); // Smart pressure reduction & leak control

  // Sector 4: Energy Grid Load (Megawatt Hours per Day - MWh)
  const baseEnergy = city.baselineEnergyMwh || 1800;
  const surgeEnergy = Math.round(baseEnergy * (1 + popFactor * 0.95));
  const aiEnergy = Math.round(baseEnergy * (1 + popFactor * 0.35)); // Dynamic battery storage & peak shaving

  // Sector 5: Municipal Waste Generated (Tons per Day)
  const baseWaste = city.baselineWasteTons || 620;
  const surgeWaste = Math.round(baseWaste * (1 + popFactor * 0.8));
  const aiWaste = Math.round(baseWaste * (1 + popFactor * 0.3)); // Route optimization & compaction dispatch

  const popBaseline: ResourceSectorMetrics = {
    economyLossKUsd: baseEconLoss,
    trafficLoadPct: baseTrafficLoad,
    waterDemandMld: baseWater,
    energyLoadMwh: baseEnergy,
    wasteGeneratedTons: baseWaste
  };

  const popSurged: ResourceSectorMetrics = {
    economyLossKUsd: surgeEconLoss,
    trafficLoadPct: surgeTrafficLoad,
    waterDemandMld: surgeWater,
    energyLoadMwh: surgeEnergy,
    wasteGeneratedTons: surgeWaste
  };

  const popAIFixed: ResourceSectorMetrics = {
    economyLossKUsd: aiEconLoss,
    trafficLoadPct: aiTrafficLoad,
    waterDemandMld: aiWater,
    energyLoadMwh: aiEnergy,
    wasteGeneratedTons: aiWaste
  };

  // -------------------------------------------------------------
  // DYNAMIC TAILORED LOGICAL SOLUTIONS PER SITUATION
  // -------------------------------------------------------------
  const tailoredSolutions: AIActionItem[] = [];

  // Situation A: Road Closure
  if (closedOption && closedOption.value !== 'none') {
    tailoredSolutions.push({
      id: 'SOL-ROAD-1',
      title: `Activate Dynamic Diversion to ${closedOption.detourRoadName || 'Parallel Arterials'}`,
      description: `Reroute commuter streams via electronic VMS signs and navigation telemetry around ${closedOption.label}.`,
      category: 'reroute',
      estimatedTimeSec: 8,
      benefit: `Bypasses bottleneck, saving ~${closedOption.blockedTravelMin - closedOption.detourTravelMin} min delay`,
      active: true
    });
    tailoredSolutions.push({
      id: 'SOL-ROAD-2',
      title: 'Extend Green Signal Cycles on Relief Corridors',
      description: 'Add +24s green time per cycle on intersecting feeder junctions to prevent queue spillovers.',
      category: 'signal',
      estimatedTimeSec: 12,
      benefit: 'Increases bypass throughput by +35%',
      active: true
    });
  }

  // Situation B: Heavy Monsoon Rain / Flood
  if (params.weather === 'heavy-rain') {
    tailoredSolutions.push({
      id: 'SOL-RAIN-1',
      title: 'Trigger Automated Stormwater Sump Pump Stations',
      description: 'Activate 4 industrial sump pumps (12,000 L/min capacity) across low-lying underpasses.',
      category: 'water',
      estimatedTimeSec: 10,
      benefit: 'Drains waterlogged lanes in under 15 minutes',
      active: true
    });
    tailoredSolutions.push({
      id: 'SOL-RAIN-2',
      title: 'Barricade Inundated Underpasses & Route to Elevated Flyovers',
      description: 'Close flooded low-lying ramps and divert vehicles to elevated viaduct networks.',
      category: 'reroute',
      estimatedTimeSec: 14,
      benefit: 'Prevents vehicle stalling and water ingress',
      active: true
    });
  }

  // Situation C: Transit Strike
  if (params.weather === 'bus-strike') {
    tailoredSolutions.push({
      id: 'SOL-STRIKE-1',
      title: 'Deploy High-Occupancy & Shared Carpool Express Lanes',
      description: 'Convert dedicated bus lanes into dynamic high-occupancy 3+ vehicle corridors.',
      category: 'lane',
      estimatedTimeSec: 6,
      benefit: 'Moves 2.4x more commuters per lane',
      active: true
    });
    tailoredSolutions.push({
      id: 'SOL-STRIKE-2',
      title: 'Geo-Rebalance Shared Micro-Mobility & Ride-Hail Fleets',
      description: 'Dispatch 500 electric shuttles to primary metro hubs with signal preemption.',
      category: 'transit',
      estimatedTimeSec: 15,
      benefit: 'Absorbs 40% of stranded transit demand',
      active: true
    });
  }

  // Situation D: Population Surge (>0%)
  if (params.populationIncreasePct > 0) {
    tailoredSolutions.push({
      id: 'SOL-POP-1',
      title: 'Smart Water Grid Pressure Balancing & Booster Pump Sync',
      description: `Automate dynamic zoning to deliver +${Math.round(popFactor * 35)}% water pressure to high-density zones while curbing leakage.`,
      category: 'water',
      estimatedTimeSec: 12,
      benefit: `Saves ${Math.round((surgeWater - aiWater))} MLD of excess water demand`,
      active: true
    });
    tailoredSolutions.push({
      id: 'SOL-POP-2',
      title: 'Substation Peak Shaving & Battery Storage Dispatch',
      description: 'Inject 45 MW from utility battery storage units to prevent power transformer overloads during peak surge.',
      category: 'energy',
      estimatedTimeSec: 5,
      benefit: `Saves ${Math.round((surgeEnergy - aiEnergy))} MWh grid strain`,
      active: true
    });
    tailoredSolutions.push({
      id: 'SOL-POP-3',
      title: 'Dynamic Waste Compactor Rerouting & Bin Fill Telemetry',
      description: 'Deploy automated garbage compactors directly to high-footfall event corridors.',
      category: 'waste',
      estimatedTimeSec: 20,
      benefit: `Handles ${Math.round((surgeWaste - aiWaste))} tons of surge waste cleanly`,
      active: true
    });
  }

  // Fallback Baseline Traffic Optimization if nothing selected
  if (tailoredSolutions.length === 0) {
    tailoredSolutions.push({
      id: 'SOL-BASE-1',
      title: 'Adaptive SCOOT/SCATS Traffic Signal Coordination',
      description: 'Synchronize 14 traffic controllers across primary arterial avenues to minimize vehicle stoppage.',
      category: 'signal',
      estimatedTimeSec: 8,
      benefit: 'Reduces commute delay by 24%',
      active: true
    });
    tailoredSolutions.push({
      id: 'SOL-BASE-2',
      title: 'Variable Speed Limit Harmonization',
      description: 'Broadcast optimal driving speeds on electronic overhead gantries to prevent stop-and-go shockwaves.',
      category: 'reroute',
      estimatedTimeSec: 10,
      benefit: 'Smooths traffic flow by +18%',
      active: true
    });
  }

  // Overall Financial & Score Impacts
  const economicSavingsUsd = Math.round((surgeEconLoss - aiEconLoss) * 1000 + (afterTravelTime - aiTravelTime) * 850);
  const dailyCo2SavedKg = Math.round((surgeWater - aiWater) * 12 + (afterTravelTime - aiTravelTime) * 340);

  const penalty = Math.min(45, Math.round((congestionIncrease * 0.4) + (travelDelayMinutes * 0.6) + (popFactor * 15)));
  const scoreAfter = Math.max(30, baseScore - penalty);
  const scoreOptimized = Math.min(96, Math.max(baseScore, baseScore - Math.round(penalty * 0.2) + 4));

  return {
    trafficSandbox: {
      before: { travelTimeMin: baseTravelTime, congestionPct: baseCongestion, emergencyEtaMin: baseEmergencyEta },
      after: { travelTimeMin: afterTravelTime, congestionPct: afterCongestion, emergencyEtaMin: afterEmergencyEta },
      aiOptimized: { travelTimeMin: aiTravelTime, congestionPct: aiCongestion, emergencyEtaMin: aiEmergencyEta }
    },
    populationSandbox: {
      baseline: popBaseline,
      surged: popSurged,
      aiOptimized: popAIFixed
    },
    before: {
      travelTimeMin: baseTravelTime,
      congestionPct: baseCongestion,
      emergencyEtaMin: baseEmergencyEta,
      economicLossKUsd: baseEconLoss,
      fuelWastedLiters: Math.round(baseTravelTime * baseCongestion * 4.2)
    },
    after: {
      travelTimeMin: afterTravelTime,
      congestionPct: afterCongestion,
      emergencyEtaMin: afterEmergencyEta,
      economicLossKUsd: surgeEconLoss,
      fuelWastedLiters: Math.round(afterTravelTime * afterCongestion * 9.8)
    },
    aiOptimized: {
      travelTimeMin: aiTravelTime,
      congestionPct: aiCongestion,
      emergencyEtaMin: aiEmergencyEta,
      economicLossKUsd: aiEconLoss,
      fuelWastedLiters: Math.round(aiTravelTime * aiCongestion * 5.1)
    },
    cityScoreImpact: {
      before: baseScore,
      after: scoreAfter,
      optimized: scoreOptimized
    },
    economicSavingsUsd,
    dailyCo2SavedKg,
    tailoredSolutions
  };
}
