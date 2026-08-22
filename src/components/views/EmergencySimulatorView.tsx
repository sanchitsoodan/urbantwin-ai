import React, { useState } from 'react';
import { 
  Ambulance, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Hospital,
  AlertTriangle,
  MapPin,
  Clock,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { CityMap } from '../map/CityMap';

interface TimelineStep {
  step: number;
  label: string;
  subtext: string;
  timeSec: string;
}

export const EmergencySimulatorView: React.FC = () => {
  const { 
    startAnimatedDispatch, 
    stopAnimatedDispatch, 
    isDispatching, 
    dispatchProgress, 
    dispatchStageText,
    selectedCity,
    activeIncidentsList,
    activeIncident,
    setActiveIncident,
    setMapFocusTarget
  } = useCity();

  // Find targeted incident: activeIncident or first incident in list
  const currentIncident = activeIncident || activeIncidentsList[0] || selectedCity.incidents[0];

  const currentHospital = selectedCity.hospitals.find(h => h.name === currentIncident?.targetDestinationName) || selectedCity.hospitals[0];

  const timelineSteps: TimelineStep[] = [
    { 
      step: 1, 
      label: 'Incident Detection & AI Alert', 
      subtext: currentIncident ? currentIncident.title : 'Sensor detection triggers alert', 
      timeSec: '00:00' 
    },
    { 
      step: 2, 
      label: 'Nearest Hospital Triage Match', 
      subtext: `Matched: ${currentIncident?.targetDestinationName || currentHospital.name} (${currentHospital.availableBeds} ICU Beds Available)`, 
      timeSec: '00:08' 
    },
    { 
      step: 3, 
      label: 'Green-Wave Signal Overrides', 
      subtext: 'Traffic lights on arterial corridor switched to permanent green for ambulance', 
      timeSec: '00:18' 
    },
    { 
      step: 4, 
      label: 'Ambulance Arrival at Hospital', 
      subtext: `Direct arrival at ${currentIncident?.targetDestinationName || currentHospital.name} Trauma Center`, 
      timeSec: '00:30' 
    }
  ];

  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-6 space-y-5 pb-12">
      
      {/* Header Banner */}
      <div className="card-clean p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Ambulance className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                Nearest Hospital Dispatch & Green-Wave Simulator
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedCity.name} {selectedCity.flag}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              UrbanTwin dynamically matches every accident to the closest available hospital based on live road distance and open ICU beds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDispatching && (
            <button
              onClick={stopAnimatedDispatch}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
            >
              Stop Animation
            </button>
          )}

          <button
            onClick={() => startAnimatedDispatch(currentIncident?.id)}
            disabled={isDispatching || !currentIncident}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-extrabold shadow-md transition transform hover:scale-[1.02] cursor-pointer"
          >
            <Play className={`w-4 h-4 fill-white ${isDispatching ? 'animate-spin' : ''}`} />
            <span>
              {isDispatching 
                ? 'Ambulance Driving to Hospital...' 
                : `🚨 Dispatch to ${currentIncident?.targetDestinationName || 'Nearest Hospital'}`
              }
            </span>
          </button>
        </div>
      </div>

      {/* Incident Switcher Strip (If multiple incidents or custom placed) */}
      {activeIncidentsList.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-500 uppercase px-2 shrink-0">
            Select Active Event to Dispatch:
          </span>
          {activeIncidentsList.map((inc) => (
            <button
              key={inc.id}
              onClick={() => {
                setActiveIncident(inc);
                setMapFocusTarget(inc.coordinates);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold transition border shrink-0 cursor-pointer ${
                currentIncident?.id === inc.id
                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span>{inc.vehicleIcon}</span>
              <span>{inc.title}</span>
              <span className="text-[10px] opacity-80">
                → {inc.targetDestinationName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Left Timeline & Triage Card (4 cols) | Right Map & Comparison (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Nearest Hospital Match & 4-Stage Timeline */}
        <div className="lg:col-span-4 card-clean rounded-3xl p-5 bg-white border border-slate-200 shadow-sm space-y-4">
          
          {/* Matched Nearest Hospital Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Hospital className="w-3.5 h-3.5 text-emerald-600" />
                Nearest Triage Facility Match
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono">
                {currentHospital.zone}
              </span>
            </div>

            <h3 className="text-sm font-extrabold text-slate-900">
              {currentIncident?.targetDestinationName || currentHospital.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-white border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-500 block">AVAILABLE ICU BEDS</span>
                <span className="text-sm font-mono font-bold text-emerald-700">
                  {currentHospital.availableBeds} Open
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-emerald-200 text-center">
                <span className="text-[10px] text-slate-500 block">CAPACITY LOAD</span>
                <span className="text-sm font-mono font-bold text-slate-800">
                  {currentHospital.emergencyCapacityPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Live Progress Bar during Dispatch */}
          {isDispatching && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-300 space-y-2 animate-in fade-in-50">
              <div className="flex justify-between text-xs font-bold text-blue-900">
                <span>{dispatchStageText}</span>
                <span className="font-mono">{dispatchProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-150"
                  style={{ width: `${dispatchProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 4-Stage Timeline */}
          <div className="space-y-2.5 relative">
            <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-slate-100 -z-0" />

            {timelineSteps.map((step) => {
              const isCurrent = isDispatching && Math.floor((dispatchProgress / 100) * 4) + 1 === step.step;
              const isPast = !isDispatching || Math.floor((dispatchProgress / 100) * 4) + 1 >= step.step;

              return (
                <div
                  key={step.step}
                  className={`relative z-10 p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-2 ring-emerald-200'
                      : isPast
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-white border-slate-100 opacity-40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : isPast
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast && !isCurrent ? '✓' : step.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {step.label}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {step.timeSec}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {step.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcome ETA Summary Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-600">Standard Traffic ETA:</span>
              <span className="text-rose-600 font-bold">{currentIncident?.standardETA || 11.4} min</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-emerald-800 font-bold">AI Green-Wave Route:</span>
              <span className="text-emerald-700 font-extrabold text-sm">{currentIncident?.optimizedETA || 7.2} min</span>
            </div>
            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-emerald-800 font-bold">
              <span>Golden-Hour Saving:</span>
              <span className="bg-emerald-200/80 px-2 py-0.5 rounded-full text-xs font-mono">
                -{((currentIncident?.standardETA || 11.4) - (currentIncident?.optimizedETA || 7.2)).toFixed(1)} Minutes
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Map & Dynamic Route Comparison */}
        <div className="lg:col-span-8 space-y-4">
          <CityMap />

          {/* Dual Route Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <span className="text-xs font-bold text-rose-700">
                  Standard Congested Route (Red)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Red Lights
                </span>
              </div>
              <div className="mt-2.5 space-y-1 text-xs text-slate-700 font-mono">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <b className="truncate max-w-[160px]">{currentIncident?.targetDestinationName}</b>
                </div>
                <div className="flex justify-between">
                  <span>Signal Delay:</span>
                  <b className="text-rose-600">+4.2 min stoppage</b>
                </div>
                <div className="flex justify-between">
                  <span>Standard ETA:</span>
                  <b className="text-rose-600 font-bold text-sm">{currentIncident?.standardETA || 11.4} min</b>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  AI Green-Wave Route (Green)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Nearest Hospital
                </span>
              </div>
              <div className="mt-2.5 space-y-1 text-xs text-slate-700 font-mono">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <b className="text-emerald-800 truncate max-w-[160px]">{currentIncident?.targetDestinationName}</b>
                </div>
                <div className="flex justify-between">
                  <span>Signal Delay:</span>
                  <b className="text-emerald-700">0 min (All Green Lights)</b>
                </div>
                <div className="flex justify-between">
                  <span>Optimized ETA:</span>
                  <b className="text-emerald-700 font-bold text-sm">{currentIncident?.optimizedETA || 7.2} min</b>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
