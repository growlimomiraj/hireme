import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest } from '../../types';
import {
  Compass,
  MapPin,
  Clock,
  CheckCircle,
  Tag,
  ArrowRight,
  SlidersHorizontal,
  Power,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const {
    currentProvider,
    requests,
    offers,
    submitOffer,
    toggleProviderOnline,
    setSelectedRequestForQuote,
    setActiveChatRequestId
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const isOnline = currentProvider?.isOnline ?? true;

  // Filter nearby requests matching provider categories and status 'open'
  const nearbyRequests = requests.filter(r => {
    if (r.status !== 'open') return false;
    // Check if matches category
    if (activeCategoryFilter !== 'all' && r.categoryId !== activeCategoryFilter) return false;
    return true;
  });

  // Check if provider has already submitted an offer for this request
  const hasOffered = (reqId: string) => {
    return offers.some(o => o.requestId === reqId && o.providerId === currentProvider.id);
  };

  const handleInstantAcceptBudget = (req: ServiceRequest) => {
    // Instant offer at customer's exact budget price!
    submitOffer({
      requestId: req.id,
      providerId: currentProvider.id,
      price: req.budget,
      labor: req.budget,
      materials: 0,
      callOutFee: 0,
      includedWork: ["Full fault diagnostic", "Standard repair & seal replacement", "Post-service test"],
      excludedWork: ["Unforeseen piping structural changes"],
      expectedArrival: "Within 35 minutes",
      estimatedDurationHours: 1,
      message: `Salam ${req.customerName}! I accept your budget of PKR ${req.budget.toLocaleString()}. I am available nearby and can arrive within 35 minutes.`,
      isCounteroffer: false
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Provider Online/Offline Status Banner */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentProvider.avatar}
              alt={currentProvider.name}
              className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? 'bg-emerald-500' : 'bg-gray-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#151515]">{currentProvider.name}</h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {currentProvider.specialty}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Service Area: <b>{currentProvider.location.area}</b> (Radius {currentProvider.coverageRadiusKm} km)
            </p>
          </div>
        </div>

        {/* Prominent Online/Offline Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Status</span>
            <span className={`text-xs font-black ${isOnline ? 'text-emerald-700' : 'text-gray-500'}`}>
              {isOnline ? 'ONLINE & RECEIVING BIDS' : 'OFFLINE (PAUSED)'}
            </span>
          </div>

          <button
            onClick={() => toggleProviderOnline(!isOnline)}
            className={`p-3 rounded-2xl border flex items-center justify-center transition-all shadow-sm ${
              isOnline
                ? 'bg-[#B5F33D] text-[#151515] border-black hover:bg-[#a6e632]'
                : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
            }`}
            title="Toggle Online / Offline Status"
          >
            <Power size={20} className="stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Offline Warning Notice if toggled off */}
      {!isOnline && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
          <AlertCircle size={18} className="text-amber-700 flex-shrink-0" />
          <span>
            You are currently offline. You will not receive immediate broadcast notifications for nearby requests until you switch back online.
          </span>
        </div>
      )}

      {/* Nearby Requests Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-[#151515] flex items-center gap-2">
            <span>Nearby Open Customer Requests</span>
            <span className="text-xs font-bold bg-[#151515] text-[#B5F33D] px-2 py-0.5 rounded-full">
              {nearbyRequests.length} Active
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Customers have set their budgets. Accept their price or send a counteroffer.
          </p>
        </div>
      </div>

      {/* Requests Feed */}
      <div className="space-y-4">
        {nearbyRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <Compass size={36} className="mx-auto text-gray-300 mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">No new requests in your area right now</h4>
            <p className="text-xs text-gray-500 mt-1">Check back soon or broaden your coverage radius.</p>
          </div>
        ) : (
          nearbyRequests.map(req => {
            const alreadyBid = hasOffered(req.id);

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:border-gray-300 transition-all space-y-4"
              >
                {/* Header: Area, Budget, Timing */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {req.categoryName} • {req.subcategory}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 font-medium">Approx 1.8 km away</span>
                    </div>

                    <h4 className="font-black text-base text-[#151515] mt-1">{req.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{req.description}</p>
                  </div>

                  {/* Customer Budget Box */}
                  <div className="bg-lime-50 border border-lime-300 rounded-2xl p-3 text-right flex-shrink-0 self-start sm:self-auto">
                    <span className="text-[10px] uppercase font-bold text-lime-950 tracking-wider block">Customer Budget</span>
                    <div className="text-2xl font-black text-[#151515] mt-0.5">
                      PKR {req.budget.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium block">
                      {req.scheduleType === 'asap' ? '⚡ ASAP arrival needed' : 'Scheduled job'}
                    </span>
                  </div>
                </div>

                {/* Scope & Details */}
                <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-600" />
                    <span><b>Sector:</b> {req.location.area}</span>
                  </div>
                  <div>
                    <span><b>Materials:</b> {req.materialsResponsibility} will provide</span>
                  </div>
                  <div>
                    <span><b>Customer:</b> {req.customerName}</span>
                  </div>
                </div>

                {/* Provider Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChatRequestId(req.id)}
                      className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5"
                    >
                      <MessageSquare size={14} />
                      <span>Ask Question</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {alreadyBid ? (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-2 rounded-xl flex items-center gap-1">
                        <CheckCircle size={14} />
                        <span>Offer Sent</span>
                      </span>
                    ) : (
                      <>
                        {/* Send Counteroffer */}
                        <button
                          onClick={() => setSelectedRequestForQuote(req)}
                          className="px-4 py-2.5 rounded-xl border border-black font-bold text-xs text-black hover:bg-gray-100 transition-colors"
                        >
                          Send Counteroffer
                        </button>

                        {/* Instant Accept Customer Budget */}
                        <button
                          onClick={() => handleInstantAcceptBudget(req)}
                          className="bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-black text-xs px-5 py-2.5 rounded-xl shadow border border-black/10 flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <Sparkles size={14} />
                          <span>Accept at PKR {req.budget.toLocaleString()}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
