import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config';
import { MapPin, Globe, Bell, PlusCircle, CheckCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    userLocation,
    setUserLocation,
    lang,
    setLang,
    notifications,
    setIsPostRequestOpen,
    setActiveCustomerTab,
    setIsPhoneAuthOpen
  } = useApp();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveCustomerTab('home')}>
            <div className="w-9 h-9 rounded-xl bg-[#B5F33D] flex items-center justify-center shadow-sm border border-black/10">
              <span className="text-black font-black text-lg">⚡</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#151515]">
                {APP_CONFIG.brandName}
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                inDrive Model
              </span>
            </div>
          </div>

          {/* Location Selector (Customer / Provider) */}
          {role !== 'admin' && (
            <div className="relative ml-2">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
              >
                <MapPin size={14} className="text-emerald-600" />
                <span className="max-w-[120px] sm:max-w-none truncate">{userLocation.area}</span>
              </button>

              {locationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Select Service Area
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
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-gray-100 flex items-center justify-between ${
                        userLocation.area === area ? 'text-black font-bold bg-lime-50' : 'text-gray-700'
                      }`}
                    >
                      <span>{area}</span>
                      {userLocation.area === area && <CheckCircle size={12} className="text-black" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Post a Request Action for Customer */}
          {role === 'customer' && (
            <button
              onClick={() => setIsPostRequestOpen(true)}
              className="bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Post a Request</span>
              <span className="sm:hidden">Request</span>
            </button>
          )}

          {/* Urdu / English Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
            title="Toggle English / Urdu Language"
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'اردو' : 'EN'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveCustomerTab('requests')}
            className="relative p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Phone verification indicator */}
          <button
            onClick={() => setIsPhoneAuthOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-xl text-xs font-medium text-gray-700 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>+92 300 555...</span>
          </button>
        </div>

      </div>
    </header>
  );
};
