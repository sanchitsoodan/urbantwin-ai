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
  Globe,
  Zap
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { useAuth } from '../../context/AuthContext';
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
  const { isBusinessSubscribed, openPaymentModal } = useAuth();

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
    if (day > 90 && !isBusinessSubscribed) {
      openPaymentModal();
      return;
    }
    setCurrentDay(day);
    if (day > 90) {
      setIsRecoveryMode(true);
    } else {
      setIsRecoveryMode(false);
    }
  };

  const handleToggleRecoveryMode = (recovery: boolean) => {
    if (recovery && !isBusinessSubscribed) {
      openPaymentModal();
      return;
    }
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
            
            {/* Subscription Pill */}
            {isBusinessSubscribed ? (
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                ⭐ BUSINESS SUBSCRIBED
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Free Tier
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Simulate how a 90-day pandemic could affect a city across critical sectors.
          </p>

          {/* Scenario Indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Duration: <b>90 Days Outbreak</b>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <Activity className="w-3.5 h-3.5 text-rose-600" />
              Scale: <b>Severe Contagion</b>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <Globe className="w-3.5 h-3.5 text-purple-600" />
              Interventions: <b>Dynamic Policies</b>
            </span>
          </div>
        </div>

        {/* Action Button: Pricing / Subscription Status */}
        <div className="shrink-0 flex items-center gap-2">
          {!isBusinessSubscribed ? (
            <button
              onClick={openPaymentModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition transform hover:scale-[1.02] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Unlock Business Mode ($499/mo)</span>
            </button>
          ) : (
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Analytics Unlocked</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP PANDEMIC GIS INFRASTRUCTURE & ESSENTIAL SERVICES MAP */}
      <PandemicMap />

      {/* 3. EXPLICIT DISCLAIMER */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-extrabold text-amber-900 uppercase tracking-wider block text-[10px]">
            Hypothetical Simulation Model
          </span>
          <p className="text-amber-900/90 leading-relaxed font-medium">
            This module illustrates hypothetical disruption scenarios for urban resilience training, emergency preparedness, and impact analysis.
          </p>
        </div>
      </div>

      {/* 4. RECOVERY MODE BANNER OR TEASER */}
      {isRecoveryMode && isBusinessSubscribed ? (
        <div className="card-clean p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-400 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <span>Looking for post-pandemic urban rebound (Day 90–365)?</span>
            {!isBusinessSubscribed && (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Business Feature
              </span>
            )}
          </div>
          <button
            onClick={() => handleToggleRecoveryMode(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition cursor-pointer"
          >
            <span>Enter Recovery Mode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. LARGE AVERAGE IMPACT SCORE BANNER */}
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
            Composite severity index calculated across Healthcare, Economy, Transportation, Workforce, Supply Chain, Society, and Environment.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${statusColors.text}`}>
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

      {/* 6. PANDEMIC TIMELINE CONTROLLER */}
      <PandemicTimelineController
        currentDay={currentDay}
        onDayChange={handleDayChange}
        isRecoveryMode={isRecoveryMode}
        onToggleRecoveryMode={handleToggleRecoveryMode}
        isBusinessSubscribed={isBusinessSubscribed}
        onPromptUpgrade={openPaymentModal}
      />

      {/* 7. EXACTLY EIGHT SECTOR IMPACT CARDS (4 x 2 DESKTOP GRID) */}
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

      {/* 8. WHAT IF? SCENARIOS SECTION */}
      <PandemicWhatIfController
        currentDay={currentDay}
        params={whatIfParams}
        onParamsChange={(p) => setWhatIfParams(p)}
        onRunSimulation={(res) => setSimulationResult(res)}
        simulationResult={simulationResult}
        isBusinessSubscribed={isBusinessSubscribed}
        onPromptUpgrade={openPaymentModal}
      />

      {/* 9. RECOVERY MODE & IMPACT OVER TIME CHART */}
      <RecoveryVisualisationChart
        currentDay={currentDay}
        params={whatIfParams}
        isLocked={!isBusinessSubscribed}
        onUnlock={openPaymentModal}
      />

    </div>
  );
};
