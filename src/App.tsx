import React, { useState } from 'react';
import { CityProvider, useCity } from './context/CityContext';
import { DemoProvider } from './context/DemoContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { MetricCardsStrip } from './components/layout/MetricCardsStrip';
import { DemoPlayer } from './components/layout/DemoPlayer';
import { LandingModal } from './components/layout/LandingModal';
import { AISolutionsModal } from './components/dashboard/AISolutionsModal';
import { CityChatbotModal } from './components/chat/CityChatbotModal';
import { AuthModal } from './components/auth/AuthModal';
import { NFCControlModal } from './components/nfc/NFCControlModal';

import { CommandCenterView } from './components/views/CommandCenterView';
import { WhatIfSimulatorView } from './components/views/WhatIfSimulatorView';
import { EmergencySimulatorView } from './components/views/EmergencySimulatorView';
import { ArchitectureView } from './components/views/ArchitectureView';

const MainContent: React.FC = () => {
  const { activeTab, selectedCity } = useCity();
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isNFCOpen, setIsNFCOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Clean Top Header with City Switcher, NFC Hub, Sign Up, Log In & Database */}
      <Header 
        onOpenPitchModal={() => setIsPitchModalOpen(true)} 
        onOpenNFC={() => setIsNFCOpen(true)}
      />

      {/* Mobile-Only Tab Bar */}
      <Navigation />

      {/* 3 Large Clean Summary Metric Cards */}
      <MetricCardsStrip />

      {/* Main View */}
      <main className="flex-1 mt-1">
        {activeTab === 'command-center' && <CommandCenterView />}
        {activeTab === 'simulator' && <WhatIfSimulatorView />}
        {activeTab === 'emergency-response' && <EmergencySimulatorView />}
        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* NFC Physical-to-Digital Smart Hub Modal */}
      <NFCControlModal 
        isOpen={isNFCOpen}
        onClose={() => setIsNFCOpen(false)}
      />

      {/* Authentication & User Database Inspector Modal */}
      <AuthModal />

      {/* UrbanTwin Gemini AI Chatbot Modal & Floating Drawer */}
      <CityChatbotModal />

      {/* AI Proposed Action Plan & Solutions Implementer Modal */}
      <AISolutionsModal />

      {/* Floating Guided Tour Dock */}
      <DemoPlayer />

      {/* Overview Pitch Modal */}
      <LandingModal 
        isOpen={isPitchModalOpen} 
        onClose={() => setIsPitchModalOpen(false)} 
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-4 lg:px-6 py-3 text-xs text-slate-500">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">UrbanTwin AI</span>
            <span>— Smart City Operations & Predictive Digital Twin</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-indigo-700 font-bold">● NFC Bridge: Active</span>
            <span className="font-semibold text-slate-700">{selectedCity.name}, {selectedCity.country} {selectedCity.flag}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <DemoProvider>
          <MainContent />
        </DemoProvider>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
