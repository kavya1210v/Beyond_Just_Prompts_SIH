"""
Tier 2 - INTEGRATION READY [DEMO / SIMULATION]
IBTrACS Ground Truth & Georeferenced Meteorological Schemas.
Explicitly decoupled from YOLO bounding-box detection outputs.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class GeoCoordinates(BaseModel):
    center_lat: float = Field(..., description="Storm center latitude (North positive)")
    center_lon: float = Field(..., description="Storm center longitude (East positive)")
    basin: str = Field("Bay of Bengal", description="Ocean Basin (Bay of Bengal / Arabian Sea)")


class IMDCategoryInfo(BaseModel):
    code: str = Field(..., description="IMD Code e.g. D, DD, CS, SCS, VSCS, ESCS, SuCS")
    name: str = Field(..., description="Full IMD Category Name")
    color_hex: str = Field(..., description="Standard visual alert color")
    wind_speed_range_kmh: str = Field(..., description="Associated 3-min sustained wind range")


class MeteorologicalGroundTruth(BaseModel):
    imd_category: IMDCategoryInfo
    central_pressure_hpa: float = Field(..., description="Estimated central atmospheric pressure in hPa")
    pressure_deficit_hpa: float = Field(..., description="Pressure drop below ambient in hPa")
    max_sustained_wind_kts: float = Field(..., description="Max sustained surface wind in knots")
    max_sustained_wind_kmh: float = Field(..., description="Max sustained surface wind in km/h")
    gusts_kmh: float = Field(..., description="Estimated peak wind gusts in km/h")
    movement_speed_kmh: float = Field(..., description="Translational movement speed in km/h")
    movement_heading: str = Field(..., description="Direction of translation (e.g. NNW, NNE)")
    estimated_radius_max_wind_km: float = Field(..., description="Radius of maximum winds in km")


class TrackPoint(BaseModel):
    timestamp: str = Field(..., description="ISO timestamp of observation")
    relative_time: str = Field(..., description="Human relative label (e.g. T-36h, T-24h, T-12h, Current)")
    lat: float
    lon: float
    imd_code: str
    imd_name: str
    wind_kts: float
    central_pressure_hpa: float


class CycloneMetadataResponse(BaseModel):
    is_simulation: bool = Field(True, description="Strictly flag all demo/mock data")
    tier_status: str = Field("TIER 2 - INTEGRATION READY [DEMO / SIMULATION]")
    data_source: str = Field("IBTrACS North Indian Ocean (Simulated Ground Truth)")
    storm_id: str = Field("NI-2026-01B")
    storm_name: str = Field("Cyclone Remal (Simulated)")
    georeference: GeoCoordinates
    meteorological_data: MeteorologicalGroundTruth
    historical_track: List[TrackPoint]

class ClassificationRequest(BaseModel):
    lat: float
    lon: float
    pressure: float
    wind: float
    pressure_drop: float
    ci_no: float
    step: int
    basin_ARB: int
    basin_BOB: int
    basin_LAND: int

class ClassificationResponse(BaseModel):
    predicted_category: str
    confidence: float
    imd_info: IMDCategoryInfo
