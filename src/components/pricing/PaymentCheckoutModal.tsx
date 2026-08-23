import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soundEngine } from '../../services/audioService';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser } = useAuth();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [billingName, setBillingName] = useState(currentUser?.fullName || 'Enterprise Decision Maker');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    soundEngine.playClick();

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      soundEngine.playSuccess();
    }, 1200);
  };

  const handleFinish = () => {
    setIsPaid(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          title="Close Payment Gateway"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPaid ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Secure Payment Gateway
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    256-Bit SSL Encrypted
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Business Plan Subscription
                </h2>
              </div>
            </div>

            {/* Plan Price Summary */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  UrbanTwin Business License
                </span>
                <span className="text-[11px] text-slate-500">
                  Full access to advanced pandemic simulations & scenario controls
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-mono font-black text-slate-900">$499</span>
                <span className="text-xs text-slate-500 block">/ month</span>
              </div>
            </div>

            {/* Secure Checkout Form */}
            <form onSubmit={handlePay} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                    placeholder="4242 4242 4242 4242"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden text-center"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden text-center"
                    placeholder="CVC"
                  />
                </div>
              </div>

              {/* Security Badges */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PCI-DSS Level 1 Compliant
                </span>
                <span>Cancel anytime</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition transform hover:scale-[1.02] cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isProcessing ? 'PROCESSING PAYMENT...' : 'PAY $499 & ACTIVATE BUSINESS PLAN'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Payment Success Confirmation Screen */
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Payment Successful
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Business Plan Activated!
              </h2>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you, <b>{billingName}</b>. Your UrbanTwin Business subscription is now active with unlimited scenario simulations and extended analytical tools.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              License ID: <b>UBT-BIZ-{Math.random().toString(36).substring(2, 9).toUpperCase()}</b>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              Access Business Pandemic Simulator
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
