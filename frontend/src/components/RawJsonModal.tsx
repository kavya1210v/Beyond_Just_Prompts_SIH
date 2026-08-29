import React, { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';
import { YOLODetectionResponse } from '../types/cyclone';

interface RawJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  detection: YOLODetectionResponse | null;
}

export const RawJsonModal: React.FC<RawJsonModalProps> = ({
  isOpen,
  onClose,
  detection,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(detection, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-none bg-white border border-slate-300 shadow-2xl flex flex-col font-mono text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Raw YOLO11 Inference JSON Output
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-none border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-slate-800 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 bg-white text-xs">
          <pre className="text-slate-800 font-mono select-all leading-relaxed">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Strict YOLO11 Payload (Coordinates [x1, y1, x2, y2] + Confidence)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-none bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
