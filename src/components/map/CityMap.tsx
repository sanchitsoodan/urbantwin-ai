import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polyline, 
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import { useCity } from '../../context/CityContext';
import { MapLayerSidebar, MAP_TILE_PROVIDERS } from './MapLayerSidebar';
import { IncidentModal } from './IncidentModal';
import { AnimatedDispatchAmbulance } from './AnimatedDispatchAmbulance';
import { MapLegend } from './MapLegend';
import { AIConfidenceMeter } from '../common/AIConfidenceMeter';
import { 
  Sparkles, 
  AlertTriangle, 
  Hospital, 
  Play, 
  X, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Droplet, 
  Car,
  MousePointer,
  Navigation,
  CheckCircle2
} from 'lucide-react';

const createCustomIcon = (htmlStr: string, size: [number, number], anchor: [number, number]) => {
  return L.divIcon({
    html: htmlStr,
    className: '',
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -anchor[1]]
  });
};

const createCrashBadgeIcon = (title: string, icon = '🚨') => {
  return createCustomIcon(`
    <div style="display:flex;align-items:center;gap:4px;cursor:pointer;">
      <div style="width:34px;height:34px;border-radius:50%;background:#dc2626;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(220,38,38,0.5);border:3px solid white;font-size:16px;">
        ${icon}
      </div>
      <div style="background:#ffffff;border:2px solid #dc2626;color:#991b1b;font-weight:800;font-size:11px;padding:3px 8px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.15);white-space:nowrap;">
        ${title}
      </div>
    </div>
  `, [180, 36], [17, 18]);
};

const createHospitalBadgeIcon = (name: string, beds: number) => {
  return createCustomIcon(`
    <div style="display:flex;align-items:center;gap:4px;cursor:pointer;">
      <div style="width:32px;height:32px;border-radius:50%;background:#059669;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(5,150,105,0.4);border:2px solid white;font-size:15px;">
        🏥
      </div>
      <div style="background:#ffffff;border:2px solid #059669;color:#065f46;font-weight:800;font-size:11px;padding:3px 8px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.15);white-space:nowrap;">
        ${name} (${beds} Beds)
      </div>
    </div>
  `, [200, 34], [16, 17]);
};

const createUtilityDepotIcon = (name: string, activeCrews: number) => {
  return createCustomIcon(`
    <div style="display:flex;align-items:center;gap:4px;cursor:pointer;">
      <div style="width:32px;height:32px;border-radius:50%;background:#0284c7;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(2,132,199,0.4);border:2px solid white;font-size:15px;">
        🏢
      </div>
      <div style="background:#ffffff;border:2px solid #0284c7;color:#0369a1;font-weight:800;font-size:11px;padding:3px 8px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.15);white-space:nowrap;">
        ${name.split(' ')[0]} Water Works (${activeCrews} Vans)
      </div>
    </div>
  `, [220, 34], [16, 17]);
};

const createDetourTagIcon = (label: string) => {
  return createCustomIcon(`
    <div style="background:#059669;color:#ffffff;font-weight:800;font-size:11px;padding:4px 10px;border-radius:14px;box-shadow:0 4px 12px rgba(5,150,105,0.4);border:2px solid white;display:flex;align-items:center;gap:4px;white-space:nowrap;">
      <span>🔀</span>
      <span>${label}</span>
    </div>
  `, [220, 30], [110, 15]);
};

const createAIBypassTagIcon = (name: string, timeSaved: number) => {
  return createCustomIcon(`
    <div style="background:#065f46;color:#ffffff;font-weight:800;font-size:11px;padding:4px 10px;border-radius:14px;box-shadow:0 4px 14px rgba(6,95,70,0.5);border:2px solid #34d399;display:flex;align-items:center;gap:5px;white-space:nowrap;">
      <span>🟢</span>
      <span>AI Low-Traffic Bypass (-${timeSaved} min)</span>
    </div>
  `, [240, 30], [120, 15]);
};

