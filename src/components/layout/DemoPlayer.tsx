import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X, 
  Bot,
  Sparkles
} from 'lucide-react';
import { useDemo, DEMO_SCENES } from '../../context/DemoContext';

export const DemoPlayer: React.FC = () => {
  const { 
    isDemoRunning, 
    currentSceneIndex, 
    currentScene, 
    progressPct, 
    isPaused, 
    stopDemo, 
    togglePause, 
    nextScene, 
    prevScene,
    jumpToScene
  } = useDemo();

  if (!isDemoRunning) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-3xl border-2 border-blue-600 shadow-2xl bg-white text-slate-900">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
          <div 
            className="bg-blue-600 h-full transition-all duration-100 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Player Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                  Scene {currentSceneIndex + 1} of 9
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {currentScene.highlightBadge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {currentScene.title}
              </h3>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 self-center">
            <button
              onClick={prevScene}
              disabled={currentSceneIndex === 0}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition"
              title="Previous Scene"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePause}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={nextScene}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Next Scene"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={stopDemo}
              className="p-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 transition ml-2"
              title="Exit Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Narration subtitle */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <p>
            <strong className="text-slate-900">{currentScene.subtitle}</strong> — {currentScene.narration}
          </p>
        </div>

      </div>
    </div>
  );
};
