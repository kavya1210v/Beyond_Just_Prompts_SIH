import React from 'react';
import { X, Cpu, CheckCircle2, ArrowRight, FolderPlus, Sparkles, Terminal } from 'lucide-react';

interface ModelIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelIntegrationModal: React.FC<ModelIntegrationModalProps> = ({
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
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                YOLO11 Model Integration Spec
              </h3>
              <p className="text-xs text-slate-600 font-mono">
                Guide for plugging in trained <code className="text-slate-800 bg-slate-100 px-1 rounded">best.pt</code> weights
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
        <div className="p-5 flex flex-col gap-4 text-xs font-sans">
          {/* Summary Box */}
          <div className="p-3.5 rounded-none bg-slate-50 border border-slate-300 text-slate-700 leading-relaxed">
            <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-slate-800" />
              Decoupled Architecture Verification
            </p>
            The dashboard frontend is already 100% compliant with your YOLO11 model schema.
            When your teammate provides the trained PyTorch weights file, drop it into the designated backend folder.
            The FastAPI backend will automatically switch from simulation to live GPU/CPU inference without modifying a single line of frontend code.
          </div>

          {/* 3 Step Guide */}
          <div className="flex flex-col gap-3">
            <h4 className="font-mono font-bold text-slate-700 uppercase tracking-wider text-xs">
              How to Deploy Trained Weights:
            </h4>

            {/* Step 1 */}
            <div className="p-3 rounded-none bg-white border border-slate-300 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-bold text-slate-900">Place model weights in the backend folder</p>
                <p className="text-slate-600 font-mono mt-0.5 text-xs">
                  Copy your trained checkpoint to:
                </p>
                <div className="mt-1.5 p-2 rounded bg-slate-100 border border-slate-300 font-mono text-slate-800 text-xs select-all flex items-center gap-1.5">
                  <FolderPlus className="w-3.5 h-3.5 text-slate-800" />
                  <span>cyclone-ai-dashboard/backend/weights/best.pt</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-none bg-white border border-slate-300 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
                2
              </span>
              <div>
                <p className="font-bold text-slate-900">Ensure Ultralytics is installed in Python environment</p>
                <div className="mt-1.5 p-2 rounded bg-white border border-slate-300 font-mono text-slate-700 text-xs select-all flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-800" />
                  <span>pip install ultralytics</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-none bg-white border border-slate-300 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
                3
              </span>
              <div>
                <p className="font-bold text-slate-900">Restart FastAPI backend</p>
                <p className="text-slate-600 mt-0.5">
                  FastAPI service will automatically detect <code className="text-slate-800 bg-slate-100 px-1 rounded">weights/best.pt</code> on boot and activate live model inference.
                </p>
              </div>
            </div>
          </div>

          {/* Model Contract Table */}
          <div className="p-3 rounded-none bg-white border border-slate-300 flex flex-col gap-2">
            <h4 className="font-mono font-bold text-slate-700 uppercase tracking-wider text-xs">
              YOLO11 Input / Output Contract:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-white border border-slate-300">
                <span className="text-slate-600 block">Input Tensor:</span>
                <span className="text-slate-900 font-bold">640 × 640 × 3 RGB</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-300">
                <span className="text-slate-600 block">Output Format:</span>
                <span className="text-slate-900 font-bold">[x1, y1, x2, y2] + conf</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-300 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-none bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition-colors"
          >
            Close Integration Guide
          </button>
        </div>
      </div>
    </div>
  );
};
