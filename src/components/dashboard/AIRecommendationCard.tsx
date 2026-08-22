import React from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  CheckCircle2, 
  TrendingDown, 
  Zap,
  Layers
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const AIRecommendationCard: React.FC = () => {
  const { 
    activeRecommendation, 
    setIsSolutionModalOpen,
    setActiveTab, 
    updateSimParam,
    implementedSolutions,
    selectedCity
  } = useCity();

  const handleSimulate = () => {
    updateSimParam('trafficIncreasePct', 30);
    setActiveTab('simulator');
  };

  return (
    <div className="card-clean rounded-3xl p-5 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
      
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                AI Solutions Engine • {selectedCity.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {activeRecommendation.confidencePct}% Confidence
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              {activeRecommendation.issue}
            </h3>
          </div>
        </div>
      </div>

      {/* Recommended Action Box */}
      <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
          PROPOSED AI ACTION PLAN
        </span>
        <p className="text-sm font-bold text-slate-900 mt-0.5">
          {activeRecommendation.recommendedAction}
        </p>

        {/* Action item pill preview */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {activeRecommendation.actionItems.map(item => (
            <span key={item.id} className="text-[10px] font-bold bg-white text-blue-800 px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
              ✓ {item.title}
            </span>
          ))}
        </div>
      </div>

      {/* Expected Impact Stats Grid */}
      <div className="mt-3 grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 block font-semibold">TRAVEL TIME</span>
          <span className="text-base sm:text-lg font-mono font-bold text-emerald-600 flex items-center justify-center gap-0.5 mt-0.5">
            <TrendingDown className="w-3.5 h-3.5" />
            ↓ {activeRecommendation.impactMetrics.travelTimeReductionPct}%
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 block font-semibold">CONGESTION</span>
          <span className="text-base sm:text-lg font-mono font-bold text-emerald-600 flex items-center justify-center gap-0.5 mt-0.5">
            <TrendingDown className="w-3.5 h-3.5" />
            ↓ {activeRecommendation.impactMetrics.congestionReductionPct}%
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 block font-semibold">EMERGENCY DELAY</span>
          <span className="text-base sm:text-lg font-mono font-bold text-emerald-600 flex items-center justify-center gap-0.5 mt-0.5">
            <TrendingDown className="w-3.5 h-3.5" />
            ↓ {activeRecommendation.impactMetrics.emergencyTimeReductionPct}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          onClick={handleSimulate}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs transition"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          <span>SIMULATE SCENARIO</span>
        </button>

        <button
          onClick={() => setIsSolutionModalOpen(true)}
          className={`w-full sm:w-1/2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition transform hover:scale-[1.01] ${
            implementedSolutions
              ? 'bg-emerald-700 text-white shadow-emerald-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
          }`}
        >
          {implementedSolutions ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>SOLUTIONS IMPLEMENTED (ACTIVE)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-white" />
              <span>🚀 REVIEW & IMPLEMENT SOLUTIONS</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
