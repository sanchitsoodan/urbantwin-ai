import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  X, 
  Droplet,
  Car,
  Trash2,
  TrendingDown,
  Navigation,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Route
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const AISolutionsModal: React.FC = () => {
  const { 
    isSolutionModalOpen, 
    setIsSolutionModalOpen, 
    activeRecommendation, 
    implementSolutionPlan,
    selectedCity,
    simResults,
    simParams,
    bypassRoutes,
    selectedBypassRoute,
    focusOnBypassRoute,
    setActiveTab
  } = useCity();

  if (!isSolutionModalOpen) return null;

  const handleImplementAll = () => {
    implementSolutionPlan();
    setActiveTab('command-center');
    setIsSolutionModalOpen(false);
  };

  const handleViewSpecificRoute = (routeId: string) => {
    focusOnBypassRoute(routeId);
    setActiveTab('command-center');
    setIsSolutionModalOpen(false);
  };

  const solutionsToDisplay = (simResults.tailoredSolutions && simResults.tailoredSolutions.length > 0)
    ? simResults.tailoredSolutions
    : activeRecommendation.actionItems;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water': return <Droplet className="w-3.5 h-3.5 text-sky-600" />;
      case 'energy': return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'waste': return <Trash2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'transit':
      case 'lane': return <Car className="w-3.5 h-3.5 text-blue-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSolutionModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          title="Close Action Plan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-300">
            <Route className="w-6 h-6 text-emerald-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                AI Traffic Bypass & Solutions Plan
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {selectedCity.name}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Proposed Low-Traffic Bypass Routes & Interventions
            </h2>
          </div>
        </div>

        {/* 1. PROPOSED LOW-TRAFFIC ALTERNATE BYPASS ROUTES SECTION */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Proposed AI Low-Traffic Alternate Routes:</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Click route to highlight on 3D Map
            </span>
          </div>

          <div className="space-y-3">
            {bypassRoutes.map((route, idx) => (
              <div 
                key={route.id}
                className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border-2 border-emerald-300 shadow-xs hover:border-emerald-500 transition"
              >
                {/* Route Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {route.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewSpecificRoute(route.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 px-2.5 py-1 rounded-xl border border-emerald-300 transition cursor-pointer self-start sm:self-auto"
                  >
                    <span>👁️ Show Alternate on Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Comparison Row: Red Congested vs Green AI Bypass */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                  
                  {/* Left: Congested Original Path */}
                  <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Current Congested Path
                      </span>
                      <span className="text-[10px] font-bold bg-rose-200/80 text-rose-900 px-1.5 rounded-full">
                        {route.congestedDensityPct}% Traffic Load
                      </span>
                    </div>
                    <div className="font-semibold text-rose-950 text-[11px] truncate">
                      {route.congestedRoadName}
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-rose-800 font-mono font-bold">
                      <span>Speed: {route.congestedSpeedKmh} km/h</span>
                      <span>ETA: {route.congestedTravelTimeMin} min</span>
                    </div>
                  </div>

                  {/* Right: AI Proposed Low-Traffic Bypass */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Proposed AI Bypass
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-200 text-emerald-950 px-1.5 rounded-full">
                        {route.proposedDensityPct}% Traffic Load
                      </span>
                    </div>
                    <div className="font-semibold text-emerald-950 text-[11px] truncate">
                      🟢 Low-Traffic Diverted Corridor
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-emerald-800 font-mono font-bold">
                      <span>Speed: {route.proposedSpeedKmh} km/h</span>
                      <span className="text-emerald-900 font-extrabold">ETA: {route.proposedTravelTimeMin} min (-{route.timeSavedMin}m)</span>
                    </div>
                  </div>

                </div>

                <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
                  💡 <b>Routing Strategy:</b> {route.strategyDescription}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. TAILORED SYSTEM ACTION ITEMS */}
        <div className="mt-5 space-y-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 block">
            Coordinated Multi-System Interventions:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {solutionsToDisplay.map((action, idx) => (
              <div 
                key={action.id || idx}
                className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition flex items-start gap-2.5 shadow-xs"
              >
                <div className="p-1.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getCategoryIcon(action.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{action.title}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      {action.benefit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. EXPECTED CITY-WIDE IMPACT METRICS */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-semibold block">TRAVEL DELAY</span>
            <span className="text-base font-mono font-bold text-emerald-700">
              ↓ {activeRecommendation.impactMetrics.travelTimeReductionPct}%
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-semibold block">CONGESTION</span>
            <span className="text-base font-mono font-bold text-emerald-700">
              ↓ {activeRecommendation.impactMetrics.congestionReductionPct}%
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-800 font-semibold block">DAILY SAVINGS</span>
            <span className="text-base font-mono font-bold text-emerald-700">
              +${simResults.economicSavingsUsd.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setIsSolutionModalOpen(false)}
            className="w-full sm:w-1/3 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleImplementAll}
            className="w-full sm:w-2/3 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>🚀 DEPLOY LOW-TRAFFIC BYPASS & SOLUTIONS TO MAP</span>
          </button>
        </div>

      </div>
    </div>
  );
};
