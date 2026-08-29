"""
Tier 2 - INTEGRATION READY API
IBTrACS Ground Truth & Georeferenced Cyclone Metadata
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.cyclone import CycloneMetadataResponse
from app.services.ibtracs_service import ibtracs_service

router = APIRouter(prefix="/cyclones", tags=["Tier 2 - IBTrACS Ground Truth [DEMO / SIMULATION]"])


@router.get("/current", response_model=CycloneMetadataResponse, summary="Get active cyclone ground truth & track")
def get_current_cyclone_ground_truth(
    scenario: Optional[str] = Query(None, description="Scenario ID (e.g. remal_bob, biparjoy_as)")
):
    """
    Tier 2 Ground Truth Endpoint:
    Returns georeferenced coordinates (Lat/Lon), historical track, central pressure,
    and IMD category from simulated IBTrACS datasets.
    """
    return ibtracs_service.get_current_cyclone_metadata(scenario)


@router.get("/scenarios", summary="List available simulated cyclone scenarios")
def list_scenarios():
    return {"scenarios": ibtracs_service.list_available_scenarios()}


@router.post("/select/{scenario_key}", response_model=CycloneMetadataResponse, summary="Switch active scenario")
def select_scenario(scenario_key: str):
    scenarios = [s["key"] for s in ibtracs_service.list_available_scenarios()]
    if scenario_key not in scenarios:
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario_key}' not found. Available: {scenarios}")
    ibtracs_service.set_active_storm(scenario_key)
    return ibtracs_service.get_current_cyclone_metadata(scenario_key)

from app.schemas.cyclone import ClassificationRequest, ClassificationResponse
from app.services.classification_service import classification_service

@router.post("/classify", response_model=ClassificationResponse, summary="Predict cyclone category using XGBoost model")
def classify_cyclone(request: ClassificationRequest):
    """
    Takes 10 meteorological features and predicts the IMD Category of the cyclone.
    """
    try:
        return classification_service.predict(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
