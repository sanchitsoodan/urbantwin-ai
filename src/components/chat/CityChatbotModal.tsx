import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Key, 
  MessageSquare
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { 
  askCityAI, 
  ChatMessage, 
  getStoredGeminiApiKey, 
  setStoredGeminiApiKey 
} from '../../services/geminiService';

const SUGGESTED_QUERIES = [
  { label: '👥 Population Surge & Economy', query: 'How does a population increase affect the economy and travel time in this city?' },
  { label: '🏥 Hospital ICU Beds', query: 'Which hospital in this city currently has the highest ICU bed availability?' },
  { label: '🚨 Active Incidents & ETAs', query: 'What are the active incidents, crashes, and emergency dispatch ETAs?' },
  { label: '🛣️ Road Closures & AI Detours', query: 'What road closure is active, and how does the AI detour bypass route help?' }
];

export const CityChatbotModal: React.FC = () => {
  const { 
    selectedCity, 
    simParams, 
    simResults, 
    implementedSolutions,
    isChatbotOpen,
    setIsChatbotOpen
  } = useCity();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when city changes
  useEffect(() => {
    setApiKeyInput(getStoredGeminiApiKey());
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `👋 Hello! I am **UrbanTwin AI**, your intelligent Operations Copilot for **${selectedCity.name}**.\n\nI have real-time access to the live digital twin telemetry, including traffic sensor feeds, hospital ICU capacities, What-If simulation models, and emergency routes.\n\nHow can I assist you with city operations today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [`${selectedCity.name} Command Core`]
      }
    ]);
  }, [selectedCity.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askCityAI(
        query,
        selectedCity,
        simParams,
        simResults,
        implementedSolutions
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Error fetching response: ${err?.message || 'Network error'}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    setStoredGeminiApiKey(apiKeyInput);
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyConfig(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-5 right-5 z-[9990] flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-2xl transition transform hover:scale-105 border-2 border-white/90 cursor-pointer"
          title="Open UrbanTwin AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <Bot className="w-4 h-4" />
          <span>Ask City AI ({selectedCity.name})</span>
        </button>
      )}

      {/* Chatbot Window Modal */}
      {isChatbotOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-end sm:justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          
          <div className="relative w-full max-w-lg h-[85vh] sm:h-[650px] bg-white rounded-3xl border-2 border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 animate-in slide-in-from-bottom-6 z-[10001]">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-blue-600 text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      UrbanTwin AI Copilot
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {selectedCity.name} {selectedCity.flag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Grounded in Live Telemetry & Gemini 2.5 Flash
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowKeyConfig(!showKeyConfig)}
                  className={`p-1.5 rounded-xl border transition ${
                    getStoredGeminiApiKey()
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
                  }`}
                  title="Configure Gemini API Key"
                >
                  <Key className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsChatbotOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-200/80 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition"
                  title="Close Chatbot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* API Key Configuration Dropdown Panel */}
            {showKeyConfig && (
              <div className="p-4 bg-blue-50/90 border-b border-blue-200 text-xs space-y-2 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    Gemini API Key Settings
                  </span>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-blue-700 underline font-semibold"
                  >
                    Get Free Gemini Key ↗
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Enter your Google Gemini API key to enable live generative conversational mode with <code>gemini-2.5-flash</code>. (Optional: Built-in grounded engine active by default).
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="password"
                    placeholder="Paste AIzaSy... key"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 outline-none focus:border-blue-600"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition"
                  >
                    {keySavedMessage ? 'Saved ✓' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sources && (
                      <span className="text-emerald-700 font-medium">
                        • Verified by {msg.sources.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 w-fit animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span>UrbanTwin AI is reasoning over digital twin telemetry...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTED_QUERIES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(s.query)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-semibold whitespace-nowrap transition border border-slate-200 cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask about ${selectedCity.name}'s traffic, ICU beds, population surge, or economy...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isLoading}
                className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
