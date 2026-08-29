import React, { useState } from 'react';
import { GlassCard } from '../Common/GlassCard';
import { Bot, Calculator, AlertTriangle, Wind, Gauge, MapPin, Search } from 'lucide-react';
import { classifyCyclone } from '../../services/api';
import { ClassificationRequest, ClassificationResponse } from '../../types/cyclone';

export const ClassificationModule: React.FC = () => {
  const [formData, setFormData] = useState<ClassificationRequest>({
    lat: 18.6,
    lon: 87.8,
    pressure: 974.0,
    wind: 75.0,
    pressure_drop: 26.0,
    ci_no: 4.5,
    step: 12,
    basin_ARB: 0,
    basin_BOB: 1,
    basin_LAND: 0,
  });

  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    setError(null);
    try {
      const res = await classifyCyclone(formData);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <GlassCard
      title="Meteorological AI Classifier"
      subtitle="XGBoost Ensemble Model • Real-time Category Prediction"
      tier="implemented"
      badgeLabel="ML PIPELINE"
      glow="cyan"
      headerAction={
        <button
          onClick={handlePredict}
          disabled={isPredicting}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isPredicting ? (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          ) : (
            <Calculator className="w-3.5 h-3.5" />
          )}
          <span>Predict Category</span>
        </button>
      }
    >
      <div className="flex flex-col gap-5 p-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> Latitude</label>
            <input type="number" name="lat" value={formData.lat} onChange={handleInputChange} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> Longitude</label>
            <input type="number" name="lon" value={formData.lon} onChange={handleInputChange} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1"><Gauge className="w-3 h-3"/> Pressure (hPa)</label>
            <input type="number" name="pressure" value={formData.pressure} onChange={handleInputChange} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1"><Wind className="w-3 h-3"/> Wind (kts)</label>
            <input type="number" name="wind" value={formData.wind} onChange={handleInputChange} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1"><Gauge className="w-3 h-3"/> P. Drop (hPa)</label>
            <input type="number" name="pressure_drop" value={formData.pressure_drop} onChange={handleInputChange} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1"><Search className="w-3 h-3"/> CI No.</label>
            <input type="number" name="ci_no" value={formData.ci_no} onChange={handleInputChange} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1"><Search className="w-3 h-3"/> Basin</label>
            <select
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const val = e.target.value;
                setFormData(p => ({
                  ...p,
                  basin_ARB: val === 'ARB' ? 1 : 0,
                  basin_BOB: val === 'BOB' ? 1 : 0,
                  basin_LAND: val === 'LAND' ? 1 : 0,
                }));
              }}
            >
              <option value="BOB">Bay of Bengal</option>
              <option value="ARB">Arabian Sea</option>
              <option value="LAND">Land</option>
            </select>
          </div>
        </div>

        {/* Results Panel */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {result && !error && (
          <div className="mt-2 p-5 rounded-xl border flex flex-col gap-2 relative overflow-hidden" style={{ backgroundColor: result.imd_info.color_hex + '15', borderColor: result.imd_info.color_hex + '40' }}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot className="w-24 h-24" style={{ color: result.imd_info.color_hex }} />
            </div>
            <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-widest opacity-70">
              <Bot className="w-4 h-4" />
              <span>XGBoost Prediction Result</span>
            </div>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-4xl font-black font-mono tracking-tighter" style={{ color: result.imd_info.color_hex }}>
                {result.predicted_category}
              </span>
              <span className="text-lg font-bold text-slate-700 pb-1">{result.imd_info.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/60 rounded-full border border-black/5">
                <Wind className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700 font-semibold">{result.imd_info.wind_speed_range_kmh}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/60 rounded-full border border-black/5">
                <span className="text-slate-500 uppercase text-xs font-bold">Confidence:</span>
                <span className="text-slate-800 font-black">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
