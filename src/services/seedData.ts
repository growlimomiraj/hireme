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
  User
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: "usr_cust_1",
    name: "Miraj Khalid",
    phone: "+92 300 5551234",
    email: "miraj@example.com",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    isPhoneVerified: true,
    savedAddresses: [
      "House 14, Street 28, F-10/1, Islamabad",
      "Office 402, Evacuee Trust Complex, Blue Area, Islamabad"
    ],
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "usr_prov_1",
    name: "Tariq Mehmood",
    phone: "+92 333 4447890",
    email: "tariq.plumbing@gmail.com",
    role: "provider",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    isPhoneVerified: true,
    createdAt: "2026-01-10T08:30:00Z"
  },
  {
    id: "usr_admin_1",
    name: "Hamza Malik (Super Admin)",
    phone: "+92 321 9990000",
    email: "admin@servicebid.pk",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    isPhoneVerified: true,
    createdAt: "2025-12-01T00:00:00Z"
  }
];

export const SEED_PROVIDERS: ProviderProfile[] = [
  {
    id: "prov_1",
    userId: "usr_prov_1",
    name: "Tariq Mehmood",
    businessName: "Tariq Master Plumbing Services",
    specialty: "Master Plumber & Sanitary Expert",
    categoryIds: ["plumbing"],
    subcategories: ["Leaking Taps & Pipes", "Water Pump Repair", "Geyser Installation", "Bathroom Sanitary Fitting"],
    bio: "Over 12 years of hands-on plumbing experience across Islamabad sectors F-10, F-11, and E-11. Specialized in high-rise piping, water leakage detection, PPRC jointing, and European fixtures.",
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 148,
    completedJobsCount: 284,
    isVerified: true,
    verificationStatus: "approved",
    documents: [
      { id: "doc_1", type: "cnic_front", name: "CNIC Front (Verified)", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80", status: "approved", uploadedAt: "2026-01-10T10:00:00Z" },
      { id: "doc_2", type: "police_clearance", name: "Police Clearance Certificate", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80", status: "approved", uploadedAt: "2026-01-10T10:05:00Z" }
    ],
    isOnline: true,
    location: {
      lat: 33.6938,
      lng: 73.0062,
      address: "Street 12, F-10 Markaz, Islamabad",
      area: "F-10 Islamabad"
    },
    coverageRadiusKm: 12,
    startingPrice: 800,
    priceType: "fixed",
    weeklySchedule: [
      { day: "Monday", available: true, hours: "08:00 - 20:00" },
      { day: "Tuesday", available: true, hours: "08:00 - 20:00" },
      { day: "Wednesday", available: true, hours: "08:00 - 20:00" },
      { day: "Thursday", available: true, hours: "08:00 - 20:00" },
      { day: "Friday", available: true, hours: "08:00 - 13:00, 15:00 - 21:00" },
      { day: "Saturday", available: true, hours: "09:00 - 20:00" },
      { day: "Sunday", available: true, hours: "10:00 - 18:00" }
    ],
    portfolio: [
      { title: "Grohe Concealed Mixer Replacement", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80" },
      { title: "Underground Water Tank Float Valve Fix", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80" }
    ],
    phone: "+92 333 4447890",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_2",
    userId: "usr_prov_2",
    name: "Asif Khan",
    businessName: "AK Electrics & UPS Specialists",
    specialty: "Certified Electrician & Wiring Consultant",
    categoryIds: ["electrical"],
    subcategories: ["Circuit Breaker Tripping", "Socket & Switch Repair", "UPS / Inverter Wiring", "Short Circuit Detection"],
    bio: "DAE Electrical certified with 8 years field experience in G-9, G-10, and G-11. Rapid diagnostic fault locator for main distribution boards and smart home lighting.",
    experienceYears: 8,
    rating: 4.8,
    reviewCount: 92,
    completedJobsCount: 165,
    isVerified: true,
    verificationStatus: "approved",
    documents: [
      { id: "doc_3", type: "cnic_front", name: "CNIC Front", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80", status: "approved", uploadedAt: "2026-01-12T09:00:00Z" }
    ],
    isOnline: true,
    location: {
      lat: 33.6705,
      lng: 72.9982,
      address: "G-11 Markaz, Islamabad",
      area: "G-11 Islamabad"
    },
    coverageRadiusKm: 15,
    startingPrice: 600,
    priceType: "fixed",
    weeklySchedule: [
      { day: "Monday", available: true, hours: "09:00 - 21:00" },
      { day: "Tuesday", available: true, hours: "09:00 - 21:00" },
      { day: "Wednesday", available: true, hours: "09:00 - 21:00" },
      { day: "Thursday", available: true, hours: "09:00 - 21:00" },
      { day: "Friday", available: true, hours: "09:00 - 13:00, 15:00 - 21:00" },
      { day: "Saturday", available: true, hours: "09:00 - 21:00" },
      { day: "Sunday", available: false, hours: "Off" }
    ],
    portfolio: [
      { title: "Solar Hybrid Inverter DB Wiring", image: "https://images.unsplash.com/photo-1558441719-8b489c63f70b?auto=format&fit=crop&w=400&q=80" }
    ],
    phone: "+92 345 1112233",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_3",
    userId: "usr_prov_3",
    name: "Bilal Ahmed",
    businessName: "CoolBreeze HVAC & AC Care",
    specialty: "Inverter AC Master Technician",
    categoryIds: ["ac_repair"],
    subcategories: ["General AC Master Service", "Gas Refill / Leak Detection", "Inverter PCB Repair"],
    bio: "Certified Daikin & Gree technician. Fully equipped with nitrogen testing rigs and high-pressure jet wash. Fast service in Blue Area, F-6, F-7, and G-8.",
    experienceYears: 10,
    rating: 5.0,
    reviewCount: 215,
    completedJobsCount: 389,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.7182,
      lng: 73.0588,
      address: "Blue Area, Jinnah Avenue, Islamabad",
      area: "Blue Area Islamabad"
    },
    coverageRadiusKm: 18,
    startingPrice: 1500,
    priceType: "fixed",
    weeklySchedule: [
      { day: "Monday", available: true, hours: "08:00 - 22:00" },
      { day: "Tuesday", available: true, hours: "08:00 - 22:00" },
      { day: "Wednesday", available: true, hours: "08:00 - 22:00" },
      { day: "Thursday", available: true, hours: "08:00 - 22:00" },
      { day: "Friday", available: true, hours: "08:00 - 22:00" },
      { day: "Saturday", available: true, hours: "08:00 - 22:00" },
      { day: "Sunday", available: true, hours: "09:00 - 20:00" }
    ],
    portfolio: [
      { title: "2-Ton Inverter Chemical Wash", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80" }
    ],
    phone: "+92 312 3338877",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_4",
    userId: "usr_prov_4",
    name: "Mohammad Usman",
    businessName: "Capital Appliance Care",
    specialty: "Automatic Washing Machine & Refrigerator Tech",
    categoryIds: ["appliance"],
    subcategories: ["Washing Machine Repair", "Refrigerator / Freezer Cooling", "Microwave Oven Repair"],
    bio: "Reliable doorstep diagnosis for LG, Samsung, Haier, and Dawlance appliances. Transparent spare part replacement with 30-day warranty.",
    experienceYears: 7,
    rating: 4.7,
    reviewCount: 64,
    completedJobsCount: 112,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.7225,
      lng: 73.0520,
      address: "F-7 Markaz, Islamabad",
      area: "F-7 Islamabad"
    },
    coverageRadiusKm: 14,
    startingPrice: 1000,
    priceType: "quote_required",
    weeklySchedule: [
      { day: "Monday", available: true, hours: "10:00 - 19:00" },
      { day: "Tuesday", available: true, hours: "10:00 - 19:00" },
      { day: "Wednesday", available: true, hours: "10:00 - 19:00" },
      { day: "Thursday", available: true, hours: "10:00 - 19:00" },
      { day: "Friday", available: true, hours: "14:00 - 20:00" },
      { day: "Saturday", available: true, hours: "10:00 - 19:00" },
      { day: "Sunday", available: false, hours: "Off" }
    ],
    portfolio: [],
    phone: "+92 301 8887766",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_5",
    userId: "usr_prov_5",
    name: "Shahida Parveen",
    businessName: "CleanSweep Deep Cleaning Team",
    specialty: "Residential Deep Cleaning & Sofa Care",
    categoryIds: ["cleaning"],
    subcategories: ["Deep Home Cleaning", "Sofa & Carpet Shampoo", "Kitchen Degreasing"],
    bio: "Trained 4-person professional crew equipped with Karcher steam cleaners and eco-friendly detergents. Complete disinfection for villas and flats in Islamabad.",
    experienceYears: 6,
    rating: 4.9,
    reviewCount: 310,
    completedJobsCount: 520,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.7085,
      lng: 73.0375,
      address: "F-8/3, Islamabad",
      area: "F-8 Islamabad"
    },
    coverageRadiusKm: 20,
    startingPrice: 2500,
    priceType: "fixed",
    weeklySchedule: [
      { day: "Monday", available: true, hours: "08:00 - 18:00" },
      { day: "Tuesday", available: true, hours: "08:00 - 18:00" },
      { day: "Wednesday", available: true, hours: "08:00 - 18:00" },
      { day: "Thursday", available: true, hours: "08:00 - 18:00" },
      { day: "Friday", available: true, hours: "08:00 - 18:00" },
      { day: "Saturday", available: true, hours: "08:00 - 18:00" },
      { day: "Sunday", available: true, hours: "09:00 - 17:00" }
    ],
    portfolio: [
      { title: "Deep Kitchen Degreasing & Tile Scrubbing", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80" }
    ],
    phone: "+92 334 9998811",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_6",
    userId: "usr_prov_6",
    name: "Rashid Minhas",
    businessName: "Minhas Fine Woodworks",
    specialty: "Wood Furniture & Door Fitting Craftsman",
    categoryIds: ["carpentry"],
    subcategories: ["Door Lock & Handle Fitting", "Cabinet Hinge Repair", "Custom Furniture Assembly"],
    bio: "Peshawari wood artisan based in Saddar Rawalpindi with 15 years crafting teak and walnut doors, sliding closets, and kitchen cabinets.",
    experienceYears: 15,
    rating: 4.8,
    reviewCount: 78,
    completedJobsCount: 142,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: false, // Currently offline to test offline badge
    location: {
      lat: 33.5985,
      lng: 73.0538,
      address: "Kashmir Road, Saddar, Rawalpindi",
      area: "Saddar Rawalpindi"
    },
    coverageRadiusKm: 25,
    startingPrice: 1200,
    priceType: "fixed",
    weeklySchedule: [
      { day: "Monday", available: true, hours: "09:00 - 20:00" },
      { day: "Tuesday", available: true, hours: "09:00 - 20:00" },
      { day: "Wednesday", available: true, hours: "09:00 - 20:00" },
      { day: "Thursday", available: true, hours: "09:00 - 20:00" },
      { day: "Friday", available: false, hours: "Off" },
      { day: "Saturday", available: true, hours: "09:00 - 20:00" },
      { day: "Sunday", available: true, hours: "10:00 - 18:00" }
    ],
    portfolio: [],
    phone: "+92 315 2223344",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_7",
    userId: "usr_prov_7",
    name: "Farhan & Brothers",
    businessName: "Farhan Painting & Seepage Solutions",
    specialty: "Interior Painting & Waterproofing",
    categoryIds: ["painting"],
    subcategories: ["Interior Room Painting", "Exterior Weather-resistant Paint", "Wall Crack & Seepage Treatment"],
    bio: "Dulux and Berger certified color consultant. We fix wall bubbles, dampness (seelan), and apply high-finish velvet paint.",
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 104,
    completedJobsCount: 198,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.5350,
      lng: 73.0900,
      address: "Civic Center, Bahria Town Phase 4, Rawalpindi",
      area: "Bahria Town Rawalpindi"
    },
    coverageRadiusKm: 20,
    startingPrice: 4000,
    priceType: "fixed",
    weeklySchedule: [],
    portfolio: [],
    phone: "+92 322 7776655",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_8",
    userId: "usr_prov_8",
    name: "Imran Khan",
    businessName: "QuickFix Handyman Solutions",
    specialty: "Home Repairs & Wall Mountings",
    categoryIds: ["handyman"],
    subcategories: ["Curtain Rod & Mirror Hanging", "Wall Drilling & TV Mounting", "Minor Fixes Bundle"],
    bio: "Equipped with professional Bosch impact drill and laser leveller. Fast 30-minute arrival in I-8, H-8, and Zero Point.",
    experienceYears: 5,
    rating: 4.7,
    reviewCount: 88,
    completedJobsCount: 172,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.6685,
      lng: 73.0750,
      address: "I-8 Markaz, Islamabad",
      area: "I-8 Islamabad"
    },
    coverageRadiusKm: 15,
    startingPrice: 700,
    priceType: "fixed",
    weeklySchedule: [],
    portfolio: [],
    phone: "+92 331 4455667",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_9",
    userId: "usr_prov_9",
    name: "SafeShield Team",
    businessName: "SafeShield Fumigation & Pest Control",
    specialty: "Termite & Cockroach Elimination",
    categoryIds: ["pest_control"],
    subcategories: ["Cockroach & Ant Gel Treatment", "Termite (Deemak) Proofing"],
    bio: "Odorless German Bayer chemicals with 1-year written warranty for termite proofing and kitchen gel baiting.",
    experienceYears: 11,
    rating: 4.8,
    reviewCount: 52,
    completedJobsCount: 95,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.5200,
      lng: 73.1600,
      address: "Sector B Commercial, DHA Phase 2, Islamabad",
      area: "DHA Phase 2 Rawalpindi"
    },
    coverageRadiusKm: 25,
    startingPrice: 3000,
    priceType: "fixed",
    weeklySchedule: [],
    portfolio: [],
    phone: "+92 305 6677889",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_10",
    userId: "usr_prov_10",
    name: "Al-Rehman Tank Cleaners",
    businessName: "Al-Rehman Chlorination & Tank Service",
    specialty: "High-Pressure Tank Sanitation",
    categoryIds: ["tank_cleaning"],
    subcategories: ["Underground Concrete Tank", "Overhead Plastic / Fiberglass Tank"],
    bio: "Submersible sludge pumps, UV sterilization, and food-grade chlorine treatment. Keeping water healthy in G-9, G-10, and F-10.",
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 130,
    completedJobsCount: 220,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.6890,
      lng: 73.0280,
      address: "G-9 Markaz, Islamabad",
      area: "G-9 Islamabad"
    },
    coverageRadiusKm: 15,
    startingPrice: 2000,
    priceType: "fixed",
    weeklySchedule: [],
    portfolio: [],
    phone: "+92 313 5566778",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_11",
    userId: "usr_prov_11",
    name: "VisionTech Security",
    businessName: "VisionTech CCTV & Smart Systems",
    specialty: "Hikvision & Dahua CCTV Solutions",
    categoryIds: ["cctv"],
    subcategories: ["IP / HD Camera Installation", "DVR / NVR Configuration", "Mobile Remote Viewing Setup"],
    bio: "Over 500 home and commercial camera setups in Islamabad. High quality concealed cabling and phone monitoring.",
    experienceYears: 7,
    rating: 4.9,
    reviewCount: 86,
    completedJobsCount: 150,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.6840,
      lng: 72.9850,
      address: "F-11 Markaz, Islamabad",
      area: "F-11 Islamabad"
    },
    coverageRadiusKm: 20,
    startingPrice: 2500,
    priceType: "fixed",
    weeklySchedule: [],
    portfolio: [],
    phone: "+92 344 7788990",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "prov_12",
    userId: "usr_prov_12",
    name: "GreenThumb Landscaping",
    businessName: "GreenThumb Gardeners & Nursery",
    specialty: "Lawn Care & Seasonal Plantations",
    categoryIds: ["gardening"],
    subcategories: ["Lawn Mowing & Hedge Trimming", "Seasonal Flower Planting"],
    bio: "Passionate horticulturist team. We beautify residential lawns and install smart drip irrigation systems.",
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 45,
    completedJobsCount: 88,
    isVerified: true,
    verificationStatus: "approved",
    documents: [],
    isOnline: true,
    location: {
      lat: 33.5850,
      lng: 73.1020,
      address: "Chaklala Scheme 3, Rawalpindi",
      area: "Chaklala Scheme 3"
    },
    coverageRadiusKm: 18,
    startingPrice: 1500,
    priceType: "fixed",
    weeklySchedule: [],
    portfolio: [],
    phone: "+92 336 1122334",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  // Adding one "under_review" provider for the admin verification queue!
  {
    id: "prov_13",
    userId: "usr_prov_13",
    name: "Zubair Latif",
    businessName: "Latif Cooling & AC",
    specialty: "Apprentice AC Technician",
    categoryIds: ["ac_repair"],
    subcategories: ["General AC Master Service"],
    bio: "Newly registered AC technician applying for verification in Rawalpindi.",
    experienceYears: 2,
    rating: 0,
    reviewCount: 0,
    completedJobsCount: 0,
    isVerified: false,
    verificationStatus: "under_review",
    documents: [
      { id: "doc_13a", type: "cnic_front", name: "CNIC Card Front", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80", status: "under_review", uploadedAt: "2026-10-25T14:00:00Z" },
      { id: "doc_13b", type: "trade_license", name: "Vocational Certificate (TEVTA)", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80", status: "under_review", uploadedAt: "2026-10-25T14:05:00Z" }
    ],
    isOnline: false,
    location: {
      lat: 33.6000,
      lng: 73.0600,
      address: "Murree Road, Rawalpindi",
      area: "Saddar Rawalpindi"
    },
    coverageRadiusKm: 10,
    startingPrice: 1000,
    priceType: "fixed",
    weeklySchedule: [],
    portfolio: [],
    phone: "+92 300 0011223",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80"
  }
];

// Open requests matching the prompt requirements!
// Request 1: The exact prompt example (customer in F-10 with leaking tap and PKR 2,000 budget with 3 offers)
export const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: "req_f10_tap",
    customerId: "usr_cust_1",
    customerName: "Miraj Khalid",
    customerPhone: "+92 300 5551234",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    categoryId: "plumbing",
    categoryName: "Plumbing",
    subcategory: "Leaking Taps & Pipes",
    title: "Leaking kitchen tap mixer & under-sink pipe repair",
    description: "The hot & cold mixer tap in the kitchen is dripping continuously and water is seeping into the wooden cabinet below. Need washer/cartridge replacement and pipe re-tightening.",
    photos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
    ],
    location: {
      lat: 33.6930,
      lng: 73.0070,
      address: "House 14, Street 28, Sector F-10/1, Islamabad",
      area: "F-10 Islamabad"
    },
    scheduleType: "asap",
    budget: 2000, // PKR 2,000 as per prompt example
    currency: "PKR",
    isInspectionNeeded: false,
    scopeNotes: "Includes replacement of spindle/cartridge and sealing ring. Customer will provide new mixer if replacement is required.",
    materialsResponsibility: "customer",
    accessInstructions: "Ring bell for House 14. Gate opens directly to porch.",
    broadcastAllowed: true,
    status: "open",
    createdAt: "2026-10-26T12:00:00Z",
    expiresAt: "2026-10-27T12:00:00Z",
    revision: 1
  },
  {
    id: "req_ac_bluearea",
    customerId: "usr_cust_1",
    customerName: "Miraj Khalid",
    customerPhone: "+92 300 5551234",
    categoryId: "ac_repair",
    categoryName: "AC Repair",
    subcategory: "General AC Master Service",
    title: "1.5 Ton Gree Inverter AC chemical wash & outdoor unit cleaning",
    description: "AC is blowing mildly warm air and indoor cooling fins have accumulated dust. Requires outdoor condenser pressure wash and indoor blower foam cleaning.",
    photos: [],
    location: {
      lat: 33.7180,
      lng: 73.0580,
      address: "Office 402, Blue Area, Islamabad",
      area: "Blue Area Islamabad"
    },
    scheduleType: "scheduled",
    scheduledDate: "Tomorrow",
    scheduledTimeWindow: "11:00 AM - 01:00 PM",
    budget: 3500,
    currency: "PKR",
    isInspectionNeeded: false,
    scopeNotes: "Complete chemical wash for indoor and outdoor units. Gas top-up is separate if needed.",
    materialsResponsibility: "provider",
    broadcastAllowed: true,
    status: "open",
    createdAt: "2026-10-26T10:30:00Z",
    expiresAt: "2026-10-27T10:30:00Z",
    revision: 1
  }
];

