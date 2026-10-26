import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Phone,
  MessageSquare,
  KeyRound,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Star,
  FileCheck
} from 'lucide-react';

export const CustomerJobTracker: React.FC = () => {
  const {
    bookings,
    updateBookingStatus,
    submitReview,
    setActiveChatRequestId
  } = useApp();

  // Review Modal State
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('Very professional work. Arrived on time and solved the issue quickly.');

  // Find active or recent bookings
  const activeBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const handleConfirmCompletion = (booking: Booking) => {
    updateBookingStatus(booking.id, 'completed', 'Customer inspected and approved completed work.');
    setReviewBookingId(booking.id);
  };

  const handleSubmitReview = () => {
    if (!reviewBookingId) return;
    submitReview(reviewBookingId, rating, comment);
    setReviewBookingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#151515] tracking-tight">Active Bookings & Trackers</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Live stage progression, Start PIN verification, and payment capture
        </p>
      </div>

      {/* Active Bookings List */}
      {activeBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
          <Clock size={36} className="mx-auto text-gray-300 mb-2" />
          <h3 className="font-bold text-gray-800 text-sm">No bookings currently active</h3>
          <p className="text-xs text-gray-500 mt-1">Accept an incoming offer to start a confirmed job.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {activeBookings.map(booking => {
            const isEnRoute = booking.status === 'on_the_way';
            const hasArrived = booking.status === 'arrived';
            const isInProgress = booking.status === 'in_progress';
            const isPendingApproval = booking.status === 'completion_pending';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-5"
              >
                {/* Top Row: Provider & Job Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.providerAvatar}
                      alt={booking.providerName}
                      className="w-13 h-13 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-[#151515]">{booking.providerName}</h3>
                        <StatusBadge status={booking.status} size="sm" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{booking.providerSpecialty}</p>
                      <span className="text-[11px] text-gray-400">Exact address: {booking.exactAddress}</span>
                    </div>
                  </div>

                  {/* Price & Contact */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <div className="text-xl font-black text-black">
                      PKR {booking.agreedPrice.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${booking.providerPhone}`}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1 text-xs font-bold text-gray-700"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={() => setActiveChatRequestId(booking.requestId)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#B5F33D] hover:bg-[#a6e632] flex items-center gap-1 text-xs font-bold text-black"
                      >
                        <MessageSquare size={13} />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Anti-Fraud Start PIN Display (Crucial inDrive Requirement!) */}
                <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-[#B5F33D] flex items-center justify-center flex-shrink-0">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        Customer Service Start PIN
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Give this 4-digit code to the specialist <b>only after they arrive</b> at your door.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-black rounded-xl px-5 py-2 text-center self-start sm:self-auto shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Start PIN</span>
                    <span className="text-2xl font-black tracking-widest text-[#151515]">
                      {booking.startPin}
                    </span>
                  </div>
                </div>

                {/* Live Timeline Progression */}
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                    Job Progression Timeline
                  </span>
                  <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                    {booking.timeline.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3 pl-8">
                        <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-black border-2 border-[#B5F33D]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-black">
                              {step.status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {step.note && (
                            <p className="text-xs text-gray-600 mt-0.5">{step.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Completion Approval Button */}
                {isPendingApproval && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-orange-600" />
                      <span className="font-extrabold text-sm text-orange-950">
                        Specialist submitted job as complete!
                      </span>
                    </div>
                    <p className="text-xs text-orange-800">
                      Please inspect the tap/fitting. Once you click confirm, the pre-authorized hold of PKR {booking.agreedPrice.toLocaleString()} will be captured and paid to the specialist.
                    </p>
                    <button
                      onClick={() => handleConfirmCompletion(booking)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      ✓ Confirm Work Done & Release Payment
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-[#151515]">
              Rate & Review Specialist
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Your feedback helps keep the ServiceBid marketplace honest and trusted.
            </p>

            <div className="flex items-center justify-center gap-2 my-5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-125"
                >
                  <Star
                    size={32}
                    className={star <= rating ? 'fill-amber-400 text-amber-500' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                Your Review
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#B5F33D]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setReviewBookingId(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-xs text-gray-700"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-[#B5F33D] text-[#151515] font-extrabold text-xs px-5 py-2 rounded-xl shadow active:scale-95 transition-all"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
