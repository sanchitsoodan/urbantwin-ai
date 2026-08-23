import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { EnterpriseQuoteRequest } from '../../types/pandemic';
import { soundEngine } from '../../services/audioService';

interface EnterpriseQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnterpriseQuoteModal: React.FC<EnterpriseQuoteModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [organisationType, setOrganisationType] = useState<'Enterprise' | 'Government' | 'Municipality' | 'Other'>('Government');
  const [requirement, setRequirement] = useState('');
  const [optionalMessage, setOptionalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundEngine.playClick();

    const quoteReq: EnterpriseQuoteRequest = {
      id: `QUOTE-${Date.now()}`,
      name,
      organisation,
      workEmail,
      organisationType,
      requirement,
      optionalMessage,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('urbantwin_enterprise_quotes') || '[]');
      existing.unshift(quoteReq);
      localStorage.setItem('urbantwin_enterprise_quotes', JSON.stringify(existing));
    } catch {
      // ignore storage error
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      soundEngine.playSuccess();
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setOrganisation('');
    setWorkEmail('');
    setRequirement('');
    setOptionalMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg card-clean p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200 shadow-2xl text-slate-900 z-[10001] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
          title="Close Quote Request"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Custom Licensing & Deployment
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Enterprise & Government Inquiry
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 font-medium">
              Connect directly with our solutions architecture team for custom multi-city models, sovereign cloud, and API data integrations.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  placeholder="e.g. Dr. Rajesh Sharma"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organisation / Agency *
                  </label>
                  <input
                    type="text"
                    required
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Municipal Corporation"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organisation Type *
                  </label>
                  <select
                    value={organisationType}
                    onChange={(e) => setOrganisationType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Government">Government</option>
                    <option value="Municipality">Municipality</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  placeholder="name@agency.gov / name@corp.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Simulation Requirement *
                </label>
                <input
                  type="text"
                  required
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  placeholder="e.g. Statewide pandemic logistics & hospital ICU twin"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Message
                </label>
                <textarea
                  rows={2}
                  value={optionalMessage}
                  onChange={(e) => setOptionalMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                  placeholder="Details regarding your timeline, jurisdiction, or data sources..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition transform hover:scale-[1.02] cursor-pointer mt-1 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'TRANSMITTING REQUEST...' : 'REQUEST A QUOTE'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Submission Feedback */
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                Inquiry Received
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Thank You
              </h2>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Thank you. Our team will contact you regarding UrbanTwin licensing and deployment for <b>{organisation}</b>.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
