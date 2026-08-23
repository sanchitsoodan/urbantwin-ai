import { 
  SectorId, 
  ImpactStatusLevel, 
  SectorImpact, 
  PandemicWhatIfParams, 
  WhatIfSimulationResult,
  PandemicTimelinePoint
} from '../types/pandemic';

export const DEFAULT_PANDEMIC_WHAT_IF: PandemicWhatIfParams = {
  gatheringRestrictions: 50,
  remoteWorkAdoptionPct: 50,
  travelRestrictions: 50,
  healthcareCapacity: 50,
  publicCompliance: 50
};

export function getImpactStatus(score: number): ImpactStatusLevel {
  if (score < 25) return 'LOW';
  if (score < 50) return 'MODERATE';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
}

export function getStatusColor(status: ImpactStatusLevel) {
  switch (status) {
    case 'LOW':
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      };
    case 'MODERATE':
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-900 border-amber-300'
      };
    case 'HIGH':
      return {
        text: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-900 border-rose-300'
      };
    case 'CRITICAL':
      return {
        text: 'text-red-900',
        bg: 'bg-red-50',
        border: 'border-red-400',
        badge: 'bg-red-200 text-red-950 border-red-500 font-extrabold animate-pulse'
      };
  }
}

// Generates dynamic 1-line explanations per sector and phase
export function getSectorExplanation(id: SectorId, day: number, isRecovery: boolean, score: number): string {
  if (isRecovery) {
    switch (id) {
      case 'healthcare':
        return day > 270
          ? 'Healthcare capacity normalized with routine clinical services fully restored.'
          : 'Hospital triage pressure steadily easing; ICU occupancy dropping below surge thresholds.';
      case 'economy':
        return day > 270
          ? 'Economic activity and consumer spending rebounding near pre-pandemic baseline.'
          : 'Business activity recovering through phased reopening and consumer footfall return.';
      case 'transportation':
        return day > 270
          ? 'Transit systems, commuter rail, and domestic flights operating at full frequency.'
          : 'Public mobility restrictions lifted; transit ridership recovering progressively.';
      case 'workforce':
        return day > 270
          ? 'Productivity stabilized with mature hybrid work models and full employment recovery.'
          : 'Workforce absenteeism declining as employees return to normal workplace operations.';
      case 'supply_chain':
        return day > 270
          ? 'Distribution freight corridors and inventory turnaround times completely cleared.'
          : 'Logistics bottlenecks clearing as warehouse capacity and freight transit normalize.';
      case 'society':
        return day > 270
          ? 'Civic and cultural community events operating with baseline public participation.'
          : 'Gathering limits relaxed; educational and recreational venues resuming operations.';
      case 'environment':
        return day > 270
          ? 'Urban emissions rebounding toward normal industrial and vehicular baselines.'
          : 'Industrial and transport emissions gradually returning as mobility resumes.';
    }
  }

  // Pandemic Progression Phase (Day 0 - 90)
  if (day <= 15) {
    switch (id) {
      case 'healthcare': return 'Initial viral case emergence; early diagnostic and clinic intake monitoring.';
      case 'economy': return 'Minor market uncertainty; early baseline commerce intact.';
      case 'transportation': return 'Normal commuter mobility with early voluntary ridership caution.';
      case 'workforce': return 'Workplace operations normal with emerging telework discussions.';
      case 'supply_chain': return 'Standard inventory buffers absorb early regional shipping delays.';
      case 'society': return 'Baseline social interactions with advisory health notices.';
      case 'environment': return 'Standard seasonal urban emission and energy usage levels.';
    }
  }

  if (day <= 45) {
    switch (id) {
      case 'healthcare': return 'Increased healthcare demand and emergency triage capacity pressure.';
      case 'economy': return 'Targeted sector slowdowns and discretionary consumer spending pullback.';
      case 'transportation': return 'Mobility restrictions and reduced public transit frequency enacted.';
      case 'workforce': return 'Rapid remote work migration alongside early employee absenteeism.';
      case 'supply_chain': return 'Inter-state shipping delays and inventory restocking friction.';
      case 'society': return 'Large public gathering bans and community event postponements.';
      case 'environment': return 'Mild vehicular emission reduction from reduced traffic volume.';
    }
  }

  if (day <= 75) {
    switch (id) {
      case 'healthcare': return 'Acute hospital bed strain and medical workforce fatigue in high-density areas.';
      case 'economy': return 'Severe retail and hospitality revenue contraction with operational freezes.';
      case 'transportation': return 'Arterial transit restrictions and cross-border mobility controls.';
      case 'workforce': return 'Elevated workforce disruptions across manufacturing and on-site roles.';
      case 'supply_chain': return 'Distribution bottlenecks and localized essential goods delivery delays.';
      case 'society': return 'Strict gathering limitations and civic closure policies in effect.';
      case 'environment': return 'Noticeable dip in urban air particulate and nitrogen dioxide emissions.';
    }
  }

  // Day 76 - 90 (Peak Period)
  switch (id) {
    case 'healthcare': return 'Maximum ICU utilization and intensive medical resource rationing requirements.';
    case 'economy': return 'Severe business disruption, high unemployment pressure, and consumer freeze.';
    case 'transportation': return 'Severe travel restrictions and minimum emergency transit schedules only.';
    case 'workforce': return 'Extensive absenteeism and peak remote-work productivity reallocation.';
    case 'supply_chain': return 'Critical freight backlogs and inventory depletion across distribution hubs.';
    case 'society': return 'Maximum gathering restrictions and widespread community social distancing.';
    case 'environment': return 'Significant temporary emission reductions due to suppressed industrial activity.';
  }
}

