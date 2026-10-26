import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_SEED, APP_CONFIG } from '../../config';
import { ServiceMap } from '../map/ServiceMap';
import { ProviderProfile } from '../../types';
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
  PhoneCall,
  Clock,
  ChevronRight
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
    t
  } = useApp();

  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [availableNowOnly, setAvailableNowOnly] = useState<boolean>(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Category Icon helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench size={16} />;
      case 'Zap': return <Zap size={16} />;
      case 'Snowflake': return <Snowflake size={16} />;
      case 'Refrigerator': return <Refrigerator size={16} />;
      case 'Sparkles': return <Sparkles size={16} />;
      case 'Hammer': return <Hammer size={16} />;
      case 'Paintbrush': return <Paintbrush size={16} />;
      case 'ShieldAlert': return <ShieldAlert size={16} />;
      case 'Droplets': return <Droplets size={16} />;
      case 'Camera': return <Camera size={16} />;
      case 'Flower2': return <Flower2 size={16} />;
      default: return <Wrench size={16} />;
    }
  };

  // Filter providers
  const filteredProviders = providers.filter(p => {
    // Category match
    if (selectedCategory && !p.categoryIds.includes(selectedCategory)) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSpecialty = p.specialty.toLowerCase().includes(q);
      const matchBio = p.bio.toLowerCase().includes(q);
      const matchSub = p.subcategories.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchSpecialty && !matchBio && !matchSub) return false;
    }
    // Min rating
    if (minRating > 0 && p.rating < minRating) return false;
    // Verified only
    if (verifiedOnly && !p.isVerified) return false;
    // Available now (isOnline)
    if (availableNowOnly && !p.isOnline) return false;

    return true;
  });

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            area: "Current GPS Location",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          alert("Location access denied or unavailable. You can choose your sector manually above.");
        }
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 py-4">
      
      {/* Top Banner / Hero for Customer */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-lime-100 text-lime-950 font-bold text-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-[#151515]"></span>
              <span>{t('tagline')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight">
              Hire Nearby Verified Pros on Your Budget
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Select a category or post your job to let plumbers, electricians, and AC specialists bid.
            </p>
          </div>

          {/* Prominent inDrive Action Buttons */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => setIsPostRequestOpen(true)}
              className="flex-1 sm:flex-none bg-[#B5F33D] hover:bg-[#a5e62c] text-[#151515] font-extrabold text-sm px-5 py-3 rounded-xl shadow-md border border-black/10 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle size={18} />
              <span>{t('postRequest')} & Offer Price</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Location Pin */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
          
          {/* Service Search Input */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5F33D] focus:border-transparent text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Use My Location GPS button */}
          <button
            onClick={handleUseMyLocation}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap active:scale-95"
          >
            <MapPin size={15} className="text-emerald-600" />
            <span>Use My Location</span>
          </button>

          {/* Filter dropdown toggle */}
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              minRating > 0 || verifiedOnly || availableNowOnly
                ? 'bg-black text-white border-black'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span>Filters {(minRating > 0 || verifiedOnly || availableNowOnly) && '•'}</span>
          </button>

          {/* Mobile List / Map toggle */}
          <div className="flex sm:hidden w-full bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-white shadow text-black' : 'text-gray-500'
              }`}
            >
              <ListIcon size={14} />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'map' ? 'bg-white shadow text-black' : 'text-gray-500'
              }`}
            >
              <MapIcon size={14} />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Filter Expandable Panel */}
        {filterMenuOpen && (
          <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Min Rating:</span>
              {[0, 4.5, 4.8].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-2 py-1 rounded-lg font-medium border ${
                    minRating === r ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  {r === 0 ? 'Any' : `${r}★+`}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Verified CNIC / License only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={availableNowOnly}
                onChange={(e) => setAvailableNowOnly(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Available Now (Online)</span>
            </label>

            <button
              onClick={() => { setMinRating(0); setVerifiedOnly(false); setAvailableNowOnly(false); }}
              className="ml-auto text-xs text-gray-500 hover:text-black underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Category Chips Carousel */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === null
                ? 'bg-[#151515] text-[#B5F33D] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>All Services</span>
          </button>

          {CATEGORIES_SEED.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#151515] text-[#B5F33D] shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Desktop 420px Sidebar + Full Interactive Map */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        
        {/* Left Side: Provider List (Hidden on mobile if map view is active) */}
        <div className={`lg:col-span-5 flex flex-col gap-3 ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {filteredProviders.length} Nearby Specialists in {userLocation.area}
            </span>
            <span className="text-[11px] text-gray-400">Prices are estimates</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[700px] pr-1">
            {filteredProviders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <Wrench className="mx-auto text-gray-300 mb-2" size={36} />
                <h3 className="font-bold text-gray-800 text-sm">No specialists match your filters</h3>
                <p className="text-xs text-gray-500 mt-1">Try clearing filters or search query.</p>
              </div>
            ) : (
              filteredProviders.map(provider => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProviderForProfile(provider)}
                  className="bg-white hover:border-gray-300 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-all cursor-pointer group flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Provider Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
                      />
                      {provider.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online now" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-extrabold text-sm text-[#151515] truncate group-hover:text-emerald-700 transition-colors">
                          {provider.name}
                        </h3>
                        {provider.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
                            <CheckCircle size={11} />
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-gray-600 mt-0.5 truncate">
                        {provider.specialty}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        {provider.reviewCount > 0 ? (
                          <div className="flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Star size={12} className="fill-amber-400 text-amber-500" />
                            <span>{provider.rating}</span>
                            <span className="text-gray-400 font-normal">({provider.reviewCount})</span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            New Provider
                          </span>
                        )}

                        <span className="text-gray-300">•</span>
                        <span className="text-gray-600 text-xs font-medium">{provider.completedJobsCount} jobs</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 text-xs">{provider.location.area}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subcategories tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                    {provider.subcategories.slice(0, 3).map((sub, i) => (
                      <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        {sub}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Guidance & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Starting from</span>
                      <span className="text-sm font-extrabold text-[#151515]">
                        PKR {provider.startingPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProviderForProfile(provider);
                        }}
                        className="text-xs font-bold text-gray-700 hover:text-black px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Profile
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPostRequestOpen(true);
                        }}
                        className="bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <span>Request Service</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Interactive Leaflet Map (Always visible on desktop; toggled on mobile) */}
        <div className={`lg:col-span-7 flex flex-col ${viewMode === 'list' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="w-full h-full min-h-[480px]">
            <ServiceMap
              providers={filteredProviders}
              onSelectProvider={(prov) => setSelectedProviderForProfile(prov)}
              height="100%"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