// Seed offers matching prompt:
// "One plumber offers to do it for PKR 2,000, another quotes PKR 2,500, and another quotes PKR 1,800."
export const SEED_OFFERS: Offer[] = [
  {
    id: "ofr_1_match",
    requestId: "req_f10_tap",
    providerId: "prov_1",
    providerName: "Tariq Mehmood",
    providerSpecialty: "Master Plumber & Sanitary Expert",
    providerRating: 4.9,
    providerReviewCount: 148,
    providerCompletedJobs: 284,
    providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    providerVerified: true,
    distanceKm: 0.8,
    price: 2000, // Matched budget exactly
    breakdown: {
      labor: 1600,
      materials: 200,
      callOutFee: 0,
      platformFee: 200,
      taxes: 0,
      total: 2000
    },
    includedWork: ["Mixer dismantle & cartridge clean/replace", "Thread seal tape renewal", "Pressure leak testing"],
    excludedWork: ["New mixer unit cost (if unrepairable)"],
    expectedArrival: "Within 35 minutes",
    estimatedDurationHours: 1,
    message: "Salam! I am in F-10 Markaz right now. I have standard ceramic cartridges and Teflon tape in my kit. Can be at your gate in 35 mins.",
    status: "pending",
    createdAt: "2026-10-26T12:15:00Z",
    expiresAt: "2026-10-26T16:15:00Z",
    revision: 1,
    isCounteroffer: false
  },
  {
    id: "ofr_2_higher",
    requestId: "req_f10_tap",
    providerId: "prov_6",
    providerName: "Rashid Minhas",
    providerSpecialty: "Sanitary & Woodwork Specialist",
    providerRating: 4.8,
    providerReviewCount: 78,
    providerCompletedJobs: 142,
    providerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    providerVerified: true,
    distanceKm: 4.2,
    price: 2500, // PKR 2,500 quote
    breakdown: {
      labor: 2000,
      materials: 250,
      callOutFee: 0,
      platformFee: 250,
      taxes: 0,
      total: 2500
    },
    includedWork: ["Complete faucet dismantling", "Cabinet wood base drying & realignment", "High-grade brass washer kit"],
    excludedWork: ["Wall tile demolition"],
    expectedArrival: "Within 1 hour",
    estimatedDurationHours: 1.5,
    message: "I will also inspect and treat the cabinet wooden board so the seepage does not cause mold or wood rot.",
    status: "countered",
    createdAt: "2026-10-26T12:20:00Z",
    expiresAt: "2026-10-26T16:20:00Z",
    revision: 1,
    isCounteroffer: true,
    previousPrice: 2000
  },
  {
    id: "ofr_3_lower",
    requestId: "req_f10_tap",
    providerId: "prov_8",
    providerName: "Imran Khan",
    providerSpecialty: "Home Repairs & QuickFix",
    providerRating: 4.7,
    providerReviewCount: 88,
    providerCompletedJobs: 172,
    providerAvatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80",
    providerVerified: true,
    distanceKm: 3.5,
    price: 1800, // PKR 1,800 competitive quote
    breakdown: {
      labor: 1500,
      materials: 120,
      callOutFee: 0,
      platformFee: 180,
      taxes: 0,
      total: 1800
    },
    includedWork: ["Cartridge repair and pipe clamp tightener", "30-day leak-free guarantee"],
    excludedWork: ["Piping overhaul"],
    expectedArrival: "Today at 3:30 PM",
    estimatedDurationHours: 0.8,
    message: "Offering special competitive rate. Available after 3:30 PM with full toolset.",
    status: "pending",
    createdAt: "2026-10-26T12:35:00Z",
    expiresAt: "2026-10-26T16:35:00Z",
    revision: 1,
    isCounteroffer: true,
    previousPrice: 2000
  }
];

