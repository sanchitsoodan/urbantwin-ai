import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  Calendar, 
  SlidersHorizontal, 
  ArrowRight,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { 
  DEFAULT_PANDEMIC_WHAT_IF, 
  calculateSectorImpacts,
  getStatusColor 
} from '../../services/pandemicSimulationEngine';
import { 
  PandemicWhatIfParams, 
  WhatIfSimulationResult 
} from '../../types/pandemic';
import { SectorImpactCard } from '../pandemic/SectorImpactCard';
import { PandemicMap } from '../pandemic/PandemicMap';
import { PandemicTimelineController } from '../pandemic/PandemicTimelineController';
import { PandemicWhatIfController } from '../pandemic/PandemicWhatIfController';
import { RecoveryVisualisationChart } from '../pandemic/RecoveryVisualisationChart';
import { AIConfidenceMeter } from '../common/AIConfidenceMeter';

export const PandemicView: React.FC = () => {
  const { selectedCity, setActiveTab } = useCity();

  const [currentDay, setCurrentDay] = useState<number>(30);
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
  const [whatIfParams, setWhatIfParams] = useState<PandemicWhatIfParams>(DEFAULT_PANDEMIC_WHAT_IF);
  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>(null);

  // Compute live sector impacts from the current state
  const { 
    sectors, 
    averageImpactScore, 
    averageImpactStatus,
    recoveryStage 
  } = calculateSectorImpacts(currentDay, whatIfParams);

  const statusColors = getStatusColor(averageImpactStatus);

  const handleDayChange = (day: number) => {
    setCurrentDay(day);
    if (day > 90) {
      setIsRecoveryMode(true);
    } else {
      setIsRecoveryMode(false);
    }
  };

  const handleToggleRecoveryMode = (recovery: boolean) => {
    setIsRecoveryMode(recovery);
    if (recovery && currentDay < 90) {
      setCurrentDay(120);
    } else if (!recovery && currentDay > 90) {
      setCurrentDay(90);
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-6 space-y-6 pb-16">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              GLOBAL PANDEMIC SIMULATION
            </h1>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {selectedCity.name} {selectedCity.flag}
            </span>
            <AIConfidenceMeter score={96.8} label="Simulation Precision" variant="badge" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Simulate how a 90-day pandemic could affect a city across critical sectors.
          </p>

          {/* Scenario Indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700">
              <span className="font-bold text-slate-900">Scenario:</span> Global Pandemic
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700">
              <span className="font-bold text-slate-900">Duration:</span> 90 Days (Recovery to 365d)
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700">
              <span className="font-bold text-slate-900">Mode:</span> {isRecoveryMode ? 'Recovery Mode' : 'Simulation'}
            </span>
          </div>
        </div>

        {/* Action Button to Pricing / Plans */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('pricing')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition transform hover:scale-[1.02] cursor-pointer"
          >
            <span>View Plans & Licensing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PROMINENT MANDATORY DISCLAIMER BOX */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex items-center gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-bold">
          All figures are simulated estimates for scenario planning and are not real-world forecasts.
        </span>
      </div>

      {/* 2. PANDEMIC EMERGENCY MAP (HOSPITALS, DISPENSARIES, TESTING BOOTHS, OXYGEN, QUARANTINE ZONES) */}
      <PandemicMap />

      {/* 3. DEDICATED RECOVERY MODE BANNER (When Day > 90 or Recovery Mode Active) */}
      {isRecoveryMode ? (
        <div className="card-clean p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in-50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                POST-PANDEMIC RESTORATION
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-400">
                {recoveryStage}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              RECOVERY MODE
            </h2>
            <p className="text-xs text-slate-600 max-w-xl font-medium leading-relaxed">
              The pandemic period has ended. Explore how the city could recover over time as hospital pressures ease, economic activity reopens, and supply chains normalize.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => handleToggleRecoveryMode(false)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-extrabold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Day 0–90 Outbreak</span>
            </button>
          </div>
        </div>
      ) : (
        /* Quick Banner to jump into Recovery Mode */
        <div className="p-4 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <span className="text-base">🌅</span>
            <span>Looking for post-pandemic urban rebound?</span>
          </div>
          <button
            onClick={() => handleToggleRecoveryMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition cursor-pointer"
          >
            <span>Enter Recovery Mode (Day 90–365)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. LARGE AVERAGE IMPACT SCORE BANNER */}
      <div className={`p-6 sm:p-7 rounded-3xl ${statusColors.bg} border-2 ${statusColors.border} shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              COMPOSITE MACRO INDEX
            </span>
            {isRecoveryMode && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {recoveryStage}
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            AVERAGE IMPACT SCORE
          </h2>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Representing the arithmetic mean of 7 key sectors (Healthcare, Economy, Transportation, Workforce, Supply Chain, Society, and Environment).
          </p>
        </div>

        {/* Big Score Display */}
        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md p-4 px-6 rounded-3xl border-2 border-slate-200 shadow-sm shrink-0 self-start md:self-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900 tracking-tight">
                {averageImpactScore}
              </span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
              Current Day {currentDay} Score
            </span>
          </div>

          <div className="pl-4 border-l border-slate-200 flex flex-col justify-center">
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border text-center ${statusColors.badge}`}>
              {averageImpactStatus} IMPACT
            </span>
            <span className="text-[10px] text-slate-500 font-medium text-center mt-1">
              {currentDay <= 90 ? 'Outbreak Phase' : 'Recovery Active'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. PANDEMIC TIMELINE CONTROLLER */}
      <PandemicTimelineController
        currentDay={currentDay}
        onDayChange={handleDayChange}
        isRecoveryMode={isRecoveryMode}
        onToggleRecoveryMode={handleToggleRecoveryMode}
      />

      {/* 4. EXACTLY EIGHT SECTOR IMPACT CARDS (4 x 2 DESKTOP GRID) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">
              Sector Impact Breakdown
            </h2>
            <span className="text-xs text-slate-400 font-bold">
              (8 Defined Dimensions)
            </span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Status: Low (0–24) • Moderate (25–49) • High (50–74) • Critical (75–100)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Healthcare */}
          <SectorImpactCard impact={sectors.healthcare} />

          {/* Card 2: Economy */}
          <SectorImpactCard impact={sectors.economy} />

          {/* Card 3: Transportation */}
          <SectorImpactCard impact={sectors.transportation} />

          {/* Card 4: Workforce */}
          <SectorImpactCard impact={sectors.workforce} />

          {/* Card 5: Supply Chain */}
          <SectorImpactCard impact={sectors.supply_chain} />

          {/* Card 6: Society */}
          <SectorImpactCard impact={sectors.society} />

          {/* Card 7: Environment */}
          <SectorImpactCard impact={sectors.environment} />

          {/* Card 8: Overall Impact Score Summary Card */}
          <SectorImpactCard 
            isSummaryCard={true} 
            overallScore={averageImpactScore} 
            overallStatus={averageImpactStatus} 
          />
        </div>
      </div>

      {/* 5. WHAT IF? SCENARIOS SECTION */}
      <PandemicWhatIfController
        currentDay={currentDay}
        params={whatIfParams}
        onParamsChange={(p) => setWhatIfParams(p)}
        onRunSimulation={(res) => setSimulationResult(res)}
        simulationResult={simulationResult}
      />

      {/* 6. RECOVERY MODE & IMPACT OVER TIME CHART */}
      <RecoveryVisualisationChart
        currentDay={currentDay}
        params={whatIfParams}
      />

    </div>
  );
};
