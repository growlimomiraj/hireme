import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  ProviderProfile,
  ServiceRequest,
  Offer,
  Booking,
  ChatMessage,
  NotificationItem,
  Review,
  SupportTicket,
  AuditLog
} from '../types';
import { ServiceBidDB } from '../services/db';
import { APP_CONFIG, TRANSLATIONS } from '../config';

interface AppContextType {
  // Roles & Users
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: User;
  currentProvider: ProviderProfile;
  providers: ProviderProfile[];
  requests: ServiceRequest[];
  offers: Offer[];
  bookings: Booking[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  reviews: Review[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLog[];

  // Localization
  lang: 'en' | 'ur';
  setLang: (l: 'en' | 'ur') => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;

  // Selected filters
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userLocation: { area: string; lat: number; lng: number };
  setUserLocation: (loc: { area: string; lat: number; lng: number }) => void;
  viewMode: 'list' | 'map';
  setViewMode: (m: 'list' | 'map') => void;

  // Navigation tab for Customer / Provider
  activeCustomerTab: 'home' | 'requests' | 'offers' | 'messages' | 'account';
  setActiveCustomerTab: (tab: 'home' | 'requests' | 'offers' | 'messages' | 'account') => void;
  activeProviderTab: 'nearby' | 'offers' | 'jobs' | 'earnings' | 'profile';
  setActiveProviderTab: (tab: 'nearby' | 'offers' | 'jobs' | 'earnings' | 'profile') => void;

  // Active Modals & Selection
  selectedProviderForProfile: ProviderProfile | null;
  setSelectedProviderForProfile: (p: ProviderProfile | null) => void;
  selectedRequestForQuote: ServiceRequest | null;
  setSelectedRequestForQuote: (r: ServiceRequest | null) => void;
  selectedOfferForBooking: Offer | null;
  setSelectedOfferForBooking: (o: Offer | null) => void;
  activeChatRequestId: string | null;
  setActiveChatRequestId: (id: string | null) => void;
  isPostRequestOpen: boolean;
  setIsPostRequestOpen: (open: boolean) => void;
  isChecklistOpen: boolean;
  setIsChecklistOpen: (open: boolean) => void;
  isPhoneAuthOpen: boolean;
  setIsPhoneAuthOpen: (open: boolean) => void;

  // Operations
  createRequest: (data: any) => ServiceRequest;
  submitOffer: (data: any) => Offer;
  counterOffer: (offerId: string, counterPrice: number, notes: string) => Offer;
  confirmBooking: (offerId: string, paymentMethod: any) => Booking;
  updateBookingStatus: (bookingId: string, status: any, note?: string) => void;
  verifyStartPin: (bookingId: string, pin: string) => boolean;
  sendMessage: (requestId: string, text: string) => void;
  submitReview: (bookingId: string, rating: number, comment: string) => void;
  toggleProviderOnline: (isOnline: boolean) => void;
  adminVerifyProvider: (providerId: string, approved: boolean, reason: string) => void;
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = ServiceBidDB.getInstance();

  const [role, setRole] = useState<UserRole>('customer');
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  // DB State mirrors
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Navigation & UI States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState({
    area: "F-10 Islamabad",
    lat: 33.6930,
    lng: 73.0070
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeCustomerTab, setActiveCustomerTab] = useState<'home' | 'requests' | 'offers' | 'messages' | 'account'>('home');
  const [activeProviderTab, setActiveProviderTab] = useState<'nearby' | 'offers' | 'jobs' | 'earnings' | 'profile'>('nearby');

  // Modals
  const [selectedProviderForProfile, setSelectedProviderForProfile] = useState<ProviderProfile | null>(null);
  const [selectedRequestForQuote, setSelectedRequestForQuote] = useState<ServiceRequest | null>(null);
  const [selectedOfferForBooking, setSelectedOfferForBooking] = useState<Offer | null>(null);
  const [activeChatRequestId, setActiveChatRequestId] = useState<string | null>(null);
  const [isPostRequestOpen, setIsPostRequestOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isPhoneAuthOpen, setIsPhoneAuthOpen] = useState(false);

  // Sync state from DB
  const refreshFromDB = () => {
    setProviders(db.getProviders());
    setRequests(db.getRequests());
    setOffers(db.getOffers());
    setBookings(db.getBookings());
    setMessages(db.getMessages());
    setNotifications(db.getNotifications());
    setReviews(db.getReviews());
    setSupportTickets(db.getSupportTickets());
    setAuditLogs(db.getAuditLogs());
  };

  useEffect(() => {
    refreshFromDB();
    const unsub = db.subscribe(refreshFromDB);
    return unsub;
  }, []);

  // Update HTML direction when language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Current user / provider mock representations
  const currentUser: User = db.getUsers().find(u => u.role === (role === 'admin' ? 'admin' : 'customer')) || db.getUsers()[0];
  const currentProvider: ProviderProfile = providers.find(p => p.id === 'prov_1') || providers[0] || {} as any;

  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
  };

  // Actions
  const createRequest = (data: any) => {
    return db.createRequest({
      ...data,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      currency: APP_CONFIG.currency.code
    });
  };

  const submitOffer = (data: any) => {
    return db.submitOffer(data);
  };

  const counterOffer = (offerId: string, counterPrice: number, notes: string) => {
    return db.counterOffer(offerId, counterPrice, notes);
  };

  const confirmBooking = (offerId: string, paymentMethod: any) => {
    return db.selectOfferAndConfirmBooking(offerId, paymentMethod);
  };

  const updateBookingStatus = (bookingId: string, status: any, note?: string) => {
    db.updateBookingStatus(bookingId, status, note);
  };

  const verifyStartPin = (bookingId: string, pin: string) => {
    return db.verifyStartPin(bookingId, pin);
  };

  const sendMessage = (requestId: string, text: string) => {
    const senderRole = role;
    const senderName = role === 'provider' ? currentProvider.name : currentUser.name;
    const senderId = role === 'provider' ? currentProvider.id : currentUser.id;
    db.sendMessage(requestId, senderId, senderRole, senderName, text);
  };

  const submitReview = (bookingId: string, rating: number, comment: string) => {
    db.submitReview(bookingId, rating, comment);
  };

  const toggleProviderOnline = (isOnline: boolean) => {
    if (currentProvider?.id) {
      db.toggleProviderOnline(currentProvider.id, isOnline);
    }
  };

  const adminVerifyProvider = (providerId: string, approved: boolean, reason: string) => {
    db.adminVerifyProvider(providerId, approved, reason);
  };

  const resetDatabase = () => {
    db.resetToSeedData();
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        currentProvider,
        providers,
        requests,
        offers,
        bookings,
        messages,
        notifications,
        reviews,
        supportTickets,
        auditLogs,
        lang,
        setLang,
        t,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        userLocation,
        setUserLocation,
        viewMode,
        setViewMode,
        activeCustomerTab,
        setActiveCustomerTab,
        activeProviderTab,
        setActiveProviderTab,
        selectedProviderForProfile,
        setSelectedProviderForProfile,
        selectedRequestForQuote,
        setSelectedRequestForQuote,
        selectedOfferForBooking,
        setSelectedOfferForBooking,
        activeChatRequestId,
        setActiveChatRequestId,
        isPostRequestOpen,
        setIsPostRequestOpen,
        isChecklistOpen,
        setIsChecklistOpen,
        isPhoneAuthOpen,
        setIsPhoneAuthOpen,
        createRequest,
        submitOffer,
        counterOffer,
        confirmBooking,
        updateBookingStatus,
        verifyStartPin,
        sendMessage,
        submitReview,
        toggleProviderOnline,
        adminVerifyProvider,
        resetDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
