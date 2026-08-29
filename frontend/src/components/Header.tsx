import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Globe2,
} from 'lucide-react';

interface HeaderProps {
  activeScenario: string;
  onScenarioChange: (scenario: string) => void;
  onOpenIntegrationModal: () => void;
  onOpenPhaseIIModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScenario,
  onScenarioChange,
  onOpenIntegrationModal,
  onOpenPhaseIIModal,
}) => {
  const [timeUtc, setTimeUtc] = useState('');
  const [timeIst, setTimeIst] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      setTimeIst(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Official Authority Emblem & Agency Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 border border-slate-300 bg-white">
            <Radio className="w-5 h-5 text-slate-700" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-1.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                SIH-26070 DEMO
              </span>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight font-sans flex items-center gap-1.5">
                NATIONAL CYCLONE VISION AI
              </h1>
              <span className="text-xs text-slate-300 hidden sm:inline">|</span>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
                <ShieldCheck className="w-3 h-3 text-slate-500" />
                <span>SYSTEM ONLINE</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
              <span>National Tropical Cyclone Identification & Early Warning System</span>
              <span className="text-slate-300 hidden md:inline">•</span>
              <span className="text-slate-500 hidden md:inline">IMD / SDMA Operational Authority Protocol</span>
            </p>
          </div>
        </div>

        {/* Right Controls: Clocks, Modals */}
        <div className="flex items-center gap-3">
          {/* Active Storm Scenario Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-300 text-xs">
            <Globe2 className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 text-xs font-semibold uppercase">Basin:</span>
            <select
              value={activeScenario}
              onChange={(e) => onScenarioChange(e.target.value)}
              className="bg-white text-slate-800 text-xs focus:outline-none cursor-pointer border-none"
            >
              <option value="remal_bob" className="bg-white text-slate-700">
                Cyclone Remal (Bay of Bengal)
              </option>
              <option value="biparjoy_as" className="bg-white text-slate-700">
                Cyclone Biparjoy (Arabian Sea)
              </option>
            </select>
          </div>

          {/* Dual Clocks (UTC & IST) */}
          <div className="hidden md:flex flex-col items-end text-xs bg-white px-3 py-1 border border-slate-300">
            <span className="text-slate-800 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> {timeUtc}
            </span>
            <span className="text-slate-500 text-[11px]">{timeIst}</span>
          </div>

          {/* YOLO Integration Spec Modal Button */}
          <button
            onClick={onOpenIntegrationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all"
            title="View YOLO11 weights integration spec for ML teammate"
          >
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">YOLO Specs</span>
          </button>

          {/* Phase II Roadmap Blueprint Modal Button */}
          <button
            onClick={onOpenPhaseIIModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all"
            title="View Phase II Trajectory & Landfall Roadmap"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Phase II Blueprint</span>
          </button>
        </div>
      </div>
    </header>
  );
};
