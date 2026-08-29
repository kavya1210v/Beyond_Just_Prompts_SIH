import React from 'react';
import { StatusPill, TierType } from './StatusPill';

interface GlassCardProps {
  title: string;
  subtitle?: string;
  tier?: TierType;
  badgeLabel?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  subtitle,
  tier,
  badgeLabel,
  headerAction,
  children,
  className = '',
  glow = 'none',
}) => {
  const glowClasses = {
    cyan: 'border-t-2 border-t-cyan-600 border-x border-b border-slate-200',
    emerald: 'border-t-2 border-t-emerald-600 border-x border-b border-slate-200',
    amber: 'border-t-2 border-t-amber-500 border-x border-b border-slate-200',
    rose: 'border-t-2 border-t-rose-600 border-x border-b border-slate-200',
    none: 'border border-slate-200',
  };

  return (
    <div
      className={`relative rounded-sm bg-white flex flex-col overflow-hidden transition-all duration-200 h-full ${glowClasses[glow]} ${className}`}
    >
      {/* Tactical Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-sm font-bold text-slate-800 tracking-wide font-sans flex items-center gap-2">
              {title}
            </h3>
            {tier && <StatusPill tier={tier} label={badgeLabel} size="sm" />}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 font-mono tracking-tight">{subtitle}</p>
          )}
        </div>
        {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">{children}</div>
    </div>
  );
};
