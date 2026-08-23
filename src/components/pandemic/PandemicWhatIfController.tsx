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
  HelpCircle
} from 'lucide-react';
import { PandemicWhatIfParams, WhatIfSimulationResult } from '../../types/pandemic';
import { DEFAULT_PANDEMIC_WHAT_IF, compareWhatIfScenarios } from '../../services/pandemicSimulationEngine';

interface PandemicWhatIfControllerProps {
  currentDay: number;
  params: PandemicWhatIfParams;
  onParamsChange: (newParams: PandemicWhatIfParams) => void;
  onRunSimulation: (result: WhatIfSimulationResult) => void;
  simulationResult: WhatIfSimulationResult | null;
}

export const PandemicWhatIfController: React.FC<PandemicWhatIfControllerProps> = ({
  currentDay,
  params,
  onParamsChange,
  onRunSimulation,
  simulationResult
}) => {
  const [localParams, setLocalParams] = useState<PandemicWhatIfParams>(params);
  const [isRunning, setIsRunning] = useState(false);

  const handleSliderChange = (key: keyof PandemicWhatIfParams, value: number) => {
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
                Parametric Controls
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
        
        {/* 1. Gathering Restrictions */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Gathering Restrictions</span>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.gatheringRestrictions <= 30 ? 'Low' : localParams.gatheringRestrictions <= 70 ? 'Moderate' : 'Maximum'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localParams.gatheringRestrictions}
            onChange={(e) => handleSliderChange('gatheringRestrictions', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Low</span>
            <span>Maximum</span>
          </div>
        </div>

        {/* 2. Remote Work Adoption */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Remote Work Adoption</span>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.remoteWorkAdoptionPct}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localParams.remoteWorkAdoptionPct}
            onChange={(e) => handleSliderChange('remoteWorkAdoptionPct', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* 3. Travel Restrictions */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Travel Restrictions</span>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.travelRestrictions <= 30 ? 'Low' : localParams.travelRestrictions <= 70 ? 'Moderate' : 'High'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localParams.travelRestrictions}
            onChange={(e) => handleSliderChange('travelRestrictions', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* 4. Healthcare Capacity */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Healthcare Capacity</span>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.healthcareCapacity <= 40 ? 'Normal' : localParams.healthcareCapacity <= 75 ? 'Expanded' : 'Surge Max'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localParams.healthcareCapacity}
            onChange={(e) => handleSliderChange('healthcareCapacity', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Normal</span>
            <span>Expanded</span>
          </div>
        </div>

        {/* 5. Public Compliance */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Public Compliance</span>
            <span className="text-xs font-mono font-bold text-indigo-700">
              {localParams.publicCompliance <= 35 ? 'Low' : localParams.publicCompliance <= 70 ? 'Moderate' : 'High'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localParams.publicCompliance}
            onChange={(e) => handleSliderChange('publicCompliance', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
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
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className={`w-4 h-4 fill-white ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'CALCULATING DYNAMICS...' : 'RUN SIMULATION'}</span>
          </button>
          <span className="text-[10px] text-slate-500 font-semibold">
            Recalculates multi-sector impact estimates
          </span>
        </div>

      </div>

      {/* SIMULATION RESULT COMPARISON SECTION */}
      {simulationResult && (
        <div className="mt-5 p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 animate-in fade-in-50">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider">
                Outcomes Analysis
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                SIMULATION RESULT
              </h3>
            </div>

            {/* Average Impact Before vs After */}
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold block">BEFORE</span>
                <span className="text-lg font-mono font-extrabold text-slate-700">{simulationResult.beforeAvg}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold block">AFTER</span>
                <span className="text-lg font-mono font-extrabold text-indigo-600">{simulationResult.afterAvg}</span>
              </div>
              <div className="pl-3 border-l border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">IMPROVEMENT</span>
                <span className={`text-sm font-mono font-extrabold ${simulationResult.delta <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {simulationResult.delta <= 0 ? `${simulationResult.delta} pts` : `+${simulationResult.delta} pts`}
                </span>
              </div>
            </div>
          </div>

          {/* Simple Clean Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase font-extrabold">
                  <th className="pb-2">Sector</th>
                  <th className="pb-2 text-right">Previous</th>
                  <th className="pb-2 text-right">Scenario</th>
                  <th className="pb-2 text-right">Net Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 font-medium">
                {simulationResult.sectors.map((s) => (
                  <tr key={s.sectorId} className="hover:bg-white/80 transition">
                    <td className="py-2.5 font-bold text-slate-900">{s.name}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{s.previous}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-indigo-700">{s.scenario}</td>
                    <td className="py-2.5 text-right font-mono font-extrabold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        s.delta < 0 ? 'bg-emerald-100 text-emerald-800' : s.delta === 0 ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {s.delta <= 0 ? `${s.delta}` : `+${s.delta}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
