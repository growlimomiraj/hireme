import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  KeyRound,
  CheckCircle2,
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  PlusCircle,
  Camera,
  AlertCircle
} from 'lucide-react';

export const ProviderJobsView: React.FC = () => {
  const {
    bookings,
    currentProvider,
    updateBookingStatus,
    verifyStartPin,
    setActiveChatRequestId
  } = useApp();

  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activePinBookingId, setActivePinBookingId] = useState<string | null>(null);

  // Change order modal
  const [changeOrderModalBooking, setChangeOrderModalBooking] = useState<Booking | null>(null);
  const [extraAmount, setExtraAmount] = useState<number>(500);
  const [extraReason, setExtraReason] = useState<string>('Additional 2-inch PVC elbow replacement and chemical pipe sealer.');

  // Filter jobs for this provider
  const providerJobs = bookings.filter(b => b.providerId === currentProvider.id);

  const handleVerifyPin = (bookingId: string) => {
    const success = verifyStartPin(bookingId, pinInput);
    if (success) {
      setPinInput('');
      setPinError('');
      setActivePinBookingId(null);
    } else {
      setPinError('Invalid PIN! Please ask the customer for the 4-digit PIN shown on their screen.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#151515] tracking-tight">Active Jobs & Execution</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Update your location status, verify the customer's Start PIN, and mark work complete.
        </p>
      </div>

      <div className="space-y-5">
        {providerJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <Clock size={36} className="mx-auto text-gray-300 mb-2" />
            <h3 className="font-bold text-gray-800 text-sm">No jobs booked right now</h3>
            <p className="text-xs text-gray-500 mt-1">Submit competitive bids on Nearby Requests to get hired.</p>
          </div>
        ) : (
          providerJobs.map(job => {
            const isConfirmed = job.status === 'confirmed';
            const isEnRoute = job.status === 'on_the_way';
            const hasArrived = job.status === 'arrived';
            const isInProgress = job.status === 'in_progress';
            const isPendingApproval = job.status === 'completion_pending';
            const isCompleted = job.status === 'completed';

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-[#151515]">{job.requestTitle}</h3>
                      <StatusBadge status={job.status} size="sm" />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mt-0.5">
                      Customer: <b>{job.customerName}</b> ({job.approxArea})
                    </p>
                    <p className="text-xs text-emerald-800 font-bold mt-1 flex items-center gap-1">
                      <MapPin size={13} />
                      Exact Address: {job.exactAddress}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Agreed Job Total</span>
                    <span className="text-2xl font-black text-black">
                      PKR {job.agreedPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Communication and Call */}
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${job.customerPhone}`}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold text-gray-700"
                  >
                    <Phone size={13} />
                    <span>Call Customer ({job.customerPhone})</span>
                  </a>

                  <button
                    onClick={() => setActiveChatRequestId(job.requestId)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center gap-1.5 text-xs font-bold text-gray-800"
                  >
                    <MessageSquare size={13} />
                    <span>In-App Chat</span>
                  </button>
                </div>

                {/* Stage Progression Controls for Provider */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <span className="text-[10px] uppercase font-extrabold text-gray-500 tracking-wider block">
                    Execution Controls (Update Progress)
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Step 1: On the Way */}
                    {isConfirmed && (
                      <button
                        onClick={() => updateBookingStatus(job.id, 'on_the_way', 'Specialist started traveling to destination.')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow active:scale-95"
                      >
                        <Navigation size={14} />
                        <span>I am on the way</span>
                      </button>
                    )}

                    {/* Step 2: Arrived */}
                    {isEnRoute && (
                      <button
                        onClick={() => updateBookingStatus(job.id, 'arrived', 'Specialist arrived at customer location.')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow active:scale-95"
                      >
                        <MapPin size={14} />
                        <span>I have arrived at gate</span>
                      </button>
                    )}

                    {/* Step 3: Verify Start PIN to commence work */}
                    {hasArrived && (
                      <div className="w-full bg-lime-50 p-3.5 rounded-xl border border-lime-300 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-lime-950">
                          <KeyRound size={16} />
                          <span>Enter Customer's 4-Digit Start PIN to Begin Work</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Ask the customer for the Start PIN displayed on their app. (Demo: try entering <b>{job.startPin}</b>)
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="PIN"
                            className="w-24 px-3 py-2 rounded-xl border-2 border-black font-black text-center text-lg tracking-widest bg-white"
                          />
                          <button
                            onClick={() => handleVerifyPin(job.id)}
                            className="bg-[#151515] text-[#B5F33D] font-black text-xs px-4 py-2.5 rounded-xl shadow active:scale-95"
                          >
                            Verify & Start Job
                          </button>
                        </div>
                        {pinError && (
                          <span className="text-xs font-bold text-red-600 block">{pinError}</span>
                        )}
                      </div>
                    )}

                    {/* Step 4: In Progress controls */}
                    {isInProgress && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setChangeOrderModalBooking(job)}
                          className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <PlusCircle size={14} />
                          <span>Add Change Order (Extra Work)</span>
                        </button>

                        <button
                          onClick={() => updateBookingStatus(job.id, 'completion_pending', 'Work finished. Submitted for customer inspection.')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={15} />
                          <span>Submit Work Complete</span>
                        </button>
                      </div>
                    )}

                    {isPendingApproval && (
                      <span className="text-xs font-bold text-orange-800 bg-orange-100 px-3 py-2 rounded-xl flex items-center gap-1">
                        <Clock size={14} />
                        <span>Awaiting customer's inspection & payment release</span>
                      </span>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-2 rounded-xl flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>Job Completed & Funds Captured to Wallet</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Change Order Modal */}
      {changeOrderModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-[#151515]">
              Itemize Extra Work (Change Order)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Any extra unforeseen repairs require explicit approval and additional authorization by the customer.
            </p>

            <div className="mt-4">
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Additional Amount (PKR)
              </label>
              <input
                type="number"
                value={extraAmount}
                onChange={(e) => setExtraAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 font-black text-lg"
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Description of Extra Work / Parts
              </label>
              <textarea
                rows={3}
                value={extraReason}
                onChange={(e) => setExtraReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setChangeOrderModalBooking(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-xs text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Change order of PKR ${extraAmount} sent to customer for approval.`);
                  setChangeOrderModalBooking(null);
                }}
                className="bg-[#151515] text-[#B5F33D] font-extrabold text-xs px-5 py-2 rounded-xl shadow active:scale-95"
              >
                Send Change Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
