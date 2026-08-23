import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle,
  Polyline,
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Ban,
  AlertTriangle
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { 
  PandemicFacility, 
  PandemicFacilityType, 
  PandemicAffectedZone, 
  PandemicRoadRestriction 
} from '../../types/pandemic';
import { 
  getPandemicFacilitiesForCity, 
  getPandemicZonesForCity, 
  getPandemicRoadRestrictionsForCity 
} from '../../data/pandemicFacilitiesData';
import { AIConfidenceMeter } from '../common/AIConfidenceMeter';

// Custom DivIcons for Pandemic Map Facilities
const createFacilityIcon = (type: PandemicFacilityType, isOpen: boolean) => {
  let bgClass = 'bg-rose-600 border-white text-white shadow-rose-500/40';
  let iconSvg = '🏥';

  if (type === 'hospital') {
    bgClass = 'bg-rose-600 border-white text-white shadow-rose-500/50';
    iconSvg = '🏥';
  } else if (type === 'dispensary') {
    bgClass = 'bg-teal-600 border-white text-white shadow-teal-500/50';
    iconSvg = '💊';
  } else if (type === 'testing_booth') {
    bgClass = 'bg-purple-600 border-white text-white shadow-purple-500/50';
    iconSvg = '🧪';
  } else if (type === 'oxygen_depot') {
    bgClass = 'bg-blue-600 border-white text-white shadow-blue-500/50';
    iconSvg = '🚚';
  } else if (type === 'grocery_store') {
    bgClass = 'bg-emerald-600 border-white text-white shadow-emerald-500/50';
    iconSvg = '🛒';
  }

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-2xl ${bgClass} border-2 shadow-md flex items-center justify-center text-sm transform hover:scale-110 transition cursor-pointer">
        <span>${iconSvg}</span>
      </div>
      <div class="absolute -bottom-1 w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 ring-2 ring-white' : 'bg-red-500 ring-2 ring-white'}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

// Roadblock Barrier Icon
const createRoadblockIcon = (severity: 'closed' | 'screened_entry') => {
  const isClosed = severity === 'closed';
  const html = `
    <div class="px-2 py-1 rounded-xl ${isClosed ? 'bg-red-700 text-white' : 'bg-amber-500 text-slate-950'} font-extrabold text-[10px] shadow-lg border border-white flex items-center gap-1 cursor-pointer transform hover:scale-110 transition">
      <span>${isClosed ? '⛔' : '⚠️'}</span>
      <span class="truncate">${isClosed ? 'ROAD CLOSED' : 'CHECKPOINT'}</span>
    </div>
  `;
  return L.divIcon({
    html,
    className: '',
    iconSize: [95, 24],
    iconAnchor: [47, 12]
  });
};

function MapViewUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export const PandemicMap: React.FC = () => {
  const { selectedCity } = useCity();

  // Active layer filters
  const [showHospitals, setShowHospitals] = useState(true);
  const [showDispensaries, setShowDispensaries] = useState(true);
  const [showTesting, setShowTesting] = useState(true);
  const [showGroceries, setShowGroceries] = useState(true);
  const [showRedZones, setShowRedZones] = useState(true);
  const [showAmberZones, setShowAmberZones] = useState(true);
  const [showRoadRestrictions, setShowRoadRestrictions] = useState(true);

  const facilities = getPandemicFacilitiesForCity(
    selectedCity.id,
    selectedCity.coordinates[0],
    selectedCity.coordinates[1],
    selectedCity.name
  );

  const zones = getPandemicZonesForCity(
    selectedCity.id,
    selectedCity.coordinates[0],
    selectedCity.coordinates[1],
    selectedCity.name
  );

  const roadRestrictions = getPandemicRoadRestrictionsForCity(
    selectedCity.id,
    selectedCity.coordinates[0],
    selectedCity.coordinates[1],
    selectedCity.name
  );

  const filteredFacilities = facilities.filter(f => {
    if (f.type === 'hospital') return showHospitals;
    if (f.type === 'dispensary') return showDispensaries;
    if (f.type === 'testing_booth') return showTesting;
    if (f.type === 'grocery_store') return showGroceries;
    return true;
  });

  const redZones = zones.filter(z => z.severity === 'red' && showRedZones);
  const amberZones = zones.filter(z => z.severity === 'amber' && showAmberZones);

  return (
    <div className="card-clean p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
      
      {/* Map Header & Interactive Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                Pandemic Emergency GIS Twin
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {selectedCity.name} {selectedCity.flag}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
              Hospitals, Dispensaries, Grocery Stores, Red/Yellow Affected Zones & Roadblocks
            </h3>
          </div>
        </div>

        {/* Filter Toggle Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
              showHospitals ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🏥</span>
            <span>Hospitals</span>
          </button>

          <button
            onClick={() => setShowDispensaries(!showDispensaries)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
              showDispensaries ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>💊</span>
            <span>Dispensaries</span>
          </button>

          <button
            onClick={() => setShowGroceries(!showGroceries)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
              showGroceries ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🛒</span>
            <span>Groceries</span>
          </button>

          <button
            onClick={() => setShowTesting(!showTesting)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-[11px] ${
              showTesting ? 'bg-purple-50 border-purple-300 text-purple-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🧪</span>
            <span>Testing</span>
          </button>

          {/* 🔴 RED AFFECTED ZONES */}
          <button
            onClick={() => setShowRedZones(!showRedZones)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-[11px] font-extrabold ${
              showRedZones ? 'bg-red-100 border-red-400 text-red-900 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
            <span>🔴 Red Zones ({zones.filter(z => z.severity === 'red').length})</span>
          </button>

          {/* 🟡 YELLOW / AMBER BUFFER ZONES */}
          <button
            onClick={() => setShowAmberZones(!showAmberZones)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-[11px] font-extrabold ${
              showAmberZones ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🟡</span>
            <span>Yellow Zones ({zones.filter(z => z.severity === 'amber').length})</span>
          </button>

          {/* ⛔ RESTRICTED ROADS */}
          <button
            onClick={() => setShowRoadRestrictions(!showRoadRestrictions)}
            className={`px-2.5 py-1 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-[11px] font-extrabold ${
              showRoadRestrictions ? 'bg-rose-100 border-rose-400 text-rose-950 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>⛔</span>
            <span>Restricted Roads</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
        
        {/* Floating Confidence Meter Pill */}
        <div className="absolute bottom-3 left-3 z-[1000] pointer-events-auto">
          <AIConfidenceMeter score={97.2} label="Pandemic GIS Accuracy" variant="map-pill" />
        </div>

        {/* Floating Legend */}
        <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 shadow-md text-[10px] font-bold text-slate-700 hidden sm:flex items-center gap-2.5">
          <span className="flex items-center gap-1 text-rose-700">🏥 Hospital</span>
          <span className="flex items-center gap-1 text-teal-700">💊 Clinic</span>
          <span className="flex items-center gap-1 text-red-600">🔴 Red Outbreak Zone</span>
          <span className="flex items-center gap-1 text-amber-600">🟡 Yellow Buffer</span>
          <span className="flex items-center gap-1 text-rose-900">⛔ Roadblock</span>
        </div>

        <MapContainer
          center={selectedCity.coordinates}
          zoom={selectedCity.zoom || 13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapViewUpdater center={selectedCity.coordinates} zoom={selectedCity.zoom || 13} />

          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* 🔴 1. RED HIGH-TRANSMISSION CONTAINMENT CIRCLES */}
          {redZones.map(rz => (
            <React.Fragment key={rz.id}>
              <Circle
                center={rz.coordinates}
                radius={rz.radiusMeters}
                pathOptions={{
                  color: '#dc2626',
                  fillColor: '#ef4444',
                  fillOpacity: 0.35,
                  weight: 2.5,
                  dashArray: '6, 6'
                }}
              />
              <Marker
                position={rz.coordinates}
                icon={L.divIcon({
                  html: `
                    <div class="px-2 py-0.5 rounded-lg bg-red-600 text-white font-extrabold text-[9px] shadow-lg border border-white whitespace-nowrap flex items-center gap-1 animate-pulse">
                      <span>🔴 Red Zone: ${rz.positivityRatePct}% Positivity</span>
                    </div>
                  `,
                  className: '',
                  iconAnchor: [70, 10]
                })}
              >
                <Popup>
                  <div className="p-1.5 space-y-1.5 text-xs text-slate-900 min-w-[210px]">
                    <div className="flex items-center justify-between border-b border-red-100 pb-1">
                      <span className="font-black text-red-700 uppercase tracking-wider text-[10px]">
                        Severe Containment Zone
                      </span>
                      <span className="font-mono text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        {rz.activeCases} Active Cases
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 leading-tight">
                      {rz.name}
                    </h4>
                    <div className="p-1.5 rounded-lg bg-red-50 text-[11px] font-semibold text-red-900">
                      {rz.statusText}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                      {rz.restrictionsDescription}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* 🟡 2. YELLOW / AMBER SURVEILLANCE BUFFER CIRCLES */}
          {amberZones.map(az => (
            <React.Fragment key={az.id}>
              <Circle
                center={az.coordinates}
                radius={az.radiusMeters}
                pathOptions={{
                  color: '#d97706',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.25,
                  weight: 2,
                  dashArray: '4, 4'
                }}
              />
              <Marker
                position={az.coordinates}
                icon={L.divIcon({
                  html: `
                    <div class="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-[9px] shadow-lg border border-white whitespace-nowrap flex items-center gap-1">
                      <span>🟡 Yellow Buffer: ${az.positivityRatePct}% Positivity</span>
                    </div>
                  `,
                  className: '',
                  iconAnchor: [70, 10]
                })}
              >
                <Popup>
                  <div className="p-1.5 space-y-1.5 text-xs text-slate-900 min-w-[210px]">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-1">
                      <span className="font-black text-amber-800 uppercase tracking-wider text-[10px]">
                        Active Surveillance Buffer
                      </span>
                      <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {az.activeCases} Cases
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 leading-tight">
                      {az.name}
                    </h4>
                    <div className="p-1.5 rounded-lg bg-amber-50 text-[11px] font-semibold text-amber-900">
                      {az.statusText}
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                      {az.restrictionsDescription}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* ⛔ 3. RESTRICTED ROADS & CHECKPOINTS */}
          {showRoadRestrictions && roadRestrictions.map(rr => (
            <React.Fragment key={rr.id}>
              <Polyline
                positions={rr.coordinates}
                pathOptions={{
                  color: rr.severity === 'closed' ? '#b91c1c' : '#d97706',
                  weight: 5,
                  dashArray: '8, 8',
                  opacity: 0.9
                }}
              />
              {/* Mid-point Roadblock Icon Marker */}
              <Marker
                position={rr.coordinates[Math.floor(rr.coordinates.length / 2)]}
                icon={createRoadblockIcon(rr.severity)}
              >
                <Popup>
                  <div className="p-1.5 space-y-1 text-xs text-slate-900 min-w-[200px]">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block">
                      {rr.severity === 'closed' ? 'Barricaded Road Closure' : 'Health Screening Checkpoint'}
                    </span>
                    <h4 className="font-extrabold text-slate-900">{rr.name}</h4>
                    <div className="text-[11px] font-bold text-rose-800 bg-rose-50 p-1.5 rounded-lg">
                      {rr.statusText}
                    </div>
                    <p className="text-[10px] text-slate-600">{rr.reason}</p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* 4. FACILITY MARKERS (HOSPITALS, DISPENSARIES, TESTING BOOTHS) */}
          {filteredFacilities.map(f => (
            <Marker
              key={f.id}
              position={f.coordinates}
              icon={createFacilityIcon(f.type, f.isOpen)}
            >
              <Popup>
                <div className="p-1.5 space-y-2 min-w-[220px] text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">
                      {f.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${f.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {f.isOpen ? 'OPEN' : 'RESTRICTED'}
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                    {f.name}
                  </h4>

                  <p className="text-[11px] text-slate-500 font-medium">
                    {f.address}
                  </p>

                  {/* Specific Facility Metrics */}
                  {f.type === 'hospital' && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-slate-400 block">Available Beds</span>
                        <span className="font-mono font-bold text-emerald-600">{f.availableBeds} / {f.totalBeds}</span>
                      </div>
                      <div className="bg-slate-50 p-1.5 rounded-lg">
                        <span className="text-slate-400 block">ICU Beds</span>
                        <span className="font-mono font-bold text-rose-600">{f.icuBeds} Critical</span>
                      </div>
                    </div>
                  )}

                  {f.type === 'dispensary' && (
                    <div className="bg-teal-50 p-1.5 rounded-lg text-[10px] text-teal-800">
                      <span className="block font-bold">Daily Test Capacity: {f.dailyTestingCapacity}</span>
                      <span>Average Wait Time: ~{f.currentWaitTimeMin} mins</span>
                    </div>
                  )}

                  {f.type === 'testing_booth' && (
                    <div className="bg-purple-50 p-1.5 rounded-lg text-[10px] text-purple-800">
                      <span className="block font-bold">RT-PCR Capacity: {f.dailyTestingCapacity}/day</span>
                      <span>Wait Time: ~{f.currentWaitTimeMin} mins</span>
                    </div>
                  )}

                  {f.type === 'grocery_store' && (
                    <div className="bg-emerald-50 p-2 rounded-lg text-[10px] text-emerald-950 space-y-1 border border-emerald-200">
                      <div className="flex justify-between font-bold">
                        <span>Essential Food Stock:</span>
                        <span className="font-mono font-black text-emerald-700">{f.essentialStockPct}% Stocked</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Home Delivery Service:</span>
                        <span className="font-bold text-emerald-800">{f.homeDeliveryAvailable ? '✅ Active (Within 5km)' : '❌ In-Store Only'}</span>
                      </div>
                      {f.tokenSystemActive && (
                        <div className="text-[9px] text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                          🎟️ Socially-Distanced Token Queue Active
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[10px] font-semibold text-slate-500 pt-1">
                    {f.statusText}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>

      </div>

    </div>
  );
};
