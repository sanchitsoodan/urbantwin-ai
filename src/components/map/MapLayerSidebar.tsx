import React from 'react';
import { 
  Layers, 
  Car, 
  AlertTriangle, 
  Hospital, 
  MapPin,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Globe,
  Compass
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { LayerId } from '../../types/city';

export type MapTileStyle = 'positron' | 'voyager' | 'satellite';

export const MAP_TILE_PROVIDERS: Record<MapTileStyle, { name: string; url: string; attribution: string; icon: string }> = {
  positron: {
    name: 'Clean Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    icon: '🏢'
  },
  voyager: {
    name: 'Vibrant Streets',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    icon: '🗺️'
  },
  satellite: {
    name: 'HD Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Earthstar Geographics',
    icon: '🛰️'
  }
};

export const MapLayerSidebar: React.FC = () => {
  const { layers, toggleLayer, selectedCity, mapTileStyle, setMapTileStyle } = useCity();

  return (
    <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md">
      
      {/* City Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold shrink-0">
        <span>{selectedCity.flag}</span>
        <span className="hidden sm:inline">{selectedCity.name}</span>
      </div>

      <div className="h-4 w-px bg-slate-200 hidden sm:block" />

      {/* Layer Toggles */}
      <div className="flex items-center gap-1">
        {layers.map(layer => {
          const isActive = layer.active;
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition border ${
                isActive 
                  ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-xs' 
                  : 'bg-white text-slate-400 border-transparent hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
              <span className="text-[11px]">{layer.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-slate-200 hidden md:block" />

      {/* Map Tile Style Switcher (API Provider) */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80">
        {(Object.keys(MAP_TILE_PROVIDERS) as MapTileStyle[]).map(styleKey => {
          const provider = MAP_TILE_PROVIDERS[styleKey];
          const isSelected = mapTileStyle === styleKey;

          return (
            <button
              key={styleKey}
              onClick={() => setMapTileStyle(styleKey)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
              title={`Switch to ${provider.name} Map Tiles`}
            >
              <span>{provider.icon}</span>
              <span className="hidden lg:inline">{provider.name}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
