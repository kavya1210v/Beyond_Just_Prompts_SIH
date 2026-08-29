import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Grid,
  Crosshair,
  Layers,
  Eye,
  Camera,
  Maximize2,
  Loader2,
  ScanSearch,
} from 'lucide-react';
import { YOLODetectionResponse } from '../../types/cyclone';
import { SpectralBand } from '../../utils/satelliteCanvas';
import { YoloBoundingBoxOverlay } from './YoloBoundingBoxOverlay';

interface SatelliteViewerProps {
  imageSrc: string;
  imageName: string;
  detection: YOLODetectionResponse | null;
  confidenceThreshold: number;
  selectedBand: SpectralBand;
  onBandChange: (band: SpectralBand) => void;
  showBBox: boolean;
  onToggleBBox: () => void;
  isLoading?: boolean;
}

export const SatelliteViewer: React.FC<SatelliteViewerProps> = ({
  imageSrc,
  imageName,
  detection,
  confidenceThreshold,
  selectedBand,
  onBandChange,
  showBBox,
  onToggleBBox,
  isLoading = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(640, Math.round(((e.clientX - rect.left) / rect.width) * 640)));
    const y = Math.max(0, Math.min(640, Math.round(((e.clientY - rect.top) / rect.height) * 640)));
    setCursorPos({ x, y });
  };

  const handleMouseLeave = () => {
    setCursorPos(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Top Toolbar: View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-none bg-white border border-slate-300">
        {/* Title / Info (replaces channels) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-slate-500 font-semibold uppercase mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" /> Preloaded Model Sample
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* BBox Toggle */}
          <button
            onClick={onToggleBBox}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-none transition-all ${
              showBBox
                ? 'bg-slate-100 text-slate-800 border border-slate-400 shadow-sm'
                : 'bg-white text-slate-500 border border-slate-300 hover:bg-slate-50'
            }`}
            title="Toggle YOLO Bounding Box Overlay"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>YOLO Box: {showBBox ? 'ON' : 'OFF'}</span>
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-none transition-all border ${
              showGrid
                ? 'bg-slate-100 text-slate-800 border-slate-400 shadow-sm'
                : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-300'
            }`}
            title="Toggle 64x64 Pixel Coordinate Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-white rounded-none p-1 border border-slate-300">
            <button
              onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
              className="p-1 rounded-none text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-800 min-w-[36px] text-center font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              className="p-1 rounded-none text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 640x640 Interactive Canvas Container */}
      <div className="relative flex items-center justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden shadow-inner min-h-[440px]">
        {/* Scale container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
            width: '640px',
            height: '640px',
          }}
          className="relative max-w-full aspect-square cursor-crosshair select-none bg-slate-950 rounded-xl overflow-hidden border border-cyan-900/40 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
        >
          {imageSrc ? (
            <>
              {/* Base Satellite Image (640x640) */}
              <img
                src={imageSrc}
                alt="Satellite Frame"
                className="w-full h-full object-cover pointer-events-none"
                style={{ imageRendering: 'crisp-edges' }}
              />

              {/* Optional Coordinate Pixel Grid */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                  }}
                />
              )}

              {/* YOLO11 Bounding-Box Overlay */}
              {showBBox && detection && (
                <YoloBoundingBoxOverlay
                  detection={detection}
                  confidenceThreshold={confidenceThreshold}
                />
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm text-cyan-400">
                  <ScanSearch className="w-16 h-16 mb-4 animate-pulse" />
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-mono text-sm font-semibold tracking-widest uppercase shadow-black drop-shadow-md">Analyzing Telemetry...</span>
                  </div>
                </div>
              )}

              {/* Bottom HUD Bar on image */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-2.5 rounded-none bg-white/95 backdrop-blur-md border border-slate-300 text-sm font-sans pointer-events-none shadow-lg">
                <div className="flex items-center gap-2 text-slate-800">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span className="truncate max-w-[200px] font-semibold">{imageName}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-900 font-bold font-mono text-xs">640×640 px</span>
                </div>

                {/* Live Pixel Coordinate Inspector */}
                <div className="flex items-center gap-2 text-slate-600 font-mono text-xs">
                  <Crosshair className="w-4 h-4 text-slate-500" />
                  {cursorPos ? (
                    <span className="text-slate-900 font-bold">
                      X: {cursorPos.x}px | Y: {cursorPos.y}px
                    </span>
                  ) : (
                    <span className="text-slate-500">Hover frame to inspect px</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
              <Camera className="w-16 h-16 mb-4 opacity-40 text-slate-400" />
              <span className="font-mono text-sm font-semibold tracking-wider uppercase">No Frame Uploaded</span>
              <span className="font-mono text-xs mt-1">Select a sample or upload imagery</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
