import React from 'react';

export type TierType = 'implemented' | 'demo' | 'phase2';

interface StatusPillProps {
  tier: TierType;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ tier, label, size = 'sm' }) => {
  if (tier === 'implemented') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-none font-sans font-bold uppercase tracking-wide ${
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
        } bg-slate-100 text-slate-800 border border-slate-300`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        {label || 'TIER 1: IMPLEMENTED (YOLO11)'}
      </span>
    );
  }

  if (tier === 'demo') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-none font-sans font-bold uppercase tracking-wide ${
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
        } bg-slate-50 text-slate-600 border border-slate-200`}
      >
        <span className="w-1 h-1 rounded-full bg-slate-400" />
        {label || 'TIER 2: DEMO / SIMULATION'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-none font-sans font-bold uppercase tracking-wide ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      } bg-white text-slate-500 border border-slate-200 border-dashed`}
    >
      <span className="w-1 h-1 rounded-full bg-slate-300" />
      {label || 'TIER 3: PHASE II ROADMAP'}
    </span>
  );
};
