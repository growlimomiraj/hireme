import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useApp } from '../../context/AppContext';
import { ProviderProfile } from '../../types';
import { APP_CONFIG } from '../../config';
import {
  Navigation2,
  Key,
  Layers,
  MapPin,
  ExternalLink
} from 'lucide-react';

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
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const { userLocation } = useApp();

  // API Key management: check localStorage or config
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('servicebid_google_maps_key') ||
      APP_CONFIG.googleMapsApiKey ||
      ''
    );
  });
  const [keyModalOpen, setKeyModalOpen] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>(apiKey);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize Google Maps using the modern Google Maps JS API loader
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;
    setLoadError(null);

    const initGoogleMap = async () => {
      try {
        setOptions({
          key: apiKey.trim(),
          v: 'weekly',
        });

        const mapsLib = (await importLibrary('maps')) as google.maps.MapsLibrary;
        const markerLib = (await importLibrary('marker')) as google.maps.MarkerLibrary;
        if (!isMounted || !mapContainerRef.current) return;

        // Custom minimalist inDrive map style
        const inDriveStyle: google.maps.MapTypeStyle[] = [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ lightness: 20 }]
          }
        ];

        const map = new mapsLib.Map(mapContainerRef.current, {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          zoom: 13,
          mapTypeId: mapType as any,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: mapType === 'roadmap' ? inDriveStyle : undefined
        });

        infoWindowRef.current = new mapsLib.InfoWindow();

        // 1. User Location Marker
        new markerLib.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map,
          title: `Your Location: ${userLocation.area}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#B5F33D',
            fillOpacity: 1,
            strokeColor: '#151515',
            strokeWeight: 2.5,
            scale: 9
          }
        });

        // 2. Coverage Circle (inDrive subtle green)
        new mapsLib.Circle({
          map,
          center: { lat: userLocation.lat, lng: userLocation.lng },
          radius: 3500,
          fillColor: '#B5F33D',
          fillOpacity: 0.12,
          strokeColor: '#65A30D',
          strokeWeight: 1.5
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err: any) {
        console.warn('Google Maps JS API load notice:', err);
        setLoadError(err?.message || 'Google Maps failed to load');
      }
    };

    initGoogleMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey, mapType]);

  // Update provider markers when providers or map change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Add Provider Markers
    providers.forEach(prov => {
      const isOnline = prov.isOnline;

      const marker = new google.maps.Marker({
        position: { lat: prov.location.lat, lng: prov.location.lng },
        map,
        title: `${prov.name} - ₨ ${prov.startingPrice}`,
        label: {
          text: `₨ ${prov.startingPrice}`,
          color: '#151515',
          fontSize: '11px',
          fontWeight: 'bold',
          className: 'google-maps-price-label'
        },
        icon: {
          path: 'M 0,0 C -15,-20 -20,-30 0,-40 C 20,-30 15,-20 0,0 Z',
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          strokeColor: isOnline ? '#65A30D' : '#9CA3AF',
          strokeWeight: 2,
          scale: 1,
          labelOrigin: new google.maps.Point(0, -25)
        }
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          const content = `
            <div style="font-family:Plus Jakarta Sans, sans-serif;padding:6px;max-width:200px;">
              <div style="font-weight:800;font-size:13px;color:#0F172A;">${prov.name}</div>
              <div style="color:#059669;font-weight:700;font-size:11px;margin-top:2px;">${prov.specialty}</div>
              <div style="font-size:11px;color:#64748B;margin-top:4px;">
                ★ <b>${prov.rating}</b> (${prov.reviewCount} reviews) • ${prov.location.area}
              </div>
              <div style="font-size:12px;font-weight:800;color:#0F172A;margin-top:4px;">
                Starting from ₨ ${prov.startingPrice}
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }

        if (onSelectProvider) {
          onSelectProvider(prov);
        }
      });

      markersRef.current.push(marker);
    });

  }, [providers, mapLoaded, onSelectProvider]);

  // Recenter helper
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      mapInstanceRef.current.setZoom(13);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('servicebid_google_maps_key', tempKey.trim());
    setApiKey(tempKey.trim());
    setKeyModalOpen(false);
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm" style={{ height }}>
      
      {/* Google Maps DOM element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top Controls */}
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

        {/* Map Type Selector: Roadmap / Satellite / Terrain */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200 p-0.5 flex items-center text-xs font-bold">
          {(['roadmap', 'satellite', 'terrain'] as const).map(type => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-2.5 py-1.5 rounded-xl capitalize transition-all ${
                mapType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Google Maps API Key Config button */}
        <button
          onClick={() => setKeyModalOpen(true)}
          className={`px-3 py-2 rounded-2xl shadow-md border flex items-center gap-1.5 text-xs font-bold transition-all ${
            apiKey
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-700 hover:bg-white'
          }`}
          title="Configure Google Maps API Key"
        >
          <Key size={13} className={apiKey ? 'text-emerald-600' : 'text-slate-400'} />
          <span>{apiKey ? 'Google Key Set' : 'Google Key'}</span>
        </button>

      </div>

      {/* Status Pill in Bottom Left */}
      <div className="absolute bottom-3 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-xs border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{providers.filter(p => p.isOnline).length} Verified Specialists in {userLocation.area}</span>
        <span className="text-slate-300">•</span>
        <span className="text-[10px] text-slate-600 font-bold">Google Maps</span>
      </div>

      {/* Google Maps API Key Modal */}
      {keyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-2">
              <span className="text-xl">🗺️</span>
              <h3 className="font-black text-base text-slate-900">Google Maps JavaScript API Key</h3>
            </div>
            
            <p className="text-xs text-slate-600 mt-1">
              Enter your Google Maps API Key to enable official Google satellite, street view, and full location services.
            </p>

            <div className="mt-4">
              <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                API Key
              </label>
              <input
                type="text"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#B5F33D]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Saved securely in browser local storage and loaded via <code>@googlemaps/js-api-loader</code>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="bg-[#B5F33D] hover:bg-[#a6e632] text-slate-950 text-xs font-black px-5 py-2 rounded-xl shadow active:scale-95 transition-all"
              >
                Apply Google Maps Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
