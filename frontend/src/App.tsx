import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandNav, ViewMode } from './components/CommandNav';
import { GlassCard } from './components/Common/GlassCard';
import { SatelliteViewer } from './components/VisionStudio/SatelliteViewer';
import { InferenceControls } from './components/VisionStudio/InferenceControls';
import { MaritimeMap } from './components/GeoMap/MaritimeMap';
import { MeteorologyCards } from './components/Telemetry/MeteorologyCards';
import { PressureWindChart } from './components/Telemetry/PressureWindChart';
import { IntensityBadge } from './components/Telemetry/IntensityBadge';
import { DisasterAdvisoryPanel } from './components/Advisory/DisasterAdvisoryPanel';
import { ClassificationModule } from './components/Classification/ClassificationModule';

import { ModelIntegrationModal } from './components/ModelIntegrationModal';
import { RawJsonModal } from './components/RawJsonModal';
import { PhaseIIRoadmapModal } from './components/PhaseII/PhaseIIRoadmapModal';

import {
  YOLODetectionResponse,
  CycloneMetadataResponse,
  AdvisoryResponse,
} from './types/cyclone';
import {
  detectCycloneFromImage,
  fetchCurrentCycloneMetadata,
  fetchDisasterAdvisory,
} from './services/api';
import {
  generateSampleSatelliteFrame,
  SpectralBand,
} from './utils/satelliteCanvas';
import {
  Cpu,
  FileCode,
  Layers,
  Activity,
  ShieldAlert,
  MapPin,
  Eye,
  Sliders,
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & View Mode
  const [currentView, setCurrentView] = useState<ViewMode>('overview');

  // Active Scenario & Satellite Frame state
  const [activeScenario, setActiveScenario] = useState<string>('remal_bob');
  const [selectedBand, setSelectedBand] = useState<SpectralBand>('TIR1');
  const [activeSampleKey, setActiveSampleKey] = useState<'positive_1' | 'positive_2' | 'negative_1' | 'negative_2'>('positive_1');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageName, setImageName] = useState<string>('sample_cyclone_positive_1.png');
  const [showBBox, setShowBBox] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.10);

  // API Data states
  const [detection, setDetection] = useState<YOLODetectionResponse | null>(null);
  const [isLoadingInference, setIsLoadingInference] = useState<boolean>(false);
  const [cycloneMeta, setCycloneMeta] = useState<CycloneMetadataResponse | null>(null);
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null);

  // Modals
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState<boolean>(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isPhaseIIModalOpen, setIsPhaseIIModalOpen] = useState<boolean>(false);

  // Fetch Cyclone Metadata & Advisory whenever Scenario changes
  useEffect(() => {
    let isMounted = true;
    const loadScenarioData = async () => {
      try {
        const meta = await fetchCurrentCycloneMetadata(activeScenario);
        if (isMounted) {
          setCycloneMeta(meta);
        }
      } catch (err) {
        console.error('Scenario fetch error:', err);
      }
    };

    loadScenarioData();

    if (activeScenario === 'biparjoy_as') {
      setActiveSampleKey('positive_2');
      setImageName('insat3d_cyclone_biparjoy_arabian_sea_640x640.png');
    } else {
      setActiveSampleKey('positive_1');
      setImageName('insat3d_cyclone_remal_bay_of_bengal_640x640.png');
    }

    return () => {
      isMounted = false;
    };
  }, [activeScenario]);

  // No initial image loaded by default
  useEffect(() => {
    // We intentionally leave the image empty until the user selects a sample or uploads one.
  }, []);

  // Run YOLO11 Detection
  const runDetectionOnCurrent = async (
    imgDataUrl: string,
    fname: string,
    threshold: number
  ) => {
    setIsLoadingInference(true);
    setAdvisory(null);
    try {
      const res = await fetch(imgDataUrl);
      const blob = await res.blob();
      const result = await detectCycloneFromImage(blob, threshold, fname);
      setDetection(result);
      
      if (result.cyclone_detected) {
        const adv = await fetchDisasterAdvisory(activeScenario);
        setAdvisory(adv);
      }
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setIsLoadingInference(false);
    }
  };

  const handleSelectSample = (
    key: 'positive_1' | 'positive_2' | 'negative_1' | 'negative_2'
  ) => {
    setActiveSampleKey(key);
    let fname = 'sample_cyclone_positive_1.png';
    if (key === 'positive_2') fname = 'sample_cyclone_positive_2.png';
    if (key === 'negative_1') fname = 'sample_clear_ocean_negative_1.png';
    if (key === 'negative_2') fname = 'sample_monsoon_band_negative_2.png';
    setImageName(fname);
    const dataUrl = `http://127.0.0.1:8000/api/v1/detect/samples/${fname}`;
    setImageSrc(dataUrl);
    runDetectionOnCurrent(dataUrl, fname, confidenceThreshold);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const url = e.target.result as string;
        setImageSrc(url);
        setImageName(file.name);
        runDetectionOnCurrent(url, file.name, confidenceThreshold);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-cyan-200 selection:text-black">
      {/* Master Authority Header */}
      <Header
        activeScenario={activeScenario}
        onScenarioChange={setActiveScenario}
        onOpenIntegrationModal={() => setIsIntegrationModalOpen(true)}
        onOpenPhaseIIModal={() => setIsPhaseIIModalOpen(true)}
      />

      {/* Command View Navigation Bar */}
      <CommandNav
        currentView={currentView}
        onViewChange={setCurrentView}
        detectionCount={detection?.detection_count || 0}
        stormCategory={cycloneMeta?.meteorological_data.imd_category.code || 'VSCS'}
        alertLevel={advisory?.alert_level || 'RED'}
      />

      {/* Alert Banner for Cyclone Detection */}
      {detection?.cyclone_detected && detection.detection_count > 0 && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-red-800 font-bold text-sm uppercase tracking-wide">
                WARNING: Cyclone Detected
              </h3>
              <p className="text-red-600 text-xs mt-0.5">
                AI Vision model has detected a cyclonic formation in the current satellite frame. High confidence.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('advisory')}
            className="px-4 py-1.5 bg-red-600 text-white text-sm font-bold shadow-sm hover:bg-red-700 transition-colors"
          >
            View Advisory SOPs
          </button>
        </div>
      )}

      {/* Main Operational Container */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* ========================================================================= */}
        {/* VIEW 1: UNIFIED COMMAND OVERVIEW (EXECUTIVE 4-PANEL GRID) */}
        {/* ========================================================================= */}
        {currentView === 'overview' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Top Row: Satellite Vision Studio + Geospatial Radar Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Left: Vision AI Satellite Studio */}
              <GlassCard
                title="INSAT-3D Multi-Spectral Frame Inspector"
                subtitle="Real-Time YOLO11 Object Detection • 640×640 Pixel Grid HUD"
                tier="implemented"
                badgeLabel="LIVE MODEL ACTIVE"
                glow="cyan"
                headerAction={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsJsonModalOpen(true)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-none bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      title="Inspect Raw YOLO JSON Output"
                    >
                      <FileCode className="w-3.5 h-3.5 text-slate-500" />
                      <span>JSON payload</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('vision')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-none bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Full Lab</span>
                    </button>
                  </div>
                }
              >
                <SatelliteViewer
                  imageSrc={imageSrc}
                  imageName={imageName}
                  detection={detection}
                  confidenceThreshold={confidenceThreshold}
                  selectedBand={selectedBand}
                  onBandChange={setSelectedBand}
                  showBBox={showBBox}
                  onToggleBBox={() => setShowBBox(!showBBox)}
                  isLoading={isLoadingInference}
                />
              </GlassCard>

              {/* Top Right: Geospatial Track & Maritime Radar Map */}
              <GlassCard
                title="Geospatial Cyclone Track & Maritime Radar"
                subtitle="IBTrACS Ground Truth Feed • Radius of Max Winds Ring • Port Threat Warnings"
                tier="demo"
                badgeLabel="DEMO / SIMULATION FEED"
                glow="amber"
                headerAction={
                  <button
                    onClick={() => setCurrentView('geospatial')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-none bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <span>Expand Radar</span>
                  </button>
                }
              >
                {cycloneMeta ? (
                  <MaritimeMap cycloneMeta={cycloneMeta} />
                ) : (
                  <div className="h-[460px] flex items-center justify-center text-slate-500 font-mono text-xs">
                    Loading Geospatial Map Telemetry...
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Bottom Row: Meteorological Telemetry + AI Disaster Response Briefing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bottom Left: Meteorological Telemetry & Intensity Progression */}
              <GlassCard
                title="Real-Time Cyclone Telemetry & Intensity Meter"
                subtitle="IMD Dvorak T-Number Scale • Pressure-Wind Trend Curve"
                tier="demo"
                badgeLabel="METEOROLOGICAL FEEDS"
                glow="emerald"
              >
                <div className="flex flex-col gap-4">
                  {cycloneMeta && (
                    <>
                      <IntensityBadge category={cycloneMeta.meteorological_data.imd_category} />
                      <MeteorologyCards meteorology={cycloneMeta.meteorological_data} />
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                          <span className="font-semibold text-slate-700">Pressure-Wind Progression:</span>
                          <span className="text-slate-500">Historical Track Curve</span>
                        </div>
                        <PressureWindChart track={cycloneMeta.historical_track} />
                      </div>
                    </>
                  )}
                </div>
              </GlassCard>

              {/* Bottom Right: AI Disaster Advisory Briefing & SOP Checklist */}
              <GlassCard
                title="Automated AI Disaster-Response Command Briefing"
                subtitle="NDRF Deployment Directives • Maritime Port Signals • Stakeholder Action SOPs"
                tier="demo"
                badgeLabel="LLM DECISION ENGINE"
                glow="rose"
                headerAction={
                  <button
                    onClick={() => setCurrentView('advisory')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-none bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
                    <span>Full SOP Matrix</span>
                  </button>
                }
              >
                {advisory ? (
                  <DisasterAdvisoryPanel advisory={advisory} />
                ) : isLoadingInference ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-4 p-6">
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-rose-500 animate-[spin_1s_linear_infinite] absolute"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-b-rose-400 animate-[spin_1.5s_linear_infinite_reverse] absolute"></div>
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-4 text-center">
                      <span className="text-slate-700 font-bold tracking-wider animate-pulse">GENERATING AI RESPONSE BRIEFING...</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Vector Search (RAG)</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div> LLM Inference</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div> Formatting SOPs</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-2 p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <ShieldAlert className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
                    <span className="text-slate-700 font-bold text-sm tracking-widest uppercase">All is Good</span>
                    <span className="text-slate-400 text-center max-w-xs">No active cyclone threats detected in current frame. Awaiting new satellite imagery to generate briefings.</span>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Compact Bottom Testbed Panel */}
            <GlassCard
              title="YOLO11 Cyclone Inference Testbed & Image Ingestion"
              subtitle="Adjust Confidence Threshold • Select Sample Frames • Upload Custom GeoTIFF/PNG Satellite Scans"
              tier="implemented"
              badgeLabel="INFERENCE CONTROLS"
              glow="none"
            >
              <InferenceControls
                detection={detection}
                confidenceThreshold={confidenceThreshold}
                onThresholdChange={(val) => {
                  setConfidenceThreshold(val);
                  if (imageSrc) runDetectionOnCurrent(imageSrc, imageName, val);
                }}
                onSelectSample={handleSelectSample}
                activeSampleKey={activeSampleKey}
                onFileUpload={handleFileUpload}
                onRunInference={() => runDetectionOnCurrent(imageSrc, imageName, confidenceThreshold)}
                isLoading={isLoadingInference}
                onOpenJsonModal={() => setIsJsonModalOpen(true)}
              />
            </GlassCard>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SATELLITE VISION & YOLO11 INSPECTOR LAB */}
        {/* ========================================================================= */}
        {currentView === 'vision' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Left Col: Full-size Frame Inspector (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <GlassCard
                title="Satellite Vision Studio & Multi-Spectral Frame Inspector"
                subtitle="INSAT-3D TIR-1 / WV / GeoColor / Visible Channels • Live Bounding Boxhud"
                tier="implemented"
                badgeLabel="LIVE YOLO11 MODEL ACTIVE"
                glow="cyan"
              >
                <SatelliteViewer
                  imageSrc={imageSrc}
                  imageName={imageName}
                  detection={detection}
                  confidenceThreshold={confidenceThreshold}
                  selectedBand={selectedBand}
                  onBandChange={setSelectedBand}
                  showBBox={showBBox}
                  onToggleBBox={() => setShowBBox(!showBBox)}
                  isLoading={isLoadingInference}
                />
              </GlassCard>
            </div>

            {/* Right Col: Inference Testbed & Model Specs (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <GlassCard
                title="Inference Engine Controls"
                subtitle="Threshold Filtering & Image Ingestion"
                tier="implemented"
                badgeLabel="MODEL TESTBED"
                glow="cyan"
              >
                <InferenceControls
                  detection={detection}
                  confidenceThreshold={confidenceThreshold}
                  onThresholdChange={(val) => {
                    setConfidenceThreshold(val);
                    if (imageSrc) runDetectionOnCurrent(imageSrc, imageName, val);
                  }}
                  onSelectSample={handleSelectSample}
                  activeSampleKey={activeSampleKey}
                  onFileUpload={handleFileUpload}
                  onRunInference={() => runDetectionOnCurrent(imageSrc, imageName, confidenceThreshold)}
                  isLoading={isLoadingInference}
                  onOpenJsonModal={() => setIsJsonModalOpen(true)}
                />
              </GlassCard>

              {/* Spectral Channel Reference Guide */}
              <GlassCard
                title="INSAT-3D Multi-Spectral Channel Specs"
                subtitle="Operational Guidance for Satellite Imagery Analysis"
                tier="implemented"
                glow="none"
              >
                <div className="flex flex-col gap-3 font-mono text-xs text-slate-600">
                  <div className="p-2.5 bg-white border border-slate-300">
                    <span className="text-slate-800 font-bold">TIR-1 (10.8 µm Thermal IR):</span>
                    <p className="text-slate-600 text-xs mt-0.5">Primary channel for day/night cyclone identification. Emphasizes cloud-top temperatures and central eye formation.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-300">
                    <span className="text-slate-800 font-bold">WV (6.7 µm Water Vapor):</span>
                    <p className="text-slate-600 text-xs mt-0.5">Captures mid-to-upper tropospheric moisture flux and synoptic atmospheric steering flows.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-300">
                    <span className="text-slate-800 font-bold">GeoColor Composite:</span>
                    <p className="text-slate-600 text-xs mt-0.5">True-color daytime synthetic imagery combining visible land maps with thermal cloud overlays.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: GEOSPATIAL RADAR & TELEMETRY */}
        {/* ========================================================================= */}
        {currentView === 'geospatial' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Left Col: Expanded Maritime GIS Map (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <GlassCard
                title="Interactive Maritime GIS & Cyclone Track Radar"
                subtitle="IBTrACS Ground Truth Feed • Radius of Max Winds Ring • Port Threat Warnings"
                tier="demo"
                badgeLabel="DEMO / SIMULATION FEED"
                glow="amber"
              >
                {cycloneMeta ? (
                  <MaritimeMap cycloneMeta={cycloneMeta} />
                ) : (
                  <div className="h-[460px] flex items-center justify-center text-slate-500 font-mono text-xs">
                    Loading Geospatial Map Telemetry...
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Right Col: Telemetry Cards, Intensity & Charts (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* NEW: XGBoost Classification Module */}
              <ClassificationModule />

              <GlassCard
                title="IMD Cyclone Intensity Classification"
                subtitle="Dvorak T-Number Equivalent & Progression Scale"
                tier="demo"
                glow="amber"
              >
                {cycloneMeta && <IntensityBadge category={cycloneMeta.meteorological_data.imd_category} />}
              </GlassCard>

              <GlassCard
                title="Meteorological Telemetry Gauges"
                subtitle="Wind Speeds, Pressure Deficit, Peak Gusts & Heading"
                tier="demo"
                glow="emerald"
              >
                {cycloneMeta && <MeteorologyCards meteorology={cycloneMeta.meteorological_data} />}
              </GlassCard>

              <GlassCard
                title="Pressure vs. Wind Trend Progression"
                subtitle="Historical Track Time Series Analysis"
                tier="demo"
                glow="cyan"
              >
                {cycloneMeta && <PressureWindChart track={cycloneMeta.historical_track} />}
              </GlassCard>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: DISASTER RESPONSE & SOP ADVISORIES */}
        {/* ========================================================================= */}
        {currentView === 'advisory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Left Col: Full SOP Matrix & Stakeholder Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <GlassCard
                title="Automated AI Disaster-Response Command Briefing"
                subtitle="NDRF & SDMA Rescue Deployment • Port Danger Signals • Coastal SOP Matrix"
                tier="demo"
                badgeLabel="LLM DECISION SUPPORT"
                glow="rose"
              >
                {advisory ? (
                  <DisasterAdvisoryPanel advisory={advisory} />
                ) : isLoadingInference ? (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-4 p-6">
                    <div className="relative flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-rose-500 animate-[spin_1s_linear_infinite] absolute"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-b-rose-400 animate-[spin_1.5s_linear_infinite_reverse] absolute"></div>
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-4 text-center">
                      <span className="text-slate-700 font-bold tracking-wider animate-pulse">GENERATING AI RESPONSE BRIEFING...</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Vector Search (RAG)</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div> LLM Inference</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div> Formatting SOPs</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-2 p-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <ShieldAlert className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
                    <span className="text-slate-700 font-bold text-sm tracking-widest uppercase">All is Good</span>
                    <span className="text-slate-400 text-center max-w-xs">No active cyclone threats detected in current frame. Awaiting new satellite imagery to generate briefings.</span>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Right Col: Storm Status & Emergency Protocol Summary (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <GlassCard
                title="Current Alert & Hazard Level"
                subtitle="National Disaster Management Framework Classification"
                tier="demo"
                glow="rose"
              >
                {cycloneMeta && (
                  <div className="flex flex-col gap-4">
                    <IntensityBadge category={cycloneMeta.meteorological_data.imd_category} />
                    <MeteorologyCards meteorology={cycloneMeta.meteorological_data} />
                  </div>
                )}
              </GlassCard>

              <GlassCard
                title="Emergency Command Hotline Directives"
                subtitle="Standard Operating Procedure (SOP) Protocols"
                tier="implemented"
                glow="none"
              >
                <div className="flex flex-col gap-3 font-mono text-xs text-slate-600">
                  <div className="p-3 bg-white border border-slate-300 flex flex-col gap-1">
                    <span className="text-slate-800 font-bold">1. NDRF Operational Mobilization:</span>
                    <p className="text-slate-600 text-xs">Deploy pre-allocated self-contained battalions equipped with satellite phones, tree cutters, and inflatable boats.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-300 flex flex-col gap-1">
                    <span className="text-slate-800 font-bold">2. Maritime & Port Signaling:</span>
                    <p className="text-slate-600 text-xs">Hoist Danger Signal No. VIII/IX at all major ports. Halt outer anchorage movement immediately.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-300 flex flex-col gap-1">
                    <span className="text-slate-800 font-bold">3. Public Broadcast & Coastal Evacuation:</span>
                    <p className="text-slate-600 text-xs">Issue multi-channel SMS alerts via Common Alerting Protocol (CAP) for low-lying coastal blocks.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

      </main>

      {/* Master Authority Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-sm font-mono text-slate-600 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span className="text-slate-800 font-bold">SIH-26070 PROTOTYPE</span>
          <span className="px-2 text-slate-300">|</span>
          <span className="text-slate-500">Tropical Cyclone Identification & Maritime Decision Support</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Model: <strong className="text-slate-700">YOLO11 v1.0</strong></span>
          <span className="text-slate-300">•</span>
          <span>Basin: <strong className="text-slate-700">North Indian Ocean</strong></span>
          <span className="text-slate-300">•</span>
          <span>Architecture: <strong className="text-slate-700">3-Tier Separation</strong></span>
        </div>
      </footer>

      {/* Modals */}
      <ModelIntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
      />

      <RawJsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        detection={detection}
      />

      <PhaseIIRoadmapModal
        isOpen={isPhaseIIModalOpen}
        onClose={() => setIsPhaseIIModalOpen(false)}
      />
    </div>
  );
};
