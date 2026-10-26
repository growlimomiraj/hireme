import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { ProviderProfile } from '../../types';
import { MapPin, Navigation2, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ServiceMapProps {
  providers: ProviderProfile[];
  onSelectProvider?: (provider: ProviderProfile) => void;
  height?: string;
}

export const ServiceMap: React.FC<ServiceMapProps> = ({
  providers,
  onSelectProvider,
  height = "100%"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { userLocation } = useApp();
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Clean up previous map if container was already initialized
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron clean map tiles (minimalist inDrive style)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // 1. User Location Pin
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px;">
            <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:#B5F33D;opacity:0.4;animation:pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
            <div style="width:20px;height:20px;border-radius:50%;background:#151515;border:2.5px solid #B5F33D;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3);">
              📍
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindTooltip(`<b>Your Location</b><br/>${userLocation.area}`, { direction: 'top', offset: [0, -10] });
      markersGroup.addLayer(userMarker);

      // 2. Coverage Circle (subtle inDrive lime tint)
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        color: '#84CC16',
        fillColor: '#B5F33D',
        fillOpacity: 0.1,
        weight: 1.5,
        radius: 3500
      });
      markersGroup.addLayer(circle);

      // 3. Provider Markers
      providers.forEach(prov => {
        const isOnline = prov.isOnline;
        const icon = L.divIcon({
          className: 'custom-prov-pin',
          html: `
            <div style="cursor:pointer;display:flex;flex-direction:column;align-items:center;">
              <div style="background:#ffffff;border:1.5px solid ${isOnline ? '#65A30D' : '#9CA3AF'};border-radius:9999px;padding:3px 8px;box-shadow:0 4px 12px rgba(0,0,0,0.12);display:flex;align-items:center;gap:4px;white-space:nowrap;font-size:11px;font-weight:800;color:#151515;">
                <span style="width:6px;height:6px;border-radius:50%;background:${isOnline ? '#22C55E' : '#9CA3AF'};display:inline-block;"></span>
                <span>₨ ${prov.startingPrice}</span>
              </div>
              <div style="width:8px;height:8px;background:#ffffff;border-right:1.5px solid ${isOnline ? '#65A30D' : '#9CA3AF'};border-bottom:1.5px solid ${isOnline ? '#65A30D' : '#9CA3AF'};transform:rotate(45deg);margin-top:-4px;"></div>
            </div>
          `,
          iconSize: [75, 36],
          iconAnchor: [37, 32]
        });

        const marker = L.marker([prov.location.lat, prov.location.lng], { icon });
        marker.on('click', () => {
          if (onSelectProvider) onSelectProvider(prov);
        });

        marker.bindTooltip(`
          <div style="font-size:12px;padding:2px 4px;">
            <b>${prov.name}</b><br/>
            <span style="color:#059669;font-weight:600;">${prov.specialty}</span><br/>
            ⭐ ${prov.rating} (${prov.reviewCount} reviews)
          </div>
        `, { offset: [0, -18] });

        markersGroup.addLayer(marker);
      });

      // Force recalculate map size after layout stabilizes
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setMapReady(true);
        }
      }, 250);

    } catch (err) {
      console.warn("Leaflet map initialization warning:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [providers, userLocation, onSelectProvider]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center active:scale-95 transition-all"
          title="Recenter on my location"
        >
          <Navigation2 size={16} className="text-emerald-600 fill-emerald-600" />
        </button>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <button
            onClick={handleZoomIn}
            className="p-2.5 text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-center active:bg-slate-100"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 text-slate-700 hover:bg-slate-50 flex items-center justify-center active:bg-slate-100"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
        </div>
      </div>

      {/* Status pill in bottom left */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{providers.filter(p => p.isOnline).length} Verified Specialists Live in {userLocation.area}</span>
      </div>
    </div>
  );
};
