import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_SEED, APP_CONFIG } from '../../config';
import { ServiceMap } from '../map/ServiceMap';
import { ProviderProfile } from '../../types';
import { CustomerRequestsView } from './CustomerRequestsView';
import { CustomerJobTracker } from './CustomerJobTracker';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Star,
  CheckCircle,
  PlusCircle,
  Map as MapIcon,
  List as ListIcon,
  Wrench,
  Zap,
  Snowflake,
  Refrigerator,
  Sparkles,
  Hammer,
  Paintbrush,
  ShieldAlert,
  Droplets,
  Camera,
  Flower2,
  ChevronRight,
  TrendingDown,
  Clock,
  Briefcase
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const {
    providers,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    userLocation,
    setUserLocation,
    viewMode,
    setViewMode,
    setSelectedProviderForProfile,
    setIsPostRequestOpen,
    offers,
    bookings,
    t
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'providers' | 'bids' | 'active_job'>('providers');
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Category Icon helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench size={15} />;
      case 'Zap': return <Zap size={15} />;
      case 'Snowflake': return <Snowflake size={15} />;
      case 'Refrigerator': return <Refrigerator size={15} />;
      case 'Sparkles': return <Sparkles size={15} />;
      case 'Hammer': return <Hammer size={15} />;
      case 'Paintbrush': return <Paintbrush size={15} />;
      case 'ShieldAlert': return <ShieldAlert size={15} />;
      case 'Droplets': return <Droplets size={15} />;
      case 'Camera': return <Camera size={15} />;
      case 'Flower2': return <Flower2 size={15} />;
      default: return <Wrench size={15} />;
    }
  };

  const filteredProviders = providers.filter(p => {
    if (selectedCategory && !p.categoryIds.includes(selectedCategory)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
                    p.specialty.toLowerCase().includes(q) ||
                    p.subcategories.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (minRating > 0 && p.rating < minRating) return false;
    if (verifiedOnly && !p.isVerified) return false;
    if (availableOnly && !p.isOnline) return false;
    return true;
  });

  const pendingOffersCount = offers.filter(o => o.status === 'pending' || o.status === 'countered').length;
  const activeJobsCount = bookings.filter(b => ['confirmed', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length;

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 py-5 space-y-5">
      
      {/* Sleek Hero Banner: inDrive Value Proposition */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-100 text-lime-950 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-slate-950"></span>
              <span>{t('tagline')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hire Nearby Verified Specialists on Your Budget
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
              Post your job in Islamabad & Rawalpindi. Top rated plumbers, electricians, and AC technicians will compete with offers.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => setIsPostRequestOpen(true)}
              className="w-full sm:w-auto bg-[#B5F33D] hover:bg-[#a6e632] text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-sm border border-black/10 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle size={18} />
              <span>Post Request & Offer Price</span>
            </button>
          </div>
        </div>

        {/* Search & Location Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search service, issue, or specialist (e.g. leaking tap, AC service, Tariq)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#B5F33D]"
            />
          </div>

          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => setUserLocation({ area: "GPS Location", lat: pos.coords.latitude, lng: pos.coords.longitude }),
                  () => alert("Location permission denied. Please choose your sector above.")
                );
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 active:scale-95"
          >
            <MapPin size={15} className="text-lime-600" />
            <span>Use My GPS</span>
          </button>
        </div>

        {/* Clean Service Categories Carousel */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedCategory === null
                ? 'bg-slate-950 text-[#B5F33D] shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            All Services
          </button>

          {CATEGORIES_SEED.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-slate-950 text-[#B5F33D] shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main View Mode Tabs (Specialists vs My Job Bids vs Active Job Tracker) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab('providers')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeMainTab === 'providers'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Available Specialists</span>
            <span className="text-[10px] bg-slate-800 text-[#B5F33D] px-1.5 py-0.2 rounded-full">
              {filteredProviders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('bids')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 relative ${
              activeMainTab === 'bids'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>My Requests & Bids</span>
            {pendingOffersCount > 0 && (
              <span className="text-[10px] bg-[#B5F33D] text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                {pendingOffersCount} offers
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveMainTab('active_job')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeMainTab === 'active_job'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Live Job & Start PIN</span>
            {activeJobsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Mobile View Toggle */}
        {activeMainTab === 'providers' && (
          <div className="flex sm:hidden bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white shadow text-black' : 'text-slate-500'}`}
            >
              <ListIcon size={14} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg ${viewMode === 'map' ? 'bg-white shadow text-black' : 'text-slate-500'}`}
            >
              <MapIcon size={14} />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: PROVIDERS + INTERACTIVE MAP (Split 2-Column) */}
      {activeMainTab === 'providers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
          
          {/* Left: Specialist Cards */}
          <div className={`lg:col-span-5 flex flex-col gap-3.5 ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="space-y-3 overflow-y-auto max-h-[640px] pr-1">
              {filteredProviders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
                  <Wrench size={32} className="mx-auto text-slate-300 mb-2" />
                  <h4 className="font-bold text-sm text-slate-800">No specialists match your criteria</h4>
                  <p className="text-xs text-slate-500 mt-1">Try selecting another category or clearing search query.</p>
                </div>
              ) : (
                filteredProviders.map(prov => (
                  <div
                    key={prov.id}
                    onClick={() => setSelectedProviderForProfile(prov)}
                    className="bg-white hover:border-slate-300 border border-slate-200/90 rounded-3xl p-4 shadow-xs hover:shadow transition-all cursor-pointer flex flex-col gap-3 group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="relative flex-shrink-0">
                        <img
                          src={prov.avatar}
                          alt={prov.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                        />
                        {prov.isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {prov.name}
                          </h3>
                          {prov.isVerified && (
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle size={10} />
                              Verified
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-600 mt-0.5 truncate">{prov.specialty}</p>

                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="flex items-center gap-1 font-bold text-amber-950 bg-amber-50 px-1.5 py-0.2 rounded text-[11px]">
                            <Star size={11} className="fill-amber-400 text-amber-500" />
                            {prov.rating}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 text-[11px]">{prov.completedJobsCount} jobs</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 text-[11px]">{prov.location.area}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {prov.subcategories.slice(0, 3).map((sub, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                          {sub}
                        </span>
                      ))}
                    </div>

                    {/* Pricing & Request Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Starting from</span>
                        <span className="text-sm font-black text-slate-900">PKR {prov.startingPrice}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProviderForProfile(prov);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Profile
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPostRequestOpen(true);
                          }}
                          className="bg-[#B5F33D] hover:bg-[#a6e632] text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <span>Request</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Interactive ServiceMap */}
          <div className={`lg:col-span-7 flex flex-col ${viewMode === 'list' ? 'hidden lg:flex' : 'flex'}`}>
            <ServiceMap
              providers={filteredProviders}
              onSelectProvider={(prov) => setSelectedProviderForProfile(prov)}
              height="100%"
            />
          </div>

        </div>
      )}

      {/* TAB 2: MY REQUESTS & LIVE BIDS (Shows the 3 competing offers) */}
      {activeMainTab === 'bids' && (
        <CustomerRequestsView />
      )}

      {/* TAB 3: ACTIVE JOB TRACKER & START PIN */}
      {activeMainTab === 'active_job' && (
        <CustomerJobTracker />
      )}

    </div>
  );
};
