"""
Tier 2 - INTEGRATION READY [DEMO / SIMULATION]
IBTrACS Ground-Truth & Meteorological Telemetry Service.
Provides georeferenced historical tracks, central pressures, and IMD categories.
Decoupled completely from computer vision / YOLO object detection.
"""

from typing import List, Dict, Optional
from app.schemas.cyclone import (
    CycloneMetadataResponse,
    GeoCoordinates,
    IMDCategoryInfo,
    MeteorologicalGroundTruth,
    TrackPoint,
)

# IMD Tropical Cyclone Scale Standard Reference
IMD_CATEGORIES = {
    "D": IMDCategoryInfo(code="D", name="Depression", color_hex="#3b82f6", wind_speed_range_kmh="31–49 km/h (17–27 kts)"),
    "DD": IMDCategoryInfo(code="DD", name="Deep Depression", color_hex="#06b6d4", wind_speed_range_kmh="50–61 km/h (28–33 kts)"),
    "CS": IMDCategoryInfo(code="CS", name="Cyclonic Storm", color_hex="#eab308", wind_speed_range_kmh="62–88 km/h (34–47 kts)"),
    "SCS": IMDCategoryInfo(code="SCS", name="Severe Cyclonic Storm", color_hex="#f97316", wind_speed_range_kmh="89–117 km/h (48–63 kts)"),
    "VSCS": IMDCategoryInfo(code="VSCS", name="Very Severe Cyclonic Storm", color_hex="#ef4444", wind_speed_range_kmh="118–167 km/h (64–89 kts)"),
    "ESCS": IMDCategoryInfo(code="ESCS", name="Extremely Severe Cyclonic Storm", color_hex="#dc2626", wind_speed_range_kmh="168–221 km/h (90–119 kts)"),
    "SuCS": IMDCategoryInfo(code="SuCS", name="Super Cyclonic Storm", color_hex="#9333ea", wind_speed_range_kmh="≥222 km/h (≥120 kts)"),
}

# Pre-packaged verified North Indian Ocean ground truth profiles
SIMULATED_STORMS: Dict[str, dict] = {
    "remal_bob": {
        "storm_id": "NI-2026-BOB01",
        "storm_name": "Cyclone Remal (Bay of Bengal Simulation)",
        "basin": "Bay of Bengal",
        "current_lat": 18.6,
        "current_lon": 87.8,
        "category_code": "VSCS",
        "central_pressure_hpa": 974.0,
        "pressure_deficit_hpa": 26.0,
        "max_sustained_wind_kts": 75.0,
        "max_sustained_wind_kmh": 139.0,
        "gusts_kmh": 160.0,
        "movement_speed_kmh": 15.0,
        "movement_heading": "NNW",
        "estimated_radius_max_wind_km": 42.0,
        "track": [
            {"timestamp": "2026-08-27T00:00:00Z", "relative_time": "T-36h", "lat": 13.2, "lon": 90.8, "imd_code": "DD", "imd_name": "Deep Depression", "wind_kts": 32.0, "central_pressure_hpa": 1000.0},
            {"timestamp": "2026-08-27T12:00:00Z", "relative_time": "T-24h", "lat": 14.9, "lon": 89.6, "imd_code": "CS", "imd_name": "Cyclonic Storm", "wind_kts": 45.0, "central_pressure_hpa": 992.0},
            {"timestamp": "2026-08-28T00:00:00Z", "relative_time": "T-12h", "lat": 16.7, "lon": 88.6, "imd_code": "SCS", "imd_name": "Severe Cyclonic Storm", "wind_kts": 60.0, "central_pressure_hpa": 982.0},
            {"timestamp": "2026-08-28T12:00:00Z", "relative_time": "Current", "lat": 18.6, "lon": 87.8, "imd_code": "VSCS", "imd_name": "Very Severe Cyclonic Storm", "wind_kts": 75.0, "central_pressure_hpa": 974.0},
        ]
    },
    "biparjoy_as": {
        "storm_id": "NI-2026-AS01",
        "storm_name": "Cyclone Biparjoy (Arabian Sea Simulation)",
        "basin": "Arabian Sea",
        "current_lat": 19.4,
        "current_lon": 67.2,
        "category_code": "ESCS",
        "central_pressure_hpa": 962.0,
        "pressure_deficit_hpa": 38.0,
        "max_sustained_wind_kts": 95.0,
        "max_sustained_wind_kmh": 176.0,
        "gusts_kmh": 200.0,
        "movement_speed_kmh": 11.0,
        "movement_heading": "NNE",
        "estimated_radius_max_wind_km": 35.0,
        "track": [
            {"timestamp": "2026-08-26T12:00:00Z", "relative_time": "T-48h", "lat": 13.8, "lon": 66.2, "imd_code": "CS", "imd_name": "Cyclonic Storm", "wind_kts": 45.0, "central_pressure_hpa": 994.0},
            {"timestamp": "2026-08-27T06:00:00Z", "relative_time": "T-30h", "lat": 15.6, "lon": 66.5, "imd_code": "SCS", "imd_name": "Severe Cyclonic Storm", "wind_kts": 65.0, "central_pressure_hpa": 980.0},
            {"timestamp": "2026-08-27T18:00:00Z", "relative_time": "T-18h", "lat": 17.5, "lon": 66.8, "imd_code": "VSCS", "imd_name": "Very Severe Cyclonic Storm", "wind_kts": 80.0, "central_pressure_hpa": 970.0},
            {"timestamp": "2026-08-28T12:00:00Z", "relative_time": "Current", "lat": 19.4, "lon": 67.2, "imd_code": "ESCS", "imd_name": "Extremely Severe Cyclonic Storm", "wind_kts": 95.0, "central_pressure_hpa": 962.0},
        ]
    }
}