// Calculate raw curve value at day t (0 to 365)
function getTimelineCurveValue(day: number, peakDay = 85): number {
  if (day <= 90) {
    // Sigmoid growth up to peak
    const t = day / 90;
    // S-curve progression
    const val = 1 / (1 + Math.exp(-6 * (t - 0.5)));
    return Math.max(0.1, Math.min(1.0, val));
  } else {
    // Exponential decay recovery from Day 90 to 365
    const recDay = day - 90;
    const decay = Math.exp(-recDay / 70); // drops to ~0.15 by day 365
    return Math.max(0.12, decay);
  }
}

export function calculateSectorImpacts(
  day: number, 
  params: PandemicWhatIfParams = DEFAULT_PANDEMIC_WHAT_IF
): {
  sectors: Record<SectorId, SectorImpact>;
  averageImpactScore: number;
  averageImpactStatus: ImpactStatusLevel;
  isRecoveryMode: boolean;
  recoveryStage: 'EARLY RECOVERY' | 'MID RECOVERY' | 'FULL RESILIENCE' | 'PANDEMIC PHASE';
} {
  const isRecoveryMode = day > 90;
  const curve = getTimelineCurveValue(day);

  // Parameter mitigation calculations (0 to 1 scaling, baseline is 0.5)
  const gShift = (params.gatheringRestrictions - 50) / 100; // -0.5 to +0.5
  const rwShift = (params.remoteWorkAdoptionPct - 50) / 100;
  const trShift = (params.travelRestrictions - 50) / 100;
  const hcShift = (params.healthcareCapacity - 50) / 100;
  const pcFactor = 0.7 + (params.publicCompliance / 100) * 0.6; // 0.7 to 1.3 compliance multiplier

  // Base raw scores at peak (scale 0-100)
  // 1. Healthcare: High peak (88), mitigated heavily by health capacity & gathering limits
  let hcRaw = 15 + curve * 73;
  hcRaw -= (hcShift * 26 + gShift * 16 + trShift * 10) * pcFactor;
  const hcScore = Math.max(10, Math.min(99, Math.round(hcRaw)));

  // 2. Economy: Peak (80). Gathering restrictions increase economic drag, but remote work softens it
  let econRaw = 10 + curve * 70;
  econRaw += (gShift * 14 + trShift * 12 - rwShift * 18) * (1 / pcFactor);
  const econScore = Math.max(8, Math.min(98, Math.round(econRaw)));

  // 3. Transportation: Peak (74). Directly reduced by remote work & travel restrictions
  let transRaw = 12 + curve * 62;
  transRaw += (trShift * 18 + gShift * 10 - rwShift * 8);
  const transScore = Math.max(8, Math.min(95, Math.round(transRaw)));

  // 4. Workforce: Peak (72). Reduced significantly by remote work adoption
  let workRaw = 8 + curve * 64;
  workRaw -= (rwShift * 28 + hcShift * 8) * pcFactor;
  const workScore = Math.max(7, Math.min(96, Math.round(workRaw)));

  // 5. Supply Chain: Peak (82). Strain alleviated by healthcare stability and travel balance
  let supplyRaw = 10 + curve * 72;
  supplyRaw -= (rwShift * 10 + hcShift * 12 - trShift * 14) * pcFactor;
  const supplyScore = Math.max(9, Math.min(98, Math.round(supplyRaw)));

  // 6. Society: Peak (76). Directly affected by gathering limits
  let socRaw = 10 + curve * 66;
  socRaw += (gShift * 20 + trShift * 12);
  const socScore = Math.max(8, Math.min(96, Math.round(socRaw)));

  // 7. Environment: Moves inversely (drop in activity lowers emissions, so lower impact score is better or represents reduced pollution pressure)
  let envRaw = 15 + curve * 30; // Max ~45
  envRaw -= (rwShift * 12 + trShift * 8);
  const envScore = Math.max(5, Math.min(60, Math.round(envRaw)));

  const sectorsList: SectorImpact[] = [
    {
      id: 'healthcare',
      name: 'Healthcare',
      score: hcScore,
      status: getImpactStatus(hcScore),
      explanation: getSectorExplanation('healthcare', day, isRecoveryMode, hcScore),
      baselineScore: 15,
      peakScore: 88
    },
    {
      id: 'economy',
      name: 'Economy',
      score: econScore,
      status: getImpactStatus(econScore),
      explanation: getSectorExplanation('economy', day, isRecoveryMode, econScore),
      baselineScore: 10,
      peakScore: 80
    },
    {
      id: 'transportation',
      name: 'Transportation',
      score: transScore,
      status: getImpactStatus(transScore),
      explanation: getSectorExplanation('transportation', day, isRecoveryMode, transScore),
      baselineScore: 12,
      peakScore: 74
    },
    {
      id: 'workforce',
      name: 'Workforce',
      score: workScore,
      status: getImpactStatus(workScore),
      explanation: getSectorExplanation('workforce', day, isRecoveryMode, workScore),
      baselineScore: 8,
      peakScore: 72
    },
    {
      id: 'supply_chain',
      name: 'Supply Chain',
      score: supplyScore,
      status: getImpactStatus(supplyScore),
      explanation: getSectorExplanation('supply_chain', day, isRecoveryMode, supplyScore),
      baselineScore: 10,
      peakScore: 82
    },
    {
      id: 'society',
      name: 'Society',
      score: socScore,
      status: getImpactStatus(socScore),
      explanation: getSectorExplanation('society', day, isRecoveryMode, socScore),
      baselineScore: 10,
      peakScore: 76
    },
    {
      id: 'environment',
      name: 'Environment',
      score: envScore,
      status: getImpactStatus(envScore),
      explanation: getSectorExplanation('environment', day, isRecoveryMode, envScore),
      baselineScore: 15,
      peakScore: 45
    }
  ];

  // Average Impact Score: Exactly the average of the 7 primary sectors (Impact Score card is not included in its own average)
  const sumScores = sectorsList.reduce((acc, s) => acc + s.score, 0);
  const averageImpactScore = Math.round(sumScores / sectorsList.length);
  const averageImpactStatus = getImpactStatus(averageImpactScore);

  const record: Record<SectorId, SectorImpact> = {
    healthcare: sectorsList[0],
    economy: sectorsList[1],
    transportation: sectorsList[2],
    workforce: sectorsList[3],
    supply_chain: sectorsList[4],
    society: sectorsList[5],
    environment: sectorsList[6]
  };

  let recoveryStage: 'EARLY RECOVERY' | 'MID RECOVERY' | 'FULL RESILIENCE' | 'PANDEMIC PHASE' = 'PANDEMIC PHASE';
  if (day > 90 && day <= 150) recoveryStage = 'EARLY RECOVERY';
  else if (day > 150 && day <= 270) recoveryStage = 'MID RECOVERY';
  else if (day > 270) recoveryStage = 'FULL RESILIENCE';

  return {
    sectors: record,
    averageImpactScore,
    averageImpactStatus,
    isRecoveryMode,
    recoveryStage
  };
}

