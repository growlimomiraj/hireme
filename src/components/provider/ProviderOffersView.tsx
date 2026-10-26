import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Tag, Clock, ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ProviderOffersView: React.FC = () => {
  const { offers, currentProvider, requests, setActiveChatRequestId, setActiveProviderTab } = useApp();

  const myOffers = offers.filter(o => o.providerId === currentProvider.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#151515] tracking-tight">My Submitted Offers & Negotiations</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Track customer responses, price revisions, and won bookings.
        </p>
      </div>

      <div className="space-y-4">
        {myOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <Tag size={36} className="mx-auto text-gray-300 mb-2" />
            <h3 className="font-bold text-gray-800 text-sm">No offers submitted yet</h3>
            <p className="text-xs text-gray-500 mt-1">Visit the Nearby Requests tab to place bids.</p>
          </div>
        ) : (
          myOffers.map(offer => {
            const req = requests.find(r => r.id === offer.requestId);

            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-[#151515]">{req?.title || "Job Request"}</h3>
                      <StatusBadge status={offer.status} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Customer: <b>{req?.customerName}</b> • Sector: <b>{req?.location.area}</b>
                    </p>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Submitted: {new Date(offer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Revision #{offer.revision}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Your Quoted Total</span>
                    <span className="text-2xl font-black text-black">
                      PKR {offer.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Offer Note / Counter message */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
                  <p className="text-gray-700 italic">"{offer.message}"</p>
                  <div className="text-[11px] text-gray-500 mt-2">
                    Arrival commitment: <b>{offer.expectedArrival}</b> • Duration: <b>{offer.estimatedDurationHours} hrs</b>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <button
                    onClick={() => setActiveChatRequestId(offer.requestId)}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 font-bold text-gray-700"
                  >
                    <MessageSquare size={13} />
                    <span>Chat with Customer</span>
                  </button>

                  {offer.status === 'accepted' ? (
                    <button
                      onClick={() => setActiveProviderTab('jobs')}
                      className="bg-[#B5F33D] text-[#151515] font-black px-4 py-2 rounded-xl shadow flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      <span>Go to Active Job</span>
                    </button>
                  ) : (
                    <span className="text-gray-400 font-medium">Awaiting customer decision</span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
