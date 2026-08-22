import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useCity } from './CityContext';
import { soundEngine } from '../services/audioService';
import { ViewTab } from '../types/city';

export interface DemoScene {
  step: number;
  title: string;
  subtitle: string;
  narration: string;
  viewTab: ViewTab;
  highlightBadge: string;
  durationMs: number;
}

export const DEMO_SCENES: DemoScene[] = [
  {
    step: 1,
    title: 'Scene 1: Live Multi-City Overview',
    subtitle: 'Real-time digital twin monitoring.',
    narration: 'UrbanTwin AI continuously monitors traffic corridors, hospital beds, and incidents across major global cities.',
    viewTab: 'command-center',
    highlightBadge: 'HEALTH: 87/100',
    durationMs: 7000
  },
  {
    step: 2,
    title: 'Scene 2: Live Incident Detected',
    subtitle: 'Accident blocking arterial lanes.',
    narration: 'Sensors detect a severe crash. Traffic begins backing up, threatening emergency ambulance response.',
    viewTab: 'command-center',
    highlightBadge: 'CRASH DETECTED',
    durationMs: 7000
  },
  {
    step: 3,
    title: 'Scene 3: What-If Sandbox',
    subtitle: 'Simulating disruptions and surges.',
    narration: 'UrbanTwin simulates road closures and traffic surges, calculating exact delays and generating an AI Action Plan.',
    viewTab: 'simulator',
    highlightBadge: 'SIMULATING IMPACT',
    durationMs: 7000
  },
  {
    step: 4,
    title: 'Scene 4: Live Animated Dispatch',
    subtitle: 'Ambulance drives in real-time on map.',
    narration: 'Watch the animated ambulance move in real-time along the green-wave path, clearing traffic lights and saving 4.2 minutes.',
    viewTab: 'emergency-response',
    highlightBadge: 'SAVES 4.2 MINUTES',
    durationMs: 8000
  },
  {
    step: 5,
    title: 'Scene 5: AI Solutions Implemented',
    subtitle: 'City operations restored to optimal state.',
    narration: 'With AI action plan implemented, congested roads clear to green and city score jumps back to 94.',
    viewTab: 'command-center',
    highlightBadge: 'SCORE RESTORED (94)',
    durationMs: 8000
  }
];

interface DemoContextType {
  isDemoRunning: boolean;
  currentSceneIndex: number;
  currentScene: DemoScene;
  progressPct: number;
  isPaused: boolean;
  startDemo: () => void;
  stopDemo: () => void;
  togglePause: () => void;
  nextScene: () => void;
  prevScene: () => void;
  jumpToScene: (index: number) => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressPct, setProgressPct] = useState(0);

  const city = useCity();
  const timerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentScene = DEMO_SCENES[currentSceneIndex] || DEMO_SCENES[0];

  const applySceneActions = useCallback((index: number) => {
    const scene = DEMO_SCENES[index];
    if (!scene) return;

    city.setActiveTab(scene.viewTab);

    switch (scene.step) {
      case 1:
        city.resetSimParams();
        city.setOptimizedRouteVisible(false);
        city.setActiveIncident(null);
        soundEngine.playClick();
        break;
      case 2:
        if (city.selectedCity.incidents.length > 0) {
          city.setActiveIncident(city.selectedCity.incidents[0]);
          city.setMapFocusTarget(city.selectedCity.incidents[0].coordinates);
        }
        soundEngine.playAlert();
        break;
      case 3:
        city.updateSimParam('trafficIncreasePct', 40);
        soundEngine.playSimulationRun();
        break;
      case 4:
        city.startAnimatedDispatch();
        break;
      case 5:
        city.implementSolutionPlan();
        soundEngine.playSuccess();
        break;
    }
  }, [city]);

  const startDemo = useCallback(() => {
    soundEngine.playSuccess();
    setIsDemoRunning(true);
    setCurrentSceneIndex(0);
    setIsPaused(false);
    setProgressPct(0);
    startTimeRef.current = Date.now();
    applySceneActions(0);
  }, [applySceneActions]);

  const stopDemo = useCallback(() => {
    soundEngine.playClick();
    setIsDemoRunning(false);
    setProgressPct(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  }, []);

  const togglePause = useCallback(() => {
    soundEngine.playClick();
    setIsPaused(prev => !prev);
  }, []);

  const nextScene = useCallback(() => {
    if (currentSceneIndex < DEMO_SCENES.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      setProgressPct(0);
      startTimeRef.current = Date.now();
      applySceneActions(nextIdx);
    } else {
      stopDemo();
    }
  }, [currentSceneIndex, applySceneActions, stopDemo]);

  const prevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      const prevIdx = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIdx);
      setProgressPct(0);
      startTimeRef.current = Date.now();
      applySceneActions(prevIdx);
    }
  }, [currentSceneIndex, applySceneActions]);

  const jumpToScene = useCallback((index: number) => {
    if (index >= 0 && index < DEMO_SCENES.length) {
      setCurrentSceneIndex(index);
      setProgressPct(0);
      startTimeRef.current = Date.now();
      applySceneActions(index);
    }
  }, [applySceneActions]);

  useEffect(() => {
    if (!isDemoRunning || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const duration = currentScene.durationMs;
    startTimeRef.current = Date.now();

    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgressPct(pct);
    }, 100);

    timerRef.current = window.setTimeout(() => {
      nextScene();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isDemoRunning, isPaused, currentSceneIndex, currentScene.durationMs, nextScene]);

  return (
    <DemoContext.Provider
      value={{
        isDemoRunning,
        currentSceneIndex,
        currentScene,
        progressPct,
        isPaused,
        startDemo,
        stopDemo,
        togglePause,
        nextScene,
        prevScene,
        jumpToScene
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
};
