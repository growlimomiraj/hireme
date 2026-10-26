// ServiceBid Global Configuration File
// All branding, currencies, service areas, and localization are managed here.

export interface MarketConfig {
  brandName: string;
  tagline: string;
  taglineUrdu: string;
  country: string;
  city: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
    minorUnit: number;
  };
  timezone: string;
  serviceAreas: string[];
  defaultCenter: [number, number]; // [lat, lng] for Islamabad/Rawalpindi
  platformCommissionRate: number; // e.g. 0.10 for 10%
  inspectionFeeDefault: number;
  supportPhone: string;
  supportEmail: string;
  theme: {
    primary: string;       // #B5F33D (inDrive lime-green)
    text: string;          // #151515
    background: string;    // #F6F7F8
    surface: string;       // #FFFFFF
    border: string;        // #E5E7EB
    muted: string;         // #6B7280
  };
}

export const APP_CONFIG: MarketConfig = {
  brandName: "ServiceBid",
  tagline: "Offer your price. Top nearby specialists compete.",
  taglineUrdu: "اپنی قیمت خود طے کریں — قریبی ماہرین سے خدمات حاصل کریں",
  country: "Pakistan",
  city: "Islamabad & Rawalpindi",
  currency: {
    code: "PKR",
    symbol: "₨",
    name: "Pakistani Rupee",
    minorUnit: 1,
  },
  timezone: "Asia/Karachi",
  serviceAreas: [
    "F-6 Islamabad",
    "F-7 Islamabad",
    "F-8 Islamabad",
    "F-10 Islamabad",
    "F-11 Islamabad",
    "G-9 Islamabad",
    "G-10 Islamabad",
    "G-11 Islamabad",
    "I-8 Islamabad",
    "Blue Area Islamabad",
    "Bahria Town Rawalpindi",
    "DHA Phase 2 Rawalpindi",
    "Saddar Rawalpindi",
    "Chaklala Scheme 3",
    "PWD Islamabad"
  ],
  defaultCenter: [33.6844, 73.0479], // Islamabad center
  platformCommissionRate: 0.10, // 10% platform fee
  inspectionFeeDefault: 500,     // PKR 500 standard call-out inspection
  supportPhone: "+92 51 8892110",
  supportEmail: "support@servicebid.pk",
  theme: {
    primary: "#B5F33D",
    text: "#151515",
    background: "#F6F7F8",
    surface: "#FFFFFF",
    border: "#E5E7EB",
    muted: "#6B7280",
  }
};

