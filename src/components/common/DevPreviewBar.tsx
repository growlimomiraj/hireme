import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { RefreshCw, ShieldCheck, UserCheck, Wrench, Shield, CheckCircle2 } from 'lucide-react';

export const DevPreviewBar: React.FC = () => {
  const { role, setRole, resetDatabase, setIsChecklistOpen, notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-[#151515] text-white px-3 py-2 text-xs border-b border-gray-800 flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="bg-[#B5F33D] text-[#151515] font-extrabold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
          DEMO SWITCHER
        </span>
        <span className="hidden sm:inline text-gray-400">Switch role view:</span>
        
        {/* Role Toggle Group */}
        <div className="inline-flex bg-gray-900 rounded-lg p-0.5 border border-gray-700">
          <button
            onClick={() => setRole('customer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
              role === 'customer'
                ? 'bg-[#B5F33D] text-[#151515] shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <UserCheck size={13} />
            <span>Customer (Miraj)</span>
          </button>

          <button
            onClick={() => setRole('provider')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
              role === 'provider'
                ? 'bg-[#B5F33D] text-[#151515] shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Wrench size={13} />
            <span>Provider (Tariq Plumber)</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
              role === 'admin'
                ? 'bg-[#B5F33D] text-[#151515] shadow'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Shield size={13} />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Integration Honesty Checklist */}
        <button
          onClick={() => setIsChecklistOpen(true)}
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/80 transition-colors"
          title="View implementation & integration honesty checklist"
        >
          <CheckCircle2 size={13} />
          <span className="font-medium">Integration Checklist</span>
        </button>

        {/* Reset State Button */}
        <button
          onClick={() => {
            if (window.confirm("Reset all requests, bids, and bookings to default seed data?")) {
              resetDatabase();
            }
          }}
          className="flex items-center gap-1 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded border border-gray-700 transition-colors"
          title="Reset back to initial seed data"
        >
          <RefreshCw size={12} />
          <span className="hidden sm:inline">Reset Seed Data</span>
        </button>
      </div>
    </div>
  );
};
