"""
Tier 2 - INTEGRATION READY [DEMO / SIMULATION]
Disaster Response Recommendation Schemas
Structured advisories for institutional stakeholders (NDRF, Ports, Fishermen, Civil Admin).
"""

from typing import List, Dict
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class StakeholderAdvisories(BaseModel):
    ndrf_sdma: List[str] = Field(..., description="Action items for NDRF & State Disaster Management Authorities")
    marine_fisheries: List[str] = Field(..., description="Action items for Fishermen, Coastal Boats & Marine Police")
    port_authorities: List[str] = Field(..., description="Action items for Major/Minor Ports & Maritime Boards")
    district_administration: List[str] = Field(..., description="Action items for District Magistrates & Evacuation Teams")
    public_safety: List[str] = Field(..., description="Public warnings, shelter guides & emergency helpline advisories")


class AdvisoryResponse(BaseModel):
    is_simulation: bool = Field(True, description="Strictly flag all mock/demo advisory data")
    tier_status: str = Field("TIER 2 - INTEGRATION READY [DEMO / SIMULATION]")
    engine: str = Field("LLM Decision Support Engine (Simulated Fallback / Gemini Ready)")
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    alert_level: str = Field("RED", description="IMD Warning Color: RED / ORANGE / YELLOW / GREEN")
    headline: str = Field(..., description="High-level operational briefing headline")
    risk_assessment: str = Field(..., description="Synoptic situation & impact vulnerability summary")
    stakeholder_actions: StakeholderAdvisories
