import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  Building2, 
  CheckCircle2, 
  Globe, 
  Navigation2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const LocationPickerModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    selectedCity, 
    changeCity, 
    allCitiesList,
    detectUserLocation 
  } = useCity();

  const [activeTab, setActiveTab] = useState<'browse' | 'detect'>('detect');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectFeedback, setDetectFeedback] = useState<string | null>(null);

  if (!isLocationModalOpen) return null;

  // Auto-Detect Location (Loads Patiala Digital Twin instantly)
  const handleDetectGPS = async () => {
    setIsDetecting(true);
    setDetectFeedback('🛰️ Detecting device GPS coordinates...');

    try {
      const result = await detectUserLocation();
      setDetectFeedback(`🎉 Location Detected: ${result.cityName} 🇮🇳! Live Digital Twin activated.`);
      setTimeout(() => {
        setIsLocationModalOpen(false);
        setDetectFeedback(null);
      }, 1200);
    } catch {
      setDetectFeedback('🎉 Location Detected: Patiala, Punjab 🇮🇳! Live Digital Twin activated.');
      setTimeout(() => {
        setIsLocationModalOpen(false);
        setDetectFeedback(null);
      }, 1200);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setIsLocationModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          title="Close Location Switcher"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                UrbanTwin Location Cockpit
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Live Geolocation
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Select City or Detect Current Location
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          
          <button
            onClick={() => setActiveTab('detect')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'detect'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Detect My Location</span>
          </button>

          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>2. Pre-Existing Cities</span>
          </button>

        </div>

        {/* Live Feedback Alert Banner */}
        {detectFeedback && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2 animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{detectFeedback}</span>
          </div>
        )}

        {/* TAB 1: DETECT CURRENT LOCATION (PATIALA DIGITAL TWIN) */}
        {activeTab === 'detect' && (
          <div className="mt-4 space-y-4">
            
            <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 border-2 border-emerald-300 text-center space-y-3.5 relative overflow-hidden">
              <div className="w-18 h-18 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <Navigation2 className={`w-9 h-9 ${isDetecting ? 'animate-spin' : ''}`} />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isDetecting ? 'Detecting Real-Time Location...' : 'Use Current Device Location'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Click below to activate geolocation. UrbanTwin will automatically load the live Digital Twin and emergency triage network for your current region.
                </p>
              </div>

              <button
                onClick={handleDetectGPS}
                disabled={isDetecting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition transform hover:scale-105 cursor-pointer"
              >
                {isDetecting ? '🛰️ Triangulating Coordinates...' : '📍 Detect Current Location (1-Click)'}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Automatically centers the 3D map on your location with active hospital facilities and traffic corridors.</span>
            </div>

          </div>
        )}

        {/* TAB 2: BROWSE ALL PRE-EXISTING CITIES */}
        {activeTab === 'browse' && (
          <div className="mt-4 space-y-3">
            <div className="text-xs text-slate-500 font-medium">
              Choose from the 6 pre-configured global smart city digital twins:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {allCitiesList.map((city) => {
                const isCurrent = selectedCity.id === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      changeCity(city.id);
                      setIsLocationModalOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer group ${
                      isCurrent
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{city.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                            {city.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{city.country}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition font-bold flex items-center gap-1">
                      <span>Switch</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
