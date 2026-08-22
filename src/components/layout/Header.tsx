import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  MapPin, 
  Bot, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  LogOut, 
  Database,
  Crown,
  User
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';
import { CITIES_DATABASE } from '../../data/citiesData';

interface HeaderProps {
  onOpenPitchModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPitchModal }) => {
  const { 
    simulatedTime, 
    soundMuted, 
    toggleSound, 
    activeTab, 
    setActiveTab,
    selectedCity,
    changeCity,
    setIsChatbotOpen
  } = useCity();

  const { isDemoRunning, startDemo, stopDemo } = useDemo();
  const { currentUser, logout, openAuthModal, allUsers, isAdmin } = useAuth();
  
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cityList = Object.values(CITIES_DATABASE);

  return (
    <header className="sticky top-0 z-[5000] border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo & Interactive City Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Logo */}
          <div 
            onClick={onOpenPitchModal}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-none">
                  UrbanTwin <span className="text-blue-600">AI</span>
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Predictive Digital Twin & Multi-Agent Operations
              </p>
            </div>
          </div>

          {/* Interactive City Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setCityDropdownOpen(!cityDropdownOpen);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 transition text-xs font-bold text-slate-800 shadow-xs cursor-pointer"
            >
              <span className="text-base leading-none">{selectedCity.flag}</span>
              <span>{selectedCity.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* City Dropdown Menu */}
            {cityDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-2 z-[6000] animate-in fade-in-50 slide-in-from-top-2">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Select Active Digital Twin City
                </div>
                <div className="space-y-1">
                  {cityList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        changeCity(c.id);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
                        selectedCity.id === c.id 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{c.flag}</span>
                        <div>
                          <div className="text-slate-900 font-bold">{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{c.country}</div>
                        </div>
                      </div>
                      {selectedCity.id === c.id && (
                        <span className="text-[10px] font-mono text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('command-center')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'command-center' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operations Cockpit
          </button>
          
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'simulator' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            What-If Sandbox
          </button>

          <button
            onClick={() => setActiveTab('emergency-response')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'emergency-response' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Emergency Dispatch
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'architecture' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Architecture
          </button>
        </nav>

        {/* Right: Actions, AI Copilot, User Auth & Admin Database */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Simulated Real-Time Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{simulatedTime}</span>
          </div>

          {/* Ask AI Copilot Button */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-800 border border-blue-200 font-bold text-xs transition shadow-xs cursor-pointer"
            title="Ask UrbanTwin Gemini Copilot"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* 👑 ADMIN-ONLY DATABASE BUTTON (HIDDEN FOR ALL REGULAR VISITORS / USERS) */}
          {isAdmin && (
            <button
              onClick={() => openAuthModal('database')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs transition cursor-pointer animate-in fade-in-50"
              title="Admin Only: View Registered User Database"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Admin DB</span>
              <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded-full font-mono font-bold">
                {allUsers.length}
              </span>
            </button>
          )}

          {/* AUTHENTICATION BUTTONS / USER PROFILE */}
          {!currentUser ? (
            <div className="flex items-center gap-1.5">
              {/* Sign In */}
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Log In</span>
              </button>

              {/* Sign Up */}
              <button
                onClick={() => openAuthModal('signup')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition transform hover:scale-[1.02] cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setCityDropdownOpen(false);
                }}
                className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border transition text-xs font-bold cursor-pointer ${
                  isAdmin 
                    ? 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-300 text-amber-950'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${currentUser.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center text-xs font-bold shadow-xs`}>
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="flex items-center gap-1 hidden sm:flex">
                  <span className="max-w-[100px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                  {isAdmin && <Crown className="w-3 h-3 text-amber-600" />}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* User Session Dropdown */}
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-3 z-[6000] animate-in fade-in-50 slide-in-from-top-2">
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className={`w-9 h-9 rounded-full ${currentUser.avatarColor || 'bg-blue-600'} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                      {currentUser.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                        <span>{currentUser.fullName}</span>
                        {isAdmin && <Crown className="w-3 h-3 text-amber-600" />}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border mt-1 inline-block ${
                        isAdmin ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    {/* Database option only visible to Admins */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          openAuthModal('database');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition cursor-pointer"
                      >
                        <Database className="w-4 h-4 text-indigo-600" />
                        <span>View User Database Records</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              soundMuted 
                ? 'bg-slate-100 text-slate-400 border-slate-200' 
                : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
            }`}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

        </div>

      </div>
    </header>
  );
};
