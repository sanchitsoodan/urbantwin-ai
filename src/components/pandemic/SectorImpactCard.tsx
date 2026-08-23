import React from 'react';
import { 
  HeartPulse, 
  TrendingDown, 
  Truck, 
  Briefcase, 
  PackageCheck, 
  Users2, 
  Leaf, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { SectorImpact, SectorId, ImpactStatusLevel } from '../../types/pandemic';
import { getStatusColor } from '../../services/pandemicSimulationEngine';

interface SectorImpactCardProps {
  impact?: SectorImpact;
  isSummaryCard?: boolean;
  overallScore?: number;
  overallStatus?: ImpactStatusLevel;
}

export const SectorImpactCard: React.FC<SectorImpactCardProps> = ({
  impact,
  isSummaryCard = false,
  overallScore = 68,
  overallStatus = 'HIGH'
}) => {
  const getSectorIcon = (id?: SectorId | 'summary') => {
    switch (id) {
      case 'healthcare':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'economy':
        return <TrendingDown className="w-5 h-5 text-amber-600" />;
      case 'transportation':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'workforce':
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case 'supply_chain':
        return <PackageCheck className="w-5 h-5 text-purple-600" />;
      case 'society':
        return <Users2 className="w-5 h-5 text-teal-600" />;
      case 'environment':
        return <Leaf className="w-5 h-5 text-emerald-600" />;
      default:
        return <Activity className="w-5 h-5 text-blue-700" />;
    }
  };

  if (isSummaryCard || !impact) {
    const color = getStatusColor(overallStatus);
    return (
      <div className={`card-clean p-5 rounded-3xl bg-white border-2 ${color.border} shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-slate-100 border border-slate-200">
              {getSectorIcon('summary')}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Impact Score
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Sector 8 • Resilience Index
              </span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${color.badge}`}>
            {overallStatus} IMPACT
          </span>
        </div>

        <div className="my-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
            {overallScore}
          </span>
          <span className="text-xs text-slate-400 font-bold">/ 100</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${
              overallStatus === 'LOW' ? 'bg-emerald-500' :
              overallStatus === 'MODERATE' ? 'bg-amber-500' :
              overallStatus === 'HIGH' ? 'bg-rose-500' : 'bg-red-600'
            }`}
            style={{ width: `${overallScore}%` }}
          />
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Composite cross-sector resilience score representing city-wide systemic pandemic pressure.
        </p>
      </div>
    );
  }

  const color = getStatusColor(impact.status);

  return (
    <div className={`card-clean p-5 rounded-3xl bg-white border-2 ${color.border} shadow-sm flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden`}>
      
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200">
            {getSectorIcon(impact.id)}
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
              {impact.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Critical Domain
            </span>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${color.badge}`}>
          {impact.status} IMPACT
        </span>
      </div>

      {/* Score Number */}
      <div className="my-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
          {impact.score}
        </span>
        <span className="text-xs text-slate-400 font-bold">/ 100</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
        <div 
          className={`h-full transition-all duration-300 rounded-full ${
            impact.status === 'LOW' ? 'bg-emerald-500' :
            impact.status === 'MODERATE' ? 'bg-amber-500' :
            impact.status === 'HIGH' ? 'bg-rose-500' : 'bg-red-600'
          }`}
          style={{ width: `${impact.score}%` }}
        />
      </div>

      {/* 1-Line Explanation */}
      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
        {impact.explanation}
      </p>
    </div>
  );
};
