import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Compass, 
  Plus, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Navigation2, 
  AlertCircle,
  Building2,
  ArrowRight
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { forwardGeocodeCity } from '../../services/locationService';
import { soundEngine } from '../../services/audioService';

export const LocationPickerModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    selectedCity, 
    changeCity, 
    allCitiesList,
    detectUserLocation,
    addNewCustomCity 
  } = useCity();

  const [activeTab, setActiveTab] = useState<'browse' | 'detect' | 'add'>('browse');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectFeedback, setDetectFeedback] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Add Custom City Form State
  const [cityNameInput, setCityNameInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [flagInput, setFlagInput] = useState('🏙️');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isLocationModalOpen) return null;

  // Auto-Detect GPS Location
  const handleDetectGPS = async () => {
    setIsDetecting(true);
    setDetectFeedback({ msg: '🛰️ Querying device GPS satellite & network triangulation...', type: 'info' });

    try {
      const result = await detectUserLocation();
      if (!result.isNewCustom) {
        setDetectFeedback({
          msg: `✅ Matched nearest preset Digital Twin: ${result.cityName} (${result.distanceKm} km away)!`,
          type: 'success'
        });
      } else {
        setDetectFeedback({
          msg: `🎉 Detected location: ${result.cityName}! Created a live Digital Twin for your region!`,
          type: 'success'
        });
      }
      setTimeout(() => {
        setIsLocationModalOpen(false);
        setDetectFeedback(null);
      }, 1500);
    } catch (err: any) {
      setDetectFeedback({
        msg: `⚠️ ${err?.message || 'Could not acquire GPS position. Please select manually.'}`,
        type: 'error'
      });
    } finally {
      setIsDetecting(false);
    }
  };

  // Auto-fill coordinates from city name using forward geocoding
  const handleSearchCityName = async () => {
    if (!cityNameInput.trim()) return;
    setIsSearchingGeocode(true);
    setFormError('');

    try {
      const geo = await forwardGeocodeCity(cityNameInput.trim());
      if (geo) {
        setCountryInput(geo.countryName);
        setLatInput(geo.lat.toFixed(4));
        setLngInput(geo.lng.toFixed(4));
        soundEngine.playClick();
      } else {
        setFormError('City not found via auto-lookup. Please enter coordinates manually.');
      }
    } catch {
      setFormError('Geocoding service unavailable. Enter coordinates manually.');
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  // Submit New Custom City
  const handleAddCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!cityNameInput.trim()) {
      setFormError('Please enter a city name.');
      return;
    }

    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setFormError('Please enter valid Latitude (-90 to 90) and Longitude (-180 to 180).');
      return;
    }

    addNewCustomCity(
      cityNameInput.trim(),
      countryInput.trim() || 'Global',
      flagInput.trim() || '🏙️',
      [lat, lng]
    );

    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
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
                Digital Twin Geolocation Manager
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {allCitiesList.length} Active Cities
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Select or Add Digital Twin Location
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Pre-Existing Cities</span>
          </button>

          <button
            onClick={() => setActiveTab('detect')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'detect'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Detect My GPS</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'add'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>➕ Add Any City</span>
          </button>

        </div>

        {/* Live Feedback Alert Banner */}
        {detectFeedback && (
          <div className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-center gap-2 animate-in fade-in-50 ${
            detectFeedback.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : detectFeedback.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}>
            {detectFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : detectFeedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
            )}
            <span className="font-semibold">{detectFeedback.msg}</span>
          </div>
        )}

        {/* TAB 1: BROWSE ALL PRE-EXISTING CITIES */}
        {activeTab === 'browse' && (
          <div className="mt-4 space-y-3">
            <div className="text-xs text-slate-500 font-medium">
              Click any city below to instantly switch the 3D map telemetry, trauma hospitals, and traffic corridors:
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

        {/* TAB 2: DETECT USER GPS LOCATION */}
        {activeTab === 'detect' && (
          <div className="mt-4 space-y-4">
            
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 border-2 border-emerald-300 text-center space-y-3 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Navigation2 className={`w-8 h-8 ${isDetecting ? 'animate-spin' : ''}`} />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isDetecting ? 'Acquiring GPS Position...' : 'Detect My Exact Location'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                  UrbanTwin will query your device GPS coordinates. If you are near a preset city (e.g. Chandigarh, Delhi, Mumbai, Bengaluru, London, New York), it jumps there. Otherwise, it generates a custom live Digital Twin for your location!
                </p>
              </div>

              <button
                onClick={handleDetectGPS}
                disabled={isDetecting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition transform hover:scale-105 cursor-pointer"
              >
                {isDetecting ? '🛰️ Triangulating Satellite...' : '📍 Detect Current Location (1-Click)'}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span>💡</span>
              <span>Your browser will ask for location permission. Click <b>"Allow"</b> when prompted.</span>
            </div>

          </div>
        )}

        {/* TAB 3: ADD CUSTOM CITY MANUALLY */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddCitySubmit} className="mt-4 space-y-3.5">
            
            {formError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950">
              ✨ <b>Create Any Digital Twin:</b> Type any city worldwide (e.g., <i>Tokyo, Paris, Dubai, Sydney, Toronto, Mohali, Panchkula</i>). We automatically generate 3 Trauma Hospitals, Traffic Corridors, and Emergency Dispatch routes for it!
            </div>

            {/* City Name & Auto-Lookup */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>City Name</span>
                <button
                  type="button"
                  onClick={handleSearchCityName}
                  disabled={isSearchingGeocode || !cityNameInput.trim()}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  {isSearchingGeocode ? 'Searching...' : '🔍 Auto-Fetch Coordinates'}
                </button>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Tokyo or San Francisco"
                  value={cityNameInput}
                  onChange={(e) => setCityNameInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleSearchCityName}
                  disabled={isSearchingGeocode || !cityNameInput.trim()}
                  className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition cursor-pointer"
                >
                  Lookup
                </button>
              </div>
            </div>

            {/* Country & Flag Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Country</label>
                <input
                  type="text"
                  placeholder="e.g. Japan"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Flag Emoji</label>
                <input
                  type="text"
                  placeholder="e.g. 🇯🇵 or 🇺🇸"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Latitude & Longitude Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Latitude (Lat)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 35.6762"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Longitude (Lng)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 139.6503"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Create Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition transform hover:scale-[1.01] cursor-pointer mt-2"
            >
              ✨ Create & Launch Digital Twin
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
