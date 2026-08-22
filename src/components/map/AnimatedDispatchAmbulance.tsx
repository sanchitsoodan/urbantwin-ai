import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useCity } from '../../context/CityContext';

export const AnimatedDispatchAmbulance: React.FC = () => {
  const { isDispatching, currentAmbulanceCoords, currentVehicleIcon, dispatchProgress, dispatchStageText } = useCity();

  if (!isDispatching || !currentAmbulanceCoords) return null;

  // 36px icon with iconAnchor exactly centered at [18, 18]
  const dynamicIcon = L.divIcon({
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        <!-- Pulsing radar ring strictly centered -->
        <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(220,38,38,0.45);animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></div>
        
        <!-- Physical vehicle badge centered on road -->
        <div style="position:relative;z-index:10;width:30px;height:30px;border-radius:50%;background:#ffffff;border:2.5px solid #dc2626;box-shadow:0 3px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
          <span style="font-size:15px;line-height:1;">${currentVehicleIcon}</span>
        </div>
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });

  return (
    <Marker position={currentAmbulanceCoords} icon={dynamicIcon}>
      <Popup autoPan={false}>
        <div className="p-1 min-w-[200px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              LIVE DISPATCH UNIT
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {dispatchProgress}%
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-800 mt-1">
            {dispatchStageText}
          </p>

          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-150 ease-linear"
              style={{ width: `${dispatchProgress}%` }}
            />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