// Active booking in progress with Start PIN: 4892
export const SEED_BOOKINGS: Booking[] = [
  {
    id: "bk_active_101",
    requestId: "req_electric_g11",
    requestTitle: "Distribution board circuit breaker tripping fix",
    categoryId: "electrical",
    categoryName: "Electrical Work",
    selectedOfferId: "ofr_asif_1",
    customerId: "usr_cust_1",
    customerName: "Miraj Khalid",
    customerPhone: "+92 300 5551234",
    providerId: "prov_2",
    providerName: "Asif Khan",
    providerSpecialty: "Certified Electrician & Wiring Consultant",
    providerPhone: "+92 345 1112233",
    providerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    agreedPrice: 1500,
    currency: "PKR",
    breakdown: {
      labor: 1250,
      materials: 100,
      callOutFee: 0,
      platformFee: 150,
      taxes: 0,
      total: 1500
    },
    exactAddress: "House 14, Street 28, Sector F-10/1, Islamabad",
    approxArea: "F-10 Islamabad",
    location: {
      lat: 33.6930,
      lng: 73.0070
    },
    startPin: "4892", // Demo 4-digit start PIN
    status: "in_progress", // Can test completion!
    paymentStatus: "authorized", // Pre-authorized card/wallet hold
    paymentMethod: "preauth_card",
    timeline: [
      { status: "confirmed", timestamp: "2026-10-26T11:00:00Z", note: "Booking confirmed. Provider reserved slot." },
      { status: "on_the_way", timestamp: "2026-10-26T11:15:00Z", note: "Asif is en route from G-11 (ETA 20 mins)." },
      { status: "arrived", timestamp: "2026-10-26T11:35:00Z", note: "Provider arrived at customer premises." },
      { status: "in_progress", timestamp: "2026-10-26T11:40:00Z", note: "Customer verified Start PIN 4892. Work commenced." }
    ],
    changeOrders: [],
    createdAt: "2026-10-26T11:00:00Z",
    confirmedAt: "2026-10-26T11:00:00Z"
  },
  {
    id: "bk_completed_99",
    requestId: "req_past_tank",
    requestTitle: "Underground concrete water tank sludge cleaning",
    categoryId: "tank_cleaning",
    categoryName: "Water Tank Cleaning",
    selectedOfferId: "ofr_tank_99",
    customerId: "usr_cust_1",
    customerName: "Miraj Khalid",
    customerPhone: "+92 300 5551234",
    providerId: "prov_10",
    providerName: "Al-Rehman Tank Cleaners",
    providerSpecialty: "High-Pressure Tank Sanitation",
    providerPhone: "+92 313 5566778",
    providerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    agreedPrice: 2200,
    currency: "PKR",
    breakdown: {
      labor: 1800,
      materials: 180,
      callOutFee: 0,
      platformFee: 220,
      taxes: 0,
      total: 2200
    },
    exactAddress: "House 14, Street 28, Sector F-10/1, Islamabad",
    approxArea: "F-10 Islamabad",
    location: {
      lat: 33.6930,
      lng: 73.0070
    },
    startPin: "1934",
    status: "completed",
    paymentStatus: "captured",
    paymentMethod: "easypaisa",
    timeline: [
      { status: "confirmed", timestamp: "2026-10-20T09:00:00Z" },
      { status: "in_progress", timestamp: "2026-10-20T10:00:00Z" },
      { status: "completed", timestamp: "2026-10-20T12:00:00Z", note: "Job completed and approved by customer." }
    ],
    changeOrders: [],
    completionNotes: "Extracted 200kg sediment sludge and applied food-grade chlorination.",
    createdAt: "2026-10-20T09:00:00Z",
    completedAt: "2026-10-20T12:00:00Z"
  }
];

