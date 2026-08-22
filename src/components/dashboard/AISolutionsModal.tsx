import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  X, 
  Droplet,
  Car,
  Trash2,
  Users,
  ShieldCheck,
  TrendingDown
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
    simParams
  } = useCity();

  if (!isSolutionModalOpen) return null;

  const handleImplement = () => {
    implementSolutionPlan();
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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001]">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSolutionModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
          title="Close Action Plan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Tailored AI Solutions Plan
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {selectedCity.name}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Specific Interventions for Current Scenario
            </h2>
          </div>
        </div>

        {/* Issue / Situation Summary */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            ACTIVE SIMULATION DISRUPTIONS
          </span>
          <p className="text-xs font-bold text-slate-800 mt-0.5">
            {simParams.roadClosure !== 'none' ? `⛔ Road Closed: ${simParams.roadClosure}` : 'Roads: Open'} • {simParams.trafficIncreasePct > 0 ? `🚗 Traffic Surge: +${simParams.trafficIncreasePct}%` : 'Normal Volume'} • {simParams.populationIncreasePct > 0 ? `👥 Population Influx: +${simParams.populationIncreasePct}%` : 'Base Population'} • {simParams.weather}
          </p>
        </div>

        {/* Tailored Action Items List */}
        <div className="mt-4 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Logical AI Interventions to Execute:
          </span>

          {solutionsToDisplay.map((action, idx) => (
            <div 
              key={action.id || idx}
              className="p-3.5 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-400 transition flex items-start gap-3 shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {getCategoryIcon(action.category)}
                    <span>{action.title}</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {action.benefit}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expected Net Benefits Grid */}
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

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setIsSolutionModalOpen(false)}
            className="w-full sm:w-1/3 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleImplement}
            className="w-full sm:w-2/3 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>🚀 DEPLOY LOGICAL SOLUTIONS TO TWIN</span>
          </button>
        </div>

      </div>
    </div>
  );
};