const createCongestionChokeTagIcon = (name: string) => {
  return createCustomIcon(`
    <div style="background:#991b1b;color:#ffffff;font-weight:800;font-size:10px;padding:3px 8px;border-radius:12px;box-shadow:0 4px 12px rgba(153,27,27,0.5);border:2px solid #f87171;display:flex;align-items:center;gap:4px;white-space:nowrap;">
      <span>⛔</span>
      <span>Traffic Diverted Away</span>
    </div>
  `, [180, 26], [90, 13]);
};

// Map click listener for custom incident placement
const MapClickHandler: React.FC = () => {
  const { placementMode, addCustomIncidentAt } = useCity();

  useMapEvents({
    click: (e) => {
      if (placementMode === 'accident') {
        addCustomIncidentAt([e.latlng.lat, e.latlng.lng], 'accident');
      } else if (placementMode === 'utility') {
        addCustomIncidentAt([e.latlng.lat, e.latlng.lng], 'utility');
      }
    }
  });

  return null;
};

const MapViewController: React.FC<{ target: [number, number] | null; center: [number, number]; zoom: number }> = ({ target, center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (target) {
      map.flyTo(target, 14, { duration: 1.0 });
    }
  }, [target, map]);

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
};

interface CityMapProps {
  customHeight?: string;
  hideSidebar?: boolean;
}

