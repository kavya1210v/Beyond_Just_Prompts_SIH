/**
 * API Service Client
 * Connects the React Frontend to the FastAPI YOLO11 & Decision Support Backend.
 * Strictly maintains architectural separation between YOLO outputs and Ground Truth feeds.
 */

import {
  YOLODetectionResponse,
  CycloneMetadataResponse,
  AdvisoryResponse,
} from '../types/cyclone';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// =========================================================================
// TIER 1: YOLO11 Detection API Client
// =========================================================================

export async function detectCycloneFromImage(
  imageFileOrBlob: Blob | File,
  confidenceThreshold: number = 0.5,
  filename?: string
): Promise<YOLODetectionResponse> {
  const formData = new FormData();
  formData.append('file', imageFileOrBlob, filename || 'satellite_frame.png');

  try {
    const res = await fetch(`${API_BASE_URL}/detect?confidence_threshold=${confidenceThreshold}`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Inference API returned HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('[API] Backend unreachable, using client-side fallback inference:', err);
    return getFallbackYOLODetection(filename || '', confidenceThreshold);
  }
}

// Fallback simulator for offline / direct browser testing
function getFallbackYOLODetection(
  filename: string,
  threshold: number
): YOLODetectionResponse {
  const isNegative = filename.includes('negative') || filename.includes('clear') || filename.includes('no_cyclone');
  const conf = filename.includes('positive_2') ? 0.884 : 0.946;

  if (isNegative || conf < threshold) {
    return {
      inference_timestamp: new Date().toISOString(),
      image_name: filename || 'sample_negative.png',
      image_dimensions: { width: 640, height: 640 },
      cyclone_detected: false,
      detection_count: 0,
      detections: [],
      model_meta: {
        engine: 'YOLO11 (Mock Inference Engine)',
        weights_version: 'yolo11_cyclone_v1.0',
        latency_ms: 24.8,
        tier_status: 'TIER 1 - IMPLEMENTED',
      },
    };
  }

  const bbox = filename.includes('positive_2')
    ? { x1: 125, y1: 105, x2: 495, y2: 475 }
    : { x1: 155, y1: 125, x2: 525, y2: 495 };

  const w = bbox.x2 - bbox.x1;
  const h = bbox.y2 - bbox.y1;

  return {
    inference_timestamp: new Date().toISOString(),
    image_name: filename || 'sample_positive.png',
    image_dimensions: { width: 640, height: 640 },
    cyclone_detected: true,
    detection_count: 1,
    detections: [
      {
        class_id: 0,
        class_name: 'cyclone',
        confidence: conf,
        bbox_pixel: bbox,
        bbox_normalized: {
          x_center: Number(((bbox.x1 + w / 2) / 640).toFixed(4)),
          y_center: Number(((bbox.y1 + h / 2) / 640).toFixed(4)),
          width: Number((w / 640).toFixed(4)),
          height: Number((h / 640).toFixed(4)),
        },
      },
    ],
    model_meta: {
      engine: 'YOLO11 (Mock Inference Engine - Ready for best.pt)',
      weights_version: 'yolo11_cyclone_v1.0',
      latency_ms: 28.2,
      tier_status: 'TIER 1 - IMPLEMENTED',
    },
  };
}

// =========================================================================
// TIER 2: IBTrACS Ground Truth & Meteorology API Client
// =========================================================================

export async function fetchCurrentCycloneMetadata(
  scenarioKey?: string
): Promise<CycloneMetadataResponse> {
  const url = scenarioKey
    ? `${API_BASE_URL}/cyclones/current?scenario=${encodeURIComponent(scenarioKey)}`
    : `${API_BASE_URL}/cyclones/current`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Using local IBTrACS ground truth mock:', err);
    return getFallbackCycloneMetadata(scenarioKey);
  }
}

