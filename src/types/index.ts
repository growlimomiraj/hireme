// ServiceBid TypeScript Data Types

export type UserRole = 'customer' | 'provider' | 'admin';

export type VerificationStatus =
  | 'not_submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'resubmission_required'
  | 'suspended';

export type RequestStatus =
  | 'draft'
  | 'open'
  | 'reserved'
  | 'confirmed'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completion_pending'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'expired';

export type PaymentStatus =
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'voided'
  | 'refunded';

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'countered'
  | 'withdrawn'
  | 'expired';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar: string;
  isPhoneVerified: boolean;
  savedAddresses?: string[];
  createdAt: string;
}

export interface ProviderDocument {
  id: string;
  type: 'cnic_front' | 'cnic_back' | 'trade_license' | 'police_clearance' | 'skills_certificate';
  name: string;
  url: string;
  status: VerificationStatus;
  uploadedAt: string;
  notes?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  name: string;
  businessName?: string;
  specialty: string;
  categoryIds: string[];
  subcategories: string[];
  bio: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationReason?: string;
  documents: ProviderDocument[];
  isOnline: boolean;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
  };
  coverageRadiusKm: number;
  startingPrice: number;
  priceType: 'fixed' | 'hourly' | 'quote_required';
  weeklySchedule: {
    day: string;
    available: boolean;
    hours: string;
  }[];
  portfolio: {
    title: string;
    image: string;
  }[];
  phone: string;
  avatar: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  categoryId: string;
  categoryName: string;
  subcategory: string;
  title: string;
  description: string;
  photos: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string; // e.g. "F-10 Islamabad" (approximate shown to bidders)
  };
  scheduleType: 'asap' | 'scheduled';
  scheduledDate?: string;
  scheduledTimeWindow?: string;
  budget: number; // Customer offered price in PKR
  currency: string;
  isInspectionNeeded: boolean;
  inspectionFee?: number;
  scopeNotes: string;
  materialsResponsibility: 'customer' | 'provider' | 'split';
  accessInstructions?: string;
  directProviderId?: string;
  broadcastAllowed: boolean;
  status: RequestStatus;
  createdAt: string;
  expiresAt: string;
  revision: number;
}

export interface PriceBreakdown {
  labor: number;
  materials?: number;
  callOutFee?: number;
  platformFee: number;
  taxes: number;
  total: number;
}

export interface Offer {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  providerRating: number;
  providerReviewCount: number;
  providerCompletedJobs: number;
  providerAvatar: string;
  providerVerified: boolean;
  distanceKm: number;
  price: number; // PKR
  breakdown: PriceBreakdown;
  includedWork: string[];
  excludedWork: string[];
  expectedArrival: string;
  estimatedDurationHours: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
  expiresAt: string;
  revision: number;
  isCounteroffer: boolean;
  previousPrice?: number;
}

export interface ChangeOrder {
  id: string;
  bookingId: string;
  description: string;
  additionalAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Booking {
  id: string;
  requestId: string;
  requestTitle: string;
  categoryId: string;
  categoryName: string;
  selectedOfferId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  providerPhone: string;
  providerAvatar: string;
  agreedPrice: number;
  currency: string;
  breakdown: PriceBreakdown;
  exactAddress: string;
  approxArea: string;
  location: {
    lat: number;
    lng: number;
  };
  startPin: string; // 4-digit code e.g. "4892"
  status: RequestStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'preauth_card' | 'jazzcash' | 'easypaisa' | 'cash_on_completion';
  timeline: {
    status: RequestStatus;
    timestamp: string;
    note?: string;
  }[];
  changeOrders: ChangeOrder[];
  completionNotes?: string;
  completionPhotos?: string[];
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  requestId?: string;
  bookingId?: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  attachmentUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  requestId?: string;
  bookingId?: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCounts: Record<string, number>;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'offer_received' | 'counteroffer' | 'offer_accepted' | 'booking_status' | 'message' | 'payment';
  linkTarget?: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  providerId: string;
  rating: number; // 1 to 5
  comment: string;
  serviceQualityRating?: number;
  punctualityRating?: number;
  providerResponse?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  bookingId?: string;
  type: 'dispute' | 'payment' | 'safety' | 'general';
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  resolution?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string;
  timestamp: string;
}

export interface ProviderEarningsSummary {
  grossEarnings: number;
  platformFeesPaid: number;
  netPayable: number;
  pendingPayout: number;
  completedPayouts: number;
  ledgerEntries: {
    id: string;
    bookingId: string;
    jobTitle: string;
    grossAmount: number;
    fee: number;
    netAmount: number;
    status: 'authorized' | 'captured' | 'paid_out';
    date: string;
  }[];
}
