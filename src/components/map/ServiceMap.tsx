import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, NavigationControl, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useApp } from '../../context/AppContext';
import { ProviderProfile } from '../../types';
import { Navigation2, Layers, Compass } from 'lucide-react';

interface ServiceMapProps {
  providers: ProviderProfile[];
  onSelectProvider?: (provider: ProviderProfile) => void;
  height?: string;
}

// OpenFreeMap vector tile style endpoints
const OPENFREEMAP_STYLES = {
  positron: 'https://tiles.openfreemap.org/styles/positron', // Clean, minimalist inDrive aesthetic
  liberty: 'https://tiles.openfreemap.org/styles/liberty',   // Full street detail & landmarks
  bright: 'https://tiles.openfreemap.org/styles/bright',     // High-contrast
};

export const ServiceMap: React.FC<ServiceMapProps> = ({
  providers,
  onSelectProvider,
  height = "100%"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const { userLocation } = useApp();

  const [currentStyle, setCurrentStyle] = useState<keyof typeof OPENFREEMAP_STYLES>('positron');
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre GL map with OpenFreeMap vector tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates for MapLibre: [longitude, latitude]
    const map = new Map({
      container: mapContainerRef.current,
      style: OPENFREEMAP_STYLES[currentStyle],
      center: [userLocation.lng, userLocation.lat],
      zoom: 13,
      pitch: 30, // Subtle 3D angle for modern feel
      attributionControl: false
    });

    // Add navigation controls (zoom, pitch, rotation)
    map.addControl(new NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);

      // Add Coverage Radius GeoJSON polygon around user location
      try {
        const radiusInKm = 3.5;
        const points = 64;
        const coords: [number, number][] = [];
        const distanceX = radiusInKm / (111.32 * Math.cos((userLocation.lat * Math.PI) / 180));
        const distanceY = radiusInKm / 110.574;

        for (let i = 0; i < points; i++) {
          const theta = (i / points) * (2 * Math.PI);
          const x = distanceX * Math.cos(theta);
          const y = distanceY * Math.sin(theta);
          coords.push([userLocation.lng + x, userLocation.lat + y]);
        }
        coords.push(coords[0]);

        map.addSource('coverage-area', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [coords]
            },
            properties: {}
          }
        });

        map.addLayer({
          id: 'coverage-area-fill',
          type: 'fill',
          source: 'coverage-area',
          paint: {
            'fill-color': '#B5F33D',
            'fill-opacity': 0.12
          }
        });

        map.addLayer({
          id: 'coverage-area-line',
          type: 'line',
          source: 'coverage-area',
          paint: {
            'line-color': '#65A30D',
            'line-width': 1.5,
            'line-dasharray': [2, 2]
          }
        });
      } catch (e) {
        console.warn('GeoJSON circle layer warning:', e);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [currentStyle]);

  // Update markers when providers or userLocation change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // 1. User Location Marker
    const userEl = document.createElement('div');
    userEl.className = 'custom-user-marker';
    userEl.innerHTML = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;cursor:pointer;">
        <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:#B5F33D;opacity:0.4;animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width:22px;height:22px;border-radius:50%;background:#0F172A;border:2.5px solid #B5F33D;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:900;box-shadow:0 4px 10px rgba(0,0,0,0.3);">
          📍
        </div>
      </div>
    `;

    const userMarker = new Marker({ element: userEl })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(
        new Popup({ offset: 15, closeButton: false }).setHTML(`
          <div style="font-family:sans-serif;font-size:11px;font-weight:700;padding:2px 4px;color:#0f172a;">
            Your Location: ${userLocation.area}
          </div>
        `)
      )
      .addTo(map);

    markersRef.current.push(userMarker);

    // 2. Providers Markers
    providers.forEach(prov => {
      const isOnline = prov.isOnline;
      const el = document.createElement('div');
      el.className = 'custom-provider-marker';
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;transition:transform 0.2s ease;">
          <div style="background:#ffffff;border:1.5px solid ${isOnline ? '#65A30D' : '#94A3B8'};border-radius:9999px;padding:3px 9px;box-shadow:0 4px 12px rgba(15,23,42,0.15);display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:11px;font-weight:900;color:#0F172A;">
            <span style="width:6px;height:6px;border-radius:50%;background:${isOnline ? '#22C55E' : '#94A3B8'};display:inline-block;"></span>
            <span>₨ ${prov.startingPrice}</span>
          </div>
          <div style="width:8px;height:8px;background:#ffffff;border-right:1.5px solid ${isOnline ? '#65A30D' : '#94A3B8'};border-bottom:1.5px solid ${isOnline ? '#65A30D' : '#94A3B8'};transform:rotate(45deg);margin-top:-4px;"></div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectProvider) onSelectProvider(prov);
      });

      const popup = new Popup({ offset: 20, closeButton: false }).setHTML(`
        <div style="font-family:sans-serif;font-size:11px;padding:4px;color:#0f172a;">
          <div style="font-weight:800;font-size:12px;">${prov.name}</div>
          <div style="color:#059669;font-weight:700;">${prov.specialty}</div>
          <div style="color:#64748b;margin-top:2px;">★ ${prov.rating} (${prov.reviewCount} reviews) • ${prov.location.area}</div>
        </div>
      `);

      const marker = new Marker({ element: el })
        .setLngLat([prov.location.lng, prov.location.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

  }, [providers, userLocation, onSelectProvider, mapLoaded]);

  // Recenter helper
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 13,
      essential: true
    });
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm" style={{ height }}>
      {/* MapLibre DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Controls in Top Left */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        
        {/* Recenter button */}
        <button
          onClick={handleRecenter}
          className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 px-3 py-2 rounded-2xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all"
          title="Recenter on current location"
        >
          <Navigation2 size={13} className="text-lime-600 fill-lime-600" />
          <span>Recenter</span>
        </button>

        {/* OpenFreeMap Style Switcher */}
        <div className="relative">
          <button
            onClick={() => setStyleMenuOpen(!styleMenuOpen)}
            className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 px-3 py-2 rounded-2xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all"
            title="Switch OpenFreeMap style"
          >
            <Layers size={13} className="text-slate-600" />
            <span className="capitalize">{currentStyle}</span>
          </button>

          {styleMenuOpen && (
            <div className="absolute left-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                OpenFreeMap Style
              </div>
              {(['positron', 'liberty', 'bright'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => {
                    setCurrentStyle(style);
                    setStyleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 capitalize flex items-center justify-between ${
                    currentStyle === style ? 'text-lime-700 font-bold bg-lime-50' : 'text-slate-700'
                  }`}
                >
                  <span>{style}</span>
                  {currentStyle === style && <span className="w-1.5 h-1.5 rounded-full bg-lime-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Attribution & Status Badge in Bottom */}
      <div className="absolute bottom-3 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xs border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{providers.filter(p => p.isOnline).length} Verified Pros in {userLocation.area}</span>
        <span className="text-slate-300">•</span>
        <span className="text-[10px] text-slate-500">Map: <b>OpenFreeMap</b></span>
      </div>

      {/* Official OpenFreeMap & OSM Legal Attribution in Bottom Right */}
      <div className="absolute bottom-2 right-2 z-10 text-[9px] text-slate-500 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md">
        <a href="https://openfreemap.org" target="_blank" rel="noreferrer" className="hover:underline">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer" className="hover:underline">OpenMapTiles</a> Data: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:underline">OSM</a>
      </div>
    </div>
  );
};
