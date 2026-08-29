import React, { useRef } from 'react';
import {
  UploadCloud,
  Sliders,
  Play,
  FileCode,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { YOLODetectionResponse } from '../../types/cyclone';

interface InferenceControlsProps {
  detection: YOLODetectionResponse | null;
  confidenceThreshold: number;
  onThresholdChange: (val: number) => void;
  onSelectSample: (sampleKey: 'positive_1' | 'positive_2' | 'negative_1' | 'negative_2') => void;
  activeSampleKey: string;
  onFileUpload: (file: File) => void;
  onRunInference: () => void;
  isLoading: boolean;
  onOpenJsonModal: () => void;
}

export const InferenceControls: React.FC<InferenceControlsProps> = ({
  detection,
  confidenceThreshold,
  onThresholdChange,
  onSelectSample,
  activeSampleKey,
  onFileUpload,
  onRunInference,
  isLoading,
  onOpenJsonModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const isDetected = detection && detection.cyclone_detected && detection.detections.some((d) => d.confidence >= confidenceThreshold);
  const highestConf = detection?.detections.reduce((max, d) => Math.max(max, d.confidence), 0) || 0;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Real-time Detection Status Banner */}
      <div
        className={`p-3.5 rounded-none border flex items-center justify-between transition-all ${
          isDetected
            ? 'bg-emerald-50 border-emerald-300 shadow-sm'
            : 'bg-slate-50 border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isDetected ? (
            <div className="w-9 h-9 rounded-none bg-emerald-100 border border-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-none bg-slate-100 border border-slate-300 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500">YOLO11 Detection State:</span>
              <span
                className={`px-2 py-0.5 rounded-none text-xs font-mono font-bold ${
                  isDetected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDetected ? 'CYCLONE DETECTED' : 'NO CYCLONE DETECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              {isDetected
                ? `1 Vortex instance detected with confidence ${Math.round(highestConf * 1000) / 10}%`
                : 'No spiral vortex detected exceeding current confidence threshold.'}
            </p>
          </div>
        </div>

        {/* Inference Latency */}
        <div className="hidden sm:flex flex-col items-end text-xs font-mono text-slate-500">
          <span className="text-slate-500">Inference Latency:</span>
          <span className="text-slate-800 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {detection ? `${detection.model_meta.latency_ms} ms` : '—'}
          </span>
        </div>
      </div>

      {/* 2. Confidence Threshold Slider */}
      <div className="p-3 rounded-none bg-slate-50 border border-slate-300 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-700 flex items-center gap-1.5 font-semibold">
            <Sliders className="w-3.5 h-3.5 text-slate-500" /> Confidence Threshold Filter:
          </span>
          <span className="px-2 py-0.5 rounded-none bg-slate-800 text-white font-bold border border-slate-700">
            {Math.round(confidenceThreshold * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.10"
          max="0.95"
          step="0.05"
          value={confidenceThreshold}
          onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-800"
        />
        <div className="flex justify-between text-xs font-mono text-slate-500">
          <span>10% (High Recall)</span>
          <span>50% (Standard)</span>
          <span>95% (High Precision)</span>
        </div>
      </div>

      {/* 3. Sample Frame Selector & Image Upload */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono text-slate-600 font-semibold flex items-center justify-between">
          <span>Select Test Dataset Frame or Upload Custom 640×640:</span>
        </span>

        {/* Sample Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onSelectSample('positive_1')}
            className={`p-2 rounded-none border text-left flex flex-col gap-1 transition-all ${
              activeSampleKey === 'positive_1'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="text-xs font-mono font-bold text-emerald-700">POS-1: BOB VORTEX</span>
            <span className="text-xs text-slate-500">Spiral Arm Convection</span>
          </button>

          <button
            onClick={() => onSelectSample('positive_2')}
            className={`p-2 rounded-none border text-left flex flex-col gap-1 transition-all ${
              activeSampleKey === 'positive_2'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="text-xs font-mono font-bold text-emerald-700">POS-2: AS DENSE CORE</span>
            <span className="text-xs text-slate-500">Intense Central Cloud Mass</span>
          </button>

          <button
            onClick={() => onSelectSample('negative_1')}
            className={`p-2 rounded-none border text-left flex flex-col gap-1 transition-all ${
              activeSampleKey === 'negative_1'
                ? 'bg-amber-50 border-amber-400 text-amber-900'
                : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="text-xs font-mono font-bold text-amber-700">NEG-1: CLEAR SEA</span>
            <span className="text-xs text-slate-500">Scattered Cumulus (No Vortex)</span>
          </button>

          <button
            onClick={() => onSelectSample('negative_2')}
            className={`p-2 rounded-none border text-left flex flex-col gap-1 transition-all ${
              activeSampleKey === 'negative_2'
                ? 'bg-amber-50 border-amber-400 text-amber-900'
                : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="text-xs font-mono font-bold text-amber-700">NEG-2: MONSOON BAND</span>
            <span className="text-xs text-slate-500">Linear Non-rotating Cloud</span>
          </button>
        </div>

        {/* Upload Custom Image Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mt-1 p-3 rounded-none border border-dashed border-slate-400 hover:border-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-white border border-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UploadCloud className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-mono font-semibold text-slate-800">
                Upload Custom Satellite Frame (JPG / PNG)
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Auto-scaled to 640×640 px for direct YOLO11 tensor inference
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono rounded-none bg-white text-slate-600 border border-slate-300 group-hover:bg-slate-800 group-hover:text-white font-bold transition-colors">
            Browse
          </span>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onRunInference}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-none bg-slate-900 hover:bg-slate-800 text-white font-bold font-mono text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>RUNNING YOLO11 INFERENCE...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-white" />
              <span>RUN YOLO11 DETECTION</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenJsonModal}
          className="flex items-center gap-1.5 py-2.5 px-3 rounded-none bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-mono text-xs transition-colors"
          title="Inspect Raw YOLO11 JSON Payload"
        >
          <FileCode className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Raw Output JSON</span>
        </button>
      </div>
    </div>
  );
};
