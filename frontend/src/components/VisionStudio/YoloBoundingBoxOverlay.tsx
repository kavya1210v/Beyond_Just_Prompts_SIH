import React from 'react';
import { YOLODetectionResponse } from '../../types/cyclone';
import { Target, CheckCircle2, XCircle } from 'lucide-react';

interface YoloBoundingBoxOverlayProps {
  detection: YOLODetectionResponse;
  confidenceThreshold: number;
}

export const YoloBoundingBoxOverlay: React.FC<YoloBoundingBoxOverlayProps> = ({
  detection,
  confidenceThreshold,
}) => {
  const { cyclone_detected, detections } = detection;

  // Filter detections by threshold
  const activeDetections = detections.filter((d) => d.confidence >= confidenceThreshold);

  if (!cyclone_detected || activeDetections.length === 0) {
    return (
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="flex items-center gap-2 px-5 py-3 rounded-none bg-white/95 backdrop-blur-md border border-slate-300 text-slate-800 font-sans text-sm shadow-xl">
          <XCircle className="w-5 h-5 text-slate-500" />
          <span className="font-bold text-slate-900">NO CYCLONE DETECTED</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 text-xs font-mono">Conf &lt; {Math.round(confidenceThreshold * 100)}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {activeDetections.map((det, idx) => {
        const { x1, y1, x2, y2 } = det.bbox_pixel;
        const width = x2 - x1;
        const height = y2 - y1;
        const confPercent = Math.round(det.confidence * 1000) / 10;
        const centerPxX = x1 + width / 2;
        const centerPxY = y1 + height / 2;

        return (
          <div key={idx} className="absolute inset-0">
            {/* Primary Bounding Box */}
            <div
              style={{
                left: `${(x1 / 640) * 100}%`,
                top: `${(y1 / 640) * 100}%`,
                width: `${(width / 640) * 100}%`,
                height: `${(height / 640) * 100}%`,
              }}
              className="absolute border-[3px] border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)] transition-all duration-150"
            >
              {/* Tactical Corner Brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-yellow-500" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-yellow-500" />
              <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-yellow-500" />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-yellow-500" />

              {/* Bounding Box Label Tag */}
              <div className="absolute -top-10 left-0 flex items-center gap-2 px-3 py-1.5 rounded-none bg-white/95 border border-slate-300 text-slate-900 font-sans text-sm font-bold shadow-lg whitespace-nowrap">
                <Target className="w-4 h-4 text-slate-600" />
                <span>YOLO11: {det.class_name.toUpperCase()}</span>
                <span className="text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded-sm font-mono text-xs">
                  {confPercent}%
                </span>
              </div>

              {/* Pixel Coordinates HUD */}
              <div className="absolute -bottom-8 right-0 px-2 py-1 rounded-none bg-white/95 border border-slate-300 text-slate-700 font-mono text-xs whitespace-nowrap shadow-sm">
                BBox: [{Math.round(x1)}, {Math.round(y1)}, {Math.round(x2)}, {Math.round(y2)}]
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
