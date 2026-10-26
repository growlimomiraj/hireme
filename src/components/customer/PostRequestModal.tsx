import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_SEED, APP_CONFIG } from '../../config';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Upload,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PostRequestModal: React.FC = () => {
  const { isPostRequestOpen, setIsPostRequestOpen, createRequest, userLocation, setActiveCustomerTab } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [categoryId, setCategoryId] = useState<string>('plumbing');
  const [subcategory, setSubcategory] = useState<string>('Leaking Taps & Pipes');
  const [title, setTitle] = useState<string>('Leaking kitchen tap mixer & under-sink pipe repair');
  const [description, setDescription] = useState<string>('Tap is dripping constantly and water is pooling under the cabinet.');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
  ]);
  const [address, setAddress] = useState<string>('House 14, Street 28, Sector F-10/1, Islamabad');
  const [area, setArea] = useState<string>(userLocation.area);
  const [scheduleType, setScheduleType] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDate, setScheduledDate] = useState<string>('Tomorrow');
  const [scheduledTimeWindow, setScheduledTimeWindow] = useState<string>('11:00 AM - 01:00 PM');
  
  // inDrive core: Customer proposes the budget!
  const [budget, setBudget] = useState<number>(2000);
  const [isInspectionNeeded, setIsInspectionNeeded] = useState<boolean>(false);
  const [inspectionFee, setInspectionFee] = useState<number>(APP_CONFIG.inspectionFeeDefault);
  const [scopeNotes, setScopeNotes] = useState<string>('Includes mixer disassembly, cartridge clean/replacement, and tight joint seal.');
  const [materialsResponsibility, setMaterialsResponsibility] = useState<'customer' | 'provider' | 'split'>('customer');
  const [accessInstructions, setAccessInstructions] = useState<string>('Ring bell at front porch gate.');

  if (!isPostRequestOpen) return null;

  const currentCategoryObj = CATEGORIES_SEED.find(c => c.id === categoryId) || CATEGORIES_SEED[0];

  const handlePublish = () => {
    const finalBudget = isInspectionNeeded ? inspectionFee : budget;

    createRequest({
      categoryId,
      categoryName: currentCategoryObj.name,
      subcategory,
      title,
      description,
      photos,
      location: {
        lat: userLocation.lat,
        lng: userLocation.lng,
        address,
        area
      },
      scheduleType,
      scheduledDate: scheduleType === 'scheduled' ? scheduledDate : undefined,
      scheduledTimeWindow: scheduleType === 'scheduled' ? scheduledTimeWindow : undefined,
      budget: finalBudget,
      isInspectionNeeded,
      inspectionFee: isInspectionNeeded ? inspectionFee : undefined,
      scopeNotes,
      materialsResponsibility,
      accessInstructions,
      broadcastAllowed: true
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setIsPostRequestOpen(false);
    setActiveCustomerTab('requests');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Step {step} of 8
              </span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                inDrive Booking Model
              </span>
            </div>
            <h2 className="text-lg font-black text-[#151515] mt-0.5">
              {step === 1 && "1. Select Category & Problem"}
              {step === 2 && "2. Title & Description"}
              {step === 3 && "3. Upload Photos (Optional)"}
              {step === 4 && "4. Service Address & Sector"}
              {step === 5 && "5. When do you need this?"}
              {step === 6 && "6. Offer Your Budget (inDrive Style)"}
              {step === 7 && "7. Scope & Materials Responsibility"}
              {step === 8 && "8. Review & Broadcast to Nearby Pros"}
            </h2>
          </div>
          <button
            onClick={() => setIsPostRequestOpen(false)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Steps */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Category & Subcategory */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                  Select Service
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {CATEGORIES_SEED.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryId(cat.id);
                        setSubcategory(cat.subcategories[0]);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        categoryId === cat.id
                          ? 'bg-lime-50 border-black ring-1 ring-black'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="font-bold text-xs text-[#151515]">{cat.name}</span>
                      <span className="text-[10px] text-gray-500">From ₨ {cat.startingPrice}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                  Select Specific Issue
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentCategoryObj.subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSubcategory(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        subcategory === sub
                          ? 'bg-[#151515] text-[#B5F33D] border-black'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Title & Description */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                  Job Summary
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Leaking kitchen tap mixer & pipe seal replacement"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B5F33D] text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                  Detailed Problem Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, brand of fixture, any sounds or leak locations..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#B5F33D] text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Photos */}
          {step === 3 && (
            <div className="space-y-4 text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center">
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="font-bold text-xs text-gray-700">Attach photos of the faulty part or area</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Helps specialists give accurate quotes</span>
              </div>

              {photos.length > 0 && (
                <div className="flex items-center gap-3 justify-center">
                  {photos.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="Problem Preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                      <button
                        onClick={() => setPhotos([])}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Address */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                  Sector / Area in Islamabad/Rawalpindi
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#B5F33D]"
                >
                  {APP_CONFIG.serviceAreas.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                  Exact Street Address (Kept Private until Booking Confirmed)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 14, Street 28, Sector F-10/1, Islamabad"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B5F33D]"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  🔒 Providers only see approx area ({area}) when bidding.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Schedule */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setScheduleType('asap')}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    scheduleType === 'asap'
                      ? 'bg-lime-50 border-black ring-1 ring-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">⚡</span>
                  <span className="font-bold text-sm text-[#151515]">As Soon As Possible</span>
                  <span className="text-xs text-gray-500">Fastest response from nearby pros</span>
                </button>

                <button
                  onClick={() => setScheduleType('scheduled')}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    scheduleType === 'scheduled'
                      ? 'bg-lime-50 border-black ring-1 ring-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Calendar size={22} className="text-gray-700" />
                  <span className="font-bold text-sm text-[#151515]">Schedule for Later</span>
                  <span className="text-xs text-gray-500">Pick day & time window</span>
                </button>
              </div>

              {scheduleType === 'scheduled' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Date</label>
                    <input
                      type="text"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      placeholder="e.g. Tomorrow or Wednesday, Oct 28"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Time Window</label>
                    <input
                      type="text"
                      value={scheduledTimeWindow}
                      onChange={(e) => setScheduledTimeWindow(e.target.value)}
                      placeholder="e.g. 11:00 AM - 01:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: inDrive Budget Entry */}
          {step === 6 && (
            <div className="space-y-4">
              
              {/* Inspection Needed toggle */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <HelpCircle size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">Is the problem unclear?</span>
                  <span className="text-amber-800">
                    If you don't know the exact fix yet, request an initial diagnostic inspection.
                  </span>
                  <label className="flex items-center gap-2 mt-2 font-bold text-amber-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInspectionNeeded}
                      onChange={(e) => setIsInspectionNeeded(e.target.checked)}
                      className="accent-amber-600 rounded"
                    />
                    <span>Inspection Needed (Diagnostic fee PKR {inspectionFee})</span>
                  </label>
                </div>
              </div>

              {!isInspectionNeeded ? (
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                    What is your proposed budget? (PKR)
                  </label>
                  
                  {/* Large inDrive style price input */}
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-black text-2xl text-gray-400">₨</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#151515] text-3xl font-black text-[#151515] focus:outline-none focus:ring-4 focus:ring-lime-300"
                    />
                  </div>

                  {/* Quick price chips */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-400 font-semibold">Quick picks:</span>
                    {[1500, 2000, 2500, 3000].map(val => (
                      <button
                        key={val}
                        onClick={() => setBudget(val)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          budget === val ? 'bg-[#151515] text-[#B5F33D]' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        ₨ {val}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    💡 Like inDrive, nearby specialists can accept your ₨ {budget.toLocaleString()} budget or send counteroffers!
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Diagnostic Visit Fee</span>
                  <div className="text-2xl font-black text-[#151515]">PKR {inspectionFee}</div>
                  <p className="text-xs text-gray-600 mt-1">
                    The specialist will inspect the fault on-site. Any parts or labor quote must be itemized and approved by you before work begins.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Scope & Materials */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                  Scope & Inclusions
                </label>
                <textarea
                  rows={2}
                  value={scopeNotes}
                  onChange={(e) => setScopeNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                  Who provides materials / spare parts?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'customer', label: 'I will provide' },
                    { id: 'provider', label: 'Provider buys' },
                    { id: 'split', label: 'Discuss on-site' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setMaterialsResponsibility(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        materialsResponsibility === item.id
                          ? 'bg-lime-50 border-black ring-1 ring-black'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                  Gate / Access Instructions
                </label>
                <input
                  type="text"
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  placeholder="e.g. Ring bell for House 14, ground floor porch"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 8: Review & Publish */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="bg-lime-50 border border-lime-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-lime-950 uppercase">{currentCategoryObj.name} • {subcategory}</span>
                  <span className="text-sm font-black text-black">PKR {(isInspectionNeeded ? inspectionFee : budget).toLocaleString()}</span>
                </div>
                <h4 className="font-extrabold text-[#151515] text-sm mt-1">{title}</h4>
                <p className="text-xs text-gray-700 mt-1">{description}</p>
              </div>

              <div className="space-y-2 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Service Area:</span>
                  <span className="font-bold text-black">{area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Timing:</span>
                  <span className="font-bold text-black">{scheduleType === 'asap' ? '⚡ ASAP' : `${scheduledDate} (${scheduledTimeWindow})`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Materials:</span>
                  <span className="font-bold text-black capitalize">{materialsResponsibility}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <Sparkles size={16} className="text-blue-700 flex-shrink-0 mt-0.5" />
                <span>
                  Once published, eligible verified specialists in <b>{area}</b> will receive instant notifications to accept your price or offer counter proposals.
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Navigation Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 8 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-[#151515] hover:bg-black text-[#B5F33D] font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1 shadow transition-all active:scale-95"
            >
              <span>Continue</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-black text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg border border-black/10 transition-all active:scale-95"
            >
              <Sparkles size={16} />
              <span>Publish Request & Bids</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
