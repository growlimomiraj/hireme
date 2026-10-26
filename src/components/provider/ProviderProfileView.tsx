import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShieldCheck,
  FileText,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Phone,
  Upload,
  ExternalLink
} from 'lucide-react';

export const ProviderProfileView: React.FC = () => {
  const { currentProvider } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={currentProvider.avatar}
            alt={currentProvider.name}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#151515]">{currentProvider.name}</h2>
              <StatusBadge status={currentProvider.verificationStatus} size="sm" />
            </div>
            <p className="text-xs text-gray-600 font-semibold mt-0.5">{currentProvider.specialty}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span>★ {currentProvider.rating} ({currentProvider.reviewCount} reviews)</span>
              <span>•</span>
              <span>{currentProvider.experienceYears} Years Experience</span>
              <span>•</span>
              <span>{currentProvider.completedJobsCount} Jobs Completed</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Starting Rate</span>
          <span className="text-2xl font-black text-black">PKR {currentProvider.startingPrice}</span>
          <span className="text-[10px] text-gray-400 block">Baseline estimate</span>
        </div>
      </div>

      {/* Verification Documents Section (Crucial requirement!) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#151515] flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span>Identity & Qualification Verification</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Admin-verified credentials ensure customer safety and eligibility to submit offers.
            </p>
          </div>

          <StatusBadge status={currentProvider.verificationStatus} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentProvider.documents.map(doc => (
            <div
              key={doc.id}
              className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={18} className="text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">{doc.name}</div>
                  <span className="text-[10px] text-gray-400">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <StatusBadge status={doc.status} size="sm" />
            </div>
          ))}

          {/* Upload new document button */}
          <button
            onClick={() => alert("Upload document dialog (Accepts CNIC front/back, trade certificate, police clearance).")}
            className="p-3.5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-black flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Upload size={16} />
            <span>Upload Additional Certificate</span>
          </button>
        </div>
      </div>

      {/* Service Coverage & Radius */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#151515]">Coverage & Travel Radius</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <span className="text-gray-400 uppercase font-bold text-[10px] block">Primary Operating Base</span>
            <div className="font-extrabold text-sm text-black">{currentProvider.location.address}</div>
            <div className="text-gray-500">{currentProvider.location.area}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
            <span className="text-gray-400 uppercase font-bold text-[10px] block">Travel Distance Limit</span>
            <div className="font-extrabold text-sm text-black">{currentProvider.coverageRadiusKm} Kilometers</div>
            <div className="text-gray-500">Covers Islamabad F, G, and Blue Area sectors</div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule & Availability */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#151515]">Weekly Working Hours</h3>
        <div className="space-y-2 text-xs">
          {currentProvider.weeklySchedule.map((slot, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
            >
              <span className="font-bold text-gray-800 w-28">{slot.day}</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                slot.available ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-400'
              }`}>
                {slot.available ? 'Open' : 'Unavailable'}
              </span>
              <span className="text-gray-500 text-right w-36">{slot.hours}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
