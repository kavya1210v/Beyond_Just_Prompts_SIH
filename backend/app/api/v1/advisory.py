"""
Tier 2 - INTEGRATION READY API
Disaster Response Recommendation Router
"""

from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.advisory import AdvisoryResponse
from app.services.advisory_service import advisory_service

router = APIRouter(prefix="/advisory", tags=["Tier 2 - Disaster Response [DEMO / SIMULATION]"])


@router.get("/current", response_model=AdvisoryResponse, summary="Get disaster response SOP recommendations")
def get_current_disaster_advisory(
    scenario: Optional[str] = Query(None, description="Scenario ID (e.g. remal_bob, biparjoy_as)")
):
    """
    Tier 2 Decision Support Endpoint:
    Returns role-based emergency action items (NDRF, Port Authorities, Fishermen, Civil Admin).
    """
    return advisory_service.generate_advisory(scenario)
