import React from 'react';
import { 
  ShieldCheck, 
  Car, 
  Ambulance, 
  Sparkles
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const MetricCardsStrip: React.FC = () => {
  const { cityScore, simResults, selectedCity, setActiveTab } = useCity();

  return (
    <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 pt-2 pb-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
        
        {/* 1. City Health Score (Unique to City) */}
        <div 
          onClick={() => setActiveTab('command-center')}
          className="card-clean p-3 sm:p-3.5 rounded-2xl cursor-pointer hover:border-emerald-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {selectedCity.name} Health Score
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {cityScore.overall >= 80 ? 'Optimal' : cityScore.overall >= 65 ? 'Moderate' : 'Congested'}
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
              cityScore.overall >= 80 ? 'text-emerald-600' :
              cityScore.overall >= 65 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {cityScore.overall}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            Traffic: <b className="text-slate-800">{cityScore.traffic}</b> • Emergency: <b className="text-slate-800">{cityScore.emergency}</b> • Infra: <b className="text-slate-800">{cityScore.infrastructure}</b>
          </p>
        </div>

        {/* 2. Current Traffic Status (Unique to City) */}
        <div 
          onClick={() => setActiveTab('simulator')}
          className="card-clean p-3 sm:p-3.5 rounded-2xl cursor-pointer hover:border-blue-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600" />
              Traffic Saturation
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              simResults.after.congestionPct > 75 
                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                : simResults.after.congestionPct > 55
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {simResults.after.congestionPct > 75 ? 'Severe' : simResults.after.congestionPct > 55 ? 'Peak Hour' : 'Free Flow'}
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {simResults.after.congestionPct}%
            </span>
            <span className="text-xs text-slate-500 font-mono">load</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            Average Speed: <b className="text-slate-800">{selectedCity.baselineSpeedKmh} km/h</b> across {selectedCity.name}
          </p>
        </div>

        {/* 3. Emergency Ambulance ETA (Unique to City) */}
        <div 
          onClick={() => setActiveTab('emergency-response')}
          className="card-clean p-3 sm:p-3.5 rounded-2xl cursor-pointer hover:border-emerald-300 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Ambulance className="w-3.5 h-3.5 text-emerald-600" />
              Emergency Response Time
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
              AI Green-Wave
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
              {simResults.aiOptimized.emergencyEtaMin}
            </span>
            <span className="text-xs text-slate-500 font-mono">minutes</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            Standard: <span className="line-through text-slate-400">{simResults.after.emergencyEtaMin} min</span> • Saved: <b className="text-emerald-700 font-bold">-{simResults.after.emergencyEtaMin - simResults.aiOptimized.emergencyEtaMin} min</b>
          </p>
        </div>

      </div>
    </div>
  );
};
