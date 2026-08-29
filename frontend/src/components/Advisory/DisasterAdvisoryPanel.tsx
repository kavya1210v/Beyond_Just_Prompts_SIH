import React from 'react';
import { AdvisoryResponse } from '../../types/cyclone';
import {
  ShieldAlert,
  Anchor,
  Fish,
  Building2,
  Users,
  Bot,
  CheckCircle2,
} from 'lucide-react';

interface DisasterAdvisoryPanelProps {
  advisory: AdvisoryResponse;
}

export const DisasterAdvisoryPanel: React.FC<DisasterAdvisoryPanelProps> = ({ advisory }) => {
  const alertColors = {
    RED: 'bg-red-50 border-red-200 text-red-900',
    ORANGE: 'bg-amber-50 border-amber-200 text-amber-900',
    YELLOW: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    GREEN: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  };

  const alertBadgeColors = {
    RED: 'bg-red-600 text-white',
    ORANGE: 'bg-amber-500 text-white',
    YELLOW: 'bg-yellow-400 text-slate-900',
    GREEN: 'bg-emerald-500 text-white',
  };

  const sections = [
    { id: 'ndrf', label: 'NDRF & SDMA Mobilization', icon: ShieldAlert, items: advisory.stakeholder_actions.ndrf_sdma, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'marine', label: 'Marine & Fisheries', icon: Fish, items: advisory.stakeholder_actions.marine_fisheries, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'ports', label: 'Port Authorities', icon: Anchor, items: advisory.stakeholder_actions.port_authorities, color: 'text-slate-700', bg: 'bg-slate-100' },
    { id: 'admin', label: 'District Administration', icon: Building2, items: advisory.stakeholder_actions.district_administration, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'public', label: 'Public Safety', icon: Users, items: advisory.stakeholder_actions.public_safety, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="flex flex-col gap-5 h-full max-h-[800px]">
      {/* Alert Header Box */}
      <div className={`p-5 rounded-xl border flex flex-col gap-3 shadow-sm ${alertColors[advisory.alert_level]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-widest opacity-80">
            <Bot className="w-5 h-5" />
            <span>AI Disaster-Response Briefing</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm uppercase tracking-wider ${alertBadgeColors[advisory.alert_level]}`}>
            {advisory.alert_level} WARNING
          </span>
        </div>
        <h4 className="text-lg font-black font-sans leading-tight mt-1">{advisory.headline}</h4>
        <p className="text-sm font-sans leading-relaxed whitespace-pre-line opacity-90 border-t border-black/10 pt-3 mt-1">
          {advisory.risk_assessment}
        </p>
      </div>

      {/* Actionable SOP Checklist Items - Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              {/* Section Header */}
              <div className={`flex items-center gap-3 px-4 py-3 border-b border-slate-200 ${section.bg}`}>
                <div className={`p-2 rounded-lg bg-white shadow-sm ${section.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-800 text-sm tracking-wide">{section.label}</h5>
                <span className="ml-auto text-xs font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-200">
                  {section.items.length} SOPs
                </span>
              </div>
              
              {/* Section Items */}
              <ul className="flex flex-col px-4 py-3 gap-3">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-700 font-sans leading-relaxed group">
                    <CheckCircle2 className={`flex-shrink-0 w-5 h-5 mt-0.5 transition-colors ${section.color} opacity-70 group-hover:opacity-100`} />
                    <span className="whitespace-pre-line">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

