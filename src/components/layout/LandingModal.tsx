import React from 'react';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  SlidersHorizontal, 
  X,
  MapPin,
  BrainCircuit,
  Building2
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

interface LandingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LandingModal: React.FC<LandingModalProps> = ({ isOpen, onClose }) => {
  const { startDemo } = useDemo();

  if (!isOpen) return null;

  const handleLaunchDemo = () => {
    onClose();
    startDemo();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto card-clean p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Smart City Digital Twin</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            UrbanTwin AI
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1">
            Simulate today. Decide better tomorrow.
          </p>
        </div>

        {/* Core Concept */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <span className="text-rose-600 font-bold">“Cities are rich in data — poor in foresight.”</span>
            <br />
            Traditional dashboards only show what already happened. UrbanTwin connects traffic, hospitals, water, and strikes to predict problems and fix them in advance.
          </p>
        </div>

        {/* Highlights */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-1">
              <MapPin className="w-4 h-4" />
              <span>Chandigarh Map</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              9 layers: traffic, trauma hospitals, water pressure, and labor strikes.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-amber-600 font-bold mb-1">
              <SlidersHorizontal className="w-4 h-4" />
              <span>What-If Sandbox</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Test road closures, monsoon storms, and crowd surges in virtual safety.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-600 font-bold mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>Green-Wave AI</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Syncs traffic lights to save ambulances 4.2 minutes during trauma emergencies.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition transform hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START GUIDED TOUR (2 MIN)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition"
          >
            <span>Explore City Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
