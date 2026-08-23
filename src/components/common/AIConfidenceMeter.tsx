import React, { useState } from 'react';
import { Sparkles, Info, ShieldCheck, Activity, Cpu } from 'lucide-react';

interface AIConfidenceMeterProps {
  score?: number; // e.g. 96.4
  label?: string;
  variant?: 'header-pill' | 'badge' | 'card' | 'map-pill' | 'compact';
  className?: string;
  showBreakdown?: boolean;
}

export const AIConfidenceMeter: React.FC<AIConfidenceMeterProps> = ({
  score = 96.4,
  label = 'AI Confidence',
  variant = 'badge',
  className = '',
  showBreakdown = true
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getScoreColor = (val: number) => {
    if (val >= 90) return {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      bar: 'bg-emerald-500',
      ring: 'text-emerald-500',
      glow: 'shadow-emerald-500/20'
    };
    if (val >= 80) return {
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      bar: 'bg-blue-500',
      ring: 'text-blue-500',
      glow: 'shadow-blue-500/20'
    };
    return {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      bar: 'bg-amber-500',
      ring: 'text-amber-500',
      glow: 'shadow-amber-500/20'
    };
  };

  const colors = getScoreColor(score);

  // Sub-metric weights for tooltips
  const breakdownMetrics = [
    { name: 'IoT Telemetry Feed', weight: '98%', status: 'Active' },
    { name: 'Neural Traffic Graph', weight: `${Math.round(score * 0.99)}%`, status: 'Calibrated' },
    { name: 'Predictive Triage', weight: `${Math.round(score * 1.01 > 99 ? 99 : score * 1.01)}%`, status: 'Optimal' },
    { name: 'Physics Simulation', weight: '95%', status: 'Validated' }
  ];

  // VARIANT 1: HEADER PILL (Compact, fits in top navigation)
  if (variant === 'header-pill') {
    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl ${colors.bg} ${colors.text} border ${colors.border} text-xs font-bold shadow-xs hover:scale-[1.02] transition cursor-pointer ${className}`}
          title="UrbanTwin Neural AI Prediction Confidence"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse shrink-0 text-emerald-600" />
          <span className="hidden sm:inline font-semibold">{label}:</span>
          <span className="font-mono font-extrabold">{score.toFixed(1)}%</span>
          
          {/* Micro Progress Bar */}
          <div className="w-8 h-1.5 rounded-full bg-slate-200 overflow-hidden hidden md:block ml-0.5">
            <div 
              className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
          </div>
        </button>

        {/* Detailed Tooltip Breakdown Popover */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 w-64 p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-2xl z-[7000] text-slate-800 animate-in fade-in-50 slide-in-from-top-1 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>AI Confidence Breakdown</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {score}%
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-2 leading-tight">
              Real-time calibration across multi-modal city sensors, spatial graph neural nets, and hydraulic telemetry.
            </p>

            <div className="mt-2.5 space-y-1.5">
              {breakdownMetrics.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-600 font-medium">{item.name}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold text-slate-900">{item.weight}</span>
                    <span className="text-[9px] text-emerald-600 font-bold">●</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // VARIANT 2: MAP FLOATING PILL
  if (variant === 'map-pill') {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-[11px] font-bold shadow-md ${className}`}>
        <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
        <span className="text-slate-500 text-[10px] uppercase font-bold">{label}</span>
        <span className="font-mono text-emerald-700 font-extrabold">{score.toFixed(1)}%</span>
        <div className="w-6 h-1 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${score}%` }} />
        </div>
      </div>
    );
  }

  // VARIANT 3: BADGE (Inline for cards)
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border} text-[10px] font-bold shadow-2xs ${className}`}>
        <Sparkles className="w-2.5 h-2.5 shrink-0 animate-pulse" />
        <span>{label}:</span>
        <span className="font-mono font-extrabold">{score.toFixed(1)}%</span>
        <div className="w-6 h-1 rounded-full bg-slate-200/80 overflow-hidden">
          <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${score}%` }} />
        </div>
      </div>
    );
  }

  // VARIANT 4: COMPACT MINI METER
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 text-[10px] font-bold text-slate-700 ${className}`}>
        <Sparkles className="w-3 h-3 text-emerald-600" />
        <span className="font-mono text-emerald-700">{score.toFixed(0)}% AI Confidence</span>
      </div>
    );
  }

  // VARIANT 5: FULL CARD
  return (
    <div className={`p-3.5 rounded-2xl ${colors.bg} border-2 ${colors.border} space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-extrabold text-slate-900">{label}</span>
        </div>
        <span className="text-xs font-mono font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
          {score.toFixed(1)}% High Reliability
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-white border border-slate-200 overflow-hidden">
        <div 
          className={`h-full ${colors.bar} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>

      {showBreakdown && (
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-slate-600">
          <div className="flex items-center justify-between bg-white/70 p-1.5 rounded-lg border border-slate-200/60">
            <span>IoT Sensors</span>
            <span className="font-mono font-bold text-slate-900">98.2%</span>
          </div>
          <div className="flex items-center justify-between bg-white/70 p-1.5 rounded-lg border border-slate-200/60">
            <span>Traffic Graph</span>
            <span className="font-mono font-bold text-slate-900">95.8%</span>
          </div>
        </div>
      )}
    </div>
  );
};
