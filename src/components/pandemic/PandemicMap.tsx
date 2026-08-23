import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle,
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
  Maximize2
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { PandemicFacility, PandemicFacilityType } from '../../types/pandemic';
import { getPandemicFacilitiesForCity } from '../../data/pandemicFacilitiesData';
import { AIConfidenceMeter } from '../common/AIConfidenceMeter';

// Custom DivIcons for Pandemic Map Markers
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
  }

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="w-9 h-9 rounded-2xl ${bgClass} border-2 shadow-lg flex items-center justify-center text-base transform hover:scale-110 transition cursor-pointer">
        <span>${iconSvg}</span>
      </div>
      <div class="absolute -bottom-1 w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 ring-2 ring-white' : 'bg-red-500 ring-2 ring-white'}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
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
  const [showOxygen, setShowOxygen] = useState(true);
  const [showContainment, setShowContainment] = useState(true);
  
  const [selectedFacility, setSelectedFacility] = useState<PandemicFacility | null>(null);

  const facilities = getPandemicFacilitiesForCity(
    selectedCity.id,
    selectedCity.coordinates[0],
    selectedCity.coordinates[1],
    selectedCity.name
  );

  const filteredFacilities = facilities.filter(f => {
    if (f.type === 'hospital') return showHospitals;
    if (f.type === 'dispensary') return showDispensaries;
    if (f.type === 'testing_booth') return showTesting;
    if (f.type === 'oxygen_depot') return showOxygen;
    return true;
  });

  const containmentZones = facilities.filter(f => f.type === 'containment_zone' && showContainment);

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
                Pandemic Emergency Infrastructure Twin
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {selectedCity.name} {selectedCity.flag}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
              Open Hospitals, Dispensaries, Testing Booths & Quarantine Zones
            </h3>
          </div>
        </div>

        {/* Filter Toggle Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              showHospitals ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🏥</span>
            <span>Hospitals</span>
          </button>

          <button
            onClick={() => setShowDispensaries(!showDispensaries)}
            className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              showDispensaries ? 'bg-teal-50 border-teal-300 text-teal-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>💊</span>
            <span>Dispensaries</span>
          </button>

          <button
            onClick={() => setShowTesting(!showTesting)}
            className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              showTesting ? 'bg-purple-50 border-purple-300 text-purple-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🧪</span>
            <span>Testing Booths</span>
          </button>

          <button
            onClick={() => setShowOxygen(!showOxygen)}
            className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              showOxygen ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🚚</span>
            <span>Oxygen Depots</span>
          </button>

          <button
            onClick={() => setShowContainment(!showContainment)}
            className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              showContainment ? 'bg-red-100 border-red-400 text-red-900 font-extrabold' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <span>🛡️</span>
            <span>Quarantine Zones</span>
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
        <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 shadow-md text-[11px] font-bold text-slate-700 hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1 text-rose-700">🏥 Apex Hospital</span>
          <span className="flex items-center gap-1 text-teal-700">💊 Civil Clinic</span>
          <span className="flex items-center gap-1 text-purple-700">🧪 RT-PCR Kiosk</span>
          <span className="flex items-center gap-1 text-red-600">🔴 Quarantine Area</span>
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

          {/* Containment Zone Circles */}
          {containmentZones.map(cz => (
            <React.Fragment key={cz.id}>
              <Circle
                center={cz.coordinates}
                radius={cz.quarantineRadiusMeters || 400}
                pathOptions={{
                  color: '#dc2626',
                  fillColor: '#ef4444',
                  fillOpacity: 0.25,
                  weight: 2,
                  dashArray: '5, 5'
                }}
              />
              <Marker
                position={cz.coordinates}
                icon={L.divIcon({
                  html: `
                    <div class="px-2 py-1 rounded-xl bg-red-600 text-white font-extrabold text-[10px] shadow-lg border border-white whitespace-nowrap flex items-center gap-1 animate-pulse">
                      <span>🛡️ Containment Zone</span>
                    </div>
                  `,
                  className: '',
                  iconAnchor: [60, 10]
                })}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <span className="font-extrabold text-red-600 block">{cz.name}</span>
                    <span className="text-slate-600">{cz.address}</span>
                    <div className="text-[10px] font-bold text-red-700 bg-red-50 p-1.5 rounded-lg">
                      {cz.statusText}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {/* Facility Markers */}
          {filteredFacilities.map(f => (
            <Marker
              key={f.id}
              position={f.coordinates}
              icon={createFacilityIcon(f.type, f.isOpen)}
              eventHandlers={{
                click: () => setSelectedFacility(f)
              }}
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

                  {f.type === 'oxygen_depot' && (
                    <div className="bg-blue-50 p-1.5 rounded-lg text-[10px] text-blue-800">
                      <span className="block font-bold">Reserve Cylinders: {f.oxygenStockCylinders}</span>
                      <span>Cryogenic Buffer Active</span>
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