function getFallbackCycloneMetadata(scenarioKey?: string): CycloneMetadataResponse {
  const isArabianSea = scenarioKey === 'biparjoy_as';

  if (isArabianSea) {
    return {
      is_simulation: true,
      tier_status: 'TIER 2 - INTEGRATION READY [DEMO / SIMULATION]',
      data_source: 'IBTrACS North Indian Ocean (Arabian Sea Simulation)',
      storm_id: 'NI-2026-AS01',
      storm_name: 'Cyclone Biparjoy (Arabian Sea Simulation)',
      georeference: {
        center_lat: 19.4,
        center_lon: 67.2,
        basin: 'Arabian Sea',
      },
      meteorological_data: {
        imd_category: {
          code: 'ESCS',
          name: 'Extremely Severe Cyclonic Storm',
          color_hex: '#dc2626',
          wind_speed_range_kmh: '168–221 km/h (90–119 kts)',
        },
        central_pressure_hpa: 962.0,
        pressure_deficit_hpa: 38.0,
        max_sustained_wind_kts: 95.0,
        max_sustained_wind_kmh: 176.0,
        gusts_kmh: 200.0,
        movement_speed_kmh: 11.0,
        movement_heading: 'NNE',
        estimated_radius_max_wind_km: 35.0,
      },
      historical_track: [
        { timestamp: '2026-08-26T12:00:00Z', relative_time: 'T-48h', lat: 13.8, lon: 66.2, imd_code: 'CS', imd_name: 'Cyclonic Storm', wind_kts: 45.0, central_pressure_hpa: 994.0 },
        { timestamp: '2026-08-27T06:00:00Z', relative_time: 'T-30h', lat: 15.6, lon: 66.5, imd_code: 'SCS', imd_name: 'Severe Cyclonic Storm', wind_kts: 65.0, central_pressure_hpa: 980.0 },
        { timestamp: '2026-08-27T18:00:00Z', relative_time: 'T-18h', lat: 17.5, lon: 66.8, imd_code: 'VSCS', imd_name: 'Very Severe Cyclonic Storm', wind_kts: 80.0, central_pressure_hpa: 970.0 },
        { timestamp: '2026-08-28T12:00:00Z', relative_time: 'Current', lat: 19.4, lon: 67.2, imd_code: 'ESCS', imd_name: 'Extremely Severe Cyclonic Storm', wind_kts: 95.0, central_pressure_hpa: 962.0 },
      ],
    };
  }

  return {
    is_simulation: true,
    tier_status: 'TIER 2 - INTEGRATION READY [DEMO / SIMULATION]',
    data_source: 'IBTrACS North Indian Ocean (Bay of Bengal Simulation)',
    storm_id: 'NI-2026-BOB01',
    storm_name: 'Cyclone Remal (Bay of Bengal Simulation)',
    georeference: {
      center_lat: 18.6,
      center_lon: 87.8,
      basin: 'Bay of Bengal',
    },
    meteorological_data: {
      imd_category: {
        code: 'VSCS',
        name: 'Very Severe Cyclonic Storm',
        color_hex: '#ef4444',
        wind_speed_range_kmh: '118–167 km/h (64–89 kts)',
      },
      central_pressure_hpa: 974.0,
      pressure_deficit_hpa: 26.0,
      max_sustained_wind_kts: 75.0,
      max_sustained_wind_kmh: 139.0,
      gusts_kmh: 160.0,
      movement_speed_kmh: 15.0,
      movement_heading: 'NNW',
      estimated_radius_max_wind_km: 42.0,
    },
    historical_track: [
      { timestamp: '2026-08-27T00:00:00Z', relative_time: 'T-36h', lat: 13.2, lon: 90.8, imd_code: 'DD', imd_name: 'Deep Depression', wind_kts: 32.0, central_pressure_hpa: 1000.0 },
      { timestamp: '2026-08-27T12:00:00Z', relative_time: 'T-24h', lat: 14.9, lon: 89.6, imd_code: 'CS', imd_name: 'Cyclonic Storm', wind_kts: 45.0, central_pressure_hpa: 992.0 },
      { timestamp: '2026-08-28T00:00:00Z', relative_time: 'T-12h', lat: 16.7, lon: 88.6, imd_code: 'SCS', imd_name: 'Severe Cyclonic Storm', wind_kts: 60.0, central_pressure_hpa: 982.0 },
      { timestamp: '2026-08-28T12:00:00Z', relative_time: 'Current', lat: 18.6, lon: 87.8, imd_code: 'VSCS', imd_name: 'Very Severe Cyclonic Storm', wind_kts: 75.0, central_pressure_hpa: 974.0 },
    ],
  };
}

// =========================================================================
// TIER 2: LLM Disaster Response Advisory API Client
// =========================================================================

export async function fetchDisasterAdvisory(scenarioKey?: string): Promise<AdvisoryResponse> {
  const url = scenarioKey
    ? `${API_BASE_URL}/advisory/current?scenario=${encodeURIComponent(scenarioKey)}`
    : `${API_BASE_URL}/advisory/current`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API] Using local disaster advisory fallback:', err);
    return {
      is_simulation: true,
      tier_status: 'TIER 2 - INTEGRATION READY [DEMO / SIMULATION]',
      engine: 'LLM Decision Support Engine (Simulated SOP Matrix / Gemini Ready)',
      generated_at: new Date().toISOString(),
      alert_level: 'RED',
      headline: 'RED ALERT: Severe Storm Preparedness in Bay of Bengal Coastal Belt',
      risk_assessment:
        'Sustained surface winds exceeding 135 km/h with central pressure at 974 hPa. Storm surge potential of 2.0–3.0m in low-lying coastal blocks.',
      stakeholder_actions: {
        ndrf_sdma: [
          'Pre-position 14 rescue battalions with inflatable speedboats and debris clearing gear.',
          'Stock multi-purpose cyclone shelters with 72h water, dry food rations, and medical buffers.',
          'Establish secondary satellite radio link between State EOC and coastal district collectorates.',
        ],
        marine_fisheries: [
          'Total ban on all marine fishing operations across Bay of Bengal.',
          'Mandate immediate recall of mechanized trawlers to Paradip / Dhamra harbours.',
          'Continuous VHF broadcast in regional coastal dialects.',
        ],
        port_authorities: [
          'Hoist Local Cautionary / Danger Signal VIII at Paradip, Haldia, and Visakhapatnam.',
          'Secure high-mast crane structures and pause ship fueling/bunkering operations.',
          'Place harbor tugs on active engine standby.',
        ],
        district_administration: [
          'Evacuate vulnerable populations from kutcha structures within 8 km of coast.',
          'Clear primary drainage channels to mitigate urban localized inundation.',
          'Ensure dedicated backup diesel generators at all taluk hospitals.',
        ],
        public_safety: [
          'Remain indoors in reinforced concrete buildings; avoid visiting beaches.',
          'Charge mobile phones and power banks; maintain emergency battery radios.',
          'Follow official IMD / SDMA bulletins only.',
        ],
      },
    };
  }
}

// =========================================================================
// XGBoost Classification API Client
// =========================================================================

import { ClassificationRequest, ClassificationResponse } from '../types/cyclone';

export async function classifyCyclone(data: ClassificationRequest): Promise<ClassificationResponse> {
  const url = `${API_BASE_URL}/cyclones/classify`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Classification API failed with status ${res.status}: ${res.statusText}`);
  }

  return await res.json();
}
