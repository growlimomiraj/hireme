import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest } from '../../types';
import { X, Clock, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const QuoteComposerModal: React.FC = () => {
  const {
    selectedRequestForQuote,
    setSelectedRequestForQuote,
    currentProvider,
    submitOffer,
    setActiveProviderTab
  } = useApp();

  if (!selectedRequestForQuote) return null;

  const req = selectedRequestForQuote;

  // Form State
  const [price, setPrice] = useState<number>(req.budget + 500); // Default slight counter or matching
  const [labor, setLabor] = useState<number>(req.budget + 300);
  const [materials, setMaterials] = useState<number>(200);
  const [callOutFee, setCallOutFee] = useState<number>(0);
  const [expectedArrival, setExpectedArrival] = useState<string>('Within 45 minutes');
  const [estimatedDurationHours, setEstimatedDurationHours] = useState<number>(1.5);
  const [includedWork, setIncludedWork] = useState<string>('Complete diagnosis, precision repair, and pressure seal leak test');
  const [excludedWork, setExcludedWork] = useState<string>('Concealed wall tiling reconstruction');
  const [message, setMessage] = useState<string>(
    `Salam ${req.customerName}! I specialize in this exact repair in ${req.location.area}. I have all required tools and genuine replacement parts ready.`
  );

  const handleSubmit = () => {
    submitOffer({
      requestId: req.id,
      providerId: currentProvider.id,
      price,
      labor,
      materials,
      callOutFee,
      includedWork: includedWork.split(',').map(s => s.trim()),
      excludedWork: excludedWork.split(',').map(s => s.trim()),
      expectedArrival,
      estimatedDurationHours,
      message,
      isCounteroffer: price !== req.budget,
      previousPrice: req.budget
    });

    setSelectedRequestForQuote(null);
    setActiveProviderTab('offers');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Provider Quote & Counteroffer Composer
            </span>
            <h2 className="text-lg font-black text-[#151515] mt-0.5">
              Quote on: {req.title}
            </h2>
          </div>
          <button
            onClick={() => setSelectedRequestForQuote(null)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Customer Budget reference */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Customer Proposed Budget</span>
              <span className="text-sm font-black text-black">PKR {req.budget.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Customer Sector</span>
              <span className="text-xs font-semibold text-gray-700">{req.location.area}</span>
            </div>
          </div>

          {/* Quote Total */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
              Your Total Quoted Price (PKR)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-lg font-bold text-gray-400">₨</span>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPrice(val);
                  setLabor(val - materials);
                }}
                className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-black font-black text-xl text-[#151515] focus:ring-2 focus:ring-[#B5F33D]"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => { setPrice(req.budget); setLabor(req.budget); setMaterials(0); }}
                className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100"
              >
                Match Customer Budget (₨ {req.budget.toLocaleString()})
              </button>
            </div>
          </div>

          {/* Arrival & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Expected Arrival Time
              </label>
              <input
                type="text"
                value={expectedArrival}
                onChange={(e) => setExpectedArrival(e.target.value)}
                placeholder="e.g. Within 30 mins"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Est. Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                value={estimatedDurationHours}
                onChange={(e) => setEstimatedDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold"
              />
            </div>
          </div>

          {/* Included / Excluded Scope */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
              Included Scope (Comma separated)
            </label>
            <input
              type="text"
              value={includedWork}
              onChange={(e) => setIncludedWork(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
              Excluded Work / Parts
            </label>
            <input
              type="text"
              value={excludedWork}
              onChange={(e) => setExcludedWork(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 font-medium"
            />
          </div>

          {/* Provider Note to Customer */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
              Message to Customer
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedRequestForQuote(null)}
            className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow border border-black/10 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Submit Quote (PKR {price.toLocaleString()})</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};
