'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Navigation, Target } from 'lucide-react';

interface DiscoveryMapProps {
  center: [number, number];
  results: any[];
  onNavigate: (name: string, location?: string, lat?: number, lng?: number) => void;
}

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

const getCustomIcon = (source: string) => {
  const color = (source === 'ontapp_verified' || source === 'ontapp_member') ? '#0047BB' : '#EF4444';
  
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);">
         <div style="transform: rotate(45deg); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>
         </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function DiscoveryMap({ center, results, onNavigate }: DiscoveryMapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapController center={center} zoom={13} />
      {results.map((result, idx) => result.lat && result.lng ? (
        <Marker 
          key={idx} 
          position={[result.lat, result.lng]} 
          icon={getCustomIcon(result.source)}
        >
          <Popup className="rounded-xl overflow-hidden shadow-2xl border-none p-0">
             <div className="p-3 space-y-2 min-w-[200px]">
                <div className="space-y-0.5">
                   <h4 className="font-black text-[13px] text-slate-900 leading-tight">{result.name}</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">{result.location || 'Lokasi Terdeteksi'}</p>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between gap-3">
                   <div className="flex items-center gap-1.5 text-primary">
                      <Target className="size-3" />
                      <span className="font-black text-[10px]">{result.matchScore}% Synergy</span>
                   </div>
                   <Button 
                     size="sm" 
                     onClick={() => onNavigate(result.name, result.location, result.lat, result.lng)}
                     className="h-7 px-2.5 rounded-lg bg-slate-900 text-white font-black text-[8px] uppercase tracking-widest gap-1 active:scale-95"
                   >
                      <Navigation className="size-2.5" />
                      Navigasi
                   </Button>
                </div>
             </div>
          </Popup>
        </Marker>
      ) : null)}
    </MapContainer>
  );
}
