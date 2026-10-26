// ServiceBid Authoritative Mock Database & Realtime Sync Service
import {
  ProviderProfile,
  ServiceRequest,
  Offer,
  Booking,
  ChatMessage,
  NotificationItem,
  Review,
  SupportTicket,
  AuditLog,
  User,
  RequestStatus,
  PaymentStatus
} from '../types';
import {
  SEED_USERS,
  SEED_PROVIDERS,
  SEED_REQUESTS,
  SEED_OFFERS,
  SEED_BOOKINGS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
  SEED_REVIEWS,
  SEED_SUPPORT_TICKETS,
  SEED_AUDIT_LOGS
} from './seedData';
import { APP_CONFIG } from '../config';

const STORAGE_KEY_PREFIX = 'servicebid_v1_';

export class ServiceBidDB {
  private static instance: ServiceBidDB;
  private channel: BroadcastChannel | null = null;
  private listeners: Set<() => void> = new Set();

  private users: User[] = [];
  private providers: ProviderProfile[] = [];
  private requests: ServiceRequest[] = [];
  private offers: Offer[] = [];
  private bookings: Booking[] = [];
  private messages: ChatMessage[] = [];
  private notifications: NotificationItem[] = [];
  private reviews: Review[] = [];
  private supportTickets: SupportTicket[] = [];
  private auditLogs: AuditLog[] = [];

