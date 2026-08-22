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
  MapPin, 
  Play, 
  Crown, 
  Droplet, 
  Car, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import { 
  isWebNFCSupported, 
  DEMO_NFC_TAGS, 
  startHardwareNFCScan,
  writeHardwareNFCTag 
} from '../../services/nfcService';
import { NFCScanResult, NFCBadgePayload, NFCAssetPayload, NFCDispatchPayload } from '../../types/nfc';
import { soundEngine } from '../../services/audioService';

interface NFCControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NFCControlModal: React.FC<NFCControlModalProps> = ({ isOpen, onClose }) => {
  const { login, currentUser, isAdmin } = useAuth();
  const { 
    setMapFocusTarget, 
    setActiveIncident, 
    startAnimatedDispatch, 
    setActiveTab, 
    selectedCity 
  } = useCity();

  const [activeTab, setActiveTabMode] = useState<'scan' | 'badges' | 'write'>('scan');
  const [hardwareSupported, setHardwareSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedTag, setLastScannedTag] = useState<NFCScanResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    setHardwareSupported(isWebNFCSupported());
  }, []);

  if (!isOpen) return null;

  // Handle Tag Scanned (via Hardware or Virtual Tap)
  const handleTagAction = async (tag: NFCScanResult) => {
    soundEngine.playSuccess();
    setLastScannedTag(tag);

    if (tag.payload.type === 'badge') {
      const badge = tag.payload as NFCBadgePayload;
      setStatusMessage(`🪪 NFC Badge Authenticated: Logging in as ${badge.fullName} (${badge.role})...`);
      try {
        await login({ email: badge.email, password: '@123' });
        setTimeout(() => {
          setStatusMessage(`✅ Authenticated! Welcome, ${badge.fullName}.`);
        }, 800);
      } catch (err: any) {
        setStatusMessage(`⚠️ ${err?.message || 'Login failed'}`);
      }
    } else if (tag.payload.type === 'asset') {
      const asset = tag.payload as NFCAssetPayload;
      setStatusMessage(`📍 Physical Asset Located: Focusing map on ${asset.title}...`);
      setMapFocusTarget(asset.coordinates);
      setActiveTab('command-center');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else if (tag.payload.type === 'dispatch') {
      const dispatch = tag.payload as NFCDispatchPayload;
      setStatusMessage(`🚨 NFC Dispatch Authorized: Launching emergency route to ${dispatch.targetHospital}...`);
      setActiveTab('emergency-response');
      startAnimatedDispatch();
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleStartPhysicalScan = async () => {
    if (!hardwareSupported) {
      setStatusMessage('Web NFC API is active in Simulation Mode. Tap any virtual tag below to test.');
      return;
    }

    setIsScanning(true);
    setStatusMessage('📡 Hold your NFC card or phone tag against the back of this device...');

    await startHardwareNFCScan(
      (result) => {
        setIsScanning(false);
        handleTagAction(result);
      },
      (err) => {
        setIsScanning(false);
        setStatusMessage(`⚠️ ${err}`);
      }
    );
  };

  const handleWriteSampleTag = async (type: 'admin' | 'traffic' | 'water') => {
    if (!hardwareSupported) {
      setStatusMessage('💡 To write physical NFC tags, open this website in Google Chrome on an NFC-enabled Android phone.');
      return;
    }

    setIsWriting(true);
    setStatusMessage('✍️ Approach a blank NFC sticker/card (NTAG213/215/216) to encode...');

    try {
      const payloadToWrite = type === 'admin' 
        ? DEMO_NFC_TAGS[0].payload 
        : type === 'traffic' ? DEMO_NFC_TAGS[1].payload : DEMO_NFC_TAGS[2].payload;

      await writeHardwareNFCTag(payloadToWrite);
      soundEngine.playSuccess();
      setStatusMessage('✅ Successfully encoded UrbanTwin data onto physical NFC tag!');
    } catch (err: any) {
      setStatusMessage(`⚠️ Write Error: ${err?.message || 'Failed to write tag'}`);
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
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
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Radio className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                IoT Physical-to-Digital Bridge
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                hardwareSupported 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {hardwareSupported ? '● Web NFC Hardware Ready' : '● NFC Simulator Active'}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              UrbanTwin NFC Smart Hub
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setActiveTabMode('scan')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tap-to-Action</span>
          </button>

          <button
            onClick={() => setActiveTabMode('badges')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>NFC Badges</span>
          </button>

          <button
            onClick={() => setActiveTabMode('write')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'write'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Encode Tag</span>
          </button>
        </div>

        {/* Live Status Feedback Banner */}
        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs flex items-center gap-2 animate-in fade-in-50">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {/* TAB 1: TAP TO ACTION (SIMULATOR + HARDWARE SCANNER) */}
        {activeTab === 'scan' && (
          <div className="mt-4 space-y-4">
            
            {/* Tap Scanner Visual Dock */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-slate-50 border-2 border-indigo-200 text-center space-y-3 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
                <Radio className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {isScanning ? 'Scanning for Nearby NFC Tags...' : 'NFC Proximity Sensor Active'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 max-w-md mx-auto">
                  Tap physical NFC tags (cards/stickers) or click any virtual smart card below to instantly trigger digital twin actions.
                </p>
              </div>

              <button
                onClick={handleStartPhysicalScan}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition transform hover:scale-105 cursor-pointer"
              >
                {isScanning ? '📡 Listening for Tag...' : '📱 Start Physical NFC Reader'}
              </button>
            </div>

            {/* Virtual Interactive NFC Tag List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                1-Click Virtual NFC Tags (Click to Emulate Tag Proximity Tap):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_NFC_TAGS.map((tag) => (
                  <div
                    key={tag.serialNumber}
                    onClick={() => handleTagAction(tag)}
                    className="p-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition cursor-pointer shadow-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition">
                        {tag.label}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {tag.serialNumber.split(':').slice(-2).join(':')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {tag.timestamp}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-700 font-bold">
                      <span>Tap to Trigger</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SMART CITY NFC BADGES */}
        {activeTab === 'badges' && (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
              🪪 <b>Zero-Password NFC Authentication:</b> Municipal directors and field personnel carry encrypted NFC smart badges. Touching their badge instantly unlocks privileged command access.
            </div>

            {/* Super Admin Badge Card */}
            <div 
              onClick={() => handleTagAction(DEMO_NFC_TAGS[0])}
              className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-xl border-2 border-indigo-400 cursor-pointer relative overflow-hidden group transform hover:scale-[1.01] transition"
            >
              <div className="absolute right-4 top-4 text-white/10 group-hover:text-white/20 transition">
                <Wifi className="w-20 h-20" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  Official Municipal Smart Card
                </span>
                <span className="text-[9px] font-mono text-slate-400">NFC NTAG216</span>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-extrabold text-white">
                  Sanchit Soodan
                </h3>
                <p className="text-xs text-indigo-200 font-medium">
                  Super Admin • System Owner
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-300 font-bold">
                <span>sanchitsoodan2405@gmail.com</span>
                <span>👉 Tap to Instant Login</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENCODE REAL PHYSICAL NFC TAGS */}
        {activeTab === 'write' && (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950">
              ✍️ <b>Write Physical NFC Stickers:</b> You can write live digital twin coordinates, Green-Wave route payloads, or Admin Identity onto any physical <b>NTAG213 / NTAG215 / NTAG216</b> NFC sticker.
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-700 block">
                Choose Data Payload to Encode on Physical Tag:
              </span>

              <div className="space-y-2">
                <button
                  onClick={() => handleWriteSampleTag('admin')}
                  disabled={isWriting}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition flex items-center justify-between text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                      👑
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Sanchit Soodan Super-Admin Smart Card</span>
                      <span className="text-[11px] text-slate-500">Encodes instant auth token for automated login</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700">Write Tag ↗</span>
                </button>

                <button
                  onClick={() => handleWriteSampleTag('traffic')}
                  disabled={isWriting}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition flex items-center justify-between text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold">
                      🚦
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Sector 17 Traffic Controller IoT Tag</span>
                      <span className="text-[11px] text-slate-500">Encodes junction coordinates [30.7415, 76.7825]</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700">Write Tag ↗</span>
                </button>

                <button
                  onClick={() => handleWriteSampleTag('water')}
                  disabled={isWriting}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-left transition flex items-center justify-between text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-700 font-bold">
                      🚰
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Sector 34 Water Valve Feeder Tag</span>
                      <span className="text-[11px] text-slate-500">Encodes utility valve telemetry coordinates</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sky-700">Write Tag ↗</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
