import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Phone, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

export const PhoneAuthModal: React.FC = () => {
  const { isPhoneAuthOpen, setIsPhoneAuthOpen, currentUser } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('3005551234');
  const [otpCode, setOtpCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isPhoneAuthOpen) return null;

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      alert("Please enter a valid Pakistani mobile number.");
      return;
    }
    setStep('otp');
    setCooldown(45);
    // Demo auto-hint OTP
    setOtpCode('4892');
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => {
        setIsPhoneAuthOpen(false);
        setVerifiedSuccess(false);
        setStep('phone');
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-lime-100 flex items-center justify-center text-black font-bold">
              📱
            </span>
            <h3 className="font-black text-sm text-[#151515]">Phone Verification</h3>
          </div>
          <button
            onClick={() => setIsPhoneAuthOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Phone Entry */}
        {step === 'phone' && (
          <div className="py-4 space-y-4 text-xs">
            <p className="text-gray-600">
              Enter your mobile number to receive a secure SMS verification code.
            </p>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Mobile Number</label>
              <div className="flex items-center border-2 border-gray-200 focus-within:border-black rounded-xl overflow-hidden">
                <span className="px-3 py-2.5 bg-gray-100 font-bold text-gray-600 border-r border-gray-200">
                  +92
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="300 1234567"
                  className="w-full px-3 py-2.5 font-bold text-sm outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-[#B5F33D] hover:bg-[#a6e632] text-[#151515] font-extrabold text-xs py-3 rounded-xl shadow active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Send SMS Code</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div className="py-4 space-y-4 text-xs">
            <p className="text-gray-600">
              We sent a 4-digit code to <b>+92 {phoneNumber}</b>.
            </p>

            <div className="p-2.5 bg-lime-50 rounded-xl border border-lime-200 text-[11px] text-lime-950 font-medium">
              Demo auto-fill: Use code <b>4892</b>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Enter Verification Code</label>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-black font-black text-center text-2xl tracking-widest outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>Didn't receive code?</span>
              {cooldown > 0 ? (
                <span>Resend in {cooldown}s</span>
              ) : (
                <button
                  onClick={() => setCooldown(45)}
                  className="font-bold text-black underline"
                >
                  Resend SMS
                </button>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="w-full bg-[#151515] hover:bg-black text-[#B5F33D] font-extrabold text-xs py-3 rounded-xl shadow active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              {verifiedSuccess ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 size={16} /> Verified!
                </span>
              ) : isVerifying ? (
                <span>Checking...</span>
              ) : (
                <span>Verify & Login</span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
