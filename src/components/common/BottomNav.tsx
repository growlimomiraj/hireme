import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  FileText,
  Tag,
  MessageSquare,
  User,
  Compass,
  Briefcase,
  Wallet,
  Wrench
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    role,
    activeCustomerTab,
    setActiveCustomerTab,
    activeProviderTab,
    setActiveProviderTab,
    requests,
    offers,
    bookings,
    messages
  } = useApp();

  if (role === 'admin') return null; // Admin has a dedicated sidebar

  // Counts
  const openRequestsCount = requests.filter(r => r.status === 'open').length;
  const pendingOffersCount = offers.filter(o => o.status === 'pending').length;
  const activeJobsCount = bookings.filter(b => ['confirmed', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 sm:hidden">
      {role === 'customer' ? (
        <div className="flex items-center justify-around">
          
          <button
            onClick={() => setActiveCustomerTab('home')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeCustomerTab === 'home' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeCustomerTab === 'home' ? 'bg-[#B5F33D]' : ''}`}>
              <Home size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setActiveCustomerTab('requests')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors relative ${
              activeCustomerTab === 'requests' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeCustomerTab === 'requests' ? 'bg-[#B5F33D]' : ''}`}>
              <FileText size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Requests</span>
            {openRequestsCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {openRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveCustomerTab('offers')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors relative ${
              activeCustomerTab === 'offers' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeCustomerTab === 'offers' ? 'bg-[#B5F33D]' : ''}`}>
              <Tag size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Offers</span>
            {pendingOffersCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-[#B5F33D] text-black border border-black font-bold text-[9px] rounded-full flex items-center justify-center">
                {pendingOffersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveCustomerTab('messages')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors relative ${
              activeCustomerTab === 'messages' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeCustomerTab === 'messages' ? 'bg-[#B5F33D]' : ''}`}>
              <MessageSquare size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Messages</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveCustomerTab('account')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeCustomerTab === 'account' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeCustomerTab === 'account' ? 'bg-[#B5F33D]' : ''}`}>
              <User size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Account</span>
          </button>

        </div>
      ) : (
        <div className="flex items-center justify-around">
          
          <button
            onClick={() => setActiveProviderTab('nearby')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeProviderTab === 'nearby' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeProviderTab === 'nearby' ? 'bg-[#B5F33D]' : ''}`}>
              <Compass size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Nearby</span>
          </button>

          <button
            onClick={() => setActiveProviderTab('offers')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeProviderTab === 'offers' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeProviderTab === 'offers' ? 'bg-[#B5F33D]' : ''}`}>
              <Tag size={18} />
            </div>
            <span className="text-[10px] mt-0.5">My Offers</span>
          </button>

          <button
            onClick={() => setActiveProviderTab('jobs')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors relative ${
              activeProviderTab === 'jobs' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeProviderTab === 'jobs' ? 'bg-[#B5F33D]' : ''}`}>
              <Briefcase size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Jobs</span>
            {activeJobsCount > 0 && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-emerald-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                {activeJobsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveProviderTab('earnings')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeProviderTab === 'earnings' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeProviderTab === 'earnings' ? 'bg-[#B5F33D]' : ''}`}>
              <Wallet size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Earnings</span>
          </button>

          <button
            onClick={() => setActiveProviderTab('profile')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeProviderTab === 'profile' ? 'text-black font-extrabold' : 'text-gray-500'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeProviderTab === 'profile' ? 'bg-[#B5F33D]' : ''}`}>
              <Wrench size={18} />
            </div>
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>

        </div>
      )}
    </nav>
  );
};
