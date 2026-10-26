import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Offer, ServiceRequest } from '../../types';
import {
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowUpDown,
  Phone
} from 'lucide-react';

export const CustomerRequestsView: React.FC = () => {
  const {
    requests,
    offers,
    setSelectedOfferForBooking,
    setSelectedProviderForProfile,
    providers,
    counterOffer,
    setActiveChatRequestId
  } = useApp();

  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    requests[0]?.id || ''
  );

  // Sorting filter for offers: 'price_asc' | 'rating_desc' | 'arrival'
  const [offerSort, setOfferSort] = useState<'price_asc' | 'rating_desc' | 'arrival'>('price_asc');

  // Counteroffer Modal State
  const [counterModalOffer, setCounterModalOffer] = useState<Offer | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(2000);
  const [counterNotes, setCounterNotes] = useState<string>('Can you do it for this amount if I provide the spare washer cartridge?');

  const activeRequest = requests.find(r => r.id === selectedRequestId) || requests[0];
  const requestOffers = offers.filter(o => o.requestId === activeRequest?.id);

  // Sorted offers
  const sortedOffers = [...requestOffers].sort((a, b) => {
    if (offerSort === 'price_asc') return a.price - b.price;
    if (offerSort === 'rating_desc') return b.providerRating - a.providerRating;
    return a.distanceKm - b.distanceKm;
  });

  const handleSendCounter = () => {
    if (!counterModalOffer) return;
    counterOffer(counterModalOffer.id, counterPrice, counterNotes);
    setCounterModalOffer(null);
  };

  if (requests.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-lg font-bold text-gray-800">No requests yet</h2>
        <p className="text-xs text-gray-500 mt-1">Post a request to receive competitive bids from nearby providers.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Requests Tabs / Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {requests.map(req => {
          const count = offers.filter(o => o.requestId === req.id).length;
          const isSelected = req.id === activeRequest?.id;

          return (
            <button
              key={req.id}
              onClick={() => setSelectedRequestId(req.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-[#151515] text-[#B5F33D] border-black shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{req.title}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                isSelected ? 'bg-[#B5F33D] text-black' : 'bg-gray-200 text-gray-700'
              }`}>
                {count} {count === 1 ? 'offer' : 'offers'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Request Overview Card */}
      {activeRequest && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{activeRequest.categoryName} • {activeRequest.subcategory}</span>
              <StatusBadge status={activeRequest.status} size="sm" />
            </div>
            <h2 className="text-lg font-black text-[#151515]">{activeRequest.title}</h2>
            <p className="text-xs text-gray-600 line-clamp-2">{activeRequest.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-gray-700">
                <MapPin size={13} className="text-emerald-600" />
                {activeRequest.location.area}
              </span>
              <span>•</span>
              <span>{activeRequest.scheduleType === 'asap' ? '⚡ ASAP' : `${activeRequest.scheduledDate} ${activeRequest.scheduledTimeWindow || ''}`}</span>
            </div>
          </div>

          {/* Customer Budget Box */}
          <div className="bg-lime-50 border border-lime-200 rounded-2xl p-4 text-center sm:text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-lime-900 tracking-wider block">Your Proposed Budget</span>
            <div className="text-2xl font-black text-[#151515] mt-0.5">
              PKR {activeRequest.budget.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-500 font-medium block mt-0.5">
              Providers can match or counter
            </span>
          </div>
        </div>
      )}

      {/* Offers Section Header & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-base font-extrabold text-[#151515] flex items-center gap-2">
            <span>Incoming Offers</span>
            <span className="text-xs font-bold bg-black text-[#B5F33D] px-2 py-0.5 rounded-full">
              {requestOffers.length} Received
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Compare prices, ratings, and arrival times before choosing a specialist.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <ArrowUpDown size={13} className="text-gray-400 ml-1.5" />
          <button
            onClick={() => setOfferSort('price_asc')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              offerSort === 'price_asc' ? 'bg-white shadow text-black font-bold' : 'text-gray-600'
            }`}
          >
            Lowest Price
          </button>
          <button
            onClick={() => setOfferSort('rating_desc')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              offerSort === 'rating_desc' ? 'bg-white shadow text-black font-bold' : 'text-gray-600'
            }`}
          >
            Top Rated
          </button>
          <button
            onClick={() => setOfferSort('arrival')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              offerSort === 'arrival' ? 'bg-white shadow text-black font-bold' : 'text-gray-600'
            }`}
          >
            Fastest Arrival
          </button>
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="space-y-4">
        {sortedOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <Clock size={36} className="mx-auto text-gray-300 mb-2 animate-spin" />
            <h4 className="font-bold text-gray-800 text-sm">Waiting for incoming offers...</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Eligible specialists in {activeRequest?.location.area} have received your request. Competitive bids will appear here in real time.
            </p>
          </div>
        ) : (
          sortedOffers.map(offer => {
            const isMatch = offer.price === activeRequest?.budget;
            const isLower = offer.price < (activeRequest?.budget || 0);
            const isHigher = offer.price > (activeRequest?.budget || 0);

            return (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md flex flex-col gap-4 ${
                  offer.status === 'accepted'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Provider Info */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={offer.providerAvatar}
                      alt={offer.providerName}
                      className="w-13 h-13 rounded-2xl object-cover border border-gray-200 cursor-pointer"
                      onClick={() => {
                        const prov = providers.find(p => p.id === offer.providerId);
                        if (prov) setSelectedProviderForProfile(prov);
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={() => {
                            const prov = providers.find(p => p.id === offer.providerId);
                            if (prov) setSelectedProviderForProfile(prov);
                          }}
                          className="font-extrabold text-base text-[#151515] hover:underline cursor-pointer"
                        >
                          {offer.providerName}
                        </h4>
                        {offer.providerVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle size={11} />
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-gray-600 mt-0.5">
                        {offer.providerSpecialty}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <div className="flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star size={12} className="fill-amber-400 text-amber-500" />
                          <span>{offer.providerRating}</span>
                          <span className="text-gray-400 font-normal">({offer.providerReviewCount})</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-600 font-medium">{offer.providerCompletedJobs} jobs</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-emerald-700 font-semibold">{offer.distanceKm} km away</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Tag & Comparison to Budget */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-right flex-shrink-0">
                    <div className="flex items-center justify-end gap-1.5">
                      {isMatch && (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Agreed to your budget
                        </span>
                      )}
                      {isLower && (
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <TrendingDown size={11} />
                          ₨ {(activeRequest.budget - offer.price).toLocaleString()} below budget!
                        </span>
                      )}
                      {isHigher && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <TrendingUp size={11} />
                          Counteroffer
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-black text-[#151515] mt-1">
                      PKR {offer.price.toLocaleString()}
                    </div>

                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Arrival: <b className="text-black">{offer.expectedArrival}</b>
                    </div>
                  </div>

                </div>

                {/* Offer Message & Included Scope */}
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2 text-xs">
                  <p className="text-gray-800 italic">
                    "{offer.message}"
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-600 pt-1 border-t border-gray-200">
                    <span className="font-bold text-gray-700">Included:</span>
                    {offer.includedWork.map((w, i) => (
                      <span key={i} className="bg-white px-2 py-0.5 rounded border border-gray-200">
                        ✓ {w}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions: View Profile, Chat, Counteroffer, Select */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChatRequestId(offer.requestId)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare size={14} />
                      <span>Chat / Question</span>
                    </button>

                    <button
                      onClick={() => {
                        setCounterModalOffer(offer);
                        setCounterPrice(offer.price - 200 > 500 ? offer.price - 200 : offer.price);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
                    >
                      Counteroffer
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedOfferForBooking(offer)}
                    className="bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-extrabold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span>Accept & Book for PKR {offer.price.toLocaleString()}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Customer Counteroffer Dialog Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-[#151515]">
              Counteroffer to {counterModalOffer.providerName}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Provider quoted PKR {counterModalOffer.price.toLocaleString()}. Propose your revised amount:
            </p>

            <div className="mt-4">
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Your Counter Price (PKR)
              </label>
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-black font-black text-2xl text-[#151515] focus:outline-none focus:ring-2 focus:ring-[#B5F33D]"
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Note / Scope condition
              </label>
              <textarea
                rows={2}
                value={counterNotes}
                onChange={(e) => setCounterNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setCounterModalOffer(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendCounter}
                className="bg-[#151515] text-[#B5F33D] font-extrabold text-xs px-5 py-2 rounded-xl shadow active:scale-95 transition-all"
              >
                Send Counteroffer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
