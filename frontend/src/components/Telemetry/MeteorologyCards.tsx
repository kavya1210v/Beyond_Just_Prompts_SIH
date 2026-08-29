import React from 'react';
import { MeteorologicalGroundTruth } from '../../types/cyclone';
import { Wind, Gauge, ArrowUpRight, Compass, Zap } from 'lucide-react';

interface MeteorologyCardsProps {
  meteorology: MeteorologicalGroundTruth;
}

export const MeteorologyCards: React.FC<MeteorologyCardsProps> = ({ meteorology }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Max Sustained Wind */}
      <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-mono font-semibold uppercase">Max Sustained Wind</span>
          <Wind className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-sans text-slate-900">
              {meteorology.max_sustained_wind_kmh}
            </span>
            <span className="text-xs font-mono text-slate-500">km/h</span>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            {meteorology.max_sustained_wind_kts} kts (3-min avg)
          </p>
        </div>
      </div>

      {/* 2. Central Pressure */}
      <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-mono font-semibold uppercase">Central Pressure</span>
          <Gauge className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-sans text-slate-900">
              {meteorology.central_pressure_hpa}
            </span>
            <span className="text-xs font-mono text-slate-500">hPa</span>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Deficit: -{meteorology.pressure_deficit_hpa} hPa
          </p>
        </div>
      </div>

      {/* 3. Peak Gusts */}
      <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-mono font-semibold uppercase">Peak Gusts</span>
          <Zap className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-sans text-slate-900">
              {meteorology.gusts_kmh}
            </span>
            <span className="text-xs font-mono text-slate-500">km/h</span>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Gale force radius: {meteorology.estimated_radius_max_wind_km} km
          </p>
        </div>
      </div>

      {/* 4. Movement & Heading */}
      <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-mono font-semibold uppercase">Translation Speed</span>
          <Compass className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-sans text-slate-900">
              {meteorology.movement_speed_kmh}
            </span>
            <span className="text-xs font-mono text-slate-500">km/h</span>
          </div>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            Heading: <span className="text-slate-800 font-bold">{meteorology.movement_heading}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
