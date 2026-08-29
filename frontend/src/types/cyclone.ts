/**
 * Shared TypeScript Definitions
 * Strictly segregated into Tier 1 (Implemented YOLO11), Tier 2 (Integration Ready / Demo), and Tier 3 (Phase II)
 */

// ==========================================
// TIER 1: IMPLEMENTED (YOLO11 Object Detection)
// ==========================================

export interface BoundingBoxPixel {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface BoundingBoxNormalized {
  x_center: number;
  y_center: number;
  width: number;
  height: number;
}

export interface DetectionObject {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox_pixel: BoundingBoxPixel;
  bbox_normalized: BoundingBoxNormalized;
}

export interface ModelMeta {
  engine: string;
  weights_version: string;
  latency_ms: number;
  tier_status: string;
}

export interface YOLODetectionResponse {
  inference_timestamp: string;
  image_name?: string;
  image_dimensions: { width: number; height: number };
  cyclone_detected: boolean;
  detection_count: number;
  detections: DetectionObject[];
  model_meta: ModelMeta;
}

export interface SatelliteSampleFrame {
  id: string;
  filename: string;
  label: string;
  state: 'cyclone-positive' | 'cyclone-negative';
  dimensions: string;
  preview_url: string;
}

// ==========================================
// TIER 2: INTEGRATION READY [DEMO / SIMULATION]
// ==========================================

export interface GeoCoordinates {
  center_lat: number;
  center_lon: number;
  basin: string;
}

export interface IMDCategoryInfo {
  code: string;
  name: string;
  color_hex: string;
  wind_speed_range_kmh: string;
}

export interface MeteorologicalGroundTruth {
  imd_category: IMDCategoryInfo;
  central_pressure_hpa: number;
  pressure_deficit_hpa: number;
  max_sustained_wind_kts: number;
  max_sustained_wind_kmh: number;
  gusts_kmh: number;
  movement_speed_kmh: number;
  movement_heading: string;
  estimated_radius_max_wind_km: number;
}

export interface TrackPoint {
  timestamp: string;
  relative_time: string;
  lat: number;
  lon: number;
  imd_code: string;
  imd_name: string;
  wind_kts: number;
  central_pressure_hpa: number;
}

export interface CycloneMetadataResponse {
  is_simulation: boolean;
  tier_status: string;
  data_source: string;
  storm_id: string;
  storm_name: string;
  georeference: GeoCoordinates;
  meteorological_data: MeteorologicalGroundTruth;
  historical_track: TrackPoint[];
}

export interface StakeholderAdvisories {
  ndrf_sdma: string[];
  marine_fisheries: string[];
  port_authorities: string[];
  district_administration: string[];
  public_safety: string[];
}

export interface AdvisoryResponse {
  is_simulation: boolean;
  tier_status: string;
  engine: string;
  generated_at: string;
  alert_level: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  headline: string;
  risk_assessment: string;
  stakeholder_actions: StakeholderAdvisories;
}

export interface ClassificationRequest {
  lat: number;
  lon: number;
  pressure: number;
  wind: number;
  pressure_drop: number;
  ci_no: number;
  step: number;
  basin_ARB: number;
  basin_BOB: number;
  basin_LAND: number;
}

export interface ClassificationResponse {
  predicted_category: string;
  confidence: number;
  imd_info: IMDCategoryInfo;
}