  private constructor() {
    this.initStorage();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('servicebid_cross_tab_sync');
      this.channel.onmessage = (event) => {
        if (event.data?.type === 'DB_UPDATED') {
          this.loadFromStorage();
          this.notify();
        }
      };
    }
  }

  public static getInstance(): ServiceBidDB {
    if (!ServiceBidDB.instance) {
      ServiceBidDB.instance = new ServiceBidDB();
    }
    return ServiceBidDB.instance;
  }

  private initStorage() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized');
    if (!existing) {
      this.resetToSeedData();
    } else {
      this.loadFromStorage();
    }
  }

  public resetToSeedData() {
    this.users = [...SEED_USERS];
    this.providers = [...SEED_PROVIDERS];
    this.requests = [...SEED_REQUESTS];
    this.offers = [...SEED_OFFERS];
    this.bookings = [...SEED_BOOKINGS];
    this.messages = [...SEED_MESSAGES];
    this.notifications = [...SEED_NOTIFICATIONS];
    this.reviews = [...SEED_REVIEWS];
    this.supportTickets = [...SEED_SUPPORT_TICKETS];
    this.auditLogs = [...SEED_AUDIT_LOGS];
    this.saveToStorage();
    this.notify();
  }

  private loadFromStorage() {
    try {
      this.users = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'users') || 'null') || SEED_USERS;
      this.providers = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'providers') || 'null') || SEED_PROVIDERS;
      this.requests = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'requests') || 'null') || SEED_REQUESTS;
      this.offers = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'offers') || 'null') || SEED_OFFERS;
      this.bookings = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'bookings') || 'null') || SEED_BOOKINGS;
      this.messages = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'messages') || 'null') || SEED_MESSAGES;
      this.notifications = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'notifications') || 'null') || SEED_NOTIFICATIONS;
      this.reviews = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'reviews') || 'null') || SEED_REVIEWS;
      this.supportTickets = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'tickets') || 'null') || SEED_SUPPORT_TICKETS;
      this.auditLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + 'audit') || 'null') || SEED_AUDIT_LOGS;
    } catch (e) {
      console.error('Failed to load from storage, resetting to seed', e);
      this.resetToSeedData();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'initialized', 'true');
      localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'providers', JSON.stringify(this.providers));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'requests', JSON.stringify(this.requests));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'offers', JSON.stringify(this.offers));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'bookings', JSON.stringify(this.bookings));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'messages', JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'notifications', JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'reviews', JSON.stringify(this.reviews));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'tickets', JSON.stringify(this.supportTickets));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'audit', JSON.stringify(this.auditLogs));
      if (this.channel) {
        this.channel.postMessage({ type: 'DB_UPDATED' });
      }
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Getters
  public getUsers(): User[] { return [...this.users]; }
  public getProviders(): ProviderProfile[] { return [...this.providers]; }
  public getRequests(): ServiceRequest[] { return [...this.requests]; }
  public getOffers(requestId?: string): Offer[] {
    if (requestId) {
      return this.offers.filter(o => o.requestId === requestId);
    }
    return [...this.offers];
  }
  public getBookings(): Booking[] { return [...this.bookings]; }
  public getMessages(requestId?: string): ChatMessage[] {
    if (requestId) {
      return this.messages.filter(m => m.requestId === requestId);
    }
    return [...this.messages];
  }
  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return this.notifications.filter(n => n.userId === userId);
    }
    return [...this.notifications];
  }
  public getReviews(providerId?: string): Review[] {
    if (providerId) {
      return this.reviews.filter(r => r.providerId === providerId);
    }
    return [...this.reviews];
  }
  public getSupportTickets(): SupportTicket[] { return [...this.supportTickets]; }
  public getAuditLogs(): AuditLog[] { return [...this.auditLogs]; }

  // Customer Actions
  public createRequest(data: Omit<ServiceRequest, 'id' | 'createdAt' | 'expiresAt' | 'revision' | 'status'>): ServiceRequest {
    const newReq: ServiceRequest = {
      ...data,
      id: `req_${Date.now()}`,
      status: 'open',
      revision: 1,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    };
    this.requests.unshift(newReq);

    // Notify matching online providers in area
    const matching = this.providers.filter(p =>
      p.isOnline &&
      p.verificationStatus === 'approved' &&
      p.categoryIds.includes(newReq.categoryId)
    );

    matching.forEach(p => {
      this.notifications.unshift({
        id: `notif_${Date.now()}_${p.id}`,
        userId: p.userId,
        title: `New Request in ${newReq.location.area}!`,
        message: `${newReq.title} — Budget: PKR ${newReq.budget.toLocaleString()}`,
        type: 'offer_received',
        linkTarget: 'nearby_requests',
        read: false,
        createdAt: new Date().toISOString()
      });
    });

    this.saveToStorage();
    this.notify();
    return newReq;
  }

  // Provider submits offer or counteroffer
  public submitOffer(data: {
    requestId: string;
    providerId: string;
    price: number;
    labor: number;
    materials?: number;
    callOutFee?: number;
    includedWork: string[];
    excludedWork: string[];
    expectedArrival: string;
    estimatedDurationHours: number;
    message: string;
    isCounteroffer?: boolean;
    previousPrice?: number;
  }): Offer {
    const prov = this.providers.find(p => p.id === data.providerId);
    if (!prov) throw new Error("Provider not found");

    const req = this.requests.find(r => r.id === data.requestId);
    if (!req) throw new Error("Request not found");

    // Remove existing offer by this provider for this request (one active offer per provider)
    const existingIdx = this.offers.findIndex(o => o.requestId === data.requestId && o.providerId === data.providerId);
    const revision = existingIdx >= 0 ? this.offers[existingIdx].revision + 1 : 1;

    const platformFee = Math.round(data.price * APP_CONFIG.platformCommissionRate);
    const breakdown = {
      labor: data.labor,
      materials: data.materials || 0,
      callOutFee: data.callOutFee || 0,
      platformFee: platformFee,
      taxes: 0,
      total: data.price
    };

    const newOffer: Offer = {
      id: existingIdx >= 0 ? this.offers[existingIdx].id : `ofr_${Date.now()}_${data.providerId}`,
      requestId: data.requestId,
      providerId: data.providerId,
      providerName: prov.name,
      providerSpecialty: prov.specialty,
      providerRating: prov.rating,
      providerReviewCount: prov.reviewCount,
      providerCompletedJobs: prov.completedJobsCount,
      providerAvatar: prov.avatar,
      providerVerified: prov.isVerified,
      distanceKm: 2.1,
      price: data.price,
      breakdown,
      includedWork: data.includedWork,
      excludedWork: data.excludedWork,
      expectedArrival: data.expectedArrival,
      estimatedDurationHours: data.estimatedDurationHours,
      message: data.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      revision,
      isCounteroffer: Boolean(data.isCounteroffer),
      previousPrice: data.previousPrice
    };

    if (existingIdx >= 0) {
      this.offers[existingIdx] = newOffer;
    } else {
      this.offers.unshift(newOffer);
    }

    // Notify customer
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: req.customerId,
      title: data.isCounteroffer ? `Counteroffer: PKR ${data.price.toLocaleString()}` : `New Offer: PKR ${data.price.toLocaleString()}`,
      message: `${prov.name} offered on "${req.title}". Arrival: ${data.expectedArrival}`,
      type: data.isCounteroffer ? 'counteroffer' : 'offer_received',
      linkTarget: 'requests',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.saveToStorage();
    this.notify();
    return newOffer;
  }

  // Customer counteroffers to provider
  public counterOffer(offerId: string, counterPrice: number, customerNotes: string): Offer {
    const offer = this.offers.find(o => o.id === offerId);
    if (!offer) throw new Error("Offer not found");

    const req = this.requests.find(r => r.id === offer.requestId);
    const prov = this.providers.find(p => p.id === offer.providerId);

    offer.previousPrice = offer.price;
    offer.price = counterPrice;
    offer.breakdown.total = counterPrice;
    offer.breakdown.labor = counterPrice - (offer.breakdown.materials || 0);
    offer.breakdown.platformFee = Math.round(counterPrice * APP_CONFIG.platformCommissionRate);
    offer.status = 'countered';
    offer.revision += 1;
    offer.message = `[Customer Counteroffer: PKR ${counterPrice.toLocaleString()}] ${customerNotes}`;

    if (prov) {
      this.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: prov.userId,
        title: `Customer Counteroffer on ${req?.title || 'Job'}`,
        message: `Customer proposed PKR ${counterPrice.toLocaleString()}. Note: "${customerNotes}"`,
        type: 'counteroffer',
        linkTarget: 'my_offers',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    this.saveToStorage();
    this.notify();
    return offer;
  }

  // Atomically select offer and confirm booking
  public selectOfferAndConfirmBooking(offerId: string, paymentMethod: 'preauth_card' | 'jazzcash' | 'easypaisa' | 'cash_on_completion'): Booking {
    const offer = this.offers.find(o => o.id === offerId);
    if (!offer) throw new Error("Offer not found");

    const req = this.requests.find(r => r.id === offer.requestId);
    if (!req) throw new Error("Request not found");

    const prov = this.providers.find(p => p.id === offer.providerId);
    if (!prov) throw new Error("Provider not found");

    // Close competing offers
    this.offers.forEach(o => {
      if (o.requestId === req.id) {
        if (o.id === offerId) {
          o.status = 'accepted';
        } else {
          o.status = 'declined';
        }
      }
    });

    // Mark request as confirmed
    req.status = 'confirmed';

    // Generate random 4-digit start PIN for physical arrival verification
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

    const booking: Booking = {
      id: `bk_${Date.now()}`,
      requestId: req.id,
      requestTitle: req.title,
      categoryId: req.categoryId,
      categoryName: req.categoryName,
      selectedOfferId: offer.id,
      customerId: req.customerId,
      customerName: req.customerName,
      customerPhone: req.customerPhone,
      providerId: prov.id,
      providerName: prov.name,
      providerSpecialty: prov.specialty,
      providerPhone: prov.phone,
      providerAvatar: prov.avatar,
      agreedPrice: offer.price,
      currency: "PKR",
      breakdown: offer.breakdown,
      exactAddress: req.location.address,
      approxArea: req.location.area,
      location: {
        lat: req.location.lat,
        lng: req.location.lng
      },
      startPin: randomPin,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'cash_on_completion' ? 'pending' : 'authorized',
      paymentMethod,
      timeline: [
        { status: 'confirmed', timestamp: new Date().toISOString(), note: 'Agreed price locked. Temporary slot reserved.' }
      ],
      changeOrders: [],
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString()
    };

    this.bookings.unshift(booking);

    // Notify provider of confirmed job
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: prov.userId,
      title: "🎉 You Won the Job!",
      message: `Your offer of PKR ${offer.price.toLocaleString()} was accepted by ${req.customerName}. Exact address unlocked.`,
      type: 'offer_accepted',
      linkTarget: 'jobs',
      read: false,
      createdAt: new Date().toISOString()
    });

    this.saveToStorage();
    this.notify();
    return booking;
  }

  // Update Booking Status lifecycle
  public updateBookingStatus(bookingId: string, nextStatus: RequestStatus, note?: string): Booking {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.status = nextStatus;
    booking.timeline.push({
      status: nextStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status transitioned to ${nextStatus}`
    });

    if (nextStatus === 'completed') {
      booking.completedAt = new Date().toISOString();
      if (booking.paymentStatus === 'authorized') {
        booking.paymentStatus = 'captured';
      }
      // Increment provider completed jobs
      const prov = this.providers.find(p => p.id === booking.providerId);
      if (prov) {
        prov.completedJobsCount += 1;
      }
    }

    this.saveToStorage();
    this.notify();
    return booking;
  }

  // Verify Start PIN
  public verifyStartPin(bookingId: string, enteredPin: string): boolean {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return false;
    if (booking.startPin === enteredPin.trim()) {
      this.updateBookingStatus(bookingId, 'in_progress', `PIN ${enteredPin} successfully verified by customer.`);
      return true;
    }
    return false;
  }

  // Add Change Order
  public addChangeOrder(bookingId: string, description: string, additionalAmount: number) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.changeOrders.push({
      id: `co_${Date.now()}`,
      bookingId,
      description,
      additionalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    this.saveToStorage();
    this.notify();
  }

  public respondToChangeOrder(bookingId: string, changeOrderId: string, approved: boolean) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return;
    const co = booking.changeOrders.find(c => c.id === changeOrderId);
    if (!co) return;

    co.status = approved ? 'approved' : 'rejected';
    if (approved) {
      booking.agreedPrice += co.additionalAmount;
      booking.breakdown.total += co.additionalAmount;
      booking.breakdown.labor += co.additionalAmount;
    }
    this.saveToStorage();
    this.notify();
  }

  // Chat message sending
  public sendMessage(requestId: string, senderId: string, senderRole: any, senderName: string, text: string): ChatMessage {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: `conv_${requestId}`,
      requestId,
      senderId,
      senderRole,
      senderName,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.messages.push(msg);

    // Auto simulated provider response if customer speaks
    if (senderRole === 'customer') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          conversationId: `conv_${requestId}`,
          requestId,
          senderId: 'prov_1',
          senderRole: 'provider',
          senderName: 'Tariq Mehmood',
          text: `Salam ${senderName}, noted! I have my tools ready and will ensure high quality workmanship.`,
          timestamp: new Date().toISOString(),
          read: false
        };
        this.messages.push(reply);
        this.saveToStorage();
        this.notify();
      }, 1500);
    }

    this.saveToStorage();
    this.notify();
    return msg;
  }

  // Reviews
  public submitReview(bookingId: string, rating: number, comment: string): Review {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      bookingId,
      customerId: booking.customerId,
      customerName: booking.customerName,
      providerId: booking.providerId,
      rating,
      comment,
      serviceQualityRating: rating,
      punctualityRating: 5,
      createdAt: new Date().toISOString()
    };
    this.reviews.unshift(newReview);

    // Recompute provider rating
    const provReviews = this.reviews.filter(r => r.providerId === booking.providerId);
    const avg = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
    const prov = this.providers.find(p => p.id === booking.providerId);
    if (prov) {
      prov.rating = parseFloat(avg.toFixed(1));
      prov.reviewCount = provReviews.length;
    }

    this.saveToStorage();
    this.notify();
    return newReview;
  }

  // Provider Online / Offline toggle
  public toggleProviderOnline(providerId: string, isOnline: boolean) {
    const prov = this.providers.find(p => p.id === providerId);
    if (prov) {
      prov.isOnline = isOnline;
      this.saveToStorage();
      this.notify();
    }
  }

  // Admin Actions
  public adminVerifyProvider(providerId: string, approved: boolean, reason: string) {
    const prov = this.providers.find(p => p.id === providerId);
    if (prov) {
      prov.verificationStatus = approved ? 'approved' : 'rejected';
      prov.isVerified = approved;
      prov.verificationReason = reason;

      this.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        actorId: 'usr_admin_1',
        actorName: 'Super Admin',
        actorRole: 'admin',
        action: approved ? 'APPROVE_PROVIDER' : 'REJECT_PROVIDER',
        targetType: 'provider',
        targetId: providerId,
        reason,
        timestamp: new Date().toISOString()
      });

      this.saveToStorage();
      this.notify();
    }
  }

  public adminResolveDispute(ticketId: string, resolution: string) {
    const tkt = this.supportTickets.find(t => t.id === ticketId);
    if (tkt) {
      tkt.status = 'resolved';
      tkt.resolution = resolution;
      this.saveToStorage();
      this.notify();
    }
  }
}
