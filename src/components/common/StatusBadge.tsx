import React from 'react';
import { RequestStatus, PaymentStatus, VerificationStatus, OfferStatus } from '../../types';

interface StatusBadgeProps {
  status: RequestStatus | PaymentStatus | VerificationStatus | OfferStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      // Request / Booking Lifecycle
      case 'open':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'reserved':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'on_the_way':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'arrived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'in_progress':
        return 'bg-[#B5F33D] text-[#151515] border-black font-bold';
      case 'completion_pending':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'disputed':
        return 'bg-rose-600 text-white border-rose-700';

      // Payment Lifecycle
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'authorized':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300 font-semibold';
      case 'captured':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'refunded':
        return 'bg-gray-200 text-gray-800 border-gray-400';
      case 'voided':
        return 'bg-zinc-200 text-zinc-700 border-zinc-400';

      // Verification Status
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
      case 'under_review':
        return 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';
      case 'rejected':
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-300';

      // Offer Status
      case 'accepted':
        return 'bg-emerald-500 text-white border-emerald-600 font-bold';
      case 'countered':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300 font-bold';
      case 'declined':
        return 'bg-gray-200 text-gray-600 border-gray-300';

      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').toUpperCase();
  };

  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border tracking-wide font-medium ${sizeClasses} ${getStyles()}`}>
      {formatText(status)}
    </span>
  );
};