export const CATEGORIES_SEED = [
  {
    id: "plumbing",
    name: "Plumbing",
    nameUrdu: "پلمبنگ",
    icon: "Wrench",
    subcategories: ["Leaking Taps & Pipes", "Blocked Drains", "Water Pump Repair", "Geyser Installation", "Bathroom Sanitary Fitting"],
    startingPrice: 800,
    unit: "job"
  },
  {
    id: "electrical",
    name: "Electrical Work",
    nameUrdu: "الیکٹریشن",
    icon: "Zap",
    subcategories: ["Circuit Breaker Tripping", "Socket & Switch Repair", "Ceiling Fan / Chandelier", "UPS / Inverter Wiring", "Short Circuit Detection"],
    startingPrice: 600,
    unit: "job"
  },
  {
    id: "ac_repair",
    name: "AC Repair",
    nameUrdu: "اے سی مرمت",
    icon: "Snowflake",
    subcategories: ["General AC Master Service", "Gas Refill / Leak Detection", "Compressor Replacement", "AC Uninstallation & Fitting", "Inverter PCB Repair"],
    startingPrice: 1500,
    unit: "unit"
  },
  {
    id: "appliance",
    name: "Appliance Repair",
    nameUrdu: "گھریلو سامان مرمت",
    icon: "Refrigerator",
    subcategories: ["Washing Machine Repair", "Refrigerator / Freezer Cooling", "Microwave Oven Repair", "Water Dispenser Service"],
    startingPrice: 1000,
    unit: "job"
  },
  {
    id: "cleaning",
    name: "Home Cleaning",
    nameUrdu: "گھر کی صفائی",
    icon: "Sparkles",
    subcategories: ["Deep Home Cleaning", "Sofa & Carpet Shampoo", "Kitchen Degreasing", "Move-in / Move-out Cleaning", "Window & Glass Detailing"],
    startingPrice: 2500,
    unit: "service"
  },
  {
    id: "carpentry",
    name: "Carpentry",
    nameUrdu: "کارپینٹر",
    icon: "Hammer",
    subcategories: ["Door Lock & Handle Fitting", "Cabinet Hinge Repair", "Custom Furniture Assembly", "Bed & Wardrobe Repair", "Wood Polishing"],
    startingPrice: 1200,
    unit: "job"
  },
  {
    id: "painting",
    name: "Painting",
    nameUrdu: "پینٹ اور واٹر پروفنگ",
    icon: "Paintbrush",
    subcategories: ["Interior Room Painting", "Exterior Weather-resistant Paint", "Wall Crack & Seepage Treatment", "Ceiling Polish / Texture"],
    startingPrice: 4000,
    unit: "room"
  },
  {
    id: "handyman",
    name: "Handyman",
    nameUrdu: "ہر فن مولا",
    icon: "Tool",
    subcategories: ["Curtain Rod & Mirror Hanging", "Wall Drilling & TV Mounting", "Furniture Rearranging", "Minor Fixes Bundle"],
    startingPrice: 700,
    unit: "visit"
  },
  {
    id: "pest_control",
    name: "Pest Control",
    nameUrdu: "کیڑے مکوڑے کنٹرول",
    icon: "ShieldAlert",
    subcategories: ["Cockroach & Ant Gel Treatment", "Termite (Deemak) Proofing", "Bedbug Heat Treatment", "Rodent Control"],
    startingPrice: 3000,
    unit: "treatment"
  },
  {
    id: "tank_cleaning",
    name: "Water Tank Cleaning",
    nameUrdu: "پانی کی ٹینکی صفائی",
    icon: "Droplets",
    subcategories: ["Underground Concrete Tank", "Overhead Plastic / Fiberglass Tank", "Chemical Chlorination & Sludge Removal"],
    startingPrice: 2000,
    unit: "tank"
  },
  {
    id: "cctv",
    name: "CCTV Installation",
    nameUrdu: "سی سی ٹی وی کیمرے",
    icon: "Camera",
    subcategories: ["IP / HD Camera Installation", "DVR / NVR Configuration", "Mobile Remote Viewing Setup", "Cable Repair & Re-alignment"],
    startingPrice: 2500,
    unit: "job"
  },
  {
    id: "gardening",
    name: "Gardening",
    nameUrdu: "باغبانی",
    icon: "Flower2",
    subcategories: ["Lawn Mowing & Hedge Trimming", "Seasonal Flower Planting", "Pesticide Spray for Plants", "Drip Irrigation Setup"],
    startingPrice: 1500,
    unit: "visit"
  }
];

export const TRANSLATIONS = {
  en: {
    tagline: "You offer the price. Providers compete.",
    postRequest: "Post a Request",
    offerYourPrice: "Offer Your Price",
    searchPlaceholder: "What service do you need? (e.g. plumber, AC repair)",
    nearbyProviders: "Nearby Providers",
    waitingForOffers: "Waiting for Offers",
    openRequests: "Open Requests",
    myOffers: "My Offers",
    activeJobs: "Active Bookings",
    earnings: "Earnings",
    startPin: "Service Start PIN",
    counteroffer: "Counteroffer",
    acceptBudget: "Accept Budget",
    confirmBooking: "Confirm Booking",
    inspectionNeeded: "Inspection Needed",
    online: "Online",
    offline: "Offline"
  },
  ur: {
    tagline: "اپنی قیمت خود طے کریں۔ ماہرین آپ کو پیشکش دیں گے۔",
    postRequest: "کام کی درخواست دیں",
    offerYourPrice: "اپنی قیمت پیش کریں",
    searchPlaceholder: "آپ کو کون سی سروس چاہیے؟ (مثلاً پلمبر، اے سی مرمت)",
    nearbyProviders: "قریبی سروس فراہم کنندگان",
    waitingForOffers: "پیشکشوں کا انتظار ہے",
    openRequests: "کھلی درخواستیں",
    myOffers: "میری پیشکشیں",
    activeJobs: "جاری کام",
    earnings: "آمدنی",
    startPin: "کام شروع کرنے کا پن کوڈ",
    counteroffer: "جوابی پیشکش",
    acceptBudget: "بجٹ قبول کریں",
    confirmBooking: "بکنگ کی تصدیق کریں",
    inspectionNeeded: "معائنہ درکار ہے",
    online: "آن لائن",
    offline: "آف لائن"
  }
};
