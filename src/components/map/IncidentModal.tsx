import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Hospital, 
  Sparkles, 
  X, 
  CheckCircle2,
  Play
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { AIConfidenceMeter } from '../common/AIConfidenceMeter';

export const IncidentModal: React.FC = () => {
  const { 
    activeIncident, 
    activeHospital, 
    activeCorridor, 
    dismissIncidentModal, 
    startAnimatedDispatch,
    isDispatching,
    optimizedRouteVisible
  } = useCity();

  if (!activeIncident && !activeHospital && !activeCorridor) return null;

  // 1. Incident Card
  if (activeIncident) {
    const isOptimized = activeIncident.status === 'optimized' || optimizedRouteVisible;

    return (
      <div className="absolute top-3 right-3 z-[1000] w-80 sm:w-96 rounded-2xl border-2 border-rose-500 shadow-2xl p-4 bg-white text-slate-900 animate-in slide-in-from-right-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 font-mono">
                  {activeIncident.id}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {activeIncident.severity}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {activeIncident.title}
              </h3>
            </div>
          </div>

          <button
            onClick={dismissIncidentModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{activeIncident.locationName}</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {activeIncident.description}
          </p>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Hospital className="w-4 h-4 text-blue-600" />
            <span className="font-bold">Target Destination</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-blue-800 font-medium">{activeIncident.targetDestinationName}</span>
            <AIConfidenceMeter score={97.4} label="Routing Confidence" variant="badge" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-100">
            <div className="p-2 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">STANDARD ETA</span>
              <span className="text-base font-mono font-bold text-rose-600">
                {activeIncident.standardETA} min
              </span>
            </div>

            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI ROUTE
              </span>
              <span className="text-base font-mono font-bold text-emerald-700">
                {activeIncident.optimizedETA} min
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <button
            onClick={() => startAnimatedDispatch(activeIncident.id)}
            disabled={isDispatching}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition transform hover:scale-[1.01]"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isDispatching ? 'animate-spin' : ''}`} />
            <span>{isDispatching ? 'Unit In Transit...' : activeIncident.dispatchButtonText}</span>
          </button>
        </div>

      </div>
    );
  }

  // 2. Hospital Details
  if (activeHospital) {
    return (
      <div className="absolute top-3 right-3 z-[1000] w-80 sm:w-96 rounded-2xl border border-slate-200 shadow-2xl p-4 bg-white text-slate-900 animate-in slide-in-from-right-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 font-mono">{activeHospital.id}</span>
              <h3 className="text-sm font-bold text-slate-900">{activeHospital.name}</h3>
            </div>
          </div>
          <button onClick={dismissIncidentModal} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">EMERGENCY CAPACITY</span>
            <span className="text-lg font-mono font-bold text-amber-600">{activeHospital.emergencyCapacityPct}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">AVAILABLE ICU BEDS</span>
            <span className="text-lg font-mono font-bold text-emerald-600">{activeHospital.availableBeds} / {activeHospital.totalBeds}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
