import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Offer } from '../../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BookingConfirmModal: React.FC = () => {
  const {
    selectedOfferForBooking,
    setSelectedOfferForBooking,
    confirmBooking,
    setActiveCustomerTab
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'preauth_card' | 'jazzcash' | 'easypaisa' | 'cash_on_completion'>('preauth_card');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!selectedOfferForBooking) return null;

  const offer = selectedOfferForBooking;
  const platformFee = offer.breakdown.platformFee;
  const totalAmount = offer.price;

  const handleConfirmAndPay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const booking = confirmBooking(offer.id, paymentMethod);
      setIsProcessing(false);
      setSelectedOfferForBooking(null);

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setActiveCustomerTab('requests');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
              <Lock size={12} />
              <span>Secure Pre-authorization & Slot Hold</span>
            </div>
            <h2 className="text-lg font-black text-[#151515] mt-1">
              Confirm Booking & Specialist
            </h2>
          </div>
          <button
            onClick={() => setSelectedOfferForBooking(null)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Provider Card */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex items-center gap-3">
            <img
              src={offer.providerAvatar}
              alt={offer.providerName}
              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-[#151515]">{offer.providerName}</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">Verified Pro</span>
              </div>
              <p className="text-gray-500 font-medium text-[11px]">{offer.providerSpecialty}</p>
              <div className="text-[11px] text-gray-600 mt-0.5">
                Arrival: <b className="text-black">{offer.expectedArrival}</b>
              </div>
            </div>
          </div>

          {/* Agreed Scope Breakdown */}
          <div className="border border-gray-200 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-gray-800 uppercase tracking-wider text-[10px] block">
              Agreed Work & Inclusions
            </span>
            <ul className="space-y-1 text-gray-600">
              {offer.includedWork.map((inc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transparent Itemized Price Breakdown */}
          <div className="bg-lime-50/70 border border-lime-200 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-lime-950 uppercase tracking-wider text-[10px] block">
              Itemized Total
            </span>
            <div className="flex justify-between text-gray-700">
              <span>Specialist Labor:</span>
              <span className="font-semibold">PKR {offer.breakdown.labor.toLocaleString()}</span>
            </div>
            {Boolean(offer.breakdown.materials) && (
              <div className="flex justify-between text-gray-700">
                <span>Materials / Consumables:</span>
                <span className="font-semibold">PKR {offer.breakdown.materials?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700">
              <span>Platform Service & Guarantee Fee:</span>
              <span className="font-semibold">PKR {platformFee.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-lime-200 flex justify-between items-center text-sm font-black text-black">
              <span>Agreed Total to Authorize:</span>
              <span className="text-base">PKR {totalAmount.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-gray-500 block pt-1">
              🔒 Funds are pre-authorized (held securely) and only captured after you verify completed work.
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block mb-2">
              Select Payment Authorization Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'preauth_card', name: 'Credit / Debit Card', icon: CreditCard, desc: 'Pre-auth hold' },
                { id: 'jazzcash', name: 'JazzCash Wallet', icon: Wallet, desc: 'Instant OTP hold' },
                { id: 'easypaisa', name: 'EasyPaisa Wallet', icon: Wallet, desc: 'Instant OTP hold' },
                { id: 'cash_on_completion', name: 'Cash on Completion', icon: Banknote, desc: 'Pay after job' }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      isSelected
                        ? 'bg-black text-white border-black shadow'
                        : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon size={14} className={isSelected ? 'text-[#B5F33D]' : 'text-gray-500'} />
                      <span className="font-bold text-xs">{method.name}</span>
                    </div>
                    <span className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                      {method.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cancellation Policy terms */}
          <label className="flex items-start gap-2 text-gray-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 accent-black rounded"
            />
            <span className="text-[11px]">
              I agree to the booking terms. Free cancellation up until the specialist is on the way. Once confirmed, competing offers will be closed.
            </span>
          </label>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedOfferForBooking(null)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>

          <button
            onClick={handleConfirmAndPay}
            disabled={!agreedToTerms || isProcessing}
            className="bg-[#B5F33D] hover:bg-[#a6e632] disabled:opacity-50 text-[#151515] font-black text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg border border-black/10 active:scale-95 transition-all"
          >
            {isProcessing ? (
              <span>Authorizing PKR {totalAmount.toLocaleString()}...</span>
            ) : (
              <>
                <span>Lock Provider & Confirm</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