// Generate the 365-Day Timeline Curve data for the Recharts line chart
export function generatePandemicTimelinePoints(params: PandemicWhatIfParams = DEFAULT_PANDEMIC_WHAT_IF): PandemicTimelinePoint[] {
  const points: PandemicTimelinePoint[] = [];
  const sampleDays = [0, 15, 30, 45, 60, 75, 90, 120, 150, 180, 240, 300, 365];

  for (const day of sampleDays) {
    const res = calculateSectorImpacts(day, params);
    let phase: 'Pandemic Period' | 'Peak Crisis' | 'Recovery Stage' = 'Pandemic Period';
    if (day >= 75 && day <= 95) phase = 'Peak Crisis';
    else if (day > 95) phase = 'Recovery Stage';

    points.push({
      day,
      phase,
      averageImpact: res.averageImpactScore,
      healthcare: res.sectors.healthcare.score,
      economy: res.sectors.economy.score,
      transportation: res.sectors.transportation.score,
      workforce: res.sectors.workforce.score,
      supply_chain: res.sectors.supply_chain.score,
      society: res.sectors.society.score,
      environment: res.sectors.environment.score
    });
  }

  return points;
}

// Compare default/baseline vs new scenario
export function compareWhatIfScenarios(
  day: number,
  baselineParams: PandemicWhatIfParams,
  scenarioParams: PandemicWhatIfParams
): WhatIfSimulationResult {
  const baseRes = calculateSectorImpacts(day, baselineParams);
  const scenRes = calculateSectorImpacts(day, scenarioParams);

  const sectorIds: SectorId[] = ['healthcare', 'economy', 'transportation', 'workforce', 'supply_chain', 'society', 'environment'];

  const sectors = sectorIds.map(id => {
    const prev = baseRes.sectors[id].score;
    const scen = scenRes.sectors[id].score;
    return {
      sectorId: id,
      name: baseRes.sectors[id].name,
      previous: prev,
      scenario: scen,
      delta: scen - prev
    };
  });

  return {
    beforeAvg: baseRes.averageImpactScore,
    afterAvg: scenRes.averageImpactScore,
    delta: scenRes.averageImpactScore - baseRes.averageImpactScore,
    sectors
  };
}
