import React from 'react';
import { X, Layers, TrendingUp, Navigation, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { StatusPill } from '../Common/StatusPill';

interface PhaseIIRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhaseIIRoadmapModal: React.FC<PhaseIIRoadmapModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-none bg-white border border-slate-300 shadow-2xl flex flex-col text-slate-800 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-300 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-slate-100 border border-slate-300 text-slate-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Phase II Development Roadmap
                </h3>
                <StatusPill tier="phase2" size="sm" />
              </div>
              <p className="text-xs text-slate-600 font-mono">
                Temporal Sequence Modeling, Trajectory & Landfall Uncertainty Prediction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {/* Note Box */}
          <div className="p-3.5 rounded-none bg-slate-50 border border-slate-300 text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-slate-800" />
              Phase II Architectural Scope & Boundaries
            </p>
            As specified in the MVP design, trajectory forecasting and landfall prediction are part of Phase II.
            The dashboard architecture has reserved modular hooks so that temporal model outputs can plug directly into the GIS map layer without refactoring the current YOLO detection pipeline.
          </div>

          {/* Planned Phase II Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Module 1 */}
            <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold font-mono text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>1. Multi-Frame Temporal Sequence Model</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Ingests consecutive INSAT-3D/3DR satellite frames across T-12h to T-0h using ConvLSTM / Video Vision Transformers to learn vortex rotational velocity and steering atmospheric currents.
              </p>
            </div>

            {/* Module 2 */}
            <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold font-mono text-xs">
                <Navigation className="w-4 h-4" />
                <span>2. 24h/48h/72h Track Forecasting</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Predicts future storm center coordinates (Lat/Lon) at 6-hour intervals, rendered dynamically as a forward projection on the maritime GIS map.
              </p>
            </div>

            {/* Module 3 */}
            <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold font-mono text-xs">
                <MapPin className="w-4 h-4" />
                <span>3. Landfall Point & Timing Estimation</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Calculates intersection of forecast track with coastal geometries in Odisha, West Bengal, Andhra Pradesh, Gujarat, or Maharashtra, with estimated time of arrival (ETA ±3h).
              </p>
            </div>

            {/* Module 4 */}
            <div className="p-3.5 rounded-none bg-white border border-slate-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold font-mono text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>4. Probabilistic Cone of Uncertainty</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Renders expanding error swath (standard deviation ellipse) representing spatial forecast uncertainty across lead times for disaster authorities.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-300 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-none bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition-colors"
          >
            Acknowledge Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
