import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Play, 
  RotateCcw, 
  Car, 
  CloudRain, 
  AlertTriangle, 
  Sparkles, 
  BarChart3,
  Users,
  DollarSign,
  Droplet,
  Zap,
  Trash2,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { useCity } from '../../context/CityContext';
import { useAuth } from '../../context/AuthContext';
import { CityMap } from '../map/CityMap';
import { AIConfidenceMeter } from '../common/AIConfidenceMeter';

export const WhatIfSimulatorView: React.FC = () => {
  const { 
    simParams, 
    updateSimParam, 
    resetSimParams, 
    simResults, 
    isSimulating, 
    runSimulationNow,
    setIsSolutionModalOpen,
    implementedSolutions,
    selectedCity,
    activeScenarioDetour
  } = useCity();

  const { isBusinessSubscribed, openPaymentModal } = useAuth();
  const [sandboxTab, setSandboxTab] = useState<'traffic' | 'population'>('traffic');

  // Chart 1: Traffic & Road Mobility
  const trafficChartData = [
    {
      metric: 'Travel Time (min)',
      Normal: simResults.trafficSandbox.before.travelTimeMin,
      Disrupted: simResults.trafficSandbox.after.travelTimeMin,
      AIFixed: simResults.trafficSandbox.aiOptimized.travelTimeMin
    },
    {
      metric: 'Congestion (%)',
      Normal: simResults.trafficSandbox.before.congestionPct,
      Disrupted: simResults.trafficSandbox.after.congestionPct,
      AIFixed: simResults.trafficSandbox.aiOptimized.congestionPct
    },
    {
      metric: 'Emergency ETA (min)',
      Normal: simResults.trafficSandbox.before.emergencyEtaMin,
      Disrupted: simResults.trafficSandbox.after.emergencyEtaMin,
      AIFixed: simResults.trafficSandbox.aiOptimized.emergencyEtaMin
    }
  ];

  // Chart 2: 5-Sector Urban Resource & Population Twin
  const popData = simResults.populationSandbox;
  const populationResourceChartData = [
    {
      sector: '💰 Economy ($k/day)',
      Baseline: popData.baseline.economyLossKUsd,
      Surged: popData.surged.economyLossKUsd,
      AIOptimized: popData.aiOptimized.economyLossKUsd
    },
    {
      sector: '🚗 Traffic Load (%)',
      Baseline: popData.baseline.trafficLoadPct,
      Surged: popData.surged.trafficLoadPct,
      AIOptimized: popData.aiOptimized.trafficLoadPct
    },
    {
      sector: '🚰 Water Demand (MLD)',
      Baseline: popData.baseline.waterDemandMld,
      Surged: popData.surged.waterDemandMld,
      AIOptimized: popData.aiOptimized.waterDemandMld
    },
    {
      sector: '⚡ Energy Load (100 MWh)',
      Baseline: Math.round(popData.baseline.energyLoadMwh / 100),
      Surged: Math.round(popData.surged.energyLoadMwh / 100),
      AIOptimized: Math.round(popData.aiOptimized.energyLoadMwh / 100)
    },
    {
      sector: '🗑️ Waste Load (Tons)',
      Baseline: popData.baseline.wasteGeneratedTons,
      Surged: popData.surged.wasteGeneratedTons,
      AIOptimized: popData.aiOptimized.wasteGeneratedTons
    }
  ];

  const handleWeatherChange = (val: string) => {
    if (val !== 'normal' && !isBusinessSubscribed) {
      openPaymentModal();
      return;
    }
    updateSimParam('weather', val as any);
  };

  const handleDeploySolutions = () => {
    if (!isBusinessSubscribed) {
      openPaymentModal();
      return;
    }
    setIsSolutionModalOpen(true);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-6 space-y-4 pb-12">
      
      {/* Top Banner & Module Selector */}
      <div className="card-clean p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-slate-900">
              {selectedCity.name} Multi-Variable What-If Sandbox
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {selectedCity.flag} Dynamic Simulator
            </span>
            <AIConfidenceMeter score={97.1} label="Predictive Sensitivity" variant="badge" />
            
            {isBusinessSubscribed ? (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                ⭐ BUSINESS UNLOCKED
              </span>
            ) : (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Free Mode (Basic Controls)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Test road blockades, traffic volume surges, extreme weather, and municipal resource stresses.
          </p>
        </div>

        {/* 2 Clean Sandbox Tabs */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSandboxTab('traffic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sandboxTab === 'traffic'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>1. Traffic Bottleneck (Free)</span>
            </button>

            <button
              onClick={() => setSandboxTab('population')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sandboxTab === 'population'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2. Population & Resources</span>
              {!isBusinessSubscribed && (
                <span className="text-[8px] bg-amber-200 text-amber-950 font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <Lock className="w-2 h-2" /> Business
                </span>
              )}
            </button>
          </div>

          <button
            onClick={resetSimParams}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Reset All Sliders"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Controls & Tailored Solutions (Left 5 cols) | Interactive Scenario Map & Dedicated Graphs (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Dedicated Controls & Tailored Action Plan */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. MODULE 1 CONTROLS: TRAFFIC BOTTLENECKS (FREE BASIC) */}
          {sandboxTab === 'traffic' && (
            <div className="card-clean rounded-3xl p-5 space-y-4 bg-white border border-slate-200 shadow-sm animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-600" />
                  Traffic Disruption Controls
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Basic Free Features
                </span>
              </div>

              {/* Road Closure Selector (Free) */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Block Major Road Segment
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    simParams.roadClosure === 'none' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {simParams.roadClosure === 'none' ? 'Open' : 'Blocked'}
                  </span>
                </div>
                <select
                  value={simParams.roadClosure}
                  onChange={(e) => updateSimParam('roadClosure', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-blue-600 outline-none"
                >
                  {selectedCity.roadClosureOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider 1: Traffic Volume Surge (Free) */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    Rush Hour Traffic Surge
                  </span>
                  <span className="font-mono font-bold text-blue-700">+{simParams.trafficIncreasePct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={simParams.trafficIncreasePct}
                  onChange={(e) => updateSimParam('trafficIncreasePct', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0% Normal</span>
                  <span>+50% Rush Hour</span>
                  <span>+100% Jam</span>
                </div>
              </div>

              {/* Weather / Transit Disruption (🔒 GATED FOR BUSINESS) */}
              <div className={`space-y-1.5 p-3.5 rounded-2xl border ${!isBusinessSubscribed ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-bold flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                    Weather & Transit Event
                  </span>
                  {!isBusinessSubscribed && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Business Feature
                    </span>
                  )}
                </div>
                <select
                  value={simParams.weather}
                  onChange={(e) => handleWeatherChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:border-blue-600 outline-none"
                >
                  <option value="normal">Normal (Clear Conditions - Free)</option>
                  <option value="heavy-rain">🔒 Heavy Monsoon Rain (Surface Flooding - Business)</option>
                  <option value="bus-strike">🔒 Public Transit Strike (24h Action - Business)</option>
                </select>
              </div>
            </div>
          )}

          {/* 2. MODULE 2 CONTROLS: POPULATION SURGE (🔒 GATED FOR FREE USERS) */}
          {sandboxTab === 'population' && (
            !isBusinessSubscribed ? (
              <div className="card-clean rounded-3xl p-6 space-y-4 bg-white border-2 border-indigo-300 shadow-md text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 mx-auto flex items-center justify-center shadow-md shadow-indigo-500/10">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                    Business Tier License
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    5-Sector Municipal Resource Simulation
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Simulate city population surges and observe cross-system strain across <b>Water Demand (MLD)</b>, <b>Energy Grid (MWh)</b>, <b>Economic Loss</b>, and <b>Waste Logistics</b>.
                  </p>
                </div>
                <button
                  onClick={openPaymentModal}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 transition transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Unlock Resource Twin ($499/mo)</span>
                </button>
              </div>
            ) : (
              <div className="card-clean rounded-3xl p-5 space-y-4 bg-white border border-slate-200 shadow-sm animate-in fade-in-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Urban Population Surge Control
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Unlocked
                  </span>
                </div>

                {/* Slider 2: Population Surge Slider */}
                <div className="space-y-2 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-indigo-950 font-extrabold flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-600" />
                      City Population Influx / Mega Surge
                    </span>
                    <span className="font-mono font-extrabold text-sm text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                      +{simParams.populationIncreasePct || 0}% Growth
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={simParams.populationIncreasePct || 0}
                    onChange={(e) => updateSimParam('populationIncreasePct', Number(e.target.value))}
                    className="w-full h-2.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                  />

                  <div className="grid grid-cols-4 text-center text-[10px] text-indigo-900 font-semibold pt-1">
                    <span>0% Normal</span>
                    <span>+30% Marathon</span>
                    <span>+70% Festival</span>
                    <span>+100% Max</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">5 Municipal Sectors Modeled:</span>
                  <p className="text-[11px] leading-relaxed">
                    Adjusting population surge computes direct multi-system stress across <b>Economy Loss</b>, <b>Traffic Load</b>, <b>Water Demand (MLD)</b>, <b>Energy Grid (MWh)</b>, and <b>Waste (Tons)</b>.
                  </p>
                </div>
              </div>
            )
          )}

          {/* TAILORED LOGICAL SOLUTIONS ACCORDING TO SITUATION */}
          <div className="card-clean rounded-3xl p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Tailored AI Solutions for Current Scenario
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {simResults.tailoredSolutions.length} Actions
              </span>
            </div>

            {/* List of Logical Solutions */}
            <div className="space-y-2">
              {simResults.tailoredSolutions.map((sol) => (
                <div 
                  key={sol.id} 
                  className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {sol.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-mono">
                      {sol.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {sol.description}
                  </p>
                  <div className="pt-1 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <span>Benefit:</span>
                    <span>{sol.benefit}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleDeploySolutions}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              {!isBusinessSubscribed && <Lock className="w-3.5 h-3.5 text-emerald-200" />}
              <span>{isBusinessSubscribed ? (implementedSolutions ? '✓ Solutions Implemented' : '🚀 Deploy These Solutions') : 'Deploy AI Solutions (Business Plan)'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Map & Dedicated Graphs */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Embedded Live Scenario Map */}
          <div className="relative">
            <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200 shadow-md backdrop-blur-sm text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Scenario Twin Map ({selectedCity.name})</span>
            </div>
            <CityMap customHeight="h-[340px]" hideSidebar={true} />
          </div>

          {/* 1. DEDICATED GRAPH 1: TRAFFIC & MOBILITY (Only in Traffic Tab) */}
          {sandboxTab === 'traffic' && (
            <div className="card-clean rounded-3xl p-4 bg-white border border-slate-200 shadow-sm space-y-2 animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase">
                    Graph 1: Traffic, Travel Time & Emergency ETA
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-lg">
                  Mobility Disruption Model
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trafficChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="metric" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: '#e2e8f0', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        color: '#0f172a' 
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar name="Normal" dataKey="Normal" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar name="Disrupted" dataKey="Disrupted" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar name="AI Bypass Route" dataKey="AIFixed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 2. DEDICATED GRAPH 2: POPULATION SURGE & 5-SECTOR RESOURCE TWIN (Only in Population Tab) */}
          {sandboxTab === 'population' && (
            <div className="card-clean rounded-3xl p-4 bg-white border border-slate-200 shadow-sm space-y-2 animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase">
                    Graph 2: Population Surge Outcomes across 5 Urban Sectors
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg">
                  Economy, Traffic, Water, Energy & Waste
                </span>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={populationResourceChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="sector" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={9} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: '#e2e8f0', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        color: '#0f172a' 
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar name="Baseline Demand" dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar name="Surge Stress" dataKey="Surged" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar name="AI Stabilized" dataKey="AIOptimized" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