export const SEED_REVIEWS: Review[] = [
  {
    id: "rev_1",
    bookingId: "bk_completed_99",
    customerId: "usr_cust_1",
    customerName: "Miraj Khalid",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    providerId: "prov_10",
    rating: 5,
    comment: "MashAllah very thorough cleaning. The team brought high-pressure washer and pumped all the dirt out. Tank smells fresh now.",
    serviceQualityRating: 5,
    punctualityRating: 5,
    providerResponse: "Thank you Miraj Bhai! It was a pleasure serving you.",
    createdAt: "2026-10-20T13:30:00Z"
  }
];

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    conversationId: "conv_prov1_cust1",
    requestId: "req_f10_tap",
    senderId: "prov_1",
    senderRole: "provider",
    senderName: "Tariq Mehmood",
    text: "Assalam-o-Alaikum Miraj sahib, does the leaking tap have a ceramic disc quarter-turn or traditional rubber washer?",
    timestamp: "2026-10-26T12:16:00Z",
    read: true
  },
  {
    id: "msg_2",
    conversationId: "conv_prov1_cust1",
    requestId: "req_f10_tap",
    senderId: "usr_cust_1",
    senderRole: "customer",
    senderName: "Miraj Khalid",
    text: "Walaikum Assalam Tariq, it is a single lever quarter-turn mixer (Sonex brand).",
    timestamp: "2026-10-26T12:18:00Z",
    read: true
  },
  {
    id: "msg_3",
    conversationId: "conv_prov1_cust1",
    requestId: "req_f10_tap",
    senderId: "prov_1",
    senderRole: "provider",
    senderName: "Tariq Mehmood",
    text: "Perfect! I have genuine Sonex 35mm ceramic cartridges in my toolbox right now. I can fix it within 30 minutes of arrival.",
    timestamp: "2026-10-26T12:19:30Z",
    read: false
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    userId: "usr_cust_1",
    title: "New Offer Received!",
    message: "Tariq Mehmood offered PKR 2,000 for your kitchen tap repair.",
    type: "offer_received",
    linkTarget: "requests",
    read: false,
    createdAt: "2026-10-26T12:15:00Z"
  },
  {
    id: "notif_2",
    userId: "usr_cust_1",
    title: "Counteroffer Received",
    message: "Rashid Minhas countered with PKR 2,500 (includes wood inspection).",
    type: "counteroffer",
    linkTarget: "requests",
    read: false,
    createdAt: "2026-10-26T12:20:00Z"
  },
  {
    id: "notif_3",
    userId: "usr_cust_1",
    title: "Active Job in Progress",
    message: "Asif Khan is currently repairing the distribution board in F-10.",
    type: "booking_status",
    linkTarget: "active_job",
    read: true,
    createdAt: "2026-10-26T11:40:00Z"
  }
];

export const SEED_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "tkt_1",
    userId: "usr_cust_2",
    userName: "Noman Shah",
    userRole: "customer",
    type: "general",
    subject: "Inquiry about business tax receipts",
    description: "Can we receive an NTN-registered digital invoice for corporate office AC servicing?",
    status: "open",
    createdAt: "2026-10-26T09:15:00Z"
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud_1",
    actorId: "usr_admin_1",
    actorName: "Hamza Malik",
    actorRole: "admin",
    action: "APPROVE_PROVIDER",
    targetType: "provider",
    targetId: "prov_1",
    reason: "CNIC and police clearance verified authentic against NADRA records.",
    timestamp: "2026-01-10T11:00:00Z"
  },
  {
    id: "aud_2",
    actorId: "usr_admin_1",
    actorName: "Hamza Malik",
    actorRole: "admin",
    action: "UPDATE_COMMISSION_RATE",
    targetType: "settings",
    targetId: "platform_fee",
    reason: "Maintained at 10% standard promotional rate for Islamabad/Rawalpindi.",
    timestamp: "2026-01-01T00:00:00Z"
  }
];
