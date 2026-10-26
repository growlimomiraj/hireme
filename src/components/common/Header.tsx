import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config';
import {
  MapPin,
  Globe,
  Bell,
  PlusCircle,
  CheckCircle,
  ChevronDown,
  User,
  Wrench,
  Shield,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    userLocation,
    setUserLocation,
    lang,
    setLang,
    notifications,
    setIsPostRequestOpen,
    setActiveCustomerTab,
    setIsPhoneAuthOpen,
    setIsChecklistOpen,
    resetDatabase
  } = useApp();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand & City Pin */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => setActiveCustomerTab('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#B5F33D] flex items-center justify-center shadow-xs border border-black/10 group-hover:scale-105 transition-transform">
              <span className="text-black font-black text-xl leading-none">⚡</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                {APP_CONFIG.brandName}
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                Offer Your Price
              </span>
            </div>
          </div>

          {/* Location Selector (Islamabad / Rawalpindi sectors) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-800 transition-colors"
            >
              <MapPin size={14} className="text-lime-600" />
              <span>{userLocation.area}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Coverage Sector
                </div>
                {APP_CONFIG.serviceAreas.map(area => (
                  <button
                    key={area}
                    onClick={() => {
                      setUserLocation({
                        area,
                        lat: area.includes('F-10') ? 33.6930 : area.includes('Blue Area') ? 33.7180 : 33.6844,
                        lng: area.includes('F-10') ? 73.0070 : area.includes('Blue Area') ? 73.0580 : 73.0479,
                      });
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                      userLocation.area === area ? 'text-black font-bold bg-lime-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{area}</span>
                    {userLocation.area === area && <CheckCircle size={13} className="text-black" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean Segmented Role Switcher (Replaces ugly dev bar) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/70 text-xs font-bold shadow-inner">
          <button
            onClick={() => setRole('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              role === 'customer'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User size={13} />
            <span>Customer</span>
          </button>

          <button
            onClick={() => setRole('provider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              role === 'provider'
                ? 'bg-[#B5F33D] text-slate-950 shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench size={13} />
            <span>Provider Mode</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              role === 'admin'
                ? 'bg-slate-900 text-[#B5F33D] shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield size={13} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Post a Request CTA */}
          {role === 'customer' && (
            <button
              onClick={() => setIsPostRequestOpen(true)}
              className="bg-[#B5F33D] hover:bg-[#a6e632] text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-sm border border-black/10 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Post a Request</span>
              <span className="sm:hidden">Post</span>
            </button>
          )}

          {/* Urdu / English Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Toggle English / Urdu"
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'اردو' : 'EN'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveCustomerTab('requests')}
            className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Info Checklist icon */}
          <button
            onClick={() => setIsChecklistOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Integration Checklist"
          >
            <HelpCircle size={18} />
          </button>

        </div>

      </div>
    </header>
  );
};
