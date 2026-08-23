import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Play, 
  RotateCcw, 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Lock,
  Zap
} from 'lucide-react';
import { PandemicWhatIfParams, WhatIfSimulationResult } from '../../types/pandemic';
import { DEFAULT_PANDEMIC_WHAT_IF, compareWhatIfScenarios } from '../../services/pandemicSimulationEngine';

interface PandemicWhatIfControllerProps {
  currentDay: number;
  params: PandemicWhatIfParams;
  onParamsChange: (newParams: PandemicWhatIfParams) => void;
  onRunSimulation: (result: WhatIfSimulationResult) => void;
  simulationResult: WhatIfSimulationResult | null;
  isBusinessSubscribed?: boolean;
  onPromptUpgrade?: () => void;
}

export const PandemicWhatIfController: React.FC<PandemicWhatIfControllerProps> = ({
  currentDay,
  params,
  onParamsChange,
  onRunSimulation,
  simulationResult,
  isBusinessSubscribed = false,
  onPromptUpgrade
}) => {
  const [localParams, setLocalParams] = useState<PandemicWhatIfParams>(params);
  const [isRunning, setIsRunning] = useState(false);

  const handleSliderChange = (key: keyof PandemicWhatIfParams, value: number, isPremium: boolean = false) => {
    if (isPremium && !isBusinessSubscribed) {
      if (onPromptUpgrade) onPromptUpgrade();
      return;
    }
    const updated = { ...localParams, [key]: value };
    setLocalParams(updated);
    onParamsChange(updated);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = compareWhatIfScenarios(currentDay, DEFAULT_PANDEMIC_WHAT_IF, localParams);
      onRunSimulation(result);
      setIsRunning(false);
    }, 350);
  };

  const handleReset = () => {
    setLocalParams(DEFAULT_PANDEMIC_WHAT_IF);
    onParamsChange(DEFAULT_PANDEMIC_WHAT_IF);
    const result = compareWhatIfScenarios(currentDay, DEFAULT_PANDEMIC_WHAT_IF, DEFAULT_PANDEMIC_WHAT_IF);
    onRunSimulation(result);
  };

  return (
    <div className="card-clean p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                What-If Policy & Intervention Sandbox
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {isBusinessSubscribed ? 'All 5 Parameters Unlocked' : 'Basic Controls (Free Tier)'}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              WHAT IF?
            </h2>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          title="Reset to Baseline Parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Controls</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 font-medium">
        Modify key pandemic response variables below and click <b>Run Simulation</b> to observe the cross-sector impact changes.
      </p>

      {/* 5 What-If Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* 1. Gathering Restrictions (FREE BASIC) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900">Gathering Restrictions</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">FREE</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.gatheringRestrictions <= 30 ? 'Low' : localParams.gatheringRestrictions <= 70 ? 'Moderate' : 'Maximum'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localParams.gatheringRestrictions}
            onChange={(e) => handleSliderChange('gatheringRestrictions', Number(e.target.value), false)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Low</span>
            <span>Maximum</span>
          </div>
        </div>

        {/* 2. Travel Restrictions (FREE BASIC) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900">Travel Restrictions</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">FREE</span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.travelRestrictions <= 30 ? 'Low' : localParams.travelRestrictions <= 70 ? 'Moderate' : 'High'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localParams.travelRestrictions}
            onChange={(e) => handleSliderChange('travelRestrictions', Number(e.target.value), false)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* 3. Remote Work Adoption (🔒 PREMIUM BUSINESS) */}
        <div className={`p-3.5 rounded-2xl border space-y-2 relative ${!isBusinessSubscribed ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900">Remote Work Adoption</span>
              {!isBusinessSubscribed && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Business
                </span>
              )}
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.remoteWorkAdoptionPct}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!isBusinessSubscribed}
            value={localParams.remoteWorkAdoptionPct}
            onChange={(e) => handleSliderChange('remoteWorkAdoptionPct', Number(e.target.value), true)}
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none ${!isBusinessSubscribed ? 'cursor-not-allowed opacity-60' : 'cursor-pointer accent-indigo-600'}`}
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 4. Healthcare Capacity Buffer (🔒 PREMIUM BUSINESS) */}
        <div className={`p-3.5 rounded-2xl border space-y-2 relative ${!isBusinessSubscribed ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900">Healthcare Surge Buffer</span>
              {!isBusinessSubscribed && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Business
                </span>
              )}
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.healthcareCapacity <= 40 ? 'Normal' : localParams.healthcareCapacity <= 75 ? 'Expanded' : 'Surge Max'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!isBusinessSubscribed}
            value={localParams.healthcareCapacity}
            onChange={(e) => handleSliderChange('healthcareCapacity', Number(e.target.value), true)}
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none ${!isBusinessSubscribed ? 'cursor-not-allowed opacity-60' : 'cursor-pointer accent-indigo-600'}`}
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Normal</span>
            <span>Expanded</span>
          </div>
        </div>

        {/* 5. Public Health Compliance (🔒 PREMIUM BUSINESS) */}
        <div className={`p-3.5 rounded-2xl border space-y-2 relative ${!isBusinessSubscribed ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-slate-900">Public Compliance Multiplier</span>
              {!isBusinessSubscribed && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Business
                </span>
              )}
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.publicCompliance <= 35 ? 'Low' : localParams.publicCompliance <= 70 ? 'Moderate' : 'High'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            disabled={!isBusinessSubscribed}
            value={localParams.publicCompliance}
            onChange={(e) => handleSliderChange('publicCompliance', Number(e.target.value), true)}
            className={`w-full h-2 bg-slate-200 rounded-lg appearance-none ${!isBusinessSubscribed ? 'cursor-not-allowed opacity-60' : 'cursor-pointer accent-indigo-600'}`}
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Primary Run Simulation Action Button Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 flex flex-col justify-center gap-2 text-center">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'CALCULATING EPIDEMIOLOGY...' : 'RUN SIMULATION'}</span>
          </button>
          <span className="text-[10px] text-slate-500 font-medium">
            Calculates 8-sector mitigations
          </span>
        </div>

      </div>

      {/* Comparison Results Card / Table (if simulation was run) */}
      {simulationResult && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Simulation Outcomes Comparison
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Baseline Score: <b className="font-mono text-slate-800">{simulationResult.beforeAvg}</b></span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-indigo-900 font-bold">Policy Score: <b className="font-mono text-indigo-700">{simulationResult.afterAvg}</b></span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {simulationResult.sectors.slice(0, 4).map((sec) => (
              <div key={sec.sectorId} className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">{sec.name}</span>
                <span className={`text-sm font-mono font-black ${sec.delta <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {sec.scenario} / 100 ({sec.delta <= 0 ? '' : '+'}{sec.delta})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
