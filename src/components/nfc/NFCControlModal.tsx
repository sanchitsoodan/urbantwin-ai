import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wifi, 
  Radio, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Monitor,
  Download,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  isWebNFCSupported, 
  OFFICIAL_NFC_ADMIN_CARDS, 
  startHardwareNFCScan,
  writeCardToPhysicalTag
} from '../../services/nfcService';
import { AdminNFCCard } from '../../types/nfc';
import { soundEngine } from '../../services/audioService';

interface NFCControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NFCControlModal: React.FC<NFCControlModalProps> = ({ isOpen, onClose }) => {
  const { loginWithNFC, currentUser, isAdmin } = useAuth();

  const [activeSection, setActiveSection] = useState<'hardware' | 'simulator'>('simulator');
  const [hardwareSupported, setHardwareSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeScannedCard, setActiveScannedCard] = useState<AdminNFCCard | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    const supported = isWebNFCSupported();
    setHardwareSupported(supported);
    // If running on a hardware-supported device, default to hardware section
    if (supported) {
      setActiveSection('hardware');
    }
  }, []);

  if (!isOpen) return null;

  // Authenticate Admin with NFC Card
  const handleAuthenticateCard = async (card: AdminNFCCard, source: 'hardware' | 'simulator') => {
    soundEngine.playSuccess();
    setActiveScannedCard(card);
    setStatusMessage(`🪪 NFC Authenticated: ${card.fullName} (${card.role}). Granting Admin Privileges...`);

    try {
      const user = await loginWithNFC(card);
      setTimeout(() => {
        setStatusMessage(`✅ Authorized! Logged in as ${user.fullName} with Super-Admin Access.`);
      }, 700);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      setStatusMessage(`⚠️ ${err?.message || 'Authentication error'}`);
    }
  };

  // Start Real Web NFC Scan
  const handleStartHardwareScan = async () => {
    if (!hardwareSupported) {
      setStatusMessage('Web NFC is not supported on this browser/OS. Please use the Simulator Section or Chrome on Android.');
      return;
    }

    setIsScanning(true);
    setStatusMessage('📡 Proximity Sensor Active: Hold any of the 4 Admin NFC Cards to the back of your phone...');

    await startHardwareNFCScan(
      (matchedCard, serialNumber) => {
        setIsScanning(false);
        handleAuthenticateCard(matchedCard, 'hardware');
      },
      (err) => {
        setIsScanning(false);
        setStatusMessage(`⚠️ ${err}`);
      }
    );
  };

  // Write selected Admin profile to a blank physical NTAG card
  const handleWriteCard = async (card: AdminNFCCard) => {
    if (!hardwareSupported) {
      setStatusMessage('💡 To write physical NFC tags, open this URL on an NFC-enabled Android phone with Google Chrome.');
      return;
    }

    setIsWriting(true);
    setStatusMessage(`✍️ Hold a blank NFC card/sticker (NTAG213/215/216) to encode credentials for ${card.fullName}...`);

    try {
      await writeCardToPhysicalTag(card);
      soundEngine.playSuccess();
      setStatusMessage(`✅ Successfully written NFC credentials for ${card.fullName} onto physical card!`);
    } catch (err: any) {
      setStatusMessage(`⚠️ Write Error: ${err?.message || 'Failed to write card'}`);
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          title="Close NFC Hub"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-300">
            <Crown className="w-6 h-6 text-amber-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                4-Card NFC Admin Access Hub
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                hardwareSupported 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}>
                {hardwareSupported ? '● Web NFC Hardware Connected' : '● Demo & Simulator Active'}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Tap-to-Login Admin Smart Cards
            </h2>
          </div>
        </div>

        {/* SECTION SWITCHER: HARDWARE NFC vs NON-NFC SIMULATOR */}
        <div className="mt-5 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          
          {/* Section 1: Hardware Web NFC */}
          <button
            onClick={() => { setActiveSection('hardware'); setStatusMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeSection === 'hardware'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. Physical NFC Reader (NFC Device)</span>
          </button>

          {/* Section 2: Virtual Demo Simulator */}
          <button
            onClick={() => { setActiveSection('simulator'); setStatusMessage(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeSection === 'simulator'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>2. 4-Card Demo (Non-NFC Device)</span>
          </button>

        </div>

        {/* Live Status Feedback Banner */}
        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center gap-2 animate-in fade-in-50">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: HARDWARE WEB NFC SCANNER (FOR NFC-ENABLED DEVICES / PHONES) */}
        {/* ========================================================================= */}
        {activeSection === 'hardware' && (
          <div className="mt-4 space-y-4 animate-in fade-in-50">
            
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-xs text-emerald-950">
              📡 <b>Physical NFC Reader Mode:</b> Touch any physical NFC Smart Card or programmed sticker tag to the back of your NFC-enabled phone to authenticate automatically.
            </div>

            {/* Scanning Radar Dock */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 border-2 border-emerald-300 text-center space-y-3.5 relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-pulse">
                <Radio className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isScanning ? 'Listening for Physical NFC Card...' : 'Hardware Web NFC Reader Ready'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                  {hardwareSupported 
                    ? 'Click below and hold any of the 4 Admin NFC Cards flat against your phone sensor.'
                    : 'To test physical hardware reading, open this website on Google Chrome on an Android smartphone.'}
                </p>
              </div>

              <button
                onClick={handleStartHardwareScan}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition transform hover:scale-105 cursor-pointer"
              >
                {isScanning ? '📡 Sensor Active • Touch Card...' : '▶ Start Live NFC Hardware Scan'}
              </button>
            </div>

            {/* 4 Cards Reference Table */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Accepted Physical NFC Cards:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {OFFICIAL_NFC_ADMIN_CARDS.map(card => (
                  <div key={card.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{card.icon} {card.fullName}</span>
                      <span className="text-[10px] text-slate-500">{card.role}</span>
                    </div>
                    {hardwareSupported && (
                      <button
                        onClick={() => handleWriteCard(card)}
                        disabled={isWriting}
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100"
                        title="Encode this profile onto a blank physical card"
                      >
                        Encode
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: 4-CARD DEMO SIMULATOR (FOR NON-NFC DEVICES / MAC / PC / DEMOS) */}
        {/* ========================================================================= */}
        {activeSection === 'simulator' && (
          <div className="mt-4 space-y-4 animate-in fade-in-50">
            
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
              💻 <b>Non-NFC Device Presentation Mode:</b> Tap any of the 4 official Admin NFC Cards below to simulate an instant NFC proximity touch and log in with full Admin powers!
            </div>

            {/* 4 Physical NFC Card Renders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {OFFICIAL_NFC_ADMIN_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleAuthenticateCard(card, 'simulator')}
                  className={`p-5 rounded-3xl bg-gradient-to-br ${card.themeGradient} text-white shadow-xl border-2 border-white/20 hover:border-amber-400 cursor-pointer relative overflow-hidden group transform hover:scale-[1.02] transition-all flex flex-col justify-between min-h-[170px]`}
                >
                  {/* Decorative Watermark */}
                  <div className="absolute right-3 top-3 text-white/10 group-hover:text-white/20 transition">
                    <Wifi className="w-16 h-16" />
                  </div>

                  {/* Card Header */}
                  <div className="flex items-center justify-between z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${card.badgeAccent} flex items-center gap-1`}>
                      <span>{card.icon}</span>
                      <span>{card.badgeNumber}</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">UID: {card.cardUid}</span>
                  </div>

                  {/* Card Body */}
                  <div className="my-3 z-10">
                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition">
                      {card.fullName}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {card.role}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {card.city}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-amber-300 z-10">
                    <span className="text-[10px] text-slate-400 font-normal truncate max-w-[140px]">{card.email}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>👉 Tap Card</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              💡 Tapping any card registers/authenticates the operator and unlocks the <b>👑 Admin DB</b> and full control panel.
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
