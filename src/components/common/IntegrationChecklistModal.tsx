import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Clock, AlertTriangle, Key } from 'lucide-react';

interface ChecklistItem {
  feature: string;
  category: string;
  status: 'Implemented' | 'Demo only' | 'Needs credentials' | 'Not implemented';
  notes: string;
}

const CHECKLIST_DATA: ChecklistItem[] = [
  {
    feature: "inDrive-style Customer Controlled Pricing & Counteroffers",
    category: "Core Marketplace",
    status: "Implemented",
    notes: "Customers specify budget (e.g. PKR 2,000 for tap repair), providers offer budget or counteroffer (PKR 2,500 / PKR 1,800), and customer confirms."
  },
  {
    feature: "Map-First Discovery & Leaflet Interactive Geolocation",
    category: "Location & Discovery",
    status: "Implemented",
    notes: "Leaflet OpenStreetMap integration with live provider markers, coverage circles, and geocoding centered on Islamabad & Rawalpindi."
  },
  {
    feature: "Service Start PIN Verification (Anti-Fraud)",
    category: "Job Progression",
    status: "Implemented",
    notes: "Random 4-digit code generated for customer. Provider must input code upon arrival to start job."
  },
  {
    feature: "Multi-Role Preview Switcher (Customer / Provider / Admin)",
    category: "Demo & Testing",
    status: "Implemented",
    notes: "One-click switch with synchronized cross-tab reactive state via BroadcastChannel."
  },
  {
    feature: "Urdu Localization & RTL Layout Toggle",
    category: "Localization",
    status: "Implemented",
    notes: "English and Urdu translations with automatic dir='rtl' attribute toggle."
  },
  {
    feature: "Provider Document Verification Queue & Audit Log",
    category: "Admin & Compliance",
    status: "Implemented",
    notes: "Admin review interface for CNIC, Trade licenses, police clearance with approve/reject reasons."
  },
  {
    feature: "Payment Pre-authorization & Fund Capture / Voiding",
    category: "Payments & Ledger",
    status: "Implemented",
    notes: "Hold on funds upon confirmation; captured on customer job approval; 10% platform fee ledger breakdown."
  },
  {
    feature: "Simulated Real-time In-App Messaging",
    category: "Communication",
    status: "Implemented",
    notes: "Request-linked chat with auto-reply simulation from assigned provider."
  },
  {
    feature: "Live Telco SMS Gateway (Jazz / Telenor / Zong OTP)",
    category: "Auth",
    status: "Demo only",
    notes: "Simulated OTP (auto-filled demo OTP 123456) with resend cooldown and phone format validation."
  },
  {
    feature: "Production Google Maps JavaScript API Key",
    category: "Location",
    status: "Needs credentials",
    notes: "Application runs seamlessly on high-performance Leaflet tiles; Google Maps JS API adapter ready for GOOGLE_MAPS_KEY."
  },
  {
    feature: "Production JazzCash / EasyPaisa Merchant Gateway Keys",
    category: "Payments",
    status: "Needs credentials",
    notes: "Mock payment preauthorization adapter in place; merchant credentials can be configured via environment variables."
  },
  {
    feature: "FCM Production Push Notification Service",
    category: "Push Notifications",
    status: "Demo only",
    notes: "Web Notification API & service worker simulated via local in-app notification center."
  }
];

export const IntegrationChecklistModal: React.FC = () => {
  const { isChecklistOpen, setIsChecklistOpen } = useApp();

  if (!isChecklistOpen) return null;

  const getStatusBadge = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'Implemented':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 size={12} />
            Implemented
          </span>
        );
      case 'Demo only':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock size={12} />
            Demo only
          </span>
        );
      case 'Needs credentials':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Key size={12} />
            Needs credentials
          </span>
        );
      case 'Not implemented':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <AlertTriangle size={12} />
            Not implemented
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#151515] flex items-center gap-2">
              <span>📋 Integration & Honesty Checklist</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Authoritative overview of implemented features and external adapter requirements
            </p>
          </div>
          <button
            onClick={() => setIsChecklistOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 divide-y divide-gray-100">
          {CHECKLIST_DATA.map((item, idx) => (
            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="sm:max-w-[65%]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.category}</span>
                </div>
                <div className="font-bold text-sm text-[#151515] mt-0.5">{item.feature}</div>
                <div className="text-xs text-gray-600 mt-1">{item.notes}</div>
              </div>
              <div className="flex-shrink-0 self-start sm:self-center">
                {getStatusBadge(item.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Marketplace Target: <b>Islamabad & Rawalpindi, Pakistan (PKR)</b>
          </div>
          <button
            onClick={() => setIsChecklistOpen(false)}
            className="bg-[#151515] text-white hover:bg-black font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            Close Checklist
          </button>
        </div>

      </div>
    </div>
  );
};