export const CityMap: React.FC<CityMapProps> = ({ customHeight, hideSidebar }) => {
  const { 
    selectedCity,
    layers, 
    activeIncidentsList,
    placementMode,
    setPlacementMode,
    clearAllIncidents,
    resetDefaultIncidents,
    setActiveIncident, 
    setActiveHospital, 
    setActiveCorridor,
    optimizedRouteVisible, 
    startAnimatedDispatch,
    isDispatching,
    mapFocusTarget,
    implementedSolutions,
    activeScenarioDetour,
    mapTileStyle,
    bypassRoutes,
    selectedBypassRoute,
    isAIBypassLayerActive,
    toggleAIBypassLayer
  } = useCity();

  const [detourBannerDismissed, setDetourBannerDismissed] = useState(false);
  const [routeBannerDismissed, setRouteBannerDismissed] = useState(false);

  useEffect(() => {
    setDetourBannerDismissed(false);
    setRouteBannerDismissed(false);
  }, [activeScenarioDetour, optimizedRouteVisible]);

  const isLayerActive = (id: string) => layers.find(l => l.id === id)?.active ?? true;
  const currentTileConfig = MAP_TILE_PROVIDERS[mapTileStyle] || MAP_TILE_PROVIDERS['positron'];

  const routesToShow = selectedBypassRoute 
    ? [selectedBypassRoute]
    : bypassRoutes;

  return (
    <div className={`relative w-full ${customHeight || 'h-[500px] lg:h-[620px]'} rounded-3xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-100`}>
      
      {/* Clean Filter Bar */}
      {!hideSidebar && <MapLayerSidebar />}

      {/* Detail Modal */}
      <IncidentModal />

      {/* Always Visible Map Legend */}
      <MapLegend />

      {/* CUSTOM INCIDENT PLACEMENT TOOLBAR */}
      <div className="absolute top-14 left-3 z-[1000] flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-md">
        <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 hidden sm:inline">
          Incident Tool:
        </span>

        {/* 1. Spawn Accident */}
        <button
          onClick={() => setPlacementMode(placementMode === 'accident' ? 'none' : 'accident')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
            placementMode === 'accident'
              ? 'bg-rose-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-300 animate-pulse'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
          }`}
          title="Click this then click anywhere on the map to place an accident"
        >
          <Car className="w-3.5 h-3.5" />
          <span>{placementMode === 'accident' ? 'Click on Map 📍' : '+ Accident'}</span>
        </button>

        {/* 2. Spawn Water Shortage */}
        <button
          onClick={() => setPlacementMode(placementMode === 'utility' ? 'none' : 'utility')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
            placementMode === 'utility'
              ? 'bg-sky-600 text-white border-sky-700 shadow-sm ring-2 ring-sky-300 animate-pulse'
              : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
          }`}
          title="Click this then click anywhere on the map to place a water shortage"
        >
          <Droplet className="w-3.5 h-3.5" />
          <span>{placementMode === 'utility' ? 'Click on Map 📍' : '+ Water Leak'}</span>
        </button>

        {/* 3. Clear All Incidents */}
        <button
          onClick={clearAllIncidents}
          className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-bold transition cursor-pointer"
          title="Clear all incidents (Leave map completely clean)"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* 4. Reset Defaults */}
        {activeIncidentsList.length === 0 && (
          <button
            onClick={resetDefaultIncidents}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition cursor-pointer"
            title="Restore default city events"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
        )}
      </div>

      {/* Floating AI Twin Model Confidence Indicator */}
      <div className="absolute bottom-3 left-3 z-[1000] hidden sm:block">
        <AIConfidenceMeter score={96.4} label="Twin Accuracy" variant="map-pill" />
      </div>

      {/* AI LOW-TRAFFIC BYPASS ACTIVE BANNER */}
      {isAIBypassLayerActive && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[2000] px-4 py-2 rounded-2xl bg-emerald-900 text-white text-xs font-bold shadow-xl border border-emerald-400/50 flex items-center gap-2.5 animate-in fade-in-50">
          <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>🟢 AI Low-Traffic Alternate Routes Active • Commuter Volume Diverted</span>
          <button 
            onClick={() => toggleAIBypassLayer(false)}
            className="p-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 transition cursor-pointer"
            title="Hide AI Bypass Layer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Placement Mode Helper Banner */}
      {placementMode !== 'none' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[2000] px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xl border border-white/40 flex items-center gap-2 animate-bounce">
          <MousePointer className="w-4 h-4 text-emerald-400" />
          <span>Click anywhere on the map to place {placementMode === 'accident' ? 'an accident 🚨' : 'a water leak 🚰'}!</span>
          <button onClick={() => setPlacementMode('none')} className="p-0.5 rounded-full hover:bg-slate-700 cursor-pointer">
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      )}

      {/* Leaflet Map */}
      <MapContainer
        center={selectedCity.coordinates}
        zoom={selectedCity.zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapViewController 
          target={mapFocusTarget} 
          center={selectedCity.coordinates} 
          zoom={selectedCity.zoom} 
        />

        <MapClickHandler />

        <TileLayer
          key={mapTileStyle}
          attribution={currentTileConfig.attribution}
          url={currentTileConfig.url}
          maxZoom={19}
        />

        {/* Live Animated Emergency Dispatch Vehicle */}
        <AnimatedDispatchAmbulance />

        {/* Traffic Corridors (Normal Baseline) */}
        {isLayerActive('traffic') && !isAIBypassLayerActive && selectedCity.corridors.map(corridor => {
          const color = 
            corridor.congestionLevel === 'High' && !implementedSolutions ? '#dc2626' :
            corridor.congestionLevel === 'Moderate' ? '#d97706' : '#2563eb';

          return (
            <Polyline
              key={corridor.id}
              positions={corridor.coordinates}
              pathOptions={{
                color: color,
                weight: 6,
                opacity: 0.85,
                lineCap: 'round'
              }}
              eventHandlers={{
                click: () => setActiveCorridor(corridor)
              }}
            />
          );
        })}

        {/* ========================================================================= */}
        {/* 🛣️ AI PROPOSED LOW-TRAFFIC BYPASS CORRIDORS (DISTINCT MACRO AI SOLUTIONS) */}
        {/* ========================================================================= */}
        {isAIBypassLayerActive && routesToShow.map((byp) => (
          <React.Fragment key={byp.id}>
            {/* 1. Congested Arterial (Dashed Red Line) */}
            <Polyline
              positions={byp.congestedCoordinates}
              pathOptions={{
                color: '#dc2626',
                weight: 7,
                opacity: 0.9,
                dashArray: '8, 8'
              }}
            />
            {byp.congestedCoordinates.length > 1 && (
              <Marker
                position={byp.congestedCoordinates[Math.floor(byp.congestedCoordinates.length / 2)]}
                icon={createCongestionChokeTagIcon(byp.congestedRoadName)}
              />
            )}

            {/* 2. AI Proposed Low-Traffic Alternate Bypass (Glowing Solid Emerald Line) */}
            <Polyline
              positions={byp.proposedBypassCoordinates}
              pathOptions={{
                color: '#059669',
                weight: 8,
                opacity: 0.95,
                lineCap: 'round'
              }}
            />
            {byp.proposedBypassCoordinates.length > 1 && (
              <Marker
                position={byp.proposedBypassCoordinates[Math.floor(byp.proposedBypassCoordinates.length / 2)]}
                icon={createAIBypassTagIcon(byp.name, byp.timeSavedMin)}
              />
            )}
          </React.Fragment>
        ))}

        {/* WHAT-IF SCENARIO BLOCKED SEGMENT (RED) */}
        {activeScenarioDetour && activeScenarioDetour.blockedSegments.map((seg, idx) => (
          <Polyline
            key={`blocked-${idx}`}
            positions={seg}
            pathOptions={{
              color: '#dc2626',
              weight: 8,
              opacity: 0.95,
              dashArray: '8, 8'
            }}
          />
        ))}

        {/* WHAT-IF SCENARIO DETOUR ROUTE (GREEN) */}
        {activeScenarioDetour && (
          <>
            <Polyline
              positions={activeScenarioDetour.detourRoute}
              pathOptions={{
                color: '#059669',
                weight: 7,
                opacity: 0.95,
                lineCap: 'round'
              }}
            />
            {activeScenarioDetour.detourRoute.length > 1 && (
              <Marker
                position={activeScenarioDetour.detourRoute[Math.floor(activeScenarioDetour.detourRoute.length / 2)]}
                icon={createDetourTagIcon('AI Detour Bypass')}
              />
            )}
          </>
        )}

        {/* Active Incidents (Default or Custom Placed) */}
        {isLayerActive('accidents') && activeIncidentsList.map(incident => (
          <Marker
            key={incident.id}
            position={incident.coordinates}
            icon={createCrashBadgeIcon(
              incident.isCustom 
                ? (incident.category === 'utility' ? 'Water Leak' : 'Accident')
                : (incident.title.split(' ')[0] + ' ' + (incident.category === 'utility' ? 'Repair' : 'Crash')),
              incident.vehicleIcon
            )}
            eventHandlers={{
              click: () => setActiveIncident(incident)
            }}
          />
        ))}

        {/* Hospitals */}
        {isLayerActive('hospitals') && selectedCity.hospitals.map(hospital => (
          <Marker
            key={hospital.id}
            position={hospital.coordinates}
            icon={createHospitalBadgeIcon(hospital.name.split(' ')[0], hospital.availableBeds)}
            eventHandlers={{
              click: () => setActiveHospital(hospital)
            }}
          />
        ))}

        {/* Municipal Water Works & Utility Depot Marker */}
        {selectedCity.utilityDepot && (
          <Marker
            position={selectedCity.utilityDepot.coordinates}
            icon={createUtilityDepotIcon(selectedCity.utilityDepot.name, selectedCity.utilityDepot.activeCrews)}
          />
        )}

        {/* DUAL EMERGENCY ROUTE VISUALIZATION (ONLY DURING DISPATCH) */}
        {!activeScenarioDetour && !isAIBypassLayerActive && optimizedRouteVisible && activeIncidentsList[0] && (
          <>
            <Polyline
              positions={activeIncidentsList[0].standardRoute}
              pathOptions={{
                color: '#dc2626',
                weight: 5,
                opacity: 0.85,
                dashArray: '8, 8'
              }}
            />
            <Polyline
              positions={activeIncidentsList[0].optimizedRoute}
              pathOptions={{
                color: '#059669',
                weight: 7,
                opacity: 0.95,
                lineCap: 'round'
              }}
            />
          </>
        )}

      </MapContainer>
    </div>
  );
};