class IBTrACSService:
    def __init__(self):
        self.active_storm_key = "remal_bob"

    def set_active_storm(self, key: str):
        if key in SIMULATED_STORMS:
            self.active_storm_key = key

    def get_current_cyclone_metadata(self, storm_key: Optional[str] = None) -> CycloneMetadataResponse:
        key = storm_key or self.active_storm_key
        storm = SIMULATED_STORMS.get(key, SIMULATED_STORMS["remal_bob"])

        cat_info = IMD_CATEGORIES.get(storm["category_code"], IMD_CATEGORIES["VSCS"])

        track_points = [
            TrackPoint(
                timestamp=p["timestamp"],
                relative_time=p["relative_time"],
                lat=p["lat"],
                lon=p["lon"],
                imd_code=p["imd_code"],
                imd_name=p["imd_name"],
                wind_kts=p["wind_kts"],
                central_pressure_hpa=p["central_pressure_hpa"],
            )
            for p in storm["track"]
        ]

        return CycloneMetadataResponse(
            is_simulation=True,
            tier_status="TIER 2 - INTEGRATION READY [DEMO / SIMULATION]",
            data_source="IBTrACS North Indian Ocean (Ground Truth Feed Ready)",
            storm_id=storm["storm_id"],
            storm_name=storm["storm_name"],
            georeference=GeoCoordinates(
                center_lat=storm["current_lat"],
                center_lon=storm["current_lon"],
                basin=storm["basin"],
            ),
            meteorological_data=MeteorologicalGroundTruth(
                imd_category=cat_info,
                central_pressure_hpa=storm["central_pressure_hpa"],
                pressure_deficit_hpa=storm["pressure_deficit_hpa"],
                max_sustained_wind_kts=storm["max_sustained_wind_kts"],
                max_sustained_wind_kmh=storm["max_sustained_wind_kmh"],
                gusts_kmh=storm["gusts_kmh"],
                movement_speed_kmh=storm["movement_speed_kmh"],
                movement_heading=storm["movement_heading"],
                estimated_radius_max_wind_km=storm["estimated_radius_max_wind_km"],
            ),
            historical_track=track_points,
        )

    def list_available_scenarios(self) -> List[dict]:
        return [
            {"key": k, "name": v["storm_name"], "basin": v["basin"], "category": v["category_code"]}
            for k, v in SIMULATED_STORMS.items()
        ]


ibtracs_service = IBTrACSService()
