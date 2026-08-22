import React from 'react';
import { 
  Network, 
  Cpu, 
  BrainCircuit, 
  SlidersHorizontal, 
  LayoutDashboard, 
  Database, 
  Code,
  CheckCircle2
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-6 space-y-6 pb-12">
      
      {/* Header */}
      <div className="card-clean p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">
              How UrbanTwin Works
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              From raw city data to smart decisions in 5 simple steps.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Step Pipeline */}
      <div className="card-clean rounded-3xl p-6 bg-white border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
          End-to-End Smart City Flow
        </span>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Database className="w-4 h-4" />
              <span className="text-xs font-bold font-mono">1. SENSORS</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Traffic cameras, hospital beds, and road telemetry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-bold font-mono">2. DIGITAL TWIN</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Combines city systems into one live virtual model.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <BrainCircuit className="w-4 h-4" />
              <span className="text-xs font-bold font-mono">3. PREDICTION</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Detects bottlenecks and forecasts congestion early.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-bold font-mono">4. SIMULATOR</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Tests what-if scenarios safely before real-world changes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-xs font-bold font-mono">5. ACTIONS</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Recommends green-wave routes and optimal traffic diversions.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
