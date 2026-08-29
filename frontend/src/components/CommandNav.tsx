import React from 'react';
import {
  LayoutGrid,
  Eye,
  MapPin,
  ShieldAlert,
  Sparkles,
  Radio,
  Sliders,
  FileText,
} from 'lucide-react';

export type ViewMode = 'overview' | 'vision' | 'geospatial' | 'advisory';

interface CommandNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  detectionCount?: number;
  stormCategory?: string;
  alertLevel?: string;
}

export const CommandNav: React.FC<CommandNavProps> = ({
  currentView,
  onViewChange,
  detectionCount = 1,
  stormCategory = 'VSCS',
  alertLevel = 'RED',
}) => {
  const views: { id: ViewMode; label: string; subLabel: string; icon: React.ElementType; badge?: string; badgeColor?: string }[] = [
    {
      id: 'overview',
      label: 'Command Overview',
      subLabel: 'Executive 4-Panel Grid',
      icon: LayoutGrid,
      badge: 'LIVE FEEDS',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 'vision',
      label: 'Vision AI Inspector',
      subLabel: '640×640 YOLO11 Multi-Spectral',
      icon: Eye,
      badge: `${detectionCount} CYCLONE DETECTED`,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 'geospatial',
      label: 'Geospatial Radar & Telemetry',
      subLabel: 'IBTrACS Track & Dvorak Scale',
      icon: MapPin,
      badge: stormCategory,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      id: 'advisory',
      label: 'Disaster Response SOP',
      subLabel: 'NDRF, Ports & Public Safety',
      icon: ShieldAlert,
      badge: `${alertLevel} ALERT`,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[61px] z-30 px-4 py-2">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Mode Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive = currentView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => onViewChange(v.id)}
                className={`group relative flex items-center gap-3 px-4 py-2 rounded-none text-left transition-all duration-200 border-b-2 ${
                  isActive
                    ? 'bg-slate-50 border-slate-800 text-slate-900'
                    : 'bg-white border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`p-1.5 transition-colors ${
                    isActive
                      ? 'text-slate-800'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-sans ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {v.label}
                    </span>
                    {v.badge && (
                      <span className={`px-1.5 py-0.5 text-[11px] font-mono font-bold rounded border ${v.badgeColor}`}>
                        {v.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{v.subLabel}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Operational Metrics HUD */}
        <div className="hidden lg:flex items-center gap-4 bg-white px-3 py-1.5 border border-slate-300 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-800 font-semibold uppercase">Basin Radar:</span>
            <span className="text-slate-600 font-medium">Active</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-800 font-semibold uppercase">AI Model:</span>
            <span className="text-slate-600 font-medium">YOLO11 v1.0</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-800 font-semibold uppercase">Feed:</span>
            <span className="text-slate-600 font-medium">INSAT-3D TIR-1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
