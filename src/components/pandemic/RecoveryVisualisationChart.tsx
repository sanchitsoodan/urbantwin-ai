import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend,
  ReferenceArea,
  ReferenceLine
} from 'recharts';
import { generatePandemicTimelinePoints } from '../../services/pandemicSimulationEngine';
import { PandemicWhatIfParams } from '../../types/pandemic';
import { Activity, TrendingDown, Info } from 'lucide-react';

interface RecoveryVisualisationChartProps {
  currentDay: number;
  params: PandemicWhatIfParams;
}

export const RecoveryVisualisationChart: React.FC<RecoveryVisualisationChartProps> = ({
  currentDay,
  params
}) => {
  const chartData = generatePandemicTimelinePoints(params);

  return (
    <div className="card-clean p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
              Long-Term Resilience Trajectory
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              IMPACT OVER TIME (Day 0 → Day 365)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            0–90d Outbreak
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            90–365d Recovery
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500 font-medium">
        Tracking cross-sector stress from early contagion through peak crisis and sustained multi-phase urban recovery.
      </p>

      {/* Recharts Line Visualisation */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis 
              dataKey="day" 
              tickFormatter={(val) => `Day ${val}`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                border: '2px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
              formatter={(value: any, name: any) => [`${value} / 100`, name]}
              labelFormatter={(label) => `📅 Day ${label} Timeline Marker`}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

            {/* Current Day Reference Line */}
            <ReferenceLine 
              x={currentDay} 
              stroke="#2563eb" 
              strokeWidth={2} 
              strokeDasharray="4 4"
              label={{ value: `Day ${currentDay}`, fill: '#2563eb', fontSize: 10, position: 'top' }}
            />

            {/* Lines */}
            <Line 
              type="monotone" 
              dataKey="averageImpact" 
              name="Average Impact Score" 
              stroke="#0f172a" 
              strokeWidth={3.5} 
              dot={{ r: 3, fill: '#0f172a' }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="healthcare" 
              name="Healthcare" 
              stroke="#e11d48" 
              strokeWidth={2} 
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="economy" 
              name="Economy" 
              stroke="#d97706" 
              strokeWidth={2} 
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="supply_chain" 
              name="Supply Chain" 
              stroke="#7c3aed" 
              strokeWidth={2} 
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="environment" 
              name="Environment" 
              stroke="#059669" 
              strokeWidth={2} 
              strokeDasharray="3 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
