import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Send, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { useAuth } from '../../context/AuthContext';
import { EnterpriseQuoteModal } from '../pricing/EnterpriseQuoteModal';

export const PricingView: React.FC = () => {
  const { setActiveTab } = useCity();
  const { isBusinessSubscribed, openPaymentModal } = useAuth();
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);

  return (
    <div className="max-w-[1920px] mx-auto px-4 lg:px-6 space-y-8 pb-16">
      
      {/* Enterprise Quote Request Modal */}
      <EnterpriseQuoteModal
        isOpen={isEnterpriseOpen}
        onClose={() => setIsEnterpriseOpen(false)}
      />

      {/* Header Banner */}
      <div className="card-clean p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Enterprise-Ready Urban Resilience
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          PLANS & LICENSING
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
          Scale from single-city pandemic scenario exploration to national sovereign digital twins and multi-departmental emergency response networks.
        </p>

        {isBusinessSubscribed && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 inline-flex items-center gap-2 text-xs font-bold mt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>You have an active Business Plan subscription. All premium features are unlocked!</span>
          </div>
        )}
      </div>

      {/* 3 Clean Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        
        {/* TIER 1: FREE */}
        <div className="card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Exploration Tier
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                FREE
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For individuals and basic city exploration.
              </p>
            </div>

            <div className="flex items-baseline gap-1 pt-2 border-t border-slate-100">
              <span className="text-3xl font-black font-mono text-slate-900">$0</span>
              <span className="text-xs text-slate-500 font-semibold">/ forever</span>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Includes:
              </span>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Basic Pandemic 90-day simulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Standard timeline milestones</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Basic What If scenarios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>8 Sector impact cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Pandemic GIS map</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('pandemic')}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition cursor-pointer mt-6"
          >
            TRY FOR FREE
          </button>
        </div>

        {/* TIER 2: BUSINESS (POPULAR / HIGHLIGHTED) */}
        <div className="card-clean p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white to-blue-50/40 border-2 border-blue-500 shadow-xl flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            Most Popular
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                Organisation Tier
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                BUSINESS
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For businesses, municipal planners & analysts.
              </p>
            </div>

            <div className="flex items-baseline gap-1 pt-2 border-t border-blue-100">
              <span className="text-3xl font-black font-mono text-slate-900">$499</span>
              <span className="text-xs text-slate-500 font-semibold">/ month</span>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Includes everything in Free, plus:
              </span>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                  <span className="font-semibold">🌟 Post-Pandemic Recovery Mode (Day 90–365)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                  <span className="font-semibold">🌟 365-Day Trajectory Resilience Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                  <span className="font-semibold">Extended multi-policy What-If controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                  <span className="font-semibold">Automated PDF report exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                  <span>Historical scenario comparative engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 font-bold" />
                  <span>Unlimited simulation runs & telemetry sync</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={openPaymentModal}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition transform hover:scale-[1.02] cursor-pointer mt-6 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{isBusinessSubscribed ? 'MANAGE SUBSCRIPTION' : 'GET BUSINESS ($499/mo)'}</span>
          </button>
        </div>

        {/* TIER 3: ENTERPRISE & GOVERNMENT */}
        <div className="card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Public Sector & Sovereign
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                ENTERPRISE & GOVT
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For governments, municipalities and large networks.
              </p>
            </div>

            <div className="flex items-baseline gap-1 pt-2 border-t border-slate-100">
              <span className="text-3xl font-black font-mono text-slate-900">Custom</span>
              <span className="text-xs text-slate-500 font-semibold">/ annual contract</span>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Includes everything in Business, plus:
              </span>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom pandemic modeling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live city sensor integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-city / national deployment</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated support & custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sovereign on-premise air-gapped deployment</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setIsEnterpriseOpen(true)}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition cursor-pointer mt-6 flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>CONTACT US</span>
          </button>
        </div>

      </div>

    </div>
  );
};
