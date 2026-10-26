import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_SEED, APP_CONFIG } from '../../config';
import {
  X,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Sparkles,
  HelpCircle,
  Upload,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PostRequestModal: React.FC = () => {
  const { isPostRequestOpen, setIsPostRequestOpen, createRequest, userLocation, setActiveCustomerTab } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [categoryId, setCategoryId] = useState<string>('plumbing');
  const [subcategory, setSubcategory] = useState<string>('Leaking Taps & Pipes');
  const [title, setTitle] = useState<string>('Leaking kitchen tap mixer & under-sink pipe repair');
  const [description, setDescription] = useState<string>('Tap is dripping constantly and water is leaking under the wooden cabinet.');
  const [area, setArea] = useState<string>(userLocation.area);
  const [address, setAddress] = useState<string>('House 14, Street 28, Sector F-10/1, Islamabad');
  const [timing, setTiming] = useState<'asap' | 'scheduled'>('asap');
  const [budget, setBudget] = useState<number>(2000);
  const [isInspectionNeeded, setIsInspectionNeeded] = useState<boolean>(false);

  if (!isPostRequestOpen) return null;

  const currentCat = CATEGORIES_SEED.find(c => c.id === categoryId) || CATEGORIES_SEED[0];

  const handlePublish = () => {
    createRequest({
      categoryId,
      categoryName: currentCat.name,
      subcategory,
      title,
      description,
      photos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'],
      location: {
        lat: userLocation.lat,
        lng: userLocation.lng,
        address,
        area
      },
      scheduleType: timing,
      scheduledDate: timing === 'scheduled' ? 'Tomorrow' : undefined,
      scheduledTimeWindow: timing === 'scheduled' ? '11:00 AM - 01:00 PM' : undefined,
      budget: isInspectionNeeded ? APP_CONFIG.inspectionFeeDefault : budget,
      isInspectionNeeded,
      inspectionFee: isInspectionNeeded ? APP_CONFIG.inspectionFeeDefault : undefined,
      scopeNotes: "Standard diagnosis and precision repair.",
      materialsResponsibility: 'customer',
      broadcastAllowed: true
    });

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setIsPostRequestOpen(false);
    setActiveCustomerTab('requests');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Step {step} of 2
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full">
                inDrive Pricing
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">
              {step === 1 ? "What service do you need?" : "Set your budget & location"}
            </h2>
          </div>
          <button
            onClick={() => setIsPostRequestOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          
          {/* STEP 1: Category & Problem description */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1.5">
                  Select Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES_SEED.slice(0, 6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryId(cat.id);
                        setSubcategory(cat.subcategories[0]);
                      }}
                      className={`p-2.5 rounded-2xl border text-left flex flex-col gap-0.5 transition-all ${
                        categoryId === cat.id
                          ? 'bg-lime-50 border-black ring-1 ring-black'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="font-extrabold text-xs text-slate-900">{cat.name}</span>
                      <span className="text-[10px] text-slate-500">From ₨ {cat.startingPrice}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1.5">
                  Specific Issue
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentCat.subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSubcategory(sub)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                        subcategory === sub
                          ? 'bg-slate-950 text-[#B5F33D] border-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kitchen tap mixer leaking"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs focus:ring-2 focus:ring-[#B5F33D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  Problem Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#B5F33D]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Budget & Location */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* inDrive Prominent Budget Entry */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  Offer Your Price (PKR)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-black text-2xl text-slate-400">₨</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-950 text-2xl font-black text-slate-950 focus:outline-none focus:ring-4 focus:ring-lime-300"
                  />
                </div>

                {/* Quick budget chips */}
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[11px] text-slate-400 font-bold">Quick picks:</span>
                  {[1500, 2000, 2500, 3000].map(val => (
                    <button
                      key={val}
                      onClick={() => setBudget(val)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                        budget === val
                          ? 'bg-slate-950 text-[#B5F33D]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ₨ {val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspection fee toggle */}
              <label className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInspectionNeeded}
                  onChange={(e) => setIsInspectionNeeded(e.target.checked)}
                  className="mt-0.5 accent-black rounded"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Not sure what the repair needs?</span>
                  <span className="text-slate-500 text-[11px]">
                    Request an on-site diagnosis inspection (Fee: PKR {APP_CONFIG.inspectionFeeDefault}).
                  </span>
                </div>
              </label>

              {/* Area & Address */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  Coverage Sector
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs"
                >
                  {APP_CONFIG.serviceAreas.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  Street Address (Kept Private until Confirmed)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTiming('asap')}
                  className={`p-2.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    timing === 'asap'
                      ? 'bg-lime-50 border-black ring-1 ring-black'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>⚡ ASAP (Fastest)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTiming('scheduled')}
                  className={`p-2.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    timing === 'scheduled'
                      ? 'bg-lime-50 border-black ring-1 ring-black'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Calendar size={13} />
                  <span>Schedule Later</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="bg-slate-950 text-[#B5F33D] font-black text-xs px-5 py-2.5 rounded-xl shadow active:scale-95 flex items-center gap-1"
            >
              <span>Next: Set Budget</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="bg-[#B5F33D] hover:bg-[#a6e632] text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow border border-black/10 active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles size={15} />
              <span>Broadcast & Get Bids</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
