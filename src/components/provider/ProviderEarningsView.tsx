import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config';
import {
  Wallet,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Clock,
  Building,
  CreditCard
} from 'lucide-react';

export const ProviderEarningsView: React.FC = () => {
  const { currentProvider, bookings } = useApp();

  const [payoutRequested, setPayoutRequested] = useState(false);

  // Compute stats from bookings
  const completedJobs = bookings.filter(b => b.providerId === currentProvider.id && b.status === 'completed');
  const grossCompleted = completedJobs.reduce((sum, b) => sum + b.agreedPrice, 0) + 18500; // adding baseline history
  const commissionRate = APP_CONFIG.platformCommissionRate; // 10%
  const platformFees = Math.round(grossCompleted * commissionRate);
  const netEarnings = grossCompleted - platformFees;

  const inProgressJobs = bookings.filter(b => b.providerId === currentProvider.id && ['confirmed', 'in_progress', 'completion_pending'].includes(b.status));
  const authorizedHold = inProgressJobs.reduce((sum, b) => sum + b.agreedPrice, 0);

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      alert("Payout request submitted! Funds will be transferred via JazzCash/Bank within 24 hours.");
      setPayoutRequested(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#151515] tracking-tight">Earnings & Financial Ledger</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Breakdown of captured job amounts, platform commission ({commissionRate * 100}%), and payouts.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Net Available to Withdraw */}
        <div className="bg-lime-50 border-2 border-lime-300 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-lime-950 uppercase tracking-wide block">
            Net Available for Payout
          </span>
          <div className="text-3xl font-black text-[#151515]">
            PKR {netEarnings.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-600 pt-1">
            Payable via JazzCash, EasyPaisa, or IBAN
          </p>
          <button
            onClick={handleRequestPayout}
            disabled={payoutRequested}
            className="mt-3 w-full bg-[#151515] hover:bg-black text-[#B5F33D] font-extrabold text-xs py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow"
          >
            <ArrowUpRight size={14} />
            <span>{payoutRequested ? "Processing..." : "Withdraw Funds"}</span>
          </button>
        </div>

        {/* Authorized Pre-auth Holds */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            Active Pre-auth Holds
          </span>
          <div className="text-3xl font-black text-[#151515]">
            PKR {authorizedHold.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 pt-1">
            Held securely in customer accounts; captured upon job completion.
          </p>
        </div>

        {/* Total Platform Fee Deducted */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
            Platform Fees Paid (10%)
          </span>
          <div className="text-3xl font-black text-gray-800">
            PKR {platformFees.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 pt-1">
            Covers verification, customer dispute guarantee, and marketplace operations.
          </p>
        </div>

      </div>

      {/* Payout Destination Account */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-800">
            <Building size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Default Payout Account</span>
            <div className="font-extrabold text-sm text-[#151515]">Meezan Bank Ltd (Islamabad F-10 Branch)</div>
            <div className="text-xs text-gray-500">IBAN: PK64MEZN0001002003004005 • Tariq Mehmood</div>
          </div>
        </div>

        <button
          onClick={() => alert("Payout account edit dialog (configured via NADRA-linked title verification).")}
          className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
        >
          Change Account
        </button>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#151515]">Recent Completed Job Statements</h3>
          <span className="text-xs text-gray-400">All amounts in PKR</span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900">Distribution Board Circuit Breaker Repair</div>
              <div className="text-[11px] text-gray-400">F-10/1 Islamabad • Miraj Khalid</div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700 block">+PKR 1,350 net</span>
              <span className="text-[10px] text-gray-400">(PKR 1,500 gross - 150 fee)</span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900">Underground Water Tank Sanitation</div>
              <div className="text-[11px] text-gray-400">F-10/1 Islamabad • Completed Oct 20</div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700 block">+PKR 1,980 net</span>
              <span className="text-[10px] text-gray-400">(PKR 2,200 gross - 220 fee)</span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900">Quarterly Bathroom Fixture Servicing</div>
              <div className="text-[11px] text-gray-400">F-8/3 Islamabad • Completed Oct 14</div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-700 block">+PKR 2,700 net</span>
              <span className="text-[10px] text-gray-400">(PKR 3,000 gross - 300 fee)</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
