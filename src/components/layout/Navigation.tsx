import React from 'react';
import { 
  Map as MapIcon, 
  SlidersHorizontal, 
  Ambulance, 
  Info
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { ViewTab } from '../../types/city';

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'command-center', label: 'City Map', icon: MapIcon },
  { id: 'simulator', label: 'What-If Sandbox', icon: SlidersHorizontal },
  { id: 'emergency-response', label: 'Emergency Demo', icon: Ambulance },
  { id: 'architecture', label: 'How It Works', icon: Info }
];

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useCity();

  return (
    <nav className="md:hidden bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
