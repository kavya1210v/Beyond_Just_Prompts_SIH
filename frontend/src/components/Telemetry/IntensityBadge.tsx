import React from 'react';
import { IMDCategoryInfo } from '../../types/cyclone';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface IntensityBadgeProps {
  category: IMDCategoryInfo;
}

const ALL_IMD_LEVELS = [
  { code: 'D', name: 'Depression', minKm: 31, color: '#3b82f6' },
  { code: 'DD', name: 'Deep Depression', minKm: 50, color: '#06b6d4' },
  { code: 'CS', name: 'Cyclonic Storm', minKm: 62, color: '#eab308' },
  { code: 'SCS', name: 'Severe Cyclonic Storm', minKm: 89, color: '#f97316' },
  { code: 'VSCS', name: 'Very Severe CS', minKm: 118, color: '#ef4444' },
  { code: 'ESCS', name: 'Extremely Severe CS', minKm: 168, color: '#dc2626' },
  { code: 'SuCS', name: 'Super Cyclone', minKm: 222, color: '#9333ea' },
];

export const IntensityBadge: React.FC<IntensityBadgeProps> = ({ category }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Current Intensity Box */}
      <div className="flex items-center justify-between p-3.5 rounded-none bg-white border border-slate-300">
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: `${category.color_hex}15`, borderColor: category.color_hex }}
            className="w-11 h-11 rounded-none border flex items-center justify-center shadow-sm"
          >
            <ShieldAlert className="w-6 h-6" style={{ color: category.color_hex }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500">IMD Classification:</span>
              <span
                style={{ backgroundColor: category.color_hex }}
                className="px-2 py-0.5 rounded-none text-xs font-mono font-bold text-white shadow-sm"
              >
                {category.code}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 font-sans mt-0.5">{category.name}</h4>
            <p className="text-xs text-slate-600 font-mono">{category.wind_speed_range_kmh}</p>
          </div>
        </div>
      </div>

      {/* IMD Progression Scale Bar */}
      <div className="flex flex-col gap-1.5 p-3 rounded-none bg-slate-50 border border-slate-200">
        <span className="text-xs font-mono text-slate-500 font-semibold uppercase">
          IMD Tropical Cyclone Intensity Scale:
        </span>
        <div className="grid grid-cols-7 gap-1">
          {ALL_IMD_LEVELS.map((lvl) => {
            const isActive = lvl.code === category.code;
            return (
              <div
                key={lvl.code}
                className={`flex flex-col items-center p-1.5 rounded-none transition-all ${
                  isActive
                    ? 'ring-1 ring-slate-400 shadow-sm'
                    : 'opacity-40 hover:opacity-75'
                }`}
                style={{
                  backgroundColor: isActive ? `${lvl.color}15` : 'transparent',
                  border: `1px solid ${isActive ? lvl.color : '#e2e8f0'}`,
                }}
              >
                <span className="text-xs font-mono font-bold" style={{ color: isActive ? lvl.color : '#64748b' }}>
                  {lvl.code}
                </span>
                <span className={`text-[10px] font-mono hidden sm:inline truncate max-w-full ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                  {lvl.minKm}+ km
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
