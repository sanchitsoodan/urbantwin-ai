import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-3 right-3 z-[1000] p-3 rounded-2xl bg-white/95 border border-slate-200 shadow-lg backdrop-blur-sm text-slate-900 max-w-xs transition-all">
      <div 
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Map Legend & Symbols</span>
        </div>
        <button className="text-slate-400 hover:text-slate-700">
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-100 text-xs">
          
          {/* Incidents */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0">
              🚨
            </div>
            <div>
              <span className="font-bold text-slate-800">Crash / Incident</span>
              <span className="text-[10px] text-slate-500 block">Accident blocking traffic lanes</span>
            </div>
          </div>

          {/* Hospitals */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0">
              🏥
            </div>
            <div>
              <span className="font-bold text-slate-800">Trauma Hospital</span>
              <span className="text-[10px] text-slate-500 block">Active emergency triage & ICU</span>
            </div>
          </div>

          {/* Traffic Lines */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-2 rounded-full bg-rose-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Jammed Corridor</span>
              <span className="text-[10px] text-slate-500 block">Heavy traffic congestion</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-2 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">AI Green-Wave Route</span>
              <span className="text-[10px] text-slate-500 block">Smart synchronized signal path</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
