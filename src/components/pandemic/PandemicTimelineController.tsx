import React from 'react';
import { 
  Calendar, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Flame,
  ShieldCheck,
  TrendingDown,
  Lock
} from 'lucide-react';

interface PandemicTimelineControllerProps {
  currentDay: number;
  onDayChange: (day: number) => void;
  isRecoveryMode: boolean;
  onToggleRecoveryMode: (recovery: boolean) => void;
  isBusinessSubscribed?: boolean;
  onPromptUpgrade?: () => void;
}

export const PandemicTimelineController: React.FC<PandemicTimelineControllerProps> = ({
  currentDay,
  onDayChange,
  isRecoveryMode,
  onToggleRecoveryMode,
  isBusinessSubscribed = false,
  onPromptUpgrade
}) => {
  const minDay = isRecoveryMode ? 90 : 0;
  const maxDay = isRecoveryMode ? 365 : 90;

  const milestones = isRecoveryMode ? [
    { day: 90, label: 'Day 90', desc: 'Recovery Starts', isPremium: false },
    { day: 120, label: 'Day 120', desc: 'Early Recovery', isPremium: true },
    { day: 180, label: 'Day 180', desc: 'Mid Recovery', isPremium: true },
    { day: 270, label: 'Day 270', desc: 'Near Baseline', isPremium: true },
    { day: 365, label: 'Day 365', desc: 'Full Resilience', isPremium: true }
  ] : [
    { day: 0, label: 'Day 0', desc: 'Pandemic Begins', isPremium: false },
    { day: 30, label: 'Day 30', desc: 'Healthcare Surge', isPremium: false },
    { day: 60, label: 'Day 60', desc: 'Supply Chain Strain', isPremium: false },
    { day: 90, label: 'Day 90', desc: 'Peak Crisis Period', isPremium: false }
  ];

  const handleModeSwitch = () => {
    if (!isRecoveryMode && !isBusinessSubscribed) {
      if (onPromptUpgrade) onPromptUpgrade();
      return;
    }
    onToggleRecoveryMode(true);
    onDayChange(120);
  };

  const handleMilestoneClick = (day: number, isPremium: boolean) => {
    if (isPremium && !isBusinessSubscribed) {
      if (onPromptUpgrade) onPromptUpgrade();
      return;
    }
    onDayChange(day);
  };

  return (
    <div className="card-clean p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
      
      {/* Header with Mode Badge & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                Pandemic Timeline Controller
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                isRecoveryMode 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}>
                {isRecoveryMode ? '🟢 RECOVERY MODE (DAY 90–365)' : '🔴 90-DAY PANDEMIC PERIOD'}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">
              {isRecoveryMode ? 'Post-Pandemic Urban Recovery Progression' : 'Simulated Pandemic Outbreak Timeline'}
            </h3>
          </div>
        </div>

        {/* Mode Switcher Button */}
        <div className="flex items-center gap-2">
          {!isRecoveryMode ? (
            <button
              onClick={handleModeSwitch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold transition cursor-pointer"
              title="Switch to Recovery Mode (Day 90 - 365)"
            >
              {!isBusinessSubscribed && <Lock className="w-3 h-3 text-amber-600" />}
              <span>Explore Recovery Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                onToggleRecoveryMode(false);
                onDayChange(90);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-extrabold transition cursor-pointer"
              title="Return to 90-Day Pandemic Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to 90-Day Outbreak</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Slider */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Current Position:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              Day {currentDay}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              of {maxDay} Days
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="relative py-2">
          <input
            type="range"
            min={minDay}
            max={maxDay}
            step={1}
            value={currentDay}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > 90 && !isBusinessSubscribed) {
                if (onPromptUpgrade) onPromptUpgrade();
                onDayChange(90);
                return;
              }
              onDayChange(val);
              if (val > 90 && !isRecoveryMode) {
                onToggleRecoveryMode(true);
              }
            }}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden"
          />
        </div>

        {/* Milestone Quick-Jump Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-2">
          {milestones.map((m) => {
            const isSelected = currentDay === m.day;
            return (
              <button
                key={m.day}
                onClick={() => handleMilestoneClick(m.day, m.isPremium)}
                className={`p-2.5 rounded-2xl border text-left transition cursor-pointer relative ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-extrabold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                      {m.label}
                    </span>
                    {m.isPremium && !isBusinessSubscribed && (
                      <Lock className="w-2.5 h-2.5 text-amber-600 inline" />
                    )}
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                  {m.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
