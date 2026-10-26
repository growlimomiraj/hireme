import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  Star,
  CheckCircle,
  MapPin,
  Calendar,
  Briefcase,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  PlusCircle
} from 'lucide-react';

export const ProviderProfileModal: React.FC = () => {
  const {
    selectedProviderForProfile,
    setSelectedProviderForProfile,
    reviews,
    setIsPostRequestOpen,
    setActiveChatRequestId
  } = useApp();

  if (!selectedProviderForProfile) return null;

  const prov = selectedProviderForProfile;
  const provReviews = reviews.filter(r => r.providerId === prov.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={prov.avatar}
              alt={prov.name}
              className="w-13 h-13 rounded-2xl object-cover border border-gray-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-[#151515]">{prov.name}</h3>
                {prov.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle size={11} />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 font-semibold">{prov.specialty}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedProviderForProfile(null)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Rating</span>
              <span className="font-black text-base text-black flex items-center justify-center gap-1 mt-0.5">
                <Star size={14} className="fill-amber-400 text-amber-500" />
                {prov.rating}
              </span>
              <span className="text-[10px] text-gray-400">({prov.reviewCount} reviews)</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Completed</span>
              <span className="font-black text-base text-black block mt-0.5">{prov.completedJobsCount} Jobs</span>
              <span className="text-[10px] text-gray-400">in Islamabad</span>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-gray-400 font-bold uppercase text-[10px] block">Experience</span>
              <span className="font-black text-base text-black block mt-0.5">{prov.experienceYears} Years</span>
              <span className="text-[10px] text-gray-400">field tech</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block mb-1">
              About & Experience
            </span>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              {prov.bio}
            </p>
          </div>

          {/* Pricing guidance */}
          <div className="p-3.5 bg-lime-50/70 border border-lime-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-lime-950 uppercase text-[10px] block">Pricing Guidance</span>
              <span className="text-xs text-gray-700">Starting from <b>PKR {prov.startingPrice}</b> (Estimate only, subject to customer budget agreement)</span>
            </div>
          </div>

          {/* Services & Subcategories */}
          <div>
            <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block mb-2">
              Skills & Specialties
            </span>
            <div className="flex flex-wrap gap-1.5">
              {prov.subcategories.map((sub, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-gray-100 font-semibold text-gray-800 border border-gray-200">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio if any */}
          {prov.portfolio.length > 0 && (
            <div>
              <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block mb-2">
                Past Work Portfolio
              </span>
              <div className="grid grid-cols-2 gap-3">
                {prov.portfolio.map((item, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-gray-200">
                    <img src={item.image} alt={item.title} className="w-full h-28 object-cover" />
                    <div className="p-2 bg-gray-50 font-bold text-[11px] text-gray-800 truncate">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews list */}
          <div>
            <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block mb-2">
              Customer Reviews ({provReviews.length})
            </span>
            {provReviews.length === 0 ? (
              <p className="text-gray-400 italic">No written reviews yet.</p>
            ) : (
              <div className="space-y-2">
                {provReviews.map(r => (
                  <div key={r.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-black">{r.customerName}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star size={12} className="fill-amber-400" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{r.comment}"</p>
                    {r.providerResponse && (
                      <div className="mt-1 pl-2 border-l-2 border-emerald-500 text-emerald-800 text-[11px]">
                        <b>Response:</b> {r.providerResponse}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Operating in: <b>{prov.location.area}</b>
          </div>

          <button
            onClick={() => {
              setSelectedProviderForProfile(null);
              setIsPostRequestOpen(true);
            }}
            className="bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-black text-xs px-5 py-2.5 rounded-xl shadow active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Post Request & Invite to Bid</span>
            <ChevronRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};
