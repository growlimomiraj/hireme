import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { ProviderProfile } from '../../types';

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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map centered on user's location
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron clean map tiles (inDrive light aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    // Clear previous markers
    markersLayerRef.current.clearLayers();

    // 1. User Location Pin (pulsing green circle with custom pin)
    const userIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-[#B5F33D] opacity-40 animate-ping"></span>
          <div class="w-5 h-5 rounded-full bg-[#151515] border-2 border-[#B5F33D] shadow-md flex items-center justify-center text-[10px] text-white font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
    userMarker.bindTooltip(`<b>Your Location</b><br/>${userLocation.area}`, { direction: 'top', offset: [0, -10] });
    markersLayerRef.current.addLayer(userMarker);

    // 2. Service Area Coverage Circle (light green translucent overlay)
    const coverageCircle = L.circle([userLocation.lat, userLocation.lng], {
      color: '#B5F33D',
      fillColor: '#B5F33D',
      fillOpacity: 0.12,
      weight: 1.5,
      radius: 4000 // 4 km radius
    });
    markersLayerRef.current.addLayer(coverageCircle);

    // 3. Provider Markers
    providers.forEach(prov => {
      const isOnline = prov.isOnline;
      const provIcon = L.divIcon({
        className: 'custom-prov-pin',
        html: `
          <div class="cursor-pointer group flex flex-col items-center transform transition-transform hover:scale-110">
            <div class="relative px-2 py-1 bg-white border ${isOnline ? 'border-[#B5F33D]' : 'border-gray-300'} rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-[#151515]">
              <span class="w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}"></span>
              <span>₨ ${prov.startingPrice}</span>
            </div>
            <div class="w-3 h-3 bg-white border-r border-b ${isOnline ? 'border-[#B5F33D]' : 'border-gray-300'} transform rotate-45 -mt-1.5 shadow-sm"></div>
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 36]
      });

      const marker = L.marker([prov.location.lat, prov.location.lng], { icon: provIcon });
      
      marker.on('click', () => {
        if (onSelectProvider) {
          onSelectProvider(prov);
        }
      });

      marker.bindTooltip(`
        <div class="text-xs p-1">
          <b>${prov.name}</b><br/>
          <span class="text-emerald-700 font-medium">${prov.specialty}</span><br/>
          ⭐ ${prov.rating} (${prov.reviewCount} reviews)
        </div>
      `, { offset: [0, -20] });

      markersLayerRef.current?.addLayer(marker);
    });

  }, [providers, userLocation, onSelectProvider]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-[400] bg-white hover:bg-gray-50 text-[#151515] p-2.5 rounded-xl shadow-md border border-gray-200 flex items-center gap-2 text-xs font-semibold active:scale-95 transition-all"
        title="Recenter on my location"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#B5F33D] border border-black"></span>
        Recenter
      </button>

      {/* Floating inDrive badge */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-[11px] font-medium text-gray-700 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{providers.filter(p => p.isOnline).length} Active Providers in Islamabad/Rawalpindi</span>
      </div>
    </div>
  );
};
