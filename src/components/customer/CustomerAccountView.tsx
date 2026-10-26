import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  MapPin,
  FileText,
  Shield,
  Bell,
  LogOut,
  CheckCircle2,
  Phone,
  Download,
  CreditCard
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const { currentUser, bookings, setIsPhoneAuthOpen, resetDatabase } = useApp();

  const customerBookings = bookings.filter(b => b.customerId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Account Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#151515]">{currentUser.name}</h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={11} /> Verified Phone
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{currentUser.phone}</p>
            <span className="text-[11px] text-gray-400">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => setIsPhoneAuthOpen(true)}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700"
        >
          Manage Profile
        </button>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#151515] flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" />
            <span>Saved Locations in Islamabad / Rawalpindi</span>
          </h3>
          <button
            onClick={() => alert("Add address dialog")}
            className="text-xs font-bold text-black underline"
          >
            + Add Address
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {currentUser.savedAddresses?.map((addr, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-800">{addr}</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Default</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking History & Receipts */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-[#151515] flex items-center gap-2">
          <FileText size={18} className="text-gray-700" />
          <span>Booking History & Itemized Receipts</span>
        </h3>

        <div className="space-y-3 text-xs">
          {customerBookings.map(b => (
            <div
              key={b.id}
              className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">{b.requestTitle}</span>
                  <span className="text-[10px] font-semibold text-gray-400 font-mono">#{b.id}</span>
                </div>
                <div className="text-gray-500 text-[11px] mt-0.5">
                  Specialist: <b>{b.providerName}</b> • {new Date(b.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span className="font-black text-black block">PKR {b.agreedPrice.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 capitalize">{b.status}</span>
                </div>

                <button
                  onClick={() => alert(`Downloading formal PDF receipt for booking ${b.id} with NTN breakdown.`)}
                  className="p-2 rounded-xl border border-gray-300 hover:bg-white text-gray-700 transition-colors"
                  title="Download Receipt"
                >
                  <Download size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Seed Demo Data */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-gray-800 block">Reset Interactive Demo State</span>
          <span className="text-gray-500">Restore all initial bids, requests, and active jobs to seed fixtures.</span>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Reset all local data back to seed state?")) {
              resetDatabase();
            }
          }}
          className="bg-black text-[#B5F33D] font-extrabold px-3 py-1.5 rounded-xl hover:bg-gray-800"
        >
          Reset Demo
        </button>
      </div>

    </div>
  );
};
