import React from 'react';
import { CityMap } from '../map/CityMap';
import { AIRecommendationCard } from '../dashboard/AIRecommendationCard';
import { 
  Sparkles, 
  SlidersHorizontal,
  ChevronRight,
  AlertTriangle,
  Play,
  Plus
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

import { AIConfidenceMeter } from '../common/AIConfidenceMeter';

export const CommandCenterView: React.FC = () => {
  const { 
    setActiveTab, 
    startAnimatedDispatch, 
    isDispatching,
    setMapFocusTarget, 
    selectedCity,
    activeIncidentsList,
    setActiveIncident,
    setIsSolutionModalOpen,
    setPlacementMode
  } = useCity();

  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-6 space-y-4 pb-12">
      
      {/* Friendly Guide & Quick Actions Bar */}
      <div className="card-clean p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              {selectedCity.name} Operations Cockpit
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {selectedCity.country} {selectedCity.flag}
            </span>
            <AIConfidenceMeter score={96.4} label="Real-Time Telemetry Precision" variant="badge" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedCity.tagline} • Click markers to view real-time status or place custom events on the map.
          </p>
        </div>

        {/* Quick 1-Click Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => startAnimatedDispatch()}
            disabled={isDispatching || activeIncidentsList.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold transition text-xs shadow-md cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isDispatching ? 'animate-spin' : ''}`} />
            <span>{isDispatching ? 'Unit Driving...' : '🚨 Run Live Dispatch'}</span>
          </button>

          <button
            onClick={() => setIsSolutionModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition text-xs border border-emerald-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Solutions Plan</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Map + AI Recommendation (8 cols) | Right Clean Incident Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Map + Recommendation */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <CityMap />
          <AIRecommendationCard />
        </div>

        {/* Right Column: Clean Live Activity Feed */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Active Incidents Card */}
          <div className="card-clean rounded-3xl p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Live Events ({selectedCity.name})
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {activeIncidentsList.length} Active Alerts
                  </span>
                </div>
              </div>
            </div>

            {/* If no incidents on map */}
            {activeIncidentsList.length === 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-2">
                <span>Map is currently clean with no active disruptions.</span>
                <button
                  onClick={() => setPlacementMode('accident')}
                  className="block mx-auto px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  + Place an Accident
                </button>
              </div>
            )}

            {/* Render Incidents for Active City (Default or Custom) */}
            {activeIncidentsList.map(incident => (
              <div 
                key={incident.id}
                onClick={() => {
                  setMapFocusTarget(incident.coordinates);
                  setActiveIncident(incident);
                }}
                className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 hover:border-rose-300 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <span>{incident.vehicleIcon}</span>
                    <span>{incident.title}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                    {incident.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  {incident.description}
                </p>
                <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-700 font-bold">
                  <span>Inspect & Dispatch Unit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* What-If Sandbox Quick Card */}
          <div 
            onClick={() => setActiveTab('simulator')}
            className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 cursor-pointer transition shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                What-If Sandbox
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Simulate
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-blue-700 transition">
              Test Disruptions in {selectedCity.name}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Block major avenues, add population growth surges, and view dedicated charts for traffic and economy.
            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-blue-700 font-bold pt-2 border-t border-blue-200/60">
              <span>Open Scenario Tester</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
